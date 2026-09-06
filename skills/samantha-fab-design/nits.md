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
| RTW banner body | Karrik, **not italic** unless asked |

## Collection tiles

| Item | Value |
| --- | --- |
| Tile min-height | ~168–240px (keep shorter, not tall posters) |
| Tile radius | ~16px |
| Scrim blur | ~2px + linear fade up (~46% height) — never solid blur band |
| Face crops (Everyday / Work) | `object-position: center top` |
| Label placement | Bottom-left; optional “Starting with…” subline |
| Tile border | None (borderless); keep radius |
| Hover scale | ~1.03 |
| Gap title↔lede in header | ~12px |

## Shop under

| Item | Value |
| --- | --- |
| Tile min-height | clamp(260px, 32vw, 380px) |
| Mobile tile min-height | min(58vw, 300px) |
| Tile border | 1px cream 32% hairline OK |

## Shop by Material

| Item | Value |
| --- | --- |
| Section background | `var(--white)` |
| Section padding | `72px 24px 108px` (mobile `56px 16px 96px`) |
| Header | left-aligned like Collection |
| Heading | Sprat clamp(28px, 3.2vw, 42px), letter-spacing -0.03em; no uppercase |
| Lede | muted ~15px, weight 200 |
| Decorative heading hairlines | None |
| Card label | Sprat Campaign + cream; `clamp(18px, 1.65vw, 24px)` |
| Card subcopy | Karrik |
| Card media | Fabric-led macro textile imagery; no decorative icon layer |
| Card overlay | Full-tile `.design-materials__scrim`: `rgba(18,10,12,0.32)` + `backdrop-filter: blur(2px)` — no `::after` linear gradient, no multiply wash |
| Card CTA | None (no Explore / arrow) |
| Card copy placement | Horizontally + vertically centered in the tile (`justify-content: center`) |

## Product chrome

| Item | Value |
| --- | --- |
| Wishlist | Always on; frosted ~60% white + blur; **no hover border ring** |
| Add to cart | Hover-only on desktop; always on touch |
| Carousel arrows | Mid-image via `cqw` (not mid-section); ~44px; primary chrome |
| View all | Filled primary; align with title (offset past eyebrow line) |
| Price row | Full width; sale left of compare-at; swatches right (`margin-left: auto`) |
| Product-card price alignment | Details fill the shared row height; price meta sits on the common bottom edge |
| Swatches | 16px circles in price row — never on image hover stack |
| Material line | Hidden |
| Image aspect | 3 / 4; left-aligned card + text |

## RTW / collage

| Item | Value |
| --- | --- |
| Collage gutters | 12px desktop / 8px mobile |
| Banner borders | None |
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
| Card layout | grid `220px minmax(220px, 320px)`; soft primary-50 wash; quote column flex space-between |
| Card media | square 220×220 (`aspect-ratio: 1 / 1`); radius 12px; object-fit cover; object-position center top |
| Type | Quote Karrik `clamp(16px…19px)` top; name Sprat/primary-800 bottom; optional muted meta under name |
| Mobile | 160px square; tighter gaps (~16px track / ~12px card) |
| Controls | None (no arrows / controls) |
