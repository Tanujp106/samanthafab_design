import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("Agentation loads by default on local previews and stays off elsewhere", async () => {
  const index = await source("playground/index.html");
  const designIndex = await source("playground/design/index.html");
  const loader = await source("playground/agentation.js");

  assert.match(index, /agentation\.js/);
  assert.match(designIndex, /\.\.\/agentation\.js/);
  assert.match(loader, /query\.get\("agentation"\)\s*!==\s*"0"/);
  assert.match(loader, /localhost|127\.0\.0\.1/);
  assert.match(loader, /https:\/\/esm\.sh\/agentation@3/);
  assert.match(loader, /reactComponents:\s*false/);
});

test("Agentation guidance preserves the vanilla playground and documents optional MCP sync", async () => {
  const readme = await source("playground/README.md");

  assert.match(readme, /Agentation/);
  assert.match(readme, /loads automatically/i);
  assert.match(readme, /agentation=0/);
  assert.match(readme, /agentation-mcp server/);
  assert.match(readme, /vanilla/i);
});
