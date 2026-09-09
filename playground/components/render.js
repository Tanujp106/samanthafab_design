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

function campaignArrow(direction) {
  const isPrev = direction === "prev";
  const buttonNode = element("button", `campaign-hero__arrow campaign-hero__arrow--${direction}`);
  buttonNode.type = "button";
  buttonNode.dataset.campaignDir = isPrev ? "-1" : "1";
  buttonNode.setAttribute("aria-label", isPrev ? "Previous campaign" : "Next campaign");

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.6");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = isPrev
    ? '<path d="M15 6l-6 6 6 6"/>'
    : '<path d="M9 6l6 6-6 6"/>';
  buttonNode.append(icon);
  return buttonNode;
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

const navIconPaths = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
};

const mobileIconPaths = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>',
  explore: '<circle cx="12" cy="12" r="9"/><path d="m16 16-3.5-3.5"/><path d="M12 8v4l2.5 2.5"/>',
  whatsapp:
    '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8.2 9.8c.6-1.2 1.8-1.9 3-1.9 1.8 0 3.1 1.2 3.1 3 0 1.8-1.3 3.1-3.1 3.1"/><path d="M14.4 14.2c.6-.4 1.5-.6 2.3-.4"/>',
  heart: '<path d="M12 20.5s-7-4.35-7-10a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 5.65-7 10-7 10z"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
};

function renderMobileIcon(name, className = "mobile-icon") {
  const pathMarkup = mobileIconPaths[name];
  if (!pathMarkup) return null;

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add(className);
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.6");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = pathMarkup;
  return icon;
}

function renderNavIcon(name) {
  const pathMarkup = navIconPaths[name];
  if (!pathMarkup) return null;

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("nav-action__icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.5");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = pathMarkup;
  return icon;
}

function renderNavigationItem(item, isReference, megaMenuId) {
  if (item.menu) {
    const trigger = element("button", ["nav-link", "nav-link--menu", item.active ? "is-active" : ""].filter(Boolean).join(" "), item.label);
    trigger.type = "button";
    trigger.setAttribute("data-nav-menu-trigger", item.menu);
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", megaMenuId);
    return trigger;
  }

  const link = element("a", isReference ? ["nav-link", item.active ? "is-active" : ""].filter(Boolean).join(" ") : "", item.label);
  link.href = item.href;
  return link;
}

function renderMegaMenu(menu) {
  const root = element("div", "design-mega-menu");
  root.id = menu.id || "design-shop-mega-menu";
  root.setAttribute("aria-hidden", "true");
  root.dataset.navMenu = menu.label || "shop";
  root.setAttribute("aria-label", `${menu.label || "Shop"} menu`);

  const groups = element("div", "design-mega-menu__groups");
  (menu.groups || []).forEach((group) => {
    const groupNode = element("div", "design-mega-menu__group");
    groupNode.append(element("h3", "design-mega-menu__heading", group.heading));
    const links = element("ul", "design-mega-menu__list");
    (group.links || []).forEach((item) => {
      const listItem = element("li", "design-mega-menu__item");
      const link = element("a", "design-mega-menu__link", item.label);
      link.href = item.href;
      listItem.append(link);
      links.append(listItem);
    });
    groupNode.append(links);
    groups.append(groupNode);
  });

  const featured = menu.featured;
  const featuredLink = element("a", "design-mega-menu__featured");
  if (featured?.href) featuredLink.href = featured.href;
  if (featured?.media) {
    const image = element("img", "design-mega-menu__image");
    image.src = featured.media.src;
    image.alt = featured.media.alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    featuredLink.append(image);
  }
  if (featured?.label) featuredLink.append(element("span", "design-mega-menu__featured-label", featured.label));

  root.append(groups, featuredLink);
  return root;
}

