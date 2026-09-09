import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("Agentation loads by default on /design and the rest of the playground, including the live host", async () => {
  const index = await source("playground/index.html");
  const designIndex = await source("playground/design/index.html");
  const loader = await source("playground/agentation.js");

  assert.match(index, /src="\/agentation\.js"/);
  assert.match(designIndex, /src="\/agentation\.js"/);
  assert.match(loader, /query\.get\("agentation"\)\s*!==\s*"0"/);
  assert.doesNotMatch(loader, /isLocalPreview/);
  assert.doesNotMatch(loader, /localHosts/);
  assert.match(loader, /https:\/\/esm\.sh\/agentation@3/);
  assert.match(loader, /reactComponents:\s*false/);
  assert.match(loader, /agentation-session-toolbar-hidden/);
  assert.match(loader, /samantha-agentation-visibility/);
});

test("Agentation guidance preserves the vanilla playground and documents optional MCP sync", async () => {
  const readme = await source("playground/README.md");

  assert.match(readme, /Agentation/);
  assert.match(readme, /loads automatically/i);
  assert.match(readme, /agentation=0/);
  assert.match(readme, /agentation-mcp server/);
  assert.match(readme, /vanilla/i);
  assert.match(readme, /\/design/);
  assert.doesNotMatch(readme, /never runs on the deployed/i);
  assert.doesNotMatch(readme, /stays disabled on the deployed/i);
});
