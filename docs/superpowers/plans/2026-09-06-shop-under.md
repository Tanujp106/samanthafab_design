# Shop under Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a three-card Shop under section after the Ready-to-wear product rail on `/design`.

**Architecture:** New `shop-under` section type in `blank.js`, renderer parallel to collection bento (image fill + bottom scrim + title), styles scoped under `body[data-page="blank"]`.

**Tech Stack:** Vanilla JS playground (`blank.js`, `render.js`, `design.css`), Node test suite.

## File map

| File | Responsibility |
|------|----------------|
| `tests/quiet-editorial-page.test.mjs` | Placement, copy, routes, renderer/CSS presence |
| `playground/pages/blank.js` | Section data after RTW products |
| `playground/components/render.js` | `renderShopUnder` + switch case |
| `playground/styles/design.css` | Layout + Sprat/scrim visuals |

### Task 1: Failing test then implement

- [ ] Add test asserting section after `design-ready-to-wear-products`, three items, titles/hrefs, renderer case, CSS hooks
- [ ] Update RTW rail test so footer is no longer assumed at `bannerIndex + 2`
- [ ] Run test — expect fail
- [ ] Implement data + renderer + CSS
- [ ] Run test — expect pass

### Task 2: Verify

- [ ] `node --test tests/quiet-editorial-page.test.mjs`
- [ ] Syntax-check touched JS
