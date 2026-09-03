import { renderMedia } from "./media.js";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function textLink(label, href = "/?route=explore") {
  const link = element("a", "text-link");
  link.href = href;
  link.append(document.createTextNode(label), element("span", "text-link__arrow", "→"));
  return link;
}

function button(label, href, className = "button button--fill") {
  const link = element("a", className, label);
  link.href = href;
  return link;
}

function sectionMeta(section) {
  const meta = element("div", "section-meta review-only");
  meta.append(
    element("span", "section-meta__number", section.number),
    element("span", "section-meta__name", section.name),
  );
  return meta;
}

function annotation(section) {
  const aside = element("aside", "annotation review-only");
  aside.append(
    element("span", "annotation__label", `Annotation ${section.number}`),
    element("p", "annotation__copy", section.annotation),
  );
  return aside;
}

function sectionShell(section, content, options = {}) {
  const tag = options.tag || "section";
  const root = element(tag, ["section", `section--${section.type}`, options.className || ""].filter(Boolean).join(" "));
  root.id = section.id;
  root.dataset.section = section.number;

  const inner = element("div", options.innerClass || "section__inner");
  inner.append(sectionMeta(section), content, annotation(section));
  root.append(inner);
  return root;
}

function sectionHeading(section, extra = null) {
  const heading = element("div", "section-heading");
  const row = element("div", "section-heading__row");
  const text = element("div", "section-heading__text");
  if (section.eyebrow) text.append(element("span", "eyebrow", section.eyebrow));
  text.append(element("h2", "section-title", section.title));
  if (section.copy) text.append(element("p", "section-copy", section.copy));
  row.append(text);
  if (extra) row.append(extra);
  heading.append(row);
  return heading;
}

function renderHeader(section) {
  // Utility + sticky nav are siblings under .site so sticky is not
  // clipped by a short header containing block.
  const frag = document.createDocumentFragment();

  const utility = element("div", "utility-strip");
  utility.setAttribute("role", "note");
  section.utility.forEach((item) => utility.append(element("span", "utility-strip__item", item)));

  const header = element("header", "site-header");
  header.id = section.id;
  header.dataset.section = section.number;

  const nav = element("div", "primary-nav");
  const brand = element("a", "wordmark", section.brand);
  brand.href = "/";
  brand.setAttribute("aria-label", "Samantha Fab home");

  const menuToggle = element("button", "nav-menu-toggle", "Menu");
  menuToggle.type = "button";
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-controls", "primary-nav-links");

  const navLinks = element("nav", "nav-links");
  navLinks.id = "primary-nav-links";
  navLinks.setAttribute("aria-label", "Primary");
  section.nav.forEach((item) => {
    const link = element("a", "", item.label);
    link.href = item.href;
    navLinks.append(link);
  });

  const actions = element("div", "nav-actions");
  section.actions.forEach((item) => {
    const link = element("a", ["nav-action", item.className || ""].filter(Boolean).join(" "), item.label);
    link.href = item.href;
    link.setAttribute("aria-label", item.ariaLabel || item.label);
    actions.append(link);
  });

  nav.append(brand, menuToggle, navLinks, actions);
  header.append(nav);

  const notes = element("div", "section__inner header-notes review-only");
  notes.append(sectionMeta(section), annotation(section));

  frag.append(utility, header, notes);
  return frag;
}

function renderHero(section, ctx) {
  const content = element("div", "hero-grid");

  const mediaWrap = element("div", "hero-media");
  mediaWrap.append(
    renderMedia(section.media, {
      fill: true,
      eager: true,
      notesEnabled: ctx.notesEnabled,
    }),
  );

  const copy = element("div", "hero-copy");
  copy.append(
    element("span", "eyebrow", section.eyebrow),
    element("h1", "hero-title", section.title),
    element("p", "hero-body", section.copy),
  );
  const actions = element("div", "action-row");
  actions.append(
    button(section.primaryAction.label, section.primaryAction.href),
    textLink(section.secondaryAction.label, section.secondaryAction.href),
  );
  copy.append(actions);
  content.append(mediaWrap, copy);
  return sectionShell(section, content, { className: "section--hero" });
}

function renderOccasion(section, ctx) {
  const content = element("div", "section-content");
  content.append(sectionHeading(section));
  const rail = element("div", "occasion-rail");
  section.items.forEach((item) => {
    const tile = element("a", "occasion-tile");
    tile.href = item.href;
    tile.append(
      renderMedia(item.media, { notesEnabled: ctx.notesEnabled }),
      element("h3", "occasion-tile__title", item.title),
      element("span", "occasion-tile__link", "Shop now"),
    );
    rail.append(tile);
  });
  content.append(rail);
  return sectionShell(section, content, { className: "section--occasion" });
}

