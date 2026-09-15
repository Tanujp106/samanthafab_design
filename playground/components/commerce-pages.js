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
      empty.copy ||
        "Add a piece you love and it will appear here.",
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

function bagLine(item) {
  const row = element("article", "commerce-bag-line");
  row.dataset.productId = item.id;

  const mediaWrap = element("div", "commerce-bag-line__media-wrap");
  const mediaLink = element("a", "commerce-bag-line__media");
  mediaLink.href = productHref(item);
  mediaLink.setAttribute("aria-label", item.name);
  mediaLink.append(renderMedia(item.media, { ratio: "portrait", notesEnabled: false }));

  const remove = element("button", "commerce-bag-line__remove");
  remove.type = "button";
  remove.dataset.bagRemove = item.id;
  remove.setAttribute("aria-label", `Remove ${item.name}`);
  remove.textContent = "×";
  mediaWrap.append(mediaLink, remove);

  const body = element("div", "commerce-bag-line__body");
  if (item.tag) body.append(element("span", "product-tag", item.tag));

  const title = element("a", "commerce-bag-line__title", item.name);
  title.href = productHref(item);
  body.append(title);

  const priceLine = element("div", "product-price-line");
  priceLine.append(element("span", "product-price", item.price));
  if (item.compareAt) priceLine.append(element("span", "product-compare", item.compareAt));
  if (item.discount) priceLine.append(element("span", "product-discount", item.discount));
  body.append(priceLine);

  const meta = element("div", "commerce-bag-line__meta");
  const qty = element("div", "commerce-bag-line__qty");
  qty.setAttribute("role", "group");
  qty.setAttribute("aria-label", "Quantity");
  const minus = element("button", "commerce-bag-line__qty-btn");
  minus.type = "button";
  minus.dataset.bagQty = item.id;
  minus.dataset.bagQtyDelta = "-1";
  minus.setAttribute("aria-label", "Decrease quantity");
  minus.textContent = "−";
  const value = element("span", "commerce-bag-line__qty-value", String(item.quantity || 1));
  const plus = element("button", "commerce-bag-line__qty-btn");
  plus.type = "button";
  plus.dataset.bagQty = item.id;
  plus.dataset.bagQtyDelta = "1";
  plus.setAttribute("aria-label", "Increase quantity");
  plus.textContent = "+";
  qty.append(minus, value, plus);
  meta.append(qty);

  const move = element("button", "commerce-bag-line__move");
  move.type = "button";
  move.dataset.bagMoveWishlist = item.id;
  move.textContent = "Save for later";
  meta.append(move);
  body.append(meta);

  row.append(mediaWrap, body);
  return row;
}

function renderBagBody({ items = [], empty = {} } = {}) {
  const body = element("div", "bag-drawer__body");
  body.dataset.bagDrawerBody = "true";

  const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (!items.length) {
    body.classList.add("bag-drawer__body--empty");
    body.append(bagEmptyState(empty));
    return { body, count, subtotal: 0 };
  }

  body.classList.add("bag-drawer__body--filled");

  const list = element("div", "commerce-bag-list");
  items.forEach((item) => list.append(bagLine(item)));
  body.append(list);

  const subtotal = items.reduce(
    (sum, item) => sum + parsePriceValue(item.price) * (item.quantity || 1),
    0,
  );

  const footer = element("div", "bag-drawer__footer");
  const summary = element("div", "commerce-bag-summary commerce-bag-summary--drawer");
  summary.append(element("h2", "commerce-bag-summary__title", "Order summary"));
  const rows = element("dl", "commerce-bag-summary__rows");
  rows.append(element("dt", "", "Subtotal"), element("dd", "", formatRupee(subtotal)));
  rows.append(element("dt", "", "Shipping"), element("dd", "", "Calculated at checkout"));
  summary.append(rows);

  const total = element("div", "commerce-bag-summary__total");
  total.append(element("span", "", "Total"));
  total.append(element("strong", "", formatRupee(subtotal)));
  summary.append(total);

  const checkout = element("button", "button button--fill commerce-bag-summary__checkout");
  checkout.type = "button";
  checkout.dataset.bagCheckout = "true";
  checkout.textContent = "Checkout";
  summary.append(checkout);

  const trust = element("ul", "commerce-bag-summary__trust");
  ["Cash on delivery", "Easy returns", "Pan-India shipping"].forEach((label) => {
    trust.append(element("li", "commerce-bag-summary__trust-item", label));
  });
  summary.append(trust);
  summary.append(
    element("p", "commerce-bag-summary__note", "Playground prototype — checkout is not connected yet."),
  );

  footer.append(summary);
  body.append(footer);

  return { body, count, subtotal };
}

/** Right-side cart overlay (not a routed page). */
export function renderBagDrawer({ items = [], empty = {} } = {}) {
  const root = element("div", "bag-drawer");
  root.dataset.bagDrawer = "true";
  root.setAttribute("aria-hidden", "true");

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
  const titleWrap = element("div", "bag-drawer__title-wrap");
  const title = element("h2", "bag-drawer__title", "Shopping bag");
  title.id = "bag-drawer-title";
  const { body, count } = renderBagBody({ items, empty });
  const lede = element(
    "p",
    "bag-drawer__lede",
    count
      ? `${count} ${count === 1 ? "piece" : "pieces"} ready to checkout`
      : "Add something you love",
  );
  lede.dataset.bagDrawerCount = "true";
  titleWrap.append(title, lede);

  const close = element("button", "bag-drawer__close");
  close.type = "button";
  close.dataset.bagClose = "true";
  close.setAttribute("aria-label", "Close bag");
  close.textContent = "×";

  header.append(titleWrap, close);
  panel.append(header, body);
  root.append(overlay, panel);
  return root;
}

export function renderBagDrawerBody({ items = [], empty = {} } = {}) {
  return renderBagBody({ items, empty });
}
