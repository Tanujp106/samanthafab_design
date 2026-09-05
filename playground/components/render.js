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

function renderBrandImage() {
  const image = element("img", "wordmark__image");
  image.src = "/assets/samantha-logo.png";
  image.alt = "Samantha Fab";
  image.loading = "eager";
  image.decoding = "async";
  return image;
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

  const utilityItems = Array.isArray(section.utility) ? section.utility : [];
  if (utilityItems.length) {
    const utility = element("div", "utility-strip");
    utility.setAttribute("role", "note");
    utilityItems.forEach((item) => utility.append(element("span", "utility-strip__item", item)));
    frag.append(utility);
  }

  const header = element("header", "site-header");
  header.id = section.id;
  header.dataset.section = section.number;

  const nav = element("div", "primary-nav");
  const brand = element("a", "wordmark");
  brand.href = "/";
  brand.setAttribute("aria-label", "Samantha Fab home");
  brand.append(renderBrandImage());

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
  frag.append(header);

  if (!section.hideReviewNotes) {
    const notes = element("div", "section__inner header-notes review-only");
    notes.append(sectionMeta(section), annotation(section));
    frag.append(notes);
  }
  return frag;
}

const uspIconPaths = {
  truck:
    '<path d="M3 6.5h10v9H3z"/><path d="M13 9h4l3 3v3.5h-7z"/><circle cx="6.5" cy="16.5" r="1.5"/><circle cx="17.5" cy="16.5" r="1.5"/>',
  refresh:
    '<path d="M20 11a8 8 0 0 0-14.7-4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.7 4L21 15"/><path d="M21 20v-5h-5"/>',
  chat: '<path d="M4 5.5h16v10H9l-5 3v-13z"/>',
};

function renderIcon(name) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("design-usp-strip__icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.5");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = uspIconPaths[name] || uspIconPaths.chat;
  return icon;
}

function renderUspStrip(section) {
  const root = element("section", "section section--usp-strip design-usp-strip");
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("role", "note");
  root.setAttribute("aria-label", "Samantha Fab customer promises");
  root.style.setProperty("--usp-count", String(section.items.length));
  root.style.setProperty("--usp-hold", "3s");

  const inner = element("div", "section__inner design-usp-strip__inner");
  const list = element("ul", "design-usp-strip__list");
  section.items.forEach((item, index) => {
    const usp = element("li", "design-usp-strip__item");
    usp.style.setProperty("--usp-index", String(index));
    usp.append(renderIcon(item.icon), element("span", "design-usp-strip__label", item.label));
    list.append(usp);
  });

  const viewport = element("div", "design-usp-strip__viewport");
  viewport.append(list);
  inner.append(viewport);
  root.append(inner);
  return root;
}

function renderCollectionBento(section, ctx) {
  const root = element("section", "section section--collection-bento design-collection-bento");
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("aria-labelledby", "design-shop-by-collection-title");

  const heading = element("h2", "design-collection-bento__heading", section.title || "Shop by collection");
  heading.id = "design-shop-by-collection-title";

  const grid = element("div", "design-collection-bento__grid");
  section.items.forEach((item) => {
    const tile = element("a", "design-collection-bento__tile");
    tile.href = item.href;

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.classList.add("design-collection-bento__arrow");
    arrow.setAttribute("viewBox", "0 0 24 24");
    arrow.setAttribute("aria-hidden", "true");
    arrow.setAttribute("focusable", "false");
    arrow.setAttribute("fill", "none");
    arrow.setAttribute("stroke", "currentColor");
    arrow.setAttribute("stroke-width", "1.5");
    arrow.setAttribute("stroke-linecap", "round");
    arrow.setAttribute("stroke-linejoin", "round");
    arrow.innerHTML = '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>';

    tile.append(
      renderMedia(item.media, {
        fill: true,
        notesEnabled: ctx.notesEnabled,
        className: "design-collection-bento__media",
      }),
      element("span", "design-collection-bento__scrim"),
      element("span", "design-collection-bento__label", item.title),
      arrow,
    );
    grid.append(tile);
  });

  root.append(heading, grid);
  return root;
}

