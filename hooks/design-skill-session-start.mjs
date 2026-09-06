#!/usr/bin/env node
/**
 * sessionStart — inject samantha-fab-design skill gate into the conversation.
 * Fail-open: never block session creation.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readStdinJson, STATE_DIR, DESIGN_CONTEXT } from "./design-skill-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  await readStdinJson();
  try {
    await mkdir(join(root, STATE_DIR), { recursive: true });
    await writeFile(join(root, STATE_DIR, "session-edits.json"), "[]\n", "utf8");
    await writeFile(join(root, STATE_DIR, "design-prompt.json"), JSON.stringify({ active: false }), "utf8");
  } catch {
    // fail open
  }

  process.stdout.write(
    JSON.stringify({
      env: { SAMANTHA_FAB_DESIGN_SKILL: "1" },
      additional_context: DESIGN_CONTEXT,
    }),
  );
}

main().catch(() => {
  process.stdout.write("{}");
});
