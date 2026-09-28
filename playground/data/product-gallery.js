/**
 * Curated PDP galleries — at least 4 frames that read as one product.
 * Prefer crop variants of the primary image over unrelated catalog photos.
 */

import { resolveHoverMedia } from "./hover-media.js";

const CROP_POSITIONS = ["center top", "center 28%", "70% 20%", "center 72%"];

function pushUnique(list, seen, media) {
  if (!media?.src) return;
  const key = `${media.src}::${media.position || "center"}`;
  if (seen.has(key)) return;
  seen.add(key);
  list.push({
    ...media,
    position: media.position || "center",
  });
}

function cropVariants(primary, count) {
  if (!primary?.src) return [];
  return CROP_POSITIONS.slice(0, count).map((position, index) => ({
    ...primary,
    alt: index === 0
      ? (primary.alt || "Product image")
      : `${primary.alt || "Product"} — view ${index + 1}`,
    position,
  }));
}

/**
 * Build a PDP gallery of at least `minCount` product-coherent images (capped at 6).
 */
export function resolveProductGallery(product = {}, { minCount = 4, maxCount = 6 } = {}) {
  const list = [];
  const seen = new Set();
  const primary = product.media;
  const hover = product.hoverMedia || resolveHoverMedia(product);

  if (Array.isArray(product.gallery) && product.gallery.length) {
    product.gallery.forEach((media) => pushUnique(list, seen, media));
  }

  pushUnique(list, seen, primary ? { ...primary, position: primary.position || "center top" } : null);
  pushUnique(list, seen, hover ? { ...hover, position: hover.position || "center top" } : null);

  // Fill remaining slots with crop variants of the primary so the grid stays on-product.
  cropVariants(primary, maxCount).forEach((media) => {
    if (list.length >= minCount) return;
    pushUnique(list, seen, media);
  });

  // Last resort: if still short (no primary), use hover crops.
  if (list.length < minCount && hover?.src) {
    cropVariants(hover, maxCount).forEach((media) => {
      if (list.length >= minCount) return;
      pushUnique(list, seen, media);
    });
  }

  return list.slice(0, maxCount);
}
