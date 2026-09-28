/**
 * Curated PDP galleries — at least 4 unique editorial frames per primary product image.
 * Falls back to a shared pool when a product has fewer owned assets.
 */

const SHARED_POOL = [
  {
    src: "/assets/design-collection-everyday.jpg",
    alt: "Pale printed saree in a sunlit everyday setting",
    tone: "ochre",
    position: "center",
  },
  {
    src: "/assets/design-collection-festive.jpg",
    alt: "Festive saree drape, alternate studio angle",
    tone: "ochre",
    position: "center",
  },
  {
    src: "/assets/design-collection-work.jpg",
    alt: "Workwear saree with a graphic border",
    tone: "rust",
    position: "center",
  },
  {
    src: "/assets/design-collection-ready-to-wear.jpg",
    alt: "Ready-to-wear saree, full drape",
    tone: "paper",
    position: "center",
  },
  {
    src: "/assets/design-collection-wedding.jpg",
    alt: "Wedding saree in a warm cream interior",
    tone: "ochre",
    position: "center",
  },
  {
    src: "/assets/design-story-cream.jpg",
    alt: "Heritage saree portrait in soft light",
    tone: "indigo",
    position: "center",
  },
  {
    src: "/assets/design-ready-to-wear-detail.jpg",
    alt: "Ready-to-wear saree detail",
    tone: "paper",
    position: "center",
  },
  {
    src: "/assets/design-product-indigo.jpg",
    alt: "Indigo stripe saree with a flowing pallu",
    tone: "indigo",
    position: "center",
  },
  {
    src: "/assets/design-product-black.jpg",
    alt: "Black border saree, studio view",
    tone: "ink",
    position: "center",
  },
  {
    src: "/assets/design-product-marigold.jpg",
    alt: "Marigold printed saree, alternate angle",
    tone: "ochre",
    position: "center",
  },
  {
    src: "/assets/design-product-sage.jpg",
    alt: "Sage handblock saree, studio detail",
    tone: "moss",
    position: "center",
  },
];

const GALLERY_BY_PRIMARY = {
  "/assets/design-product-sage.jpg": [
    {
      src: "/assets/design-product-sage.jpg",
      alt: "Sage green floral saree styled in a clean studio",
      tone: "moss",
      position: "center",
    },
    {
      src: "/assets/design-collection-everyday.jpg",
      alt: "Sage floral saree in a sunlit everyday setting",
      tone: "ochre",
      position: "center",
    },
    {
      src: "/assets/design-story-cream.jpg",
      alt: "Handblock saree portrait in soft cream light",
      tone: "indigo",
      position: "center",
    },
    {
      src: "/assets/design-collection-work.jpg",
      alt: "Printed cotton saree, border and pallu detail",
      tone: "rust",
      position: "center",
    },
  ],
  "/assets/design-product-indigo.jpg": [
    {
      src: "/assets/design-product-indigo.jpg",
      alt: "Indigo and ochre geometric saree with a flowing pallu",
      tone: "indigo",
      position: "center",
    },
    {
      src: "/assets/design-collection-ready-to-wear.jpg",
      alt: "Indigo stripe ready-to-wear drape, alternate angle",
      tone: "paper",
      position: "center",
    },
    {
      src: "/assets/design-ready-to-wear-detail.jpg",
      alt: "Ready-to-wear indigo detail",
      tone: "paper",
      position: "center",
    },
    {
      src: "/assets/design-collection-festive.jpg",
      alt: "Structured drape styled for occasion wear",
      tone: "ochre",
      position: "center",
    },
  ],
  "/assets/design-product-marigold.jpg": [
    {
      src: "/assets/design-product-marigold.jpg",
      alt: "Marigold yellow saree with an easy everyday drape",
      tone: "ochre",
      position: "center",
    },
    {
      src: "/assets/design-collection-festive.jpg",
      alt: "Marigold print styled for a festive occasion",
      tone: "ochre",
      position: "center",
    },
    {
      src: "/assets/design-collection-wedding.jpg",
      alt: "Warm festive saree in an interior setting",
      tone: "ochre",
      position: "center",
    },
    {
      src: "/assets/design-story-cream.jpg",
      alt: "Festive saree portrait, soft light",
      tone: "indigo",
      position: "center",
    },
  ],
  "/assets/design-product-black.jpg": [
    {
      src: "/assets/design-product-black.jpg",
      alt: "Black border saree styled for work",
      tone: "ink",
      position: "center",
    },
    {
      src: "/assets/design-collection-work.jpg",
      alt: "Workroom saree, graphic border detail",
      tone: "rust",
      position: "center",
    },
    {
      src: "/assets/design-collection-everyday.jpg",
      alt: "Easy black-border drape for daytime",
      tone: "ochre",
      position: "center",
    },
    {
      src: "/assets/design-collection-ready-to-wear.jpg",
      alt: "Clean ready silhouette with a dark border",
      tone: "paper",
      position: "center",
    },
  ],
};

function pushUnique(list, seen, media) {
  if (!media?.src || seen.has(media.src)) return;
  seen.add(media.src);
  list.push(media);
}

/**
 * Build a PDP gallery of at least `minCount` unique images (capped at 6).
 */
export function resolveProductGallery(product = {}, { minCount = 4, maxCount = 6 } = {}) {
  const list = [];
  const seen = new Set();
  const primarySrc = product.media?.src;

  pushUnique(list, seen, product.media);
  if (Array.isArray(product.gallery)) {
    product.gallery.forEach((media) => pushUnique(list, seen, media));
  }
  pushUnique(list, seen, product.hoverMedia);

  const curated = primarySrc ? GALLERY_BY_PRIMARY[primarySrc] : null;
  if (curated) {
    curated.forEach((media) => pushUnique(list, seen, media));
  }

  SHARED_POOL.forEach((media) => {
    if (list.length >= minCount) return;
    pushUnique(list, seen, media);
  });

  return list.slice(0, maxCount);
}
