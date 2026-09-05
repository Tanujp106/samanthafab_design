# Testimonials — `/design`

**Date:** 2026-09-06  
**Surface:** Samantha Fab playground `/design` (`blank` page)  
**Status:** Approved for implementation (Approach A)

## Goal

Show many customer voices without a quote wall: one featured testimonial at a time, with a face/name rail to browse the rest.

## Placement

After `design-shop-under`, before the footer.

## Content model (per item)

| Field | Required | Notes |
|-------|----------|--------|
| `image` | yes | Portrait / customer photo |
| `name` | yes | Display name |
| `quote` | yes | Testimony body |
| `meta` | optional | Short static line, e.g. city · occasion (`Bengaluru · Everyday`) |
| `product` | optional | Short “Wore …” line if useful later |

No star ratings in v1.

Section chrome: title **“Loved by her”**. Optional one-line lede muted Karrik.

## Layout

### Desktop

- Content max width, 24px side gutters
- **Stage:** two columns — portrait media (~40–45%) left, quote block right (name, optional meta, quote)
- **Rail:** under the stage, horizontal scroll-snap of circular thumbnails; active thumb indicated; clicking a thumb swaps the feature
- One featured voice at a time; tens of items live in data

### Mobile

- Portrait above quote
- Thumb rail below, same scroll-snap behavior

## Visual

- Section surface: white / quiet paper
- Section title: Sprat Campaign, `primary-800`, weight 400 / variation settings as elsewhere on `/design`
- Quote: Karrik for long testimony
- Name: Sprat or strong Karrik; meta muted
- Feature media: cover crop, restrained radius (~12–16px)
- Thumbs: small circular crops, active state via hairline/primary ring — not heavy shadow cards
- No gradient-heavy testimonial cards; no review scaffolding on the live route

## Interaction

- Select thumb → update featured image, name, quote, meta
- Keyboard left/right when stage or rail focused (nice-to-have)
- `prefers-reduced-motion`: instant swap OK

## Out of scope

- Live review platform sync
- Star ratings
- Video testimonials
- “Write a review” CTA (later)

## Implementation sketch

- New section type `testimonials` in `blank.js` with ~6–8 sample items
- `renderTestimonials` + styles scoped to `body[data-page="blank"]`
- Light JS for thumb → feature binding in `app.js`
- Tests for placement, fields, renderer case, active-thumb hooks
