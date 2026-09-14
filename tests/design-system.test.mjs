import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const tokensPath = new URL("../playground/styles/tokens.css", import.meta.url);
const designStylesPath = new URL("../playground/styles/design.css", import.meta.url);
const indexPath = new URL("../playground/index.html", import.meta.url);
const designIndexPath = new URL("../playground/design/index.html", import.meta.url);

test("design tokens define the Samantha Fab color and type system", async () => {
  const tokens = await readFile(tokensPath, "utf8");

  assert.match(tokens, /--color-primary:\s*#56112A/i);
  assert.match(tokens, /--color-primary-50:\s*#FAF3F6/i);
  assert.match(tokens, /--color-primary-900:\s*#350817/i);
  assert.match(tokens, /--font-display:\s*"Lora"/);
  assert.match(tokens, /--font-body:\s*"Karrik"/);
  assert.match(tokens, /--weight-display:\s*500/);
  assert.match(tokens, /--weight-body:\s*400/);
  assert.match(tokens, /--text-hero:\s*clamp\(/);
  assert.match(tokens, /--text-body:\s*clamp\(/);
});

test("design pages load Lora headings and the original Karrik body font", async () => {
  const index = await readFile(indexPath, "utf8");
  const designIndex = await readFile(designIndexPath, "utf8");
  const designStyles = await readFile(designStylesPath, "utf8");
  const tokens = await readFile(tokensPath, "utf8");
  const loraHref = /fonts\.googleapis\.com\/css2\?family=.*Lora:ital,wght@0,400\.\.700;1,400\.\.700.*display=swap/;

  assert.match(index, /fonts\.googleapis\.com/);
  assert.match(index, /fonts\.gstatic\.com/);
  assert.match(index, loraHref);
  assert.match(designIndex, /fonts\.googleapis\.com/);
  assert.match(designIndex, /fonts\.gstatic\.com/);
  assert.match(designIndex, loraHref);
  assert.doesNotMatch(designStyles, /font-family:\s*["']Sprat Campaign/);
  assert.match(tokens, /@font-face[\s\S]*font-family:\s*"Karrik"[\s\S]*karrik-regular\.woff2/);
  assert.match(tokens, /@font-face[\s\S]*font-family:\s*"Karrik"[\s\S]*karrik-italic\.woff2/);
});
