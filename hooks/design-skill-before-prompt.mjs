#!/usr/bin/env node
/**
 * beforeSubmitPrompt — flag design / page-feedback prompts.
 * Docs only allow continue/user_message; injection happens via sessionStart + preToolUse.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isDesignPrompt, readStdinJson, STATE_DIR } from "./design-skill-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const input = await readStdinJson();
  const prompt = String(input.prompt ?? "");
  const active = isDesignPrompt(prompt);

  try {
    await mkdir(join(root, STATE_DIR), { recursive: true });
    await writeFile(
      join(root, STATE_DIR, "design-prompt.json"),
      JSON.stringify({ active, at: new Date().toISOString() }),
      "utf8",
    );
  } catch {
    // fail open
  }

  process.stdout.write(JSON.stringify({ continue: true }));
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ continue: true }));
});
