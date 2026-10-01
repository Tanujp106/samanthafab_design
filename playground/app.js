import { pages } from "./pages/index.js";
import { renderPage, renderProductCard } from "./components/render.js";
import { renderCollectionPlp } from "./components/collection-plp.js";
import { renderBagDrawerBody, renderWishlistPage } from "./components/commerce-pages.js";
import { filterSearchProducts, normalizeSearchQuery } from "./components/search-overlay.js";
import { bindProductLightbox } from "./components/product-lightbox.js";
import { bindProductGalleryCarousel } from "./components/product-gallery-carousel.js";
import { bindProductStickyBar } from "./components/product-sticky-bar.js";
import {
  getCollection,
  getCollectionProducts,
  getContentPage,
  resolveCollectionSlug,
  resolveCommerceKind,
  resolveContentSlug,
  resolveProductSlug,
} from "./data/collections.js";
import { catalogProducts, getCatalogProduct } from "./data/catalog.js";
import { applyCollectionFilters, DEFAULT_SORT } from "./lib/collection-filters.mjs";
import {
  addToBag,
  bagCount,
  isWishlisted,
  moveBagItemToWishlist,
  productIdFrom,
  readBag,
  readWishlist,
  removeFromBag,
  removeWishlist,
  setBagQuantity,
  toggleWishlist,
  wishlistCount,
} from "./lib/commerce-store.mjs";

const app = document.querySelector("#app");
const searchParams = new URLSearchParams(window.location.search);
const reviewRequested = searchParams.get("notes") === "1";
const requestedPage = searchParams.get("page");
const routeParam = searchParams.get("route");
const slugParam = searchParams.get("slug");
const searchQueryParam = searchParams.get("q") || "";
const cleanPath = window.location.pathname.replace(/\/+$/, "") || "/";
const pathPage = cleanPath === "/design" ? "blank" : null;
const pageKey = requestedPage || pathPage || app.dataset.page || "homepage";
const page = pages[pageKey] || pages.homepage;
const notesEnabled = reviewRequested && page.key !== "blank";

const collectionSlug = page.key === "blank" ? resolveCollectionSlug(routeParam, slugParam) : null;
const contentSlug =
  page.key === "blank" && !collectionSlug ? resolveContentSlug(routeParam, slugParam) : null;
const commerceKind =
  page.key === "blank" && !collectionSlug && !contentSlug ? resolveCommerceKind(routeParam) : null;
const productSlug =
  page.key === "blank" && !collectionSlug && !contentSlug && !commerceKind
    ? resolveProductSlug(routeParam, slugParam)
    : null;
const productView = productSlug
  ? {
      product: getCatalogProduct(productSlug) || getCatalogProduct("sage-handblock"),
      relatedProducts: catalogProducts.filter((product) => product.id !== productSlug).slice(0, 10),
    }
  : null;
const wishlistView = commerceKind === "wishlist" ? "wishlist" : null;
const openBagOnLoad = commerceKind === "bag";
const openSearchOnLoad = page.key === "blank" && routeParam === "search";
const emptyFilterState = () => ({
  sort: DEFAULT_SORT,
  availability: [],
  categories: [],
  collectionFilters: [],
  sizes: [],
  colors: [],
  priceMin: null,
  priceMax: null,
});

let collectionState = emptyFilterState();
const searchProducts = page.sections.find((section) => section.id === "design-best-sellers")?.products || [];

function buildCollectionView(slug, state) {
  if (!slug) return null;
  const collection = getCollection(slug);
  const allProducts = getCollectionProducts(slug);
  if (!collection) {
    return {
      collection: null,
      allProducts: [],
      products: [],
      state,
    };
  }
  return {
    collection,
    allProducts,
    products: applyCollectionFilters(allProducts, state),
    state,
  };
}

