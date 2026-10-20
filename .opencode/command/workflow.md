---
description: List project workflow commands and where their skills live
agent: build
---

Habit Tracker local opencode commands (project scope — `.opencode/command/` + `.opencode/skills/`):

| Command | Skill | When |
|---------|--------|------|
| `/remember save` \| `/remember restore` | `.opencode/skills/remember/SKILL.md` | End / start of session |
| `/architect <feature>` | `.opencode/skills/architect/SKILL.md` | Before non-trivial features |
| `/imprint [file]` | `.opencode/skills/imprint/SKILL.md` | After any UI component |
| `/review [feature]` | `.opencode/skills/review/SKILL.md` | After each feature |
| `/recover <problem>` | `.opencode/skills/recover/SKILL.md` | When something is broken |

Session workflow: `/remember restore` → `/architect` → build UI → `/imprint` → wire logic → `/review` → update progress-tracker → `/remember save`.

Restart opencode after adding/changing command or skill files so they load.

Arguments if any: $ARGUMENTS
