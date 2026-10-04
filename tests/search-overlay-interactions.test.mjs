import test from "node:test";
import assert from "node:assert/strict";
import { pages } from "../playground/pages/index.js";
import { renderProductCard } from "../playground/components/render.js";
import { renderSearchOverlay, updateSearchResults } from "../playground/components/search-overlay.js";

class TestNode {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.style = { setProperty() {} };
    this._className = "";
    this._text = "";
    this.hidden = false;
    this.classList = {
      add: (...names) => { this.className = [...new Set([...this._className.split(" "), ...names])].filter(Boolean).join(" "); },
      contains: (name) => this._className.split(" ").includes(name),
      toggle: (name, force) => {
        const present = this.classList.contains(name);
        if (force === false || (force === undefined && present)) {
          this.className = this._className.split(" ").filter((item) => item !== name).join(" ");
          return false;
        }
        this.classList.add(name);
        return true;
      },
    };
  }
  set className(value) { this._className = value; }
  get className() { return this._className; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map((child) => child.textContent).join(""); }
  set innerHTML(value) { this._text = value; this.children = []; }
  append(...nodes) { this.children.push(...nodes); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  querySelectorAll(selector) {
    const matches = [];
    const match = (node) => selector.startsWith(".")
      ? node.classList.contains(selector.slice(1))
      : selector.startsWith("[data-")
        ? Boolean(node.dataset[selector.slice(6, -1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())])
        : node.tagName === selector;
    const visit = (node) => {
      node.children.forEach((child) => {
        if (match(child)) matches.push(child);
        visit(child);
      });
    };
    visit(this);
    return matches;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

test("the real search overlay renderer mounts both searchable product groups", () => {
  const previousDocument = globalThis.document;
  globalThis.document = {
    createElement: (tag) => new TestNode(tag),
    createElementNS: (_namespace, tag) => new TestNode(tag),
    createTextNode: (value) => { const node = new TestNode("#text"); node.textContent = value; return node; },
  };
  try {
    const bestSellers = pages.blank.sections.find((section) => section.id === "design-best-sellers").products;
    const readyToWear = pages.blank.sections.find((section) => section.id === "design-ready-to-wear-products").products;
    const overlay = renderSearchOverlay({
      products: bestSellers,
      readyToWearProducts: readyToWear,
      renderProductCard,
      ctx: { notesEnabled: false },
    });
    assert.equal(overlay.querySelectorAll("[data-search-product-section]").length, 2);
    assert.equal(overlay.querySelectorAll("[data-search-product]").length, 16);
    assert.equal(overlay.querySelector("[data-search-recent-section]").hidden, true);
    assert.equal(updateSearchResults(overlay, [...bestSellers, ...readyToWear], "silk sarees"), 2);
    assert.equal(overlay.querySelectorAll("[data-search-product]").filter((card) => !card.hidden).length, 2);
    assert.equal(overlay.querySelector(".search-overlay__products-title").textContent, "Results for “silk sarees”");
    assert.equal(updateSearchResults(overlay, [...bestSellers, ...readyToWear], "no-such-weave"), 0);
    assert.equal(overlay.querySelector("[data-search-empty]").hidden, false);
    assert.equal(updateSearchResults(overlay, [...bestSellers, ...readyToWear], ""), 16);
    assert.equal(overlay.querySelector("[data-search-empty]").hidden, true);
  } finally {
    globalThis.document = previousDocument;
  }
});
