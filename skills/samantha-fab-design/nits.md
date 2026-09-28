# Samantha Fab `/design` — micro UI nits

Numbers distilled from page feedback. Update when lasting corrections land.

## Mobile shell (≤900px)

| Item | Value |
| --- | --- |
| Top bar height | 64px min-height; 10px vertical padding; 16px side gutters |
| Bottom bar height | ~72px + safe-area; 5 equal tabs; icon 22px; label 10px Karrik |
| Drawer width | min(88vw, 360px); slides from left; overlay rgba(18,10,12,0.42) |
| Explore search | 48px pill; 999px radius; whisper cream fill |
| Explore trending | 5 chips: Bestsellers (all), Ready-to-wear, Everyday, Wedding, Festive — client filter by tag/name |
| Explore grid | 2 columns; 16×12px gap; same commerce cards as Best sellers (no hover wishlist/cart on grid) |
| Empty state | Keep the empty-results shell hidden until needed; no empty-state title or helper prompt copy |
| Search overlay | Search form width 100%; Karrik body/UI typography; no Clear search controls or “Showing top products” helper copy; “Clear recent searches” is an un-underlined text control |

## Wishlist / Bag

| Item | Value |
| --- | --- |
| Wishlist route | `/design?route=wishlist` — centered title + **4-col** grid (3 ≤1100 / 2 mobile) of shared commerce product cards at New Arrivals card scale; **× cancel** removes (not heart) |
| Bag UI | Desktop: right overlay drawer (`min(100vw, 420px)`); mobile: full-width page panel inside the mobile shell with no backdrop or fixed drawer; desktop nav bag / Add to cart open the drawer, mobile Bag / mobile Add to cart open the page; `?route=bag` opens the appropriate surface then strips the query |
| Persistence | localStorage keys `sf-design-wishlist` / `sf-design-bag` (playground prototype) |
| Bag contents | Line items (88px portrait, × on media) + sticky footer summary (subtotal / shipping / total / Checkout / trust); qty ±; Save for later |
| Empty CTAs | Wishlist → single “Shop best sellers”; Bag → single “Continue shopping” action that returns to Home |
| Wishlist empty | Soft primary-50 panel; familiar filled heart icon in a soft circular field; sentence-case “Nothing saved yet”; readable copy; no tip |
| Bag empty | Soft primary-50 panel; familiar outlined bag icon in a soft circular field; sentence-case “Your bag is empty”; one clear CTA; no secondary link or helper tip |
| Wishlist search | Do not mount the search overlay or Search trigger on `/design?route=wishlist` |
| Wishlist page pad | `20px 24px 88px` desktop; header margin `4px 0 32px` |

## Account login overlay

| Item | Value |
| --- | --- |
| Scrim | Full viewport `rgba(18, 10, 12, 0.38)` with a centered panel |
| Panel | Desktop `min(calc(100% - 48px), 960px)` wide × `min(640px, calc(100% - 48px))`; horizontal split `1.08fr / minmax(300px, 0.92fr)`; whisper cream; `4px` radius; full-screen mobile sheet |
| Panel content | OTP form + logo on the left; one cover editorial saree image on the right using `/assets/design-story-cream.jpg`; image hidden on mobile |
| Panel gutters | `48px` desktop content; `20px` mobile |
| Close control | 40px compact target with 20px icon; top/right `18px/20px` desktop; 10px mobile |
| Typography | Karrik throughout: title `18px`; input `15px`; supporting text `14px`; buttons `13px`; terms `12px` |
| Form fields | Full-width email field + filled OTP CTA, both `52px` high desktop and mobile |
| Google fallback | Full-width outlined button `52px` high desktop and mobile; 24px Google mark |
| Dismissal | Close button, backdrop, Escape; focus returns to the account trigger |

## Collection PLP

