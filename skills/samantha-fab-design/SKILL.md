---
name: samantha-fab-design
description: >-
  Mandatory Samantha Fab /design visual system for the playground mock.
  Use for ANY design, UI, layout, typography, spacing, section, hero, product
  rail, bento, banner, polish, page feedback, or visual change in this repo
  (especially playground/ and /design). Read and follow before inventing
  treatments. Also use when the user corrects design so preferences can be
  folded back into this skill.
---

# Samantha Fab Design

**Hard gate:** Before any design/UI/visual work in this repo, read this skill
fully and open [nits.md](nits.md). Announce: `Using samantha-fab-design`.

This repo is the frontend design source of truth (not Shopify). `/design`
(`body[data-page="blank"]`) is a **final client surface**, not a wireframe.

**Canonical path in this repo:** `skills/samantha-fab-design/`
(If `.cursor/skills/samantha-fab-design/` exists, keep it in sync — same content.)

## Workflow

1. Read this file + [nits.md](nits.md).
2. Match existing `/design` sections (Shop by Collection, New Arrivals) before inventing chrome.
3. Prefer shared tokens + renderers over one-off styles.
4. After lasting user corrections, **upkeep this skill** (see below) in the same turn.

## Always

- Reuse `playground/styles/tokens.css` + `--font-display` / `--font-body`. No duplicate `@font-face` names or isolated color ramps in section CSS.
- Page / light section surfaces use whisper cream `--color-white` / `--color-paper` (`#fcfaf7`) — not stark `#fff`, not a heavy cream wash.
- **Lora** for section/product titles through `--font-display`; restore **Karrik** for body copy and UI through `--font-body` so supporting text keeps its original voice. Use each loaded family’s weight range instead of switching families. Highlighted title words use the existing plum palette, not an unrelated accent ramp; campaign hero accents use the deeper `--color-primary-400` on dark imagery.
- Light-surface section titles: `--color-primary-800`, **uppercase** (`text-transform: uppercase`), centered with their ledes across `/design` section headers. Lede/body: muted Karrik, weight 400 — not heavy.
- Side gutters **24px** so the light cream page frame shows; align nav to that width.
- Reference navigation on desktop stays one three-column row: brand left, primary links centered, utility actions right; the wordmark is the sole Home affordance and links to `/design`, so do not repeat Home in the primary links; keep search, wishlist, account, and bag in the utility cluster while the mobile shell uses its dedicated controls.
- Primary nav labels: **Shop** (mega menu) · **New Arrival** · **Best sellers** · **About** · **Sale**. Shop mega menu is five taxonomy columns only (By craft / By design language / By textiles / By colours / By occasions) with no featured image panel; every link resolves in-playground.
- Split editorial (media + copy): explicit **32–64px** column gap.
- Product/occasion tags: `Everyday` / `Work` / `Festive` / `Wedding` / `Ready-to-wear` — never “New”.
- Primary CTAs (`View all`, `Shop ready-to-wear`): filled primary button.
- Collection tiles may use one occasion-specific Lucide line icon in a vertically distributed editorial caption; keep it quiet, current-color, and free of enclosing badges or circles. On desktop, the icon/title leads from the upper-left and a small Explore text action anchors lower-left. On mobile, hide Explore, move the title group to the bottom, and use a bottom-up linear scrim. No “Starting with…” price sublines.
- Color swatches in the **price row** (right-aligned), not on image hover with Add to cart.
- Product-card details stack tightly (tag → name → price ~6px); do not push price to the bottom with `margin-top: auto` — that opens a large title→price gap on cards without colors. When colors exist, keep swatches beneath the price line.
- Commerce product cards crossfade to an alternate archive image on desktop hover / focus-within when a hover pair exists (`media--primary` + `media--hover`); fine-pointer only; reduced motion keeps the swap instant (no zoom fight with the hover layer).
- Image scrims: long, low-opacity **linear left fade** (+ light blur if needed) for collection/bento tiles so left captions stay readable. Never a solid blur veil or a compressed dark band there. **Shop by Material** cards use a full-tile, lightly blurred dark scrim (no linear gradient).
- Annotations / review chrome: only with `?notes=1`. Keep default `/design` clean.
- Editorial geometry: hairline gaps, restrained radius, varied section rhythm, real or replaceable photos.
- Material cards use direct textile imagery and editorial copy, not symbolic iconography.
- Search overlay uses a 100% width search form and Karrik body/UI type throughout; omit Clear search controls and helper status copy such as “Showing top products.” Keep the hidden empty-results shell behavior-only, without “Nothing found yet” or prompt copy, and style “Clear recent searches” as an un-underlined text control.
- Account login overlay uses a horizontal whisper-cream panel on desktop: OTP-first email login and Google fallback sit on the left, with one editorial saree image on the right, over a dimmed scrim; close behavior restores focus to the account trigger. Mobile keeps the full-screen form sheet and hides the image. Typography and controls inherit the normal `/design` scale: Karrik UI text, an 18px title, 15px input text, 13px buttons, and 52px controls—never poster-scale login chrome.

