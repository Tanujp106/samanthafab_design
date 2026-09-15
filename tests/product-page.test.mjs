import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  productUrl,
  resolveProductSlug,
} from "../playground/data/collections.js";
import { getCatalogProduct } from "../playground/data/catalog.js";
import { snapshotProduct } from "../playground/lib/commerce-store.mjs";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("product routes normalize legacy cards to one shared design PDP", () => {
  assert.equal(productUrl("sage-handblock"), "/design?route=product&slug=sage-handblock");
  assert.equal(resolveProductSlug("product", "sage-handblock"), "sage-handblock");
  assert.equal(resolveProductSlug("product-sage-handblock", null), "sage-handblock");
  assert.equal(resolveProductSlug("clearance-sage-handblock", null), "sage-handblock");
  assert.equal(resolveProductSlug("product-marigold", null), "marigold-print");
  assert.equal(getCatalogProduct(resolveProductSlug("product-sage-handblock", null))?.id, "sage-handblock");
  assert.equal(
    snapshotProduct({ id: "sage-handblock", href: "/?route=product-sage-handblock" }).href,
    "/design?route=product&slug=sage-handblock",
  );
});

test("product page wiring uses one reusable PDP surface and existing commerce actions", async () => {
  const app = await source("playground/app.js");
  const render = await source("playground/components/render.js");
  const productPage = await source("playground/components/product-page.js");
  const commercePages = await source("playground/components/commerce-pages.js");
  const css = await source("playground/styles/design.css");

  assert.match(app, /resolveProductSlug/);
  assert.match(app, /productView/);
  assert.match(render, /renderProductPage/);
  assert.match(render, /productView/);
  assert.match(productPage, /add-to-bag/);
  assert.match(productPage, /product-detail__gallery/);
  assert.match(productPage, /product-detail__purchase/);
  assert.match(commercePages, /productHref/);
  assert.match(commercePages, /productUrl/);
  assert.match(css, /\.product-detail-page/);
  assert.match(css, /\.product-detail__gallery/);
  assert.match(css, /\.product-detail__purchase/);
});
