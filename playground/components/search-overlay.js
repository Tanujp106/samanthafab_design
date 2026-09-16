import { productIdFrom } from "../lib/commerce-store.mjs";

const defaultTerms = ["sarees", "silk sarees", "ready-to-wear", "wedding edit"];

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
  return String(value || "").trim().toLowerCase();
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

export function filterSearchProducts(products = [], query = "") {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [...products];
  return products.filter((product) => searchableProductText(product).includes(normalized));
}

function renderSearchSuggestion(label, query = label) {
  const button = element("button", "search-overlay__suggestion", label);
  button.type = "button";
  button.dataset.searchSuggestion = query;
  return button;
}

function renderRecentSearch(label, query) {
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

  const body = element("div", "search-overlay__body");
  const sidebar = element("aside", "search-overlay__sidebar");

  const recentSection = element("section", "search-overlay__sidebar-section");
  const recentHeader = element("div", "search-overlay__sidebar-heading");
  recentHeader.append(element("h2", "search-overlay__sidebar-title", "Recent searches"));
  const recentClear = element("button", "search-overlay__sidebar-clear", "Clear all");
  recentClear.type = "button";
  recentClear.dataset.searchRecentClearAll = "true";
  recentClear.setAttribute("aria-label", "Clear recent searches");
  recentHeader.append(recentClear);
  const recentList = element("div", "search-overlay__recent-list");
  recentList.dataset.searchRecentList = "true";
  recentList.append(renderRecentSearch("Sarees", "sarees"));
  recentSection.append(recentHeader, recentList);

  const trendingSection = element("section", "search-overlay__sidebar-section");
  trendingSection.append(element("h2", "search-overlay__sidebar-title", "Trending searches"));
  const trendingList = element("div", "search-overlay__suggestions");
  [
    ["Sarees", "sarees"],
    ["Ready-to-wear", "ready-to-wear"],
    ["Wedding edits", "wedding"],
    ["Everyday", "everyday"],
    ["Festive", "festive"],
  ].forEach(([label, query]) => trendingList.append(renderSearchSuggestion(label, query)));
  trendingSection.append(trendingList);
  sidebar.append(recentSection, trendingSection);

  const productsSection = element("main", "search-overlay__products");
  const productsHeader = element("header", "search-overlay__products-header");
  const productsTitle = element("h1", "search-overlay__products-title", "Top products");
  productsTitle.id = "search-overlay-title";
  productsHeader.append(productsTitle);

  const grid = element("div", "search-overlay__product-grid");
  grid.dataset.searchProductGrid = "true";
  filterSearchProducts(products).forEach((product) => {
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

  const empty = element("div", "search-overlay__empty");
  empty.dataset.searchEmpty = "true";
  empty.hidden = true;

  productsSection.append(productsHeader, grid, empty);
  body.append(sidebar, productsSection);
  panel.append(header, body);
  root.append(backdrop, panel);
  return root;
}
