# Shop under — `/design`

**Date:** 2026-09-06  
**Surface:** Samantha Fab playground `/design` (`blank` page)  
**Status:** Approved for implementation

## Goal

Add a price-band discovery section with three image-backed cards so shoppers can jump into Shop under ₹999, ₹1,999, and ₹2,999 without another product rail.

## Placement

After `design-ready-to-wear-products`, before the footer.

## Content

| Role | Copy |
|------|------|
| Section title | Shop under |
| Card 1 | Shop under ₹999 → `/?route=shop-under-999` |
| Card 2 | Shop under ₹1,999 → `/?route=shop-under-1999` |
| Card 3 | Shop under ₹2,999 → `/?route=shop-under-2999` |

No card subcopy, badges, or product lists.

## Layout

- Desktop: equal three-column row inside the content max width; 24px section padding; gutters aligned to sibling `/design` sections
- Each card: full-bleed background image, soft bottom scrim, foreground title only (bottom-left)
- Mobile: single column stack

## Visual

- Section title: Sprat Campaign, `var(--color-primary-800)`, weight 400 / variation settings matching Collection and New Arrivals
- Card titles: Sprat Campaign on light type over the scrim (cream / near-white)
- Cards: restrained editorial treatment like Collection tiles — cover image, soft bottom scrim, light border if needed; no heavy shadows, gradient chrome, or pill clusters
- White or quiet paper section surface so the images carry the atmosphere

## Images

Three replaceable editorial assets from `/assets` (reuse existing collection/product photography as placeholders).

## Implementation sketch

- New section type (e.g. `price-band` / `shop-under`) in `blank.js`
- Renderer case + styles scoped to `body[data-page="blank"]`
- Final visual surface only — no review scaffolding on the rendered route
- Tests for placement, three cards, copy, and routes

## Out of scope

- Live price filtering / Shopify collection sync
- More than three bands
- Extra CTAs or “view all” in this section
