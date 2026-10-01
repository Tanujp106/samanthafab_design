import { parsePriceValue } from "../lib/collection-filters.mjs";
import { productUrl, resolveProductSlug } from "../data/collections.js";
import { renderMedia } from "./media.js";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatRupee(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function breadcrumbs(currentLabel) {
  const crumbs = element("nav", "collection-plp__breadcrumbs");
  crumbs.setAttribute("aria-label", "Breadcrumb");
  const home = element("a", "collection-plp__crumb", "Home");
  home.href = "/design";
  crumbs.append(home);
  crumbs.append(element("span", "collection-plp__crumb-sep", "/"));
  crumbs.append(element("span", "collection-plp__crumb collection-plp__crumb--current", currentLabel));
  return crumbs;
}

function productHref(item = {}) {
  const slug = resolveProductSlug(item.id, null);
  return slug ? productUrl(slug) : item.href || "/design";
}

function emptyIconVisual(iconKind = "heart") {
  const visual = element("div", "commerce-empty__visual commerce-empty__visual--icon");
  visual.setAttribute("aria-hidden", "true");
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", "commerce-empty__illustration");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML =
    iconKind === "bag"
      ? '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
      : '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" fill="currentColor"/>';
  visual.append(icon);
  return visual;
}

function wishlistEmptyIllustration() {
  return emptyIconVisual("heart");
}

function wishlistEmptyState(empty = {}) {
  const root = element("div", "commerce-empty commerce-empty--wishlist");
  root.append(wishlistEmptyIllustration());
  root.append(element("h2", "commerce-empty__title", empty.title || "Nothing saved yet"));
  root.append(
    element(
      "p",
      "commerce-empty__copy",
      empty.copy ||
        "Tap the heart on a saree you love. Saved pieces gather here so you can return to them anytime.",
    ),
  );

  const actions = element("div", "commerce-empty__actions");
  const primary = element(
    "a",
    "button button--fill commerce-empty__cta",
    empty.ctaLabel || "Shop best sellers",
  );
  primary.href = empty.ctaHref || "/design?route=collection&slug=bestsellers";
  actions.append(primary);
  root.append(actions);
  return root;
}

function bagEmptyState(empty = {}) {
  const root = element("div", "commerce-empty commerce-empty--bag");
  root.append(emptyIconVisual("bag"));
  root.append(element("h2", "commerce-empty__title", empty.title || "Your bag is empty"));
  root.append(
    element(
      "p",
      "commerce-empty__copy",
      empty.copy || "No pieces yet — let’s fix that.",
    ),
  );

  const actions = element("div", "commerce-empty__actions");
  const primary = element(
    "button",
    "button button--fill commerce-empty__cta",
    empty.ctaLabel || "Continue shopping",
  );
  primary.type = "button";
  primary.dataset.bagClose = "true";
  actions.append(primary);
  root.append(actions);
  return root;
}

const BAG_USP_ITEMS = [
  {
    label: "Free shipping",
    path: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  },
  {
    label: "Easy returns & exchange",
    path: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  },
  {
    label: "2–3 day dispatch",
    path: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
  },
  {
    label: "COD across India",
    path: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  },
];

function bagUspIcon(pathMarkup) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("commerce-bag-usps__icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = pathMarkup;
  return icon;
}

function bagUspStrip() {
  const list = element("ul", "commerce-bag-usps");
  list.setAttribute("aria-label", "Shopping assurances");
  BAG_USP_ITEMS.forEach((item) => {
    const li = element("li", "commerce-bag-usps__item");
    li.append(bagUspIcon(item.path), element("span", "commerce-bag-usps__label", item.label));
    list.append(li);
  });
  return list;
}

function bagRailArrow(direction) {
  const isPrevious = direction === "previous";
  const arrow = element(
    "button",
    `bag-bestsellers__arrow bag-bestsellers__arrow--${direction}`,
  );
  arrow.type = "button";
  arrow.dataset.bagBestsellersDir = isPrevious ? "-1" : "1";
  arrow.setAttribute("aria-label", isPrevious ? "Previous bestsellers" : "Next bestsellers");

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = isPrevious
    ? '<path d="M15 6l-6 6 6 6"/>'
    : '<path d="M9 6l6 6-6 6"/>';
  arrow.append(icon);
  return arrow;
}

function bagBestsellersRail({ products = [], ctx = {}, renderProductCard } = {}) {
  if (!products.length || typeof renderProductCard !== "function") return null;

  const section = element("section", "bag-bestsellers");
  section.dataset.bagBestsellers = "true";
  section.setAttribute("aria-labelledby", "bag-bestsellers-title");

  const header = element("div", "bag-bestsellers__header");
  const heading = element("h3", "bag-bestsellers__title", "Our bestsellers");
  heading.id = "bag-bestsellers-title";
  const controls = element("div", "bag-bestsellers__controls");
  controls.append(bagRailArrow("previous"), bagRailArrow("next"));
  header.append(heading, controls);

  const viewport = element("div", "bag-bestsellers__viewport");
  viewport.dataset.bagBestsellersViewport = "true";
  const track = element("div", "bag-bestsellers__track");
  products.forEach((product) => {
    track.append(
      renderProductCard(product, ctx, {
        className: "design-new-arrivals__card bag-bestsellers__card",
        commerce: true,
      }),
    );
  });
  viewport.append(track);
  section.append(header, viewport);
  return section;
}

function bagTitleCount(count) {
  const title = element("h2", "bag-drawer__title");
  title.id = "bag-drawer-title";
  title.append(document.createTextNode("Bag"));
  const countNode = element("span", "bag-drawer__count", `(${count})`);
  countNode.dataset.bagDrawerCount = "true";
  title.append(countNode);
  return title;
}

function bagQtyTrashIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML =
    '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>';
  return icon;
}

