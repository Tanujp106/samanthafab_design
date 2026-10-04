import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { filterSearchProducts } from "../playground/components/search-overlay.js";
import { catalogProducts } from "../playground/data/catalog.js";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("search filtering matches product metadata and keeps the empty query intact", () => {
  const products = [
    {
      id: "silk",
      name: "Handwoven Silk Saree",
      material: "Kanchipuram silk",
      tag: "Wedding",
      collections: ["wedding"],
    },
    {
      id: "linen",
      name: "Indigo Linen Drape",
      material: "Soft linen blend",
      tag: "Everyday",
      collections: ["ready-to-wear"],
    },
  ];

  assert.deepEqual(filterSearchProducts(products, "silk").map((product) => product.id), ["silk"]);
  assert.deepEqual(filterSearchProducts(products, "ready-to-wear").map((product) => product.id), ["linen"]);
  assert.deepEqual(filterSearchProducts(products, "silk saris").map((product) => product.id), ["silk"]);
  assert.deepEqual(filterSearchProducts(products, "weddding silk").map((product) => product.id), ["silk"]);
  assert.deepEqual(filterSearchProducts(products, "rtw").map((product) => product.id), ["linen"]);
  assert.deepEqual(filterSearchProducts(products, "").map((product) => product.id), ["silk", "linen"]);
});

test("specific search prompts lead to catalog products", () => {
  for (const query of [
    "indigo ready-to-wear",
    "handblock cotton",
    "wedding silk sarees",
    "marigold print",
    "everyday cotton",
  ]) {
    assert.ok(filterSearchProducts(catalogProducts, query).length > 0, query);
  }
});

test("design search opens a product-rich overlay from the reference nav", async () => {
  const renderer = await source("playground/components/render.js");
  const app = await source("playground/app.js");
  const blank = await source("playground/pages/blank.js");
  const css = await source("playground/styles/design.css");
  const search = await source("playground/components/search-overlay.js");

  assert.match(renderer, /renderSearchOverlay/);
  assert.match(search, /searchOverlay/);
  assert.match(search, /searchProductGrid/);
  assert.match(search, /productGroup\("Best sellers", "bestsellers"/);
  assert.match(search, /productGroup\("Ready to wear", "ready-to-wear"/);
  assert.match(search, /recentSection\.hidden = recentSearches\.length === 0/);
  assert.doesNotMatch(search, /renderRecentSearch\("Sarees"/);
  assert.match(search, /search-overlay__trending-icon/);
  assert.match(search, /Indigo ready-to-wear/);
  assert.match(search, /Recently viewed/);
  assert.match(search, /View all pieces/);
  assert.match(search, /Browse all sarees/);
  assert.match(app, /setSearchOverlayOpen/);
  assert.match(app, /data-search-open/);
  assert.match(app, /filterSearchProducts/);
  assert.match(app, /sf-design-recently-viewed/);
  assert.match(app, /sf-design-recent-searches/);
  assert.match(app, /slug === "sarees" && searchQueryParam/);
  assert.match(blank, /searchTerms/);
  assert.match(css, /\.search-overlay\s*\{/);
  assert.match(css, /\.search-overlay__product-grid\s*\{/);
  assert.match(css, /\.search-overlay__products-title\s*\{[^}]*font-size:\s*clamp\(22px, 2\.1vw, 28px\)/s);
  assert.doesNotMatch(search, /search-overlay__clear/);
  assert.doesNotMatch(search, /Showing top products/);
  assert.doesNotMatch(search, /search-overlay__products-clear/);
  assert.match(css, /\.search-overlay__form\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /\.search-overlay\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
  assert.match(css, /\.search-overlay__suggestion\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
  assert.match(css, /\.search-overlay__card \.product-name\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
  assert.doesNotMatch(search, /Nothing found yet/);
  assert.doesNotMatch(search, /Try a saree, fabric, or collection name\./);
  assert.doesNotMatch(css, /search-overlay__empty-title/);
  assert.doesNotMatch(css, /search-overlay__empty-copy/);
  assert.match(css, /\.search-overlay__sidebar-clear\s*\{[^}]*text-decoration:\s*none/s);
});

test("search overlay includes a reduced-motion-safe typing loop and product filtering contract", async () => {
  const search = await source("playground/components/search-overlay.js");
  const app = await source("playground/app.js");
  const css = await source("playground/styles/design.css");

  assert.match(search, /export function filterSearchProducts/);
  assert.match(search, /searchSuggestion/);
  assert.match(search, /searchAnimatedPlaceholder/);
  assert.match(app, /prefers-reduced-motion/);
  assert.match(app, /startSearchTyping/);
  assert.match(app, /stopSearchTyping/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.search-overlay__animated-placeholder/);
});