function renderHeader(section) {
  // Utility + sticky nav are siblings under .site so sticky is not
  // clipped by a short header containing block.
  const frag = document.createDocumentFragment();
  const isReference = section.variant === "reference";

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

  const nav = element("div", ["primary-nav", isReference ? "design-reference-nav" : ""].filter(Boolean).join(" "));
  const brand = element("a", "wordmark");
  brand.href = isReference ? "https://www.samanthafab.com/" : "/";
  brand.setAttribute("aria-label", "Samantha Fab home");
  brand.append(renderBrandImage());

  const menuToggle = element("button", "nav-menu-toggle");
  menuToggle.type = "button";
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-controls", isReference ? "mobile-drawer" : "primary-nav-links");
  if (isReference) {
    menuToggle.dataset.mobileDrawerTrigger = "true";
    menuToggle.append(renderMobileIcon("menu", "nav-menu-toggle__icon"), element("span", "sr-only", "Menu"));
  } else {
    menuToggle.textContent = "Menu";
  }

  const navLinks = element("nav", ["nav-links", isReference ? "design-reference-nav__links" : ""].filter(Boolean).join(" "));
  navLinks.id = "primary-nav-links";
  navLinks.setAttribute("aria-label", "Primary");
  section.nav.forEach((item) => navLinks.append(renderNavigationItem(item, isReference, section.megaMenu?.id || "design-shop-mega-menu")));

  const actionLinks = section.actions.map((item) => {
    const link = element("a", ["nav-action", item.className || ""].filter(Boolean).join(" "));
    link.href = item.href;
    link.setAttribute("aria-label", item.ariaLabel || item.label);
    if (isReference && item.icon) {
      link.classList.add("design-reference-nav__action");
      if (item.icon === "search" || item.icon === "bag") {
        link.classList.add("design-reference-nav__action--desktop-only");
      }
      const icon = renderNavIcon(item.icon);
      if (icon) link.append(icon);
      link.append(element("span", "sr-only", item.label));
    } else {
      link.append(document.createTextNode(item.label));
    }
    return link;
  });

  if (isReference) {
    const top = element("div", "design-reference-nav__top");
    const start = element("div", "design-reference-nav__start");
    const center = element("div", "design-reference-nav__center");
    const end = element("div", "design-reference-nav__end");
    start.append(menuToggle);
    center.append(brand);
    end.append(...actionLinks);
    top.append(start, center, end, navLinks);
    nav.append(top);
    if (section.megaMenu) navLinks.append(renderMegaMenu(section.megaMenu));
  } else {
    const actions = element("div", "nav-actions");
    actionLinks.forEach((link) => actions.append(link));
    nav.append(brand, menuToggle, navLinks, actions);
  }

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

const collectionIconPaths = {
  sunrise:
    '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
  "briefcase-business":
    '<path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  "party-popper":
    '<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
  gem:
    '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>',
  shirt:
    '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
};

const uspLucideIconPaths = {
  banknote:
    '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  "refresh-cw":
    '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  truck:
    '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
};

function renderLucideIcon(name, className, pathMap) {
  const pathMarkup = pathMap[name];
  if (!pathMarkup) return null;

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add(className);
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "2");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.innerHTML = pathMarkup;
  return icon;
}

function renderCollectionIcon(name) {
  return renderLucideIcon(name, "design-collection-bento__icon", collectionIconPaths);
}

function renderUspLucideIcon(name) {
  return renderLucideIcon(name, "design-usp-row__icon", uspLucideIconPaths);
}

function renderCollectionBento(section, ctx) {
  const root = element("section", "section section--collection-bento design-collection-bento");
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("aria-labelledby", "design-shop-by-collection-title");

  const header = element("header", "design-collection-bento__header");
  const heading = element("h2", "design-collection-bento__heading", section.title || "Shop by collection");
  heading.id = "design-shop-by-collection-title";
  header.append(heading);
  if (section.copy) {
    header.append(element("p", "design-collection-bento__lede", section.copy));
  }

  const grid = element("div", "design-collection-bento__grid");
  section.items.forEach((item) => {
    const tile = element("a", "design-collection-bento__tile");
    tile.href = item.href;

    const caption = element("span", "design-collection-bento__caption");
    const captionTitle = element("span", "design-collection-bento__caption-title");
    const collectionIcon = renderCollectionIcon(item.icon);
    if (collectionIcon) captionTitle.append(collectionIcon);
    captionTitle.append(element("span", "design-collection-bento__label", item.title));
    caption.append(captionTitle);
    if (item.copy) {
      caption.append(element("span", "design-collection-bento__subcopy", item.copy));
    }

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

    const action = element("span", "design-collection-bento__action");
    action.append(element("span", "design-collection-bento__action-label", "Explore"), arrow);
    caption.append(action);

    const meta = element("span", "design-collection-bento__meta");
    meta.append(caption);

    tile.append(
      renderMedia(item.media, {
        fill: true,
        notesEnabled: ctx.notesEnabled,
        className: "design-collection-bento__media",
      }),
      element("span", "design-collection-bento__scrim"),
      meta,
    );
    grid.append(tile);
  });

  root.append(header, grid);
  return root;
}