/** Wishlist page: same commerce product cards; × removes from list. */
export function renderWishlistPage({
  products = [],
  empty = {},
  ctx = {},
  renderProductCard,
} = {}) {
  const root = element("section", "commerce-page commerce-page--wishlist");
  root.dataset.commercePage = "wishlist";

  root.append(breadcrumbs("Wishlist"));

  const header = element("header", "commerce-page__header");
  header.append(element("h1", "commerce-page__title", "Wishlist"));
  const count = products.length;
  if (count) {
    header.append(
      element(
        "p",
        "commerce-page__lede",
        `You have ${count} ${count === 1 ? "saved piece" : "saved pieces"}.`,
      ),
    );
  }
  root.append(header);

  if (!products.length) {
    root.append(wishlistEmptyState(empty));
    return root;
  }

  const grid = element("div", "commerce-wish-grid");
  products.forEach((product) => {
    if (typeof renderProductCard === "function") {
      grid.append(
        renderProductCard(product, ctx, {
          className: "design-new-arrivals__card commerce-wish-card",
          commerce: true,
          wishlistMode: true,
        }),
      );
      return;
    }
    grid.append(element("article", "commerce-wish-card", product.name || "Product"));
  });
  root.append(grid);
  return root;
}

function bagDiscountLabel(item = {}) {
  if (item.discount) return item.discount;
  const price = parsePriceValue(item.price);
  const compare = parsePriceValue(item.compareAt);
  if (!price || !compare || compare <= price) return "";
  const percent = Math.round(((compare - price) / compare) * 100);
  return percent > 0 ? `${percent}% off` : "";
}

function bagPricing(item = {}) {
  const wrap = element("div", "commerce-bag-line__pricing");
  wrap.append(element("span", "commerce-bag-line__price", item.price));

  const discount = bagDiscountLabel(item);
  if (item.compareAt || discount) {
    const meta = element("div", "commerce-bag-line__price-meta");
    if (item.compareAt) meta.append(element("span", "commerce-bag-line__compare", item.compareAt));
    if (discount) meta.append(element("span", "commerce-bag-line__discount", discount));
    wrap.append(meta);
  }
  return wrap;
}