| Item | Value |
| --- | --- |
| Route | `/design?route=collection&slug=bestsellers` (aliases: `?route=bestsellers`, occasion routes) |
| Side gutters | 24px desktop / 16px mobile |
| Sidebar width | ~220–260px sticky under nav |
| Desktop grid | 3 columns; 2 below ~1100px |
| Mobile grid | 2 columns; sidebar hidden |
| Mobile actions | Filters + Sort buttons → separate bottom sheets |
| Sheet surface | Whisper cream; primary filled View results CTA |
| Facets | Availability, Price, Category, Collections, Size, Color |
| Filter chrome | Custom 4px plum checkboxes (not native); soft primary-50 search/price wells (8px radius); counts right-aligned muted; rotating SVG chevrons; no harsh grey input boxes |
| Scroll | Sidebar sticky under nav (`top` ~104px), `max-height` viewport remainder, own overflow + thin plum scrollbar; product grid scrolls with the page; no nested facet-list scroll |

## Product detail (PDP)

| Item | Value |
| --- | --- |
| Route | `/design?route=product&slug=…` |
| Gallery | 2-col grid, `gap: 10px`; **minimum 4** unique images via `resolveProductGallery` (curated sets + pool); max 6; each tile forced **3/4** (`aspect-ratio`) with absolute cover frames (`object-position: center top`) |
| Layout gap | `column-gap: clamp(40px, 5vw, 72px)` between gallery and purchase |
| Gallery stickiness | `position: sticky; top: 112px` desktop; gallery `position: static` on ≤760px |
| Purchase column | `position: relative` (scrolls with page; not sticky) |
| Title | Lora `clamp(28px, 3.4vw, 44px)`; share control 44px |
| Material | Below title; Karrik uppercase 13px / 0.08em; primary colour — not a pill tag |
| Description | Always visible Karrik 15px lede; never a collapsed summary |
| Variants | Two equal cards; Regular +₹0 / Ready-to-wear +₹70; selected primary-50 fill |
| Price | Sale `28px` Karrik; compare-at strikethrough `15px` |
| CTA row | Add to cart flex with cream shimmer sweep (~2.4s, reduced-motion off) + wishlist 52px + WhatsApp 52px; Buy it now full width below |
| Trust | 4 icon+label badges in purchase column |
| Related | “Recommended for you”; 3-col desktop / 2-col mobile; max 3 cards |
| Dropped | Colour “Options available”, collapsible Description summary, size selector, pincode delivery check, shipping callout card, offer card |

## Surface

| Item | Value |
| --- | --- |
| Page / light section fill | `--color-white` / `--color-paper` = `#fcfaf7` (very light cream, not `#fff`, not heavy beige) |
| Text on dark (footer/CTAs) | `--color-cream` = `#fffdf9` |

## Navigation

| Item | Value |
| --- | --- |
| Home affordance | Omit Home from the centered primary links; the Samantha Fab wordmark links to `/design` |
| Primary links | Shop (mega) · New Arrival · Best sellers · About · Sale |
| Shop mega menu | 5 taxonomy columns (craft / design language / textiles / colours / occasions); no featured image panel |
| Mega-menu groups grid | `repeat(5, minmax(0, 1fr))` desktop; 3-up ≤1200px; 2-up ≤900px; 1-up ≤640px |
| Mega-menu link hover | `scale(1.06)` + primary color only; no underline / border-bottom (overrides homepage `.nav-links a` hairline) |

## Spacing

