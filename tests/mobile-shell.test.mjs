import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { blank } from "../playground/pages/blank.js";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

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
      this.namespaceURI = "http://www.w3.org/1999/xhtml";
    }
  }

  class FakeSvgElement extends FakeElement {
    constructor(tagName) {
      super(tagName);
      this.namespaceURI = "http://www.w3.org/2000/svg";
    }

    set innerHTML(value) {
      this._innerHTML = value;
    }

    get innerHTML() {
      return this._innerHTML || "";
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
    return node.tagName === selector.toUpperCase();
  }

  function camel(dataAttr) {
    return dataAttr.replace(/^data-/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  globalThis.document = {
    createElement(tag) {
      return new FakeElement(tag);
    },
    createElementNS(ns, tag) {
      return ns.includes("svg") ? new FakeSvgElement(tag) : new FakeElement(tag);
    },
    createDocumentFragment() {
      return new FakeNode();
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

test("mobile shell: blank page ships mobile config + bestseller products", () => {
  assert.ok(blank.mobile);
  assert.equal(blank.mobile.trending.length, 5);
  assert.equal(blank.mobile.wishlist.title.includes("wishlist"), true);
  assert.equal(blank.mobile.bag.title.includes("bag"), true);

  const bestSellers = blank.sections.find((section) => section.id === "design-best-sellers");
  assert.ok(bestSellers?.products?.length >= 4);
});

test("mobile shell: renderPage builds bottom bar, drawer, explore, empty panels", async () => {
  installMinimalDom();
  const { renderPage } = await import("../playground/components/render.js");
  const tree = renderPage(blank, { notesEnabled: false });

  assert.equal(tree.classList.contains("site--mobile-shell"), true);

  const bottomBar = tree.querySelector("[data-mobile-bottom-bar]");
  assert.ok(bottomBar);
  const labels = bottomBar.childNodes.map((node) => collectText(node)).join("|");
  assert.match(labels, /Home/);
  assert.match(labels, /Explore/);
  assert.match(labels, /WhatsApp/);
  assert.match(labels, /Wishlist/);
  assert.match(labels, /Bag/);

  const drawer = tree.querySelector("[data-mobile-drawer]");
  assert.ok(drawer);
  assert.equal(drawer.id, "mobile-drawer");
  assert.ok(tree.querySelector("[data-mobile-drawer-overlay]"));
  assert.ok(tree.querySelector("[data-mobile-drawer-close]"));

  const explore = tree.querySelector("[data-mobile-panel=explore]");
  assert.ok(explore);
  assert.ok(explore.querySelector("[data-mobile-search-input]"));
  assert.equal(explore.querySelectorAll(".mobile-explore__chip").length, 5);

  const bestSellers = blank.sections.find((section) => section.id === "design-best-sellers");
  assert.equal(
    explore.querySelectorAll(".mobile-explore__card").length,
    bestSellers.products.length,
  );

  assert.ok(tree.querySelector("[data-mobile-panel=wishlist]"));
  assert.ok(tree.querySelector("[data-mobile-panel=bag]"));

  const header = tree.querySelector(".design-reference-nav__top") || tree.querySelectorAll(".design-reference-nav")[0];
  assert.ok(tree.querySelector("[data-mobile-drawer-trigger]") || tree.querySelector(".nav-menu-toggle"));
  assert.ok(tree.querySelector(".design-reference-nav__start"));
  assert.ok(tree.querySelector(".design-reference-nav__center"));
  assert.ok(tree.querySelector(".design-reference-nav__end"));
  assert.ok(tree.querySelector(".nav-action--account") || tree.querySelector('[aria-label="Account"]'));
  void header;
});

test("mobile shell: CSS and app wire mobile interactions", async () => {
  const css = await source("playground/styles/design.css");
  const app = await source("playground/app.js");

  assert.match(css, /\.mobile-bottom-bar\s*\{/);
  assert.match(css, /\.mobile-drawer\s*\{/);
  assert.match(css, /\.mobile-explore__search\s*\{/);
  assert.match(css, /\.mobile-empty\s*\{/);
  assert.match(css, /design-reference-nav__action--desktop-only/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.mobile-bottom-bar/);

  assert.match(app, /setMobileDrawerOpen/);
  assert.match(app, /setMobileTab/);
  assert.match(app, /filterExploreProducts/);
  assert.match(app, /trendingQuery/);
});
