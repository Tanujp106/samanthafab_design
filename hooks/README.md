# Design-skill hooks

Scripts referenced by `.cursor/hooks.json`. Fail-open (never block the agent on hook errors).

| Script | Event | Role |
| --- | --- | --- |
| `design-skill-session-start.mjs` | `sessionStart` | Inject skill gate via `additional_context` |
| `design-skill-before-prompt.mjs` | `beforeSubmitPrompt` | Flag design / page-feedback prompts |
| `design-skill-pre-tool.mjs` | `preToolUse` | Remind on Write/StrReplace of design paths |
| `design-skill-after-edit.mjs` | `afterFileEdit` | Track edited paths for stop upkeep |
| `design-skill-stop.mjs` | `stop` | One follow-up if design changed without skill update |

Runtime state lives in `hooks/state/` (gitignored).
