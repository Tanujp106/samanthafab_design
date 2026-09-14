/** Alternate product-card image shown on desktop hover (archive pairings). */
const HOVER_BY_SRC = {
  "/assets/design-product-sage.jpg": {
    src: "/assets/design-collection-everyday.jpg",
    alt: "Sage floral saree in a sunlit everyday setting",
    tone: "ochre",
    position: "center",
  },
  "/assets/design-product-indigo.jpg": {
    src: "/assets/design-collection-ready-to-wear.jpg",
    alt: "Indigo stripe ready-to-wear drape, alternate angle",
    tone: "paper",
    position: "center",
  },
  "/assets/design-product-marigold.jpg": {
    src: "/assets/design-collection-festive.jpg",
    alt: "Marigold print styled for a festive occasion",
    tone: "ochre",
    position: "center",
  },
  "/assets/design-product-black.jpg": {
    src: "/assets/design-collection-work.jpg",
    alt: "Black border saree styled for work",
    tone: "rust",
    position: "center",
  },
  "/assets/design-collection-everyday.jpg": {
    src: "/assets/design-product-sage.jpg",
    alt: "Everyday printed saree, studio detail",
    tone: "moss",
    position: "center",
  },
  "/assets/design-collection-work.jpg": {
    src: "/assets/design-product-black.jpg",
    alt: "Workroom saree, graphic border detail",
    tone: "ink",
    position: "center",
  },
  "/assets/design-collection-festive.jpg": {
    src: "/assets/design-product-marigold.jpg",
    alt: "Festive marigold saree, studio view",
    tone: "ochre",
    position: "center",
  },
  "/assets/design-collection-ready-to-wear.jpg": {
    src: "/assets/design-ready-to-wear-detail.jpg",
    alt: "Ready-to-wear saree detail",
    tone: "paper",
    position: "center",
  },
  "/assets/design-ready-to-wear-detail.jpg": {
    src: "/assets/design-collection-ready-to-wear.jpg",
    alt: "Ready-to-wear saree, full drape",
    tone: "paper",
    position: "center",
  },
  "/assets/design-collection-wedding.jpg": {
    src: "/assets/design-story-cream.jpg",
    alt: "Wedding saree in a warm cream interior",
    tone: "ochre",
    position: "center",
  },
  "/assets/design-story-cream.jpg": {
    src: "/assets/design-collection-wedding.jpg",
    alt: "Heritage wedding saree portrait",
    tone: "indigo",
    position: "center",
  },
};

export function resolveHoverMedia(product = {}) {
  if (product.hoverMedia?.src) return product.hoverMedia;
  const primary = product.media?.src;
  if (!primary) return null;
  return HOVER_BY_SRC[primary] || null;
}