document.body.dataset.notes = String(notesEnabled);
document.body.dataset.page = page.key;
if (collectionSlug) {
  document.body.dataset.collectionSlug = collectionSlug;
  document.title = getCollection(collectionSlug)?.title
    ? `${getCollection(collectionSlug).title} — Samantha Fab`
    : page.title;
} else if (contentSlug) {
  document.body.dataset.contentSlug = contentSlug;
  document.title = getContentPage(contentSlug)?.title
    ? `${getContentPage(contentSlug).title} — Samantha Fab`
    : page.title;
} else if (wishlistView) {
  document.body.dataset.commerceKind = "wishlist";
  document.title = "Wishlist — Samantha Fab";
} else if (productView) {
  document.body.dataset.productSlug = productSlug;
  document.title = `${productView.product.name} — Samantha Fab`;
} else {
  document.title = page.title;
}

app.replaceChildren(
  renderPage(page, {
    notesEnabled,
    collectionView: collectionSlug ? buildCollectionView(collectionSlug, collectionState) : null,
    contentView: contentSlug ? { page: getContentPage(contentSlug) } : null,
    commerceView: wishlistView ? { kind: "wishlist" } : null,
    productView,
  }),
);

// Bind wishlist / bag early so later carousel setup errors can't leave hearts inert.
bindCommerceInteractions(document);
syncNavCommerceCounts();
bindProductLightbox(document);
bindProductGalleryCarousel(document);
bindProductStickyBar(document);
bindBagBestsellersRails(document);

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

const searchOverlay = document.querySelector("[data-search-overlay]");
const searchInput = searchOverlay?.querySelector("[data-search-input]");
const searchForm = searchOverlay?.querySelector("[data-search-form]");
const searchPlaceholder = searchOverlay?.querySelector("[data-search-animated-placeholder]");
const searchGrid = searchOverlay?.querySelector("[data-search-product-grid]");
const searchEmpty = searchOverlay?.querySelector("[data-search-empty]");
const searchTitle = searchOverlay?.querySelector(".search-overlay__products-title");
const searchTerms = (() => {
  try {
    const parsed = JSON.parse(searchOverlay?.dataset.searchTerms || "[]");
    return Array.isArray(parsed) && parsed.length ? parsed : ["sarees"];
  } catch {
    return ["sarees"];
  }
})();
const searchReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let searchTypingTimer = null;
let searchTypingTermIndex = 0;
let searchTypingCharacterIndex = 0;
let searchTypingPhase = "typing";
let searchReturnFocus = null;

function stopSearchTyping() {
  if (searchTypingTimer) window.clearTimeout(searchTypingTimer);
  searchTypingTimer = null;
}

function scheduleSearchTyping(delay) {
  stopSearchTyping();
  searchTypingTimer = window.setTimeout(tickSearchTyping, delay);
}

function tickSearchTyping() {
  if (!searchOverlay?.classList.contains("is-open") || searchInput?.value) {
    stopSearchTyping();
    return;
  }

  const term = searchTerms[searchTypingTermIndex] || "sarees";
  if (searchTypingPhase === "typing") {
    searchTypingCharacterIndex = Math.min(term.length, searchTypingCharacterIndex + 1);
    searchPlaceholder.textContent = term.slice(0, searchTypingCharacterIndex);
    if (searchTypingCharacterIndex >= term.length) {
      searchTypingPhase = "hold";
      scheduleSearchTyping(1150);
    } else {
      scheduleSearchTyping(72);
    }
    return;
  }

  if (searchTypingPhase === "hold") {
    searchTypingPhase = "deleting";
    scheduleSearchTyping(38);
    return;
  }

  searchTypingCharacterIndex = Math.max(0, searchTypingCharacterIndex - 1);
  searchPlaceholder.textContent = term.slice(0, searchTypingCharacterIndex);
  if (searchTypingCharacterIndex === 0) {
    searchTypingTermIndex = (searchTypingTermIndex + 1) % searchTerms.length;
    searchTypingPhase = "typing";
    scheduleSearchTyping(260);
  } else {
    scheduleSearchTyping(42);
  }
}

