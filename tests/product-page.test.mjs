import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  productUrl,
  resolveProductSlug,
} from "../playground/data/collections.js";
import { getCatalogProduct } from "../playground/data/catalog.js";
import { resolveProductGallery } from "../playground/data/product-gallery.js";
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
  assert.match(productPage, /product-detail__gift-offer/);
  assert.match(productPage, /complimentary Gift/);
  assert.doesNotMatch(productPage, /product-detail__coupons/);
  assert.doesNotMatch(productPage, /SAVE10/);
  assert.match(productPage, /product-detail__tag/);
  assert.match(productPage, /product-detail__description/);
  assert.match(productPage, /product-detail__add-shimmer/);
  assert.match(productPage, /product-detail__gallery-shell/);
  assert.match(productPage, /Recommended for you/);
  assert.match(productPage, /Ready-to-wear/);
  assert.match(productPage, /resolveProductGallery/);
  assert.doesNotMatch(productPage, /Options available/);
  assert.doesNotMatch(productPage, /product-detail__summary/);
  assert.doesNotMatch(productPage, /product-detail__material/);
  assert.doesNotMatch(productPage, /Product Description/);
  assert.doesNotMatch(productPage, /coupons-summary/);
  assert.doesNotMatch(productPage, /product-detail__delivery-check/);
  assert.doesNotMatch(productPage, /product-detail__sizes/);
  assert.match(gallery, /minCount = 4/);
  assert.match(gallery, /cropVariants/);
  assert.match(app, /data-pdp-variant/);
  assert.match(app, /buy-now/);
  assert.doesNotMatch(app, /data-pdp-delivery/);
  assert.match(css, /\.product-detail__gallery[\s\S]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.product-detail__gallery[\s\S]*row-gap:\s*12px/);
  assert.match(css, /\.product-detail__gallery[\s\S]*column-gap:\s*12px/);
  assert.match(css, /\.product-detail__media[\s\S]*margin:\s*0/);
  assert.match(css, /column-gap:\s*clamp\(32px,\s*4vw,\s*64px\)/);
  assert.match(css, /\.product-detail__gallery-shell[\s\S]*position:\s*sticky/);
  assert.match(css, /\.product-detail__gallery-shell[\s\S]*top:\s*112px/);
  assert.doesNotMatch(css, /product-detail__gallery-shell[\s\S]{0,160}margin-inline-start:\s*-24px/);
  assert.doesNotMatch(css, /product-detail__gallery-shell[\s\S]{0,200}overflow:\s*auto/);
  assert.match(css, /\.product-detail__purchase[\s\S]*position:\s*relative/);
  assert.match(css, /\.product-detail__variant-price[\s\S]*font-size:\s*16px/);
  assert.match(css, /\.product-detail__description[\s\S]*max-width:\s*none/);
  assert.match(css, /\.product-detail__variants/);
  assert.match(css, /product-detail-add-shimmer/);
  assert.match(css, /\.product-detail__gift-offer/);
  assert.match(css, /--color-primary-50/);
  assert.doesNotMatch(css, /design-pdp-gift-bokeh\.png/);
  assert.match(css, /\.product-detail__title[\s\S]*font-family:\s*var\(--font-body\)/);
  assert.match(css, /\.product-detail__trust-icon[\s\S]*width:\s*34px/);
  assert.match(css, /\.product-detail__trust-item[\s\S]*font-size:\s*15px/);
  assert.match(css, /\.product-detail__related-rail[\s\S]*repeat\(3/);
  assert.match(productPage, /product-detail__whatsapp/);
  assert.match(productPage, /whatsappIconSvg/);
  assert.match(await source("playground/lib/icons.mjs"), /viewBox="0 0 256 256"/);
  assert.match(await source("playground/lib/icons.mjs"), /WHATSAPP_PATH/);
  assert.doesNotMatch(productPage, /viewBox="0 0 20 20"/);
  assert.match(productPage, /dataset\.pdpLightbox/);
  assert.match(productPage, /dataset\.productGallery/);
  assert.match(app, /bindProductLightbox/);
  assert.match(css, /\.product-lightbox/);
  assert.match(css, /\.product-lightbox__image[\s\S]*transform-origin:\s*center/);
});

test("product lightbox morphs with composite-only motion", async () => {
  const lightbox = await source("playground/components/product-lightbox.js");
  assert.match(lightbox, /invertFlip/);
  assert.match(lightbox, /translate3d/);
  assert.match(lightbox, /prefers-reduced-motion/);
  assert.match(lightbox, /MORPH_MS/);
  assert.match(lightbox, /panTowardCursor/);
  assert.match(lightbox, /MAX_ZOOM/);
  assert.match(lightbox, /zoom > 1\.01 \? MIN_ZOOM : MAX_ZOOM/);
  assert.doesNotMatch(lightbox, /CLICK_ZOOM_STEPS/);
  assert.doesNotMatch(lightbox, /requestAnimationFrame[\s\S]{0,80}left\s*=/);
});

test("sage PDP gallery stays on-product with four coherent frames", () => {
  const product = getCatalogProduct("sage-handblock");
  const frames = resolveProductGallery(product, { minCount: 4, maxCount: 4 });
  assert.equal(frames.length, 4);
  assert.ok(frames.every((frame) => frame.src === "/assets/design-product-sage.jpg" || frame.src === "/assets/design-collection-everyday.jpg"));
  assert.equal(frames[0].src, "/assets/design-product-sage.jpg");
});
