import { renderMedia } from "./media.js";
import { resolveProductGallery } from "../data/product-gallery.js";
import { isWishlisted, productIdFrom, snapshotProduct } from "../lib/commerce-store.mjs";
import { whatsappIconSvg } from "../lib/icons.mjs";

const RTW_SURCHARGE = 70;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(pathMarkup, className = "product-detail__icon") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(className);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.6");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.innerHTML = pathMarkup;
  return svg;
}

function parseMoney(value) {
  const amount = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function formatInr(amount) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function productSku(product) {
  if (product.sku) return String(product.sku);
  const id = productIdFrom(product).replace(/[^a-z0-9]/gi, "").toUpperCase();
  return `SF-${(id || "PIECE").slice(0, 8)}`;
}

function discountLabel(product) {
  if (product.discount) return product.discount;
  const price = parseMoney(product.price);
  const compareAt = parseMoney(product.compareAt);
  if (!price || !compareAt || compareAt <= price) return "";
  return `${Math.round((1 - price / compareAt) * 100)}% off`;
}

function renderBreadcrumbs(product) {
  const nav = element("nav", "product-detail__breadcrumbs");
  nav.setAttribute("aria-label", "Breadcrumb");
  const home = element("a", "product-detail__breadcrumb", "Home");
  home.href = "/design";
  nav.append(home, element("span", "product-detail__breadcrumb-separator", "/"));
  nav.append(element("span", "product-detail__breadcrumb", product.tag || "Sarees"));
  nav.append(element("span", "product-detail__breadcrumb-separator", "/"));
  const current = element("span", "product-detail__breadcrumb product-detail__breadcrumb--current", product.name);
  current.setAttribute("aria-current", "page");
  nav.append(current);
  return nav;
}

function renderAccordion(title, copy, open = false) {
  const details = element("details", "product-detail__accordion");
  details.open = open;
  const summary = element("summary", "product-detail__accordion-summary");
  summary.append(element("span", "product-detail__accordion-label", title));
  summary.append(icon('<path d="M12 5v14"/><path d="M5 12h14"/>', "product-detail__accordion-icon"));
  details.append(summary, element("p", "product-detail__accordion-copy", copy));
  return details;
}

function renderTrustRow() {
  const list = element("ul", "product-detail__trust");
  list.setAttribute("aria-label", "Customer trust badges");
  [
    { label: "COD across India", path: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h2"/>' },
    { label: "Easy returns", path: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>' },
    { label: "Secure checkout", path: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>' },
  ].forEach((item) => {
    const li = element("li", "product-detail__trust-item");
    li.append(icon(item.path, "product-detail__trust-icon"), element("span", "product-detail__trust-label", item.label));
    list.append(li);
  });

  const whatsappItem = element("li", "product-detail__trust-item");
  const whatsappIcon = element("span", "product-detail__trust-icon product-detail__trust-icon--whatsapp");
  whatsappIcon.innerHTML = whatsappIconSvg({ size: 34 });
  whatsappItem.append(whatsappIcon, element("span", "product-detail__trust-label", "WhatsApp help"));
  list.append(whatsappItem);
  return list;
}

const WHATSAPP_ICON = whatsappIconSvg({ size: 24 });

function renderGallery(product) {
  const shell = element("div", "product-detail__gallery-shell");
  shell.dataset.pdpGalleryShell = "true";

  const viewport = element("div", "product-detail__gallery-viewport");
  viewport.dataset.pdpGalleryViewport = "true";

  const gallery = element("div", "product-detail__gallery");
  gallery.dataset.productGallery = "true";
  gallery.setAttribute("aria-label", "Product images");

  const frames = resolveProductGallery(product, { minCount: 4, maxCount: 4 });
  frames.forEach((media, index) => {
    const thumb = element("button", "product-detail__thumb");
    thumb.type = "button";
    thumb.dataset.pdpLightbox = String(index);
    thumb.setAttribute("aria-label", `View image ${index + 1} larger`);
    thumb.append(
      renderMedia(media, {
        ratio: null,
        eager: index === 0,
        notesEnabled: false,
        className: "product-detail__media",
      }),
    );
    gallery.append(thumb);
  });

  viewport.append(gallery);
  shell.append(viewport);

  if (frames.length > 1) {
    const dots = element("div", "product-detail__gallery-dots");
    dots.dataset.pdpGalleryDots = "true";
    dots.setAttribute("aria-hidden", "true");
    frames.forEach((_, index) => {
      const dot = element("span", "product-detail__gallery-dot");
      if (index === 0) dot.classList.add("is-active");
      dots.append(dot);
    });
    shell.append(dots);
  }

  return shell;
}

function renderVariantOptions(product) {
  const field = element("div", "product-detail__field product-detail__field--variants");
  field.append(element("span", "product-detail__label", "Blouse option"));
  const group = element("div", "product-detail__variants");
  group.dataset.pdpVariants = "true";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Select blouse option");

  [
    {
      id: "regular",
      title: "Regular",
      detail: "Unstitched blouse",
      surcharge: 0,
      selected: true,
    },
    {
      id: "ready-to-wear",
      title: "Ready-to-wear",
      detail: "Stitched blouse",
      surcharge: RTW_SURCHARGE,
      selected: false,
    },
  ].forEach((variant) => {
    const button = element("button", [
      "product-detail__variant",
      variant.selected ? "is-selected" : "",
    ].filter(Boolean).join(" "));
    button.type = "button";
    button.dataset.pdpVariant = variant.id;
    button.dataset.pdpSurcharge = String(variant.surcharge);
    button.setAttribute("aria-pressed", String(variant.selected));
    button.append(
      element("span", "product-detail__variant-title", variant.title),
      element("span", "product-detail__variant-detail", variant.detail),
      element(
        "span",
        "product-detail__variant-price",
        variant.surcharge ? `+ ${formatInr(variant.surcharge)}` : "+ ₹0",
      ),
    );
    group.append(button);
  });

  field.append(group);
  return field;
}

function renderPurchasePanel(product) {
  const panel = element("aside", "product-detail__purchase");
  const basePrice = parseMoney(product.price);
  const compareAt = parseMoney(product.compareAt);
  const payload = {
    ...snapshotProduct(product),
    variant: "regular",
    surcharge: 0,
    basePrice: product.price,
    price: product.price,
  };
  panel.dataset.productPayload = JSON.stringify(payload);
  panel.dataset.pdpBasePrice = String(basePrice);
  panel.dataset.pdpCompareAt = String(compareAt || "");

  const heading = element("div", "product-detail__heading");
  const titleRow = element("div", "product-detail__title-row");
  titleRow.append(element("h1", "product-detail__title", product.name));
  const share = element("button", "product-detail__share");
  share.type = "button";
  share.dataset.pdpShare = "true";
  share.setAttribute("aria-label", `Share ${product.name}`);
  share.append(icon('<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 3v12"/><path d="m8 7 4-4 4 4"/>'));
  titleRow.append(share);
  heading.append(titleRow);

  const sku = element("p", "product-detail__sku", `SKU: ${productSku(product)}`);
  heading.append(sku);

  const tags = element("div", "product-detail__tags");
  if (product.tag) tags.append(element("span", "product-detail__tag", product.tag));
  if (product.material) tags.append(element("span", "product-detail__tag", product.material));
  heading.append(tags);

  const description = element(
    "p",
    "product-detail__description",
    `${product.material || "Thoughtfully made fabric"} with a fluid fall and an easy rhythm for everyday dressing.`,
  );
  description.id = "product-details";

  const priceLine = element("div", "product-detail__price-line");
  priceLine.append(element("span", "product-detail__price", product.price));
  if (product.compareAt) priceLine.append(element("span", "product-detail__compare", product.compareAt));
  const discount = discountLabel(product);
  if (discount) priceLine.append(element("span", "product-detail__discount", discount));
  const taxNote = element("p", "product-detail__tax-note", "Inclusive of all taxes");
  const stock = Number.isInteger(product.stock) ? product.stock : null;
  const soldOut = product.availability === "out_of_stock" || stock === 0;
  const stockNote = soldOut
    ? element("p", "product-detail__stock product-detail__stock--sold-out", "Sold out")
    : stock !== null && stock <= 3
      ? element("p", "product-detail__stock", `Only ${stock} left`)
      : null;

  const giftOffer = element("aside", "product-detail__gift-offer");
  giftOffer.setAttribute("aria-label", "A complimentary gift included with your order");
  giftOffer.innerHTML = `
    <span class="product-detail__gift-offer-bg" aria-hidden="true"></span>
    <span class="product-detail__gift-offer-content">
      <svg class="product-detail__gift-offer-icon" viewBox="0 0 48 48" width="44" height="44" fill="none" aria-hidden="true">
        <rect x="10" y="20" width="28" height="20" rx="1.5" fill="var(--color-white)" stroke="var(--color-primary-800)" stroke-width="1.4"/>
        <path d="M10 28.5h28" stroke="var(--color-primary-800)" stroke-width="1.4"/>
        <path d="M24 20v20" stroke="var(--color-primary-400)" stroke-width="3.2"/>
        <path d="M10 20h28" stroke="var(--color-primary-800)" stroke-width="1.4"/>
        <path d="M24 20c-3.2-6.5-9.5-7.2-11.2-3.8-1.4 2.8 1.6 5.6 5.4 6.4 2 .4 4 .6 5.8 1.2Z" fill="var(--color-primary-300)" stroke="var(--color-primary-800)" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M24 20c3.2-6.5 9.5-7.2 11.2-3.8 1.4 2.8-1.6 5.6-5.4 6.4-2 .4-4 .6-5.8 1.2Z" fill="var(--color-primary-200)" stroke="var(--color-primary-800)" stroke-width="1.1" stroke-linejoin="round"/>
        <circle cx="14" cy="14" r="1.1" fill="var(--color-primary-400)"/>
        <circle cx="34" cy="12" r="0.9" fill="var(--color-primary-300)"/>
        <circle cx="38" cy="18" r="0.8" fill="var(--color-primary-400)"/>
        <circle cx="11" cy="19" r="0.7" fill="var(--color-primary-200)"/>
      </svg>
      <span class="product-detail__gift-offer-copy">
        <span class="product-detail__gift-offer-line">A complimentary Gift</span>
        <span class="product-detail__gift-offer-line">included with your order</span>
      </span>
    </span>
  `;

  const actions = element("div", "product-detail__actions");
  const addButton = element("button", "button button--fill product-detail__add");
  addButton.type = "button";
  addButton.dataset.commerceAction = "add-to-bag";
  addButton.dataset.pdpAddAnchor = "true";
  addButton.setAttribute("aria-label", `Add ${product.name} to bag`);
  addButton.disabled = soldOut;
  addButton.append(
    element("span", "product-detail__add-shimmer"),
    icon('<path d="M6 7h12l-1 12H7L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>', "product-detail__add-icon"),
    element("span", "product-detail__add-label", soldOut ? "Sold out" : "Add to cart"),
  );

  const wishlist = element("button", "product-detail__wishlist");
  wishlist.type = "button";
  wishlist.dataset.commerceAction = "wishlist-toggle";
  wishlist.dataset.productName = product.name;
  const wishlisted = isWishlisted(productIdFrom(product));
  wishlist.setAttribute("aria-label", wishlisted ? `Saved ${product.name}` : `Save ${product.name}`);
  wishlist.setAttribute("aria-pressed", String(wishlisted));
  const heart = icon('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>');
  if (wishlisted) heart.setAttribute("fill", "currentColor");
  wishlist.append(heart);

  const whatsapp = element("a", "product-detail__whatsapp");
  whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`Hi Samantha Fab, I'm interested in ${product.name}`)}`;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener noreferrer";
  whatsapp.setAttribute("aria-label", `Ask about ${product.name} on WhatsApp`);
  whatsapp.innerHTML = WHATSAPP_ICON;

  const primaryActions = element("div", "product-detail__primary-actions");
  primaryActions.append(addButton, wishlist, whatsapp);

  const buyNow = element("button", "button product-detail__buy-now", "Buy it now");
  buyNow.type = "button";
  buyNow.dataset.commerceAction = "buy-now";
  buyNow.setAttribute("aria-label", `Buy ${product.name} now`);
  buyNow.disabled = soldOut;
  actions.append(primaryActions, buyNow);

  const shippingAccordion = renderAccordion(
    "Shipping & Return policy",
    "Delivery options and charges are shown at checkout. Request an eligible return within 3 days of delivery; contact Samantha within 48 hours for a damaged or incorrect item.",
  );
  const policyLinks = element("p", "product-detail__policy-links");
  const shippingLink = element("a", "", "Shipping policy");
  shippingLink.href = "/design?route=page&slug=shipping-policy";
  const returnsLink = element("a", "", "Returns & refunds");
  returnsLink.href = "/design?route=page&slug=refund-policy";
  policyLinks.append(shippingLink, document.createTextNode(" · "), returnsLink);
  shippingAccordion.append(policyLinks);

  panel.append(heading, description, renderVariantOptions(product), priceLine, taxNote);
  if (stockNote) panel.append(stockNote);
  panel.append(actions, giftOffer, renderTrustRow(), shippingAccordion);
  if (!soldOut) panel.append(renderStickyBar(product));
  return panel;
}

function renderStickyBar(product) {
  const sticky = element("aside", "product-detail__sticky-bar");
  sticky.dataset.pdpStickyBar = "true";
  sticky.setAttribute("aria-label", "Quick purchase");
  sticky.setAttribute("aria-hidden", "true");

  const meta = element("div", "product-detail__sticky-bar-meta");
  meta.append(element("p", "product-detail__sticky-bar-title", product.name));

  const pricing = element("div", "product-detail__sticky-bar-pricing");
  const priceRow = element("div", "product-detail__sticky-bar-price-row");
  const price = element("span", "product-detail__sticky-bar-price", product.price);
  price.dataset.pdpStickyPrice = "true";
  priceRow.append(price, element("span", "product-detail__sticky-bar-mrp", "MRP"));
  pricing.append(priceRow, element("p", "product-detail__sticky-bar-tax", "inclusive of all taxes"));
  meta.append(pricing);

  const stickyActions = element("div", "product-detail__sticky-bar-actions");
  const stickyAdd = element("button", "product-detail__sticky-bar-add", "Add to cart");
  stickyAdd.type = "button";
  stickyAdd.dataset.commerceAction = "add-to-bag";
  stickyAdd.setAttribute("aria-label", `Add ${product.name} to bag`);

  const stickyBuy = element("button", "product-detail__sticky-bar-buy", "Buy now");
  stickyBuy.type = "button";
  stickyBuy.dataset.commerceAction = "buy-now";
  stickyBuy.setAttribute("aria-label", `Buy ${product.name} now`);

  stickyActions.append(stickyAdd, stickyBuy);
  sticky.append(meta, stickyActions);
  return sticky;
}

export function renderProductPage({ product, relatedProducts = [], ctx = {}, renderProductCard }) {
  const root = element("div", "product-detail-page");
  root.dataset.productPage = "true";
  if (!product) {
    const message = element("div", "product-detail__unavailable");
    message.append(element("h1", "product-detail__title", "This piece is unavailable"));
    message.append(element("p", "product-detail__description", "The link may be old or the piece may have left the collection."));
    const shop = element("a", "button button--fill", "Explore sarees");
    shop.href = "/design?route=collection&slug=sarees";
    message.append(shop);
    root.append(message);
    return root;
  }
  root.dataset.productId = productIdFrom(product);
  root.append(renderBreadcrumbs(product));

  const layout = element("div", "product-detail__layout");
  layout.append(renderGallery(product), renderPurchasePanel(product));
  root.append(layout);

  const relatedItems = relatedProducts.slice(0, 10);
  if (relatedItems.length && renderProductCard) {
    const related = element("section", "product-detail__related design-new-arrivals");
    related.dataset.newArrivalsCarousel = "true";
    related.setAttribute("aria-labelledby", "product-detail-related-title");

    const header = element("header", "product-detail__related-header");
    const title = element("h2", "product-detail__related-title", "Recommended for you");
    title.id = "product-detail-related-title";
    header.append(title);

    const stage = element("div", "design-new-arrivals__stage product-detail__related-stage");
    const viewport = element("div", "design-new-arrivals__viewport product-detail__related-viewport");
    viewport.dataset.newArrivalsViewport = "true";
    viewport.tabIndex = 0;
    viewport.setAttribute("aria-label", "Recommended products");

    const track = element("div", "design-new-arrivals__track product-detail__related-track");
    relatedItems.forEach((item) =>
      track.append(
        renderProductCard(item, ctx, {
          commerce: true,
          className: "design-new-arrivals__card",
        }),
      ),
    );
    viewport.append(track);

    const controls = element("div", "design-new-arrivals__controls");
    controls.setAttribute("aria-label", "Browse recommended products");
    controls.append(
      relatedRailArrow("previous"),
      relatedRailArrow("next"),
    );
    stage.append(viewport, controls);
    related.append(header, stage);
    root.append(related);
  }

  return root;
}

function relatedRailArrow(direction) {
  const isPrevious = direction === "previous";
  const arrow = element(
    "button",
    `design-new-arrivals__arrow design-new-arrivals__arrow--${direction}`,
  );
  arrow.type = "button";
  arrow.dataset.newArrivalsDir = isPrevious ? "-1" : "1";
  arrow.setAttribute(
    "aria-label",
    isPrevious ? "Previous recommended products" : "Next recommended products",
  );

  const iconNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconNode.setAttribute("viewBox", "0 0 24 24");
  iconNode.setAttribute("aria-hidden", "true");
  iconNode.setAttribute("focusable", "false");
  iconNode.setAttribute("fill", "none");
  iconNode.setAttribute("stroke", "currentColor");
  iconNode.setAttribute("stroke-width", "1.6");
  iconNode.setAttribute("stroke-linecap", "round");
  iconNode.setAttribute("stroke-linejoin", "round");
  iconNode.innerHTML = isPrevious
    ? '<path d="M15 6l-6 6 6 6"/>'
    : '<path d="M9 6l6 6-6 6"/>';
  arrow.append(iconNode);
  return arrow;
}
