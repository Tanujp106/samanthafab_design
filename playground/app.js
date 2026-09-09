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
const mobileDrawer = document.querySelector("[data-mobile-drawer]");
const mobileDrawerOverlay = document.querySelector("[data-mobile-drawer-overlay]");
const mobileDrawerClose = document.querySelector("[data-mobile-drawer-close]");

const setMobileDrawerOpen = (open) => {
  if (!mobileDrawer) return;
  mobileDrawer.classList.toggle("is-open", open);
  mobileDrawerOverlay?.classList.toggle("is-open", open);
  mobileDrawer.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("mobile-drawer-open", open);
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
};

if (mobileDrawer && menuToggle) {
  menuToggle.addEventListener("click", () => {
    setMobileDrawerOpen(!mobileDrawer.classList.contains("is-open"));
  });
  mobileDrawerOverlay?.addEventListener("click", () => setMobileDrawerOpen(false));
  mobileDrawerClose?.addEventListener("click", () => setMobileDrawerOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
      setMobileDrawerOpen(false);
    }
  });
} else if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("nav-links--open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (!menuToggle.querySelector(".nav-menu-toggle__icon")) {
      menuToggle.textContent = open ? "Close" : "Menu";
    }
  });
}

const navMenuTrigger = document.querySelector("[data-nav-menu-trigger]");
const navMenu = document.querySelector("[data-nav-menu]");
if (navMenuTrigger && navMenu) {
  let closeTimer = null;

  const clearCloseTimer = () => {
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = null;
  };

  const setMenuOpen = (open, returnFocus = false) => {
    clearCloseTimer();
    navMenuTrigger.setAttribute("aria-expanded", String(open));
    navMenu.setAttribute("aria-hidden", String(!open));
    navMenu.classList.toggle("is-open", open);
    if (returnFocus) navMenuTrigger.focus();
  };

  const scheduleMenuClose = () => {
    clearCloseTimer();
    closeTimer = window.setTimeout(() => setMenuOpen(false), 140);
  };

  navMenuTrigger.addEventListener("click", () => {
    setMenuOpen(navMenuTrigger.getAttribute("aria-expanded") !== "true");
  });
  navMenuTrigger.addEventListener("pointerenter", () => setMenuOpen(true));
  navMenuTrigger.addEventListener("pointerleave", scheduleMenuClose);
  navMenuTrigger.addEventListener("focus", () => setMenuOpen(true));
  navMenu.addEventListener("pointerenter", clearCloseTimer);
  navMenu.addEventListener("pointerleave", scheduleMenuClose);
  navMenu.addEventListener("focusin", clearCloseTimer);

  document.addEventListener("focusin", (event) => {
    if (!navMenu.contains(event.target) && event.target !== navMenuTrigger) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenuTrigger.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!navMenu.contains(event.target) && event.target !== navMenuTrigger) setMenuOpen(false);
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
  let teleportFrame = null;
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

document.querySelectorAll("[data-material-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector("[data-material-viewport]");
  const track = carousel.querySelector("[data-material-track]");
  const previous = carousel.querySelector('[data-material-dir="-1"]');
  const next = carousel.querySelector('[data-material-dir="1"]');
  const sourceTiles = [...(track?.querySelectorAll("[data-material-index]") || [])];
  if (!viewport || !track || !previous || !next || !sourceTiles.length) return;

  const setSize = sourceTiles.length;
  sourceTiles.forEach((tile) => {
    tile.setAttribute("data-material-copy", "0");
  });
  const repeatedTiles = [1, 2, 3, 4].flatMap((copy) =>
    sourceTiles.map((tile) => {
      const clone = tile.cloneNode(true);
      clone.setAttribute("data-material-copy", String(copy));
      return clone;
    }),
  );
  track.append(...repeatedTiles);

  const tiles = [...track.querySelectorAll("[data-material-index]")];
  tiles.forEach((tile, virtualIndex) => {
    tile.dataset.materialVirtualIndex = String(virtualIndex);
  });

  let activeIndex = setSize * 2;
  let teleportFrame = null;
  let recenterTimer = null;

  const wrap = (index) => (index + setSize) % setSize;

  const syncMaterials = (instant = false) => {
    const needsRecenter = activeIndex >= setSize * 3 || activeIndex < setSize * 2;
    const activeSlot = wrap(activeIndex);
    carousel.dataset.materialActive = String(activeSlot);
    const cardWidth = tiles[0]?.offsetWidth || Number.parseFloat(window.getComputedStyle(tiles[0]).width) || 0;
    const gap = Number.parseFloat(window.getComputedStyle(viewport).getPropertyValue("--material-gap")) || 16;
    const teleportingTiles = [];

    tiles.forEach((tile) => {
      const virtualIndex = Number(tile.dataset.materialVirtualIndex);
      const relative = virtualIndex - activeIndex;
      const distance = Math.abs(relative);
      const previousOffsetValue = tile.style.getPropertyValue("--material-offset");
      const previousOffset = previousOffsetValue ? Number(previousOffsetValue) : null;
      const isTeleporting = instant || (previousOffset !== null && Math.abs(relative - previousOffset) > 2);
      if (isTeleporting) teleportingTiles.push(tile);
      tile.classList.toggle("is-teleporting", isTeleporting);
      tile.style.setProperty("--material-offset", String(relative));
      tile.style.setProperty("--material-distance", String(distance));
      tile.style.setProperty("--material-shift", String(relative * (cardWidth + gap)) + "px");
      tile.dataset.distance = String(Math.min(distance, 3));
      tile.classList.toggle("is-active", virtualIndex === activeIndex);
      tile.inert = distance > 1;
      tile.setAttribute("aria-hidden", String(distance > 1));
      if (virtualIndex === activeIndex) tile.setAttribute("aria-current", "true");
      else tile.removeAttribute("aria-current");
    });

    if (teleportFrame) window.cancelAnimationFrame(teleportFrame);
    teleportFrame = window.requestAnimationFrame(() => {
      teleportingTiles.forEach((tile) => tile.classList.remove("is-teleporting"));
      teleportFrame = null;
    });

    if (!instant && needsRecenter) {
      if (recenterTimer) window.clearTimeout(recenterTimer);
      recenterTimer = window.setTimeout(() => {
        while (activeIndex >= setSize * 3) activeIndex -= setSize;
        while (activeIndex < setSize * 2) activeIndex += setSize;
        recenterTimer = null;
        syncMaterials(true);
      }, 460);
    }
  };

  const moveMaterials = (direction) => {
    activeIndex += direction;
    syncMaterials();
  };

  previous.addEventListener("click", () => moveMaterials(-1));
  next.addEventListener("click", () => moveMaterials(1));
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveMaterials(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveMaterials(1);
    }
  });

  tiles.forEach((tile) => {
    tile.addEventListener("click", (event) => {
      const virtualIndex = Number(tile.dataset.materialVirtualIndex);
      if (virtualIndex === activeIndex) return;
      event.preventDefault();
      activeIndex = virtualIndex;
      syncMaterials();
    });
  });

  window.addEventListener("resize", syncMaterials, { passive: true });
  syncMaterials();
});

