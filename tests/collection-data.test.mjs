import test from "node:test";
import assert from "node:assert/strict";
import { catalogProducts } from "../playground/data/catalog.js";
import { collectionsBySlug, getCollectionProducts } from "../playground/data/collections.js";

test("catalog products have ids and numeric priceValue", () => {
  assert.ok(catalogProducts.length >= 8);
  catalogProducts.forEach((product) => {
    assert.ok(product.id);
    assert.equal(typeof product.priceValue, "number");
    assert.ok(product.priceValue > 0);
    assert.ok(["in_stock", "out_of_stock"].includes(product.availability));
    assert.ok(Array.isArray(product.sizes));
    assert.ok(Array.isArray(product.collections));
  });
});

test("bestsellers collection resolves at least 6 products", () => {
  const products = getCollectionProducts("bestsellers");
  assert.ok(products.length >= 6);
  assert.equal(collectionsBySlug.bestsellers.title, "Bestsellers");
});

test("ready-to-wear and everyday collections are non-empty", () => {
  assert.ok(getCollectionProducts("ready-to-wear").length >= 1);
  assert.ok(getCollectionProducts("everyday").length >= 1);
});

test("unknown slug returns empty list", () => {
  assert.deepEqual(getCollectionProducts("does-not-exist"), []);
});

test("every shop mega-menu collection has at least one product", () => {
  const shopSlugs = [
    "sarees",
    "new-arrival",
    "wedding-collection",
    "budget-buys",
    "festive-picks",
    "sale",
    "ready-to-wear",
    "arani-silk",
    "chettinad-cotton",
    "dharmavaram-silk",
    "gadwal-saree",
    "kanchipuram-silk",
    "mangalagiri-cotton",
    "mysore-silk",
    "narayanpet-saree",
    "pochampally-ikat",
    "bestsellers",
  ];
  shopSlugs.forEach((slug) => {
    assert.ok(collectionsBySlug[slug], `missing collection config: ${slug}`);
    assert.ok(getCollectionProducts(slug).length >= 1, `empty collection: ${slug}`);
  });
});
