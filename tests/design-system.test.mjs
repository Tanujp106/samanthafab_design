import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const tokensPath = new URL("../playground/styles/tokens.css", import.meta.url);

test("design tokens define the Samantha Fab color and type system", async () => {
  const tokens = await readFile(tokensPath, "utf8");

  assert.match(tokens, /--color-primary:\s*#56112A/i);
  assert.match(tokens, /--color-primary-50:\s*#FAF3F6/i);
  assert.match(tokens, /--color-primary-900:\s*#350817/i);
  assert.match(tokens, /--font-display:\s*"Sprat"/);
  assert.match(tokens, /--font-body:\s*"Karrik"/);
  assert.match(tokens, /--weight-display:\s*500/);
  assert.match(tokens, /--weight-body:\s*400/);
  assert.match(tokens, /--text-hero:\s*clamp\(/);
  assert.match(tokens, /--text-body:\s*clamp\(/);
});

test("design tokens load local Sprat and Karrik web fonts", async () => {
  const tokens = await readFile(tokensPath, "utf8");

  assert.match(tokens, /@font-face[\s\S]*font-family:\s*"Sprat"[\s\S]*url\("\.\.\/assets\/fonts\/sprat-variable\.ttf"\)/);
  assert.match(tokens, /@font-face[\s\S]*font-family:\s*"Karrik"[\s\S]*url\("\.\.\/assets\/fonts\/karrik-regular\.woff2"\)[\s\S]*font-style:\s*normal/);
  assert.match(tokens, /@font-face[\s\S]*font-family:\s*"Karrik"[\s\S]*url\("\.\.\/assets\/fonts\/karrik-italic\.woff2"\)[\s\S]*font-style:\s*italic/);
});
