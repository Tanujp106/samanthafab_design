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
- **Sprat Campaign** for section/product titles (`font-variation-settings: "wght" 100, "wdth" 122`). **Karrik** for body/UI.
- Light-surface section titles: `--color-primary-800`. Lede/body: muted Karrik, weight 400 — not heavy.
- Side gutters **24px** so the white page frame shows; align nav to that width.
- Split editorial (media + copy): explicit **32–64px** column gap.
- Product/occasion tags: `Everyday` / `Work` / `Festive` / `Wedding` / `Ready-to-wear` — never “New”.
- Primary CTAs (`View all`, `Shop ready-to-wear`): filled primary button.
- Color swatches in the **price row** (right-aligned), not on image hover with Add to cart.
- Product-card details stretch to the shared rail row height so price rows align on the bottom edge; when colors exist, keep swatches beneath the price line in a vertical stack.
- Image scrims: long, low-opacity **linear bottom fade** (+ light blur if needed) for collection/bento tiles. Never a solid blur veil or a compressed dark band there. **Shop by Material** cards use a full-tile, lightly blurred dark scrim (no linear gradient).
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
| Campaign hero | 24px side padding on the section; full-bleed `cover` media; RTL slide (not fade); centered prev/next arrows |
| Shop by collection | Title + light lede → gap → taller 2+3 bento; bottom-left labels; long, slightly deeper soft linear scrim; top-align portraits that crop faces; borderless tiles (radius kept) |
| New Arrivals | White surface; Sprat/primary-800 titles; left-aligned cards; shared bottom-aligned price rows; tight eyebrow→title; View all = primary button |
| Ready-to-wear banner | White section + 24px side frame (like campaign); colored panel on inner with radius 16px; text left / collage right; cream gutters in collage; no decorative borders; CTA primary; title sentence case (`text-transform: none`); eyebrow may stay uppercase |
| RTW product rail | Headerless product cards OK; CTA may sit as rail footer; CTA brand primary (not black) |
| Shop under | Three image-backed price cards; cream hairline OK; taller tiles clamp(280px, 34vw, 420px); sentence-case Sprat heading (`Best on budget`) |
| Shop by Material | After Shop under / before Clearance banner; white surface; padding `48px 24px 72px` (mobile `40px 16px 64px`); Collection-like left header; header→grid gap ~24px (mobile ~20–24px); shaped clip-path tiles (path stays within 0–1); defs `overflow: visible`; fabric-led imagery; full-tile blur+dark scrim (no linear gradient / wash / Explore CTA); label+subcopy centered in tile; no decorative icons |
| Clearance sale | After Shop by Material / before Voices; **overlay** feature-banner (single warm cream-story image + deep plum/`primary-900` panel + lighter ink overlay gradient ~0.12–0.55 + cream type/CTA) — not RTW collage/`primary-100`; banner carries title/copy/CTA; rail is headerless (no title/copy/View all); sale + compareAt prices; bottom padding `72px` (mobile `64px`) |
| Voices feature | After Clearance sale (Clearance banner+rail after Shop by Material; Material after Shop under); infinite horizontal ticker of wireframe cards (square portrait left / larger lighter-weight quote top-right / name bottom-right; wider cards ~260 / minmax 280–400); no arrows; hover/focus slows via Web Animations `playbackRate` 0.2 (fixed 55s duration — no duration swap / no snap); Sprat/primary-800 title; no star ratings; section padding `56px 0 80px` (mobile top −24px similarly) |
| Footer | Plum primary; cream inverted logo; brand + denser 4 columns + stacked trust strip (32px icons over 16px labels, width locked to link columns) + copyright; full cream headings; quieter links; deeper padding; stronger bottom rule; no payment logos/app badges/SEO clouds |

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
