/**
 * Mobile PDP gallery — one-up horizontal swipe loop with scroll-snap clones.
 * Desktop keeps the 2×2 grid; clones stay hidden above the mobile breakpoint.
 * Slide width is locked to the padded viewport (not full-bleed).
 */

const MOBILE_MQ = "(max-width: 760px)";

function realSlides(gallery) {
  return [...gallery.querySelectorAll(".product-detail__thumb:not([data-pdp-gallery-clone])")];
}

function clearClones(gallery) {
  gallery.querySelectorAll("[data-pdp-gallery-clone]").forEach((node) => node.remove());
}

function syncDots(shell, activeIndex) {
  const dots = shell.querySelectorAll("[data-pdp-gallery-dots] .product-detail__gallery-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
  });
}

function slideWidth(viewport) {
  return Math.round(viewport.clientWidth) || 1;
}

function syncSlideSize(viewport, gallery, mobile) {
  if (!mobile) {
    viewport.style.removeProperty("--pdp-gallery-slide");
    return;
  }
  viewport.style.setProperty("--pdp-gallery-slide", `${slideWidth(viewport)}px`);
  // Force layout so scroll offsets use the updated flex basis.
  void gallery.offsetWidth;
}

export function bindProductGalleryCarousel(root = document) {
  const shell = root.querySelector("[data-pdp-gallery-shell]");
  const viewport = root.querySelector("[data-pdp-gallery-viewport]");
  const gallery = root.querySelector("[data-product-gallery]");
  if (!shell || !viewport || !gallery || gallery.dataset.carouselBound === "true") return;
  gallery.dataset.carouselBound = "true";

  const mq = window.matchMedia(MOBILE_MQ);
  let slides = realSlides(gallery);
  let jumping = false;
  let active = 0;

  function goToLogical(index, { instant = false } = {}) {
    if (!slides.length) return;
    const width = slideWidth(viewport);
    const offset = mq.matches ? (index + 1) * width : 0;
    viewport.scrollTo({
      left: offset,
      behavior: instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  function setupLoop() {
    clearClones(gallery);
    slides = realSlides(gallery);
    syncSlideSize(viewport, gallery, mq.matches);

    if (!mq.matches || slides.length < 2) {
      viewport.scrollLeft = 0;
      syncDots(shell, 0);
      return;
    }

    const first = slides[0];
    const last = slides[slides.length - 1];
    const cloneFirst = first.cloneNode(true);
    const cloneLast = last.cloneNode(true);
    cloneFirst.removeAttribute("data-pdp-lightbox");
    cloneLast.removeAttribute("data-pdp-lightbox");
    cloneFirst.dataset.pdpGalleryClone = "true";
    cloneLast.dataset.pdpGalleryClone = "true";
    cloneFirst.tabIndex = -1;
    cloneLast.tabIndex = -1;
    cloneFirst.setAttribute("aria-hidden", "true");
    cloneLast.setAttribute("aria-hidden", "true");
    gallery.insertBefore(cloneLast, first);
    gallery.append(cloneFirst);

    syncSlideSize(viewport, gallery, true);
    jumping = true;
    viewport.scrollLeft = slideWidth(viewport);
    requestAnimationFrame(() => {
      jumping = false;
    });
    active = 0;
    syncDots(shell, active);
  }

  function onScroll() {
    if (!mq.matches || jumping || slides.length < 2) return;
    const width = slideWidth(viewport);
    const index = Math.round(viewport.scrollLeft / width);
    const lastCloneIndex = slides.length + 1;

    if (index <= 0) {
      jumping = true;
      viewport.scrollLeft = slides.length * width;
      active = slides.length - 1;
      syncDots(shell, active);
      requestAnimationFrame(() => {
        jumping = false;
      });
      return;
    }

    if (index >= lastCloneIndex) {
      jumping = true;
      viewport.scrollLeft = width;
      active = 0;
      syncDots(shell, active);
      requestAnimationFrame(() => {
        jumping = false;
      });
      return;
    }

    active = index - 1;
    syncDots(shell, active);
  }

  function onScrollEnd() {
    onScroll();
  }

  viewport.addEventListener("scroll", onScroll, { passive: true });
  viewport.addEventListener("scrollend", onScrollEnd);
  window.addEventListener("resize", () => {
    setupLoop();
  });

  mq.addEventListener("change", () => {
    setupLoop();
  });

  setupLoop();

  // Expose for tests / debugging
  shell._pdpGalleryGoTo = goToLogical;
}
