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

test("design nits: campaign copy sits left on desktop and centers on mobile", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-slide__content\s*\{[^}]*width:\s*100%[^}]*align-items:\s*flex-start[^}]*text-align:\s*left/s,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\)[\s\S]*body\[data-page="blank"\] \.campaign-slide__content\s*\{[^}]*align-items:\s*center[^}]*text-align:\s*center/s,
  );
});

test("design nits: campaign veil gives left copy a blurred patterned backdrop", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-slide__veil\s*\{[^}]*background:\s*linear-gradient\([\s\S]*?to right[\s\S]*?\)[^}]*backdrop-filter:\s*blur\(2\.5px\)[^}]*mask-image:\s*linear-gradient\(to right/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-slide__veil::before\s*\{[^}]*background-image:\s*[\s\S]*?design-campaign-paisley\.png[^}]*mask-image:\s*linear-gradient\(to right/s,
  );
});

test("design nits: campaign veil repeats the supplied paisley with a left-to-right gradient", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-slide__veil::before\s*\{[^}]*background-image:\s*[\s\S]*?linear-gradient\(\s*to right[\s\S]*?\),\s*[\s\S]*?url\(["']?\.\.\/assets\/design-campaign-paisley\.png["']?\)[^}]*background-repeat:\s*no-repeat,\s*repeat-x/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.campaign-slide__veil::before\s*\{[^}]*background-size:\s*100%\s*100%,\s*520px\s*auto/s,
  );
});

test("design nits: New Arrivals eyebrow→title is 6px", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__eyebrow\s*\{[^}]*margin-bottom:\s*6px/s,
  );
});

test("design nits: collection scrim uses a soft left linear fade", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*width:\s*72%/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*to right/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*rgba\(18,\s*10,\s*12,\s*0\.84\)\s*0%/s,
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
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*-webkit-mask-image:\s*linear-gradient\(to right/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__scrim\s*\{[^}]*mask-image:\s*linear-gradient\(to right/s,
  );
});