function startSearchTyping() {
  stopSearchTyping();
  if (!searchPlaceholder) return;
  if (searchReducedMotion) {
    searchPlaceholder.textContent = searchTerms[0] || "sarees";
    return;
  }
  if (searchInput?.value) return;
  searchTypingTermIndex = 0;
  searchTypingCharacterIndex = 0;
  searchTypingPhase = "typing";
  searchPlaceholder.textContent = "";
  scheduleSearchTyping(120);
}

function applySearchQuery(value = "") {
  if (!searchOverlay || !searchGrid) return;
  const query = normalizeSearchQuery(value);
  const matchingIds = new Set(filterSearchProducts(searchProducts, query).map((product) => productIdFrom(product)));
  let visibleCount = 0;

  searchGrid.querySelectorAll("[data-search-product]").forEach((card) => {
    const matches = !query || matchingIds.has(card.dataset.productId);
    card.hidden = !matches;
    card.classList.toggle("is-filtered-out", !matches);
    if (matches) visibleCount += 1;
  });

  searchForm?.classList.toggle("is-query", Boolean(query));
  if (searchTitle) searchTitle.textContent = query ? `Results for “${value.trim()}”` : "Top products";
  if (searchEmpty) searchEmpty.hidden = visibleCount > 0;
}

function setSearchOverlayOpen(open) {
  if (!searchOverlay) return;
  if (open) {
    searchReturnFocus = document.activeElement;
    searchOverlay.inert = false;
    searchOverlay.setAttribute("aria-hidden", "false");
    searchOverlay.classList.add("is-open");
    document.body.classList.add("search-overlay-open");
    setMobileDrawerOpen(false);
    if (searchQueryParam && searchInput && !searchInput.value) searchInput.value = searchQueryParam;
    applySearchQuery(searchInput?.value || "");
    startSearchTyping();
    window.requestAnimationFrame(() => searchInput?.focus({ preventScroll: true }));
    return;
  }

  stopSearchTyping();
  searchOverlay.classList.remove("is-open");
  searchOverlay.setAttribute("aria-hidden", "true");
  searchOverlay.inert = true;
  document.body.classList.remove("search-overlay-open");
  if (searchInput && !searchInput.value) searchPlaceholder.textContent = searchTerms[0] || "sarees";
  if (searchReturnFocus?.focus) window.requestAnimationFrame(() => searchReturnFocus.focus());
}

if (searchOverlay && searchInput) {
  searchInput.addEventListener("input", () => {
    if (searchInput.value) stopSearchTyping();
    else startSearchTyping();
    applySearchQuery(searchInput.value);
  });
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    applySearchQuery(searchInput.value);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const openTrigger = target.closest?.("[data-search-open]");
    if (openTrigger) {
      event.preventDefault();
      setSearchOverlayOpen(true);
      return;
    }

    const closeTrigger = target.closest?.("[data-search-close]");
    if (closeTrigger) {
      event.preventDefault();
      setSearchOverlayOpen(false);
      return;
    }

    const suggestion = target.closest?.("[data-search-suggestion]");
    if (suggestion) {
      event.preventDefault();
      const query = suggestion.dataset.searchSuggestion || suggestion.textContent.trim();
      searchInput.value = query;
      applySearchQuery(query);
      stopSearchTyping();
      searchInput.focus();
      return;
    }

    const recentClear = target.closest?.("[data-search-recent-clear]");
    if (recentClear) {
      event.preventDefault();
      recentClear.closest(".search-overlay__recent-item")?.remove();
      return;
    }

    const recentClearAll = target.closest?.("[data-search-recent-clear-all]");
    if (recentClearAll) {
      event.preventDefault();
      searchOverlay.querySelector("[data-search-recent-list]")?.replaceChildren();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchOverlay.classList.contains("is-open")) {
      event.preventDefault();
      setSearchOverlayOpen(false);
    }
  });
}

if (openSearchOnLoad) {
  const url = new URL(window.location.href);
  url.searchParams.delete("route");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  setSearchOverlayOpen(true);
}

const accountOverlay = document.querySelector("[data-account-overlay]");
const accountForm = accountOverlay?.querySelector("[data-account-form]");
const accountEmail = accountOverlay?.querySelector(".account-overlay__input");
let accountReturnFocus = null;

