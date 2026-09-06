import { pages } from "./pages/index.js";
import { renderPage } from "./components/render.js";

const app = document.querySelector("#app");
const reviewRequested = new URLSearchParams(window.location.search).get("notes") === "1";
const requestedPage = new URLSearchParams(window.location.search).get("page");
const cleanPath = window.location.pathname.replace(/\/+$/, "") || "/";
const pathPage = cleanPath === "/design" ? "blank" : null;
const pageKey = requestedPage || pathPage || app.dataset.page || "homepage";
const page = pages[pageKey] || pages.homepage;
const notesEnabled = reviewRequested && page.key !== "blank";

document.body.dataset.notes = String(notesEnabled);
document.body.dataset.page = page.key;
document.title = page.title;
app.replaceChildren(renderPage(page, { notesEnabled }));

const menuToggle = document.querySelector(".nav-menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("nav-links--open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "Close" : "Menu";
  });
}

const campaignHero = document.querySelector(".section--campaign-hero");
if (campaignHero) {
  const slides = [...campaignHero.querySelectorAll(".campaign-slide")];
  const dots = [...campaignHero.querySelectorAll("[data-campaign-index]")];
  const announcer = campaignHero.querySelector(".campaign-hero__announcer");
  const interval = Number(campaignHero.querySelector(".campaign-hero__stage")?.dataset.interval) || 7000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionMs = 780;
  let activeIndex = 0;
  let timer = null;
  let paused = reducedMotion;
  let transitionLock = false;
  let pendingIndex = null;
  let finishTimer = null;

  const motionClasses = [
    "is-moving",
    "is-enter-from-right",
    "is-enter-from-left",
    "is-exit-to-left",
    "is-exit-to-right",
  ];

  const stopAutoplay = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!paused) timer = window.setInterval(() => showSlide(activeIndex + 1), interval);
  };

  const clearMotionClasses = (slide) => {
    slide.classList.remove(...motionClasses);
  };

  const syncChrome = () => {
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
    const activeTitle = slides[activeIndex].getAttribute("aria-label") || "";
    if (announcer) announcer.textContent = activeTitle;
  };

  const applyInstant = (nextIndex) => {
    slides.forEach((slide, index) => {
      clearMotionClasses(slide);
      const isActive = index === nextIndex;
      slide.classList.toggle("is-active", isActive);
      slide.inert = !isActive;
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    activeIndex = nextIndex;
    syncChrome();
  };

  const finishTransition = (outgoing, incoming, onDone) => {
    if (finishTimer) {
      window.clearTimeout(finishTimer);
      finishTimer = null;
    }
    clearMotionClasses(outgoing);
    clearMotionClasses(incoming);
    incoming.classList.add("is-active");
    transitionLock = false;
    onDone?.();
  };

  const showSlide = (requestedIndex) => {
    const nextIndex = ((requestedIndex % slides.length) + slides.length) % slides.length;
    if (nextIndex === activeIndex) {
      startAutoplay();
      return;
    }

    if (transitionLock) {
      pendingIndex = nextIndex;
      return;
    }

    if (reducedMotion) {
      applyInstant(nextIndex);
      startAutoplay();
      return;
    }

    const outgoing = slides[activeIndex];
    const incoming = slides[nextIndex];
    const forwardDelta = (nextIndex - activeIndex + slides.length) % slides.length;
    const isForward = forwardDelta <= slides.length / 2;
    const enterClass = isForward ? "is-enter-from-right" : "is-enter-from-left";
    const exitClass = isForward ? "is-exit-to-left" : "is-exit-to-right";

    transitionLock = true;
    pendingIndex = null;
    activeIndex = nextIndex;
    syncChrome();

    clearMotionClasses(incoming);
    incoming.classList.add(enterClass);
    incoming.inert = false;
    incoming.setAttribute("aria-hidden", "false");

    outgoing.inert = true;
    outgoing.setAttribute("aria-hidden", "true");

    const runMotion = () => {
      outgoing.classList.add("is-moving", exitClass);
      outgoing.classList.remove("is-active");

      incoming.classList.add("is-moving", "is-active");
      incoming.classList.remove(enterClass);

      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        outgoing.removeEventListener("transitionend", onEnd);
        finishTransition(outgoing, incoming, () => {
          if (pendingIndex !== null) {
            const queued = pendingIndex;
            pendingIndex = null;
            showSlide(queued);
            return;
          }
          startAutoplay();
        });
      };

      const onEnd = (event) => {
        if (event.target !== outgoing || event.propertyName !== "transform") return;
        settle();
      };

      outgoing.addEventListener("transitionend", onEnd);
      finishTimer = window.setTimeout(settle, motionMs + 80);
    };

    // Double rAF so the enter park paint commits before transitions enable.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(runMotion);
    });

    startAutoplay();
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.campaignIndex)));
  });

  campaignHero.querySelectorAll("[data-campaign-dir]").forEach((arrow) => {
    arrow.addEventListener("click", () => {
      showSlide(activeIndex + Number(arrow.dataset.campaignDir));
    });
  });

  campaignHero.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  });

  campaignHero.addEventListener("mouseenter", stopAutoplay);
  campaignHero.addEventListener("mouseleave", startAutoplay);
  campaignHero.addEventListener("focusin", stopAutoplay);
  campaignHero.addEventListener("focusout", (event) => {
    if (!campaignHero.contains(event.relatedTarget)) startAutoplay();
  });

  startAutoplay();
}

