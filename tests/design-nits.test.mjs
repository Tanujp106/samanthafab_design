import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("design nits: 24px campaign/nav gutters", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.section--campaign-hero\s*\{[^}]*padding:\s*24px/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.primary-nav\s*\{[^}]*padding-inline:\s*24px/s,
  );
});

test("design nits: New Arrivals eyebrow→title is 6px", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__eyebrow\s*\{[^}]*margin-bottom:\s*6px/s,
  );
});

test("design nits: collection scrim uses 2px linear blur veil", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*backdrop-filter:\s*blur\(2px\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*-webkit-mask-image:\s*linear-gradient/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*mask-image:\s*linear-gradient/s,
  );
});

test("design nits: color swatches sit in the price row (right-aligned)", async () => {
  const css = await source("playground/styles/design.css");
  const render = await source("playground/components/render.js");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-card__swatches\s*\{[^}]*margin-left:\s*auto/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-price-wrap\s*\{[^}]*width:\s*100%/s,
  );
  assert.match(render, /product-card__swatches/);
  assert.match(render, /product-price-wrap/);
  assert.doesNotMatch(
    render,
    /product-card__media-actions[\s\S]{0,400}product-card__swatches/,
  );
});

test("design nits: product prices share a bottom-aligned row", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card\s*\{[^}]*align-self:\s*stretch/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-card__link\s*\{[^}]*display:\s*flex[\s\S]*flex:\s*1 1 auto[\s\S]*flex-direction:\s*column/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-meta\s*\{[^}]*margin-top:\s*auto/s,
  );
});

test("design nits: campaign slide media fills the stage without inherited margins", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-slide__media\s*\{[^}]*margin:\s*0/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-slide__media \.media__frame\s*\{[^}]*object-fit:\s*cover/s,
  );
});

test("design nits: material cards use fabric imagery without decorative icons", async () => {
  const blank = await source("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const css = await source("playground/styles/design.css");

  for (const material of ["silk", "chiffon", "organza", "georgette", "kota", "linen"]) {
    assert.match(blank, new RegExp(`src: "/assets/design-material-${material}\\.png"`));
  }
  assert.doesNotMatch(blank, /\bicon:\s*"(?:silk|chiffon|organza|georgette|kota|linen)"/);
  assert.doesNotMatch(renderer, /function renderMaterialIcon|renderMaterialIcon\(item\.icon\)/);
  assert.doesNotMatch(renderer, /design-materials__icon/);
  assert.doesNotMatch(css, /design-materials__icon\s*\{/);
});


test("design nits: material cards use blur+dark scrim without Explore CTA", async () => {
  const renderer = await source("playground/components/render.js");
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-materials__scrim\s*\{[^}]*backdrop-filter:\s*blur\(2px\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-materials__scrim\s*\{[^}]*background:\s*rgba\(18,\s*10,\s*12,\s*0\.32\)/s,
  );
  assert.doesNotMatch(css, /design-materials__tile::after/);
  assert.doesNotMatch(css, /design-materials__wash\s*\{/);
  assert.doesNotMatch(css, /design-materials__cta\s*\{/);
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-materials__content\s*\{[^}]*justify-content:\s*center/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-materials\s*\{[^}]*padding:\s*72px 24px 108px/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-testimonials\s*\{[^}]*padding:\s*56px 0 80px/s,
  );
  assert.match(renderer, /design-materials__scrim/);
  assert.doesNotMatch(renderer, /design-materials__wash/);
  assert.doesNotMatch(renderer, /design-materials__cta/);
  assert.doesNotMatch(
    renderer.match(/function renderMaterialRail[\s\S]*?(?=\nfunction )/)?.[0] ?? "",
    /Explore/,
  );
});

test("design nits: Ready-to-wear feature banner has no decorative border", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-feature-banner\s*\{[^}]*border:\s*0/s,
  );
  assert.doesNotMatch(
    css,
    /body\[data-page="blank"\] \.design-feature-banner\s*\{[^}]*border:\s*1px/s,
  );
});

test("design skill + hooks automation files exist", async () => {
  const skill = await source("skills/samantha-fab-design/SKILL.md");
  const nits = await source("skills/samantha-fab-design/nits.md");
  const hooks = await source(".cursor/hooks.json");
  const agents = await source("AGENTS.md");

  assert.match(skill, /Using samantha-fab-design/);
  assert.match(nits, /Eyebrow → title/);
  assert.match(hooks, /design-skill-session-start\.mjs/);
  assert.match(hooks, /design-skill-stop\.mjs/);
  assert.match(agents, /skills\/samantha-fab-design\/SKILL\.md/);
});