function setAccountOverlayOpen(open) {
  if (!accountOverlay) return;
  if (open) {
    accountReturnFocus = document.activeElement;
    accountOverlay.inert = false;
    accountOverlay.setAttribute("aria-hidden", "false");
    accountOverlay.classList.add("is-open");
    document.body.classList.add("account-overlay-open");
    setMobileDrawerOpen(false);
    setBagDrawerOpen(false);
    window.requestAnimationFrame(() => accountEmail?.focus({ preventScroll: true }));
    return;
  }

  accountOverlay.classList.remove("is-open");
  accountOverlay.setAttribute("aria-hidden", "true");
  accountOverlay.inert = true;
  document.body.classList.remove("account-overlay-open");
  if (accountReturnFocus?.focus) window.requestAnimationFrame(() => accountReturnFocus.focus());
}

if (accountOverlay) {
  accountForm?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const openTrigger = target.closest?.("[data-account-open]");
    if (openTrigger) {
      event.preventDefault();
      setAccountOverlayOpen(true);
      return;
    }

    const closeTrigger = target.closest?.("[data-account-close], [data-account-backdrop]");
    if (closeTrigger) {
      event.preventDefault();
      setAccountOverlayOpen(false);
      return;
    }

    const googleTrigger = target.closest?.("[data-account-google]");
    if (googleTrigger) event.preventDefault();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && accountOverlay.classList.contains("is-open")) {
      event.preventDefault();
      setAccountOverlayOpen(false);
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

function parseProductPayload(card) {
  const source = card?.closest?.("[data-product-payload]") || card;
  if (!source?.dataset?.productPayload) return null;
  try {
    return JSON.parse(source.dataset.productPayload);
  } catch {
    return null;
  }
}

function syncNavCommerceCounts() {
  const wishCount = wishlistCount();
  const bagItems = bagCount();

  document.querySelectorAll('[data-nav-count="wishlist"]').forEach((node) => {
    node.textContent = String(wishCount);
    node.hidden = wishCount <= 0;
  });
  document.querySelectorAll('[data-nav-count="bag"]').forEach((node) => {
    node.textContent = String(bagItems);
    node.hidden = bagItems <= 0;
  });

  document.querySelectorAll("[data-nav-wishlist]").forEach((node) => {
    node.setAttribute("aria-label", wishCount ? `Wishlist, ${wishCount} items` : "Wishlist");
  });
  document.querySelectorAll("[data-nav-bag]").forEach((node) => {
    node.setAttribute("aria-label", bagItems ? `Shopping bag, ${bagItems} items` : "Shopping bag");
  });
}

function showCommerceToast(message) {
  let toast = document.querySelector("[data-commerce-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "commerce-toast";
    toast.dataset.commerceToast = "true";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showCommerceToast._timer);
  showCommerceToast._timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function setWishlistButtonState(button, wishlisted) {
  const name = button.dataset.productName || "item";
  button.setAttribute("aria-pressed", wishlisted ? "true" : "false");
  button.setAttribute("aria-label", wishlisted ? `Saved ${name}` : `Save ${name}`);
  const svg = button.querySelector("svg");
  if (svg) svg.setAttribute("fill", wishlisted ? "currentColor" : "none");
}

function bagBestsellersProducts() {
  return page.sections.find((section) => section.id === "design-best-sellers")?.products || [];
}

function refreshBagDrawerContents() {
  const drawer = document.querySelector("[data-bag-drawer]");
  const panel = drawer?.querySelector("[data-bag-drawer-panel]");
  if (!panel) return;
  const { body, count } = renderBagDrawerBody({
    items: readBag(),
    empty: page.mobile?.bag,
    bestsellers: bagBestsellersProducts(),
    ctx: { notesEnabled },
    renderProductCard,
  });
  const existing = panel.querySelector("[data-bag-drawer-body]");
  if (existing) existing.replaceWith(body);
  else panel.append(body);
  const countNode = panel.querySelector("[data-bag-drawer-count]");
  if (countNode) countNode.textContent = `(${count})`;
  bindBagBestsellersRails(panel);
}

function bindBagBestsellersRails(root = document) {
  root.querySelectorAll("[data-bag-bestsellers]").forEach((section) => {
    if (section.dataset.bagBestsellersBound === "1") return;
    section.dataset.bagBestsellersBound = "1";

    const viewport = section.querySelector("[data-bag-bestsellers-viewport]");
    const previous = section.querySelector('[data-bag-bestsellers-dir="-1"]');
    const next = section.querySelector('[data-bag-bestsellers-dir="1"]');
    if (!viewport || !previous || !next) return;

    const firstCard = section.querySelector(".bag-bestsellers__card");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const syncControls = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth - 1;
      previous.disabled = viewport.scrollLeft <= 1;
      next.disabled = viewport.scrollLeft >= maxScroll;
    };

    const moveRail = (direction) => {
      const cardWidth = firstCard?.getBoundingClientRect().width || viewport.clientWidth * 0.42;
      const gap =
        Number.parseFloat(getComputedStyle(viewport.querySelector(".bag-bestsellers__track")).columnGap) ||
        12;
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
  });
}

function setMobileTabState(tabId) {
  const panels = [...document.querySelectorAll("[data-mobile-panel]")];
  const tabButtons = [...document.querySelectorAll("[data-mobile-bottom-bar] [data-mobile-tab]")];
  if (!panels.length || !tabButtons.length) return false;

  document.body.dataset.mobileTab = tabId;
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mobileTab === tabId);
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.mobilePanel !== tabId;
  });
  if (tabId !== "home") setMobileDrawerOpen(false);
  window.scrollTo({ top: 0, behavior: "auto" });
  return true;
}

