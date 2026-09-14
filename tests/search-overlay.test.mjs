import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { filterSearchProducts } from "../playground/components/search-overlay.js";

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
  assert.deepEqual(filterSearchProducts(products, "").map((product) => product.id), ["silk", "linen"]);
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
  assert.match(app, /setSearchOverlayOpen/);
  assert.match(app, /data-search-open/);
  assert.match(app, /filterSearchProducts/);
  assert.match(blank, /searchTerms/);
  assert.match(css, /\.search-overlay\s*\{/);
  assert.match(css, /\.search-overlay__product-grid\s*\{/);
  assert.doesNotMatch(search, /search-overlay__clear/);
  assert.doesNotMatch(search, /Showing top products/);
  assert.doesNotMatch(search, /search-overlay__products-clear/);
  assert.match(css, /\.search-overlay__form\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /\.search-overlay\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
  assert.match(css, /\.search-overlay__suggestion\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
  assert.match(css, /\.search-overlay__card \.product-name\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
  assert.match(css, /\.search-overlay__empty-title\s*\{[^}]*font-family:\s*var\(--font-body\)/s);
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