function renderProductCard(product, ctx, options = {}) {
  const card = element("article", ["product-card", options.className || ""].filter(Boolean).join(" "));
  const link = element("a", "product-card__link");
  link.href = product.href;
  link.append(renderMedia(product.media, { ratio: "portrait", notesEnabled: ctx.notesEnabled }));
  const body = element("div", "product-card__body");
  if (product.tag) body.append(element("span", "product-tag", product.tag));
  body.append(element("h3", "product-name", product.name));
  const meta = element("div", "product-meta");
  meta.append(element("span", "product-material", product.material));
  const priceWrap = element("span", "product-price-wrap");
  if (product.compareAt) {
    priceWrap.append(element("span", "product-compare", product.compareAt));
  }
  priceWrap.append(element("span", "product-price", product.price));
  meta.append(priceWrap);
  body.append(meta);
  link.append(body);
  card.append(link);
  return card;
}

function renderProducts(section, ctx) {
  const content = element("div", "section-content");
  const viewAll = section.viewAll
    ? textLink(section.viewAll.label, section.viewAll.href)
    : null;
  content.append(sectionHeading(section, viewAll));
  const rail = element("div", "product-rail");
  section.products.forEach((product) => rail.append(renderProductCard(product, ctx)));
  content.append(rail);
  return sectionShell(section, content, { className: "section--products" });
}

function renderSplit(section, ctx) {
  const content = element("div", "split-grid");
  const mediaWrap = element("div", "split-media");
  mediaWrap.append(renderMedia(section.media, { fill: true, notesEnabled: ctx.notesEnabled }));

  const copy = element("div", "split-copy");
  copy.append(sectionHeading(section));
  const points = element("ul", "point-list");
  section.points.forEach((point, index) => {
    const item = element("li", "point-item");
    item.append(
      element("span", "point-item__index", String(index + 1).padStart(2, "0")),
      element("span", "point-item__label", point),
    );
    points.append(item);
  });
  copy.append(points, button(section.action.label, section.action.href));
  content.append(mediaWrap, copy);
  return sectionShell(section, content, { className: "section--split" });
}

function renderPrice(section) {
  const content = element("div", "section-content");
  content.append(sectionHeading(section));
  const grid = element("div", "price-grid");
  section.items.forEach((item) => {
    const panel = element("a", `price-panel price-panel--${item.tone}`);
    panel.href = item.href;
    panel.append(
      element("span", "price-panel__label", item.label),
      element("span", "price-panel__value", item.value),
      element("span", "price-panel__cta", "Explore"),
    );
    grid.append(panel);
  });
  content.append(grid);
  return sectionShell(section, content, { className: "section--price" });
}

function renderStory(section, ctx) {
  const content = element("div", "story-grid");
  const copy = element("div", "story-copy");
  copy.append(sectionHeading(section), textLink(section.action.label, section.action.href));

  const mediaWrap = element("div", "story-media");
  mediaWrap.append(renderMedia(section.media, { fill: true, notesEnabled: ctx.notesEnabled }));
  if (section.caption) {
    const caption = element(
      "p",
      section.captionPlaceholder ? "media-caption review-only" : "media-caption",
      section.caption,
    );
    mediaWrap.append(caption);
  }

  content.append(copy, mediaWrap);
  return sectionShell(section, content, { className: "section--story" });
}

function renderBenefits(section) {
  const content = element("div", "section-content");
  content.append(sectionHeading(section));
  const grid = element("div", "benefit-grid");
  section.features.forEach((feature, index) => {
    const item = element("article", "benefit-item");
    item.append(
      element("span", "benefit-index", String(index + 1).padStart(2, "0")),
      element("h3", "benefit-title", feature.title),
      element("p", "benefit-copy", feature.copy),
    );
    grid.append(item);
  });
  content.append(grid);
  return sectionShell(section, content, { className: "section--benefits" });
}

function renderProof(section, ctx) {
  const content = element("div", "section-content");
  content.append(sectionHeading(section));
  const grid = element("div", "proof-grid");
  section.items.forEach((item) => {
    const card = element("article", item.feature ? "proof-card proof-card--feature" : "proof-card");
    card.append(renderMedia(item.media, { notesEnabled: ctx.notesEnabled }));
    const quote = element("blockquote", "proof-quote", `“${item.quote}”`);
    card.append(quote);
    // Placeholder attributions stay in notes mode only — never claim fake customers.
    if (item.caption && !item.captionPlaceholder) {
      card.append(element("p", "proof-caption", item.caption));
    } else if (item.caption && item.captionPlaceholder) {
      card.append(element("p", "proof-caption review-only", item.caption));
    }
    card.append(textLink("View product", item.href));
    grid.append(card);
  });
  content.append(grid);
  return sectionShell(section, content, { className: "section--proof" });
}

