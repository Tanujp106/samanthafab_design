/**
 * Product gallery lightbox — FLIP morph open/close + click-to-zoom + cursor-follow pan.
 * Composite-only motion (transform/opacity) to avoid jank.
 */

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const MORPH_MS = 420;
const ZOOM_MS = 220;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const TAP_SLOP_PX = 8;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Center-origin FLIP invert: translate delta between centers + scale to match first size. */
function invertFlip(first, last) {
  return {
    x: first.left + first.width / 2 - (last.left + last.width / 2),
    y: first.top + first.height / 2 - (last.top + last.height / 2),
    sx: first.width / last.width,
    sy: first.height / last.height,
  };
}

export function bindProductLightbox(root = document) {
  const gallery = root.querySelector("[data-product-gallery]");
  if (!gallery || gallery.dataset.lightboxBound === "true") return;
  gallery.dataset.lightboxBound = "true";

  const thumbs = [...gallery.querySelectorAll("[data-pdp-lightbox]")];
  if (!thumbs.length) return;

  let overlay = null;
  let stageImg = null;
  let scrim = null;
  let stage = null;
  let activeThumb = null;
  let open = false;
  let morphing = false;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let baseRect = { width: 0, height: 0, left: 0, top: 0 };
  let pointers = new Map();
  let pinchStartDist = 0;
  let dragOrigin = null;
  let pointerDownAt = null;
  let movedBeyondSlop = false;
  let morphTimer = 0;
  let cursorFollow = false;

  function maxPan() {
    return {
      x: ((zoom - 1) * baseRect.width) / 2,
      y: ((zoom - 1) * baseRect.height) / 2,
    };
  }

  function clampPan() {
    const { x: maxX, y: maxY } = maxPan();
    panX = clamp(panX, -maxX, maxX);
    panY = clamp(panY, -maxY, maxY);
  }

  function applyZoomTransform() {
    if (!stageImg) return;
    stageImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;
  }

  function setZoomedClass() {
    overlay?.classList.toggle("is-zoomed", zoom > 1.01);
  }

  function resetZoom({ animate = false } = {}) {
    zoom = 1;
    panX = 0;
    panY = 0;
    cursorFollow = false;
    if (stageImg) {
      stageImg.style.transition = animate && !prefersReducedMotion()
        ? `transform ${ZOOM_MS}ms ${EASE_OUT}`
        : "none";
    }
    applyZoomTransform();
    setZoomedClass();
  }

  /** Pan so the point under the cursor stays related to viewport position (explore by moving). */
  function panTowardCursor(clientX, clientY) {
    if (zoom <= 1.01) return;
    const { x: maxX, y: maxY } = maxPan();
    if (maxX <= 0 && maxY <= 0) return;
    const nx = (clientX / window.innerWidth) * 2 - 1;
    const ny = (clientY / window.innerHeight) * 2 - 1;
    panX = clamp(-nx * maxX, -maxX, maxX);
    panY = clamp(-ny * maxY, -maxY, maxY);
    stageImg.style.transition = "none";
    applyZoomTransform();
  }

  function zoomToward(clientX, clientY, nextZoom) {
    const next = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    if (next === zoom) return;

    // Base (unscaled) center in viewport coords.
    const centerX = baseRect.left + baseRect.width / 2 + panX;
    const centerY = baseRect.top + baseRect.height / 2 + panY;
    const ox = clientX - centerX;
    const oy = clientY - centerY;
    const ratio = next / zoom;
    panX = panX + ox * (1 - ratio);
    panY = panY + oy * (1 - ratio);
    zoom = next;
    if (zoom <= 1.01) {
      zoom = 1;
      panX = 0;
      panY = 0;
      cursorFollow = false;
    } else {
      clampPan();
      cursorFollow = hasFinePointer();
    }

    if (!prefersReducedMotion()) {
      stageImg.style.transition = `transform ${ZOOM_MS}ms ${EASE_OUT}`;
    } else {
      stageImg.style.transition = "none";
    }
    applyZoomTransform();
    setZoomedClass();
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "product-lightbox";
    overlay.dataset.productLightbox = "true";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Product image viewer");
    overlay.hidden = true;

    scrim = document.createElement("button");
    scrim.type = "button";
    scrim.className = "product-lightbox__scrim";
    scrim.setAttribute("aria-label", "Close image viewer");

    stage = document.createElement("div");
    stage.className = "product-lightbox__stage";

    stageImg = document.createElement("img");
    stageImg.className = "product-lightbox__image";
    stageImg.alt = "";
    stageImg.draggable = false;
    stageImg.decode?.()?.catch?.(() => {});

    const close = document.createElement("button");
    close.type = "button";
    close.className = "product-lightbox__close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`;

    const hint = document.createElement("p");
    hint.className = "product-lightbox__hint";
    hint.textContent = "Click image to zoom · move to pan · outside to close";

    stage.append(stageImg);
    overlay.append(scrim, stage, close, hint);
    document.body.append(overlay);

    scrim.addEventListener("click", (event) => {
      event.preventDefault();
      if (!open || morphing) return;
      if (zoom > 1.01) {
        resetZoom({ animate: true });
        return;
      }
      closeLightbox();
    });
    close.addEventListener("click", () => closeLightbox());

    // Click / tap on the image toggles a single zoom level toward the pointer.
    stageImg.addEventListener("click", (event) => {
      if (!open || morphing) return;
      if (movedBeyondSlop) return;
      event.stopPropagation();
      const next = zoom > 1.01 ? MIN_ZOOM : MAX_ZOOM;
      zoomToward(event.clientX, event.clientY, next);
    });

    // Cursor-follow pan while zoomed (desktop).
    stage.addEventListener("pointermove", (event) => {
      if (!open || morphing) return;
      if (cursorFollow && zoom > 1.01 && pointers.size === 0 && event.pointerType === "mouse") {
        panTowardCursor(event.clientX, event.clientY);
      }
    });

    stage.addEventListener("wheel", (event) => {
      if (!open || morphing) return;
      event.preventDefault();
      const next = event.deltaY > 0 ? MIN_ZOOM : MAX_ZOOM;
      if ((next === MIN_ZOOM && zoom <= 1.01) || (next === MAX_ZOOM && zoom >= MAX_ZOOM - 0.01)) return;
      zoomToward(event.clientX, event.clientY, next);
    }, { passive: false });

    stage.addEventListener("pointerdown", (event) => {
      if (!open || morphing) return;
      // Let image handle its own click path; still track for pinch/drag.
      if (event.target === stageImg && event.pointerType === "mouse") {
        pointerDownAt = { x: event.clientX, y: event.clientY };
        movedBeyondSlop = false;
        return;
      }
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      pointerDownAt = { x: event.clientX, y: event.clientY };
      movedBeyondSlop = false;
      if (pointers.size === 1) {
        dragOrigin = { x: event.clientX - panX, y: event.clientY - panY };
        cursorFollow = false;
      } else if (pointers.size === 2) {
        const pts = [...pointers.values()];
        pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        dragOrigin = null;
      }
    });

    stage.addEventListener("pointermove", (event) => {
      if (pointerDownAt) {
        const dx = event.clientX - pointerDownAt.x;
        const dy = event.clientY - pointerDownAt.y;
        if (Math.hypot(dx, dy) > TAP_SLOP_PX) movedBeyondSlop = true;
      }

      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const pts = [...pointers.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinchStartDist > 0) {
          zoom = dist > pinchStartDist ? MAX_ZOOM : MIN_ZOOM;
          if (zoom <= 1.01) {
            zoom = 1;
            panX = 0;
            panY = 0;
          } else {
            clampPan();
          }
          stageImg.style.transition = "none";
          applyZoomTransform();
          setZoomedClass();
        }
      } else if (pointers.size === 1 && dragOrigin && zoom > 1) {
        panX = event.clientX - dragOrigin.x;
        panY = event.clientY - dragOrigin.y;
        clampPan();
        stageImg.style.transition = "none";
        applyZoomTransform();
      }
    });

    // Outside the image but still on stage (letterbox) — treat like scrim.
    stage.addEventListener("click", (event) => {
      if (!open || morphing) return;
      if (event.target === stageImg) return;
      if (movedBeyondSlop) return;
      if (zoom > 1.01) {
        resetZoom({ animate: true });
        return;
      }
      closeLightbox();
    });

    const endPointer = (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) {
        pinchStartDist = 0;
      }
      if (pointers.size === 0) {
        dragOrigin = null;
        if (zoom > 1.01 && hasFinePointer()) {
          cursorFollow = true;
        }
        // Keep movedBeyondSlop until after click handlers fire.
        window.setTimeout(() => {
          pointerDownAt = null;
          movedBeyondSlop = false;
        }, 0);
      } else if (pointers.size === 1) {
        const pt = [...pointers.values()][0];
        dragOrigin = { x: pt.x - panX, y: pt.y - panY };
      }
    };
    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);
    stageImg.addEventListener("pointerup", endPointer);
    stageImg.addEventListener("pointercancel", endPointer);

    document.addEventListener("keydown", (event) => {
      if (!open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (zoom > 1.01) {
          resetZoom({ animate: true });
          return;
        }
        closeLightbox();
      }
    });

    return overlay;
  }

  function finishMorph() {
    morphing = false;
    if (stageImg) {
      stageImg.style.transition = `transform ${ZOOM_MS}ms ${EASE_OUT}`;
      stageImg.style.willChange = "transform";
    }
  }

  function openLightbox(thumb) {
    if (open || morphing) return;
    const sourceImg = thumb.querySelector("img");
    if (!sourceImg?.src) return;

    ensureOverlay();
    window.clearTimeout(morphTimer);
    activeThumb = thumb;
    open = true;
    morphing = true;
    stageImg.style.transition = "none";
    resetZoom();
    document.body.classList.add("product-lightbox-open");
    overlay.hidden = false;
    overlay.classList.add("is-open");

    stageImg.src = sourceImg.currentSrc || sourceImg.src;
    stageImg.alt = sourceImg.alt || "Product image";

    const first = thumb.getBoundingClientRect();
    const viewportPad = 24;
    const maxW = Math.min(window.innerWidth - viewportPad * 2, 920);
    const maxH = window.innerHeight - viewportPad * 2;
    const aspect = 3 / 4;
    let lastW = maxW;
    let lastH = lastW / aspect;
    if (lastH > maxH) {
      lastH = maxH;
      lastW = lastH * aspect;
    }
    baseRect = {
      left: (window.innerWidth - lastW) / 2,
      top: (window.innerHeight - lastH) / 2,
      width: lastW,
      height: lastH,
    };

    stageImg.style.width = `${baseRect.width}px`;
    stageImg.style.height = `${baseRect.height}px`;
    stageImg.style.left = `${baseRect.left}px`;
    stageImg.style.top = `${baseRect.top}px`;
    stageImg.style.borderRadius = getComputedStyle(thumb).borderRadius || "4px";
    stageImg.style.opacity = "1";
    stageImg.style.willChange = "transform";

    if (prefersReducedMotion()) {
      stageImg.style.transform = "none";
      scrim.style.opacity = "1";
      thumb.classList.add("is-lightbox-source");
      finishMorph();
      return;
    }

    const invert = invertFlip(first, baseRect);
    stageImg.style.transform = `translate3d(${invert.x}px, ${invert.y}px, 0) scale(${invert.sx}, ${invert.sy})`;
    scrim.style.transition = "none";
    scrim.style.opacity = "0";
    thumb.classList.add("is-lightbox-source");

    void stageImg.offsetWidth;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        stageImg.style.transition = `transform ${MORPH_MS}ms ${EASE_OUT}, border-radius ${MORPH_MS}ms ${EASE_OUT}`;
        scrim.style.transition = `opacity ${MORPH_MS}ms ${EASE_OUT}`;
        stageImg.style.transform = "translate3d(0,0,0) scale(1)";
        stageImg.style.borderRadius = "8px";
        scrim.style.opacity = "1";
      });
    });

    morphTimer = window.setTimeout(finishMorph, MORPH_MS + 32);
  }

  function closeLightbox() {
    if (!open || morphing) return;
    morphing = true;
    window.clearTimeout(morphTimer);
    const thumb = activeThumb;
    const first = thumb?.getBoundingClientRect();

    if (!thumb || !first || prefersReducedMotion()) {
      overlay.classList.remove("is-open");
      overlay.classList.remove("is-zoomed");
      overlay.hidden = true;
      document.body.classList.remove("product-lightbox-open");
      thumb?.classList.remove("is-lightbox-source");
      open = false;
      morphing = false;
      activeThumb = null;
      stageImg.style.transition = "none";
      resetZoom();
      return;
    }

    stageImg.style.transition = "none";
    resetZoom();
    void stageImg.offsetWidth;

    const last = stageImg.getBoundingClientRect();
    const invert = invertFlip(first, last);

    requestAnimationFrame(() => {
      stageImg.style.transition = `transform ${MORPH_MS}ms ${EASE_OUT}, border-radius ${MORPH_MS}ms ${EASE_OUT}`;
      scrim.style.transition = `opacity ${MORPH_MS}ms ${EASE_OUT}`;
      stageImg.style.transform = `translate3d(${invert.x}px, ${invert.y}px, 0) scale(${invert.sx}, ${invert.sy})`;
      stageImg.style.borderRadius = getComputedStyle(thumb).borderRadius || "4px";
      scrim.style.opacity = "0";
    });

    morphTimer = window.setTimeout(() => {
      overlay.classList.remove("is-open");
      overlay.classList.remove("is-zoomed");
      overlay.hidden = true;
      document.body.classList.remove("product-lightbox-open");
      thumb.classList.remove("is-lightbox-source");
      open = false;
      morphing = false;
      activeThumb = null;
      stageImg.style.transition = "none";
      stageImg.style.willChange = "auto";
      stageImg.removeAttribute("src");
      resetZoom();
    }, MORPH_MS + 32);
  }

  gallery.addEventListener("click", (event) => {
    const thumb = event.target.closest?.("[data-pdp-lightbox]");
    if (!thumb || !gallery.contains(thumb)) return;
    event.preventDefault();
    openLightbox(thumb);
  });
}
