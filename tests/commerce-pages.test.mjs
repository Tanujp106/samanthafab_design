import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  resolveCommerceKind,
  commerceUrl,
} from "../playground/data/collections.js";
import { resolveHoverMedia } from "../playground/data/hover-media.js";
import {
  addToBag,
  bagCount,
  productIdFrom,
  readBag,
  readWishlist,
  removeFromBag,
  toggleWishlist,
  wishlistCount,
} from "../playground/lib/commerce-store.mjs";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

const memory = new Map();
const storage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null;
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
  removeItem(key) {
    memory.delete(key);
  },
  clear() {
    memory.clear();
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: storage,
  configurable: true,
});

test("commerce routes resolve wishlist and bag aliases", () => {
  assert.equal(resolveCommerceKind("wishlist"), "wishlist");
  assert.equal(resolveCommerceKind("bag"), "bag");
  assert.equal(resolveCommerceKind("cart"), "bag");
  assert.equal(resolveCommerceKind("collection"), null);
  assert.equal(commerceUrl("wishlist"), "/design?route=wishlist");
  assert.equal(commerceUrl("bag"), "/design?route=bag");
});

test("hover media pairs primary product images to archive alternates", () => {
  const hover = resolveHoverMedia({
    media: { src: "/assets/design-product-sage.jpg" },
  });
  assert.equal(hover.src, "/assets/design-collection-everyday.jpg");
  assert.equal(
    resolveHoverMedia({
      media: { src: "/assets/design-product-sage.jpg" },
      hoverMedia: { src: "/assets/custom.jpg" },
    }).src,
    "/assets/custom.jpg",
  );
});

test("commerce store toggles wishlist and bag quantities", () => {
  memory.clear();
  const product = {
    id: "sage-handblock",
    name: "Sage green handblock saree",
    price: "₹1,899",
    href: "/?route=product-sage-handblock",
    media: { src: "/assets/design-product-sage.jpg" },
  };

  assert.equal(productIdFrom(product), "sage-handblock");
  assert.equal(wishlistCount(), 0);
  assert.equal(toggleWishlist(product).wishlisted, true);
  assert.equal(readWishlist().length, 1);
  assert.equal(toggleWishlist(product).wishlisted, false);
  assert.equal(wishlistCount(), 0);

  addToBag(product);
  addToBag(product);
  assert.equal(bagCount(), 2);
  assert.equal(readBag()[0].quantity, 2);
  removeFromBag(product.id);
  assert.equal(bagCount(), 0);
});