test("design nits: collection tiles use occasion-specific Lucide icons", async () => {
  const blank = await source("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const css = await source("playground/styles/design.css");

  for (const [title, icon] of [
    ["Everyday", "sunrise"],
    ["Work", "briefcase-business"],
    ["Festive", "party-popper"],
    ["Wedding", "gem"],
    ["Ready-to-wear", "shirt"],
  ]) {
    assert.match(
      blank,
      new RegExp(`title:\\s*"${title}"[\\s\\S]*?icon:\\s*"${icon}"`),
    );
  }

  assert.match(renderer, /const collectionIconPaths\s*=\s*\{/);
  assert.match(renderer, /function renderCollectionIcon\(name\)/);
  assert.match(renderer, /renderCollectionIcon\(item\.icon\)/);
  assert.match(renderer, /design-collection-bento__icon/);
  assert.match(renderer, /a2 2 0 0 1-3\.247 0l-7\.99-10\.986A2 2 0 0 1 2\.4 7\.8/);
  assert.match(css, /body\[data-page="blank"\] \.design-collection-bento__icon\s*\{/);
  assert.match(css, /width:\s*20px/);
  assert.match(css, /height:\s*20px/);
});

test("design nits: collection captions use a stacked Explore action", async () => {
  const renderer = await source("playground/components/render.js");
  const css = await source("playground/styles/design.css");

  assert.match(renderer, /design-collection-bento__action/);
  assert.match(renderer, /element\("span", "design-collection-bento__action-label", "Explore"\)/);
  assert.match(renderer, /meta\.append\(caption\)/);
  assert.doesNotMatch(renderer, /meta\.append\(caption, arrow\)/);
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__caption-title\s*\{[^}]*flex-direction:\s*column/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-collection-bento__action\s*\{[^}]*text-transform:\s*uppercase/s,
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
  assert.doesNotMatch(render, /product-card__swatches--empty/);
  assert.doesNotMatch(
    render,
    /product-card__media-actions[\s\S]{0,400}product-card__swatches/,
  );
});

test("design nits: USP row icons use a staggered infinite loop", async () => {
  const css = await source("playground/styles/design.css");
  const render = await source("playground/components/render.js");
  const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

  assert.match(render, /design-usp-row__icon-wrap/);
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-usp-row__icon-wrap\s*\{[^}]*animation:\s*design-usp-row-icon\s+3\.6s\s+ease-in-out\s+infinite/s,
  );
  assert.match(css, /design-usp-row__item:nth-child\(2\)[\s\S]*animation-delay:\s*-0\.9s/);
  assert.match(css, /@keyframes\s+design-usp-row-icon[\s\S]*transform:\s*translateY\(-6px\)\s+scale\(1\.06\)/);
  assert.match(
    reducedMotion,
    /body\[data-page="blank"\] \.design-usp-row__icon-wrap\s*\{[^}]*animation:\s*none/s,
  );
});

test("design nits: product prices stay tight under the title", async () => {
  const css = await source("playground/styles/design.css");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-card__body\s*\{[^}]*gap:\s*6px/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-meta\s*\{[^}]*margin-top:\s*0/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-card__body\s*\{[^}]*flex:\s*0 0 auto/s,
  );
  assert.doesNotMatch(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card \.product-meta\s*\{[^}]*margin-top:\s*auto/s,
  );
});

test("design nits: product carousels use a fixed-height horizontal rail", async () => {
  const css = await source("playground/styles/design.css");
  const app = await source("playground/app.js");

  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__viewport\s*\{[^}]*--product-rail-details:\s*7\.75rem/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__viewport\s*\{[^}]*height:\s*calc\(\(\(100cqi - 48px\) \/ 4\) \* 4 \/ 3 \+ var\(--product-rail-details\)\)/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__track\s*\{[^}]*align-items:\s*start/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__card\s*\{[^}]*height:\s*auto/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-new-arrivals__viewport\s*\{[^}]*overflow-x:\s*auto[^}]*overflow-y:\s*hidden/s,
  );
  assert.doesNotMatch(app, /window\.scrollBy\(0,\s*event\.deltaY\)/);
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
  const app = await source("playground/app.js");
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
  assert.match(renderer, /data-material-carousel/);
  assert.match(renderer, /data-material-viewport/);
  assert.match(renderer, /data-material-track/);
  assert.match(renderer, /aria-roledescription", "carousel"/);
  assert.match(renderer, /design-materials__controls/);
  assert.match(app, /data-material-carousel/);
  assert.match(app, /material-offset/);
  assert.match(app, /material-distance/);
  assert.match(app, /inert = distance > 1/);
  assert.match(app, /const activeSlot = wrap\(activeIndex\)/);
  assert.match(app, /activeIndex \+= direction/);
  assert.match(app, /cloneNode\(true\)/);
  assert.match(app, /track\.append/);
  assert.match(app, /data-material-copy/);
  assert.match(app, /activeIndex >= setSize \* 3/);
  assert.match(app, /Math\.abs\(relative - previousOffset\) > 2/);
  assert.match(app, /is-teleporting/);
  assert.match(css, /design-materials__viewport/);
  assert.match(css, /--material-card-width: min\(calc\(\(100cqi - 64px\) \/ 5\),/);
  assert.match(css, /--material-visible-count: 5/);
  assert.match(css, /data-distance="0"/);
  assert.match(css, /data-distance="1"/);
  assert.match(css, /data-distance="2"/);
  assert.match(
    css,
    /design-materials__tile\[data-distance="0"\] \.design-materials__label\s*\{[^}]*font-size:\s*clamp\(24px, 2\.2vw, 32px\)/s,
  );
  assert.match(css, /design-materials__tile\.is-teleporting\s*\{[^}]*transition:\s*none !important/s);
  assert.match(css, /design-materials__tile\[data-distance="1"\]\s*\{[^}]*filter:\s*blur\(1\.5px\)/s);
  assert.match(css, /design-materials__tile\[data-distance="2"\]\s*\{[^}]*filter:\s*blur\(3px\)/s);
});

test("design nits: Shop under uses uppercase titles and tightened section bottoms", async () => {
  const blank = await source("playground/pages/blank.js");
  const css = await source("playground/styles/design.css");

  assert.match(blank, /title:\s*"Best on budget"/);
  assert.match(
    css,
    /body\[data-page="blank"\] \.design-shop-under__heading\s*\{[^}]*text-transform:\s*uppercase/s,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\) \{[\s\S]*body\[data-page="blank"\] \.design-materials\s*\{[^}]*padding:\s*40px 16px 64px/s,
  );
  assert.match(
    css,
    /body\[data-page="blank"\] #design-clearance-sale\.design-new-arrivals\s*\{[^}]*padding-bottom:\s*48px/s,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\) \{[\s\S]*body\[data-page="blank"\] #design-clearance-sale\.design-new-arrivals\s*\{[^}]*padding-bottom:\s*40px/s,
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
  assert.match(clearanceBanner, /badge:\s*"Upto 50% off"/);
  assert.match(css, /design-feature-banner--overlay/);
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__inner\s*\{[\s\S]*min-height:\s*clamp\(364px,\s*42vw,\s*504px\)/,
  );
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__inner\s*\{[\s\S]*background:\s*var\(--color-primary-900\)/,
  );
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__badge\s*\{[\s\S]*text-transform:\s*uppercase/,
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
    /\.design-feature-banner__title\s*\{[^}]*text-transform:\s*uppercase/,
  );
  assert.match(
    css,
    /#design-ready-to-wear-banner \.design-feature-banner__title\s*\{[^}]*text-transform:\s*none/,
  );
  assert.match(
    css,
    /#design-clearance-banner \.design-feature-banner__title\s*\{[^}]*text-transform:\s*none/,
  );
  assert.match(
    css,
    /#design-ready-to-wear-banner\.design-feature-banner\s*\{[^}]*padding:\s*36px 24px/,
  );
  assert.match(
    css,
    /design-new-arrivals__view-all\s*\{[^}]*font-size:\s*13px/,
  );
  assert.match(
    css,
    /design-feature-banner--overlay \.design-feature-banner__copy\s*\{[\s\S]*max-width:\s*52ch/,
  );
  assert.match(
    css,
    /design-shop-under__heading\s*\{[^}]*margin:\s*0 auto 40px/,
  );
  assert.match(
    css,
    /design-testimonials__header\s*\{[^}]*align-items:\s*center/,
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
