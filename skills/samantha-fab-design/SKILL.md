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
- **Sprat Campaign** for section/product titles (`font-variation-settings: "wght" 100, "wdth" 122`). **Karrik** for body/UI.
- Light-surface section titles: `--color-primary-800`, **uppercase** (`text-transform: uppercase`), centered with their ledes across `/design` section headers. Lede/body: muted Karrik, weight 400 — not heavy.
- Side gutters **24px** so the light cream page frame shows; align nav to that width.
- Split editorial (media + copy): explicit **32–64px** column gap.
- Product/occasion tags: `Everyday` / `Work` / `Festive` / `Wedding` / `Ready-to-wear` — never “New”.
- Primary CTAs (`View all`, `Shop ready-to-wear`): filled primary button.
- Collection tiles may use one occasion-specific Lucide line icon in a vertically distributed editorial caption; keep it quiet, current-color, and free of enclosing badges or circles. The icon/title leads from the upper-left; a small Explore text action anchors lower-left. No “Starting with…” price sublines.
- Color swatches in the **price row** (right-aligned), not on image hover with Add to cart.
- Product-card details stack tightly (tag → name → price ~6px); do not push price to the bottom with `margin-top: auto` — that opens a large title→price gap on cards without colors. When colors exist, keep swatches beneath the price line.
- Image scrims: long, low-opacity **linear left fade** (+ light blur if needed) for collection/bento tiles so left captions stay readable. Never a solid blur veil or a compressed dark band there. **Shop by Material** cards use a full-tile, lightly blurred dark scrim (no linear gradient).
- Annotations / review chrome: only with `?notes=1`. Keep default `/design` clean.
- Editorial geometry: hairline gaps, restrained radius, varied section rhythm, real or replaceable photos.
- Material cards use direct textile imagery and editorial copy, not symbolic iconography.

## Never

- Rounded-card / gradient-heavy / purple-glow “AI slop”.
- Heavy Sprat display weights; italic RTW banner body unless explicitly requested.
- Decorative borders on feature/RTW banners.
- Wishlist hover borders; material lines under product cards.
- Nesting sticky nav inside a short header wrapper (breaks sticky).
- Major image-led Saree Library block — keep guides as a quiet post-sale strip.
- Inventing a second product catalog or a framework; extend `blank.js` + shared renderers.

## Section defaults

| Section | Defaults |
| --- | --- |
| Campaign hero | 24px side padding on the section; full-bleed `cover` media; RTL slide (not fade); left-aligned desktop copy with a localized translucent blur veil and quiet textile pattern; centered mobile fallback; centered prev/next arrows |
| Shop by collection | Centered title + light lede → gap → taller 2+3 bento; vertically distributed icon/title/Explore captions (no “Starting with…” price lines); soft **left** linear scrim; top-align portraits; borderless tiles |
| New Arrivals | Light cream surface; Sprat/primary-800 uppercase titles; centered header + Shop All; left-aligned product cards; Shop All primary button 13px; fixed-height horizontal rail; section pad bottom 72px (mobile 64px); product details `--product-rail-details: 7.75rem` (fits badge + swatches); price line shows “24% off” badge |
| USP row | After New Arrivals / before Best sellers; 4 static items; Lucide line icons (banknote / refresh-cw / truck / message-circle) above labels; no section title; **primary-50** wash; 4-col desktop / 2-col mobile |
| Best sellers | Same product-carousel as New Arrivals; after USP row / before RTW banner; Shop All CTA |
| Ready-to-wear banner | Light cream section + 36px/24px frame; primary-100 inner radius 16px; collage right; title sentence case; CTA primary 13px |
| RTW product rail | Headerless; CTA “Shop All” 13px; brand primary |
| Shop under | Centered uppercase heading; title→cards gap 40px (mobile 32px); section pad `48px 24px 88px` (mobile `16px 16px 80px`); three image price tiles clamp(280px, 34vw, 420px) |
| Shop by Material | After Shop under / before Clearance; light cream; padding 48/24/72; centered uppercase header; shaped fabric tiles in an infinite circular center-mode 5-up carousel on desktop (100% active / 80% adjacent / 60% distance-2; 3-up mobile fallback); depth blur on side cards; keyboard + arrow controls; blur+dark scrim; no Explore CTA |
| Clearance sale | After Material / before Voices; overlay banner (cream story image, primary-900, lighter scrim, sentence-case title, Upto 50% off badge); headerless rail; bottom pad 48/40 |
| Voices feature | After Clearance; centered header; infinite ticker cards; playbackRate hover 0.2; padding 56/0/80 |
| Footer | Plum; brand + newsletter (“Join our newsletter for new drops” / Subscribe); denser columns + trust strip; no payment logos |

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

## Changelog

- 2026-09-09 — Design reference nav top row slimmed to 88px with lighter vertical padding (mobile 64px).
- 2026-09-09 — Campaign hero gained a localized left-side blur veil and subtle textile pattern to support the left-aligned copy.
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