test("design wires hover media, commerce pages, and nav routes", async () => {
  const render = await source("playground/components/render.js");
  const app = await source("playground/app.js");
  const blank = await source("playground/pages/blank.js");
  const css = await source("playground/styles/design.css");
  const commercePages = await source("playground/components/commerce-pages.js");

  assert.match(render, /resolveHoverMedia/);
  assert.match(render, /media--hover/);
  assert.match(render, /commerceView/);
  assert.match(render, /renderWishlistPage/);
  assert.match(render, /renderBagDrawer/);
  assert.match(render, /renderMobileBagPanel/);
  assert.match(app, /resolveCommerceKind/);
  assert.match(app, /bindCommerceInteractions/);
  assert.match(app, /showCommerceToast/);
  assert.match(app, /setBagDrawerOpen/);
  assert.match(app, /setMobileTabState/);
  assert.match(app, /max-width: 900px/);
  assert.match(app, /setMobileTabState\(document\.body\.dataset\.mobileTab === "bag" \? "bag" : "home"\)/);
  assert.match(app, /data-bag-open/);
  assert.match(blank, /commerceUrl\("wishlist"\)/);
  assert.match(css, /media--hover/);
  assert.match(css, /\.commerce-page/);
  assert.match(css, /\.bag-drawer/);
  assert.match(css, /product-card__wishlist\[aria-pressed="true"\] svg/);
  assert.match(css, /\.commerce-toast/);
  assert.match(commercePages, /Bag/);
  assert.match(commercePages, /Wishlist/);
  assert.match(commercePages, /renderProductCard/);
  assert.match(commercePages, /bag-drawer/);
  assert.match(commercePages, /renderBagPage/);
  assert.match(commercePages, /commerce-empty--wishlist/);
  assert.match(commercePages, /commerce-empty--bag/);
  assert.match(commercePages, /wishlistEmptyIllustration/);
  assert.match(commercePages, /Shop best sellers/);
  assert.match(commercePages, /commerce-empty__illustration/);
  assert.doesNotMatch(commercePages, /Tip: the heart sits/);
  assert.doesNotMatch(commercePages, /Add something you love/);
  assert.doesNotMatch(commercePages, /Playground prototype/);
  assert.doesNotMatch(commercePages, /bag-drawer__lede/);
  assert.match(commercePages, /Save for later/);
  assert.match(commercePages, /commerce-bag-usps/);
  assert.match(commercePages, /commerce-bag-offer/);
  assert.match(commercePages, /Offers available at checkout/);
  assert.match(commercePages, /commerce-bag-summary__checkout-shimmer/);
  assert.match(commercePages, /bagPricing/);
  assert.match(commercePages, /bagDiscountLabel/);
  assert.match(commercePages, /commerce-bag-line__compare/);
  assert.match(commercePages, /bag-bestsellers/);
  assert.match(commercePages, /Our bestsellers/);
  assert.match(commercePages, /bag-bestsellers__arrow/);
  assert.match(commercePages, /bagBestsellersDir/);
  assert.match(app, /data-bag-bestsellers-dir/);
  assert.match(commercePages, /Free shipping/);
  assert.match(commercePages, /Easy returns & exchange/);
  assert.match(app, /bindBagBestsellersRails/);
  assert.match(css, /commerce-empty--wishlist/);
  assert.match(css, /commerce-empty--bag/);
  assert.match(css, /commerce-empty__illustration/);
  assert.match(css, /commerce-empty--wishlist \.commerce-empty__cta/);
  assert.match(css, /commerce-empty--wishlist \.commerce-empty__copy/);
  assert.match(css, /commerce-empty__visual--icon/);
  assert.match(css, /commerce-bag-line__qty-btn--trash/);
  assert.match(css, /commerce-bag-line__compare/);
  assert.match(css, /commerce-bag-line__discount/);
  assert.match(css, /commerce-bag-offer/);
  assert.match(css, /commerce-bag-offer__shimmer/);
  assert.match(css, /commerce-bag-summary__checkout-shimmer/);
  assert.match(css, /bag-drawer__footer/);
  assert.match(css, /bag-drawer__count/);
  assert.match(css, /bag-bestsellers/);
  assert.match(css, /bag-bestsellers__arrow/);
  assert.match(css, /commerce-bag-usps/);
  assert.doesNotMatch(css, /commerce-bag-summary__note/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.bag-drawer\s*\{[^}]*display:\s*none/s);
});

test("empty bag and wishlist states stay concise and use familiar iconography", async () => {
  const commercePages = await source("playground/components/commerce-pages.js");
  const blank = await source("playground/pages/blank.js");
  const css = await source("playground/styles/design.css");

  assert.doesNotMatch(commercePages, /secondaryLabel|commerce-empty__secondary/);
  assert.doesNotMatch(commercePages, /Tip: Add to cart appears/);
  assert.doesNotMatch(blank, /secondaryLabel:|secondaryHref:|hint:/);
  assert.match(commercePages, /commerce-empty__visual--icon/);
  assert.match(commercePages, /M20\.84 4\.61a5\.5 5\.5 0 0 0-7\.78 0/);
  assert.match(commercePages, /M5 8h14l1 13H4L5 8Z/);
  assert.doesNotMatch(commercePages, /ellipse cx="110"/);
  assert.match(commercePages, /bagBestsellersRail/);
  assert.match(commercePages, /bagUspStrip/);
  assert.match(css, /commerce-empty--wishlist \.commerce-empty__title[\s\S]*text-transform:\s*none/);
  assert.match(css, /commerce-empty--bag \.commerce-empty__title[\s\S]*text-transform:\s*none/);
  assert.match(css, /commerce-empty--bag \.commerce-empty__cta[\s\S]*text-transform:\s*none/);
});
