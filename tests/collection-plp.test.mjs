import test from "node:test";
import assert from "node:assert/strict";
import { getCollection, getCollectionProducts } from "../playground/data/collections.js";
import { DEFAULT_SORT } from "../playground/lib/collection-filters.mjs";

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
