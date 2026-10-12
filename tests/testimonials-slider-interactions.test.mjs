import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

test("testimonial arrows, drag, dots, and touch scrolling wrap through hidden boundary slides", async () => {
  const source = await readFile(new URL("../playground/app.js", import.meta.url), "utf8");
  const start = source.indexOf('document.querySelectorAll("[data-testimonials-slider]")');
  const end = source.indexOf("\nconst mobileBottomBar", start);
  assert.ok(start >= 0 && end > start, "testimonial slider binding exists");

  const listeners = new Map();
  const dotClicks = [];
  const arrowClicks = [];
  const classes = new Set();
  const viewport = {
    scrollLeft: 0,
    clientWidth: 300,
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
    },
    addEventListener: (type, handler) => listeners.set(type, handler),
    setPointerCapture(id) { this.captured = id; },
    releasePointerCapture(id) { if (this.captured === id) this.captured = null; },
    getBoundingClientRect: () => ({ left: 0 }),
    scrollTo({ left }) { this.scrollLeft = left; },
  };
  const slides = [0, 120, 240, 360, 480].map((offsetLeft, index) => ({
    offsetLeft,
    dataset: { testimonialClone: index === 0 || index === 4 ? "true" : undefined },
    getBoundingClientRect: () => ({ left: offsetLeft - viewport.scrollLeft + 100, width: 100 }),
  }));
  const currentDots = [true, false, false];
  const dots = currentDots.map((_, index) => ({
    addEventListener: (_type, handler) => dotClicks.push(handler),
    setAttribute() { currentDots[index] = true; },
    removeAttribute() { currentDots[index] = false; },
  }));
  const arrows = [-1, 1].map((direction) => ({
    dataset: { testimonialDir: String(direction) },
    addEventListener: (_type, handler) => arrowClicks.push(handler),
  }));
  const section = {
    querySelector: () => viewport,
    querySelectorAll: (selector) => selector.includes("card") ? slides
      : selector.includes("testimonial-index") ? dots : arrows,
  };
  vm.runInNewContext(source.slice(start, end), {
    document: { querySelectorAll: () => [section] },
    window: {
      matchMedia: () => ({ matches: false }),
      requestAnimationFrame: (callback) => callback(),
      addEventListener() {},
      clearTimeout() {},
      setTimeout() { return 1; },
    },
  });
  assert.equal(viewport.scrollLeft, 120, "first real card starts centered");

  arrowClicks[0]();
  assert.equal(viewport.scrollLeft, 0, "previous from first moves to the last-card boundary");
  listeners.get("scrollend")();
  assert.equal(viewport.scrollLeft, 360, "boundary resets to the real last card");
  assert.deepEqual(currentDots, [false, false, true]);

  arrowClicks[1]();
  assert.equal(viewport.scrollLeft, 480, "next from last moves to the first-card boundary");
  listeners.get("scrollend")();
  assert.equal(viewport.scrollLeft, 120, "boundary resets to the real first card");
  assert.deepEqual(currentDots, [true, false, false]);

  let prevented = 0;
  const pointer = (clientX) => ({
    pointerType: "mouse",
    pointerId: 1,
    clientX,
    clientY: 100,
    button: 0,
    preventDefault() { prevented += 1; },
  });
  listeners.get("pointerdown")(pointer(250));
  listeners.get("pointermove")(pointer(180));
  assert.equal(prevented, 2);
  assert.equal(classes.has("is-dragging"), true);
  assert.equal(viewport.scrollLeft, 190);

  listeners.get("pointerup")(pointer(180));
  assert.equal(viewport.scrollLeft, 240);
  assert.equal(viewport.captured, null);
  assert.equal(classes.has("is-dragging"), false);

  dotClicks[2]();
  assert.equal(viewport.scrollLeft, 360);
  viewport.scrollLeft = 480;
  listeners.get("scroll")();
  listeners.get("scrollend")();
  assert.equal(viewport.scrollLeft, 120, "native swipe past last card wraps to the first");
  viewport.scrollLeft = 0;
  listeners.get("scroll")();
  listeners.get("scrollend")();
  assert.equal(viewport.scrollLeft, 360, "native swipe before first card wraps to the last");
  let keyPrevented = false;
  listeners.get("keydown")({ key: "ArrowRight", preventDefault() { keyPrevented = true; } });
  assert.equal(keyPrevented, true);
  assert.equal(viewport.scrollLeft, 480, "keyboard navigation also reaches the boundary slide");
  listeners.get("scrollend")();
  assert.equal(viewport.scrollLeft, 120);
  listeners.get("pointerdown")(pointer(180));
  listeners.get("pointermove")(pointer(250));
  listeners.get("pointerup")(pointer(250));
  assert.equal(viewport.scrollLeft, 0, "dragging right from the first reaches the last-card boundary");
  listeners.get("scrollend")();
  assert.equal(viewport.scrollLeft, 360);
  listeners.get("pointerdown")({ ...pointer(250), pointerType: "touch" });
  assert.equal(classes.has("is-dragging"), false, "touch retains native scroll snap");
  listeners.get("dragstart")({ preventDefault() { prevented += 1; } });
  assert.equal(prevented, 5, "images cannot initiate native dragging");
});
