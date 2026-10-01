import test from "node:test";
import assert from "node:assert/strict";
import { getCollection, getCollectionProducts, getContentPage } from "../playground/data/collections.js";
import { DEFAULT_SORT } from "../playground/lib/collection-filters.mjs";
import { getCatalogProduct } from "../playground/data/catalog.js";
import { snapshotProduct } from "../playground/lib/commerce-store.mjs";

function installMinimalDom() {
  class FakeNode {
    constructor() {
      this.childNodes = [];
      this.parentNode = null;
      this.textContent = "";
      this.style = { setProperty() {} };
      this.classList = {
        _set: new Set(),
        add(...names) {
          names.filter(Boolean).forEach((name) => this._set.add(name));
        },
        contains(name) {
          return this._set.has(name);
        },
        toggle(name, force) {
          if (force === undefined) {
            if (this._set.has(name)) this._set.delete(name);
            else this._set.add(name);
            return;
          }
          if (force) this._set.add(name);
          else this._set.delete(name);
        },
        toString() {
          return [...this._set].join(" ");
        },
      };
      this.attributes = {};
      this.dataset = new Proxy(
        {},
        {
          set: (target, key, value) => {
            target[key] = String(value);
            const attr = `data-${String(key).replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
            this.attributes[attr] = String(value);
            return true;
          },
          get: (target, key) => target[key],
          has: (target, key) => Object.prototype.hasOwnProperty.call(target, key),
        },
      );
    }

    get className() {
      return this.classList.toString();
    }

    set className(value) {
      this.classList._set = new Set(String(value || "").split(/\s+/).filter(Boolean));
    }

    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name.startsWith("data-")) {
        const key = name
          .slice(5)
          .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        this.dataset[key] = String(value);
      }
    }

    getAttribute(name) {
      return this.attributes[name] ?? null;
    }

    append(...nodes) {
      nodes.flat().forEach((node) => {
        if (typeof node === "string") {
          const text = new FakeNode();
          text.textContent = node;
          this.childNodes.push(text);
          return;
        }
        node.parentNode = this;
        this.childNodes.push(node);
      });
    }

    replaceChildren(...nodes) {
      this.childNodes = [];
      this.append(...nodes);
    }

    querySelectorAll(selector) {
      const matches = [];
      const visit = (node) => {
        if (matchSelector(node, selector)) matches.push(node);
        node.childNodes?.forEach(visit);
      };
      this.childNodes.forEach(visit);
      return matches;
    }

    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    }
  }

  class FakeElement extends FakeNode {
    constructor(tagName) {
      super();
      this.tagName = String(tagName).toUpperCase();
      this.checked = false;
      this.selected = false;
      this.value = "";
      this.type = "";
      this.name = "";
      this.hidden = false;
    }
  }

  function matchSelector(node, selector) {
    if (!node?.tagName) return false;
    if (selector.startsWith(".")) {
      return selector
        .slice(1)
        .split(".")
        .every((cls) => node.classList.contains(cls));
    }
    if (selector.startsWith("[")) {
      const attr = selector.slice(1, -1);
      if (attr.includes("=")) {
        const [name, raw] = attr.split("=");
        return node.getAttribute(name) === raw.replace(/^["']|["']$/g, "");
      }
      return node.getAttribute(attr) != null || Object.prototype.hasOwnProperty.call(node.dataset, camel(attr));
    }
    if (selector.includes(" ")) {
      const parts = selector.split(/\s+/);
      // only support "ancestor descendant" lightly via full tree scan of final
      return matchSelector(node, parts[parts.length - 1]);
    }
    return node.tagName === selector.toUpperCase();
  }

  function camel(dataAttr) {
    return dataAttr.replace(/^data-/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  globalThis.document = {
    createElement(tag) {
      return new FakeElement(tag);
    },
    createElementNS() {
      return new FakeElement("svg");
    },
    createTextNode(text) {
      const node = new FakeNode();
      node.textContent = text;
      return node;
    },
  };
}

function collectText(node) {
  if (!node) return "";
  if (node.childNodes?.length) return node.childNodes.map(collectText).join("");
  return node.textContent || "";
}

test("renderCollectionPlp builds sidebar, grid, mobile bar, and sheets", async () => {
  installMinimalDom();
  const { renderCollectionPlp } = await import("../playground/components/collection-plp.js");
  const collection = getCollection("bestsellers");
  const products = getCollectionProducts("bestsellers");

  const tree = renderCollectionPlp({
    collection,
    products,
    allProducts: products,
    state: { sort: DEFAULT_SORT },
    ctx: { notesEnabled: false },
    renderProductCard: (product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.textContent = product.name;
      return card;
    },
  });

  assert.equal(tree.classList.contains("collection-plp"), true);
  assert.ok(tree.querySelector(".collection-plp__sidebar"));
  assert.ok(tree.querySelector("[data-collection-grid]"));
  assert.ok(tree.querySelector("[data-collection-open-sheet=\"filters\"]"));
  assert.ok(tree.querySelector("[data-collection-open-sheet=\"sort\"]"));
  assert.ok(tree.querySelector("[data-collection-sheet=\"filters\"]"));
  assert.ok(tree.querySelector("[data-collection-sheet=\"sort\"]"));

  const text = collectText(tree);
  assert.match(text, /Availability/);
  assert.match(text, /Price/);
  assert.match(text, /Category/);
  assert.match(text, /Collections/);
  assert.match(text, /Size/);
  assert.match(text, /Color/);
  assert.match(text, /Bestsellers/);
});

test("filtered and empty collections offer a useful next action", async () => {
  installMinimalDom();
  const { renderCollectionPlp } = await import("../playground/components/collection-plp.js");
  const collection = getCollection("bestsellers");
  const allProducts = getCollectionProducts("bestsellers");
  const base = { collection, products: [], state: { sort: DEFAULT_SORT }, ctx: { notesEnabled: false } };

  const filtered = renderCollectionPlp({ ...base, allProducts });
  assert.match(collectText(filtered), /No pieces match these filters/);
  assert.ok(filtered.querySelector("[data-collection-empty-clear]"));

  const noProducts = renderCollectionPlp({ ...base, allProducts: [] });
  assert.match(collectText(noProducts), /Nothing here yet/);
  assert.match(collectText(noProducts), /Shop bestsellers/);
});

test("policy content renders headings, details and a live source link", async () => {
  installMinimalDom();
  const { renderContentPage } = await import("../playground/components/collection-plp.js");
  const page = getContentPage("refund-policy");
  const tree = renderContentPage({ page });
  const text = collectText(tree);

  assert.match(text, /Returns & refunds/);
  assert.match(text, /Return eligibility/);
  assert.match(text, /3 days/);
  assert.ok(tree.querySelector(".content-page__source"));
});

test("product purchase controls reflect sold-out and low-stock states", async () => {
  installMinimalDom();
  const { renderProductPage } = await import("../playground/components/product-page.js");

  const soldOut = renderProductPage({ product: getCatalogProduct("workroom-indigo") });
  assert.equal(soldOut.querySelector(".product-detail__add").disabled, true);
  assert.equal(soldOut.querySelector(".product-detail__buy-now").disabled, true);
  assert.match(collectText(soldOut), /Sold out/);

  const lowStock = renderProductPage({ product: getCatalogProduct("indigo-rtw") });
  assert.equal(lowStock.querySelector(".product-detail__add").disabled, false);
  assert.match(collectText(lowStock), /Only 2 left/);

  const missing = renderProductPage({ product: null });
  assert.match(collectText(missing), /This piece is unavailable/);
  assert.match(collectText(missing), /Explore sarees/);
});

test("bag drawer renders empty, filled and insufficient-stock states", async () => {
  installMinimalDom();
  const { renderBagDrawer } = await import("../playground/components/commerce-pages.js");
  const empty = renderBagDrawer({ items: [], bestsellers: [] });
  assert.match(collectText(empty), /Your bag is empty/);

  const product = snapshotProduct(getCatalogProduct("indigo-rtw"));
  const filled = renderBagDrawer({ items: [{ ...product, quantity: 2 }], bestsellers: [] });
  assert.match(collectText(filled), /Total/);
  assert.equal(filled.querySelectorAll(".commerce-bag-line__qty-btn")[1].disabled, true);

  const tooMany = renderBagDrawer({ items: [{ ...product, quantity: 3 }], bestsellers: [] });
  assert.match(collectText(tooMany), /Only 2 available/);
  assert.equal(tooMany.querySelector(".commerce-bag-summary__checkout").disabled, true);
});
