# Collection PLP — reusable collection page

**Date:** 2026-09-13  
**Surface:** Samantha Fab playground `/design` (`blank` page)  
**Status:** Approved for implementation (Approach 1)

## Goal

Build one reusable **collection / PLP** template used for Bestsellers and every other collection. Desktop shows a left filter sidebar + product grid; mobile opens **Filters** and **Sort** as two separate bottom sheets. Visual language matches the homepage `/design` system (whisper cream, Sprat titles, Karrik UI, plum accents).

## Decisions locked

| Topic | Choice |
| --- | --- |
| Routing | Approach 1 — route-driven view on `/design`: `?route=collection&slug=bestsellers` |
| Visual | Same as homepage / `samantha-fab-design` |
| Filter facets (v1) | Availability, Price, Category/Collections, Size, Color |
| Mobile sheets | Two separate bottom sheets (Filters + Sort) |
| Catalog | Shared mock catalog; each collection is a subset; client-side filter/sort |

## URL & shell

- Entry: `/design?route=collection&slug=bestsellers` (also tolerate `/?route=collection&slug=…` when page resolves to blank).
- Keep existing sticky reference nav, footer, and mobile shell (drawer + bottom tabs).
- Swap only `.site-main` from homepage sections → collection PLP.
- Homepage “Shop All” / collection links that already use collection-like routes are remapped to this template (e.g. bestsellers → `collection&slug=bestsellers`).
- Unknown slug → soft empty state (“Collection not found”) with link back to home, not a hard crash.

## Desktop layout

```
[ breadcrumbs ]
[ TITLE (uppercase Sprat) ]  (N products)          [ Sort by : … ]
┌──────────────┬──────────────────────────────────────────────┐
│ Filters      │  Product grid (3 cols desktop / 2 mobile)    │
│ (sticky)     │  reuse renderProductCard(commerce: true)     │
│ …facets…     │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

- Side gutters 24px; whisper cream page surface.
- Title left-aligned (PLP chrome, not centered section headers).
- Sidebar ~240–280px; thin hairline dividers between facet groups.
- Product cards: existing commerce card (tag → name → price → swatches).

## Mobile layout (≤900px)

- Hide sidebar.
- Under title row: sticky/local **Filters** + **Sort** bar (two buttons).
- Tapping each opens its own bottom sheet (shared sheet shell).
- Filter sheet: accordion facets + sticky **View results** CTA (primary filled).
- Sort sheet: radio list of sort options; selecting applies and closes.
- Grid: 2 columns (same as Explore).
- Bottom tab bar remains; sheet sits above it with scrim.

## Filter / sort behavior

**Client-side only (prototype).** No Shopify API.

Facets:

1. **Availability** — In stock / Out of stock (checkbox + counts)
2. **Price** — dual range + min/max inputs (₹)
3. **Category / Collections** — searchable checkbox list (occasion tags + named collections)
4. **Size** — selectable chips or checkboxes with counts
5. **Color** — circular swatches with counts

Sort options: Popular (default), Price low→high, Price high→low, Newest.

Rules:

- Filters combine with AND across facets; OR within multi-select facet.
- Facet counts update from the current result set where practical.
- “View results” on mobile applies pending filter draft and closes the sheet.
- Desktop applies live on change.
- Clear-all control when any filter is active.

## Data model

```js
// catalog product (extends existing product shape)
{
  id: "sage-handblock",
  name, material, price, compareAt?, href, tag,
  availability: "in_stock" | "out_of_stock",
  sizes: ["Free size"] | ["S","M","L",…],
  colors: [{ color, label }],
  collections: ["bestsellers", "everyday", …],
  media, swatches?,
  priceValue: 1899, // numeric for filter/sort
  createdAt: "2026-09-01"
}

// collection config
{
  slug: "bestsellers",
  title: "Bestsellers",
  breadcrumbs: [{ label: "Home", href: "/design" }, { label: "Bestsellers" }],
  productIds: [...] // or filter: { collections: ["bestsellers"] }
}
```

Shared catalog lives in `playground/data/`; collection configs in the same folder. Homepage rails should eventually reference catalog IDs (v1 may duplicate product payloads into the catalog and keep blank.js rails as-is if a full refactor is too large — prefer importing catalog products into blank rails where easy).

## Reusable components

| Unit | Responsibility |
| --- | --- |
| `getCollectionView(slug)` | Resolve collection + products |
| `applyCollectionFilters(products, state)` | Pure filter/sort |
| `renderCollectionPlp(view, state)` | Full PLP layout |
| `renderFilterSidebar(facets, state)` | Desktop sidebar |
| `renderFilterSheet` / `renderSortSheet` | Mobile sheets |
| `renderBottomSheet(shell)` | Shared sheet chrome (title, close, body, footer slot) |
| `renderProductCard` | Existing — do not fork |

## Out of scope

- Real Shopify / cart / wishlist persistence
- URL-synced filter query params (nice-to-have later)
- PDP
- Infinite scroll / pagination (show full filtered set for mock sizes)

## Success criteria

- `/design?route=collection&slug=bestsellers` shows PLP with sidebar + grid
- Filters and sort change the visible grid client-side
- ≤900px: Filters and Sort open as separate bottom sheets
- Same template works for at least 2 other slugs (e.g. `ready-to-wear`, `everyday`)
- Visual tokens match homepage; tests cover filter logic + route wiring