function renderMaterialShapeDefs() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("design-materials__defs");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  clipPath.id = "design-material-shape";
  clipPath.setAttribute("clipPathUnits", "objectBoundingBox");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M .5 0 C .515 .025 .55 .065 .6 .09 C .64 .105 .68 .1 .71 .14 C .74 .09 .81 .1 .84 .16 C .92 .14 .98 .21 .97 .29 C 1 .35 .97 .42 .93 .46 C .99 .5 1 .58 .95 .64 C .99 .72 .97 .82 .9 .87 C .87 .92 .82 .92 .77 .91 C .75 .94 .69 .96 .64 .94 C .6 .97 .55 .96 .5 1 C .45 .96 .4 .97 .36 .94 C .31 .96 .25 .94 .23 .91 C .18 .92 .13 .91 .1 .87 C .03 .82 .01 .72 .05 .64 C 0 .58 .01 .5 .07 .46 C .03 .42 0 .35 .03 .29 C .02 .21 .08 .14 .16 .16 C .19 .1 .26 .09 .29 .14 C .32 .1 .36 .105 .4 .09 C .45 .065 .485 .025 .5 0 Z",
  );
  clipPath.append(path);
  defs.append(clipPath);
  svg.append(defs);
  return svg;
}

function materialCarouselArrow(direction) {
  const isPrevious = direction === "previous";
  const arrow = element("button", `design-materials__arrow design-materials__arrow--${direction}`);
  arrow.type = "button";
  arrow.dataset.materialDir = isPrevious ? "-1" : "1";
  arrow.setAttribute("aria-label", isPrevious ? "Previous material" : "Next material");

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

function renderMaterialRail(section, ctx) {
  const root = element("section", "section section--material-rail design-materials");
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("data-material-carousel", "true");
  root.setAttribute("aria-labelledby", "design-shop-by-material-title");

  const inner = element("div", "design-materials__inner");
  const header = element("header", "design-materials__header");
  const heading = element("h2", "design-materials__heading", section.title || "Shop by material");
  heading.id = "design-shop-by-material-title";
  header.append(heading);
  if (section.copy) header.append(element("p", "design-materials__lede", section.copy));

  const viewport = element("div", "design-materials__viewport");
  viewport.setAttribute("data-material-viewport", "true");
  viewport.tabIndex = 0;
  viewport.setAttribute("role", "region");
  viewport.setAttribute("aria-roledescription", "carousel");
  viewport.setAttribute("aria-label", "Shop by material");

  const grid = element("div", "design-materials__grid");
  grid.setAttribute("data-material-track", "true");
  section.items.forEach((item, index) => {
    const tile = element("a", "design-materials__tile");
    tile.href = item.href;
    tile.dataset.materialIndex = String(index);
    tile.dataset.material = item.title.toLowerCase();
    tile.style.setProperty("--material-color", item.color || "var(--color-primary)");
    tile.setAttribute("aria-label", [item.title, item.copy].filter(Boolean).join(": "));
    tile.setAttribute("aria-roledescription", "slide");

    const copy = element("span", "design-materials__copy");
    copy.append(
      element("span", "design-materials__label", item.title),
      element("span", "design-materials__subcopy", item.copy),
    );

    const content = element("span", "design-materials__content");
    content.append(copy);

    tile.append(
      renderMedia(item.media, {
        fill: true,
        notesEnabled: ctx.notesEnabled,
        className: "design-materials__media",
      }),
      element("span", "design-materials__scrim"),
      content,
    );
    grid.append(tile);
  });

  const controls = element("div", "design-materials__controls");
  controls.setAttribute("aria-label", "Browse materials");
  controls.append(materialCarouselArrow("previous"), materialCarouselArrow("next"));

  viewport.append(grid, controls);
  inner.append(header, viewport);
  root.append(renderMaterialShapeDefs(), inner);
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

  stage.append(slides, campaignArrow("prev"), campaignArrow("next"), footer, announcer);
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

function productActionButton(kind, label) {
  const isWishlist = kind === "wishlist";
  const buttonNode = element(
    "button",
    isWishlist ? "product-card__wishlist" : "product-card__add-to-cart",
  );
  buttonNode.type = "button";
  buttonNode.setAttribute("aria-label", label);
  if (isWishlist) {
    buttonNode.setAttribute("aria-pressed", "false");
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.setAttribute("fill", "none");
    icon.setAttribute("stroke", "currentColor");
    icon.setAttribute("stroke-width", "1.6");
    icon.setAttribute("stroke-linecap", "round");
    icon.setAttribute("stroke-linejoin", "round");
    icon.innerHTML =
      '<path d="M12 20s-7-4.35-7-9.2A4.2 4.2 0 0 1 12 7.1a4.2 4.2 0 0 1 7 3.7C19 15.65 12 20 12 20z"/>';
    buttonNode.append(icon);
  } else {
    buttonNode.textContent = label;
  }
  return buttonNode;
}

function productColorSwatches(product) {
  if (!Array.isArray(product.swatches) || !product.swatches.length) return null;

  const swatches = element("div", "product-card__swatches");
  swatches.setAttribute("role", "list");
  swatches.setAttribute("aria-label", "Available colors");
  product.swatches.forEach((swatch, index) => {
    const chip = element("button", "product-card__swatch");
    chip.type = "button";
    chip.setAttribute("role", "listitem");
    chip.setAttribute("aria-label", swatch.label || `Color ${index + 1}`);
    if (index === 0) chip.setAttribute("aria-pressed", "true");
    else chip.setAttribute("aria-pressed", "false");
    chip.style.setProperty("--swatch-color", swatch.color || swatch);
    swatches.append(chip);
  });
  return swatches;
}

function renderProductCard(product, ctx, options = {}) {
  const card = element("article", ["product-card", options.className || ""].filter(Boolean).join(" "));
  const body = element("div", "product-card__body");
  if (product.tag) body.append(element("span", "product-tag", product.tag));
  body.append(element("h3", "product-name", product.name));
  const meta = element("div", "product-meta");
  if (product.material && !options.commerce) {
    meta.append(element("span", "product-material", product.material));
  }
  const priceWrap = element("div", "product-price-wrap");
  const priceLine = element("span", "product-price-line");
  priceLine.append(element("span", "product-price", product.price));
  if (product.compareAt) {
    priceLine.append(element("span", "product-compare", product.compareAt));
  }
  const discountLabel = product.discount || (options.commerce ? "24% off" : null);
  if (discountLabel) {
    priceLine.append(element("span", "product-discount", discountLabel));
  }
  priceWrap.append(priceLine);
  if (options.commerce) {
    const swatches = productColorSwatches(product);
    if (swatches) priceWrap.append(swatches);
  }
  meta.append(priceWrap);
  body.append(meta);

  if (options.commerce) {
    const mediaStage = element("div", "product-card__media");
    const mediaLink = element("a", "product-card__media-link");
    mediaLink.href = product.href;
    mediaLink.setAttribute("aria-label", product.name);
    mediaLink.append(renderMedia(product.media, { ratio: "portrait", notesEnabled: ctx.notesEnabled }));

    const mediaActions = element("div", "product-card__media-actions");
    mediaActions.append(productActionButton("cart", "Add to cart"));

    mediaStage.append(
      mediaLink,
      productActionButton("wishlist", `Save ${product.name}`),
      mediaActions,
    );

    const detailsLink = element("a", "product-card__link");
    detailsLink.href = product.href;
    detailsLink.append(body);
    card.append(mediaStage, detailsLink);
    return card;
  }

  const link = element("a", "product-card__link");
  link.href = product.href;
  link.append(renderMedia(product.media, { ratio: "portrait", notesEnabled: ctx.notesEnabled }), body);
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

function productCarouselArrow(direction, labelBase = "products") {
  const isPrevious = direction === "previous";
  const arrow = element("button", `design-new-arrivals__arrow design-new-arrivals__arrow--${direction}`);
  arrow.type = "button";
  arrow.dataset.newArrivalsDir = isPrevious ? "-1" : "1";
  arrow.setAttribute("aria-label", isPrevious ? `Previous ${labelBase}` : `Next ${labelBase}`);

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
  const title = section.title;
  const showHeader = Boolean(title || section.eyebrow || section.copy || section.viewAll);
  const titleId = `${section.id}-title`;
  const labelBase = (title || section.name || "products").toLowerCase();
  const root = element(
    "section",
    ["section", "section--new-arrivals", "design-new-arrivals", showHeader ? "" : "design-new-arrivals--rail-only"]
      .filter(Boolean)
      .join(" "),
  );
  root.id = section.id;
  root.dataset.section = section.number;
  root.dataset.newArrivalsCarousel = "true";
  if (showHeader && title) root.setAttribute("aria-labelledby", titleId);
  else root.setAttribute("aria-label", section.name || title || "Products");

  const inner = element("div", "design-new-arrivals__inner");

  if (showHeader) {
    const header = element("header", "design-new-arrivals__header");
    const intro = element("div", "design-new-arrivals__intro");
    if (section.eyebrow) intro.append(element("span", "design-new-arrivals__eyebrow", section.eyebrow));
    if (title) {
      const heading = element("h2", "design-new-arrivals__heading", title);
      heading.id = titleId;
      intro.append(heading);
    }
    if (section.copy) intro.append(element("p", "design-new-arrivals__copy", section.copy));

    const actions = element("div", "design-new-arrivals__actions");
    if (section.viewAll) {
      const viewAll = button(
        section.viewAll.label,
        section.viewAll.href,
        "button button--fill design-new-arrivals__view-all",
      );
      actions.append(viewAll);
    }
    header.append(intro, actions);
    inner.append(header);
  }

  const stage = element("div", "design-new-arrivals__stage");
  const viewport = element("div", "design-new-arrivals__viewport");
  viewport.dataset.newArrivalsViewport = "true";
  viewport.tabIndex = 0;
  viewport.setAttribute("aria-label", `${labelBase} products`);
  const track = element("div", "design-new-arrivals__track");
  section.products.forEach((product) => {
    track.append(
      renderProductCard(product, ctx, {
        className: "design-new-arrivals__card",
        commerce: true,
      }),
    );
  });
  viewport.append(track);

  const controls = element("div", "design-new-arrivals__controls");
  controls.setAttribute("aria-label", `Browse ${labelBase}`);
  controls.append(productCarouselArrow("previous", labelBase), productCarouselArrow("next", labelBase));
  stage.append(viewport, controls);
  inner.append(stage);
  if (section.action) {
    const railCta = element("div", "design-new-arrivals__rail-cta");
    railCta.append(button(section.action.label, section.action.href, "button button--fill"));
    inner.append(railCta);
  }
  root.append(inner);
  return root;
}

function renderShopUnder(section, ctx) {
  const root = element("section", "section section--shop-under design-shop-under");
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("aria-labelledby", "design-shop-under-title");

  const inner = element("div", "design-shop-under__inner");
  const heading = element("h2", "design-shop-under__heading", section.title || "Best on budget");
  heading.id = "design-shop-under-title";

  const grid = element("div", "design-shop-under__grid");
  (section.items || []).forEach((item) => {
    const tile = element("a", "design-shop-under__tile");
    tile.href = item.href;
    const labelText = item.title || "Shop under";
    const priceText = item.price || "";
    tile.setAttribute("aria-label", [labelText, priceText].filter(Boolean).join(" "));
    const label = element("span", "design-shop-under__label");
    label.append(element("span", "design-shop-under__label-text", labelText));
    if (priceText) {
      label.append(element("span", "design-shop-under__label-price", priceText));
    }
    tile.append(
      renderMedia(item.media, {
        fill: true,
        notesEnabled: ctx.notesEnabled,
        className: "design-shop-under__media",
      }),
      element("span", "design-shop-under__scrim"),
      label,
    );
    grid.append(tile);
  });

  inner.append(heading, grid);
  root.append(inner);
  return root;
}

function renderTestimonialCard(item, ctx) {
  const card = element("article", "design-testimonials__card");
  const mediaWrap = element("div", "design-testimonials__media");
  mediaWrap.append(
    renderMedia(item.media, {
      ratio: "square",
      notesEnabled: ctx.notesEnabled,
      className: "design-testimonials__card-media",
    }),
  );

  const quote = element("div", "design-testimonials__quote");
  quote.append(element("blockquote", "design-testimonials__body", item.quote || ""));

  const attribution = element("div", "design-testimonials__attribution");
  attribution.append(element("p", "design-testimonials__name", item.name || ""));
  const meta = element("p", "design-testimonials__meta", item.meta || "");
  if (!item.meta) meta.hidden = true;
  attribution.append(meta);
  quote.append(attribution);

  card.append(mediaWrap, quote);
  return card;
}

function renderTestimonials(section, ctx) {
  const root = element("section", "section section--testimonials design-testimonials");
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("data-testimonials", "true");
  root.setAttribute("data-testimonials-ticker", "true");
  root.setAttribute("aria-labelledby", "design-testimonials-title");

  const inner = element("div", "design-testimonials__inner");
  const header = element("header", "design-testimonials__header");
  const heading = element("h2", "design-testimonials__heading", section.title || "Loved by her");
  heading.id = "design-testimonials-title";
  header.append(heading);
  if (section.copy) {
    header.append(element("p", "design-testimonials__lede", section.copy));
  }
  inner.append(header);

  const items = section.items || [];
  const stage = element("div", "design-testimonials__stage");
  const viewport = element("div", "design-testimonials__viewport");
  viewport.setAttribute("data-testimonials-viewport", "true");
  viewport.setAttribute("aria-label", "Customer voices");

  const track = element("div", "design-testimonials__track");
  items.forEach((item) => {
    track.append(renderTestimonialCard(item, ctx));
  });
  items.forEach((item) => {
    const duplicate = renderTestimonialCard(item, ctx);
    duplicate.setAttribute("aria-hidden", "true");
    track.append(duplicate);
  });
  viewport.append(track);
  stage.append(viewport);

  root.append(inner, stage);
  return root;
}
function renderFeatureBanner(section, ctx) {
  const isOverlay = section.layout === "overlay";
  const root = element(
    "section",
    `section section--feature-banner design-feature-banner${isOverlay ? " design-feature-banner--overlay" : ""}`,
  );
  const titleId = `${section.id}-title`;
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("aria-labelledby", titleId);

  const inner = element("div", "design-feature-banner__inner");
  const copy = element("div", "design-feature-banner__copy");
  if (section.badge) {
    copy.append(element("p", "design-feature-banner__badge", section.badge));
  }
  if (section.eyebrow) {
    copy.append(element("p", "design-feature-banner__eyebrow", section.eyebrow));
  }
  const heading = element("h2", "design-feature-banner__title", section.title || "Ready to wear");
  heading.id = titleId;
  copy.append(heading);
  if (section.copy) {
    copy.append(element("p", "design-feature-banner__lede", section.copy));
  }
  if (section.action) {
    copy.append(
      button(section.action.label, section.action.href, "button button--fill design-feature-banner__cta"),
    );
  }

  if (isOverlay) {
    const mediaItem = Array.isArray(section.media) ? section.media[0] : section.media;
    if (mediaItem) {
      inner.append(
        renderMedia(mediaItem, {
          fill: true,
          notesEnabled: ctx.notesEnabled,
          className: "design-feature-banner__media",
        }),
      );
    }
    inner.append(element("span", "design-feature-banner__scrim"));
    inner.append(copy);
    root.append(inner);
    return root;
  }

  const collage = element("div", "design-feature-banner__collage");
  const collageMedia = Array.isArray(section.media) ? section.media : section.media ? [section.media] : [];
  collageMedia.forEach((item, index) => {
    const cell = element("div", `design-feature-banner__cell design-feature-banner__cell--${index + 1}`);
    cell.append(
      renderMedia(item, {
        fill: true,
        notesEnabled: ctx.notesEnabled,
        className: "design-feature-banner__media",
      }),
    );
    collage.append(cell);
  });

  inner.append(copy, collage);
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

function renderUspRow(section) {
  const root = element("section", "section design-usp-row");
  root.id = section.id;
  root.dataset.section = section.number;
  root.setAttribute("aria-label", section.name || "Why shop with us");

  const inner = element("div", "design-usp-row__inner");
  const list = element("ul", "design-usp-row__list");
  (section.items || []).forEach((item) => {
    const usp = element("li", "design-usp-row__item");
    const icon = renderUspLucideIcon(item.icon);
    if (icon) {
      const iconWrap = element("span", "design-usp-row__icon-wrap");
      iconWrap.setAttribute("aria-hidden", "true");
      iconWrap.append(icon);
      usp.append(iconWrap);
    }
    usp.append(element("span", "design-usp-row__label", item.label));
    list.append(usp);
  });
  inner.append(list);
  root.append(inner);
  return root;
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

function footerTrustIcon(name) {
  const icons = {
    cod: `<svg viewBox="0 0 20 20" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="15" height="10" rx="1.5"/><path d="M2.5 8.5h15"/><text x="10" y="14.2" text-anchor="middle" fill="currentColor" stroke="none" font-size="6.5" font-family="system-ui,sans-serif">₹</text></svg>`,
    returns: `<svg viewBox="0 0 20 20" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.5 7.5A6 6 0 1 0 16 12"/><path d="M15.5 4v3.5H12"/></svg>`,
    shipping: `<svg viewBox="0 0 20 20" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6.5h9.5v9H3z"/><path d="M12.5 9h3.2l1.8 2.4v4.1h-5V9z"/><circle cx="6.2" cy="15.5" r="1.2"/><circle cx="14.8" cy="15.5" r="1.2"/></svg>`,
    whatsapp: `<svg viewBox="0 0 20 20" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 14.5 3.5 17l2.7-1.1A6.8 6.8 0 1 0 4.5 14.5Z"/><path d="M7.2 8.8c.2-.4.5-.4.7-.4h.5c.2 0 .4.1.5.4l.4 1c.1.2 0 .4-.1.5l-.4.4c.2.4.6.8 1 1.1.3.2.6.3.9.4l.5-.4c.2-.1.4-.1.5 0l1 .5c.3.1.4.3.4.5v.5c0 .2 0 .5-.4.7-.4.3-1 .4-1.6.3-1.5-.3-3-1.3-4.1-2.5-1-1.1-1.8-2.5-2-4-.1-.6 0-1.2.3-1.6.2-.3.5-.4.7-.4Z"/></svg>`,
  };
  return icons[name] || "";
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

  if (section.newsletter) {
    const form = element("form", "footer-newsletter");
    form.setAttribute("data-footer-newsletter", "true");
    form.setAttribute("action", "#");
    form.setAttribute("method", "post");
    const label = element("label", "footer-newsletter__label", section.newsletter.label || "Newsletter");
    label.setAttribute("for", "footer-newsletter-email");
    const row = element("div", "footer-newsletter__row");
    const input = element("input", "footer-newsletter__input");
    input.type = "email";
    input.id = "footer-newsletter-email";
    input.name = "email";
    input.required = true;
    input.autocomplete = "email";
    input.placeholder = section.newsletter.placeholder || "Email address";
    const submit = element("button", "footer-newsletter__submit", section.newsletter.cta || "Subscribe");
    submit.type = "submit";
    row.append(input, submit);
    form.append(label, row);
    brand.append(form);
  }

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

  if (section.trust?.length) {
    const trust = element("ul", "footer-trust");
    trust.setAttribute("aria-label", "Shopping assurances");
    section.trust.forEach((item) => {
      const li = element("li", "footer-trust__item");
      const icon = element("span", "footer-trust__icon");
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = footerTrustIcon(item.icon);
      li.append(icon, element("span", "footer-trust__label", item.label));
      trust.append(li);
    });
    grid.append(trust);
  }

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
    case "usp-row":
      return renderUspRow(section);
    case "collection-bento":
      return renderCollectionBento(section, ctx);
    case "material-rail":
      return renderMaterialRail(section, ctx);
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
    case "feature-banner":
      return renderFeatureBanner(section, ctx);
    case "shop-under":
      return renderShopUnder(section, ctx);
    case "testimonials":
      return renderTestimonials(section, ctx);
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

function renderMobileDrawer(page, headerSection) {
  const overlay = element("button", "mobile-drawer__overlay");
  overlay.type = "button";
  overlay.setAttribute("aria-label", "Close menu");
  overlay.dataset.mobileDrawerOverlay = "true";

  const drawer = element("aside", "mobile-drawer");
  drawer.id = "mobile-drawer";
  drawer.dataset.mobileDrawer = "true";
  drawer.setAttribute("aria-hidden", "true");
  drawer.setAttribute("aria-label", "Shop categories");

  const head = element("div", "mobile-drawer__head");
  const close = element("button", "mobile-drawer__close");
  close.type = "button";
  close.setAttribute("aria-label", "Close menu");
  close.dataset.mobileDrawerClose = "true";
  close.append(renderMobileIcon("close", "mobile-drawer__close-icon"));
  head.append(element("span", "mobile-drawer__title", "Shop"), close);
  drawer.append(head);

  const promo = page.mobile?.drawerPromo;
  if (promo) {
    const promoNode = element("div", "mobile-drawer__promo");
    promoNode.append(element("p", "mobile-drawer__promo-copy", promo.copy));
    const promoAction = element("a", "mobile-drawer__promo-action", promo.action.label);
    promoAction.href = promo.action.href;
    promoAction.append(element("span", "mobile-drawer__promo-arrow", "→"));
    promoNode.append(promoAction);
    drawer.append(promoNode);
  }

  const list = element("ul", "mobile-drawer__list");
  const megaMenu = headerSection?.megaMenu;
  const links = (megaMenu?.groups || []).flatMap((group) => group.links || []);
  const featuredLabel = "Ready To Wear Sarees";
  links.forEach((item) => {
    const row = element("li", "mobile-drawer__item");
    const link = element("a", "mobile-drawer__link", item.label);
    link.href = item.href;
    link.append(renderMobileIcon("chevron", "mobile-drawer__chevron"));
    if (item.label === featuredLabel) link.classList.add("mobile-drawer__link--featured");
    row.append(link);
    list.append(row);
  });
  drawer.append(list);

  return { overlay, drawer };
}

function renderMobileExplore(page, ctx) {
  const bestSellers = page.sections.find((section) => section.id === "design-best-sellers");
  const products = bestSellers?.products || [];

  const panel = element("section", "mobile-panel mobile-panel--explore");
  panel.dataset.mobilePanel = "explore";
  panel.hidden = true;

  const searchWrap = element("div", "mobile-explore__search-wrap");
  const searchForm = element("form", "mobile-explore__search");
  searchForm.dataset.mobileSearchForm = "true";
  searchForm.setAttribute("role", "search");
  searchForm.append(renderMobileIcon("search", "mobile-explore__search-icon"));
  const searchInput = element("input", "mobile-explore__input");
  searchInput.type = "search";
  searchInput.name = "q";
  searchInput.placeholder = "Search sarees, fabrics, collections…";
  searchInput.setAttribute("aria-label", "Search products");
  searchInput.dataset.mobileSearchInput = "true";
  searchInput.autocomplete = "off";
  searchForm.append(searchInput);
  searchWrap.append(searchForm);

  const trending = element("div", "mobile-explore__trending");
  trending.append(element("h2", "mobile-explore__trending-title", "Trending searches"));
  const chips = element("div", "mobile-explore__chips");
  chips.dataset.mobileTrendingChips = "true";
  (page.mobile?.trending || []).forEach((item) => {
    const chip = element("button", "mobile-explore__chip");
    chip.type = "button";
    chip.textContent = item.label;
    chip.dataset.trendingQuery = item.query;
    chips.append(chip);
  });
  trending.append(chips);

  const results = element("div", "mobile-explore__results");
  results.dataset.mobileSearchResults = "true";
  results.append(element("h2", "mobile-explore__results-title", "Products"));
  const grid = element("div", "mobile-explore__grid");
  grid.dataset.mobileProductGrid = "true";
  products.forEach((product) => {
    grid.append(
      renderProductCard(product, ctx, {
        className: "design-new-arrivals__card mobile-explore__card",
        commerce: true,
      }),
    );
  });
  results.append(grid);

  panel.append(searchWrap, trending, results);
  return panel;
}

function renderMobileEmptyPanel(panelId, config, iconName) {
  const panel = element("section", `mobile-panel mobile-panel--${panelId}`);
  panel.dataset.mobilePanel = panelId;
  panel.hidden = true;

  const empty = element("div", "mobile-empty");
  empty.append(renderMobileIcon(iconName, "mobile-empty__icon"));
  empty.append(element("h2", "mobile-empty__title", config.title));
  empty.append(element("p", "mobile-empty__copy", config.copy));
  panel.append(empty);
  return panel;
}

function renderMobileBottomBar(page) {
  const nav = element("nav", "mobile-bottom-bar");
  nav.setAttribute("aria-label", "Mobile navigation");
  nav.dataset.mobileBottomBar = "true";

  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "explore", label: "Explore", icon: "explore" },
    { id: "whatsapp", label: "WhatsApp", icon: "whatsapp", href: page.mobile?.whatsappHref || "https://wa.me/" },
    { id: "wishlist", label: "Wishlist", icon: "heart" },
    { id: "bag", label: "Bag", icon: "bag" },
  ];

  tabs.forEach((tab, index) => {
    const isLink = Boolean(tab.href);
    const item = element(isLink ? "a" : "button", ["mobile-bottom-bar__item", index === 0 ? "is-active" : ""].filter(Boolean).join(" "));
    if (isLink) {
      item.href = tab.href;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
    } else {
      item.type = "button";
      item.dataset.mobileTab = tab.id;
    }
    item.setAttribute("aria-label", tab.label);
    const icon = renderMobileIcon(tab.icon, "mobile-bottom-bar__icon");
    if (icon && tab.id === "home") icon.classList.add("mobile-bottom-bar__icon--filled");
    item.append(icon, element("span", "mobile-bottom-bar__label", tab.label));
    nav.append(item);
  });

  return nav;
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
  main.dataset.mobilePanel = "home";
  root.append(main);

  if (page.key === "blank" && page.mobile) {
    const headerSection = page.sections.find((section) => section.type === "header");
    root.append(
      renderMobileExplore(page, ctx),
      renderMobileEmptyPanel("wishlist", page.mobile.wishlist, "heart"),
      renderMobileEmptyPanel("bag", page.mobile.bag, "bag"),
      renderMobileBottomBar(page),
    );
    const { overlay, drawer } = renderMobileDrawer(page, headerSection);
    root.append(overlay, drawer);
    root.classList.add("site--mobile-shell");
  }

  if (footerNode) root.append(footerNode);

  return root;
}
