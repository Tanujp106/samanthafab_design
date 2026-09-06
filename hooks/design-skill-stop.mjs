#!/usr/bin/env node
/**
 * stop — if design sources changed this turn but the skill did not,
 * auto-follow-up once so lasting nits get folded into the skill.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  isDesignSourcePath,
  isSkillPath,
  readStdinJson,
  STATE_DIR,
} from "./design-skill-lib.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const editsPath = join(root, STATE_DIR, "session-edits.json");

async function main() {
  const input = await readStdinJson();
  const status = input.status ?? "completed";
  const loopCount = Number(input.loop_count ?? 0);

  if (status !== "completed" || loopCount > 0) {
    process.stdout.write("{}");
    return;
  }

  let edits = [];
  try {
    edits = JSON.parse(await readFile(editsPath, "utf8"));
    if (!Array.isArray(edits)) edits = [];
  } catch {
    process.stdout.write("{}");
    return;
  }

  const touchedDesign = edits.some(isDesignSourcePath);
  const touchedSkill = edits.some(isSkillPath);

  try {
    await writeFile(editsPath, "[]\n", "utf8");
    await writeFile(
      join(root, STATE_DIR, "design-prompt.json"),
      JSON.stringify({ active: false }),
      "utf8",
    );
  } catch {
    // ignore
  }

  if (!touchedDesign || touchedSkill) {
    process.stdout.write("{}");
    return;
  }

  process.stdout.write(
    JSON.stringify({
      followup_message:
        "Design sources changed this turn without updating `skills/samantha-fab-design/`. If any of those changes are lasting preferences (not one-offs), update `SKILL.md` and/or `nits.md`, add a Changelog line, then stop. Skip if the edit was a throwaway experiment.",
    }),
  );
}

main().catch(() => {
  process.stdout.write("{}");
});
