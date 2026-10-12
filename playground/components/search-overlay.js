import { productIdFrom } from "../lib/commerce-store.mjs";

const defaultTerms = ["sarees", "silk sarees", "ready-to-wear", "wedding edit"];
const trendingSearches = [
  ["Indigo ready-to-wear", "indigo ready-to-wear"],
  ["Handblock cotton", "handblock cotton"],
  ["Wedding silk sarees", "wedding silk sarees"],
  ["Marigold prints", "marigold print"],
  ["Everyday cotton", "everyday cotton"],
];
const browseCategories = [
  { label: "Ready to wear", slug: "ready-to-wear", image: "/assets/design-collection-ready-to-wear.jpg" },
  { label: "Work", slug: "office-wear", image: "/assets/design-collection-work.jpg" },
  { label: "Everyday", slug: "everyday", image: "/assets/design-collection-everyday.jpg" },
  { label: "Festive", slug: "festive", image: "/assets/design-collection-festive.jpg" },
  { label: "Wedding", slug: "wedding", image: "/assets/design-collection-wedding.jpg" },
];
const searchAliases = { saris: "saree", sari: "saree", sarees: "saree", rtw: "ready", handblocked: "handblock" };

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function searchIcon(className = "search-overlay__icon") {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", className);
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.5");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>';
  return icon;
}

function closeIcon(className = "search-overlay__close-icon") {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", className);
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.5");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = '<path d="M5 5l14 14M19 5 5 19"/>';
  return icon;
}

export function normalizeSearchQuery(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((token) => searchAliases[token] || token)
    .join(" ");
}

