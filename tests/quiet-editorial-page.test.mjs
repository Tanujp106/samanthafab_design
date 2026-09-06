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
      "/assets/design-collection-everyday.jpg",
      "/assets/design-collection-work.jpg",
      "/assets/design-collection-festive.jpg",
      "/assets/design-collection-wedding.jpg",
      "/assets/design-collection-ready-to-wear.jpg",
    ],
  );
  assert.match(designStyles, /-webkit-backdrop-filter:\s*blur\(2px\)/);
  assert.match(designStyles, /backdrop-filter:\s*blur\(2px\)/);
  assert.match(
    designStyles,
    /-webkit-mask-image:\s*linear-gradient\(to right, #000 0%, #000 48%, transparent 100%\)/,
  );
  assert.match(
    designStyles,
    /mask-image:\s*linear-gradient\(to right, #000 0%, #000 48%, transparent 100%\)/,
  );
  assert.match(
    designStyles,
    /background:\s*linear-gradient\(\s*to right,\s*rgba\(18, 10, 12, 0\.84\) 0%,\s*rgba\(18, 10, 12, 0\.58\) 32%,\s*rgba\(18, 10, 12, 0\.3\) 62%,\s*rgba\(18, 10, 12, 0\.12\) 82%,\s*transparent 100%\s*\)/,
  );
  assert.match(designStyles, /design-collection-bento__caption\s*\{[\s\S]*gap:\s*16px/);
  assert.match(designStyles, /border:\s*1px solid color-mix\(in srgb, var\(--color-cream\) 32%, transparent\)/);
  assert.match(designStyles, /font-size:\s*clamp\(24px, 2\.6vw, 38px\)/);
  assert.equal(collection.copy, "Start with the moment. The saree follows.");
  assert.equal(collection.items[0].copy, undefined);
  assert.ok(collection.items.every((item) => !item.copy));
  assert.equal(collection.items[0].media.position, "center top");
  assert.equal(collection.items[1].media.position, "center top");
});

test("design page includes a shaped shop-by-material rail", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const designStyles = await source("playground/styles/design.css");
  const material = blank.sections.find((section) => section.id === "design-shop-by-material");

  assert.ok(material);
  assert.equal(material.type, "material-rail");
  assert.deepEqual(
    material.items.map((item) => item.title),
    ["Silk", "Chiffon", "Organza", "Georgette", "Kota", "Linen"],
  );
  assert.match(renderer, /case "material-rail"/);
  assert.match(renderer, /renderMaterialRail/);
  assert.match(renderer, /design-material-shape/);
  assert.match(designStyles, /design-materials__tile/);
  assert.match(designStyles, /clip-path:\s*url\(#design-material-shape\)/);
  assert.match(designStyles, /design-materials\s*\{[\s\S]*background:\s*var\(--white\)/);
  assert.match(
    designStyles,
    /design-materials__header\s*\{[\s\S]*align-items:\s*center[\s\S]*text-align:\s*center/,
  );
  assert.match(
    designStyles,
    /design-materials__heading\s*\{[\s\S]*font-size:\s*clamp\(28px, 3\.2vw, 42px\)[\s\S]*letter-spacing:\s*-0\.03em/,
  );
  assert.match(
    designStyles,
    /design-materials__heading\s*\{[^}]*text-transform:\s*uppercase/,
  );
  assert.match(
    designStyles,
    /design-materials__label\s*\{[\s\S]*font-family:\s*"Sprat Campaign"/,
  );
  assert.match(
    designStyles,
    /design-materials__label\s*\{[\s\S]*font-size:\s*clamp\(18px, 1\.65vw, 24px\)/,
  );
  assert.match(
    designStyles,
    /design-materials__scrim\s*\{[\s\S]*backdrop-filter:\s*blur\(1\.5px\)/,
  );
  assert.match(
    designStyles,
    /design-materials__scrim\s*\{[\s\S]*background:\s*rgba\(18,\s*10,\s*12,\s*0\.38\)/,
  );
  assert.doesNotMatch(designStyles, /design-materials__tile::after/);
  assert.doesNotMatch(designStyles, /design-materials__cta\s*\{/);
  assert.doesNotMatch(renderer, /design-materials__cta/);
  assert.doesNotMatch(
    renderer.match(/function renderMaterialRail[\s\S]*?(?=\nfunction )/)?.[0] ?? "",
    /Explore/,
  );
  assert.match(
    designStyles,
    /design-materials__content\s*\{[\s\S]*justify-content:\s*center/,
  );
  assert.match(
    designStyles,
    /design-materials\s*\{[\s\S]*padding:\s*48px 24px 72px/,
  );
  const shopUnderIndex = blank.sections.findIndex((section) => section.id === "design-shop-under");
  const materialIndex = blank.sections.findIndex((section) => section.id === "design-shop-by-material");
  const clearanceBannerIndex = blank.sections.findIndex((section) => section.id === "design-clearance-banner");
  const clearanceIndex = blank.sections.findIndex((section) => section.id === "design-clearance-sale");
  const testimonialsIndex = blank.sections.findIndex((section) => section.id === "design-testimonials");
  assert.equal(materialIndex, shopUnderIndex + 1);
  assert.equal(clearanceBannerIndex, materialIndex + 1);
  assert.equal(clearanceIndex, materialIndex + 2);
  assert.equal(testimonialsIndex, materialIndex + 3);
});

test("design page places a clearance banner then sale carousel after shop by material", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const designStyles = await source("playground/styles/design.css");
  const materialIndex = blank.sections.findIndex((section) => section.id === "design-shop-by-material");
  const banner = blank.sections[materialIndex + 1];
  const clearance = blank.sections[materialIndex + 2];

  assert.equal(banner.id, "design-clearance-banner");
  assert.equal(banner.type, "feature-banner");
  assert.equal(banner.layout, "overlay");
  assert.equal(banner.title, "Clearance sale");
  assert.equal(banner.badge, "Upto 50% off");
  assert.equal(typeof banner.media, "object");
  assert.equal(Array.isArray(banner.media), false);
  assert.ok(banner.media?.src);
  assert.equal(clearance.id, "design-clearance-sale");
  assert.equal(clearance.type, "product-carousel");
  assert.equal(clearance.title, undefined);
  assert.equal(clearance.copy, undefined);
  assert.equal(clearance.eyebrow, undefined);
  assert.equal(clearance.viewAll, undefined);
  assert.ok(clearance.products.length >= 6);
  assert.ok(clearance.products.every((product) => Boolean(product.compareAt)));
  assert.match(renderer, /layout === "overlay"/);
  assert.match(renderer, /design-feature-banner--overlay/);
  assert.match(renderer, /design-feature-banner__scrim/);
  assert.match(renderer, /design-feature-banner__badge/);
  assert.match(renderer, /footer-newsletter/);
  assert.match(designStyles, /design-feature-banner--overlay/);
  assert.match(
    designStyles,
    /design-feature-banner--overlay \.design-feature-banner__inner\s*\{[\s\S]*background:\s*var\(--color-primary-900\)/,
  );
});

test("design page places a four-up new arrivals carousel after shop by collection", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const app = await source("playground/app.js");
  const designStyles = await source("playground/styles/design.css");
  const collectionIndex = blank.sections.findIndex((section) => section.type === "collection-bento");
  const arrivals = blank.sections[collectionIndex + 1];

  assert.equal(arrivals.type, "product-carousel");
  assert.equal(arrivals.id, "design-new-arrivals");
  assert.equal(arrivals.products.length, 8);
  assert.equal(arrivals.viewAll.label, "Shop All");
  assert.equal(arrivals.viewAll.href, "/?route=new-arrivals");
  assert.match(renderer, /case "product-carousel"/);
  assert.match(renderer, /renderProductCarousel/);
  assert.match(app, /data-new-arrivals-dir/);
  assert.match(app, /scrollBy/);
  assert.match(designStyles, /design-new-arrivals/);
  assert.match(designStyles, /grid-template-columns:\s*repeat\(8,\s*calc\(\(100% - 48px\) \/ 4\)\)/);
  assert.match(designStyles, /design-new-arrivals__track\s*\{[\s\S]*width:\s*100%/);
  assert.match(designStyles, /design-new-arrivals__heading\s*\{[\s\S]*font-family:\s*"Sprat Campaign",\s*var\(--font-display\)/);
  assert.match(designStyles, /design-new-arrivals__card \.product-name\s*\{[\s\S]*font-family:\s*"Sprat Campaign",\s*var\(--font-display\)/);
  assert.match(designStyles, /design-new-arrivals__card \.product-meta\s*\{[\s\S]*font-family:\s*var\(--font-body\)/);
  assert.match(designStyles, /design-new-arrivals\s*\{[\s\S]*background:\s*var\(--white\)/);
  assert.match(designStyles, /design-new-arrivals__heading\s*\{[\s\S]*color:\s*var\(--color-primary-800\)/);
  assert.match(designStyles, /design-new-arrivals__card \.product-name\s*\{[\s\S]*color:\s*var\(--color-primary-800\)/);
  assert.match(designStyles, /design-new-arrivals__inner\s*\{[\s\S]*width:\s*min\(100%,\s*var\(--content-max\)\)[\s\S]*margin-inline:\s*auto/);
  assert.match(designStyles, /design-new-arrivals__card \.product-card__media\s*\{[\s\S]*aspect-ratio:\s*3 \/ 4/);
  assert.match(designStyles, /design-new-arrivals__card \.media\s*\{[\s\S]*margin:\s*0/);
  assert.match(designStyles, /design-new-arrivals__card \.product-card__body\s*\{[\s\S]*text-align:\s*left/);
  assert.match(designStyles, /design-new-arrivals__stage/);
  assert.match(designStyles, /top:\s*calc\(\(100cqw - 48px\) \/ 6\)/);
  assert.match(designStyles, /product-card__wishlist/);
  assert.match(designStyles, /product-card__wishlist\s*\{[\s\S]*opacity:\s*0\.6[\s\S]*backdrop-filter:\s*blur\(10px\)/);
  assert.match(designStyles, /product-card__add-to-cart/);
  assert.match(designStyles, /product-card__swatch/);
  assert.match(renderer, /button button--fill design-new-arrivals__view-all/);
  assert.match(renderer, /commerce:\s*true/);
  assert.match(renderer, /product-card__wishlist/);
  assert.match(renderer, /Add to cart/);
  assert.match(renderer, /product-card__swatches/);
  assert.match(renderer, /priceLine\.append\(element\("span", "product-price"/);
  assert.match(renderer, /product-discount/);
  assert.match(renderer, /24% off/);
  assert.match(
    designStyles,
    /design-new-arrivals\s*\{[\s\S]*padding:\s*64px 24px 72px/,
  );
  assert.match(designStyles, /product-discount/);
  assert.match(
    designStyles,
    /product-discount\s*\{[\s\S]*background:\s*var\(--color-primary\)[\s\S]*color:\s*var\(--cream\)/,
  );
  assert.match(
    designStyles,
    /design-new-arrivals__card\s*\{[\s\S]*padding-bottom:\s*4px/,
  );
  assert.match(renderer, /!options\.commerce/);
  assert.equal(arrivals.products[0].tag, "Everyday");
  assert.equal(arrivals.products[0].compareAt, "₹2,299");
  assert.equal(arrivals.products[1].swatches.length, 3);
  assert.ok(arrivals.products.every((product) => product.tag && product.tag !== "New"));
  assert.ok(arrivals.products.every((product) => Boolean(product.compareAt)));
});

test("new arrivals use the defined Samantha font tokens", async () => {
  const designStyles = await source("playground/styles/design.css");
  const start = designStyles.indexOf("/* —— New arrivals");
  const end = designStyles.indexOf("/* —— Ready-to-wear");
  const newArrivalsStyles = designStyles.slice(start, end);

  assert.match(newArrivalsStyles, /design-new-arrivals__heading\s*\{[\s\S]*font-family:\s*"Sprat Campaign",\s*var\(--font-display\)[\s\S]*font-weight:\s*400[\s\S]*font-variation-settings:\s*"wdth" 122,\s*"wght" 100/);
  assert.match(newArrivalsStyles, /design-new-arrivals__header\s*\{[\s\S]*align-items:\s*center[\s\S]*text-align:\s*center/);
  assert.match(newArrivalsStyles, /design-new-arrivals__copy\s*\{[\s\S]*margin:\s*6px auto 0/);
  assert.match(newArrivalsStyles, /design-new-arrivals__copy\s*\{[\s\S]*font-family:\s*var\(--font-body\)[\s\S]*font-weight:\s*var\(--weight-body\)/);
  assert.match(newArrivalsStyles, /design-new-arrivals__card \.product-name\s*\{[\s\S]*font-family:\s*"Sprat Campaign",\s*var\(--font-display\)[\s\S]*font-weight:\s*400/);
  assert.match(newArrivalsStyles, /design-new-arrivals__card \.product-meta\s*\{[\s\S]*font-family:\s*var\(--font-body\)[\s\S]*font-weight:\s*var\(--weight-body\)/);
  assert.match(newArrivalsStyles, /design-new-arrivals__card \.product-price\s*\{[\s\S]*font-family:\s*var\(--font-body\)[\s\S]*font-weight:\s*var\(--weight-ui\)/);
  assert.match(newArrivalsStyles, /design-new-arrivals__card \.product-compare\s*\{[\s\S]*text-decoration:\s*line-through/);
  assert.doesNotMatch(newArrivalsStyles, /font-weight:\s*300/);
});

test("design page places a ready-to-wear promo banner after new arrivals", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const designStyles = await source("playground/styles/design.css");
  const arrivalsIndex = blank.sections.findIndex((section) => section.id === "design-new-arrivals");
  const uspRow = blank.sections[arrivalsIndex + 1];
  const bestSellers = blank.sections[arrivalsIndex + 2];
  const banner = blank.sections[arrivalsIndex + 3];

  assert.equal(uspRow.id, "design-usp-row");
  assert.equal(uspRow.type, "usp-row");
  assert.equal(uspRow.items.length, 4);
  assert.equal(bestSellers.id, "design-best-sellers");
  assert.equal(bestSellers.type, "product-carousel");
  assert.equal(bestSellers.title, "Best sellers");
  assert.equal(bestSellers.viewAll.label, "Shop All");
  assert.equal(banner.type, "feature-banner");
  assert.equal(banner.id, "design-ready-to-wear-banner");
  assert.equal(banner.eyebrow, "The drape, made easy");
  assert.equal(banner.title, "Ready to wear");
  assert.equal(banner.copy, "Pre-stitched sarees with pockets — easy on, easy all day.");
  assert.equal(banner.action.label, "Shop ready-to-wear");
  assert.equal(banner.action.href, "/?route=ready-to-wear");
  assert.equal(banner.media.length, 4);
  assert.notEqual(banner.layout, "overlay");
  assert.match(renderer, /case "feature-banner"/);
  assert.match(renderer, /renderFeatureBanner/);
  assert.match(renderer, /case "usp-row"/);
  assert.match(renderer, /renderUspRow/);
  assert.match(designStyles, /design-usp-row__list/);
  assert.match(designStyles, /design-usp-row__item\s*\{[\s\S]*flex-direction:\s*column/);
  assert.match(designStyles, /\.design-feature-banner/);
  assert.match(designStyles, /design-feature-banner__collage/);
  assert.match(
    designStyles,
    /design-feature-banner\s*\{[\s\S]*padding:\s*24px[\s\S]*background:\s*var\(--white\)/,
  );
  assert.match(
    designStyles,
    /design-feature-banner__inner\s*\{[\s\S]*border-radius:\s*16px[\s\S]*background:\s*var\(--color-primary-100\)/,
  );
});

test("design page places a headerless ready-to-wear product rail after the banner", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const designStyles = await source("playground/styles/design.css");
  const bannerIndex = blank.sections.findIndex((section) => section.id === "design-ready-to-wear-banner");
  const rail = blank.sections[bannerIndex + 1];

  assert.equal(rail.type, "product-carousel");
  assert.equal(rail.id, "design-ready-to-wear-products");
  assert.equal(rail.title, undefined);
  assert.equal(rail.eyebrow, undefined);
  assert.equal(rail.copy, undefined);
  assert.equal(rail.viewAll, undefined);
  assert.equal(rail.action.label, "Shop All");
  assert.equal(rail.products.length, 8);
  assert.deepEqual(
    [...new Set(rail.products.map((product) => product.tag))],
    ["Ready-to-wear"],
  );
  assert.equal(blank.sections[bannerIndex + 2].id, "design-shop-under");
  assert.equal(blank.sections.at(-1).id, "footer");
  assert.match(renderer, /const showHeader = Boolean\(title \|\| section\.eyebrow \|\| section\.copy \|\| section\.viewAll\)/);
  assert.match(designStyles, /design-new-arrivals--rail-only/);
});

test("design page places a shop-under price band after ready-to-wear products", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const designStyles = await source("playground/styles/design.css");
  const railIndex = blank.sections.findIndex((section) => section.id === "design-ready-to-wear-products");
  const shopUnder = blank.sections[railIndex + 1];

  assert.equal(shopUnder.type, "shop-under");
  assert.equal(shopUnder.id, "design-shop-under");
  assert.equal(shopUnder.title, "Best on budget");
  assert.equal(shopUnder.items.length, 3);
  assert.deepEqual(
    shopUnder.items.map((item) => item.title),
    ["Shop under", "Shop under", "Shop under"],
  );
  assert.deepEqual(
    shopUnder.items.map((item) => item.price),
    ["₹999", "₹1,999", "₹2,999"],
  );
  assert.deepEqual(
    shopUnder.items.map((item) => item.href),
    ["/?route=shop-under-999", "/?route=shop-under-1999", "/?route=shop-under-2999"],
  );
  assert.ok(shopUnder.items.every((item) => Boolean(item.media?.src)));
  assert.equal(blank.sections[railIndex + 2].id, "design-shop-by-material");
  assert.equal(blank.sections[railIndex + 3].id, "design-clearance-banner");
  assert.equal(blank.sections[railIndex + 4].id, "design-clearance-sale");
  assert.equal(blank.sections[railIndex + 5].id, "design-testimonials");
  assert.equal(blank.sections[railIndex + 6].id, "footer");
  assert.equal(blank.sections.at(-1).id, "footer");
  assert.match(renderer, /case "shop-under"/);
  assert.match(renderer, /renderShopUnder/);
  assert.match(renderer, /design-shop-under__label-price/);
  assert.match(designStyles, /\.design-shop-under/);
  assert.match(designStyles, /design-shop-under__grid/);
  assert.match(designStyles, /design-shop-under__tile/);
  assert.match(designStyles, /design-shop-under__tile\s*\{[\s\S]*min-height:\s*clamp\(280px, 34vw, 420px\)/);
  assert.match(designStyles, /design-shop-under__heading\s*\{[\s\S]*font-family:\s*"Sprat Campaign"/);
  assert.match(designStyles, /design-shop-under__label-price\s*\{[\s\S]*font-size:\s*clamp\(28px/);
  assert.match(designStyles, /design-shop-under\s*\{[\s\S]*padding:\s*48px 24px 88px/);
  assert.match(designStyles, /design-collection-bento__header\s*\{[\s\S]*align-items:\s*center[\s\S]*text-align:\s*center/);
});


test("design page places a testimonials feature after shop under", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const app = await source("playground/app.js");
  const designStyles = await source("playground/styles/design.css");
  const shopUnderIndex = blank.sections.findIndex((section) => section.id === "design-shop-under");
  const material = blank.sections[shopUnderIndex + 1];
  const clearanceBanner = blank.sections[shopUnderIndex + 2];
  const clearance = blank.sections[shopUnderIndex + 3];
  const testimonials = blank.sections[shopUnderIndex + 4];

  assert.equal(material.id, "design-shop-by-material");
  assert.equal(clearanceBanner.id, "design-clearance-banner");
  assert.equal(clearance.id, "design-clearance-sale");
  assert.equal(testimonials.type, "testimonials");
  assert.equal(testimonials.id, "design-testimonials");
  assert.equal(testimonials.title, "Loved by her");
  assert.ok(testimonials.items.length >= 6);
  assert.ok(
    testimonials.items.every(
      (item) => Boolean(item.name) && Boolean(item.quote) && Boolean(item.media?.src),
    ),
  );
  assert.ok(testimonials.items.some((item) => Boolean(item.meta)));
  assert.match(renderer, /case "testimonials"/);
  assert.match(renderer, /renderTestimonials/);
  assert.match(renderer, /renderTestimonialCard/);
  assert.match(renderer, /data-testimonials/);
  assert.match(renderer, /data-testimonials-ticker/);
  assert.match(renderer, /data-testimonials-viewport/);
  assert.match(renderer, /design-testimonials__track/);
  assert.match(renderer, /design-testimonials__card/);
  assert.match(renderer, /design-testimonials__attribution/);
  assert.match(renderer, /ratio:\s*"square"/);
  assert.match(renderer, /aria-hidden/);
  assert.doesNotMatch(renderer, /data-testimonials-carousel/);
  assert.doesNotMatch(renderer, /testimonialsCarouselArrow/);
  assert.doesNotMatch(app, /data-testimonials-carousel/);
  assert.doesNotMatch(app, /data-testimonials-dir/);
  assert.match(app, /data-testimonials-ticker/);
  assert.match(app, /playbackRate/);
  assert.match(designStyles, /\.design-testimonials/);
  assert.match(designStyles, /design-testimonials__stage/);
  assert.match(designStyles, /design-testimonials__viewport/);
  assert.match(designStyles, /design-testimonials__track/);
  assert.match(designStyles, /design-testimonials__card/);
  assert.match(designStyles, /@keyframes\s+design-testimonials-ticker/);
  assert.match(
    designStyles,
    /design-testimonials\s*\{[\s\S]*padding:\s*56px 0 80px/,
  );
  assert.match(
    designStyles,
    /animation:\s*design-testimonials-ticker\s+55s\s+linear\s+infinite/,
  );
  assert.doesNotMatch(designStyles, /275s/);
  assert.doesNotMatch(designStyles, /animation-play-state:\s*paused/);
  assert.match(designStyles, /translateX\(-50%\)/);
  assert.match(designStyles, /aspect-ratio:\s*1\s*\/\s*1/);
  assert.match(designStyles, /design-testimonials__attribution/);
  assert.match(designStyles, /clamp\(16px,\s*1\.35vw,\s*19px\)/);
  assert.match(designStyles, /grid-template-columns:\s*260px\s+minmax\(280px,\s*400px\)/);
  assert.doesNotMatch(designStyles, /calc\(\(100% - 32px\) \/ 2\.5\)/);
  assert.doesNotMatch(designStyles, /design-testimonials__arrow/);
  assert.doesNotMatch(designStyles, /design-testimonials__controls/);
  assert.doesNotMatch(designStyles, /design-testimonials__thumb/);
  assert.doesNotMatch(designStyles, /design-testimonials__rail/);
  assert.match(
    designStyles,
    /design-testimonials__heading\s*\{[\s\S]*font-family:\s*"Sprat Campaign"[\s\S]*color:\s*var\(--color-primary-800\)/,
  );
  assert.equal(blank.sections.at(-1).id, "footer");
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
    23,
  );
  assert.equal(footer.trust.length, 4);
  assert.deepEqual(
    footer.trust.map((item) => item.label),
    [
      "Cash on delivery",
      "Easy returns",
      "Pan-India shipping",
      "WhatsApp support",
    ],
  );
});

test("footer brand includes a newsletter email capture", async () => {
  const { blank } = await pageModule("playground/pages/blank.js");
  const renderer = await source("playground/components/render.js");
  const styles = await source("playground/styles/homepage.css");
  const footer = blank.sections.at(-1);

  assert.equal(footer.newsletter?.label, "Join our newsletter for new drops");
  assert.equal(footer.newsletter?.cta, "Subscribe");
  assert.match(renderer, /data-footer-newsletter/);
  assert.match(styles, /\.footer-newsletter\s*\{[^}]*margin-top:\s*36px/s);
});

test("footer brand uses the supplied Samantha logo asset", async () => {
  const renderer = await source("playground/components/render.js");
  const footerRenderer = renderer.slice(
    renderer.indexOf("function footerTrustIcon"),
    renderer.indexOf("function renderSection"),
  );

  assert.match(footerRenderer, /footer-wordmark/);
  assert.match(footerRenderer, /renderBrandImage\(\)/);
  assert.match(footerRenderer, /footer-trust/);
});

test("footer surface uses the defined Samantha plum palette", async () => {
  const styles = await source("playground/styles/homepage.css");
  const footerStyles = styles.slice(styles.indexOf("/* Footer */"));

  assert.match(footerStyles, /\.site-footer\s*\{[\s\S]*background:\s*var\(--color-primary\)/);
  assert.match(footerStyles, /\.footer-wordmark \.wordmark__image\s*\{[\s\S]*filter:\s*brightness\(0\) invert\(1\)/);
  assert.match(footerStyles, /\.footer-heading\s*\{[\s\S]*color:\s*var\(--cream\)/);
  assert.match(footerStyles, /\.footer-bottom\s*\{[\s\S]*color-mix\(in srgb, var\(--color-cream\) 32%, transparent\)/);
});
