# Samantha Fab Playground

Local design playground for Samantha Fab homepage experiments.

This is a data-driven vanilla HTML/CSS/JS concept. No framework, build system, CMS, or production ecommerce dependency.

## View

Serve the `playground/` folder (port `4173` if already running):

- Clean client view: `http://127.0.0.1:4173/`
- Campaign hero experiment: `http://127.0.0.1:4173/design`
- Review annotations: `http://127.0.0.1:4173/?notes=1`
- Explicit page: `http://127.0.0.1:4173/?page=homepage`

Live on Vercel:

- Clean: https://playground-ten-dun.vercel.app/
- Campaign hero: https://playground-ten-dun.vercel.app/design
- Notes: https://playground-ten-dun.vercel.app/?notes=1

This is a design mock. It is marked `noindex`. The Shopify store remains the production site.

## Agentation annotations

The playground remains vanilla HTML/CSS/JS. Agentation loads automatically on local previews and on the live design host. Look for the toolbar in the bottom-right corner of `/design`.

- Campaign hero with toolbar: `/design`
- Disable it for one session: `?agentation=0`
- Real-time MCP sync (local only): start `npx agentation-mcp server`, then open `?agentationSync=1`

Without MCP sync, use the toolbar's copy action and paste the structured annotations into your coding agent. The loader reports DOM selectors and computed styles. The Shopify store is unchanged.

## Structure

- `pages/` — page-specific content and section chronology
- `components/render.js` — shared section renderers
- `components/media.js` — image / video / tonal fallback media
- `styles/tokens.css` — colour, type, and spacing tokens
- `styles/layout.css` — shared layout primitives
- `styles/homepage.css` — homepage section composition
- `styles/review.css` — annotation / notes mode styles

## Add another experiment

1. Create a page data module in `pages/`
2. Register it in `pages/index.js`
3. Open `/?page=your-page-key`
