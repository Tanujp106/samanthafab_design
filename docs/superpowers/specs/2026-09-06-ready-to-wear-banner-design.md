# Ready-to-Wear promo banner — `/design`

**Date:** 2026-09-06  
**Surface:** Samantha Fab playground `/design` (`blank` page)  
**Status:** Approved for implementation

## Goal

Add a flipped Instant-Saree-style promo banner after New Arrivals: text left, 4-cell image collage right, using Samantha Fab Ready-to-Wear voice and existing Sprat/Karrik + primary tokens.

## Placement

After `design-new-arrivals`, before footer.

## Content

| Role | Copy |
|------|------|
| Eyebrow | THE DRAPE, MADE EASY |
| Title | READY TO WEAR |
| CTA | Shop ready-to-wear → `/?route=ready-to-wear` |
| Subcopy | Pre-stitched sarees with pockets — easy on, easy all day. |

## Layout

- Desktop: two columns — copy ~40% (centered in column), collage ~60%
- Collage: tall left cell spanning two rows; top wide; two bottom cells; thin cream gutters
- Gutters aligned to campaign (24px section padding)
- Mobile: copy stacked above collage; collage grid collapses sensibly

## Visual

- Background: `var(--paper)` or soft cream
- Titles: Sprat Campaign, `var(--color-primary-800)`
- Subcopy: Karrik italic, muted
- CTA: existing filled button (primary), not generic black pill

## Images

Four placeholder editorial assets from `/assets` (replaceable later).

## Out of scope

- Instant Saree™ trademark copy
- Live Shopify image sync
- Carousel / interaction beyond the CTA link