| Item | Value |
| --- | --- |
| Page / section side gutters | 24px |
| Reference nav top row | 88px min-height with 20px top / 12px bottom padding (mobile 64px / 10px) |
| Eyebrow → title | ~6px |
| Title → body / lede | ~6px |
| Collection header → bento grid | ~48px |
| Product card body stack gap | ~6px |
| Product meta stack gap | ~4px |
| Split editorial column gap | 32–64px |
| Collection section vertical padding | ~80px (desktop) |
| Mobile Collection bottom padding | `32px` on `#design-shop-by-collection` (48px top) |
| New Arrivals header bottom | ~40px |
| New Arrivals section padding | Outer cream frame `36px 24px` (mobile `28px 16px 44px`); inner pad `clamp(28px, 4vw, 56px) clamp(20px, 3vw, 40px)` — same as RTW banner |
| Mobile Best Sellers bottom padding | `48px` on `#design-best-sellers` |
| New Arrivals surface | Inset `#design-new-arrivals .design-new-arrivals__inner`: `var(--color-primary-100)`, `border-radius: 16px`, no border — match RTW feature panel |
| Mobile product rails | At ≤640px, including the ≤420px viewport override, show two cards at a time with `calc((100% - 16px) / 2)` columns; keep the fixed-height horizontal rail and align arrows to the two-up media midpoint |
| USP row padding | None (fixed height bar) |
| USP row height | `56px` desktop / `52px` mobile (within 50–60px) |
| USP row surface | `var(--color-primary)` with cream type/icons |
| USP row layout | Infinite horizontal ticker; icon + label in a row; duplicated track for seamless loop |
| USP row track | `clamp(48px, 5vw, 72px)` gap desktop; `40px` mobile; `18s` linear infinite cycle |
| USP row icons | Lucide banknote / refresh-cw / truck / message-circle; stroke 2; cream; 18px |
| RTW / Clearance rail-only top padding | `0` on desktop and mobile; explicit IDs `#design-ready-to-wear-products` and `#design-clearance-sale` |
| Rail footer CTA top margin | 16px |

## Type

| Item | Value |
| --- | --- |
| Campaign headline (desktop) | ~44–80px |
| Campaign headline (mobile) | ~38–56px |
| Supporting / lede | 15–17px |
| Section titles | Lora, primary-800, weight 400, ~28–42px, **uppercase** |
| Product names | Lora, primary-800, ~16–18px |
| Eyebrow / tags | Karrik, ~10px, wide tracking, uppercase, muted |
| View all / Add to cart label | Karrik **13px**, uppercase, letter-spacing ~0.12em; product-rail CTA “Shop All” |
| Mobile Add to cart label | Karrik `var(--text-xs)` / 11px, uppercase, letter-spacing ~0.12em |
| Price | ~14px ink; compare-at ~13px muted strikethrough |
| RTW banner title | Sentence case on `#design-ready-to-wear-banner` (`text-transform: none`) |
| Clearance banner title | Sentence case on `#design-clearance-banner` (`text-transform: none`) |
| RTW banner frame | `#design-ready-to-wear-banner` padding `36px 24px` (mobile `28px 16px`) |
| RTW banner body | Karrik, **not italic** unless asked |
| RTW banner USPs | 3 compact icon+label items beneath the CTA; no divider; 28px top pad after a 16px desktop margin / 0 mobile top pad; 24px line icons, 11px labels, 12px desktop gap / 8px mobile gap; reduced-motion-safe staggered lift |
| Mobile RTW USP top padding | `0` (retain the existing 16px top margin) |
| Voices quote | Karrik, font-weight 300 |

## Collection tiles

