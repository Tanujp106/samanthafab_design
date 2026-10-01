/**
 * Mobile PDP sticky purchase bar — appears after the inline Add to cart scrolls past,
 * and hides again when the site footer enters view.
 */

const MOBILE_MQ = "(max-width: 760px)";

export function bindProductStickyBar(root = document) {
  const sticky = root.querySelector("[data-pdp-sticky-bar]");
  const anchor = root.querySelector("[data-pdp-add-anchor]");
  const footer = document.querySelector(".site-footer");
  if (!sticky || !anchor || sticky.dataset.bound === "true") return;
  sticky.dataset.bound = "true";

  const mq = window.matchMedia(MOBILE_MQ);
  let addPassed = false;
  let footerInView = false;

  function lightboxOpen() {
    return document.body.classList.contains("product-lightbox-open");
  }

  function setVisible(visible) {
    const show = visible && mq.matches && !lightboxOpen();
    sticky.classList.toggle("is-visible", show);
    sticky.setAttribute("aria-hidden", String(!show));
    document.body.classList.toggle("pdp-sticky-bar-visible", show);
  }

  function sync() {
    setVisible(addPassed && !footerInView);
  }

  const addObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      addPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      sync();
    },
    { threshold: 0 },
  );

  const footerObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      footerInView = entry.isIntersecting;
      sync();
    },
    { threshold: 0 },
  );

  function start() {
    addObserver.disconnect();
    footerObserver.disconnect();

    if (!mq.matches) {
      addPassed = false;
      footerInView = false;
      setVisible(false);
      return;
    }

    addObserver.observe(anchor);
    if (footer) footerObserver.observe(footer);

    const addRect = anchor.getBoundingClientRect();
    addPassed = addRect.bottom < 0;
    footerInView = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    sync();
  }

  mq.addEventListener("change", start);
  start();

  const bodyObserver = new MutationObserver(() => sync());
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
}
