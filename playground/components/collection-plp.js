import { buildFacetCounts, DEFAULT_SORT, parsePriceValue } from "../lib/collection-filters.mjs";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function titleCaseSlug(slug) {
  return String(slug || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function priceBounds(products) {
  if (!products.length) return { min: 0, max: 0 };
  const values = products.map((p) => p.priceValue ?? parsePriceValue(p.price));
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function renderBottomSheet({ id, title, body, footer }) {
  const root = element("div", "collection-sheet");
  root.dataset.collectionSheet = id;
  root.setAttribute("aria-hidden", "true");

  const scrim = element("button", "collection-sheet__scrim");
  scrim.type = "button";
  scrim.setAttribute("aria-label", "Close");
  scrim.dataset.collectionSheetClose = id;

  const panel = element("div", "collection-sheet__panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", title);

  const head = element("div", "collection-sheet__head");
  head.append(element("h2", "collection-sheet__title", title));
  const close = element("button", "collection-sheet__close");
  close.type = "button";
  close.setAttribute("aria-label", "Close");
  close.dataset.collectionSheetClose = id;
  close.textContent = "×";
  head.append(close);

  const bodyNode = element("div", "collection-sheet__body");
  if (body) bodyNode.append(body);

  panel.append(head, bodyNode);
  if (footer) {
    const foot = element("div", "collection-sheet__footer");
    foot.append(footer);
    panel.append(foot);
  }

  root.append(scrim, panel);
  return root;
}

function facetHeader(label, open = true) {
  const button = element("button", "collection-facet__toggle");
  button.type = "button";
  button.dataset.facetToggle = "true";
  button.setAttribute("aria-expanded", String(open));
  button.append(element("span", "collection-facet__label", label));
  button.append(element("span", "collection-facet__chevron", open ? "▴" : "▾"));
  return button;
}

function checkboxRow({ name, value, label, count, checked }) {
  const row = element("label", "collection-check");
  const input = element("input", "collection-check__input");
  input.type = "checkbox";
  input.name = name;
  input.value = value;
  input.checked = Boolean(checked);
  input.dataset.filterKey = name;
  const text = element("span", "collection-check__text", `${label}${count != null ? ` (${count})` : ""}`);
  row.append(input, text);
  return row;
}

function renderAvailabilityFacet(counts, state) {
  const section = element("section", "collection-facet");
  section.dataset.facet = "availability";
  section.append(facetHeader("Availability"));
  const body = element("div", "collection-facet__body");
  body.append(
    checkboxRow({
      name: "availability",
      value: "in_stock",
      label: "In stock",
      count: counts.availability.in_stock,
      checked: state.availability?.includes("in_stock"),
    }),
    checkboxRow({
      name: "availability",
      value: "out_of_stock",
      label: "Out of stock",
      count: counts.availability.out_of_stock,
      checked: state.availability?.includes("out_of_stock"),
    }),
  );
  section.append(body);
  return section;
}

function renderPriceFacet(bounds, state) {
  const section = element("section", "collection-facet");
  section.dataset.facet = "price";
  section.append(facetHeader("Price"));
  const body = element("div", "collection-facet__body");

  const slider = element("div", "collection-price__slider");
  const minRange = element("input", "collection-price__range");
  minRange.type = "range";
  minRange.min = String(bounds.min);
  minRange.max = String(bounds.max);
  minRange.value = String(state.priceMin ?? bounds.min);
  minRange.dataset.filterKey = "priceMin";
  minRange.setAttribute("aria-label", "Minimum price");

  const maxRange = element("input", "collection-price__range");
  maxRange.type = "range";
  maxRange.min = String(bounds.min);
  maxRange.max = String(bounds.max);
  maxRange.value = String(state.priceMax ?? bounds.max);
  maxRange.dataset.filterKey = "priceMax";
  maxRange.setAttribute("aria-label", "Maximum price");
  slider.append(minRange, maxRange);

  const inputs = element("div", "collection-price__inputs");
  const minWrap = element("label", "collection-price__field");
  minWrap.append(element("span", "collection-price__prefix", "₹"));
  const minInput = element("input", "collection-price__input");
  minInput.type = "number";
  minInput.name = "priceMin";
  minInput.value = String(state.priceMin ?? bounds.min);
  minInput.dataset.filterKey = "priceMin";
  minWrap.append(minInput);

  const maxWrap = element("label", "collection-price__field");
  maxWrap.append(element("span", "collection-price__prefix", "₹"));
  const maxInput = element("input", "collection-price__input");
  maxInput.type = "number";
  maxInput.name = "priceMax";
  maxInput.value = String(state.priceMax ?? bounds.max);
  maxInput.dataset.filterKey = "priceMax";
  maxWrap.append(maxInput);

  inputs.append(minWrap, element("span", "collection-price__to", "to"), maxWrap);
  body.append(slider, inputs);
  section.append(body);
  return section;
}

function renderSearchableListFacet({ key, title, entries, selected, searchKey }) {
  const section = element("section", "collection-facet");
  section.dataset.facet = key;
  section.append(facetHeader(title));
  const body = element("div", "collection-facet__body");

  const search = element("input", "collection-facet__search");
  search.type = "search";
  search.placeholder = "Search";
  search.setAttribute("aria-label", `Search ${title}`);
  search.dataset.facetSearch = searchKey || key;
  body.append(search);

  const list = element("div", "collection-facet__list");
  list.dataset.facetList = key;
  entries.forEach(([value, count]) => {
    list.append(
      checkboxRow({
        name: key,
        value,
        label: value,
        count,
        checked: selected?.includes(value),
      }),
    );
  });
  body.append(list);
  section.append(body);
  return section;
}

function renderSizeFacet(counts, state) {
  const section = element("section", "collection-facet");
  section.dataset.facet = "sizes";
  section.append(facetHeader("Size"));
  const body = element("div", "collection-facet__body");
  const chips = element("div", "collection-size-chips");
  Object.entries(counts.sizes)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([size, count]) => {
      const chip = element("label", "collection-size-chip");
      const input = element("input", "collection-size-chip__input");
      input.type = "checkbox";
      input.name = "sizes";
      input.value = size;
      input.checked = Boolean(state.sizes?.includes(size));
      input.dataset.filterKey = "sizes";
      chip.append(input, element("span", "collection-size-chip__label", `${size} (${count})`));
      chips.append(chip);
    });
  body.append(chips);
  section.append(body);
  return section;
}

function renderColorFacet(counts, state, products) {
  const section = element("section", "collection-facet");
  section.dataset.facet = "colors";
  section.append(facetHeader("Color"));
  const body = element("div", "collection-facet__body");
  const swatches = element("div", "collection-color-swatches");

  const colorMeta = new Map();
  products.forEach((product) => {
    (product.colors || product.swatches || []).forEach((swatch) => {
      if (swatch?.label && !colorMeta.has(swatch.label)) colorMeta.set(swatch.label, swatch.color);
    });
  });

  Object.entries(counts.colors).forEach(([label, count]) => {
    const item = element("label", "collection-color");
    item.title = `${label} (${count})`;
    const input = element("input", "collection-color__input");
    input.type = "checkbox";
    input.name = "colors";
    input.value = label;
    input.checked = Boolean(state.colors?.includes(label));
    input.dataset.filterKey = "colors";
    const dot = element("span", "collection-color__swatch");
    dot.style.setProperty("--swatch", colorMeta.get(label) || "#ccc");
    dot.setAttribute("aria-hidden", "true");
    item.append(input, dot, element("span", "sr-only", `${label} (${count})`));
    swatches.append(item);
  });

  body.append(swatches);
  section.append(body);
  return section;
}

export function renderFilterFacets({ products, state, allProducts }) {
  const source = allProducts || products;
  const counts = buildFacetCounts(source);
  const bounds = priceBounds(source);
  const root = element("div", "collection-filters");
  root.dataset.collectionFilters = "true";

  const categoryEntries = Object.entries(counts.categories).sort(([a], [b]) => a.localeCompare(b));
  const collectionChecks = Object.entries(counts.collections).sort(([a], [b]) => a.localeCompare(b));

  root.append(
    renderAvailabilityFacet(counts, state),
    renderPriceFacet(bounds, state),
    renderSearchableListFacet({
      key: "categories",
      title: "Category",
      entries: categoryEntries,
      selected: state.categories,
    }),
  );

  const collectionsSection = element("section", "collection-facet");
  collectionsSection.dataset.facet = "collectionFilters";
  collectionsSection.append(facetHeader("Collections"));
  const collectionsBody = element("div", "collection-facet__body");
  const collectionSearch = element("input", "collection-facet__search");
  collectionSearch.type = "search";
  collectionSearch.placeholder = "Search";
  collectionSearch.setAttribute("aria-label", "Search Collections");
  collectionSearch.dataset.facetSearch = "collectionFilters";
  const collectionList = element("div", "collection-facet__list");
  collectionList.dataset.facetList = "collectionFilters";
  collectionChecks.forEach(([slug, count]) => {
    collectionList.append(
      checkboxRow({
        name: "collectionFilters",
        value: slug,
        label: titleCaseSlug(slug),
        count,
        checked: state.collectionFilters?.includes(slug),
      }),
    );
  });
  collectionsBody.append(collectionSearch, collectionList);
  collectionsSection.append(collectionsBody);
  root.append(collectionsSection, renderSizeFacet(counts, state), renderColorFacet(counts, state, source));

  return root;
}

function renderSortSelect(state) {
  const wrap = element("label", "collection-plp__sort");
  wrap.append(element("span", "collection-plp__sort-label", "Sort by :"));
  const select = element("select", "collection-plp__sort-select");
  select.dataset.collectionSort = "true";
  select.setAttribute("aria-label", "Sort products");
  SORT_OPTIONS.forEach((option) => {
    const node = element("option", "", option.label);
    node.value = option.value;
    if ((state.sort || DEFAULT_SORT) === option.value) node.selected = true;
    select.append(node);
  });
  wrap.append(select);
  return wrap;
}

function renderSortSheetBody(state) {
  const list = element("div", "collection-sort-list");
  SORT_OPTIONS.forEach((option) => {
    const row = element("label", "collection-sort-option");
    const input = element("input", "collection-sort-option__input");
    input.type = "radio";
    input.name = "collection-sort";
    input.value = option.value;
    input.checked = (state.sort || DEFAULT_SORT) === option.value;
    input.dataset.collectionSortOption = option.value;
    row.append(input, element("span", "collection-sort-option__label", option.label));
    list.append(row);
  });
  return list;
}

export function renderContentPage({ page }) {
  const root = element("section", "content-page");
  root.dataset.contentPage = "true";

  if (!page) {
    const empty = element("div", "content-page__inner");
    empty.append(element("h1", "content-page__title", "Page not found"));
    empty.append(
      element("p", "content-page__copy", "This playground page is not available yet."),
    );
    const home = element("a", "button button--fill", "Back to home");
    home.href = "/design";
    empty.append(home);
    root.append(empty);
    return root;
  }

  const crumbs = element("nav", "collection-plp__breadcrumbs");
  crumbs.setAttribute("aria-label", "Breadcrumb");
  (page.breadcrumbs || []).forEach((crumb, index, list) => {
    if (index > 0) crumbs.append(element("span", "collection-plp__crumb-sep", "/"));
    if (crumb.href && index < list.length - 1) {
      const link = element("a", "collection-plp__crumb", crumb.label);
      link.href = crumb.href;
      crumbs.append(link);
    } else {
      crumbs.append(element("span", "collection-plp__crumb collection-plp__crumb--current", crumb.label));
    }
  });

  const inner = element("div", "content-page__inner");
  inner.append(element("h1", "content-page__title", page.title));
  if (page.copy) inner.append(element("p", "content-page__copy", page.copy));
  if (page.cta) {
    const action = element("a", "button button--fill", page.cta.label);
    action.href = page.cta.href;
    inner.append(action);
  }

  root.append(crumbs, inner);
  return root;
}

export function renderCollectionPlp({
  collection,
  products,
  allProducts,
  state = {},
  ctx = {},
  renderProductCard,
}) {
  const root = element("section", "collection-plp");
  root.dataset.collectionPlp = "true";

  if (!collection) {
    const empty = element("div", "collection-plp__empty");
    empty.append(element("h1", "collection-plp__title", "Collection not found"));
    empty.append(element("p", "collection-plp__copy", "This collection is not available in the playground yet."));
    const home = element("a", "button button--fill", "Back to home");
    home.href = "/design";
    empty.append(home);
    root.append(empty);
    return root;
  }

  const crumbs = element("nav", "collection-plp__breadcrumbs");
  crumbs.setAttribute("aria-label", "Breadcrumb");
  (collection.breadcrumbs || []).forEach((crumb, index, list) => {
    if (index > 0) crumbs.append(element("span", "collection-plp__crumb-sep", "/"));
    if (crumb.href && index < list.length - 1) {
      const link = element("a", "collection-plp__crumb", crumb.label);
      link.href = crumb.href;
      crumbs.append(link);
    } else {
      crumbs.append(element("span", "collection-plp__crumb collection-plp__crumb--current", crumb.label));
    }
  });

  const header = element("div", "collection-plp__header");
  const heading = element("div", "collection-plp__heading");
  const title = element("h1", "collection-plp__title", collection.title);
  const count = element("span", "collection-plp__count", `(${products.length} products)`);
  heading.append(title, count);
  header.append(heading, renderSortSelect(state));

  const mobileBar = element("div", "collection-plp__mobile-bar");
  const filterBtn = element("button", "collection-plp__mobile-action");
  filterBtn.type = "button";
  filterBtn.dataset.collectionOpenSheet = "filters";
  filterBtn.textContent = "Filters";
  const sortBtn = element("button", "collection-plp__mobile-action");
  sortBtn.type = "button";
  sortBtn.dataset.collectionOpenSheet = "sort";
  sortBtn.textContent = "Sort";
  mobileBar.append(filterBtn, sortBtn);

  const layout = element("div", "collection-plp__layout");
  const sidebar = element("aside", "collection-plp__sidebar");
  sidebar.append(element("h2", "collection-plp__sidebar-title", "Filters"));
  sidebar.append(renderFilterFacets({ products, state, allProducts: allProducts || products }));

  const clear = element("button", "collection-plp__clear");
  clear.type = "button";
  clear.dataset.collectionClear = "true";
  clear.textContent = "Clear all";
  sidebar.append(clear);

  const gridWrap = element("div", "collection-plp__results");
  const grid = element("div", "collection-plp__grid");
  grid.dataset.collectionGrid = "true";
  if (!products.length) {
    grid.append(element("p", "collection-plp__none", "No products match these filters."));
  } else {
    products.forEach((product) => {
      grid.append(
        renderProductCard(product, ctx, {
          className: "design-new-arrivals__card collection-plp__card",
          commerce: true,
        }),
      );
    });
  }
  gridWrap.append(grid);
  layout.append(sidebar, gridWrap);

  root.append(crumbs, header, mobileBar, layout);

  const viewResults = element("button", "button button--fill collection-sheet__apply");
  viewResults.type = "button";
  viewResults.dataset.collectionApplyFilters = "true";
  viewResults.textContent = "View results";

  const filterSheetBody = renderFilterFacets({
    products,
    state,
    allProducts: allProducts || products,
  });
  root.append(
    renderBottomSheet({
      id: "filters",
      title: "Filters",
      body: filterSheetBody,
      footer: viewResults,
    }),
    renderBottomSheet({
      id: "sort",
      title: "Sort",
      body: renderSortSheetBody(state),
    }),
  );

  return root;
}

export { SORT_OPTIONS };
