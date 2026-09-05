# Shop by Collection Bento Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an edge-to-edge 2+3 occasion bento section on `/design` under the campaign hero.

**Architecture:** New `collection-bento` section type in `blank.js` data, renderer in `render.js`, styles scoped in `design.css`. Tiles are links with cover images, bottom scrim, and bottom-left labels.

**Tech Stack:** Vanilla HTML/CSS/JS playground (no framework).

## Global Constraints

- Live `/design` route stays free of review/annotation scaffolding.
- Styles scoped under `body[data-page="blank"]`.
- Occasion labels: Everyday, Work, Festive, Wedding, Ready-to-wear.
- Edge-to-edge; hairline gaps; mobile stacks.

---

### Task 1: Failing test for collection bento on blank page

**Files:**
- Modify: `tests/quiet-editorial-page.test.mjs`

- [ ] **Step 1:** Add a test asserting `blank.js` includes `type: "collection-bento"`, the five occasion labels, and `render.js` has `case "collection-bento"`, and `design.css` has `.design-collection-bento`.
- [ ] **Step 2:** Run `node --test tests/quiet-editorial-page.test.mjs` and confirm the new assertions fail.

### Task 2: Page data + renderer

**Files:**
- Modify: `playground/pages/blank.js`
- Modify: `playground/components/render.js`

- [ ] **Step 1:** Insert `collection-bento` section after campaign hero (before footer) with five occasion tiles and existing occasion image paths.
- [ ] **Step 2:** Add `renderCollectionBento` and wire `case "collection-bento"`.
- [ ] **Step 3:** Each tile: `<a>` with fill media, scrim, bottom-left label.

### Task 3: Design CSS

**Files:**
- Modify: `playground/styles/design.css`

- [ ] **Step 1:** Edge-to-edge grid: row of 2 + row of 3, ~3px gap, min tile height.
- [ ] **Step 2:** Cover image, bottom linear scrim, cream bottom-left label, subtle hover scale with reduced-motion off.
- [ ] **Step 3:** Mobile: single column.

### Task 4: Verify

- [ ] **Step 1:** Run design-related tests; fix until green.
- [ ] **Step 2:** Confirm `/design/` serves the section (server if needed).
