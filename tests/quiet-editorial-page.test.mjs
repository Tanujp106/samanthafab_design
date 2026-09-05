import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

async function pageModule(path) {
  const contents = await source(path);
  const encoded = Buffer.from(contents).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
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

test("design page contains an edge-to-edge collection bento", async () => {
  const blankPage = await source("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const designStyles = await source("playground/styles/design.css");

  assert.match(blankPage, /type: "collection-bento"/);
  assert.match(blankPage, /Everyday/);
  assert.match(blankPage, /Work/);
  assert.match(blankPage, /Festive/);
  assert.match(blankPage, /Wedding/);
  assert.match(blankPage, /Ready-to-wear/);
  assert.match(renderer, /case "collection-bento"/);
  assert.match(renderer, /renderCollectionBento/);
  assert.match(designStyles, /\.design-collection-bento/);
  assert.match(designStyles, /design-collection-bento__scrim/);
});

test("collection bento uses editorial assets and softened card treatment", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const designStyles = await source("playground/styles/design.css");
  const collection = blank.sections.find((section) => section.type === "collection-bento");

  assert.deepEqual(
    collection.items.map((item) => item.media.src),
    [
      "/assets/collection-everyday-editorial.png",
      "/assets/collection-work-editorial.png",
      "/assets/collection-festive-editorial.png",
      "/assets/collection-wedding-editorial.png",
      "/assets/collection-ready-to-wear-editorial.png",
    ],
  );
  assert.match(designStyles, /-webkit-backdrop-filter:\s*blur\(4px\)/);
  assert.match(designStyles, /backdrop-filter:\s*blur\(4px\)/);
  assert.match(designStyles, /border:\s*1px solid color-mix\(in srgb, var\(--color-cream\) 32%, transparent\)/);
  assert.match(designStyles, /font-size:\s*clamp\(17px, 1\.55vw, 22px\)/);
});

test("design page ends with the standard footer navigation", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const footer = blank.sections.at(-1);

  assert.equal(footer.id, "footer");
  assert.equal(footer.type, "footer");
  assert.deepEqual(
    footer.columns.map((column) => column.heading),
    ["Shop", "Help", "About", "Stay in touch"],
  );
  assert.equal(
    footer.columns.reduce((count, column) => count + column.links.length, 0),
    14,
  );
});

test("footer brand uses the supplied Samantha logo asset", async () => {
  const renderer = await source("playground/components/render.js");
  const footerRenderer = renderer.slice(
    renderer.indexOf("function renderFooter"),
    renderer.indexOf("function renderSection"),
  );

  assert.match(footerRenderer, /footer-wordmark/);
  assert.match(footerRenderer, /renderBrandImage\(\)/);
});

test("footer surface uses the defined Samantha plum palette", async () => {
  const styles = await source("playground/styles/homepage.css");
  const footerStyles = styles.slice(styles.indexOf("/* Footer */"));

  assert.match(footerStyles, /\.site-footer\s*\{[\s\S]*background:\s*var\(--color-primary\)/);
  assert.match(footerStyles, /\.footer-wordmark \.wordmark__image\s*\{[\s\S]*filter:\s*brightness\(0\) invert\(1\)/);
});