function renderCampaignHero(section, ctx) {
  const stage = element("div", "campaign-hero__stage");
  stage.setAttribute("aria-roledescription", "carousel");
  stage.setAttribute("aria-label", "Samantha Fab campaigns");

  const slides = element("div", "campaign-hero__slides");
  section.slides.forEach((slide, index) => {
    const slideNode = element("article", ["campaign-slide", index === 0 ? "is-active" : ""].filter(Boolean).join(" "));
    slideNode.dataset.index = String(index);
    slideNode.inert = index !== 0;
    slideNode.setAttribute("role", "group");
    slideNode.setAttribute("aria-roledescription", "slide");
    slideNode.setAttribute("aria-label", `${index + 1} of ${section.slides.length}: ${slide.title}`);
    slideNode.setAttribute("aria-hidden", String(index !== 0));

    const media = renderMedia(slide.media, {
      fill: true,
      eager: index === 0,
      notesEnabled: ctx.notesEnabled,
      className: "campaign-slide__media",
    });
    const veil = element("div", "campaign-slide__veil");
    const copy = element("div", "campaign-slide__content");
    const title = element(index === 0 ? "h1" : "h2", "campaign-slide__title", slide.title);
    copy.append(
      element("span", "campaign-slide__eyebrow", slide.eyebrow),
      title,
      element("p", "campaign-slide__copy", slide.copy),
      button(slide.primaryAction.label, slide.primaryAction.href, "button button--fill campaign-slide__cta"),
    );

    slideNode.append(media, veil, copy);
    slides.append(slideNode);
  });

  const footer = element("div", "campaign-hero__footer");
  const pagination = element("div", "campaign-hero__pagination");
  pagination.setAttribute("role", "tablist");
  pagination.setAttribute("aria-label", "Choose a campaign");
  section.slides.forEach((slide, index) => {
    const dot = element("button", ["campaign-hero__dot", index === 0 ? "is-active" : ""].filter(Boolean).join(" "));
    dot.type = "button";
    dot.dataset.campaignIndex = String(index);
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show ${slide.title}`);
    dot.setAttribute("aria-selected", String(index === 0));
    pagination.append(dot);
  });

  footer.append(pagination);

  const announcer = element("p", "sr-only campaign-hero__announcer");
  announcer.setAttribute("aria-live", "polite");
  announcer.textContent = section.slides[0].title;

  stage.append(slides, footer, announcer);
  stage.dataset.interval = String(section.interval || 7000);

  const root = element("section", "section section--campaign-hero");
  root.id = section.id;
  root.dataset.section = section.number;
  root.append(stage);
  return root;
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

function productCarouselArrow(direction) {
  const isPrevious = direction === "previous";
  const arrow = element("button", `design-new-arrivals__arrow design-new-arrivals__arrow--${direction}`);
  arrow.type = "button";
  arrow.dataset.newArrivalsDir = isPrevious ? "-1" : "1";
  arrow.setAttribute("aria-label", isPrevious ? "Previous new arrivals" : "Next new arrivals");

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.6");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = isPrevious
    ? '<path d="M15 6l-6 6 6 6"/>'
    : '<path d="M9 6l6 6-6 6"/>';
  arrow.append(icon);
  return arrow;
}

function renderProductCarousel(section, ctx) {
  const root = element("section", "section section--new-arrivals design-new-arrivals");
  root.id = section.id;
  root.dataset.section = section.number;
  root.dataset.newArrivalsCarousel = "true";
  root.setAttribute("aria-labelledby", "design-new-arrivals-title");

  const inner = element("div", "design-new-arrivals__inner");
  const header = element("header", "design-new-arrivals__header");
  const intro = element("div", "design-new-arrivals__intro");
  if (section.eyebrow) intro.append(element("span", "design-new-arrivals__eyebrow", section.eyebrow));
  const heading = element("h2", "design-new-arrivals__heading", section.title || "New arrivals");
  heading.id = "design-new-arrivals-title";
  intro.append(heading);
  if (section.copy) intro.append(element("p", "design-new-arrivals__copy", section.copy));

  const actions = element("div", "design-new-arrivals__actions");
  if (section.viewAll) {
    const viewAll = textLink(section.viewAll.label, section.viewAll.href);
    viewAll.classList.add("design-new-arrivals__view-all");
    actions.append(viewAll);
  }
  const controls = element("div", "design-new-arrivals__controls");
  controls.setAttribute("aria-label", "Browse new arrivals");
  controls.append(productCarouselArrow("previous"), productCarouselArrow("next"));
  actions.append(controls);
  header.append(intro, actions);

  const viewport = element("div", "design-new-arrivals__viewport");
  viewport.dataset.newArrivalsViewport = "true";
  viewport.tabIndex = 0;
  viewport.setAttribute("aria-label", "New arrivals products");
  const track = element("div", "design-new-arrivals__track");
  section.products.forEach((product) => {
    track.append(renderProductCard(product, ctx, { className: "design-new-arrivals__card" }));
  });
  viewport.append(track);
  inner.append(header, viewport);
  root.append(inner);
  return root;
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
  const brandLink = element("a", "wordmark footer-wordmark");
  brandLink.href = "/";
  brandLink.setAttribute("aria-label", "Samantha Fab home");
  brandLink.append(renderBrandImage());
  brand.append(
    brandLink,
    element("p", "footer-brand-copy", section.brandLine),
  );

  const columns = element("nav", "footer-columns");
  columns.setAttribute("aria-label", "Footer navigation");
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
    case "usp-strip":
      return renderUspStrip(section);
    case "collection-bento":
      return renderCollectionBento(section, ctx);
    case "campaign-hero":
      return renderCampaignHero(section, ctx);
    case "hero":
      return renderHero(section, ctx);
    case "occasion":
      return renderOccasion(section, ctx);
    case "products":
      return renderProducts(section, ctx);
    case "product-carousel":
      return renderProductCarousel(section, ctx);
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

  if (page.key !== "blank") {
    const intro = element("header", "playground-intro review-only");
    intro.append(
      element("span", "playground-intro__eyebrow", page.eyebrow),
      element("p", "playground-intro__title", "Samantha Fab homepage"),
      element("p", "playground-intro__copy", page.description),
    );
    root.append(intro);
  }

  let headerNode = null;
  let uspNode = null;
  let footerNode = null;
  const main = element("main", "site-main");

  page.sections.forEach((section) => {
    const node = renderSection(section, ctx);
    if (section.type === "header") headerNode = node;
    else if (section.type === "usp-strip") uspNode = node;
    else if (section.type === "footer") footerNode = node;
    else main.append(node);
  });

  // USP strip sits above sticky nav (same role as the old utility strip).
  if (uspNode) root.append(uspNode);
  if (headerNode) root.append(headerNode);
  root.append(main);
  if (footerNode) root.append(footerNode);

  return root;
}
