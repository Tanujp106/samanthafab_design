import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolveCollectionSlug } from "../playground/data/collections.js";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("resolveCollectionSlug maps collection and alias routes", () => {
  assert.equal(resolveCollectionSlug("collection", "bestsellers"), "bestsellers");
  assert.equal(resolveCollectionSlug("bestsellers", null), "bestsellers");
  assert.equal(resolveCollectionSlug("occasion-rtw", null), "ready-to-wear");
  assert.equal(resolveCollectionSlug("product-sage", null), null);
});

test("app and blank wire collection PLP routes", async () => {
  const app = await source("playground/app.js");
  const blank = await source("playground/pages/blank.js");
  const render = await source("playground/components/render.js");

  assert.match(app, /resolveCollectionSlug/);
  assert.match(app, /resolveContentSlug/);
  assert.match(app, /collectionView/);
  assert.match(app, /contentView/);
  assert.match(app, /bindCollectionPlp/);
  assert.match(render, /collectionView/);
  assert.match(render, /renderCollectionPlp/);
  assert.match(render, /renderContentPage/);
  assert.match(blank, /collectionUrl\("bestsellers"\)/);
  assert.match(blank, /collectionUrl\("new-arrival"\)/);
  assert.match(blank, /contentUrl\("about"\)/);
  assert.match(blank, /MEGA_MENU_LINKS\["embroidery-work"\]/);
  assert.match(blank, /MEGA_MENU_LINKS\.organza/);
  assert.match(blank, /MEGA_MENU_LINKS\["festive-wear"\]/);
  assert.doesNotMatch(blank, /https:\/\/www\.samanthafab\.com\/collections\//);
});

test("design.css includes collection PLP styles", async () => {
  const css = await source("playground/styles/design.css");
  assert.match(css, /\.collection-plp/);
  assert.match(css, /\.collection-sheet/);
  assert.match(css, /\.collection-plp__sidebar/);
  assert.match(css, /collection-plp__sidebar[\s\S]*position:\s*sticky/);
  assert.match(css, /collection-plp__sidebar[\s\S]*max-height:\s*var\(--collection-pane-height\)/);
  assert.match(css, /scrollbar-width:\s*thin/);
});
