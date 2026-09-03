# Live Homepage Deploy Implementation Plan

> **For agentic workers:** Execute inline in this session. Phase 1 only: public homepage URL. Do not extract catalog, add pages, or write HANDOFF.md.

**Goal:** Put the current `playground/` homepage on a public static URL that works on phone and laptop, with notes mode preserved and search indexing off.

**Architecture:** No build. Deploy the `playground/` folder as the site root. Keep vanilla HTML/CSS/JS and existing section ids.

**Tech Stack:** Vercel static hosting. Deploy `playground/` as the site root.

## Global Constraints

- No framework, Shopify API, checkout, or Liquid.
- Do not rename homepage section ids.
- Default URL stays the clean client view; `?notes=1` stays review-only.
- Do not commit unless the user asks.
- Send `noindex, nofollow`.

---

### Task 1: Mark the mock as a non-indexable static site

**Files:**
- Modify: `playground/index.html`
- Create: `playground/robots.txt`
- Create: `playground/vercel.json`

**Interfaces:**
- Consumes: existing homepage shell
- Produces: static files a host can serve without a build

- [ ] **Step 1: Add robots meta to `playground/index.html`**

Add inside `<head>` after the description meta:

```html
<meta name="robots" content="noindex, nofollow" />
```

- [ ] **Step 2: Create `playground/robots.txt`**

```
User-agent: *
Disallow: /
```

- [ ] **Step 3: Create `playground/vercel.json`**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
    }
  ]
}
```

- [ ] **Step 4: Verify locally that `/` still loads and `/?notes=1` still toggles annotations**

Serve `playground/` and confirm the homepage renders and notes appear only with the query flag.

---

### Task 2: Publish a public dummy URL

**Files:**
- Modify: `playground/README.md` (add live URL once known)

**Interfaces:**
- Consumes: `playground/` as static root
- Produces: HTTPS URL openable on mobile

- [ ] **Step 1: Deploy `playground/` with Vercel CLI**

If logged in:

```bash
cd playground && npx vercel deploy --yes --prod
```

If logged out, `npx vercel login` first, then the same deploy command.

- [ ] **Step 2: Fetch the live URL**

```bash
curl -sI "$URL"
```

Expect HTTP 200, HTML content type, and `X-Robots-Tag: noindex, nofollow` if Vercel headers applied.

- [ ] **Step 3: Open `/` and `/?notes=1` on the live host**

Confirm homepage, tokens/CSS, assets, and notes toggle. Write the URL into `playground/README.md`.