document.querySelectorAll("[data-new-arrivals-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector("[data-new-arrivals-viewport]");
  const previous = carousel.querySelector('[data-new-arrivals-dir="-1"]');
  const next = carousel.querySelector('[data-new-arrivals-dir="1"]');
  const firstCard = carousel.querySelector(".design-new-arrivals__card");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const syncControls = () => {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth - 1;
    previous.disabled = viewport.scrollLeft <= 1;
    next.disabled = viewport.scrollLeft >= maxScroll;
  };

  const moveRail = (direction) => {
    const cardWidth = firstCard?.getBoundingClientRect().width || viewport.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(viewport.querySelector(".design-new-arrivals__track")).columnGap) || 0;
    viewport.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  previous.addEventListener("click", () => moveRail(-1));
  next.addEventListener("click", () => moveRail(1));
  viewport.addEventListener("scroll", syncControls, { passive: true });
  window.addEventListener("resize", syncControls);
  syncControls();

  carousel.querySelectorAll(".product-card__wishlist").forEach((button) => {
    button.addEventListener("click", () => {
      const pressed = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", pressed ? "false" : "true");
    });
  });

  carousel.querySelectorAll(".product-card__swatches").forEach((group) => {
    group.querySelectorAll(".product-card__swatch").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        group.querySelectorAll(".product-card__swatch").forEach((item) => {
          item.setAttribute("aria-pressed", item === swatch ? "true" : "false");
        });
      });
    });
  });
});

document.querySelectorAll("[data-testimonials-ticker]").forEach((section) => {
  const track = section.querySelector(".design-testimonials__track");
  const viewport = section.querySelector("[data-testimonials-viewport]");
  if (!track || !viewport) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const setRate = (rate) => {
    track.getAnimations().forEach((anim) => {
      anim.playbackRate = rate;
    });
  };

  viewport.addEventListener("pointerenter", () => setRate(0.2));
  viewport.addEventListener("pointerleave", () => setRate(1));
  viewport.addEventListener("focusin", () => setRate(0.2));
  viewport.addEventListener("focusout", (event) => {
    if (!viewport.contains(event.relatedTarget)) setRate(1);
  });
});

if (requestedPage && !pages[requestedPage]) {
  console.warn(`Unknown playground page: ${requestedPage}. Showing homepage.`);
}
