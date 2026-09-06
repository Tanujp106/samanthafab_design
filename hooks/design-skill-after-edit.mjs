#!/usr/bin/env node
/**
 * afterFileEdit — record edited paths for stop-hook skill upkeep.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readStdinJson, STATE_DIR } from "./design-skill-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const editsPath = join(root, STATE_DIR, "session-edits.json");

async function main() {
  const input = await readStdinJson();
  const path =
    input.path ??
    input.file_path ??
    input.filePath ??
    input.tool_input?.path ??
    input.tool_input?.file_path ??
    "";

  if (!path) {
    process.stdout.write("{}");
    return;
  }

  try {
    await mkdir(join(root, STATE_DIR), { recursive: true });
    let edits = [];
    try {
      edits = JSON.parse(await readFile(editsPath, "utf8"));
      if (!Array.isArray(edits)) edits = [];
    } catch {
      edits = [];
    }
    const normalized = String(path).replace(/\\/g, "/");
    if (!edits.includes(normalized)) {
      edits.push(normalized);
      await writeFile(editsPath, `${JSON.stringify(edits, null, 2)}\n`, "utf8");
    }
  } catch {
    // fail open
  }

  process.stdout.write("{}");
}

main().catch(() => {
  process.stdout.write("{}");
});
