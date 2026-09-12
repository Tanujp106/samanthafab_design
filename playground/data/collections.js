import { catalogProducts } from "./catalog.js";

const HOME = { label: "Home", href: "/design" };

export function collectionUrl(slug) {
  return `/design?route=collection&slug=${encodeURIComponent(slug)}`;
}

export function contentUrl(slug) {
  return `/design?route=page&slug=${encodeURIComponent(slug)}`;
}

function collection(slug, title, options = {}) {
  return {
    slug,
    title,
    kind: "shop",
    breadcrumbs: [HOME, { label: title }],
    ...options,
  };
}

function contentPage(slug, title, copy, options = {}) {
  return {
    slug,
    title,
    kind: "content",
    copy,
    breadcrumbs: [HOME, { label: title }],
    ...options,
  };
}

/** Every shoppable nav / mega-menu destination. */
export const collectionsBySlug = {
  bestsellers: collection("bestsellers", "Bestsellers"),
  sarees: collection("sarees", "Sarees"),
  "new-arrival": collection("new-arrival", "New Arrival"),
  "new-arrivals": collection("new-arrivals", "New arrivals"),
  wedding: collection("wedding", "Wedding"),
  "wedding-collection": collection("wedding-collection", "Wedding Collection"),
  "budget-buys": collection("budget-buys", "Budget Buys"),
  festive: collection("festive", "Festive"),
  "festive-picks": collection("festive-picks", "Festive Picks"),
  sale: collection("sale", "Sale"),
  clearance: collection("clearance", "Clearance"),
  "ready-to-wear": collection("ready-to-wear", "Ready To Wear Sarees"),
  everyday: collection("everyday", "Everyday"),
  "arani-silk": collection("arani-silk", "Arani Silk"),
  "chettinad-cotton": collection("chettinad-cotton", "Chettinad Cotton"),
  "dharmavaram-silk": collection("dharmavaram-silk", "Dharmavaram Silk"),
  "gadwal-saree": collection("gadwal-saree", "Gadwal Saree"),
  "kanchipuram-silk": collection("kanchipuram-silk", "Kanchipuram Silk"),
  "mangalagiri-cotton": collection("mangalagiri-cotton", "Mangalagiri Cotton"),
  "mysore-silk": collection("mysore-silk", "Mysore Silk"),
  "narayanpet-saree": collection("narayanpet-saree", "Narayanpet Saree"),
  "pochampally-ikat": collection("pochampally-ikat", "Pochampally Ikat"),
};

/** Editorial / utility pages from the navbar (not product grids). */
export const contentPagesBySlug = {
  about: contentPage(
    "about",
    "About",
    "Samantha Fab is a modern Indian saree house — expressive prints, easy drapes, and pieces made for real life.",
  ),
  "style-guide": contentPage(
    "style-guide",
    "Style Guide",
    "Fabric, drape, and blouse pairing notes to help you choose with confidence. Full guides will live here in the next pass.",
  ),
  "star-in-our-spotlight": contentPage(
    "star-in-our-spotlight",
    "Star In Our Spotlight",
    "Surmaye Sisterhood stories and customer features. This playground page stands in for the live spotlight editorial.",
  ),
  "design-your-dream-sarees": contentPage(
    "design-your-dream-sarees",
    "Design Your Dream Sarees",
    "Custom colourways and made-to-order drapes. Reach out through Contact to start a design conversation.",
    { cta: { label: "Contact us", href: contentUrl("contact") } },
  ),
  contact: contentPage(
    "contact",
    "Contact",
    "WhatsApp, email, and studio visiting notes will sit here. For now, this is a playground destination so every navbar link resolves.",
  ),
};

/** Slugs that should show the full catalog (category “all sarees”). */
const FULL_CATALOG_SLUGS = new Set(["sarees"]);

/** Map a collection slug to one or more membership tags on catalog products. */
const SLUG_MEMBERSHIP = {
  bestsellers: ["bestsellers"],
  "new-arrival": ["new-arrivals"],
  "new-arrivals": ["new-arrivals"],
  wedding: ["wedding", "wedding-collection"],
  "wedding-collection": ["wedding", "wedding-collection"],
  "budget-buys": ["budget-buys", "clearance"],
  festive: ["festive", "festive-picks"],
  "festive-picks": ["festive", "festive-picks"],
  sale: ["sale", "clearance"],
  clearance: ["clearance"],
  "ready-to-wear": ["ready-to-wear"],
  everyday: ["everyday"],
  "arani-silk": ["arani-silk"],
  "chettinad-cotton": ["chettinad-cotton"],
  "dharmavaram-silk": ["dharmavaram-silk"],
  "gadwal-saree": ["gadwal-saree"],
  "kanchipuram-silk": ["kanchipuram-silk"],
  "mangalagiri-cotton": ["mangalagiri-cotton"],
  "mysore-silk": ["mysore-silk"],
  "narayanpet-saree": ["narayanpet-saree"],
  "pochampally-ikat": ["pochampally-ikat"],
};