let bagReturnFocus = null;

function setBagDrawerOpen(open) {
  const drawer = document.querySelector("[data-bag-drawer]");
  if (!drawer) return;
  const wasOpen = drawer.classList.contains("is-open");
  if (!open && !wasOpen) return;
  if (open) {
    if (!wasOpen) bagReturnFocus = document.activeElement;
    refreshBagDrawerContents();
    setMobileDrawerOpen(false);
  }
  drawer.classList.toggle("is-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  drawer.inert = !open;
  document.body.classList.toggle("bag-drawer-open", open);
  document.querySelectorAll("[data-bag-open]").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", String(open));
  });
  if (open && !wasOpen) {
    window.requestAnimationFrame(() => drawer.querySelector(".bag-drawer__close")?.focus({ preventScroll: true }));
  } else if (!open && wasOpen && bagReturnFocus?.focus) {
    const returnFocus = bagReturnFocus;
    bagReturnFocus = null;
    window.requestAnimationFrame(() => returnFocus.focus({ preventScroll: true }));
  }
}

function refreshCommerceSurfaces() {
  const ctx = { notesEnabled };
  const mainPage = document.querySelector("[data-commerce-page]");
  if (mainPage?.dataset.commercePage === "wishlist") {
    const next = renderWishlistPage({
      products: readWishlist(),
      empty: page.mobile?.wishlist,
      ctx,
      renderProductCard,
    });
    mainPage.replaceWith(next);
  }

  const wishMount = document.querySelector('[data-mobile-commerce-mount="wishlist"]');
  if (wishMount) {
    wishMount.replaceChildren(
      renderWishlistPage({
        products: readWishlist(),
        empty: page.mobile?.wishlist,
        ctx,
        renderProductCard,
      }),
    );
  }

  if (document.body.classList.contains("bag-drawer-open")) {
    refreshBagDrawerContents();
  }

  document.querySelectorAll(".product-card[data-product-id]").forEach((card) => {
    const id = card.dataset.productId;
    const button = card.querySelector(".product-card__wishlist");
    if (button && id) setWishlistButtonState(button, isWishlisted(id));
  });
  document.querySelectorAll("[data-product-page] [data-commerce-action='wishlist-toggle']").forEach((button) => {
    const id = button.closest("[data-product-page]")?.dataset.productId;
    if (id) setWishlistButtonState(button, isWishlisted(id));
  });

  syncNavCommerceCounts();
}

