import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

async function pageModule(path) {
  const contents = await source(path);
  const encoded = Buffer.from(contents).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
}

test("design page uses the curated archive images by section role", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const byId = (id) => blank.sections.find((section) => section.id === id);
  const hero = byId("design-campaign-hero");
  const collection = byId("design-shop-by-collection");
  const arrivals = byId("design-new-arrivals");
  const banner = byId("design-ready-to-wear-banner");
  const rail = byId("design-ready-to-wear-products");

  const expected = [
    "/assets/design-campaign-hero-green.jpg",
    "/assets/design-story-cream.jpg",
    "/assets/design-campaign-hero-red.jpg",
    "/assets/design-collection-everyday.jpg",
    "/assets/design-collection-work.jpg",
    "/assets/design-collection-festive.jpg",
    "/assets/design-collection-wedding.jpg",
    "/assets/design-collection-ready-to-wear.jpg",
    "/assets/design-product-sage.jpg",
    "/assets/design-product-indigo.jpg",
    "/assets/design-product-marigold.jpg",
    "/assets/design-product-black.jpg",
    "/assets/design-ready-to-wear-detail.jpg",
  ];

  assert.deepEqual(
    hero.slides.map((slide) => slide.media.src),
    expected.slice(0, 3),
  );
  assert.deepEqual(
    collection.items.map((item) => item.media.src),
    expected.slice(3, 8),
  );
  assert.deepEqual(
    arrivals.products.slice(0, 4).map((product) => product.media.src),
    expected.slice(8, 12),
  );
  assert.deepEqual(
    banner.media.map((media) => media.src),
    [
      expected[7],
      expected[12],
      expected[0],
      expected[1],
    ],
  );
  assert.deepEqual(
    rail.products.slice(0, 4).map((product) => product.media.src),
    expected.slice(9, 12).concat(expected[8]),
  );

  await Promise.all(expected.map((asset) => access(new URL(`playground${asset}`, root))));
});
