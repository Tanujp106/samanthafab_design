# Samantha Fab `/design` — micro UI nits

Numbers distilled from page feedback. Update when lasting corrections land.

## Mobile shell (≤900px)

| Item | Value |
| --- | --- |
| Top bar height | 64px min-height; 10px vertical padding; 16px side gutters |
| Bottom bar height | ~72px + safe-area; 5 equal tabs; icon 22px; label 10px Karrik |
| Drawer width | min(88vw, 360px); slides from left; overlay rgba(18,10,12,0.42) |
| Explore search | 48px pill; 999px radius; whisper cream fill |
| Explore grid | 2 columns; 16×12px gap; same commerce cards as Best sellers (no hover wishlist/cart on grid) |
| Empty state | 40px icon; Sprat uppercase title ~22px; copy max ~28ch |

## Surface

| Item | Value |
| --- | --- |
| Page / light section fill | `--color-white` / `--color-paper` = `#fcfaf7` (very light cream, not `#fff`, not heavy beige) |
| Text on dark (footer/CTAs) | `--color-cream` = `#fffdf9` |

## Spacing

| Item | Value |
| --- | --- |
| Page / section side gutters | 24px |
| Reference nav top row | 88px min-height with 12px vertical padding (mobile 64px / 10px) |
| Eyebrow → title | ~6px |
| Title → body / lede | ~6px |
| Collection header → bento grid | ~48px |
| Product card body stack gap | ~6px |
| Product meta stack gap | ~4px |
| Split editorial column gap | 32–64px |
| Collection section vertical padding | ~80px (desktop) |
| New Arrivals header bottom | ~40px |
| New Arrivals section padding | `64px 24px 72px` (mobile `48px 16px 64px`) |
| USP row padding | `48px 24px` (mobile `40px 16px`) |
| USP row surface | `var(--color-primary-50)` soft plum wash |
| USP row layout | 4-col desktop; 2-col mobile; Lucide 28px icons above 13px label; gap icon→label 12px |
| USP row icons | Lucide banknote / refresh-cw / truck / message-circle; stroke 2; primary-800 |
| RTW rail-only top padding | ~40px |
| Rail footer CTA top margin | 16px |

## Type

| Item | Value |
| --- | --- |
| Campaign headline (desktop) | ~44–80px |
| Campaign headline (mobile) | ~38–56px |
| Supporting / lede | 15–17px |
| Section titles | Sprat Campaign, primary-800, weight 400, ~28–42px, **uppercase** |
| Product names | Sprat Campaign, primary-800, ~16–18px |
| Eyebrow / tags | Karrik, ~10px, wide tracking, uppercase, muted |
| View all / Add to cart label | Karrik **13px**, uppercase, letter-spacing ~0.12em; product-rail CTA “Shop All” |
| Price | ~14px ink; compare-at ~13px muted strikethrough |
| RTW banner title | Sentence case on `#design-ready-to-wear-banner` (`text-transform: none`) |
| Clearance banner title | Sentence case on `#design-clearance-banner` (`text-transform: none`) |
| RTW banner frame | `#design-ready-to-wear-banner` padding `36px 24px` (mobile `28px 16px`) |
| RTW banner body | Karrik, **not italic** unless asked |
| Voices quote | Karrik, font-weight 300 |

## Collection tiles

| Item | Value |
| --- | --- |
| Tile min-height | ~168–240px (keep shorter, not tall posters) |
| Tile radius | ~16px |
| Scrim | ~2px blur + multi-stop **left** linear fade spanning ~72% of tile width; ink stops ~0.84 → 0.58 → 0.30 → 0.12 → transparent |
| Tile min-height | Large tiles `clamp(240px, 28vw, 340px)`; smaller tiles `clamp(200px, 23vw, 280px)` |
| Face crops (Everyday / Work) | `object-position: center top` |
| Caption layout | Full-tile vertical stack: icon/title lead upper-left, Explore action lower-left |
| Label placement | Upper-left lead within the caption |
| Occasion icon | Official Lucide line icon above the title; 20px desktop / 18px mobile; ~10–12px gap; 4px left inset; cream currentColor; no badge or circle |
| Explore action | Karrik uppercase, ~11px, ~0.14em tracking; 16px arrow; no button chrome |
| Tile border | None (borderless); keep radius |
| Hover scale | ~1.03 |
| Gap title↔lede in header | ~12px |
| Section header | Centered title + lede |

