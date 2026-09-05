# Samantha Fab Playground

Local design playground for Samantha Fab homepage experiments.

This is a data-driven vanilla HTML/CSS/JS concept. No framework, build system, CMS, or production ecommerce dependency.

## View

Serve the `playground/` folder (port `4173` if already running):

- Clean client view: `http://127.0.0.1:4173/`
- Campaign hero experiment: `http://127.0.0.1:4173/design`
- Review annotations: `http://127.0.0.1:4173/?notes=1`
- Explicit page: `http://127.0.0.1:4173/?page=homepage`

This is a design mock hosted on Vercel. It is marked `noindex`. The Shopify store remains the production site.

## Agentation annotations

The playground remains vanilla HTML/CSS/JS. Agentation loads automatically in a local browser preview and stays disabled on the deployed client-facing surface:

- Basic toolbar: `http://127.0.0.1:4173/`
- Campaign hero with toolbar: `http://127.0.0.1:4173/design`
- Disable it for one local session: `http://127.0.0.1:4173/?agentation=0`
- Real-time MCP sync: start `npx agentation-mcp server`, then open `http://127.0.0.1:4173/?agentationSync=1`

Without MCP sync, use the toolbar's copy action and paste the structured annotations into your coding agent. The loader reports DOM selectors and computed styles, and never runs on the deployed client-facing surface.

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