## Never

- Rounded-card / gradient-heavy / purple-glow “AI slop”.
- Heavy display weights or decorative font switching; italic RTW banner body unless explicitly requested.
- Decorative borders on feature/RTW banners.
- Wishlist hover borders; material lines under product cards.
- Nesting sticky nav inside a short header wrapper (breaks sticky).
- Major image-led Saree Library block — keep guides as a quiet post-sale strip.
- Inventing a second product catalog or a framework; extend `blank.js` + shared renderers.

## Section defaults

| Section | Defaults |
| --- | --- |
| Campaign hero | 24px side padding on the section; full-bleed `cover` media; RTL slide (not fade); left-aligned desktop copy with a left dark linear gradient for type legibility (no blur/paisley); first slide zooms right (`72%` / scale 1.22); centered mobile fallback; centered prev/next arrows; Shop Now CTA at **14px**; Lora title with optional palette-native accent word (`highlight`) via `skewX(-12deg)` |
| Shop by collection | Centered title + light lede → gap → taller 2+3 bento; vertically distributed icon/title/Explore captions (no “Starting with…” price lines); soft **left** linear scrim; top-align portraits; borderless tiles; mobile fallback is a compact 2×2 grid with a slightly smaller Ready-to-wear title |
| New Arrivals | Match Ready-to-wear panel chrome: cream section frame (`36px 24px` / mobile `28px 16px 44px`), inset **primary-100** container, **16px** radius, RTW-matching inner pad; Lora/primary-800 uppercase titles; centered header with Shop All below the rail; left-aligned product cards; Shop All primary button 13px; fixed-height horizontal rail; two product cards visible at a time on mobile across every product rail; product details `--product-rail-details: 7.75rem`; “24% off” badge; Save heart fills solid when wishlisted |
| USP row | After New Arrivals / before Best sellers; compact **56px** primary ticker; cream Lucide icons + uppercase labels; faster **18s** infinite horizontal marquee with generous spacing and a duplicated track; reduced-motion freezes |
| Best sellers | Same product-carousel as New Arrivals; after USP row / before RTW banner; Shop All CTA → `/design?route=collection&slug=bestsellers` |
| Collection PLP | Reusable template for all collections via `?route=collection&slug=…` (aliases like `?route=bestsellers` also resolve). Desktop: sticky left filters + 3-col grid. Mobile: Filters + Sort as separate bottom sheets. Facets: Availability, Price, Category, Collections, Size, Color. Reuse commerce `renderProductCard`. Shared catalog in `playground/data/`. |
| Product detail (PDP) | Shared `/design?route=product&slug=…`. Desktop **sticky left gallery** (`top: 112px`) beside a scrolling purchase column; 2-col gallery (**≥4** curated images, up to 6) with uniform **3/4** tiles; layout `column-gap: clamp(40px, 5vw, 72px)`. Purchase order: occasion tag → title/share → **material under title** → always-visible short description → Regular/RTW blouse cards → SKU → price/tax → coupons → shimmering Add to cart + wishlist + WhatsApp → Buy it now → Product Description / Shipping & Return accordions → 4 trust badges → Recommended for you (3 cards). No colour “Options available”, collapsible description summary, pincode check, shipping callout, or offer card. |
| Ready-to-wear banner | Light cream section + 36px/24px frame; primary-100 inner radius 16px; collage right; title sentence case; CTA primary 13px; three compact icon+label USPs beneath the CTA |
| RTW product rail | Headerless; **no top padding**; CTA “Shop All” 13px; brand primary |
| Shop under | Centered uppercase heading; title→cards gap 40px (mobile 32px); section pad `48px 24px 88px` (mobile `16px 16px 64px`); three image price tiles clamp(280px, 34vw, 420px), with a shorter `min(56vw, 260px)` mobile height |
| Shop by Material | After Shop under / before Clearance; light cream; padding 48/24/72; centered uppercase header; shaped fabric tiles in an infinite circular center-mode 5-up carousel on desktop (100% active / 80% adjacent / 60% distance-2; 3-up mobile fallback); mobile viewport runs edge-to-edge with a 16px internal inset so side cards are not clipped by the section gutter; depth blur on side cards; keyboard + arrow controls; blur+dark scrim; no Explore CTA |
| Clearance sale | After Material / before Voices; overlay banner (cream story image, primary-900, lighter scrim, sentence-case title, Upto 50% off badge); headerless rail; **no top padding**; bottom pad 48/40 |
| Account login overlay | Desktop horizontal split panel over a dimmed page: Samantha Fab wordmark, Login with OTP form, Google fallback, and terms copy on the left; one editorial saree image on the right. Mobile returns to the full-screen form sheet with the image hidden; same Karrik UI scale as `/design`; Escape, backdrop, and close button dismiss |
| Voices feature | After Clearance; centered section surface and header; left-aligned card content; infinite ticker cards; playbackRate hover 0.2; padding 56/0/80 |
| Footer | Plum; brand + Connect with us Phosphor social icons above newsletter; **3** link columns (Shop / Help / About); trust strip; no payment logos |

