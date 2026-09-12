import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePriceValue,
  applyCollectionFilters,
  buildFacetCounts,
  DEFAULT_SORT,
} from "../playground/lib/collection-filters.mjs";

const sample = [
  {
    id: "a",
    name: "A",
    price: "₹1,899",
    priceValue: 1899,
    availability: "in_stock",
    tag: "Everyday",
    collections: ["bestsellers", "everyday"],
    sizes: ["Free size"],
    colors: [{ color: "#6b7f5a", label: "Sage" }],
    createdAt: "2026-09-01",
  },
  {
    id: "b",
    name: "B",
    price: "₹2,499",
    priceValue: 2499,
    availability: "in_stock",
    tag: "Ready-to-wear",
    collections: ["bestsellers", "ready-to-wear"],
    sizes: ["S", "M"],
    colors: [{ color: "#1f3a5f", label: "Indigo" }],
    createdAt: "2026-09-10",
  },
  {
    id: "c",
    name: "C",
    price: "₹1,299",
    priceValue: 1299,
    availability: "out_of_stock",
    tag: "Festive",
    collections: ["festive"],
    sizes: ["Free size"],
    colors: [{ color: "#d4a017", label: "Marigold" }],
    createdAt: "2026-08-01",
  },
];

test("parsePriceValue strips currency and commas", () => {
  assert.equal(parsePriceValue("₹1,899"), 1899);
  assert.equal(parsePriceValue("₹2,499"), 2499);
  assert.equal(parsePriceValue(""), 0);
});

test("DEFAULT_SORT is popular", () => {
  assert.equal(DEFAULT_SORT, "popular");
});

test("availability filter keeps matching stock state", () => {
  const result = applyCollectionFilters(sample, {
    availability: ["in_stock"],
    sort: "popular",
  });
  assert.deepEqual(
    result.map((p) => p.id),
    ["a", "b"],
  );
});

test("price range filter is inclusive", () => {
  const result = applyCollectionFilters(sample, {
    priceMin: 1300,
    priceMax: 2000,
    sort: "popular",
  });
  assert.deepEqual(
    result.map((p) => p.id),
    ["a"],
  );
});

test("category and color filters AND together", () => {
  const result = applyCollectionFilters(sample, {
    categories: ["Ready-to-wear"],
    colors: ["Indigo"],
    sort: "popular",
  });
  assert.deepEqual(
    result.map((p) => p.id),
    ["b"],
  );
});

test("size filter matches any selected size", () => {
  const result = applyCollectionFilters(sample, {
    sizes: ["M"],
    sort: "popular",
  });
  assert.deepEqual(
    result.map((p) => p.id),
    ["b"],
  );
});

test("sort by price ascending and descending", () => {
  const asc = applyCollectionFilters(sample, { sort: "price-asc" });
  assert.deepEqual(
    asc.map((p) => p.id),
    ["c", "a", "b"],
  );
  const desc = applyCollectionFilters(sample, { sort: "price-desc" });
  assert.deepEqual(
    desc.map((p) => p.id),
    ["b", "a", "c"],
  );
});

test("sort by newest uses createdAt", () => {
  const result = applyCollectionFilters(sample, { sort: "newest" });
  assert.deepEqual(
    result.map((p) => p.id),
    ["b", "a", "c"],
  );
});

test("buildFacetCounts reports availability from base products", () => {
  const counts = buildFacetCounts(sample, {});
  assert.equal(counts.availability.in_stock, 2);
  assert.equal(counts.availability.out_of_stock, 1);
  assert.equal(counts.categories.Everyday, 1);
  assert.equal(counts.colors.Indigo, 1);
});
