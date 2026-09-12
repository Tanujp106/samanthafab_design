export const DEFAULT_SORT = "popular";

export function parsePriceValue(priceString) {
  if (!priceString) return 0;
  const digits = String(priceString).replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function hasOverlap(selected, values) {
  if (!selected?.length) return true;
  const set = new Set(values || []);
  return selected.some((item) => set.has(item));
}

function matchesFilters(product, state = {}) {
  const availability = state.availability || [];
  if (availability.length && !availability.includes(product.availability)) {
    return false;
  }

  const priceMin = state.priceMin;
  const priceMax = state.priceMax;
  const price = Number(product.priceValue ?? parsePriceValue(product.price));
  if (priceMin != null && priceMin !== "" && price < Number(priceMin)) return false;
  if (priceMax != null && priceMax !== "" && price > Number(priceMax)) return false;

  if (state.categories?.length) {
    const categoryValues = [product.tag].filter(Boolean);
    if (!hasOverlap(state.categories, categoryValues)) return false;
  }

  if (state.collectionFilters?.length) {
    if (!hasOverlap(state.collectionFilters, product.collections || [])) return false;
  }

  if (!hasOverlap(state.sizes, product.sizes || [])) return false;

  const colorLabels = (product.colors || product.swatches || []).map((c) => c.label);
  if (!hasOverlap(state.colors, colorLabels)) return false;

  return true;
}

function sortProducts(products, sort = DEFAULT_SORT) {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => (a.priceValue ?? 0) - (b.priceValue ?? 0));
    case "price-desc":
      return list.sort((a, b) => (b.priceValue ?? 0) - (a.priceValue ?? 0));
    case "newest":
      return list.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    case "popular":
    default:
      return list;
  }
}

export function applyCollectionFilters(products, state = {}) {
  const filtered = (products || []).filter((product) => matchesFilters(product, state));
  return sortProducts(filtered, state.sort || DEFAULT_SORT);
}

export function buildFacetCounts(products = []) {
  const availability = { in_stock: 0, out_of_stock: 0 };
  const categories = {};
  const collections = {};
  const sizes = {};
  const colors = {};

  products.forEach((product) => {
    if (product.availability === "out_of_stock") availability.out_of_stock += 1;
    else availability.in_stock += 1;

    if (product.tag) categories[product.tag] = (categories[product.tag] || 0) + 1;

    (product.collections || []).forEach((name) => {
      collections[name] = (collections[name] || 0) + 1;
    });

    (product.sizes || []).forEach((size) => {
      sizes[size] = (sizes[size] || 0) + 1;
    });

    (product.colors || product.swatches || []).forEach((swatch) => {
      if (!swatch?.label) return;
      colors[swatch.label] = (colors[swatch.label] || 0) + 1;
    });
  });

  return { availability, categories, collections, sizes, colors };
}
