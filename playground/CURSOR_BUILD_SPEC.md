# Samantha Fab Homepage — Cursor Build Specification

## 0. How to use this document

This is the source-of-truth build brief for the Samantha Fab homepage experiment.

Build the design inside:

`/Users/tanuj/Desktop/SamanthaFab/playground`

The project is a local, non-production design playground. It should remain easy to change, easy to duplicate into another page, and easy to use for visual experiments.

Before editing anything:

1. Read the existing files in `playground/`.
2. Preserve the current data-driven page architecture.
3. Reuse shared renderers and styles where possible.
4. Do not introduce a framework, build system, database, CMS, authentication, checkout, or production dependency.
5. Do not ask for image URLs or brand decisions that can be handled with the rules below. Make the design decisions consistently and keep the structure replaceable.

The result should look like a carefully art-directed fashion-commerce homepage concept, not a template, dashboard, generic landing page, or AI-generated design exercise.

---

## 1. The design problem

Samantha Fab is a modern Indian saree label. The homepage needs to make the collection feel considered, wearable, and culturally rooted without becoming either:

- a discount-led catalogue;
- a wedding-only luxury site;
- an overdecorated “Indian” visual stereotype;
- or a generic western fashion template with saree copy pasted into it.

The homepage must communicate:

1. There is a clear point of view.
2. The sarees are beautiful and contemporary.
3. They are practical enough for real life.
4. The shopper can browse quickly without effort.
5. A human can help if the shopper is unsure.
6. Sale products exist, but sale does not define the brand.

### Homepage story

The page should tell one continuous story:

> Samantha Fab begins with a point of view: modern sarees for modern lives. It gives the shopper an immediate visual world, then offers simple routes into the collection by occasion, product, price, and wearability. It explains what makes the brand different, shows the sarees on real women, offers human styling help, and only then introduces last-chance value. The order moves from desire to confidence to action.

The page should feel calm, edited, and intentional as the user scrolls.

---

## 2. Non-negotiable art direction

### The desired feeling

- Contemporary textile atelier
- Editorial but not precious
- Indian but not costume-like
- Warm, tactile, and human
- Confident, quiet, and easy to browse
- Fashion-led with practical commerce clarity

### Reference traits to borrow, without copying

Use the reference research as a set of traits, not as a visual collage:

- Ogaan / Pernia: curation, editorial pacing, considered whitespace
- Kith / Rino & Pelle: confident hierarchy, simple commerce language, lifestyle clarity
- Okhai / Chidiyaa: craft authenticity, material feeling, human warmth
- Aachho / Kalki: clear occasion-led discovery and product breadth

Do not recreate any reference site, copy its layout, or use its brand assets.

### Explicitly avoid

Do not use:

- gradients as a substitute for photography or art direction;
- glassmorphism, blur cards, or translucent floating panels;
- rounded cards around every section;
- pill-shaped buttons everywhere;
- decorative blobs, circles, waves, abstract rings, or random shapes;
- fake “IMAGE / MEDIA SLOT” copy in the default client view;
- excessive drop shadows;
- emoji icons;
- giant text that overwhelms the product;
- a masonry collage with no hierarchy;
- equal visual weight for every section;
- a wall of product cards;
- “AI-looking” copy such as “Step into a world of timeless elegance”;
- generic stock photography or random Unsplash images;
- fake product reviews presented as verified customer data;
- unnecessary animation, parallax, auto-rotating carousels, or autoplay video with sound.

### Shape language

Use quiet, editorial geometry:

- square or near-square section edges;
- 0–4px corner radius for primary containers;
- 8px maximum radius only for small functional controls if needed;
- 1px hairline rules;
- image crops and vertical rhythm to create interest;
- no universal card treatment.

Only the media itself may have a subtle 2–4px radius if the image crop benefits from it. Do not turn every section into a floating rounded rectangle.

### Floating behavior

The previous design made every section float. Correct this.

The default page should be one continuous editorial canvas. Use spacing and hairline rules to create rhythm. Only these elements may feel visually lifted:

- the main navigation while it is sticky;
- a small service/action panel if needed;
- product imagery on hover, through a very small translate/scale change.

Do not put every section inside a floating rounded card.

---

## 3. Typography

Use only two families:

### Display / editorial

`Newsreader`

Use for:

- hero headline;
- section headlines;
- product names;
- quotes;
- footer brand mark if appropriate.