Micro measurements live in [nits.md](nits.md). When unsure, match New Arrivals / Collection hierarchy already on `/design`.

## Upkeep (required)

When the user gives **lasting** design feedback (not a one-off experiment):

1. Apply the UI change.
2. Update this skill in the **same turn**:
   - Durable always/never/section rule → edit this `SKILL.md`
   - Pixel/spacing/chrome numbers → edit [nits.md](nits.md)
3. Add a one-line dated note under **Changelog** below.
4. Record a short PMB lesson for Samantha Fab if memory tools are available.

Do **not** wait for the user to say “update the skill” — preference corrections imply upkeep.

One-off experiments (“try X once”) do not get written until the user confirms they stick.

## Mobile shell (`/design`, ≤900px)

- Top bar: hamburger (left) · centered logo · account icon (right). Search and bag move to the bottom bar on mobile.
- Bottom bar (fixed): Home · Explore · WhatsApp (external link) · Wishlist · Bag — icon + label; active tab filled/darker.
- Hamburger opens a **left drawer** with promo strip, category links (from Shop mega menu), and chevrons.
- **Explore** tab: pill search bar (client-side filter only — prototype), trending chips, 2-up product grid reusing Best sellers catalog.
- **Wishlist** / **Bag**: Wishlist stays a page at `/design?route=wishlist` using the same commerce product cards at New Arrivals scale (4-up; × cancel removes). Bag is a **right-side overlay drawer on desktop** (desktop nav bag / Add to cart), while mobile Bag opens a full-width page panel inside the mobile shell with no backdrop or fixed drawer. `?route=bag` opens the appropriate surface for the viewport. Prototype persistence via localStorage. Empty wishlist and bag use familiar heart/bag icons in soft circular fields, sentence-case titles and copy, and one clear action each (Shop best sellers / Continue shopping); no helper tips or secondary links. Filled bag: × on media, Save for later, sticky order summary with quiet trust line.
- Wishlist routes omit the search overlay and its trigger so the saved-items surface stays focused.
- Tab panels swap in place of `.site-main` + footer; homepage sections unchanged on Home.

## Changelog