export function searchableProductText(product = {}) {
  return [
    product.name,
    product.material,
    product.tag,
    ...(Array.isArray(product.collections) ? product.collections : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function oneEditApart(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1 || a.length < 4) return false;
  let left = 0;
  let right = 0;
  let edits = 0;
  while (left < a.length && right < b.length) {
    if (a[left] === b[right]) {
      left += 1;
      right += 1;
    } else {
      edits += 1;
      if (edits > 1) return false;
      if (a.length >= b.length) left += 1;
      if (b.length >= a.length) right += 1;
    }
  }
  return edits + Number(left < a.length || right < b.length) <= 1;
}

export function filterSearchProducts(products = [], query = "") {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [...products];
  const queryWords = normalized.split(" ");
  return products.filter((product) => {
    const words = new Set(normalizeSearchQuery(searchableProductText(product)).split(" "));
    return queryWords.every((queryWord) => [...words].some((word) =>
      word.includes(queryWord) || oneEditApart(queryWord, word)));
  });
}

export function updateSearchResults(root, products, value = "") {
  const sections = root?.querySelectorAll("[data-search-product-section]") || [];
  if (!sections.length) return 0;
  const query = normalizeSearchQuery(value);
  const matchingIds = new Set(filterSearchProducts(products, query).map((product) => productIdFrom(product)));
  let visibleCount = 0;

  sections.forEach((section) => {
    let sectionCount = 0;
    section.querySelectorAll("[data-search-product]").forEach((card) => {
      card.hidden = Boolean(query) && !matchingIds.has(card.dataset.productId);
      if (!card.hidden) sectionCount += 1;
    });
    section.querySelector("[data-search-product-grid]").hidden = sectionCount === 0;
    if (section.dataset.searchProductSection === "ready-to-wear") section.hidden = sectionCount === 0;
    const link = section.querySelector("[data-search-view-all]");
    if (link) {
      const slug = link.dataset.searchViewAll;
      link.href = query
        ? `/design?route=collection&slug=sarees&q=${encodeURIComponent(value.trim())}`
        : `/design?route=collection&slug=${slug}`;
      link.textContent = query ? "View all results" : "View all";
      const arrow = document.createElement("span");
      arrow.className = "search-overlay__view-all-arrow";
      arrow.textContent = "↗";
      link.append(arrow);
      link.hidden = sectionCount === 0;
    }
    visibleCount += sectionCount;
  });

  root.querySelector("[data-search-form]")?.classList.toggle("is-query", Boolean(query));
  const title = root.querySelector(".search-overlay__products-title");
  if (title) title.textContent = query
    ? visibleCount ? `Results for “${value.trim()}”` : `No results for “${value.trim()}”`
    : "Best sellers";
  const empty = root.querySelector("[data-search-empty]");
  if (empty) empty.hidden = visibleCount > 0;
  const alternatives = root.querySelector("[data-search-alternatives]");
  if (alternatives) alternatives.hidden = visibleCount > 0;
  return visibleCount;
}

function renderSearchSuggestion(label, query = label) {
  const button = element("button", "search-overlay__suggestion", label);
  button.type = "button";
  button.dataset.searchSuggestion = query;
  return button;
}

function renderTrendingSearch(label, query, index) {
  const button = renderSearchSuggestion(label, query);
  button.classList.add("search-overlay__trending-item");
  button.textContent = "";
  const trendingIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  trendingIcon.setAttribute("class", "search-overlay__trending-icon");
  trendingIcon.setAttribute("viewBox", "0 0 24 24");
  trendingIcon.setAttribute("aria-hidden", "true");
  trendingIcon.setAttribute("fill", "none");
  trendingIcon.setAttribute("stroke", "currentColor");
  trendingIcon.setAttribute("stroke-width", "1.6");
  trendingIcon.setAttribute("stroke-linecap", "round");
  trendingIcon.setAttribute("stroke-linejoin", "round");
  trendingIcon.innerHTML = '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>';
  button.append(
    element("span", "search-overlay__trending-index", String(index + 1).padStart(2, "0")),
    element("span", "search-overlay__trending-label", label),
    trendingIcon,
  );
  return button;
}

function renderSmallProduct(product) {
  const link = element("a", "search-overlay__small-product");
  link.href = `/design?route=product&slug=${encodeURIComponent(productIdFrom(product))}`;
  const image = element("img", "search-overlay__small-image");
  image.src = product.media?.src || "";
  image.alt = "";
  image.loading = "lazy";
  link.append(
    image,
    element("span", "search-overlay__small-copy"),
    element("span", "search-overlay__small-arrow", "↗"),
  );
  link.querySelector(".search-overlay__small-copy").append(
    element("span", "search-overlay__small-name", product.name),
    element("span", "search-overlay__small-price", product.price),
  );
  return link;
}

export function renderRecentSearch(label, query = label) {
  const row = element("div", "search-overlay__recent-item");
  const button = renderSearchSuggestion(label, query);
  button.classList.add("search-overlay__recent-button");
  const clock = element("span", "search-overlay__recent-icon", "◷");
  button.textContent = "";
  button.append(clock, document.createTextNode(label));
  const clear = element("button", "search-overlay__recent-remove", "×");
  clear.type = "button";
  clear.dataset.searchRecentClear = query;
  clear.setAttribute("aria-label", `Remove recent search ${label}`);
  row.append(button, clear);
  return row;
}

export function renderSearchOverlay({
  products = [],
  readyToWearProducts = [],
  recentlyViewed = [],
  recentSearches = [],
  terms = defaultTerms,
  ctx = {},
  renderProductCard,
} = {}) {
  const searchTerms = Array.isArray(terms) && terms.length ? terms : defaultTerms;
  const root = element("div", "search-overlay");
  root.dataset.searchOverlay = "true";
  root.dataset.searchTerms = JSON.stringify(searchTerms);
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("aria-labelledby", "search-overlay-title");
  root.inert = true;

  const backdrop = element("button", "search-overlay__backdrop");
  backdrop.type = "button";
  backdrop.dataset.searchClose = "true";
  backdrop.setAttribute("aria-label", "Close search");

  const panel = element("div", "search-overlay__panel");
  const header = element("header", "search-overlay__header");
  const form = element("form", "search-overlay__form");
  form.dataset.searchForm = "true";
  form.setAttribute("role", "search");

  const icon = searchIcon();
  const inputWrap = element("div", "search-overlay__input-wrap");
  const input = element("input", "search-overlay__input");
  input.type = "search";
  input.name = "q";
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Search products");
  input.dataset.searchInput = "true";
  input.placeholder = "";
  const animatedPlaceholder = element(
    "span",
    "search-overlay__animated-placeholder",
    searchTerms[0],
  );
  animatedPlaceholder.dataset.searchAnimatedPlaceholder = "true";
  animatedPlaceholder.setAttribute("aria-hidden", "true");
  inputWrap.append(input, animatedPlaceholder);

  form.append(icon, inputWrap);

  const close = element("button", "search-overlay__close");
  close.type = "button";
  close.dataset.searchClose = "true";
  close.setAttribute("aria-label", "Close search");
  close.append(closeIcon());
  header.append(form, close);

  const categories = element("nav", "search-overlay__categories");
  categories.setAttribute("aria-label", "Browse categories");
  const categoryList = element("div", "search-overlay__category-list");
  browseCategories.forEach(({ label, slug, image }) => {
    const link = element("a", "search-overlay__category");
    link.href = `/design?route=collection&slug=${slug}`;
    const photo = element("img", "search-overlay__category-image");
    photo.src = image;
    photo.alt = "";
    photo.loading = "lazy";
    link.append(photo, element("span", "search-overlay__category-label", label));
    categoryList.append(link);
  });
  categories.append(categoryList);

  const body = element("div", "search-overlay__body");
  const sidebar = element("aside", "search-overlay__sidebar");

  const recentSection = element("section", "search-overlay__sidebar-section search-overlay__recent-section");
  recentSection.dataset.searchRecentSection = "true";
  recentSection.hidden = recentSearches.length === 0;
  const recentHeader = element("div", "search-overlay__sidebar-heading");
  recentHeader.append(element("h2", "search-overlay__sidebar-title", "Recent searches"));
  const recentClear = element("button", "search-overlay__sidebar-clear", "Clear all");
  recentClear.type = "button";
  recentClear.dataset.searchRecentClearAll = "true";
  recentClear.setAttribute("aria-label", "Clear recent searches");
  recentHeader.append(recentClear);
  const recentList = element("div", "search-overlay__recent-list");
  recentList.dataset.searchRecentList = "true";
  recentSearches.forEach((query) => recentList.append(renderRecentSearch(query)));
  recentSection.append(recentHeader, recentList);

  const trendingSection = element("section", "search-overlay__sidebar-section");
  trendingSection.append(element("h2", "search-overlay__sidebar-title", "Trending searches"));
  const trendingList = element("div", "search-overlay__suggestions");
  trendingSearches.forEach(([label, query], index) =>
    trendingList.append(renderTrendingSearch(label, query, index)));
  trendingSection.append(trendingList);

  const viewedSection = element("section", "search-overlay__sidebar-section search-overlay__viewed-section");
  const viewedProducts = recentlyViewed.length ? recentlyViewed.slice(0, 2) : products.slice(0, 2);
  viewedSection.append(element(
    "h2", "search-overlay__sidebar-title",
    recentlyViewed.length ? "Recently viewed" : "Worth a closer look",
  ));
  const viewedList = element("div", "search-overlay__small-list");
  viewedProducts.forEach((product) => viewedList.append(renderSmallProduct(product)));
  viewedSection.append(viewedList);

  const alternatives = element("section", "search-overlay__sidebar-section search-overlay__alternatives");
  alternatives.dataset.searchAlternatives = "true";
  alternatives.hidden = true;
  alternatives.append(element("h2", "search-overlay__sidebar-title", "Try instead"));
  const alternativeList = element("div", "search-overlay__alternative-list");
  trendingSearches.slice(0, 3).forEach(([label, query]) =>
    alternativeList.append(renderSearchSuggestion(label, query)));
  alternatives.append(alternativeList);
  sidebar.append(recentSection, trendingSection, viewedSection, alternatives);

  const productsSection = element("main", "search-overlay__products");
  function productGroup(title, slug, items, headingTag) {
    const section = element("section", "search-overlay__product-section");
    section.dataset.searchProductSection = slug;
    const groupHeader = element("header", "search-overlay__products-header");
    const heading = element(headingTag, "search-overlay__products-title", title);
    if (headingTag === "h1") heading.id = "search-overlay-title";
    const link = element("a", "search-overlay__view-all", "View all pieces");
    link.dataset.searchViewAll = slug;
    link.href = `/design?route=collection&slug=${slug}`;
    link.append(element("span", "search-overlay__view-all-arrow", "↗"));
    groupHeader.append(heading, link);
    const grid = element("div", "search-overlay__product-grid");
    grid.dataset.searchProductGrid = slug;
    items.forEach((product) => {
      const card = typeof renderProductCard === "function"
        ? renderProductCard(product, ctx, {
            className: "design-new-arrivals__card search-overlay__card",
            commerce: true,
          })
        : element("article", "search-overlay__card", product.name || "Product");
      card.dataset.searchProduct = "true";
      card.dataset.searchText = searchableProductText(product);
      card.dataset.productId = card.dataset.productId || productIdFrom(product);
      grid.append(card);
    });
    section.append(groupHeader, grid);
    return section;
  }
  const bestSellersSection = productGroup("Best sellers", "bestsellers", products, "h1");
  const readyToWearSection = productGroup("Ready to wear", "ready-to-wear", readyToWearProducts, "h2");

  const empty = element("div", "search-overlay__empty");
  empty.dataset.searchEmpty = "true";
  empty.hidden = true;
  empty.append(
    element("span", "search-overlay__empty-kicker", "A different direction"),
    element("p", "search-overlay__empty-message", "Explore the full collection, or try a search from the left."),
  );
  const browseAll = element("a", "search-overlay__empty-link", "Browse all sarees");
  browseAll.href = "/design?route=collection&slug=sarees";
  browseAll.append(element("span", "", "↗"));
  empty.append(browseAll);

  productsSection.append(bestSellersSection, readyToWearSection, empty);
  body.append(sidebar, productsSection);
  panel.append(header, categories, body);
  root.append(backdrop, panel);
  return root;
}