function renderService(section, ctx) {
  const content = element("div", "service-grid");
  const copy = element("div", "service-copy");
  if (section.eyebrow) copy.append(element("span", "eyebrow", section.eyebrow));
  copy.append(element("h2", "section-title", section.title));
  if (section.copy) copy.append(element("p", "section-copy", section.copy));
  const actions = element("div", "action-row");
  actions.append(
    button(section.primaryAction.label, section.primaryAction.href, "button button--on-dark"),
    textLink(section.secondaryAction.label, section.secondaryAction.href),
  );
  copy.append(actions);

  const mediaWrap = element("div", "service-media");
  mediaWrap.append(renderMedia(section.media, { fill: true, notesEnabled: ctx.notesEnabled }));
  content.append(copy, mediaWrap);
  return sectionShell(section, content, { className: "section--service" });
}

function renderLibrary(section) {
  // Quiet utility strip — guides stay available without competing for attention.
  const content = element("div", "library-quiet");
  const lead = element("div", "library-quiet__lead");
  if (section.eyebrow) lead.append(element("span", "eyebrow", section.eyebrow));
  lead.append(element("h2", "library-quiet__title", section.title));
  const links = element("nav", "library-quiet__links");
  links.setAttribute("aria-label", section.name || "Guides");
  section.items.forEach((item) => {
    const link = element("a", "library-quiet__link", item.title);
    link.href = item.href;
    links.append(link);
  });
  content.append(lead, links);
  return sectionShell(section, content, { className: "section--library section--library-quiet" });
}

function renderSale(section, ctx) {
  const content = element("div", "sale-block");
  const header = element("div", "sale-inner");
  const copy = element("div", "sale-copy");
  copy.append(
    element("span", "eyebrow", section.eyebrow),
    element("h2", "section-title", section.title),
  );
  const actions = element("div", "action-row");
  section.actions.forEach((action) => actions.append(textLink(action.label, action.href)));
  header.append(copy, actions);
  content.append(header);

  if (section.products?.length) {
    const rail = element("div", "product-rail product-rail--sale");
    section.products.forEach((product) => {
      rail.append(renderProductCard(product, ctx, { className: "product-card--on-sale" }));
    });
    content.append(rail);
  }

  return sectionShell(section, content, { className: "section--sale" });
}

function renderFooter(section) {
  const footer = element("footer", "site-footer section section--footer section--flush");
  footer.id = section.id;
  footer.dataset.section = section.number;

  const inner = element("div", "section__inner");
  inner.append(sectionMeta(section));

  const grid = element("div", "footer-grid");
  const brand = element("div", "footer-brand");
  brand.append(
    element("div", "wordmark", section.brand),
    element("p", "footer-brand-copy", section.brandLine),
  );

  const columns = element("div", "footer-columns");
  section.columns.forEach((column) => {
    const col = element("div", "footer-column");
    col.append(element("h3", "footer-heading", column.heading));
    const list = element("ul", "footer-links");
    column.links.forEach((link) => {
      const li = element("li");
      const a = element("a", "", link.label);
      a.href = link.href;
      li.append(a);
      list.append(li);
    });
    col.append(list);
    columns.append(col);
  });

  grid.append(brand, columns);
  inner.append(grid, element("p", "footer-bottom", section.copyright), annotation(section));
  footer.append(inner);
  return footer;
}

function renderSection(section, ctx) {
  switch (section.type) {
    case "header":
      return renderHeader(section);
    case "hero":
      return renderHero(section, ctx);
    case "occasion":
      return renderOccasion(section, ctx);
    case "products":
      return renderProducts(section, ctx);
    case "split":
      return renderSplit(section, ctx);
    case "price":
      return renderPrice(section);
    case "story":
      return renderStory(section, ctx);
    case "benefits":
      return renderBenefits(section);
    case "proof":
      return renderProof(section, ctx);
    case "service":
      return renderService(section, ctx);
    case "library":
      return renderLibrary(section);
    case "sale":
      return renderSale(section, ctx);
    case "footer":
      return renderFooter(section);
    default:
      throw new Error(`Unknown section type: ${section.type}`);
  }
}

export function renderPage(page, options = {}) {
  const notesEnabled = Boolean(options.notesEnabled);
  const ctx = { notesEnabled };

  const root = element("div", "site");

  if (notesEnabled) {
    const banner = element("div", "review-banner review-only");
    banner.innerHTML =
      "<strong>Review mode</strong> — section numbers, rationale notes, and media replacement cues are visible. Remove <code>?notes=1</code> for the client view.";
    root.append(banner);
  }

  const intro = element("header", "playground-intro review-only");
  intro.append(
    element("span", "playground-intro__eyebrow", page.eyebrow),
    element("p", "playground-intro__title", "Samantha Fab homepage"),
    element("p", "playground-intro__copy", page.description),
  );
  root.append(intro);

  let headerNode = null;
  let footerNode = null;
  const main = element("main", "site-main");

  page.sections.forEach((section) => {
    const node = renderSection(section, ctx);
    if (section.type === "header") headerNode = node;
    else if (section.type === "footer") footerNode = node;
    else main.append(node);
  });

  if (headerNode) root.append(headerNode);
  root.append(main);
  if (footerNode) root.append(footerNode);

  return root;
}