| Item | Value |
| --- | --- |
| Mobile grid | 2×2 grid; all four tiles use one column span with `min-height: min(52vw, 220px)` |
| Tile min-height | ~168–240px (keep shorter, not tall posters) |
| Tile radius | ~16px |
| Scrim | ~2px blur + multi-stop **left** linear fade spanning ~72% of tile width; ink stops ~0.84 → 0.58 → 0.30 → 0.12 → transparent |
| Tile min-height | Large tiles `clamp(240px, 28vw, 340px)`; smaller tiles `clamp(200px, 23vw, 280px)` |
| Face crops (Everyday / Work) | `object-position: center top` |
| Caption layout | Desktop: full-tile vertical stack with icon/title lead upper-left and Explore action lower-left; mobile: no Explore action, title group anchored at the bottom |
| Mobile scrim | Full-width bottom-up linear fade, softened to `rgba(18,10,12,0.68)` → `0.34` → `0.12` → transparent at `0% / 28% / 56% / 78%`; mask clears by `86%` |
| Label placement | Upper-left lead within the caption |
| Occasion icon | Official Lucide line icon above the title; 20px desktop / 18px mobile; ~10–12px gap; 4px left inset; cream currentColor; no badge or circle |
| Explore action | Karrik uppercase, ~11px, ~0.14em tracking; 16px arrow; no button chrome |
| Tile border | None (borderless); keep radius |
| Hover scale | ~1.03 |
| Gap title↔lede in header | ~12px |
| Section header | Centered title + lede |
| Mobile Ready-to-wear tile title | `22px` Lora |

## Shop under

| Item | Value |
| --- | --- |
| Heading | Source `Best on budget`; displayed uppercase via CSS |
| Title → cards gap | 40px desktop; 32px mobile |
| Section padding | `48px 24px 88px` (mobile `16px 16px 64px`) |
| Tile min-height | clamp(280px, 34vw, 420px) |
| Mobile tile min-height | min(56vw, 260px) |
| Tile border | 1px cream 32% hairline OK |

## Shop by Material

| Item | Value |
| --- | --- |
| Section background | `var(--white)` / `#fcfaf7` |
| Section padding | `48px 24px 72px` (mobile `40px 16px 64px`) |
| Mobile viewport | `width: calc(100% + 32px)` + `margin-inline: -16px` + `padding-inline: 16px`; `box-sizing: border-box` keeps the material carousel from clipping against the section gutter |
| Header | Centered like other `/design` section headers |
| Heading | Lora clamp(28px, 3.2vw, 42px), letter-spacing -0.03em; **uppercase** |
| Lede | muted ~15px, weight 200 |
| Decorative heading hairlines | None |
| Clip path | Stays within 0–1 (bottom tip `.5 1`); defs `overflow: visible` |
| Tile overflow | `visible` (shape comes from clip-path; do not `overflow: hidden` or the bottom tip shears) |
| Card label | Lora + cream; side cards `clamp(18px, 1.65vw, 24px)`, active center card `clamp(24px, 2.2vw, 32px)` |
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
| Wishlist | Always on; frosted ~60% white + blur; **no hover border ring**; filled heart + toast when saved |
| Add to cart | Hover-only on desktop; always on touch; toast confirms “Added to bag” |
| Carousel arrows | Mid-image via `cqw` (not mid-section); ~44px; primary chrome |
| Carousel overflow | Fixed viewport height from card width × 3/4 media + `--product-rail-details` (7.75rem — fits title/price/badge/swatches); `overflow-x: auto` + `overflow-y: hidden`; cards `height: auto` / `align-items: start` so details fit content; title line-clamp 2. No wheel JS / touch-action / overscroll hacks |
| View all | Filled primary “Shop All”; centered under header with title/lede except New Arrivals, where it sits below the product rail |
| New Arrivals Shop All | Rail footer CTA below the stage; 16px top margin; filled primary 13px Karrik label |
| Price row | Full width; sale + compare-at + “24% off” badge on the first line; swatches below, left-aligned |
| Discount badge | Primary fill + cream text; 11px Karrik; padding ~3×7; radius-control; text `24% off` on commerce product cards |
| Product card bottom pad | 4px on `.design-new-arrivals__card` |
| Product-card price spacing | Tight under title via body `gap: 6px`; `product-meta` `margin-top: 0`; body/link `flex: 0 0 auto` — never `margin-top: auto` (that left a hole when colors were absent) |
| Swatches | 16px circles below the price line — never on image hover stack; omit entirely when product has no colors |
| Material line | Hidden |
| Image aspect | 3 / 4; left-aligned card + text |
| Hover image | Desktop fine-pointer: crossfade `media--hover` over primary (~280ms); pair from `playground/data/hover-media.js`; no second-image zoom; touch keeps primary only |
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
| Desktop copy veil | Clean left dark linear gradient (~0.68 → transparent by ~62%) for cream type on light walls; no blur, no paisley |
| First slide crop | Maroon hero: `object-position: 72% center` + `scale(1.22)` from `72%` so the seated figure sits further right |
| Campaign CTA | Shop Now `.campaign-slide__cta` at **14px** Karrik |
| Controls | Centered side arrows (~48px) + dots |
| Side frame | 24px padding on `.section--campaign-hero` (stage is direct child — no `.campaign-hero__inner`) |
| Campaign media | Full stage fill; wrapper `margin: 0`; image `object-fit: cover` |
| Title accent | Same Lora serif; palette-native plum (`--color-primary-400` via `--campaign-accent` on dark media, `--color-primary-500` on light panels); `skewX(-12deg)` + italic; one `highlight` word per slide/banner |