document.querySelectorAll("[data-footer-newsletter]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
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

const mobileBottomBar = document.querySelector("[data-mobile-bottom-bar]");
if (mobileBottomBar) {
  const panels = [...document.querySelectorAll("[data-mobile-panel]")];
  const tabButtons = [...mobileBottomBar.querySelectorAll("[data-mobile-tab]")];

  const setMobileTab = (tabId) => {
    document.body.dataset.mobileTab = tabId;
    tabButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mobileTab === tabId);
    });
    panels.forEach((panel) => {
      const isActive = panel.dataset.mobilePanel === tabId;
      panel.hidden = !isActive;
    });
    if (tabId !== "home") setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => setMobileTab(button.dataset.mobileTab));
  });

  setMobileTab("home");
}

const mobileSearchInput = document.querySelector("[data-mobile-search-input]");
const mobileProductGrid = document.querySelector("[data-mobile-product-grid]");
const mobileTrendingChips = document.querySelector("[data-mobile-trending-chips]");
const mobileSearchForm = document.querySelector("[data-mobile-search-form]");

if (mobileSearchInput && mobileProductGrid) {
  const cards = [...mobileProductGrid.querySelectorAll(".mobile-explore__card")];

  const filterExploreProducts = (query = "") => {
    const normalized = query.trim().toLowerCase();
    cards.forEach((card) => {
      const name = card.querySelector(".product-name")?.textContent?.toLowerCase() || "";
      const tag = card.querySelector(".product-tag")?.textContent?.toLowerCase() || "";
      const matches = !normalized || name.includes(normalized) || tag.includes(normalized);
      card.hidden = !matches;
      card.style.display = matches ? "" : "none";
    });
  };

  mobileSearchInput.addEventListener("input", () => {
    filterExploreProducts(mobileSearchInput.value);
    mobileTrendingChips?.querySelectorAll(".mobile-explore__chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip.textContent.toLowerCase().includes(mobileSearchInput.value.trim().toLowerCase()));
    });
  });

  mobileSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    filterExploreProducts(mobileSearchInput.value);
  });

  mobileTrendingChips?.querySelectorAll(".mobile-explore__chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.dataset.trendingQuery ?? chip.textContent;
      mobileSearchInput.value = chip.textContent;
      mobileTrendingChips.querySelectorAll(".mobile-explore__chip").forEach((item) => {
        item.classList.toggle("is-active", item === chip);
      });
      filterExploreProducts(query);
    });
  });
}

if (requestedPage && !pages[requestedPage]) {
  console.warn(`Unknown playground page: ${requestedPage}. Showing homepage.`);
}