/** Legacy route aliases → collection slug */
export const ROUTE_COLLECTION_ALIASES = {
  bestsellers: "bestsellers",
  "ready-to-wear": "ready-to-wear",
  "new-arrivals": "new-arrivals",
  "new-arrival": "new-arrival",
  everyday: "everyday",
  festive: "festive",
  "festive-picks": "festive-picks",
  wedding: "wedding",
  "wedding-collection": "wedding-collection",
  clearance: "clearance",
  sale: "sale",
  sarees: "sarees",
  "budget-buys": "budget-buys",
  "arani-silk": "arani-silk",
  "chettinad-cotton": "chettinad-cotton",
  "dharmavaram-silk": "dharmavaram-silk",
  "gadwal-saree": "gadwal-saree",
  "kanchipuram-silk": "kanchipuram-silk",
  "mangalagiri-cotton": "mangalagiri-cotton",
  "mysore-silk": "mysore-silk",
  "narayanpet-saree": "narayanpet-saree",
  "pochampally-ikat": "pochampally-ikat",
  "occasion-everyday": "everyday",
  "occasion-work": "everyday",
  "occasion-festive": "festive",
  "occasion-wedding": "wedding-collection",
  "occasion-rtw": "ready-to-wear",
};

export const ROUTE_CONTENT_ALIASES = {
  about: "about",
  contact: "contact",
  "style-guide": "style-guide",
  "star-in-our-spotlight": "star-in-our-spotlight",
  "design-your-dream-sarees": "design-your-dream-sarees",
  "surmaye-sisterhood": "star-in-our-spotlight",
};

export function resolveCollectionSlug(route, slug) {
  if (route === "collection" && slug) return slug;
  if (route && ROUTE_COLLECTION_ALIASES[route]) return ROUTE_COLLECTION_ALIASES[route];
  return null;
}

export function resolveContentSlug(route, slug) {
  if (route === "page" && slug) return slug;
  if (route && ROUTE_CONTENT_ALIASES[route]) return ROUTE_CONTENT_ALIASES[route];
  return null;
}

export function getCollection(slug) {
  return collectionsBySlug[slug] || null;
}

export function getContentPage(slug) {
  return contentPagesBySlug[slug] || null;
}

export function getCollectionProducts(slug) {
  if (!slug) return [];
  if (FULL_CATALOG_SLUGS.has(slug)) return [...catalogProducts];

  const tags = SLUG_MEMBERSHIP[slug] || [slug];
  return catalogProducts.filter((product) => {
    const membership = product.collections || [];
    return tags.some((tag) => membership.includes(tag));
  });
}

/** Mega-menu link map used by blank.js (keeps hrefs in one place). */
export const MEGA_MENU_LINKS = {
  sarees: collectionUrl("sarees"),
  "new-arrival": collectionUrl("new-arrival"),
  "wedding-collection": collectionUrl("wedding-collection"),
  "budget-buys": collectionUrl("budget-buys"),
  "festive-picks": collectionUrl("festive-picks"),
  sale: collectionUrl("sale"),
  "ready-to-wear": collectionUrl("ready-to-wear"),
  "arani-silk": collectionUrl("arani-silk"),
  "chettinad-cotton": collectionUrl("chettinad-cotton"),
  "dharmavaram-silk": collectionUrl("dharmavaram-silk"),
  "gadwal-saree": collectionUrl("gadwal-saree"),
  "kanchipuram-silk": collectionUrl("kanchipuram-silk"),
  "mangalagiri-cotton": collectionUrl("mangalagiri-cotton"),
  "mysore-silk": collectionUrl("mysore-silk"),
  "narayanpet-saree": collectionUrl("narayanpet-saree"),
  "pochampally-ikat": collectionUrl("pochampally-ikat"),
  "style-guide": contentUrl("style-guide"),
  "star-in-our-spotlight": contentUrl("star-in-our-spotlight"),
  "design-your-dream-sarees": contentUrl("design-your-dream-sarees"),
  contact: contentUrl("contact"),
};
