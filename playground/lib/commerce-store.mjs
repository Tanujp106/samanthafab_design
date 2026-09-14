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
  return {
    id,
    name: product.name,
    material: product.material || "",
    price: product.price,
    compareAt: product.compareAt || "",
    discount: product.discount || "",
    href: product.href || "/design",
    tag: product.tag || "",
    media: product.media || {},
    hoverMedia: product.hoverMedia || null,
    swatches: product.swatches || product.colors || [],
  };
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
  const existing = list.find((item) => item.id === snap.id);
  if (existing) {
    existing.quantity = Math.min(9, (existing.quantity || 1) + qty);
  } else {
    list.unshift({ ...snap, quantity: Math.min(9, qty) });
  }
  writeJson(BAG_KEY, list);
  return list;
}

export function setBagQuantity(id, quantity) {
  const qty = Math.max(0, Math.min(9, Number(quantity) || 0));
  let list = readBag();
  if (qty <= 0) {
    list = list.filter((item) => item.id !== id);
  } else {
    list = list.map((item) => (item.id === id ? { ...item, quantity: qty } : item));
  }
  writeJson(BAG_KEY, list);
  return list;
}

export function removeFromBag(id) {
  const list = readBag().filter((item) => item.id !== id);
  writeJson(BAG_KEY, list);
  return list;
}

export function moveBagItemToWishlist(id) {
  const bag = readBag();
  const item = bag.find((entry) => entry.id === id);
  if (!item) return { bag, wishlist: readWishlist() };
  const nextBag = bag.filter((entry) => entry.id !== id);
  writeJson(BAG_KEY, nextBag);
  const wishlist = readWishlist();
  if (!wishlist.some((entry) => entry.id === id)) {
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