function bagOfferStrip() {
  const strip = element("div", "commerce-bag-offer");
  strip.setAttribute("role", "note");

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("commerce-bag-offer__icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/>';

  strip.append(
    element("span", "commerce-bag-offer__shimmer"),
    icon,
    element("span", "commerce-bag-offer__copy", "Offers available at checkout"),
  );
  return strip;
}

function bagLine(item) {
  const row = element("article", "commerce-bag-line");
  row.dataset.productId = item.id;

  const mediaLink = element("a", "commerce-bag-line__media");
  mediaLink.href = productHref(item);
  mediaLink.setAttribute("aria-label", item.name);
  mediaLink.append(renderMedia(item.media, { ratio: "portrait", notesEnabled: false }));

  const body = element("div", "commerce-bag-line__body");

  const top = element("div", "commerce-bag-line__top");
  const identity = element("div", "commerce-bag-line__identity");
  const title = element("a", "commerce-bag-line__title", item.name);
  title.href = productHref(item);
  identity.append(title);
  if (item.tag) identity.append(element("span", "commerce-bag-line__tag", item.tag));
  top.append(identity, bagPricing(item));
  body.append(top);

  const meta = element("div", "commerce-bag-line__meta");
  const qty = element("div", "commerce-bag-line__qty");
  qty.setAttribute("role", "group");
  qty.setAttribute("aria-label", "Quantity");

  const trash = element("button", "commerce-bag-line__qty-btn commerce-bag-line__qty-btn--trash");
  trash.type = "button";
  trash.dataset.bagQty = item.id;
  trash.dataset.bagQtyDelta = "-1";
  trash.setAttribute("aria-label", "Decrease quantity");
  trash.append(bagQtyTrashIcon());

  const value = element("span", "commerce-bag-line__qty-value", String(item.quantity || 1));
  const plus = element("button", "commerce-bag-line__qty-btn");
  plus.type = "button";
  plus.dataset.bagQty = item.id;
  plus.dataset.bagQtyDelta = "1";
  plus.setAttribute("aria-label", "Increase quantity");
  plus.textContent = "+";
  qty.append(trash, value, plus);
  meta.append(qty);

  const move = element("button", "commerce-bag-line__move");
  move.type = "button";
  move.dataset.bagMoveWishlist = item.id;
  move.textContent = "Save for later";
  meta.append(move);
  body.append(meta);

  row.append(mediaLink, body);
  return row;
}

function renderBagBody({
  items = [],
  empty = {},
  bestsellers = [],
  ctx = {},
  renderProductCard,
} = {}) {
  const body = element("div", "bag-drawer__body");
  body.dataset.bagDrawerBody = "true";

  const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (!items.length) {
    body.classList.add("bag-drawer__body--empty");
    body.append(bagEmptyState(empty));
    const rail = bagBestsellersRail({ products: bestsellers, ctx, renderProductCard });
    if (rail) body.append(rail);
    return { body, count, subtotal: 0 };
  }

  body.classList.add("bag-drawer__body--filled");

  const list = element("div", "commerce-bag-list");
  items.forEach((item) => list.append(bagLine(item)));
  body.append(list);
  body.append(bagUspStrip());

  const subtotal = items.reduce(
    (sum, item) => sum + parsePriceValue(item.price) * (item.quantity || 1),
    0,
  );

  const footer = element("div", "bag-drawer__footer");
  const summary = element("div", "commerce-bag-summary commerce-bag-summary--drawer");

  const total = element("div", "commerce-bag-summary__total");
  total.append(element("span", "", "Total"));
  total.append(element("strong", "", formatRupee(subtotal)));
  summary.append(total);
  summary.append(bagOfferStrip());

  const checkout = element("button", "button button--fill commerce-bag-summary__checkout");
  checkout.type = "button";
  checkout.dataset.bagCheckout = "true";
  checkout.append(
    element("span", "commerce-bag-summary__checkout-shimmer"),
    element("span", "commerce-bag-summary__checkout-label", "Checkout"),
  );
  summary.append(checkout);

  footer.append(summary);
  body.append(footer);

  return { body, count, subtotal };
}

/** Right-side cart overlay (not a routed page). */
export function renderBagDrawer({
  items = [],
  empty = {},
  bestsellers = [],
  ctx = {},
  renderProductCard,
} = {}) {
  const root = element("div", "bag-drawer");
  root.dataset.bagDrawer = "true";
  root.setAttribute("aria-hidden", "true");
  root.inert = true;

  const overlay = element("button", "bag-drawer__overlay");
  overlay.type = "button";
  overlay.dataset.bagClose = "true";
  overlay.setAttribute("aria-label", "Close bag");

  const panel = element("aside", "bag-drawer__panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "bag-drawer-title");
  panel.dataset.bagDrawerPanel = "true";

  const header = element("header", "bag-drawer__header");
  const { body, count } = renderBagBody({
    items,
    empty,
    bestsellers,
    ctx,
    renderProductCard,
  });
  const title = bagTitleCount(count);

  const close = element("button", "bag-drawer__close");
  close.type = "button";
  close.dataset.bagClose = "true";
  close.setAttribute("aria-label", "Close bag");
  close.textContent = "×";

  header.append(title, close);
  panel.append(header, body);
  root.append(overlay, panel);
  return root;
}

export function renderBagDrawerBody({
  items = [],
  empty = {},
  bestsellers = [],
  ctx = {},
  renderProductCard,
} = {}) {
  return renderBagBody({ items, empty, bestsellers, ctx, renderProductCard });
}
