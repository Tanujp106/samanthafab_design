#!/usr/bin/env node
/**
 * preToolUse (Write/StrReplace) — remind agent to follow samantha-fab-design
 * when editing design surfaces or after a design-flagged prompt.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DESIGN_CONTEXT,
  isDesignPath,
  readStdinJson,
  STATE_DIR,
} from "./design-skill-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function designPromptActive() {
  try {
    const raw = await readFile(join(root, STATE_DIR, "design-prompt.json"), "utf8");
    return Boolean(JSON.parse(raw).active);
  } catch {
    return false;
  }
}

async function main() {
  const input = await readStdinJson();
  const toolInput = input.tool_input ?? input.arguments ?? input.input ?? {};
  const path =
    toolInput.path ??
    toolInput.file_path ??
    toolInput.target_notebook ??
    toolInput.filePath ??
    "";

  const touchDesign = isDesignPath(String(path)) || (await designPromptActive());
  if (!touchDesign) {
    process.stdout.write("{}");
    return;
  }

  process.stdout.write(
    JSON.stringify({
      permission: "allow",
      agent_message: DESIGN_CONTEXT,
    }),
  );
}

main().catch(() => {
  process.stdout.write("{}");
});
