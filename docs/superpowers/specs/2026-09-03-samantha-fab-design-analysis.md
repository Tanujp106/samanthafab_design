---
version: alpha
name: Samantha-Fab-design-analysis
description: An editorial textile atelier interface that turns fashion commerce into a calm magazine scroll. Paper and cream canvases carry Newsreader display headlines with soft negative tracking, while a single Rust accent (#a4513e) marks action. UI chrome stays quiet — hairline rules, rectangular controls, no decorative gradients, no card shadows — so photography and product can speak.
source: playground/styles/tokens.css, layout.css, homepage.css; playground/CURSOR_BUILD_SPEC.md
surfaces_analyzed: homepage (utility + nav, campaign hero, occasion, new arrivals, ready-to-wear, shop by price, why Samantha, made for real life, worn by real women, stylist service, last chance, saree library, footer); review/notes mode

colors:
  paper: "#f4f0e9"
  paper-deep: "#ebe3d9"
  cream: "#fcf9f3"
  ink: "#242021"
  ink-soft: "#51494a"
  muted: "#766f6a"
  rule: "#d4cbc1"
  rule-dark: "#a69a91"
  rust: "#a4513e"
  rust-soft: "#d6a090"
  indigo: "#31465b"
  moss: "#6e7b6b"
  ochre: "#b69158"
  white: "#ffffff"
  on-dark: "#fcf9f3"
  on-rust: "#fcf9f3"
  on-accent-muted: "rgba(252, 249, 243, 0.72)"
  annotation-bg: "#f3ebcf"
  annotation-line: "#c4a56f"
  annotation-label: "#7a6418"

typography:
  hero-display:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(60px, 7vw, 108px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.03em
  hero-display-mobile:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(48px, 15vw, 72px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.03em
  display-section:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(32px, 4vw, 44px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.02em
  display-section-mobile:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: 38px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.02em
  display-price:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.03em
  display-tile:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0
  display-quote:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(22px, 2.4vw, 30px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-product:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  wordmark:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(22px, 2.2vw, 28px)"
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.02em
  lead:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-soft:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  ui-strong:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  ui:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  eyebrow:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.06em
    textTransform: uppercase
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  fine-print:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  utility-strip:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.02em

rounded:
  none: 0px
  media: 3px
  control: 4px

spacing:
  xxs: 6px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 28px
  xxl: 32px
  rail: "clamp(40px, 5vw, 64px)"
  stack: "clamp(20px, 2.5vw, 32px)"
  copy-inset: "clamp(28px, 4vw, 64px)"
  section: "clamp(72px, 9vw, 144px)"
  section-compact: "clamp(48px, 6vw, 80px)"
  page-pad: "clamp(20px, 5vw, 80px)"
  grid-gap: "clamp(20px, 2.5vw, 40px)"

shadows:
  none: "none"
  product-lift: "none — elevation via scale(1.02) on media hover only"

components:
  utility-strip:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
    typography: "{typography.utility-strip}"
    height: 36px
  primary-nav:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    height: 72px
    borderBottom: "1px solid {colors.rule}"
  wordmark:
    textColor: "{colors.ink}"
    typography: "{typography.wordmark}"
  button-fill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.ui-strong}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    minHeight: 48px
  button-fill-hover:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    border: "1px solid {colors.cream}"
    rounded: "{rounded.control}"
  button-on-dark:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.cream}"
    rounded: "{rounded.control}"
  text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    borderBottom: "1px solid currentColor"
  text-link-hover:
    textColor: "{colors.rust}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    borderBottom: "1px solid rgba(252, 249, 243, 0.55)"
  section-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.display-section}"
    rounded: "{rounded.none}"
    padding: "{spacing.section}"
  section-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  section-paper-deep:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  section-indigo:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
  section-rust:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
  section-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
  occasion-tile:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.display-tile}"
    rounded: "{rounded.none}"
  product-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.display-product}"
    rounded: "{rounded.none}"
  price-panel:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.rule}"
    rounded: "{rounded.none}"
    padding: "clamp(28px, 3vw, 36px)"
    minHeight: 280px
  price-panel-moss:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.cream}"
  price-panel-ochre:
    backgroundColor: "{colors.ochre}"
    textColor: "{colors.cream}"
  benefit-item:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    borderRight: "1px solid {colors.rule}"
  proof-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.display-quote}"
  library-quiet:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.ui}"
    padding: "clamp(28px, 4vw, 44px)"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-accent-muted}"
    typography: "{typography.caption}"
    padding: "clamp(56px, 8vw, 96px) 40px"
  annotation:
    backgroundColor: "{colors.annotation-bg}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.annotation-line}"
  media-fallback:
    backgroundColor: "{colors.paper-deep}"
    tones: ["rust", "indigo", "moss", "ochre", "paper", "ink"]
  focus-ring:
    outline: "2px solid {colors.rust}"
    outlineOffset: 3px
