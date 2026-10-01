import { catalogProducts } from "./catalog.js";
import { policyPages } from "./policies.js";
import { customerCarePages } from "./customer-care.js";

const HOME = { label: "Home", href: "/design" };

export function collectionUrl(slug) {
  return `/design?route=collection&slug=${encodeURIComponent(slug)}`;
}

export function contentUrl(slug) {
  return `/design?route=page&slug=${encodeURIComponent(slug)}`;
}

export function commerceUrl(kind) {
  const route = kind === "bag" || kind === "cart" ? "bag" : "wishlist";
  return `/design?route=${route}`;
}

export function productUrl(productId) {
  return `/design?route=product&slug=${encodeURIComponent(productId)}`;
}

const LEGACY_PRODUCT_ALIASES = {
  marigold: "marigold-print",
  "courtyard": "courtyard-print",
  "courtyard-rtw": "courtyard-print",
  "indigo-stripe": "indigo-rtw",
  "sage-rtw": "sage-handblock",
  "marigold-rtw": "marigold-print",
  "black-border-rtw": "black-border",
  "workroom-rtw": "workroom-indigo",
  "rust-rtw": "rust-marigold",
};

/** Resolve canonical and legacy product routes to the shared prototype PDP. */
export function resolveProductSlug(route, slug) {
  let candidate = route === "product" ? slug : route;
  if (!candidate) return null;

  candidate = String(candidate)
    .replace(/^product-/, "")
    .replace(/^clearance-/, "");
  return LEGACY_PRODUCT_ALIASES[candidate] || candidate;
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
  weddings: collection("weddings", "Weddings"),
  "budget-buys": collection("budget-buys", "Budget Buys"),
  festive: collection("festive", "Festive"),
  "festive-picks": collection("festive-picks", "Festive Picks"),
  "festive-wear": collection("festive-wear", "Festive wear"),
  sale: collection("sale", "Sale"),
  clearance: collection("clearance", "Clearance"),
  "ready-to-wear": collection("ready-to-wear", "Ready To Wear Sarees"),
  everyday: collection("everyday", "Everyday"),
  "casual-everyday-wear": collection("casual-everyday-wear", "Casual/everyday wear"),
  "party-evening-wear": collection("party-evening-wear", "Party/evening wear"),
  "office-wear": collection("office-wear", "Office wear"),
  "arani-silk": collection("arani-silk", "Arani Silk"),
  "chettinad-cotton": collection("chettinad-cotton", "Chettinad Cotton"),
  "dharmavaram-silk": collection("dharmavaram-silk", "Dharmavaram Silk"),
  "gadwal-saree": collection("gadwal-saree", "Gadwal Saree"),
  "kanchipuram-silk": collection("kanchipuram-silk", "Kanchipuram Silk"),
  "mangalagiri-cotton": collection("mangalagiri-cotton", "Mangalagiri Cotton"),
  "mysore-silk": collection("mysore-silk", "Mysore Silk"),
  "narayanpet-saree": collection("narayanpet-saree", "Narayanpet Saree"),
  "pochampally-ikat": collection("pochampally-ikat", "Pochampally Ikat"),
  "embroidery-work": collection("embroidery-work", "Embroidery work"),
  "zari-work": collection("zari-work", "Zari work"),
  "jacquard-weaves": collection("jacquard-weaves", "Jacquard weaves"),
  "bandhani-work": collection("bandhani-work", "Bandhani work"),
  "ikat-work": collection("ikat-work", "Ikat work"),
  "net-sarees": collection("net-sarees", "Net sarees"),
  "statement-border": collection("statement-border", "Statement border"),
  floral: collection("floral", "Floral"),
  "minimal-edit": collection("minimal-edit", "Minimal edit"),
  "polka-dots": collection("polka-dots", "Polka dots"),
  abstract: collection("abstract", "Abstract"),
  erode: collection("erode", "Erode"),
  chiffon: collection("chiffon", "Chiffon"),
  silk: collection("silk", "Silk"),
  "tussar-silk": collection("tussar-silk", "Tussar Silk"),
  georgette: collection("georgette", "Georgette"),
  satin: collection("satin", "Satin"),
  organza: collection("organza", "Organza"),
  blue: collection("blue", "Blue"),
  black: collection("black", "Black"),
  green: collection("green", "Green"),
  pink: collection("pink", "Pink"),
  beige: collection("beige", "Beige"),
  red: collection("red", "Red"),
  yellow: collection("yellow", "Yellow"),
  multicolour: collection("multicolour", "Multicolour"),
};