- 2026-09-28 — PDP layout: sticky gallery (112px) + scrolling purchase column; wider column gap clamp(40px, 5vw, 72px); uniform 3/4 gallery tiles with cover frames.
- 2026-09-28 — Shop mega-menu link hover: no underline/border, scale 1.06 with springier easing (overrides homepage `.nav-links a` hairline).
- 2026-09-28 — PDP feedback: gallery ≥4 curated images; remove Options available + collapsible Description; material under title; Add to cart shimmer.
- 2026-09-28 — Product detail rebuilt to sketch IA: Regular/RTW blouse variants replace size; coupons + share/WhatsApp; dropped pincode/shipping/offer chrome; Recommended for you (3).
- 2026-09-28 — Primary nav: Shop · New Arrival · Best sellers · About · Sale; Shop mega menu is five taxonomy columns (craft / design language / textiles / colours / occasions) with no featured panel; About content page restored.
- 2026-09-21 — Campaign slide 1 zooms right (scale 1.22 / 72% origin) and gains a stronger left linear gradient so cream type stays legible on the light wall.
- 2026-09-21 — Campaign hero veil shortened and lightened (~52% fade-out, 1.25px blur) so the image reads more clearly.
- 2026-09-21 — Campaign hero slide 1 image replaced with maroon Banarasi haveli portrait (`design-campaign-hero-maroon.jpg`).
- 2026-09-21 — Campaign Shop Now CTA bumped to 14px; removed the paisley pattern layer from the hero veil (blur gradient remains).
- 2026-09-16 — Account login overlay now uses a desktop horizontal split with the OTP form on the left and one editorial saree image on the right; mobile keeps the compact full-screen form sheet.
- 2026-09-16 — Account close control tightened to a 40px circle with a 20px icon; the mid-page USP ticker now uses 48–72px desktop gaps, 40px mobile gaps, and a faster 18s infinite loop.
- 2026-09-16 — Mobile Bag now opens as a full-width page panel with no backdrop or fixed drawer; desktop keeps the right-side bag drawer.
- 2026-09-16 — Search overlay cleanup: removed empty-state helper copy, kept the empty shell hidden until needed, and changed Clear recent searches to an un-underlined text control.
- 2026-09-16 — New Arrivals `Shop All` now sits below its product rail; Voices keeps the section heading centered while testimonial cards stay left-aligned on mobile.
- 2026-09-16 — Mobile `/design` rhythm pass: reduced the Ready-to-wear collection title to 22px; tightened Collection, Best Sellers, and Shop under bottoms; added 16px after New Arrivals; centered the Voices section while keeping its mobile content left-aligned.
- 2026-09-16 — Mobile `/design` feedback: Add to cart labels use `--text-xs`; RTW banner USPs and RTW/Clearance rails lose top padding; Voices header copy is left-aligned.
- 2026-09-16 — Softened the mobile collection-card bottom scrim to keep the pale printed-saree imagery visible while retaining title contrast.
- 2026-09-16 — Mobile collection tiles now hide Explore, anchor the title group at the bottom, and use a bottom-up linear scrim for clearer 2×2 cards.
- 2026-09-16 — Mobile `/design` feedback: Shop under tiles reduced to `min(56vw, 260px)`; all product rails stay two-up at 415px; Shop by Material is edge-to-edge with an inset; Shop by Collection is a 2×2 grid.
- 2026-09-16 — USP row became a 56px primary infinite ticker with cream icons/labels (replacing the static primary-50 grid).
- 2026-09-16 — New Arrivals panel chrome matched to Ready-to-wear (16px radius, primary-100, shared outer/inner padding); footer socials use Phosphor logos; removed Stay in touch column.
- 2026-09-16 — New Arrivals containerized: cream 24px outer gutters with an inset primary-100 panel (matching other section side frames).
- 2026-09-16 — New Arrivals highlight wash stepped to primary-100 with uniform 24px padding.
- 2026-09-16 — New Arrivals gets a primary-50 highlight wash; Save hearts fill solid when wishlisted; RTW and Clearance rails drop top padding; footer brand adds Connect with us social icon buttons above the newsletter.
- 2026-09-14 — Account overlay typography, logo, controls, and spacing reduced to the standard `/design` UI scale instead of the oversized reference-image scale.
- 2026-09-14 — Added a Samantha Fab account login overlay with OTP-first email entry, Google fallback, dimmed scrim, and focus-safe dismissal.
- 2026-09-14 — Removed the search overlay and search trigger from the wishlist route so `/design?route=wishlist` stays focused on saved items.
- 2026-09-14 — Search overlay simplified: removed Clear search controls and “Showing top products” helper copy, expanded the form to full width, and restored Karrik body/UI typography throughout.
- 2026-09-14 — Restored Karrik for body/UI copy while keeping Lora on headings, matching the original supporting-text typography.
- 2026-09-14 — Ready-to-wear banner now includes three compact product-specific USPs beneath its CTA, with line icons and reduced-motion-safe staggered motion.
- 2026-09-14 — Removed the divider above the RTW banner USPs and increased their top breathing room.
- 2026-09-14 — Removed the campaign title marker highlight; `<em>` accents now use only the existing Lora italic plum treatment.
- 2026-09-14 — Reference nav now removes the redundant Home link, makes the Samantha Fab wordmark the local `/design` home link, and gives campaign `<em>` accents a visible primary-200 marker highlight.
- 2026-09-14 — Typography unified on Google Fonts Lora: `--font-display` and `--font-body` now share Lora, with direct Sprat/Karrik overrides removed from `/design`.
- 2026-09-14 — Empty commerce states simplified: familiar heart/bag icons replace abstract artwork and collage; titles use sentence case; bag keeps one Continue shopping action with no helper tip or secondary link.
- 2026-09-14 — Bag drawer empty/filled polish: collage + bag badge empty state; × on line media, Save for later, sticky summary + trust line.
- 2026-09-14 — Empty wishlist: plum SVG illustration (no product photos), lighter copy, one sentence-case “Shop best sellers” CTA; tip removed.
- 2026-09-14 — Empty wishlist: editorial collage + frosted heart, clearer save guidance, dual CTAs (bestsellers / new arrivals).
- 2026-09-14 — Wishlist cards match New Arrivals 4-up scale with × cancel (not heart); commerce page top pad tightened to 20px.
- 2026-09-14 — Wishlist grid reuses commerce product cards (heart removes); bag is a right-side overlay drawer instead of a full page.
- 2026-09-14 — Wishlist heart fills on save with a quiet toast + nav count badge so the Save action reads as functional; clicks use document delegation.
- 2026-09-14 — Product-card desktop hover crossfades to an alternate archive image; Wishlist and Bag are real `/design` routes with localStorage prototype persistence (grid + bag summary), wired from nav and mobile tabs.
- 2026-09-13 — Collection PLP scroll: sticky filter sidebar with independent thin plum scrollbar; product grid scrolls with the page (no nested results pane).
- 2026-09-13 — Removed About from primary nav and dropped the `/design?route=page&slug=about` content page.
- 2026-09-13 — Collection filter sidebar refined: custom plum checkboxes, soft primary-50 wells, quieter counts, SVG chevrons — still whisper-cream/plum, not browser-default chrome.
- 2026-09-13 — Navbar + Shop mega menu: every primary/mega-menu link resolves in-playground (collection PLP or content page); no external Shopify collection hrefs on `/design` nav.
- 2026-09-13 — Collection PLP: reusable `/design?route=collection&slug=…` template with desktop sidebar filters and mobile Filters/Sort bottom sheets; homepage Shop All / occasion / footer shop links point into it.
- 2026-09-12 — Mega-menu link hover is scale-only (`1.03`); campaign title accents use deeper `--color-primary-400`; the paisley veil is darker, repeats at 280px, and fades out within the left 60% of the hero.
- 2026-09-12 — Campaign and feature-banner titles use one palette-native plum accent word per title; RTW/clearance share the skewed Sprat treatment, with `--color-primary-500` on light panels and `--color-primary-200` on dark media.
- 2026-09-11 — Campaign titles keep Sprat serif cream type, with one accent word per slide (`--color-primary-200`, `skewX(-12deg)` — Sprat variable face ignores italic alone).
- 2026-09-11 — Reference nav primary links now use an explicit centered grid cell; added the desktop wishlist action beside Search; increased the reference row's top padding by 8px while preserving mobile spacing.
- 2026-09-09 — Mobile shell: bottom tab bar, left category drawer, Explore search/trending/products, empty Wishlist/Bag; mobile header hamburger · logo · account.
- 2026-09-09 — Design reference nav top row slimmed to 88px with lighter vertical padding (mobile 64px).
- 2026-09-09 — Campaign hero gained a localized left-side blur veil and a low-contrast repeating paisley motif with a left-to-right gradient to support the left-aligned copy.
- 2026-09-09 — Corrected campaign hero copy to align left on desktop and return to centered alignment on mobile.
- 2026-09-07 — Active Shop by Material center card now uses a larger Sprat label (`clamp(24px, 2.2vw, 32px)`) while side-card labels retain the quieter scale.
- 2026-09-07 — Material carousel now uses repeated card sets with a hidden recenter point for a true seamless infinite loop; side cards gain graduated depth blur while the center card remains crisp.
- 2026-09-07 — Shop by Material now shows five items on desktop with a responsive three-item mobile fallback.
- 2026-09-07 — Shop under gained 32px desktop top breathing room; Shop by Material became a circular three-up center-mode carousel with 100/80/60 distance scaling, keyboard/arrow controls, and wrap-aware transitions that keep off-screen cards from sweeping across the background.
- 2026-09-07 — Collection bento captions now use an upper-left icon/title lead, supporting copy, and lower-left Explore action for more varied editorial text layout.
- 2026-09-07 — USP row icons switched to Lucide (banknote, refresh-cw, truck, message-circle).
- 2026-09-07 — Collection tile icons inset 4px from the left.
- 2026-09-07 — Collection left scrim darkened (~0.84 → transparent) for stronger caption contrast.
- 2026-09-07 — Collection tiles: removed “Starting with…” price lines; scrim switched to left linear fade for caption readability.
- 2026-09-07 — Product-rail Shop All CTA tightened to 16px above the button (was 32px).
- 2026-09-07 — USP row background set to primary-50 soft plum wash.
- 2026-09-07 — Mid-page USP row under New Arrivals: 4 static icon+label assurances (COD / returns / shipping / WhatsApp).
- 2026-09-07 — Site surfaces shifted from stark white to whisper cream `#fcfaf7` (`--color-white` / `--color-paper`).
- 2026-09-07 — Added occasion-specific Lucide line icons beside collection tile titles (Sunrise, Briefcase Business, Party Popper, Gem, Shirt); material cards remain icon-free.
- 2026-09-07 — Product rail details bumped to 7.75rem so discount badge + swatches are not clipped.
- 2026-09-07 — Discount “24% off” as primary filled badge (cream type); product cards +4px bottom pad.
- 2026-09-07 — New Arrivals bottom pad −24px; product rail details 6rem + content-fit cards; “24% off” price badges; footer newsletter copy/gap/Subscribe CTA.
- 2026-09-07 — Shop under +8px bottom pad + larger title→cards gap; clearance overlay copy wider (52ch); Voices header re-centered.
- 2026-09-07 — Removed generic section header icons from `/design`.
- 2026-09-07 — Bigger small CTA type (13px); generic section header icons; RTW/Clearance titles sentence case; Voices left-aligned; footer newsletter capture; Best sellers rail after New Arrivals.
- 2026-09-07 — RTW banner +12px vertical frame; clearance overlay +24px height + “Upto 50% off” badge; section titles uppercase; New Arrivals/RTW rail CTAs “Shop All”; clearance rail bottom pad 48/40.
- 2026-09-06 — `/design` section headers centered page-wide (Collection, New Arrivals, Materials, Shop under, Voices, Clearance overlay copy); product cards stay left-aligned.
- 2026-09-06 — Product rails: fixed viewport height (media 3/4 + 7.5rem details); removed wheel/touch scroll hacks; overflow-x only.
- 2026-09-06 — Product rails: keep overflow-y hidden, but drop pan-x/overscroll traps and forward vertical wheel to the page so hovering a rail still scrolls the document.
- 2026-09-06 — Product carousels (New Arrivals / RTW / Clearance) horizontal-only: viewport `overflow-y: hidden` + `touch-action: pan-x`.
- 2026-09-06 — Product price sits tight under the title (~6px body gap); removed meta `margin-top: auto` / flex-grow stretch that left a hole when colors were absent.
- 2026-09-06 — Product cards without colors reserve an empty 16px swatch slot so title→price no longer opens a larger gap than cards with swatches.
- 2026-09-06 — Footer trust icons 32×32 (stacked above 16px labels; strip width still locked to link columns).
- 2026-09-06 — Footer trust: 48×48 icons stacked above 16px labels; strip width matches link columns (grid-column under columns).
- 2026-09-06 — Footer denser 4 columns (23 links) + trust strip (COD/returns/shipping/WhatsApp) above copyright; still no payment logos/app badges/SEO clouds.
- 2026-09-06 — Initial skill from repeated `/design` page feedback (always/never, section defaults, micro nits).
- 2026-09-06 — Collection bento scrim softened with a taller, lower-opacity multi-stop fade to remove the harsh bottom band.
- 2026-09-06 — Product colors moved below the price line; Material scrims became slightly darker with 1.5px blur; Organza brightened; Collection and Shop under tiles grew; RTW title and campaign next-arrow chrome tightened.
- 2026-09-06 — Landed under `skills/samantha-fab-design/` because `.cursor/` writes were blocked by a broken pretool hook.
- 2026-09-06 — Voices feature after Shop under: featured portrait + circular thumb rail.
- 2026-09-06 — Voices featured portrait capped ~280px (not ~half stage); ≤900px ~240px.
- 2026-09-06 — Voices redesigned to horizontal card carousel (left portrait / right quote; ~2.5 cards peek; floating mid-rail arrows).
- 2026-09-06 — Added project hooks (sessionStart / beforeSubmitPrompt / preToolUse / afterFileEdit / stop) plus `tests/design-nits.test.mjs` to force skill load and lock key nits.
- 2026-09-06 — Voices redesigned to infinite horizontal ticker (wireframe cards; square media; quote above name; no arrows; pause + reduced-motion).
- 2026-09-06 — Voices ticker hover/focus slows to 20% speed (275s duration) instead of pausing.
- 2026-09-06 — Collection bento tiles borderless (radius kept); Shop under may keep cream hairline.
- 2026-09-06 — Shop by Material after Shop under / before Voices; Collection-like brand header on white.
- 2026-09-06 — Shop under tiles taller: min-height clamp(260px, 32vw, 380px).
- 2026-09-06 — Voices ticker hover via playbackRate 0.2 (fixed 55s — no duration swap / no snap).
- 2026-09-06 — Product-card details stretch to align price rows; campaign media resets inherited margins for full-bleed cover fill.
- 2026-09-06 — Material rail switched to six fabric-led textile images with low-set centered copy and no decorative SVG icon layer.
- 2026-09-06 — Material cards: blur+dark scrim (no linear ::after); remove Explore CTA; center label/subcopy; +12px section bottom pad; Voices top pad −24px.
- 2026-09-06 — Shop by Material nits: scrim blur 2px; label clamp(18px, 1.65vw, 24px); section padding 72/24/108 (mobile 56/16/96).
- 2026-09-06 — Materials padding 48px 24px 108px (mobile 40/16/96); clip path tip `.5 1`; defs overflow visible.
- 2026-09-06 — RTW banner white section + 24px frame; inner primary-100 radius 16px.
- 2026-09-06 — Section order: Shop by Material → Clearance sale → Voices.
- 2026-09-06 — Nits: Clearance sale placement/pattern; Material tile overflow visible with in-bounds clip path.
- 2026-09-06 — Shop under heading changed to sentence case; Material and Clearance section bottoms tightened to 72px desktop / 64px mobile.
- 2026-09-06 — Clearance: feature-banner above rail (banner title/CTA; View-all header OK); Materials header→grid gap 24px (mobile ~20px).
- 2026-09-06 — Clearance rail restored its own title and supporting copy so the product section remains self-describing below the feature banner.
- 2026-09-06 — Footer (Approach A): deeper plum surface hierarchy — fuller cream headings, quieter links, more padding, stronger bottom rule; nits Footer section.
- 2026-09-06 — Clearance banner: overlay layout (single festive image, deep plum + darker ink overlay gradient, cream type) — distinct from RTW collage/primary-100 — then product rail.
- 2026-09-06 — Clearance rail header removed (banner carries story; rail headerless like RTW products).
- 2026-09-06 — Clearance overlay scrim: darker ink overlay gradient (not soft plum top-fade).
- 2026-09-06 — Clearance overlay: cream-story media + lighter ink scrim ~0.12–0.55; Voices wider cards (260 / minmax 280–400) + quote weight 300; RTW banner title sentence case (no uppercase).
