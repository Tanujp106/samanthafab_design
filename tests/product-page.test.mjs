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

test("product page follows sketch-aligned purchase panel without delivery chrome", async () => {
  const app = await source("playground/app.js");
  const productPage = await source("playground/components/product-page.js");
  const gallery = await source("playground/data/product-gallery.js");
  const css = await source("playground/styles/design.css");

  assert.match(productPage, /product-detail__tax-note/);
  assert.match(productPage, /product-detail__buy-now/);
  assert.match(productPage, /product-detail__variants/);
  assert.match(productPage, /product-detail__coupons/);
  assert.match(productPage, /product-detail__whatsapp/);
  assert.match(productPage, /product-detail__material/);
  assert.match(productPage, /product-detail__description/);
  assert.match(productPage, /product-detail__add-shimmer/);
  assert.match(productPage, /Recommended for you/);
  assert.match(productPage, /Ready-to-wear/);
  assert.match(productPage, /resolveProductGallery/);
  assert.doesNotMatch(productPage, /Options available/);
  assert.doesNotMatch(productPage, /product-detail__summary/);
  assert.doesNotMatch(productPage, /product-detail__delivery-check/);
  assert.doesNotMatch(productPage, /product-detail__sizes/);
  assert.match(gallery, /minCount = 4/);
  assert.match(gallery, /design-product-sage\.jpg/);
  assert.match(app, /data-pdp-variant/);
  assert.match(app, /buy-now/);
  assert.doesNotMatch(app, /data-pdp-delivery/);
  assert.match(css, /\.product-detail__gallery[\s\S]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /column-gap:\s*clamp\(40px,\s*5vw,\s*72px\)/);
  assert.match(css, /\.product-detail__gallery[\s\S]*position:\s*sticky/);
  assert.match(css, /\.product-detail__gallery[\s\S]*top:\s*112px/);
  assert.match(css, /\.product-detail__purchase[\s\S]*position:\s*relative/);
  assert.match(css, /\.product-detail__variants/);
  assert.match(css, /product-detail-add-shimmer/);
  assert.match(css, /\.product-detail__related-rail[\s\S]*repeat\(3/);
});
