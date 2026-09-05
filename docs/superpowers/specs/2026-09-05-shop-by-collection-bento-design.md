# Shop by Collection — `/design` bento section

**Date:** 2026-09-05  
**Surface:** Samantha Fab playground `/design` (`blank` page)  
**Status:** Draft for review

## Goal

Add an edge-to-edge **Shop by collection** section directly under the campaign hero: five occasion tiles in a 2+3 bento, image-led, with bottom-left labels and a soft bottom scrim for legibility.

## Content

| Tile | Label | Image (placeholder for now) |
|------|--------|-----------------------------|
| 1 | Everyday | `occasion-everyday.jpg` |
| 2 | Work | `occasion-work.jpg` |
| 3 | Festive | `occasion-festive.jpg` |
| 4 | Wedding | `occasion-wedding.jpg` |
| 5 | Ready-to-wear | `occasion-rtw.jpg` |

Each tile is a link into a shop route (e.g. `/?route=everyday`). No review/annotation chrome on the live route.

## Layout

- **Placement:** After campaign hero, before footer.
- **Structure:** Two rows
  - Row 1: two equal columns
  - Row 2: three equal columns
- **Bleed:** Full viewport width (edge-to-edge). No section title, no page padding around the grid.
- **Gaps:** Hairline (~2–4px) between tiles so cells read as a grid without becoming a card collage.
- **Mobile:** Collapse to a single column (or 2 then stack) so every tile stays tall enough to tap; keep bottom-left label treatment.

## Tile anatomy

1. **Background image** — fills the cell (`object-fit: cover`, centered crop).
2. **Bottom scrim** — linear darkening from transparent → soft ink at the bottom (legibility), not a heavy blur veil.
3. **Label** — collection name, bottom-left, cream, quiet UI type (Karrik), no extra badges.

## Motion (light)

- Optional subtle hover: slight image scale (~1.03) with ease-out; respect `prefers-reduced-motion`.
- No staggered entrance that can leave tiles blank if transitions fail.

## Implementation notes

- New section type on `blank` (e.g. `collection-bento`) in page data + renderer.
- Styles scoped under `body[data-page="blank"]` in `design.css`.
- Reuse existing occasion assets; swap later without layout changes.

## Out of scope

- Real merchandising / CMS wiring
- Uneven column widths
- Section heading / intro copy
- Filter or “view all” controls

## Success criteria

- Five occasion tiles visible in a clear 2+3 bento on desktop.
- Labels readable on varied photos via bottom scrim.
- Feels continuous with the campaign hero (edge-to-edge, image-first).
- Mobile remains usable without horizontal overflow.
