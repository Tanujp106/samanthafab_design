# Samantha Fab Live Design Site

Date: 2026-09-04

## Purpose

This repo is the pixel-accurate frontend mock of Samantha Fab. It is not the Shopify store. A Shopify theme developer will later rebuild the look in the existing custom theme. This site exists so design can be iterated in code, opened on phone and laptop, and handed off as named sections plus tokens.

## Out of scope

- Shopify APIs, checkout, accounts, cart persistence
- Figma as the source of truth
- Hydrogen / React / Next
- Liquid theme work in this repo
- Search indexing of the mock (the live store stays on Shopify)

## Architecture

Vanilla HTML/CSS/JS in `playground/`, served as static files.

| Path | Role |
| --- | --- |
| `playground/pages/` | Screen content |
| `playground/components/` | Shared renderers |
| `playground/styles/tokens.css` | Colour, type, spacing for theme settings |
| `playground/styles/layout.css` | Shared layout primitives |
| `playground/styles/homepage.css` | Homepage composition |
| `playground/styles/review.css` | Notes-only annotations |
| `playground/assets/` | Replaceable concept imagery |
| `playground/app.js` | Page selection and notes flag |

Section `id` and `type` are the Shopify mapping keys. Do not rename existing homepage ids:

`utility-navigation`, `campaign-hero`, `shop-by-occasion`, `new-arrivals`, `ready-to-wear`, `shop-by-price`, `why-samantha`, `made-for-real-life`, `worn-by-real-women`, `stylist-service`, `last-chance`, `saree-library`, `footer`.

## Components

Keep the current renderers. New pages reuse `render.js` / `media.js` instead of introducing a framework.

- Header and footer stay shared across pages once more screens exist.
- Product tiles, occasion tiles, and split editorial blocks stay data-driven.
- `?notes=1` remains the only way to see annotations. Default URL is the clean client view.

## Data

Pages are design. Catalog is frozen.

- Homepage content stays in `playground/pages/homepage.js` until a shared catalog is extracted.
- Products, prices, and images are static. They do not come from Shopify.
- Buttons may look like cart, account, or checkout. They do not need to complete a purchase.
- Later pages (`shop`, `collection`, `product`) must read the same dummy items rather than inventing a second catalog.

## URLs

- `/` — homepage, clean client view
- `/?notes=1` — annotated review
- `/?page=<key>` — explicit page module (existing)
- `/?route=` links may stay as placeholders until that page exists

## Deploy

Host `playground/` as a static site on Vercel. No build step.

- Public dummy URL first (`*.vercel.app`). Custom domain can point at the same project later.
- Send `noindex, nofollow` so the mock does not compete with the Shopify store.
- Concept photography stays local files, replaceable, not claimed as customers.

## Phases

1. **Ship homepage** — current playground, live URL, notes mode intact.
2. **Shared frozen catalog** — one product/collection module reused by later pages.
3. **Core pages** — shop, collection, product, using the same tokens and header/footer.
4. **HANDOFF.md** — map each `id` / `type` to a Shopify section or block, once the core pages look settled.

## Visual rules

Editorial composition, restrained geometry, hairline rules, varied section rhythm. No rounded-card / gradient-heavy treatment. Sticky nav remains a sibling of the utility strip. Saree Library stays a quiet post-sale strip. Split editorial sections keep an explicit column gap of at least 32–64px.
