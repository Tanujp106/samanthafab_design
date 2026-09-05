import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("quiet editorial page is registered without changing the homepage", async () => {
  const pageIndex = await source("playground/pages/index.js");
  const homepage = await source("playground/pages/homepage.js");
  const quietPage = await source("playground/pages/quiet-editorial.js");

  assert.match(pageIndex, /quietEditorial/);
  assert.match(pageIndex, /quiet-editorial/);
  assert.match(homepage, /key: "homepage"/);
  assert.match(quietPage, /key: "quiet-editorial"/);
  assert.match(quietPage, /type: "header"/);
  assert.match(quietPage, /type: "hero"/);
});

test("quiet editorial styling is isolated to its new page", async () => {
  const app = await source("playground/app.js");
  const index = await source("playground/index.html");
  const styles = await source("playground/styles/quiet-editorial.css");

  assert.match(app, /document\.body\.dataset\.page/);
  assert.match(index, /styles\/quiet-editorial\.css/);
  assert.match(styles, /body\[data-page="quiet-editorial"\]/);
  assert.match(styles, /hero-grid/);
  assert.match(styles, /primary-nav/);
  assert.match(styles, /utility-strip/);
});

test("blank page is registered as the isolated design canvas", async () => {
  const pageIndex = await source("playground/pages/index.js");
  const blankPage = await source("playground/pages/blank.js");

  assert.match(pageIndex, /blank/);
  assert.match(blankPage, /key: "blank"/);
  assert.match(blankPage, /type: "usp-strip"/);
  assert.doesNotMatch(blankPage, /type: "hero"/);
});

test("blank design canvas is available at the clean /design path", async () => {
  const app = await source("playground/app.js");
  const vercel = await source("playground/vercel.json");
  const designShell = await source("playground/design/index.html");

  assert.match(app, /window\.location\.pathname/);
  assert.match(app, /"blank"/);
  assert.match(vercel, /"source":\s*"\/design\/?"/);
  assert.match(vercel, /"destination":\s*"\/index\.html"/);
  assert.match(designShell, /data-page="blank"/);
  assert.match(designShell, /\.\.\/app\.js/);
});

test("design page contains an icon-led rotating USP strip", async () => {
  const blankPage = await source("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const designStyles = await source("playground/styles/design.css");
  const designShell = await source("playground/design/index.html");

  assert.match(blankPage, /type: "usp-strip"/);
  assert.match(blankPage, /COD across India/);
  assert.match(blankPage, /Easy returns & exchange/);
  assert.match(blankPage, /WhatsApp assistance/);
  assert.match(renderer, /case "usp-strip"/);
  assert.match(renderer, /renderIcon/);
  assert.match(designStyles, /@keyframes design-usp-cycle/);
  assert.match(designStyles, /prefers-reduced-motion/);
  assert.match(designShell, /styles\/design\.css/);
});

test("final design page does not expose wireframe review scaffolding", async () => {
  const app = await source("playground/app.js");
  const renderer = await source("playground/components/render.js");

  assert.match(app, /page\.key !== "blank"/);
  assert.match(renderer, /inner\.append\(viewport\)/);
  assert.doesNotMatch(renderer, /inner\.append\(sectionMeta\(section\), viewport, annotation\(section\)\)/);
});
