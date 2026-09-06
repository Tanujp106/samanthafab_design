# Agent notes — Samantha Fab

## Design work (mandatory)

Before any design, UI, layout, typography, spacing, section, hero, product rail, bento, banner, polish, or page-feedback change:

1. Read and follow `skills/samantha-fab-design/SKILL.md`
2. Read `skills/samantha-fab-design/nits.md`
3. Announce `Using samantha-fab-design`

When the user gives lasting design corrections, update those skill files in the same turn (see the skill Upkeep section).

## Automations

Project hooks in `.cursor/hooks.json` (scripts under `hooks/`):

- `sessionStart` — injects the design-skill gate
- `beforeSubmitPrompt` — flags design / page-feedback prompts
- `preToolUse` — reminds on design file edits
- `stop` — follow-up if design sources changed without skill upkeep

Locked measurements: `node --test tests/design-nits.test.mjs`
