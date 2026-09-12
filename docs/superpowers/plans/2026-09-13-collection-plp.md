# Collection PLP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a reusable collection PLP on `/design` via `?route=collection&slug=…` with desktop sidebar filters, product grid, and mobile Filters/Sort bottom sheets.

**Architecture:** Keep the blank page shell (nav/footer/mobile). When `route=collection`, swap `.site-main` for a collection PLP renderer. Shared catalog + collection configs drive all slugs. Pure filter/sort helpers are unit-tested without DOM.

**Tech Stack:** Vanilla HTML/CSS/JS playground; Node test runner; `samantha-fab-design` tokens.

## Global Constraints

- Styles scoped under `body[data-page="blank"]`.
- Whisper cream surfaces; Sprat titles; Karrik UI; plum primary CTAs — no olive/terracotta from external refs unless mapped to existing tokens.
- Reuse `renderProductCard(..., { commerce: true })` — do not fork cards.
- Occasion tags only: Everyday / Work / Festive / Wedding / Ready-to-wear.
- Client-side filter/sort only; no Shopify API.
- Side gutters 24px.

---

### Task 1: Pure filter/sort helpers + tests

**Files:**
- Create: `playground/lib/collection-filters.mjs`
- Create: `tests/collection-filters.test.mjs`

**Interfaces:**
- Produces: `parsePriceValue(priceString)`, `applyCollectionFilters(products, state)`, `buildFacetCounts(products, state)`, `DEFAULT_SORT = "popular"`

- [ ] **Step 1: Write failing tests** for price parse, availability filter, price range, multi facet AND, sort popular/price/newest.

- [ ] **Step 2: Run** `node --test tests/collection-filters.test.mjs` — expect FAIL (module missing).

- [ ] **Step 3: Implement** minimal helpers in `playground/lib/collection-filters.mjs`.

- [ ] **Step 4: Re-run tests** — expect PASS.

---

### Task 2: Shared catalog + collection configs

**Files:**
- Create: `playground/data/catalog.js`
- Create: `playground/data/collections.js`
- Create: `tests/collection-data.test.mjs`

**Interfaces:**
- Produces: `catalogProducts` (array with `id`, `priceValue`, `availability`, `sizes`, `colors`, `collections[]`, existing card fields)
- Produces: `collectionsBySlug`, `getCollectionProducts(slug)`

- [ ] **Step 1: Failing test** — bestsellers collection resolves ≥6 products; ready-to-wear and everyday resolve non-empty; every product has `priceValue` and `id`.

- [ ] **Step 2: Implement catalog** by consolidating unique products from blank best-sellers / new-arrivals / RTW rails; enrich with filter fields (Free size default, in_stock default, colors from swatches).

- [ ] **Step 3: Implement collections** — at least `bestsellers`, `ready-to-wear`, `everyday`, `new-arrivals`, `festive`, `wedding`, `clearance` with titles + breadcrumbs + product membership via `collections` tags.

- [ ] **Step 4: Tests PASS.**

---

### Task 3: Collection PLP renderer + bottom sheet chrome

**Files:**
- Create: `playground/components/collection-plp.js` (or add to `render.js` if preferred — prefer separate module imported by `render.js` / `app.js` to keep `render.js` from growing further)
- Modify: `playground/components/render.js` — export any shared helpers needed (`element`, `renderProductCard`) OR move `element` to a tiny shared util if already local
- Create: `tests/collection-plp.test.mjs`

**Interfaces:**
- Produces: `renderCollectionPlp({ collection, products, state, ctx })` → DocumentFragment/HTMLElement
- Produces: `renderBottomSheet({ id, title, body, footer? })`

- [ ] **Step 1: Failing test** — rendered markup includes `.collection-plp`, `.collection-plp__sidebar`, `.collection-plp__grid`, mobile bar buttons, filter facet groups Availability/Price/Category/Size/Color, and sheet roots for filters + sort.

- [ ] **Step 2: Implement renderer** reusing `renderProductCard`. Desktop sidebar sticky; mobile bar hidden on desktop via CSS later.

- [ ] **Step 3: Tests PASS.**

---

### Task 4: Route-driven view swap in `app.js` + `renderPage`

**Files:**
- Modify: `playground/components/render.js` (`renderPage` accepts `collectionView` option — when set, main gets PLP instead of homepage sections)
- Modify: `playground/app.js` — parse `route` + `slug`; when `route=collection`, pass view; bind filter/sort/sheet interactions
- Modify: `playground/pages/blank.js` — remap key Shop All / footer / occasion links to ` /design?route=collection&slug=…`
- Create: `tests/collection-route.test.mjs`

- [ ] **Step 1: Failing test** — `app.js` / `render.js` source contains collection route handling; blank bestsellers Shop All href points at collection slug.

- [ ] **Step 2: Implement route wiring + interactive filter apply / sheet open-close / Escape / scrim click.**

- [ ] **Step 3: Alias legacy routes** — `route=bestsellers` → treat as `collection` + `slug=bestsellers` (and same for `ready-to-wear`, `new-arrivals`, `everyday`, etc. where obvious).

- [ ] **Step 4: Tests PASS.**

---

### Task 5: Collection PLP CSS

**Files:**
- Modify: `playground/styles/design.css`
- Modify: `skills/samantha-fab-design/SKILL.md` + `nits.md` (section defaults + changelog)
- Modify: `tests/design-nits.test.mjs` if needed to lock key selectors

- [ ] **Step 1: Style desktop grid + sticky sidebar + sort select + hairline facet rules.**

- [ ] **Step 2: Style mobile bar + bottom sheets (cream surface, primary CTA, accordion chevrons, color swatches, price inputs).** Map reference olive CTA → `--color-primary` filled button (brand, not olive).

- [ ] **Step 3: Reduced-motion: sheet transitions become instant opacity; no large transforms if reduced.

- [ ] **Step 4: Update design skill with Collection PLP section defaults + nits.**

---

### Task 6: Verify

- [ ] **Step 1:** `node --test tests/collection-*.test.mjs tests/design-nits.test.mjs tests/mobile-shell.test.mjs`

- [ ] **Step 2:** Manual check `/design?route=collection&slug=bestsellers` desktop + narrow viewport sheets.

- [ ] **Step 3:** Confirm at least one other slug (`ready-to-wear`) renders.

---

## File map

| File | Role |
| --- | --- |
| `playground/lib/collection-filters.mjs` | Pure filter/sort |
| `playground/data/catalog.js` | Shared products |
| `playground/data/collections.js` | Slug configs |
| `playground/components/collection-plp.js` | PLP + sheet markup |
| `playground/components/render.js` | `renderPage` view branch; export card helper if needed |
| `playground/app.js` | Route parse + interactions |
| `playground/pages/blank.js` | Link remaps |
| `playground/styles/design.css` | PLP styles |
| `docs/superpowers/specs/2026-09-13-collection-plp-design.md` | Design source of truth |