function bindCommerceInteractions(root = document) {
  if (root !== document) return;
  if (document.documentElement.dataset.commerceDelegation === "1") return;
  document.documentElement.dataset.commerceDelegation = "1";

  document.addEventListener("click", (event) => {
    const bagOpen = event.target.closest?.("[data-bag-open]");
    if (bagOpen) {
      event.preventDefault();
      setBagDrawerOpen(true);
      return;
    }

    const bagClose = event.target.closest?.("[data-bag-close]");
    if (bagClose) {
      const isLink = bagClose.tagName === "A" && bagClose.getAttribute("href");
      if (!isLink) event.preventDefault();
      setBagDrawerOpen(false);
      return;
    }

    const wishlistBtn = event.target.closest?.("[data-commerce-action='wishlist-toggle'], .product-card__wishlist");
    if (wishlistBtn) {
      event.preventDefault();
      event.stopPropagation();
      const product = parseProductPayload(wishlistBtn);
      if (!product) return;
      if (!wishlistBtn.dataset.productName && product.name) {
        wishlistBtn.dataset.productName = product.name;
      }
      const result = toggleWishlist(product);
      setWishlistButtonState(wishlistBtn, result.wishlisted);
      showCommerceToast(result.wishlisted ? "Saved to wishlist" : "Removed from wishlist");
      refreshCommerceSurfaces();
      return;
    }

    const addBtn = event.target.closest?.("[data-commerce-action='add-to-bag'], .product-card__add-to-cart");
    if (addBtn) {
      event.preventDefault();
      event.stopPropagation();
      const product = parseProductPayload(addBtn);
      if (!product) return;
      addToBag(product);
      showCommerceToast("Added to bag");
      refreshCommerceSurfaces();
      setBagDrawerOpen(true);
      return;
    }

    const buyNow = event.target.closest?.("[data-commerce-action='buy-now']");
    if (buyNow) {
      event.preventDefault();
      event.stopPropagation();
      const product = parseProductPayload(buyNow);
      if (!product) return;
      addToBag(product);
      showCommerceToast("Checkout is a playground prototype");
      refreshCommerceSurfaces();
      setBagDrawerOpen(true);
      return;
    }

    const pdpVariant = event.target.closest?.("[data-pdp-variant]");
    if (pdpVariant) {
      event.preventDefault();
      const panel = pdpVariant.closest(".product-detail__purchase");
      const group = pdpVariant.closest("[data-pdp-variants]");
      group?.querySelectorAll("[data-pdp-variant]").forEach((variant) => {
        const selected = variant === pdpVariant;
        variant.classList.toggle("is-selected", selected);
        variant.setAttribute("aria-pressed", String(selected));
      });
      if (panel) {
        const basePrice = Number(panel.dataset.pdpBasePrice || 0);
        const compareAt = Number(panel.dataset.pdpCompareAt || 0);
        const surcharge = Number(pdpVariant.dataset.pdpSurcharge || 0);
        const nextPrice = basePrice + surcharge;
        const priceNode = panel.querySelector(".product-detail__price");
        if (priceNode) {
          priceNode.textContent = `₹${Math.round(nextPrice).toLocaleString("en-IN")}`;
        }
        const stickyPrice = panel.querySelector("[data-pdp-sticky-price]");
        if (stickyPrice) {
          stickyPrice.textContent = `₹${Math.round(nextPrice).toLocaleString("en-IN")}`;
        }
        const compareNode = panel.querySelector(".product-detail__compare");
        if (compareNode && compareAt) {
          compareNode.textContent = `₹${Math.round(compareAt + surcharge).toLocaleString("en-IN")}`;
        }
        try {
          const payload = JSON.parse(panel.dataset.productPayload || "{}");
          payload.variant = pdpVariant.dataset.pdpVariant;
          payload.surcharge = surcharge;
          payload.price = `₹${Math.round(nextPrice).toLocaleString("en-IN")}`;
          if (compareAt) {
            payload.compareAt = `₹${Math.round(compareAt + surcharge).toLocaleString("en-IN")}`;
          }
          panel.dataset.productPayload = JSON.stringify(payload);
        } catch {
          /* ignore malformed prototype payloads */
        }
      }
      return;
    }

    const pdpSwatch = event.target.closest?.("[data-pdp-swatch]");
    if (pdpSwatch) {
      event.preventDefault();
      const group = pdpSwatch.closest("[data-pdp-swatches]");
      group?.querySelectorAll("[data-pdp-swatch]").forEach((swatch) => {
        swatch.setAttribute("aria-pressed", String(swatch === pdpSwatch));
      });
      return;
    }

    const pdpShare = event.target.closest?.("[data-pdp-share]");
    if (pdpShare) {
      event.preventDefault();
      const shareUrl = window.location.href;
      const title = document.title || "Samantha Fab";
      if (navigator.share) {
        navigator.share({ title, url: shareUrl }).catch(() => {});
      } else if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showCommerceToast("Link copied");
        }).catch(() => {});
      }
      return;
    }

    const removeWish = event.target.closest?.("[data-wishlist-remove]");
    if (removeWish) {
      event.preventDefault();
      event.stopPropagation();
      removeWishlist(removeWish.dataset.wishlistRemove);
      showCommerceToast("Removed from wishlist");
      refreshCommerceSurfaces();
      return;
    }

    const bagRemove = event.target.closest?.("[data-bag-remove]");
    if (bagRemove) {
      event.preventDefault();
      removeFromBag(bagRemove.dataset.bagRemove);
      showCommerceToast("Removed from bag");
      refreshCommerceSurfaces();
      return;
    }

    const bagQty = event.target.closest?.("[data-bag-qty]");
    if (bagQty) {
      event.preventDefault();
      const id = bagQty.dataset.bagQty;
      const delta = Number(bagQty.dataset.bagQtyDelta || 0);
      const item = readBag().find((entry) => entry.id === id);
      if (!item) return;
      setBagQuantity(id, (item.quantity || 1) + delta);
      refreshCommerceSurfaces();
      return;
    }

    const bagMove = event.target.closest?.("[data-bag-move-wishlist]");
    if (bagMove) {
      event.preventDefault();
      moveBagItemToWishlist(bagMove.dataset.bagMoveWishlist);
      showCommerceToast("Moved to wishlist");
      refreshCommerceSurfaces();
      return;
    }

    const checkout = event.target.closest?.("[data-bag-checkout]");
    if (checkout) {
      event.preventDefault();
      showCommerceToast("Checkout is a playground prototype");
    }
  });

  document.addEventListener("keydown", (event) => {
    const drawer = document.querySelector("[data-bag-drawer]");
    if (!drawer?.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setBagDrawerOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [...drawer.querySelectorAll('.bag-drawer__panel a[href], .bag-drawer__panel button:not([disabled])')];
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  });

}