Recommended weights: 400, 500, 600.

### UI / commerce

`Inter`

Use for:

- utility bar;
- navigation;
- labels;
- product details;
- prices;
- buttons and links;
- annotations in review mode.

Recommended weights: 400, 500, 600, 700.

Load from Google Fonts only if the environment can access it. Always provide local fallbacks:

```css
--font-display: "Newsreader", Georgia, "Times New Roman", serif;
--font-body: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Type rules

- Use sentence case for headlines.
- Use small uppercase labels sparingly.
- Do not make every label uppercase.
- Keep display headlines at a readable measure.
- Use generous line-height for body copy.
- Do not use letter-spacing as a substitute for hierarchy.
- Avoid more than three text sizes within one component.

Suggested desktop scale:

```css
--text-xs: 11px;
--text-sm: 13px;
--text-md: 15px;
--text-lg: 18px;
--text-xl: 28px;
--text-2xl: 44px;
--text-hero: clamp(60px, 7vw, 108px);
```

Suggested mobile scale:

```css
--text-hero-mobile: clamp(48px, 15vw, 72px);
--text-section-mobile: 38px;
```

The hero should feel large, but not take over the entire first screen with oversized type.

---

## 4. Colour system

Use a restrained textile-inspired palette. The UI should not use gradients.

```css
:root {
  --paper: #f4f0e9;
  --paper-deep: #ebe3d9;
  --cream: #fcf9f3;
  --ink: #242021;
  --ink-soft: #51494a;
  --muted: #766f6a;
  --rule: #d4cbc1;
  --rule-dark: #a69a91;
  --rust: #a4513e;
  --rust-soft: #d6a090;
  --indigo: #31465b;
  --moss: #6e7b6b;
  --ochre: #b69158;
  --white: #ffffff;
}
```

### Colour usage

- `--paper`: primary page canvas.
- `--cream`: light media surfaces and reversed content.
- `--ink`: text, primary dark blocks, footer.
- `--rust`: one strong brand/action accent.
- `--indigo`, `--moss`, and `--ochre`: reserved for image fallback tones or small editorial accents.
- `--rule`: dividers and borders.
- `--muted`: supporting text only.

Do not use all accent colours in one section. A section should generally use paper + ink, or paper + one accent.

### Contrast

Check text contrast manually. Do not place muted text over the rust or indigo blocks unless it remains readable. Use cream/white text on dark backgrounds.

---

## 5. Layout system

Use a 12-column editorial grid on desktop.

```css
--content-max: 1440px;
--page-pad: clamp(20px, 5vw, 80px);
--grid-gap: clamp(16px, 2vw, 32px);
--section-pad-y: clamp(72px, 9vw, 144px);
```

Desktop:

- page max width: 1440px;
- page padding: `var(--page-pad)`;
- 12 columns;
- consistent column gap;
- content aligned to the same left and right edges across sections;
- section heights should be content-driven where possible;
- avoid arbitrary empty height that clips content.

Tablet:

- use 8 columns;
- reduce section padding;
- keep the navigation legible;
- allow grids to become two columns.

Mobile:

- use a single column;
- horizontal page padding: 20px;
- keep the utility bar scrollable or reduce it to one concise message;
- use a compact menu trigger or hide secondary navigation links;
- never create horizontal overflow;
- product rails may scroll horizontally only when that is the clearest mobile pattern;
- do not shrink five cards into unreadable miniatures.

### Vertical rhythm

The page should alternate between:

- a large visual moment;
- a simple shopping route;
- a product moment;
- a story or proof moment;
- a service moment.

Do not give all sections the same height, background, or card treatment.

---

## 6. Homepage chronology

The page has 11 content sections plus shared header and footer. The numbered sections are for internal review only and should be hidden in normal view.

### 00 — Utility + navigation

Purpose: establish trust and provide a clean route into the site.

Content:

- utility message: `COD across India`
- utility message: `Easy returns & exchange`
- utility message: `WhatsApp assistance`
- wordmark: `SAMANTHA FAB`
- navigation: `Shop`, `Collections`, `Discover`, `Services`
- actions: `Search`, `Account`, `Bag (0)`

Design:

- utility strip can use rust, but keep it short and quiet;
- navigation should be paper/cream with a 1px bottom rule;
- wordmark uses Newsreader, not a logo made from random letter spacing;
- navigation becomes sticky after the intro/utility area;
- no rounded nav container;
- on mobile, show wordmark, search, bag, and a menu trigger.

### 01 — Campaign hero

Purpose: create desire and establish the brand point of view immediately.

Eyebrow:

`NEW COLLECTION / SAMANTHA FAB`

Headline:

`Sarees for the way you move.`

Body:

`Modern drapes, expressive prints, and effortless ways to wear them.`

Primary link:

`Shop the new edit`

Secondary link:

`Find your saree`

Design:

- desktop: asymmetric 7/5 or 8/4 split;
- one large campaign image crop, ideally a real woman wearing a Samantha Fab saree;
- copy sits in open paper space or a quiet ink panel;
- no sale language in the hero;
- no carousel unless there is a strong content reason;
- if using video, it must be silent, short, muted, and user-controllable;
- CTAs should be underlined text links or one rectangular primary button plus one text link;
- no pill buttons.

Fallback media if no asset exists:

- use a single flat indigo, moss, or ochre-toned image panel;
- add a subtle textile grain only if it can be done without a gradient or decorative pattern;
- do not show “image slot”, bracket text, or placeholder instructions in normal view;
- show the asset note only in `?notes=1` review mode.

### 02 — Shop by occasion

Purpose: give the shopper a low-effort entry into the catalogue.

Eyebrow:

`DISCOVER BY OCCASION`

Headline:

`What are you dressing for?`

Supporting copy:

`Start with the moment, then find the saree.`

Five routes:

1. `Everyday`
2. `Work`
3. `Festive`
4. `Wedding guest`
5. `Ready-to-wear`

Design:

- five editorial image tiles on desktop;
- each tile has image, title, and a simple `Shop now` link;
- do not create five floating cards;
- use a shared baseline and a thin rule below each tile;
- vary image crop or height slightly only if it improves composition;
- on tablet use three + two;
- on mobile use a horizontal scroll rail or one-column list with large crops.

### 03 — New arrivals

Purpose: move from inspiration into products without overwhelming the shopper.

Eyebrow:

`JUST IN`

Headline:

`The latest from Samantha.`

Supporting copy:

`A considered starting point for the collection.`

Products:

1. `Sage green handblock saree` — `Handblock cotton` — `₹1,899`
2. `Indigo stripe ready-to-wear` — `Soft linen blend` — `₹2,499`
3. `Marigold printed saree` — `Lightweight georgette` — `₹1,299`
4. `Black border everyday saree` — `Office-friendly cotton` — `₹1,699`

Design:

- four products on desktop, six maximum if real product data exists;
- image ratio approximately 3:4;
- product name, material, and price sit below the image;
- use `NEW` once as a small label, not as a colourful badge;
- keep product cards borderless;
- no shadows around products;
- add `View all new arrivals` as a quiet link aligned to the section heading.

### 04 — Ready-to-wear

Purpose: show the practical benefit of the product in use.

Eyebrow:

`READY-TO-WEAR`

Headline:

`A saree that keeps up.`

Body:

`Pre-stitched, lightweight, and made for days when getting dressed should feel simple.`

Benefits:

- `Pre-stitched ease`
- `Comfortable movement`
- `Functional pocket detail`

CTA:

`Explore ready-to-wear`

Design:

- split layout, approximately 6/6;
- use a short movement clip or a full-height draping image;
- keep copy in open space with large margins;
- list benefits as numbered lines with hairline rules;
- do not put the copy inside a rounded card;
- the product benefit should be understood before the user reads all details.

### 05 — Shop by price

Purpose: provide a direct, useful path for budget-conscious shoppers without making the homepage feel discount-led.

Eyebrow:

`SHOP BY PRICE`

Headline:

`Find your price point.`

Supporting copy:

`Three simple ways into the collection.`

Exactly three routes:

1. `Under ₹999`
2. `Under ₹1,999`
3. `Under ₹2,999`

Design:

- three equal editorial panels;
- use large numerals or price typography as the visual anchor;
- each panel can have a quiet flat tint: paper, moss, or ochre;
- use a thin border and a simple `Explore` link;
- no product-count badges;
- no “UP TO 70% OFF” language;
- no red sale stickers;
- ensure all three panels have the same visual importance.

### 06 — Why Samantha exists

Purpose: explain the point of view in one memorable editorial story.

Eyebrow:

`WHY SAMANTHA EXISTS`

Headline:

`Tradition without standing still.`

Body:

`A focused brand story about regional inspiration, expressive prints, soft fabrics, and modern drapes.`

CTA:

`Read our story`

Design:

- editorial split, approximately 5/7 or 4/8;
- use one strong craft, textile, or founder image;
- keep this section visually quieter than the hero;
- use a caption or small material note if real imagery is available;
- no collage of random brand claims;
- no generic “our mission / our vision / our values” blocks.

### 07 — Made for real life

Purpose: answer the shopper’s practical concerns passively, without a quiz or effortful interaction.

Eyebrow:

`MADE FOR REAL LIFE`

Headline:

`Why she will reach for it again.`

Four benefits:

1. `Easy to wear`
2. `Lightweight fabrics`
3. `Room to move`
4. `Day-to-evening`

Design:

- four-column editorial row;
- each item begins with a large number and ends with a concise explanation;
- use hairline vertical or horizontal dividers;
- no icons unless there are real, consistent brand icons;
- no four identical rounded feature cards;
- this section should feel like a magazine information spread.

### 08 — Worn by real women

Purpose: make the collection believable and give social proof a human face.

Eyebrow:

`WORN BY REAL WOMEN`

Headline:

`Seen on her. Made for you.`

Quotes:

- `“The easiest saree I have worn.”`
- `“It works for my office and dinner plans.”`
- `“The colour looks even better in person.”`

Design:

- use real UGC, customer images, or product-linked review content when available;
- use one larger feature image and two supporting quotes/images, or three equal editorial columns;
- every quote must link to a product or clearly indicate that it is placeholder copy in notes mode;
- do not show fake star ratings;
- do not use generic headshots;
- image captions should feel human and specific.

Fallback when no real proof exists:

- use tonal image panels with no claim that a real customer is shown;
- label them `PROOF IMAGE TO BE REPLACED` only in `?notes=1` mode;
- keep the section structure so real assets can be dropped in later.

### 09 — Ask a stylist / Design your dream

Purpose: make assisted commerce visible and useful.

Eyebrow:

`NEED A SECOND OPINION?`

Headline:

`Tell us the occasion. We will help with the saree.`

Body:

`A direct human route for colour, fit, styling, or custom design questions.`

Actions:

- `Ask a stylist on WhatsApp`
- `Design your dream saree`

Design:

- use an ink or indigo background with cream text, or a very quiet moss panel;
- make this section feel like a service invitation, not a support footer;
- use one image or a simple textile detail if available;
- use one filled rectangular CTA and one underlined secondary link;
- no form, quiz, chat simulation, or multi-step interaction in this playground.

### 10 — Saree library

Purpose: help people who need context before choosing.

Eyebrow:

`SAREE LIBRARY`

Headline:

`A little help before you choose.`

Supporting copy:

`Keep the education compact and useful.`

Three editorial links:

1. `Choose your fabric`
2. `Find your drape`
3. `Pair your blouse`

Design:

- three editorial rows or three simple image/text modules;
- every guide should eventually link back to products;
- keep labels sentence case;
- no huge article grid or duplicated blog list;
- use a quiet rule and arrow link rather than a button on every tile.

### 11 — Last chance / sale

Purpose: retain a conversion route for value shoppers while keeping sale out of the brand’s opening statement.

Eyebrow:

`LAST CHANCE`

Headline:

`Worth finding. Last pieces, special prices.`

Actions:

- `Shop last chance`
- `Shop under ₹X`

Design:

- compact full-width rust strip;
- cream text;
- keep the section shorter than the content/story sections;
- use two simple links, not badges or discount graphics;
- do not add a countdown timer.

### 12 — Footer

Purpose: close the trust loop and make service information easy to find.

Brand line:

`Modern drapes, expressive prints and everyday ease.`

Columns:

- `Shop`: New arrivals, Sarees, Ready-to-wear, Sale
- `Help`: Shipping, Returns, COD, Care guide
- `About`: Our story, Journal, Contact
- `Stay in touch`: Instagram, WhatsApp, Email

Design:

- deep ink background;
- cream wordmark and text;
- use a strong but quiet grid;
- show a small copyright line at the bottom;
- never use `LINK / LINK / LINK` placeholders in normal view.

---

## 7. Media and asset rules

The current playground may not contain final brand photography. Make the code ready for real assets without pretending that fallback blocks are finished photography.

### Data model

Use media objects rather than hard-coded CSS-only labels:

```js
{
  src: "./assets/hero-saree.jpg",
  alt: "Woman wearing a rust printed saree in motion",
  tone: "rust",
  position: "center"
}
```

### Asset priority

When local assets become available, use them in this order:

1. hero campaign image/video;
2. occasion imagery;
3. product imagery;
4. ready-to-wear movement image/video;
5. craft/founder story image;
6. real customer imagery;
7. service/textile detail imagery.

### Fallback media

When `src` is missing:

- render a deliberate flat tonal block;
- use the section’s assigned tone (`rust`, `indigo`, `moss`, `ochre`, or `paper`);
- preserve the correct crop ratio and composition;
- do not use gradients;
- do not use random stock URLs;
- do not expose implementation text in the default view;
- expose a clear replacement note only when `?notes=1` is active.

### Image component behavior

Create one shared media renderer that supports:

- image;
- muted video poster/fallback;
- flat fallback tone;
- `alt` text;
- optional caption;
- review note only in notes mode.

Use `object-fit: cover` for campaign/editorial imagery. Use `object-position` from the data object where required.

---

## 8. Review annotation mode

The playground still needs design annotations, but they must not pollute the client-facing page.

### Default

`http://127.0.0.1:4173/`

