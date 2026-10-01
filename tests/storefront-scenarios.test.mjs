import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  addToBag,
  bagCount,
  bagLineId,
  canAddToBag,
  readBag,
  setBagQuantity,
  stockLimit,
} from "../playground/lib/commerce-store.mjs";
import { getCatalogProduct } from "../playground/data/catalog.js";
import { contentUrl, getContentPage, resolveContentSlug } from "../playground/data/collections.js";
import { applyCollectionFilters } from "../playground/lib/collection-filters.mjs";

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
};

test("bag moves from empty to filled and prevents adding beyond available quantity", () => {
  memory.clear();
  const product = getCatalogProduct("indigo-rtw");
  assert.equal(readBag().length, 0);
  assert.equal(stockLimit(product), 2);
  assert.equal(canAddToBag(product).allowed, true);
  addToBag(product);
  addToBag(product);
  assert.equal(bagCount(), 2);
  assert.equal(canAddToBag(product).reason, "quantity_limit");
  addToBag(product);
  assert.equal(bagCount(), 2);
  setBagQuantity(bagLineId(readBag()[0]), 10);
  assert.equal(bagCount(), 2);
});

test("regular and ready-to-wear selections remain separate lines sharing stock", () => {
  memory.clear();
  const product = getCatalogProduct("indigo-rtw");
  addToBag({ ...product, variant: "regular" });
  addToBag({ ...product, variant: "ready-to-wear", price: "₹2,569" });
  assert.equal(readBag().length, 2);
  assert.equal(bagCount(), 2);
  assert.notEqual(bagLineId(readBag()[0]), bagLineId(readBag()[1]));
  assert.equal(canAddToBag(product).allowed, false);
  setBagQuantity(bagLineId(readBag()[0]), 0);
  assert.equal(readBag().length, 1);
  assert.equal(canAddToBag(product).allowed, true);
});

test("sold-out products never enter the bag", () => {
  memory.clear();
  const product = getCatalogProduct("workroom-indigo");
  assert.equal(stockLimit(product), 0);
  assert.equal(canAddToBag(product).reason, "sold_out");
  addToBag(product);
  assert.equal(readBag().length, 0);
});

test("invalid saved bag data recovers to empty", () => {
  memory.clear();
  memory.set("sf-design-bag", "{broken");
  assert.deepEqual(readBag(), []);
});

test("empty filtered collection has no matches while the unfiltered set remains filled", () => {
  const products = [getCatalogProduct("indigo-rtw")];
  assert.equal(products.length, 1);
  assert.deepEqual(applyCollectionFilters(products, { availability: ["out_of_stock"] }), []);
});

test("policy pages and footer destinations resolve to substantive content", () => {
  for (const slug of ["refund-policy", "privacy-policy", "shipping-policy", "terms-of-service", "contact-information"]) {
    assert.equal(resolveContentSlug("page", slug), slug);
    assert.match(contentUrl(slug), /route=page/);
    assert.ok(getContentPage(slug)?.sections?.length);
  }
  assert.equal(resolveContentSlug("returns"), "refund-policy");
  assert.equal(resolveContentSlug("terms"), "terms-of-service");
});

test("offline notice and recovery controls are wired in the storefront source", async () => {
  const source = await readFile(new URL("../playground/app.js", import.meta.url), "utf8");
  assert.match(source, /addEventListener\("offline", syncConnectionNotice\)/);
  assert.match(source, /addEventListener\("online", syncConnectionNotice\)/);
  assert.match(source, /data-collection-empty-clear/);
  assert.match(source, /No results for/);
});