if (openBagOnLoad) {
  const url = new URL(window.location.href);
  if (url.searchParams.get("route") === "bag" || url.searchParams.get("route") === "cart") {
    url.searchParams.delete("route");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
  setBagDrawerOpen(true);
}

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
  const tabButtons = [...mobileBottomBar.querySelectorAll("[data-mobile-tab]")];

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mobileTab === "explore") {
        setSearchOverlayOpen(true);
        return;
      }
      if (button.dataset.mobileTab === "bag") {
        return;
      }
      setMobileTabState(button.dataset.mobileTab);
    });
  });

  setMobileTabState(wishlistView ? "wishlist" : "home");
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

function readCheckedValues(scope, name) {
  return [...scope.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function readFilterStateFrom(scope, base = collectionState) {
  const priceMinInput = scope.querySelector('[data-filter-key="priceMin"]');
  const priceMaxInput = scope.querySelector('[data-filter-key="priceMax"]');
  return {
    ...base,
    availability: readCheckedValues(scope, "availability"),
    categories: readCheckedValues(scope, "categories"),
    collectionFilters: readCheckedValues(scope, "collectionFilters"),
    sizes: readCheckedValues(scope, "sizes"),
    colors: readCheckedValues(scope, "colors"),
    priceMin: priceMinInput?.value !== "" && priceMinInput ? Number(priceMinInput.value) : null,
    priceMax: priceMaxInput?.value !== "" && priceMaxInput ? Number(priceMaxInput.value) : null,
  };
}

function setCollectionSheetOpen(id, open) {
  const sheet = document.querySelector(`[data-collection-sheet="${id}"]`);
  if (!sheet) return;
  sheet.classList.toggle("is-open", open);
  sheet.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("collection-sheet-open", open);
}

function closeAllCollectionSheets() {
  document.querySelectorAll("[data-collection-sheet]").forEach((sheet) => {
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("collection-sheet-open");
}

function rerenderCollectionPlp() {
  if (!collectionSlug) return;
  const main = document.querySelector(".site-main");
  if (!main) return;
  const view = buildCollectionView(collectionSlug, collectionState);
  const next = renderCollectionPlp({
    ...view,
    ctx: { notesEnabled },
    renderProductCard,
  });
  main.replaceChildren(next);
  bindCollectionPlp(main);
  bindCommerceInteractions(main);
}

function bindCollectionPlp(root = document) {
  const plp = root.querySelector?.("[data-collection-plp]") || document.querySelector("[data-collection-plp]");
  if (!plp) return;

  const sidebar = plp.querySelector(".collection-plp__sidebar [data-collection-filters]");
  const desktopSort = plp.querySelector("[data-collection-sort]");

  const applyDesktopFilters = () => {
    if (!sidebar) return;
    collectionState = {
      ...readFilterStateFrom(sidebar, collectionState),
      sort: desktopSort?.value || collectionState.sort,
    };
    rerenderCollectionPlp();
  };

  sidebar?.addEventListener("change", applyDesktopFilters);
  desktopSort?.addEventListener("change", () => {
    collectionState = { ...collectionState, sort: desktopSort.value };
    rerenderCollectionPlp();
  });

  plp.querySelector("[data-collection-clear]")?.addEventListener("click", () => {
    collectionState = emptyFilterState();
    rerenderCollectionPlp();
  });

  plp.querySelectorAll("[data-collection-open-sheet]").forEach((button) => {
    button.addEventListener("click", () => setCollectionSheetOpen(button.dataset.collectionOpenSheet, true));
  });

  plp.querySelectorAll("[data-collection-sheet-close]").forEach((button) => {
    button.addEventListener("click", () => setCollectionSheetOpen(button.dataset.collectionSheetClose, false));
  });

  plp.querySelector("[data-collection-apply-filters]")?.addEventListener("click", () => {
    const filterSheet = plp.querySelector('[data-collection-sheet="filters"]');
    const filters = filterSheet?.querySelector("[data-collection-filters]");
    if (filters) {
      collectionState = {
        ...readFilterStateFrom(filters, collectionState),
        sort: collectionState.sort,
      };
    }
    closeAllCollectionSheets();
    rerenderCollectionPlp();
  });

  plp.querySelectorAll("[data-collection-sort-option]").forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      collectionState = { ...collectionState, sort: input.value };
      closeAllCollectionSheets();
      rerenderCollectionPlp();
    });
  });

  plp.querySelectorAll("[data-facet-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".collection-facet");
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded));
      section?.classList.toggle("is-collapsed", !expanded);
      const chevron = button.querySelector(".collection-facet__chevron");
      chevron?.classList.toggle("is-open", expanded);
    });
  });

  plp.querySelectorAll("[data-facet-search]").forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.facetSearch;
      const list = input.closest(".collection-facet")?.querySelector(`[data-facet-list="${key}"]`);
      const query = input.value.trim().toLowerCase();
      list?.querySelectorAll(".collection-check, .collection-size-chip").forEach((row) => {
        const label = row.textContent?.toLowerCase() || "";
        row.hidden = Boolean(query) && !label.includes(query);
      });
    });
  });
}

if (collectionSlug) {
  bindCollectionPlp(document);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllCollectionSheets();
  });
}
