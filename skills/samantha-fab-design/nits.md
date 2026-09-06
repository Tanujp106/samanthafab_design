# Samantha Fab `/design` — micro UI nits

Numbers distilled from page feedback. Update when lasting corrections land.

## Spacing

| Item | Value |
| --- | --- |
| Page / section side gutters | 24px |
| Eyebrow → title | ~6px |
| Title → body / lede | ~6px |
| Collection header → bento grid | ~48px |
| Product card body stack gap | ~6px |
| Product meta stack gap | ~4px |
| Split editorial column gap | 32–64px |
| Collection section vertical padding | ~80px (desktop) |
| New Arrivals header bottom | ~40px |
| RTW rail-only top padding | ~40px |
| Rail footer CTA top margin | ~32px |

## Type

| Item | Value |
| --- | --- |
| Campaign headline (desktop) | ~44–80px |
| Campaign headline (mobile) | ~38–56px |
| Supporting / lede | 15–17px |
| Section titles | Sprat Campaign, primary-800, weight 400, ~28–42px |
| Product names | Sprat Campaign, primary-800, ~16–18px |
| Eyebrow / tags | Karrik, ~10px, wide tracking, uppercase, muted |
| View all / Add to cart label | Karrik ~11px, uppercase, letter-spacing ~0.12em |
| Price | ~14px ink; compare-at ~13px muted strikethrough |
| RTW banner title | Sentence case; `text-transform: none` (eyebrow may stay uppercase) |
| RTW banner body | Karrik, **not italic** unless asked |
| Voices quote | Karrik, font-weight 300 |

## Collection tiles

| Item | Value |
| --- | --- |
| Tile min-height | ~168–240px (keep shorter, not tall posters) |
| Tile radius | ~16px |
| Scrim | ~2px blur + slightly deeper multi-stop linear fade spanning ~68% of tile — never a compressed dark band |
| Tile min-height | Large tiles `clamp(240px, 28vw, 340px)`; smaller tiles `clamp(200px, 23vw, 280px)` |
| Face crops (Everyday / Work) | `object-position: center top` |
| Label placement | Bottom-left; optional “Starting with…” subline |
| Tile border | None (borderless); keep radius |
| Hover scale | ~1.03 |
| Gap title↔lede in header | ~12px |

## Shop under

| Item | Value |
| --- | --- |
| Heading | Sentence case: `Best on budget` |
| Tile min-height | clamp(280px, 34vw, 420px) |
| Mobile tile min-height | min(64vw, 340px) |
| Tile border | 1px cream 32% hairline OK |

## Shop by Material

| Item | Value |
| --- | --- |
| Section background | `var(--white)` |
| Section padding | `48px 24px 72px` (mobile `40px 16px 64px`) |
| Header | left-aligned like Collection |
| Heading | Sprat clamp(28px, 3.2vw, 42px), letter-spacing -0.03em; no uppercase |
| Lede | muted ~15px, weight 200 |
| Decorative heading hairlines | None |
| Clip path | Stays within 0–1 (bottom tip `.5 1`); defs `overflow: visible` |
| Tile overflow | `visible` (shape comes from clip-path; do not `overflow: hidden` or the bottom tip shears) |
| Card label | Sprat Campaign + cream; `clamp(18px, 1.65vw, 24px)` |
| Card subcopy | Karrik |
| Card media | Fabric-led macro textile imagery; no decorative icon layer |
| Card overlay | Full-tile `.design-materials__scrim`: `rgba(18,10,12,0.38)` + `backdrop-filter: blur(1.5px)` — no `::after` linear gradient, no multiply wash |
| Card CTA | None (no Explore / arrow) |
| Card copy placement | Horizontally + vertically centered in the tile (`justify-content: center`) |

## Product chrome

| Item | Value |
| --- | --- |
| Wishlist | Always on; frosted ~60% white + blur; **no hover border ring** |
| Add to cart | Hover-only on desktop; always on touch |
| Carousel arrows | Mid-image via `cqw` (not mid-section); ~44px; primary chrome |
| View all | Filled primary; align with title (offset past eyebrow line) |
| Price row | Full width; sale + compare-at on the first line; swatches below, left-aligned |
| Product-card price alignment | Details fill the shared row height; price meta sits on the common bottom edge |
| Swatches | 16px circles below the price line — never on image hover stack |
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
| Banner type | Cream on image; title not forced primary-800; CTA cream fill + primary text |
| Pattern | Feature banner + headerless product rail (`design-new-arrivals--rail-only`); banner owns title/copy/CTA |
| Title | “Clearance sale” in the banner only; no rail header / View all row |
| Products | Sale price + compareAt on every card |
| Section bottom padding | `72px` desktop, `64px` mobile |
| Overlay min-height | Desktop clamp(340px, 42vw, 480px); mobile ~280–320px |

## RTW / collage

| Item | Value |
| --- | --- |
| Banner section | White background + 24px padding (mobile 16px) like campaign frame |
| Banner inner | primary-100 panel, border-radius 16px |
| Banner title | Sentence case; `text-transform: none` |
| Collage gutters | 12px desktop / 8px mobile |
| Banner borders | None (decorative) |
| Rail CTA | Brand primary, not black |
| Banner layout | Copy ~40% left / collage ~60% right |

## Campaign motion

| Item | Value |
| --- | --- |
| Slide transition | Right-to-left (not fade) |
| Controls | Centered side arrows (~48px) + dots |
| Side frame | 24px padding on `.section--campaign-hero` (stage is direct child — no `.campaign-hero__inner`) |
| Campaign media | Full stage fill; wrapper `margin: 0`; image `object-fit: cover` |

## Voices feature

| Item | Value |
| --- | --- |
| Section padding | `56px 0 80px` desktop; mobile `40px 0 72px` (top −24px); title/lede constrained with ~24px gutters; ticker full-bleed |
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
| Layout | Brand + brandLine; denser 4 columns Shop/Help/About/Stay in touch; trust strip under columns (same width as link columns); copyright |
| Trust | 4 items (COD / Easy returns / Pan-India shipping / WhatsApp support); stacked icon→label; 32×32 line icons; label 16px cream ~0.78; 4-col desktop / 2-col mobile; gap matches columns (~28px); lives in footer-grid `grid-column: 2` (mobile `1`); sits above copyright rule |
| Section padding | clamp 64px/7vw/88px top, 36px bottom; mobile 56px 28px |
| Grid gap | footer-grid clamp(48px, 5vw, 72px); columns 28px; mobile vertical ~36px |
| Heading | Full cream; Karrik uppercase; margin-bottom ~16px; tracking ~0.13em |
| Link rhythm | Quiet cream ~0.60; gap ~11px; hover full cream |
| Brand copy | Quiet cream ~0.65; margin-top ~18px |
| Bottom band | margin-top ~28px when trust present (trust supplies spacing); padding-top ~22px; border-top cream ~32 percent mix |