---

## Overview

Samantha Fab’s web presence is an **editorial textile atelier framed by near-invisible UI**. Every page is a continuous paper canvas — alternating paper, cream, and paper-deep bands, punctuated by a single indigo service panel and a late rust sale strip. Each section centers on a Newsreader headline, a short Inter lead, one clear route into the collection, and photography that feels worn-in rather than staged-luxury. Nothing competes with the product. Typography is confident but quiet; color is either warm paper, cream, or a deep ink/indigo block; interactive elements converge on a single Rust accent.

Density is deliberately low for fashion commerce. Sections breathe with `clamp(72px, 9vw, 144px)` vertical padding. There is no decorative chrome — no gradients, no glassmorphism, no floating rounded cards, no shadows on UI. Rhythm comes from surface change (paper ↔ cream ↔ paper-deep) and 1px hairline rules (`{colors.rule}`). The only “lift” allowed is a micro `scale(1.02)` on product/occasion media hover — and sticky navigation. The result feels like a considered magazine scroll that happens to sell sarees: the wall disappears and the textile takes over.

Store-adjacent surfaces (price panels, product rails, library strip) keep the same chassis but switch volume. Price panels introduce flat tonal rectangles with a thin border and large Newsreader numerals. The stylist service section leans indigo and cream. Sale arrives late as a compact rust band. Across all homepage sections the type system, spacing rhythm, and single rust accent stay consistent — one design language at different volumes.