/** Editorial / utility pages from the navbar (not product grids). */
export const contentPagesBySlug = {
  ...Object.fromEntries(Object.entries(policyPages).map(([slug, policy]) => [
    slug,
    contentPage(slug, policy.title, policy.intro, policy),
  ])),
  ...Object.fromEntries(Object.entries(customerCarePages).map(([slug, guide]) => [
    slug,
    contentPage(slug, guide.title, guide.intro, guide),
  ])),
  about: contentPage(
    "about",
    "About",
    "Samantha brings traditional and ready-to-wear sarees into everyday life with expressive prints, comfortable fabrics and confident drapes.",
    {
      eyebrow: "Our story",
      sections: [
        { title: "Why we build Samantha", paragraphs: ["Samantha celebrates Indian saree heritage while making room for modern, easy-to-wear styles. The collection spans statement occasion pieces, office-friendly fabrics and ready-to-wear drapes."] },
      ],
    },
  ),
  "style-guide": contentPage(
    "style-guide",
    "Style Guide",
    "A few starting points for choosing and caring for a saree that feels like you.",
    {
      eyebrow: "Wear it your way",
      source: "https://www.samanthafab.com/pages/faq",
      sections: [
        { title: "Choose by occasion", paragraphs: ["Cotton, linen and light georgette are easy options for work and everyday wear. Rich silks and embellished fabrics suit celebrations, while ready-to-wear drapes make getting dressed especially simple."] },
        { title: "Check the details", paragraphs: ["Look at the fabric, length, blouse information and care notes on the product page. Screen settings and lighting can change how a colour appears, so ask Samantha if a precise shade matters to you."] },
        { title: "Pair your blouse", paragraphs: ["A simple solid blouse can balance a busy print; a contrast blouse can make a quiet saree more expressive. Check sizing and customization carefully before ordering."] },
      ],
    },
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
    policyPages["contact-information"].title,
    policyPages["contact-information"].intro,
    policyPages["contact-information"],
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
  weddings: ["wedding", "wedding-collection"],
  "budget-buys": ["budget-buys", "clearance"],
  festive: ["festive", "festive-picks"],
  "festive-picks": ["festive", "festive-picks"],
  "festive-wear": ["festive", "festive-picks"],
  sale: ["sale", "clearance"],
  clearance: ["clearance"],
  "ready-to-wear": ["ready-to-wear"],
  everyday: ["everyday"],
  "casual-everyday-wear": ["everyday"],
  "party-evening-wear": ["festive", "festive-picks"],
  "office-wear": ["everyday"],
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
  faq: "faq",
  cod: "cod",
  "track-order": "track-order",
  "size-guide": "size-guide",
  care: "care-guide",
  "care-guide": "care-guide",
  story: "about",
  journal: "style-guide",
  stores: "contact-information",
  shipping: "shipping-policy",
  returns: "refund-policy",
  refund: "refund-policy",
  privacy: "privacy-policy",
  terms: "terms-of-service",
  "refund-policy": "refund-policy",
  "privacy-policy": "privacy-policy",
  "shipping-policy": "shipping-policy",
  "terms-of-service": "terms-of-service",
  "contact-information": "contact-information",
  about: "about",
  contact: "contact",
  "style-guide": "style-guide",
  "star-in-our-spotlight": "star-in-our-spotlight",
  "design-your-dream-sarees": "design-your-dream-sarees",
  "surmaye-sisterhood": "star-in-our-spotlight",
};

/** Wishlist / bag destinations (not editorial content pages). */
export const ROUTE_COMMERCE_ALIASES = {
  wishlist: "wishlist",
  bag: "bag",
  cart: "bag",
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

export function resolveCommerceKind(route) {
  if (route && ROUTE_COMMERCE_ALIASES[route]) return ROUTE_COMMERCE_ALIASES[route];
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
  "embroidery-work": collectionUrl("embroidery-work"),
  "zari-work": collectionUrl("zari-work"),
  "jacquard-weaves": collectionUrl("jacquard-weaves"),
  "bandhani-work": collectionUrl("bandhani-work"),
  "ikat-work": collectionUrl("ikat-work"),
  "net-sarees": collectionUrl("net-sarees"),
  "statement-border": collectionUrl("statement-border"),
  floral: collectionUrl("floral"),
  "minimal-edit": collectionUrl("minimal-edit"),
  "polka-dots": collectionUrl("polka-dots"),
  abstract: collectionUrl("abstract"),
  erode: collectionUrl("erode"),
  chiffon: collectionUrl("chiffon"),
  silk: collectionUrl("silk"),
  "tussar-silk": collectionUrl("tussar-silk"),
  georgette: collectionUrl("georgette"),
  satin: collectionUrl("satin"),
  organza: collectionUrl("organza"),
  blue: collectionUrl("blue"),
  black: collectionUrl("black"),
  green: collectionUrl("green"),
  pink: collectionUrl("pink"),
  beige: collectionUrl("beige"),
  red: collectionUrl("red"),
  yellow: collectionUrl("yellow"),
  multicolour: collectionUrl("multicolour"),
  "festive-wear": collectionUrl("festive-wear"),
  weddings: collectionUrl("weddings"),
  "casual-everyday-wear": collectionUrl("casual-everyday-wear"),
  "party-evening-wear": collectionUrl("party-evening-wear"),
  "office-wear": collectionUrl("office-wear"),
  "new-arrival": collectionUrl("new-arrival"),
  sale: collectionUrl("sale"),
  about: contentUrl("about"),
};