## Shop under

| Item | Value |
| --- | --- |
| Heading | Source `Best on budget`; displayed uppercase via CSS |
| Title → cards gap | 40px desktop; 32px mobile |
| Section padding | `48px 24px 88px` (mobile `16px 16px 80px`) |
| Tile min-height | clamp(280px, 34vw, 420px) |
| Mobile tile min-height | min(64vw, 340px) |
| Tile border | 1px cream 32% hairline OK |

## Shop by Material

| Item | Value |
| --- | --- |
| Section background | `var(--white)` / `#fcfaf7` |
| Section padding | `48px 24px 72px` (mobile `40px 16px 64px`) |
| Header | Centered like other `/design` section headers |
| Heading | Sprat clamp(28px, 3.2vw, 42px), letter-spacing -0.03em; **uppercase** |
| Lede | muted ~15px, weight 200 |
| Decorative heading hairlines | None |
| Clip path | Stays within 0–1 (bottom tip `.5 1`); defs `overflow: visible` |
| Tile overflow | `visible` (shape comes from clip-path; do not `overflow: hidden` or the bottom tip shears) |
| Card label | Sprat Campaign + cream; side cards `clamp(18px, 1.65vw, 24px)`, active center card `clamp(24px, 2.2vw, 32px)` |
| Card subcopy | Karrik |
| Card media | Fabric-led macro textile imagery; no decorative icon layer |
| Card overlay | Full-tile `.design-materials__scrim`: `rgba(18,10,12,0.38)` + `backdrop-filter: blur(1.5px)` — no `::after` linear gradient, no multiply wash |
| Card CTA | None (no Explore / arrow) |
| Card copy placement | Horizontally + vertically centered in the tile (`justify-content: center`) |
| Carousel layout | Repeated-track infinite center-mode 5-up on desktop / 3-up mobile; active center 100%, adjacent cards 80%, distance-2 cards 60%; hidden recenter point |
| Carousel depth | Active card crisp; adjacent cards blur 1.5px; distance-2 cards blur 3px; deepest cards blur 4.5px |
| Carousel controls | 40px mid-rail arrow controls; keyboard ArrowLeft/ArrowRight; wrapped off-screen cards reposition without a cross-track sweep; reduced-motion removes transitions |

## Product chrome

| Item | Value |
| --- | --- |
| Wishlist | Always on; frosted ~60% white + blur; **no hover border ring** |
| Add to cart | Hover-only on desktop; always on touch |
| Carousel arrows | Mid-image via `cqw` (not mid-section); ~44px; primary chrome |
| Carousel overflow | Fixed viewport height from card width × 3/4 media + `--product-rail-details` (7.75rem — fits title/price/badge/swatches); `overflow-x: auto` + `overflow-y: hidden`; cards `height: auto` / `align-items: start` so details fit content; title line-clamp 2. No wheel JS / touch-action / overscroll hacks |
| View all | Filled primary “Shop All”; centered under header with title/lede |
| Price row | Full width; sale + compare-at + “24% off” badge on the first line; swatches below, left-aligned |
| Discount badge | Primary fill + cream text; 11px Karrik; padding ~3×7; radius-control; text `24% off` on commerce product cards |
| Product card bottom pad | 4px on `.design-new-arrivals__card` |
| Product-card price spacing | Tight under title via body `gap: 6px`; `product-meta` `margin-top: 0`; body/link `flex: 0 0 auto` — never `margin-top: auto` (that left a hole when colors were absent) |
| Swatches | 16px circles below the price line — never on image hover stack; omit entirely when product has no colors |
| Material line | Hidden |
| Image aspect | 3 / 4; left-aligned card + text |
| RTW banner title | `clamp(30px, 3.6vw, 52px)` |
| Campaign next arrow | No shadow; `opacity: 0.85`; `backdrop-filter: blur(10px)` |

## Clearance sale