Shows the clean homepage concept. No yellow notes, no section numbers, no placeholder labels, no implementation language.

### Review mode

`http://127.0.0.1:4173/?notes=1`

Shows:

- section numbers;
- section names;
- concise rationale notes;
- media replacement notes;
- optional grid/debug outlines if useful.

Implement this with a body/data attribute, for example:

```js
const notesEnabled = new URLSearchParams(window.location.search).get("notes") === "1";
document.body.dataset.notes = String(notesEnabled);
```

And CSS:

```css
.review-only {
  display: none;
}

body[data-notes="true"] .review-only {
  display: block;
}
```

Do not duplicate the whole page for review mode. The same section data should power both views.

---

## 9. Component architecture

Keep the existing modular vanilla architecture and improve it rather than replacing it with a monolith.

### Suggested files

```text
playground/
├── index.html
├── app.js
├── README.md
├── CURSOR_BUILD_SPEC.md
├── pages/
│   ├── index.js
│   └── homepage.js
├── components/
│   ├── render.js
│   ├── media.js
│   └── icons.js                 # only if shared icons are needed
└── styles/
    ├── tokens.css
    ├── layout.css
    ├── homepage.css
    └── review.css               # optional; notes/debug styles
```

If the existing filenames are already working, do not rename them just for the sake of renaming. It is acceptable to keep `wireframe.css` temporarily, but its contents must represent the final editorial concept, not a grey-box wireframe.

