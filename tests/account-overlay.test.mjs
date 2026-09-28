import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("account login overlay renders the requested login surface", async () => {
  const account = await source("playground/components/account-overlay.js");

  assert.match(account, /accountOverlay/);
  assert.match(account, /Login with OTP/);
  assert.match(account, /Enter Email/);
  assert.match(account, /Get OTP/);
  assert.match(account, /New to Samantha Fab\? Login via OTP/);
  assert.match(account, /Login with Google/);
  assert.match(account, /Terms & Conditions/);
  assert.match(account, /accountClose/);
  assert.match(account, /accountBackdrop/);
  assert.match(account, /account-overlay__content/);
  assert.match(account, /account-overlay__image/);
  assert.match(account, /design-story-cream\.jpg/);
});

test("account login overlay is mounted from the reference account action", async () => {
  const renderer = await source("playground/components/render.js");
  const app = await source("playground/app.js");
  const css = await source("playground/styles/design.css");

  assert.match(renderer, /renderAccountOverlay/);
  assert.match(renderer, /accountOpen/);
  assert.match(app, /setAccountOverlayOpen/);
  assert.match(app, /data-account-close/);
  assert.match(app, /account-overlay-open/);
  assert.match(css, /\.account-overlay\s*\{/);
  assert.match(css, /\.account-overlay__panel\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.account-overlay__panel\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.08fr\)\s+minmax\(300px,\s*0\.92fr\)/s);
  assert.match(css, /\.account-overlay__panel\s*\{[^}]*width:\s*min\(calc\(100%\s*-\s*48px\),\s*960px\)/s);
  assert.match(css, /\.account-overlay__panel\s*\{[^}]*border-radius:\s*4px/s);
  assert.match(css, /\.account-overlay__content\s*\{[^}]*grid-column:\s*1/s);
  assert.match(css, /\.account-overlay__image\s*\{[^}]*grid-column:\s*2/s);
  assert.match(css, /\.account-overlay__close\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s);
  assert.match(css, /\.account-overlay__close-icon\s*\{[^}]*width:\s*20px[^}]*height:\s*20px/s);
  assert.match(css, /\.account-overlay__input\s*\{[^}]*min-height:\s*52px/s);
  assert.match(css, /\.account-overlay__submit\s*\{[^}]*min-height:\s*52px/s);
  assert.match(css, /\.account-overlay__google\s*\{[^}]*min-height:\s*52px/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.account-overlay__panel/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.account-overlay__image\s*\{[^}]*display:\s*none/s);
  assert.match(css, /prefers-reduced-motion/);
});
