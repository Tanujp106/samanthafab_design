import { renderMedia } from "./media.js";
import { resolveProductGallery } from "../data/product-gallery.js";
import { isWishlisted, productIdFrom, snapshotProduct } from "../lib/commerce-store.mjs";

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
    { label: "WhatsApp help", path: '<path d="M21 11.5a8.4 8.4 0 0 1-9.4 8.3L5 21l1.3-3.8A8.4 8.4 0 1 1 21 11.5Z"/>' },
  ].forEach((item) => {
    const li = element("li", "product-detail__trust-item");
    li.append(icon(item.path, "product-detail__trust-icon"), element("span", "product-detail__trust-label", item.label));
    list.append(li);
  });
  return list;
}

function renderGallery(product) {
  const gallery = element("div", "product-detail__gallery");
  gallery.setAttribute("aria-label", "Product images");
  resolveProductGallery(product, { minCount: 4, maxCount: 6 }).forEach((media, index) => {
    gallery.append(
      renderMedia(media, {
        ratio: "portrait",
        eager: index === 0,
        notesEnabled: false,
        className: "product-detail__media",
      }),
    );
  });
  return gallery;
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

  const tags = element("div", "product-detail__tags");
  if (product.tag) tags.append(element("span", "product-detail__tag", product.tag));

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

  if (product.material) {
    heading.append(element("p", "product-detail__material", product.material));
  }

  const description = element(
    "p",
    "product-detail__description",
    `${product.material || "Thoughtfully made fabric"} with a fluid fall and an easy rhythm for everyday dressing.`,
  );

  const sku = element("p", "product-detail__sku", `SKU: ${productSku(product)}`);

  const priceLine = element("div", "product-detail__price-line");
  priceLine.append(element("span", "product-detail__price", product.price));
  if (product.compareAt) priceLine.append(element("span", "product-detail__compare", product.compareAt));
  const discount = discountLabel(product);
  if (discount) priceLine.append(element("span", "product-detail__discount", discount));
  const taxNote = element("p", "product-detail__tax-note", "Inclusive of all taxes");

  const coupons = element("details", "product-detail__coupons");
  const couponsSummary = element("summary", "product-detail__coupons-summary");
  couponsSummary.append(
    element("span", "product-detail__coupons-label", "Coupons"),
    element("span", "product-detail__coupons-hint", "View offers"),
  );
  coupons.append(
    couponsSummary,
    element("p", "product-detail__coupons-copy", "SAVE10 — Extra 10% off on prepaid orders. Prototype coupon for the playground."),
  );

  const actions = element("div", "product-detail__actions");
  const addButton = element("button", "button button--fill product-detail__add");
  addButton.type = "button";
  addButton.dataset.commerceAction = "add-to-bag";
  addButton.setAttribute("aria-label", `Add ${product.name} to bag`);
  addButton.append(
    element("span", "product-detail__add-shimmer"),
    icon('<path d="M6 7h12l-1 12H7L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>', "product-detail__add-icon"),
    element("span", "product-detail__add-label", "Add to cart"),
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
  whatsapp.append(icon('<path d="M21 11.5a8.4 8.4 0 0 1-9.4 8.3L5 21l1.3-3.8A8.4 8.4 0 1 1 21 11.5Z"/><path d="M9.5 9.8c.2-.4.4-.4.6-.4h.4c.2 0 .3.1.4.4l.3.9c.1.2 0 .3-.1.4l-.3.3c.2.4.6.8 1 1.1.3.2.6.3.9.4l.4-.3c.2-.1.3-.1.4 0l.9.4c.2.1.3.3.3.4v.4c0 .2 0 .4-.3.6-.4.3-.9.4-1.4.3-1.3-.3-2.7-1.2-3.6-2.3-.9-1-1.6-2.3-1.8-3.6-.1-.5 0-1 .3-1.4.1-.2.3-.3.5-.3Z"/>'));

  const primaryActions = element("div", "product-detail__primary-actions");
  primaryActions.append(addButton, wishlist, whatsapp);

  const buyNow = element("button", "button product-detail__buy-now", "Buy it now");
  buyNow.type = "button";
  buyNow.dataset.commerceAction = "buy-now";
  buyNow.setAttribute("aria-label", `Buy ${product.name} now`);
  actions.append(primaryActions, buyNow);

  const descriptionAccordion = renderAccordion(
    "Product Description",
    `${product.material || "This piece"} is designed for an easy fall and considered everyday wear. Follow the garment care label for its best life.`,
    true,
  );
  descriptionAccordion.id = "product-details";

  panel.append(
    tags,
    heading,
    description,
    renderVariantOptions(product),
    sku,
    priceLine,
    taxNote,
    coupons,
    actions,
    descriptionAccordion,
    renderAccordion(
      "Shipping & Return policy",
      "Free shipping over ₹2,500. Easy returns and exchanges across India. Dispatches in 2–3 working days.",
    ),
    renderTrustRow(),
  );
  return panel;
}

export function renderProductPage({ product, relatedProducts = [], ctx = {}, renderProductCard }) {
  const root = element("div", "product-detail-page");
  root.dataset.productPage = "true";
  root.dataset.productId = productIdFrom(product);
  root.append(renderBreadcrumbs(product));

  const layout = element("div", "product-detail__layout");
  layout.append(renderGallery(product), renderPurchasePanel(product));
  root.append(layout);

  const relatedItems = relatedProducts.slice(0, 3);
  if (relatedItems.length && renderProductCard) {
    const related = element("section", "product-detail__related");
    related.setAttribute("aria-labelledby", "product-detail-related-title");
    const header = element("header", "product-detail__related-header");
    const title = element("h2", "product-detail__related-title", "Recommended for you");
    title.id = "product-detail-related-title";
    header.append(title);
    const rail = element("div", "product-detail__related-rail");
    relatedItems.forEach((item) =>
      rail.append(renderProductCard(item, ctx, { commerce: true, className: "design-new-arrivals__card" })),
    );
    related.append(header, rail);
    root.append(related);
  }

  return root;
}