### Rendering rules

Shared renderers should handle repeated structures:

- header/navigation;
- hero;
- occasion tiles;
- product rail;
- split editorial block;
- price panels;
- benefits row;
- proof/testimonial block;
- service block;
- library links;
- sale strip;
- footer;
- media/fallback handling;
- review annotations.

Page-specific content and chronology belong in `pages/homepage.js`, not inside generic render functions.

### Future pages

The following should continue to work:

```text
/?page=homepage
```

Future pages should be addable by:

1. creating a new page data module;
2. registering it in `pages/index.js`;
3. reusing the same shared renderers.

Do not hard-code homepage-only assumptions into every renderer.

---

## 10. Interaction and motion

The page should feel polished without looking animated for the sake of animation.

### Allowed

- navigation underline or colour transition on hover;
- product image scale of 1.01–1.03 on hover;
- arrow/link movement of 2–4px;
- button colour transition;
- subtle section reveal only if it is already supported by the existing playground and does not delay content;
- sticky navigation.

### Not allowed

- scroll-jacking;
- parallax;
- continuously moving text;
- auto-rotating testimonial carousels;
- large springy card movement;
- bouncing buttons;
- floating decorative objects;
- entrance animations on every section;
- autoplay audio.

Respect reduced-motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## 11. Accessibility requirements

