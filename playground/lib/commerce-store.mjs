import { getCatalogProduct } from "../data/catalog.js";

const WISHLIST_KEY = "sf-design-wishlist";
const BAG_KEY = "sf-design-bag";

function canUseStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

function readJson(key, fallback) {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode */
  }
}

export function productIdFrom(product = {}) {
  if (product.id) return String(product.id);
  const href = product.href || "";
  const match = href.match(/[?&]route=([^&]+)/);
  if (match?.[1]) return match[1];
  return String(product.name || "product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function snapshotProduct(product = {}) {
  const id = productIdFrom(product);
  const productSlug = id.replace(/^product-/, "").replace(/^clearance-/, "");
  return {
    id,
    name: product.name,
    material: product.material || "",
    price: product.price,
    compareAt: product.compareAt || "",
    discount: product.discount || "",
    href: `/design?route=product&slug=${encodeURIComponent(productSlug)}`,
    tag: product.tag || "",
    media: product.media || {},
    hoverMedia: product.hoverMedia || null,
    swatches: product.swatches || product.colors || [],
    availability: product.availability || "in_stock",
    stock: Number.isInteger(product.stock) ? product.stock : null,
    variant: product.variant || "regular",
  };
}

export function bagLineId(item = {}) {
  return `${productIdFrom(item)}::${item.variant || "regular"}`;
}

export function stockLimit(product = {}) {
  const canonical = getCatalogProduct(productIdFrom(product));
  const inventory = canonical || product;
  if (inventory.availability === "out_of_stock") return 0;
  if (Number.isInteger(inventory.stock)) return Math.max(0, inventory.stock);
  return 99;
}

export function canAddToBag(product = {}, items = readBag()) {
  const limit = stockLimit(product);
  const current = items
    .filter((item) => item.id === productIdFrom(product))
    .reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (limit === 0) return { allowed: false, reason: "sold_out", remaining: 0 };
  if (current >= limit) return { allowed: false, reason: "quantity_limit", remaining: 0 };
  return { allowed: true, reason: null, remaining: limit - current };
}

export function readWishlist() {
  const list = readJson(WISHLIST_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function isWishlisted(id) {
  return readWishlist().some((item) => item.id === id);
}

export function toggleWishlist(product) {
  const snap = snapshotProduct(product);
  const list = readWishlist();
  const index = list.findIndex((item) => item.id === snap.id);
  if (index >= 0) {
    list.splice(index, 1);
    writeJson(WISHLIST_KEY, list);
    return { wishlisted: false, items: list };
  }
  list.unshift(snap);
  writeJson(WISHLIST_KEY, list);
  return { wishlisted: true, items: list };
}

export function removeWishlist(id) {
  const list = readWishlist().filter((item) => item.id !== id);
  writeJson(WISHLIST_KEY, list);
  return list;
}

export function readBag() {
  const list = readJson(BAG_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function addToBag(product, quantity = 1) {
  const snap = snapshotProduct(product);
  const qty = Math.max(1, Number(quantity) || 1);
  const list = readBag();
  const limit = stockLimit(snap);
  const remaining = canAddToBag(snap, list).remaining;
  if (limit === 0 || remaining === 0) return list;
  const existing = list.find((item) => bagLineId(item) === bagLineId(snap));
  const adding = Math.min(remaining, qty);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + adding;
    Object.assign(existing, snap);
  } else {
    list.unshift({ ...snap, lineId: bagLineId(snap), quantity: adding });
  }
  writeJson(BAG_KEY, list);
  return list;
}

export function setBagQuantity(id, quantity) {
  const qty = Math.max(0, Number(quantity) || 0);
  let list = readBag();
  if (qty <= 0) {
    list = list.filter((item) => bagLineId(item) !== id && item.id !== id);
  } else {
    const target = list.find((item) => bagLineId(item) === id || item.id === id);
    if (!target) return list;
    const others = list.filter((item) => item !== target && item.id === target.id)
      .reduce((sum, item) => sum + (item.quantity || 1), 0);
    const nextQty = Math.min(Math.max(0, stockLimit(target) - others), qty);
    list = list.map((item) => item === target ? { ...item, quantity: nextQty } : item)
      .filter((item) => item.quantity > 0);
  }
  writeJson(BAG_KEY, list);
  return list;
}

export function removeFromBag(id) {
  const list = readBag().filter((item) => bagLineId(item) !== id && item.id !== id);
  writeJson(BAG_KEY, list);
  return list;
}

export function moveBagItemToWishlist(id) {
  const bag = readBag();
  const item = bag.find((entry) => bagLineId(entry) === id || entry.id === id);
  if (!item) return { bag, wishlist: readWishlist() };
  const nextBag = bag.filter((entry) => entry !== item);
  writeJson(BAG_KEY, nextBag);
  const wishlist = readWishlist();
  if (!wishlist.some((entry) => entry.id === item.id)) {
    wishlist.unshift(snapshotProduct(item));
    writeJson(WISHLIST_KEY, wishlist);
  }
  return { bag: nextBag, wishlist };
}

export function wishlistCount() {
  return readWishlist().length;
}

export function bagCount() {
  return readBag().reduce((sum, item) => sum + (item.quantity || 1), 0);
}
