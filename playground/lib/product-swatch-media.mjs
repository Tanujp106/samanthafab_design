export function swatchImageSrc(product, swatch) {
  const media = swatch && typeof swatch === "object" ? (swatch.image || swatch.media) : null;
  const swatchSrc = typeof media === "string" ? media : media?.src;
  return swatchSrc || product?.media?.src || "";
}