**Key Characteristics:**
- Photography-first editorial presentation; UI recedes so textile and wearer can speak.
- Alternating full-width section bands: paper / cream / paper-deep, with hairline rules as dividers; indigo and rust reserved for service and sale.
- Single action accent (`{colors.rust}` — #a4513e) carries hover, focus, utility strip, and sale. No second brand action color.
- Two button grammars: filled rectangular CTAs (`{rounded.control}` 4px) and underlined text links with a trailing arrow.
- Newsreader (display) + Inter (UI/body) — soft negative letter-spacing at display sizes for an editorial tight feel.
- No drop-shadows in the system. Elevation is surface change + sticky nav + micro media scale.
- Two-row chrome: rust `{component.utility-strip}` (scrolls away) + cream `{component.primary-nav}` (sticks).
- Section rhythm: desire (hero) → browse (occasion / products / price) → story & proof → human help → quiet library → late sale → ink footer.

## Colors

> **Source surfaces analyzed:** homepage (all 13 section types), sticky nav, review/notes mode. Color tokens live in `playground/styles/tokens.css` and are identical across the playground; only the surface-mode mix differs per section.

### Brand & Accent
- **Rust** (`{colors.rust}` — #a4513e): The single brand-level interactive and emphasis color. Utility strip fill, hover on text links and nav, focus ring root, sale section canvas, primary-button hover destination. Quiet but universal “this matters / click me” signal.
- **Rust Soft** (`{colors.rust-soft}` — #d6a090): Reserved sibling for softer editorial accents or image fallback warmth — not used as a second action color.
- **Focus Rust**: Focus ring is `2px solid {colors.rust}` with 3px offset (`{component.focus-ring}`). Same hex as the action accent; no separate focus blue.

### Surface
- **Paper** (`{colors.paper}` — #f4f0e9): The dominant page canvas. Default `body` and `.site` background. Warm, tactile, textile-adjacent.
- **Paper Deep** (`{colors.paper-deep}` — #ebe3d9): One step deeper — story section, quiet library strip, price panel (paper variant), media fallback default. Creates rhythm without leaving the warm family.
- **Cream** (`{colors.cream}` — #fcf9f3): Near-white light surface. Sticky nav, product rails, proof section, text on dark/indigo/rust blocks. Reads as “open air” against paper.
- **Indigo** (`{colors.indigo}` — #31465b): Editorial dark for the stylist/service invitation. Also a media-fallback tone.
- **Moss** (`{colors.moss}` — #6e7b6b) / **Ochre** (`{colors.ochre}` — #b69158): Flat tonal accents for price panels and media fallbacks — never as a second interactive brand color.
- **Ink** (`{colors.ink}` — #242021): Near-black for text, filled buttons, footer canvas. Chosen instead of pure black so the page stays photographic/textile rather than printed-newspaper hard.
- **White** (`{colors.white}` — #ffffff): Available token; cream is preferred for “light on dark” and open surfaces so the system stays warm.

### Text
- **Ink** (`{colors.ink}` — #242021): Headlines, body on light surfaces, filled button fill.
- **Ink Soft** (`{colors.ink-soft}` — #51494a): Supporting body and section copy on paper/cream.
- **Muted** (`{colors.muted}` — #766f6a): Eyebrows, captions, material lines, benefit indices — supporting text only.
- **Cream / On-Dark** (`{colors.cream}`): All text on indigo, rust, and ink blocks.
- **On-Accent Muted** (`{colors.on-accent-muted}` — rgba(252, 249, 243, 0.72)): Secondary copy on dark/indigo/rust (eyebrows, footer links, soft lead).

### Hairlines & Borders
- **Rule** (`{colors.rule}` — #d4cbc1): Default 1px dividers, nav bottom border, occasion tile baselines, benefit columns, price panel borders.
- **Rule Dark** (`{colors.rule-dark}` — #a69a91): Hover/emphasis border on price panels.

### Annotation (review mode only)
- **Annotation BG** (`{colors.annotation-bg}` — #f3ebcf), **Line** (`{colors.annotation-line}`), **Label** (`{colors.annotation-label}`): Yellow-note review chrome, visible only with `?notes=1`. Never part of the client-facing palette.

### Brand Gradient
**No decorative gradients.** Atmosphere comes from photography and flat tonal media fallbacks (`rust`, `indigo`, `moss`, `ochre`, `paper`, `ink`). A subtle SVG noise grain may sit on fallback media for textile tactility — it is texture, not a CSS gradient token.

## Typography

### Font Family
- **Display / editorial**: `Newsreader, Georgia, "Times New Roman", serif` — voice of hero, section titles, product names, quotes, wordmark, price numerals, footer headings.
- **Body / UI**: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — utility strip, nav, labels, buttons, links, body copy, annotations.
- Loaded from Google Fonts when the environment can reach it; local/system fallbacks always present.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | clamp(60px, 7vw, 108px) | 500 | 0.95 | -0.03em | Campaign hero headline |
| `{typography.hero-display-mobile}` | clamp(48px, 15vw, 72px) | 500 | 0.95 | -0.03em | Hero at ≤900px |
| `{typography.display-section}` | clamp(32px, 4vw, 44px) | 500 | 1.05 | -0.02em | Section H2 titles |
| `{typography.display-section-mobile}` | 38px | 500 | 1.05 | -0.02em | Section titles at ≤768px |
| `{typography.display-price}` | clamp(40px, 5vw, 64px) | 500 | 0.95 | -0.03em | Shop-by-price numerals |
| `{typography.display-tile}` | 28px | 500 | 1.1 | 0 | Occasion tile titles |
| `{typography.display-quote}` | clamp(22px, 2.4vw, 30px) | 500 | 1.15 | -0.02em | Proof / UGC quotes |
| `{typography.display-product}` | 18px | 500 | 1.2 | 0 | Product names |
| `{typography.wordmark}` | clamp(22px, 2.2vw, 28px) | 600 | 1.0 | -0.02em | SAMANTHA FAB mark |
| `{typography.lead}` | 18px | 400 | 1.55 | 0 | Hero body |
| `{typography.body}` | 15px | 400 | 1.55 | 0 | Default paragraph |
| `{typography.body-soft}` | 15px | 400 | 1.65 | 0 | Section supporting copy |
| `{typography.ui-strong}` | 13px | 600 | 1.3 | 0 | Buttons, price CTAs, bag emphasis |
| `{typography.ui}` | 13px | 500 | 1.3 | 0 | Nav, text links, meta |
| `{typography.eyebrow}` | 11px | 600 | 1.2 | 0.06em | Uppercase section labels |
| `{typography.caption}` | 13px | 400 | 1.5 | 0 | Captions, footer links |
| `{typography.fine-print}` | 11px | 400 | 1.4 | 0 | Copyright, utility |
| `{typography.utility-strip}` | 11px | 500 | 1.2 | 0.02em | Trust messages in rust bar |

### Principles

- **Sentence case for headlines.** Display copy is readable English, not shouty title case. Eyebrows are the only systematic uppercase.
- **Weight 500 for display, not 700.** Newsreader headlines sit at 500. Wordmark alone uses 600. Inter UI uses 500/600; 700 is reserved for review annotation labels.
- **Soft negative tracking at display sizes.** Hero and section titles use `-0.02em` to `-0.03em`. Do not use letter-spacing as a substitute for hierarchy on body/UI.
- **Body at 15px / 1.55–1.65.** Editorial leading; section copy max-width ~42ch so measure stays magazine-like.
- **At most three text sizes inside one component.**
- **Eyebrows are sparse.** Small uppercase labels introduce sections; they must not become a second headline system.

### Note on Font Substitutes
Newsreader and Inter are already open-source (Google Fonts). If fonts fail to load:
- Display fallback: `Georgia, "Times New Roman", serif`
- Body fallback: `ui-sans-serif, system-ui, sans-serif`
Do not swap in a third display face. Do not use decorative Indic display fonts for English UI chrome.

## Layout

### Spacing System
- **Structural rhythm** snaps to clamp-based tokens rather than a rigid 8px grid, but sub-values (6, 8, 12, 16, 18, 20, 24, 28, 32) appear in component padding.
- **Tokens:** `{spacing.page-pad}` · `{spacing.grid-gap}` · `{spacing.section}` · `{spacing.section-compact}` · `{spacing.rail}` · `{spacing.stack}` · `{spacing.copy-inset}`.
- **Section vertical padding:** `{spacing.section}` on most bands; compact/sale/library use tighter clamps.
- **Split editorial gap:** `{spacing.copy-inset}` — minimum 28px, typically 32–64px between media and copy columns. Do not collapse this.
- **Content max:** `{--content-max}` 1440px. Margins absorb extra width on wide desktop.

### Grid & Container
- **Desktop:** 12-column editorial grid (`.grid-12`).
- **Tablet (≤1024px):** 8 columns.
- **Mobile (≤768px):** single column.
- **Column patterns in use:**
  - Hero: 7/5 media/copy
  - Split / ready-to-wear: 6/6
  - Story: 5/7 copy/media
  - Service: 7/5 copy/media
  - Occasion: 5 equal tiles
  - Products: 4 equal cards
  - Price: 3 equal panels
  - Benefits: 4 columns with hairline dividers
  - Proof: 1.2fr + 1fr + 1fr (feature + two supports)
  - Footer: brand + 4 link columns

### Whitespace Philosophy
Whitespace is the textile’s pedestal. Sections open with generous air above the eyebrow/title stack. Product renders are never crowded into floating cards. The quiet library strip and footer are the denser moments — library deliberately underplayed; footer packs trust IA without becoming a wall of chips.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no card chrome | Default page, sections, product cards, occasion tiles |
| Soft hairline | 1px `{colors.rule}` | Nav bottom, section bottoms, benefit columns, price panels, occasion baselines |
| Sticky surface | Cream fill, z-index 40 | Primary nav while sticky |
| Media hover lift | `transform: scale(1.02)` | Product and occasion imagery only |

**Shadow philosophy.** Samantha Fab uses **zero drop-shadows**. Hierarchy comes from (a) surface-color change, (b) hairline rules, (c) sticky nav, (d) micro media scale. Do not invent card shadows “for polish.”

### Decorative Depth
- **Photography and tonal fallbacks** supply mood.
- **Hairline section bottoms** create rhythm without borders-as-boxes.
- **Rust utility strip** is the only always-on brand-color band above the fold; it scrolls away so the editorial canvas can breathe.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Sections, price panels, benefit cells, footer — edge-to-edge editorial geometry |
| `{rounded.media}` | 3px | Image/video crops only — whisper soft, not “card” |
| `{rounded.control}` | 4px | Buttons, menu toggle — functional, not pill |

**No pills.** Primary CTAs are rectangular. Search/account/bag are text actions, not circular chips. Do not introduce `{rounded.pill}` or 9999px radii.

### Photography Geometry
- **Hero:** portrait-leaning crop (~4/5), min-height ~520px on desktop; fills the 7-col media cell.
- **Occasion / product:** ~3/4 portrait; slight crop variation on alternate occasion tiles allowed.
- **Proof feature:** 4/5; supporting proofs 1/1.
- **Service media:** 4/5 desktop, 5/4 when stacked.
- **Fallback media:** flat tone + optional grain; preserve aspect ratio; no “IMAGE SLOT” copy in default view.
- Media objects carry `src`, `alt`, `tone`, `position`, optional `note` (notes mode only).

## Components

### Top Navigation

**`utility-strip`** — Trust bar above the sticky header. Background `{colors.rust}`, text `{colors.cream}` in `{typography.utility-strip}`, min-height 36px, centered messages (~20–48px gap). Scrolls away with the page. Content: COD, returns, WhatsApp assistance.

**`primary-nav`** — Sticky cream bar. Height ~72px, 1px `{colors.rule}` bottom border. Three-zone grid: wordmark | centered nav links | Search / Account / Bag. Links and actions in `{typography.ui}` (13px / 500). Hover turns rust with underline. At ≤900px, center links collapse behind a Menu toggle (`{rounded.control}`, rule border).

**`wordmark`** — `SAMANTHA FAB` in Newsreader 600, not a letterspaced logo mark. Cream on footer ink; ink on paper/cream.

### Buttons & Links

**`button-fill`** — Primary rectangular CTA. Background `{colors.ink}`, text `{colors.cream}`, `{typography.ui-strong}`, `{rounded.control}`, min-height 48px, padding 0 24px, 1px ink border. Hover → `{colors.rust}` fill and border.

**`button-ghost`** — On indigo/rust: transparent with cream border; hover fills cream / ink text.

**`button-on-dark`** — Cream fill on dark service panels; hover inverts to ghost.

**`text-link`** — Underlined ink link + `→` arrow. Hover: rust + arrow nudge (~3px). Default commerce secondary action.

**`text-link-on-dark`** — Cream variant for indigo/rust sections; border softens to ~55% cream alpha.

### Sections & Containers

**`section-paper` / `section-cream` / `section-paper-deep`** — Full-width editorial bands. No corner rounding. Vertical padding `{spacing.section}` (or compact variants). Hairline bottom rule. The color change IS the divider.

**`section-indigo`** — Stylist/service invitation. Cream type, optional media, filled cream CTA + text link. Feels like a service moment, not a support footer.

**`section-rust`** — Last-chance / sale. Compact padding. Cream type. Optional sale product rail. Appears late; never in the hero.

**`section-ink`** — Footer. Cream wordmark, muted cream links, four columns + copyright row.

**`occasion-tile`** — Editorial image + Newsreader title + “Shop now” baseline with hairline. Not a floating card. Hover scales media 1.02 and rusts the link.

**`product-card`** — Borderless 3:4 media, optional `NEW` eyebrow, Newsreader name, material + price meta. No shadow. Hover scales media only.

**`price-panel`** — Equal tonal rectangles (paper-deep / moss / ochre), thin rule border, large Newsreader price numeral, underlined Explore CTA. Same visual weight across all three. No discount stickers.

**`benefit-item`** — Numbered magazine cells separated by hairlines. Large Newsreader title + short Inter explanation. No icons-as-default.

**`proof-card`** — Feature + support UGC layout. Newsreader quotes. Links back toward product when real. No fake star ratings.

**`library-quiet`** — Deliberately underplayed post-sale educational strip on paper-deep. Small Inter title + inline text links. Not a blog grid.

### Media

**`media`** — Shared renderer. Supports image, muted video, flat tone fallback, alt, caption, notes-only replacement note. Ratios: portrait, square, landscape, wide, hero, fill. `object-fit: cover`; `object-position` from data.

### Review / Annotation

**`annotation`** — Yellow-note chrome for `?notes=1` only. Section number, name, rationale. Default `/` must stay clean.

## Do's and Don'ts

### Do
- Use `{colors.rust}` as the single interactive accent — hover, focus, utility, sale emphasis.
- Set headlines in Newsreader at weight 500 with soft negative tracking.
- Alternate paper / cream / paper-deep for section rhythm; use indigo for service and rust for late sale only.
- Prefer underlined text links + one rectangular primary button over pill clusters.
- Apply media `scale(1.02)` hover only to imagery — never invent card shadows.
- Keep sticky nav cream with a hairline; let the rust utility strip scroll away.
- Preserve homepage section `id` values for Shopify handoff (`utility-navigation`, `campaign-hero`, … `footer`).
- Keep split editorial column gaps at ≥32–64px via `{spacing.copy-inset}`.

### Don't
- Don’t introduce a second action color (no blue CTAs, no multi-accent rainbow).
- Don’t add drop-shadows to cards, buttons, or text.
- Don’t use decorative gradients, glassmorphism, blobs, or floating rounded section cards.
- Don’t use pill buttons (`border-radius: 9999px`) — controls stay `{rounded.control}` (4px).
- Don’t put sale language in the hero or utility strip.
- Don’t show `[ IMAGE ]`, `MEDIA SLOT`, or implementation copy in the default client view.
- Don’t make every section the same height, background, or card treatment.
- Don’t use emoji icons or fake star ratings as social proof.
- Don’t tighten body leading below ~1.55 or pack five product miniatures onto mobile.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | ≤768px | Single-column grid; section titles → 38px; page pad 20px; tighter section pad |
| Nav collapse | ≤900px | Primary links → Menu toggle; hero/split/story/service stack; price → 1 col; footer → 2 col link grid |
| Tablet | ≤1024px | 8-column base grid |
| Compact editorial | ≤1100px | Occasion → 3 col; products → 2 col; benefits → 2×2; proof feature spans full |
| Desktop | 1101–1440px | Full layout; 5 occasion / 4 product / 3 price / 4 benefit |
| Wide | ≥1441px | Content locks at 1440px; margins absorb width |

Structural breakpoints that matter for agents: **1440** (content lock), **1100** (rail reflow), **1024** (8-col), **900** (nav + stack), **768** (phone type/pad).

### Touch Targets
- Filled buttons min-height 48px.
- Menu toggle min-height 40px.
- Nav text actions should remain easy to tap; hamburger replaces the link row at ≤900px.

### Collapsing Strategy
- **Utility strip:** may reduce to fewer messages or horizontal scroll; never overflow the viewport.
- **Primary nav:** full three-zone → wordmark + Menu + actions.
- **Hero / splits:** 12-col asymmetric → stacked media-then-copy; media becomes relative with 4/5 crop.
- **Rails:** occasion 5→3→scroll/stack; products 4→2→1; price 3→1; benefits 4→2; proof feature-first.
- **Library quiet:** wraps to stacked lead + links.
- **Hero type:** `{typography.hero-display}` → `{typography.hero-display-mobile}`.

### Image Behavior
- Shared media renderer; eager load above-fold hero; lazy elsewhere when added.
- Fallbacks keep assigned tone and ratio when `src` is missing.
- Concept photography is replaceable local assets — not claimed as customers.

## Iteration Guide

1. Focus on ONE component or section `type` at a time (`hero`, `occasion`, `products`, `split`, `price`, `story`, `benefits`, `proof`, `service`, `library`, `sale`, `footer`).
2. Reference tokens with `{token.refs}` — prefer CSS variables already in `tokens.css` over new hex.
3. Document default and pressed/hover where the system already defines them; do not invent hover documentation for surfaces that stay flat.
4. Display stays Newsreader 500; body/UI stays Inter. The boundary is unbreakable.
5. Zero drop-shadows. When in doubt about emphasis: change surface (paper → cream → paper-deep → indigo/rust) before adding chrome.
6. Preserve section `id` / `type` keys — they are the Shopify mapping contract.
7. Client view stays clean; annotations only behind `?notes=1`.

## Known Gaps

- Shop, collection, and product pages are not yet built; this analysis covers the homepage chassis and shared tokens that later pages must reuse.
- Form validation / search overlay states are not surfaced (Search is a route placeholder).
- Exact mobile menu animation beyond open/close class toggle is minimal by design.
- Real customer UGC and final campaign photography are still replaceable concept assets; notes mode carries replacement instructions.
- Dark-mode counterparts for paper/cream commerce surfaces are not defined — the shipped system is the warm light-dominant atelier.
- Cart, account, and checkout are visual only in this playground; Shopify remains the store of truth.
- Backdrop-filter / frosted glass is intentionally absent — do not “upgrade” sticky nav with blur.
- Weight 700 Inter appears only in review annotation labels; it is not part of the client type ladder.