## Voices feature

| Item | Value |
| --- | --- |
| Section padding | `56px 0 80px` desktop; mobile `40px 0 72px` (top −24px); title/lede constrained with ~24px gutters; ticker full-bleed |
| Header | Centered title + lede on desktop and mobile |
| Mobile surface/content alignment | Section surface and heading remain centered; testimonial cards and their copy are left-aligned |
| Track | flex row; gap ~28px; `animation: design-testimonials-ticker 55s linear infinite`; `translateX(-50%)` loop |
| Hover speed | Web Animations `playbackRate` 0.2 on viewport pointerenter/focusin; restore 1 on leave/focusout — do not swap CSS duration (causes snap); do not pause |
| Reduced motion | `.design-testimonials__track { animation: none; }` |
| Card layout | grid `260px minmax(280px, 400px)`; soft primary-50 wash; quote column flex space-between |
| Card media | square 260×260 (`aspect-ratio: 1 / 1`); radius 12px; object-fit cover; object-position center top |
| Type | Quote Karrik `clamp(16px…19px)` weight 300 top; name Lora/primary-800 bottom; optional muted meta under name |
| Mobile | 180px square; tighter gaps (~16px track / ~12px card) |
| Controls | None (no arrows / controls) |


## Footer

| Item | Value |
| --- | --- |
| Surface | Plum primary; cream inverted logo |
| Avoid | Payment logos, app badges, SEO link clouds, light-gray theme |
| Layout | Brand + brandLine + Connect with us socials (above newsletter) + newsletter (“Join our newsletter for new drops”, Subscribe CTA, margin-top 28px); **3** columns Shop/Help/About; trust strip under columns (same width as link columns); copyright |
| Socials | Heading “Connect with us”; 4 circular icon buttons (Instagram / Facebook / Pinterest / YouTube) using **Phosphor** regular logos; each link has `aria-label`; icons `aria-hidden` inside containers; 40px hit targets |
| Trust | 4 items (COD / Easy returns / Pan-India shipping / WhatsApp support); stacked icon→label; 32×32 line icons; label 16px cream ~0.78; 4-col desktop / 2-col mobile; gap matches columns (~28px); lives in footer-grid `grid-column: 2` (mobile `1`); sits above copyright rule |
| Section padding | clamp 64px/7vw/88px top, 36px bottom; mobile 56px 28px |
| Grid gap | footer-grid clamp(48px, 5vw, 72px); columns 28px; mobile vertical ~36px |
| Heading | Full cream; Lora uppercase; margin-bottom ~16px; tracking ~0.13em |
| Link rhythm | Quiet cream ~0.60; gap ~11px; hover full cream |
| Brand copy | Quiet cream ~0.65; margin-top ~18px |
| Bottom band | margin-top ~28px when trust present (trust supplies spacing); padding-top ~22px; border-top cream ~32 percent mix |