| Item | Value |
| --- | --- |
| Placement | After Shop by Material / before Voices |
| Banner layout | `layout: "overlay"` — one media object (not 4-up bento/collage); class `design-feature-banner--overlay` |
| Banner surface | White 24px section frame (like campaign/RTW); inner deep plum `primary-900` (not `primary-100`); single cover image + lighter full-panel overlay gradient (`rgba(18,10,12)` ~0.12–0.55), not a near-transparent top fade or darker ~0.48–0.82 band |
| Banner media | `/assets/design-story-cream.jpg` (warm interior cream saree) — not festive |
| Banner type | Cream on image; title sentence case; CTA cream fill + primary text; overlay copy centered; copy max-width 52ch; cream “Upto 50% off” badge above eyebrow |
| Pattern | Feature banner + headerless product rail (`design-new-arrivals--rail-only`); banner owns title/copy/CTA |
| Title | “Clearance sale” in the banner only; no rail header / View all row |
| Products | Sale price + compareAt on every card |
| Section bottom padding | `48px` desktop, `40px` mobile |
| Overlay min-height | Desktop clamp(364px, 42vw, 504px); mobile clamp(304px, 58vw, 344px) |

## RTW / collage

| Item | Value |
| --- | --- |
| Banner section | Light cream background; RTW uses `36px 24px` padding (mobile `28px 16px`); default feature banners stay `24px` / `16px` |
| Banner inner | primary-100 panel, border-radius 16px |
| Banner title | Uppercase |
| Collage gutters | 12px desktop / 8px mobile |
| Banner borders | None (decorative) |
| Rail CTA | “Shop All”; brand primary, not black |
| Banner layout | Copy ~40% left / collage ~60% right |

## Campaign motion

| Item | Value |
| --- | --- |
| Slide transition | Right-to-left (not fade) |
| Copy alignment | Left-aligned on desktop; centered on mobile |
| Desktop copy veil | Left linear dark fade with 2.5px backdrop blur, masked before the right edge |
| Desktop veil pattern | Supplied transparent paisley motif, repeated left-to-right on 520px tiles at low opacity, fading out before the right edge |
| Controls | Centered side arrows (~48px) + dots |
| Side frame | 24px padding on `.section--campaign-hero` (stage is direct child — no `.campaign-hero__inner`) |
| Campaign media | Full stage fill; wrapper `margin: 0`; image `object-fit: cover` |

## Voices feature

| Item | Value |
| --- | --- |
| Section padding | `56px 0 80px` desktop; mobile `40px 0 72px` (top −24px); title/lede constrained with ~24px gutters; ticker full-bleed |
| Header | Centered title + lede (match other `/design` section headers) |
| Track | flex row; gap ~28px; `animation: design-testimonials-ticker 55s linear infinite`; `translateX(-50%)` loop |
| Hover speed | Web Animations `playbackRate` 0.2 on viewport pointerenter/focusin; restore 1 on leave/focusout — do not swap CSS duration (causes snap); do not pause |
| Reduced motion | `.design-testimonials__track { animation: none; }` |
| Card layout | grid `260px minmax(280px, 400px)`; soft primary-50 wash; quote column flex space-between |
| Card media | square 260×260 (`aspect-ratio: 1 / 1`); radius 12px; object-fit cover; object-position center top |
| Type | Quote Karrik `clamp(16px…19px)` weight 300 top; name Sprat/primary-800 bottom; optional muted meta under name |
| Mobile | 180px square; tighter gaps (~16px track / ~12px card) |
| Controls | None (no arrows / controls) |


## Footer

| Item | Value |
| --- | --- |
| Surface | Plum primary; cream inverted logo |
| Avoid | Payment logos, app badges, SEO link clouds, light-gray theme |
| Layout | Brand + brandLine + newsletter (“Join our newsletter for new drops”, Subscribe CTA, margin-top 36px); denser 4 columns Shop/Help/About/Stay in touch; trust strip under columns (same width as link columns); copyright |
| Trust | 4 items (COD / Easy returns / Pan-India shipping / WhatsApp support); stacked icon→label; 32×32 line icons; label 16px cream ~0.78; 4-col desktop / 2-col mobile; gap matches columns (~28px); lives in footer-grid `grid-column: 2` (mobile `1`); sits above copyright rule |
| Section padding | clamp 64px/7vw/88px top, 36px bottom; mobile 56px 28px |
| Grid gap | footer-grid clamp(48px, 5vw, 72px); columns 28px; mobile vertical ~36px |
| Heading | Full cream; Karrik uppercase; margin-bottom ~16px; tracking ~0.13em |
| Link rhythm | Quiet cream ~0.60; gap ~11px; hover full cream |
| Brand copy | Quiet cream ~0.65; margin-top ~18px |
| Bottom band | margin-top ~28px when trust present (trust supplies spacing); padding-top ~22px; border-top cream ~32 percent mix |