- Use one `h1` for the page hero.
- Use `h2` for every major section.
- Use `h3` for product names and supporting item titles.
- Use semantic `header`, `nav`, `main`, `section`, `article`, and `footer` elements.
- All actionable controls must be real links or buttons.
- Do not use `href="#"` for controls that look functional without a clear reason. If no destination exists in the playground, use a valid placeholder route or document the intentional placeholder in notes mode.
- Every real image gets meaningful `alt` text.
- Decorative fallback media gets `aria-hidden="true"` if it conveys no information.
- Keyboard focus must be visible.
- Hover must never be the only way to understand an interaction.
- Text must remain readable at 200% zoom.
- Check colour contrast for paper/ink, paper/rust, and dark/cream combinations.
- Provide an accessible name for menu, search, account, and bag controls.

---

## 12. Implementation order

Follow this order so the design does not drift into decoration before the structure is correct.

### Phase 1 — Clean the foundation

- inspect the existing files;
- keep the data-driven page architecture;
- update the page title and metadata;
- add the font tokens and colour tokens;
- remove grey-box language from the default view;
- add `notes=1` review mode;
- remove universal floating section styling;
- remove gradients, blobs, translucent cards, and placeholder labels from default view.

### Phase 2 — Establish the editorial grid

- build the 12-column desktop grid;
- align every section to the same container;
- add consistent section padding and hairline rules;
- define responsive tablet/mobile grid behavior;
- make section heights content-driven unless a specific composition needs a minimum height.

