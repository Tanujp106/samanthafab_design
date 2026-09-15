import { renderMedia } from "./media.js";
import { resolveHoverMedia } from "../data/hover-media.js";
import { isWishlisted, productIdFrom, snapshotProduct } from "../lib/commerce-store.mjs";

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

function uniqueMedia(product) {
  const candidates = [
    product.media,
    ...(Array.isArray(product.gallery) ? product.gallery : []),
    product.hoverMedia,
    resolveHoverMedia(product),
  ].filter((media) => media?.src);
  const seen = new Set();
  return candidates.filter((media) => {
    if (seen.has(media.src)) return false;
    seen.add(media.src);
    return true;
  }).slice(0, 3);
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

function renderProductSwatches(product) {
  const colors = product.swatches || product.colors || [];
  if (!colors.length) return null;

  const group = element("div", "product-detail__swatches");
  group.dataset.pdpSwatches = "true";
  group.setAttribute("role", "list");
  group.setAttribute("aria-label", "Available colours");
  colors.forEach((swatch, index) => {
    const button = element("button", "product-detail__swatch");
    button.type = "button";
    button.dataset.pdpSwatch = "true";
    button.setAttribute("role", "listitem");
    button.setAttribute("aria-label", swatch.label || `Colour ${index + 1}`);
    button.setAttribute("aria-pressed", String(index === 0));
    button.style.setProperty("--swatch-color", swatch.color || swatch);
    group.append(button);
  });
  return group;
}

function renderSizeOptions(product) {
  const sizes = product.sizes?.length ? product.sizes : ["Free size"];
  const group = element("div", "product-detail__sizes");
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Select size");
  sizes.forEach((size, index) => {
    const button = element("button", ["product-detail__size", index === 0 ? "is-selected" : ""].filter(Boolean).join(" "), size);
    button.type = "button";
    button.dataset.pdpSize = "true";
    button.setAttribute("aria-pressed", String(index === 0));
    group.append(button);
  });
  return group;
}

function renderAccordion(title, copy, open = false) {
  const details = element("details", "product-detail__accordion");
  details.open = open;
  const summary = element("summary", "product-detail__accordion-summary", title);
  summary.append(icon('<path d="m6 9 6 6 6-6"/>', "product-detail__chevron"));
  details.append(summary, element("p", "product-detail__accordion-copy", copy));
  return details;
}

function renderTrustRow() {
  const list = element("ul", "product-detail__trust");
  list.setAttribute("aria-label", "Shopping assurances");
  [
    "COD across India",
    "Easy returns & exchange",
    "WhatsApp assistance",
  ].forEach((label) => list.append(element("li", "product-detail__trust-item", label)));
  return list;
}

function renderGallery(product) {
  const gallery = element("div", "product-detail__gallery");
  gallery.setAttribute("aria-label", "Product images");
  uniqueMedia(product).forEach((media, index) => {
    gallery.append(
      renderMedia(media, {
        ratio: "portrait",
        eager: index === 0,
        notesEnabled: false,
        className: [
          "product-detail__media",
          index === 0 ? "product-detail__media--featured" : "",
        ].filter(Boolean).join(" "),
      }),
    );
  });
  return gallery;
}

function renderPurchasePanel(product) {
  const panel = element("aside", "product-detail__purchase");
  panel.dataset.productPayload = JSON.stringify(snapshotProduct(product));

  const heading = element("div", "product-detail__heading");
  heading.append(
    element("span", "product-detail__eyebrow", product.tag || "Saree"),
    element("h1", "product-detail__title", product.name),
  );

  const priceLine = element("div", "product-detail__price-line");
  priceLine.append(element("span", "product-detail__price", product.price));
  if (product.compareAt) priceLine.append(element("span", "product-detail__compare", product.compareAt));
  if (product.discount) priceLine.append(element("span", "product-detail__discount", product.discount));

  const copy = element(
    "p",
    "product-detail__copy",
    `${product.material || "Thoughtfully made fabric"} with a fluid fall and an easy rhythm for everyday dressing.`,
  );

  const colourField = element("div", "product-detail__field");
  const colourLabel = element("span", "product-detail__label", "Colour");
  colourField.append(colourLabel, renderProductSwatches(product));

  const sizeField = element("div", "product-detail__field");
  const sizeHead = element("div", "product-detail__field-head");
  sizeHead.append(element("span", "product-detail__label", "Select size"));
  const sizeGuide = element("a", "product-detail__size-guide", "Size guide");
  sizeGuide.href = "#product-details";
  sizeHead.append(sizeGuide);
  sizeField.append(sizeHead, renderSizeOptions(product));

  const shipping = element("div", "product-detail__shipping");
  shipping.append(
    element("p", "product-detail__shipping-title", "Ready to ship"),
    element("p", "product-detail__shipping-copy", "Dispatches in 2–3 working days. Free shipping on orders over ₹2,500."),
  );

  const actions = element("div", "product-detail__actions");
  const addButton = element("button", "button button--fill product-detail__add", "Add to bag");
  addButton.type = "button";
  addButton.dataset.commerceAction = "add-to-bag";
  addButton.setAttribute("aria-label", `Add ${product.name} to bag`);
  const wishlist = element("button", "product-detail__wishlist");
  wishlist.type = "button";
  wishlist.dataset.commerceAction = "wishlist-toggle";
  wishlist.dataset.productName = product.name;
  wishlist.setAttribute("aria-label", isWishlisted(productIdFrom(product)) ? `Saved ${product.name}` : `Save ${product.name}`);
  wishlist.setAttribute("aria-pressed", String(isWishlisted(productIdFrom(product))));
  wishlist.append(icon('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>'));
  actions.append(addButton, wishlist);

  const detailsAccordion = renderAccordion(
    "Details",
    "A considered prototype detail page for Samantha Fab’s modern Indian drapes.",
    true,
  );
  detailsAccordion.id = "product-details";

  panel.append(
    heading,
    priceLine,
    copy,
    colourField,
    sizeField,
    shipping,
    actions,
    detailsAccordion,
    renderAccordion("Delivery & returns", "Free shipping over ₹2,500 with easy returns and exchanges across India."),
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
  root.append(layout, renderTrustRow());

  if (relatedProducts.length && renderProductCard) {
    const related = element("section", "product-detail__related");
    related.setAttribute("aria-labelledby", "product-detail-related-title");
    const header = element("header", "product-detail__related-header");
    const title = element("h2", "product-detail__related-title", "You may also like");
    title.id = "product-detail-related-title";
    header.append(title, element("p", "product-detail__related-copy", "A few more drapes from the studio."));
    const rail = element("div", "product-detail__related-rail");
    relatedProducts.forEach((item) =>
      rail.append(renderProductCard(item, ctx, { commerce: true, className: "design-new-arrivals__card" })),
    );
    related.append(header, rail);
    root.append(related);
  }

  return root;
}
