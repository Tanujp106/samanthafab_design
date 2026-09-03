const TONE_CLASS = {
  rust: "media--tone-rust",
  indigo: "media--tone-indigo",
  moss: "media--tone-moss",
  ochre: "media--tone-ochre",
  paper: "media--tone-paper",
  ink: "media--tone-ink",
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Shared media renderer.
 * Supports image, muted video, flat tonal fallback, optional caption,
 * and replacement notes only in notes mode.
 */
export function renderMedia(media = {}, options = {}) {
  const {
    src = null,
    alt = "",
    tone = "paper",
    position = "center",
    type = "image",
    caption = null,
    note = null,
  } = media;

  const {
    className = "",
    ratio = null,
    fill = false,
    notesEnabled = false,
  } = options;

  const wrap = element("figure", [
    "media",
    TONE_CLASS[tone] || TONE_CLASS.paper,
    ratio ? `media--ratio-${ratio}` : "",
    fill ? "media--fill" : "",
    !src ? "media--fallback" : "",
    className,
  ].filter(Boolean).join(" "));

  if (src && type === "video") {
    const video = document.createElement("video");
    video.className = "media__frame";
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.controls = true;
    video.setAttribute("aria-label", alt || "Product video");
    if (position) video.style.objectPosition = position;
    wrap.append(video);
  } else if (src) {
    const img = document.createElement("img");
    img.className = "media__frame";
    img.src = src;
    img.alt = alt || "";
    img.loading = options.eager ? "eager" : "lazy";
    img.decoding = "async";
    if (position) img.style.objectPosition = position;
    wrap.append(img);
  } else {
    const fallback = element("div", "media__frame media__fallback-surface");
    fallback.setAttribute("aria-hidden", "true");
    if (position) fallback.style.objectPosition = position;
    wrap.append(fallback);
  }

  if (caption) {
    wrap.append(element("figcaption", "media-caption", caption));
  }

  if (notesEnabled && note) {
    wrap.append(element("div", "media-note review-only", note));
  }

  return wrap;
}