### Phase 3 — Build hierarchy section by section

Implement the header, hero, occasion tiles, new arrivals, ready-to-wear, price panels, story, benefits, proof, service, library, sale, and footer in that order.

After each section:

- check the heading measure;
- check whether the product/media remains the focal point;
- check that the section looks different from the previous one for a reason;
- check that no repeated card treatment has appeared.

### Phase 4 — Add media replacement architecture

- create the shared media renderer;
- use local assets where they exist;
- use flat tonal fallbacks where they do not;
- keep replacement instructions in notes mode only.

### Phase 5 — Polish

- tune type scale;
- tune whitespace;
- tune rule colour and thickness;
- add restrained hover/focus states;
- verify mobile;
- remove any remaining generic copy or implementation labels.

---

## 13. Verification checklist

Before handing the result back, verify all of the following.

### Visual

- [ ] The default page looks like an editorial fashion storefront.
- [ ] It does not look like a dashboard or a component-library demo.
- [ ] There are no gradients in the UI.
- [ ] There are no rounded floating cards around every section.
- [ ] There are no visible `[ IMAGE ]`, `MEDIA SLOT`, or `GREY-BOX` labels in default view.
- [ ] The hero clearly dominates the first impression.
- [ ] Product images and product text have a clear hierarchy.
- [ ] The page alternates visual density and does not feel repetitive.
- [ ] Sale appears late and does not hijack the brand story.
- [ ] The palette is restrained and readable.
- [ ] The typography feels editorial, not decorative or novelty-driven.

### Responsive

- [ ] Desktop works at 1440px wide.
- [ ] Desktop works at 1280px wide.
- [ ] Tablet works around 768–1024px wide.
- [ ] Mobile works around 390px wide.
- [ ] No horizontal overflow exists at any target width.
- [ ] Occasion and product rails remain usable on mobile.
- [ ] Navigation does not collide with the wordmark or actions.
- [ ] CTA links remain easy to tap.

### Review mode

- [ ] `/?notes=1` reveals section annotations.
- [ ] Default `/` hides annotations and implementation notes.
- [ ] Both modes use the same page data and rendered structure.

### Code

- [ ] Shared components remain shared.
- [ ] Homepage content lives in page data.
- [ ] No duplicated renderer exists for the same section pattern.
- [ ] No new framework or unnecessary package was added.
- [ ] `node --check` passes for all JavaScript files.
- [ ] The page loads from the existing local port `4173`.
- [ ] There are no console errors.
- [ ] Existing future-page query behavior is preserved.

### Final quality gate

Ask this before considering the build done:

> If the colours were removed and the page were printed in black and white, would the composition, spacing, type hierarchy, and image crops still feel intentional?

If the answer is no, improve the layout before adding more styling.

---

## 14. Final instruction to Cursor

Implement the homepage as a complete visual concept using the existing local playground. Treat restraint, hierarchy, and replaceable media architecture as higher priorities than adding more visual effects.

The final result should feel like a designer made a series of deliberate choices:

- one clear visual thesis;
- one coherent type system;
- one restrained palette;
- varied but related section compositions;
- real routes into the collection;
- practical product reasoning;
- human proof and assistance;
- sale kept in its proper place.

Do not stop at changing colours. Rework the composition and component styling so the design has a point of view.
