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

test("design nits: collection scrim uses a soft, extended linear fade", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*height:\s*68%/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*rgba\(18,\s*10,\s*12,\s*0\.76\)\s*0%/s,
  );
  assert.doesNotMatch(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*rgba\(18,\s*10,\s*12,\s*0\.86\)/s,
  );
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

test("design nits: color swatches sit below a vertically aligned price line", async () => {
  const css = await source("playground/styles/design.css");
  const render = await source("playground/components/render.js");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-price-wrap\s*\{[^}]*flex-direction:\s*column/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-price-line\s*\{[^}]*display:\s*flex/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-card__swatches\s*\{[^}]*margin-left:\s*0/s,
  );
  assert.match(render, /product-card__swatches/);
  assert.match(render, /product-price-line/);
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
    /body\[data-page="blank"\] \.design-materials__scrim\s*\{[^}]*backdrop-filter:\s*blur\(1\.5px\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-materials__scrim\s*\{[^}]*background:\s*rgba\(18,\s*10,\s*12,\s*0\.38\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-materials__tile\[data-material="organza"\] \.media__frame\s*\{[^}]*filter:\s*saturate\(1\.12\) brightness\(1\.1\)/s,
  );
  assert.match(
    await source("playground/pages/blank.js"),
    /title:\s*"Organza"[\s\S]*?color:\s*"#d49a5f"/s,
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
    /body\[data-page="blank"\] \.design-materials\s*\{[^}]*padding:\s*48px 24px 72px/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-materials__defs\s*\{[^}]*overflow:\s*visible/s,
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

test("design nits: Shop under uses sentence case and tightened section bottoms", async () => {
  const blank = await source("playground/pages/blank.js");
  const css = await source("playground/styles/design.css");

  assert.match(blank, /title:\s*"Best on budget"/);
  assert.doesNotMatch(blank, /title:\s*"BEST ON BUDGET"/);
  assert.match(
    css,
    /@media \(max-width: 640px\) \{[\s\S]*body\[data-page="blank"\] \.design-materials\s*\{[^}]*padding:\s*40px 16px 64px/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] #design-clearance-sale\.design-new-arrivals\s*\{[^}]*padding-bottom:\s*72px/s,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\) \{[\s\S]*body\[data-page="blank"\] #design-clearance-sale\.design-new-arrivals\s*\{[^}]*padding-bottom:\s*64px/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-shop-under__tile\s*\{[^}]*min-height:\s*clamp\(280px,\s*34vw,\s*420px\)/s,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\) \{[\s\S]*body\[data-page="blank"\] \.design-shop-under__tile\s*\{[^}]*min-height:\s*min\(64vw,\s*340px\)/s,
  );
});

test("design nits: collection tiles are taller and campaign next arrow is frosted", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__tile\s*\{[^}]*min-height:\s*clamp\(240px,\s*28vw,\s*340px\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__tile:nth-child\(n \+ 3\)\s*\{[^}]*min-height:\s*clamp\(200px,\s*23vw,\s*280px\)/s,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\) \{[\s\S]*body\[data-page="blank"\] \.design-collection-bento__tile:nth-child\(n \+ 3\)\s*\{[^}]*min-height:\s*min\(58vw,\s*280px\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-hero__arrow--next\s*\{[^}]*box-shadow:\s*none[^}]*opacity:\s*0\.85[^}]*backdrop-filter:\s*blur\(10px\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] #design-ready-to-wear-banner \.design-feature-banner__title\s*\{[^}]*font-size:\s*clamp\(30px,\s*3\.6vw,\s*52px\)/s,
  );
});

test("design nits: Ready-to-wear feature banner uses white section frame + primary-100 panel", async () => {
  const css = await source("playground/styles/design.css");
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-feature-banner\s*\{[^}]*padding:\s*24px[^}]*background:\s*var\(--white\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-feature-banner__inner\s*\{[^}]*border-radius:\s*16px[^}]*background:\s*var\(--color-primary-100\)/s,
  );

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-feature-banner\s*\{[^}]*border:\s*0/s,
  );
  assert.doesNotMatch(
    css,
    /body\[data-page="blank"\] \.design-feature-banner\s*\{[^}]*border:\s*1px/s,
  );
});

test("design nits: Clearance overlay banner uses deep plum panel + cream type", async () => {
  const css = await source("playground/styles/design.css");
  const blank = await source("playground/pages/blank.js");
  const clearanceBanner = blank.slice(
    blank.indexOf('id: "design-clearance-banner"'),
    blank.indexOf('id: "design-clearance-sale"'),
  );
  assert.match(clearanceBanner, /layout:\s*"overlay"/);
  assert.match(clearanceBanner, /src:\s*"\/assets\/design-story-cream\.jpg"/);
  assert.doesNotMatch(clearanceBanner, /design-collection-festive\.jpg/);
  assert.match(css, /design-feature-banner--overlay/);
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__inner\s*\{[\s\S]*background:\s*var\(--color-primary-900\)/,
  );
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__title\s*\{[\s\S]*color:\s*var\(--cream\)/,
  );
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__cta\s*\{[\s\S]*background:\s*var\(--cream\)/,
  );
  assert.match(css, /design-feature-banner__scrim/);
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__scrim\s*\{[^}]*rgba\(18,\s*10,\s*12,\s*0\.55\)[^}]*rgba\(18,\s*10,\s*12,\s*0\.28\)[^}]*rgba\(18,\s*10,\s*12,\s*0\.12\)/,
  );
  assert.doesNotMatch(
    css,
    /design-feature-banner--overlay \.design-feature-banner__scrim\s*\{[^}]*rgba\(18,\s*10,\s*12,\s*0\.82\)/,
  );
  assert.doesNotMatch(
    css,
    /design-feature-banner--overlay \.design-feature-banner__scrim\s*\{[^}]*rgba\(18,\s*10,\s*12,\s*0\.48\)/,
  );
  assert.match(
    css,
    /\.design-feature-banner__title\s*\{[^}]*text-transform:\s*none/,
  );
  assert.match(
    css,
    /design-testimonials__card\s*\{[^}]*grid-template-columns:\s*260px\s+minmax\(280px,\s*400px\)/,
  );
  assert.match(
    css,
    /design-testimonials__body\s*\{[^}]*font-weight:\s*300/,
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
