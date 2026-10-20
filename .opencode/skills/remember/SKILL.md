---
name: remember
description: Save what matters at the end of a session so the next session picks up exactly where you left off. Or restore context at the start of a new session so nothing is lost between them.
---

AI has no memory between sessions. Every new session starts blank. This skill fixes that.

Run it at the end of a session to save. Run it at the start of a new session to restore. That is all it does — but done consistently, it means nothing ever gets lost.

## Memory model (Habit Tracker — JobPilot style)

`memory.md` is **append-only**. It never gets wiped and rewritten from scratch.

Structure:

```markdown
# Project Memory

> **CRITICAL RULE: NEVER overwrite this file. Always APPEND or UPDATE in place.**
> When saving memory, read the existing content, then update the
> "Current Status" section and append a new session entry under "Session History".
> Never use the write tool to replace the entire file.

## Current Status

**Phase:** …
**Last completed:** …
**Next:** …

---

## Session History

### Phase X.YY — Feature Name (Complete)

**What was built:**
- …

**Decisions made:**
- …

**Problems solved:**
- …

---
```

- `/remember save` updates **Current Status** and **appends** one session entry
- History accumulates across the whole project lifetime
- This is intentionally different from a “latest session only” memory file

## Security Boundary

This skill must never persist secrets. If any sensitive value appears in the conversation or context, do not copy it to `memory.md`.

Sensitive data includes (non-exhaustive):

- API keys, access tokens, refresh tokens, session tokens
- Passwords, passphrases, one-time codes, private keys, certificates
- Cookies, auth headers, connection strings, webhook secrets
- Any credential-like value or secret-looking string

If a detail is useful but sensitive, store a redacted placeholder instead (for example: `[REDACTED_API_KEY]`).
If unsure whether something is sensitive, treat it as sensitive and omit or redact it.

## How to Invoke

**To save at end of session:**

```
/remember save
```

**To restore at start of new session:**

```
/remember restore
```

If the developer just runs `/remember` without specifying — ask them which one they need.

---

## Save Mode

When the developer runs `/remember save`:

### Step 1 — Read existing memory

If `memory.md` exists in the project root, read it fully first.

If it does not exist, create it with the full structure above (header, Current Status, Session History with one entry).

### Step 2 — Capture what matters

Review the current conversation. Extract only what a developer would genuinely need to continue this work in a completely fresh context. Not a transcript. The essential state.

Think like someone handing off a project to a colleague who is equally skilled but knows nothing about what happened today.

Capture in the **new session entry**:

**What was built** — specific files created or modified, features completed, components added. Be precise. Not "built the habits page" — "created components/habits/HabitList.tsx and HabitRow.tsx, wired filter tabs to mock data."

**Decisions made** — choices that would be hard to reverse or that future work depends on. Architectural choices, not line-by-line detail.

**Problems solved** — any issue that took time to figure out. So the next session does not solve the same problem twice.

**Current state** — exactly where things stand. What works, what is partial, what is known to be broken. (Also mirror briefly in Current Status.)

**What comes next** — the very next thing that needs to happen. Specific enough that the next session can start immediately. (Put this in Current Status → **Next**.)

**Open questions** — anything unresolved that the next session needs to address.

### What not to capture

- Implementation details visible in the code
- Decisions already documented in context files
- Anything inferable by reading the codebase
- The process of how something was built — only what was built and what was decided
- Secrets or credential-like values

### Session entry heading

Use the next phase/feature number from `context/progress-tracker.md` when known:

```
### Phase 2.05 — Home Page Full UI (Complete)
```

If not applicable, use a clear name:

```
### Session — Scaffold + Context Files (Complete)
```

### Step 3 — Update Current Status in place

Replace only the three Current Status lines:

```
**Phase:** …
**Last completed:** …
**Next:** …
```

Do not delete Session History.

### Step 4 — Append the session entry

Append the new entry at the **end** of Session History (after the last `---` separator). Keep a `---` between entries.

### Step 5 — Safety check

Before finishing, re-read `memory.md` and confirm:

- No secrets present
- File was not overwritten from scratch
- Current Status matches the new entry
- Prior session entries still exist

### Confirm to the developer

```
Memory saved to memory.md (append-only).

Current status: [Phase] — [Last completed]
Next: [Next]

Session history entries: [N]
Next session: run /remember restore to pick up from here.
```

---

## Restore Mode

When the developer runs `/remember restore` at the start of a new session:

### Step 1 — Find the memory

Look for `memory.md` in the project root. If it does not exist, tell the developer:

```
No memory.md found in this project.

Either this is the first session, or the file was not saved.
To save memory at the end of a session, run /remember save.
```

### Step 2 — Read everything available

Read `memory.md` first (Current Status + recent Session History entries; older entries can be skimmed).

Then check for these context files if they exist and read what is relevant:

- `AGENTS.md`
- `context/project-overview.md`
- `context/architecture.md`
- `context/progress-tracker.md`
- `context/ui-registry.md` (if UI work is likely)
- Other `context/*.md` files as needed for the task at hand

Do not dump every file into the answer. Build the most complete picture possible from what is available.

When restoring, never repeat or surface raw secrets. If a secret appears in restored context, summarise it in redacted form only.

### Step 3 — Confirm what was restored

Do not start building. Summarise what was restored so the developer can verify understanding:

```
Memory restored. Here is where we are:

**Phase:** [phase]
**Last completed:** [what]
**Next:** [what]
**Recent sessions:** [1–3 line summary of last entries]
**Decisions in place:** [key locked decisions]

Is this correct? Say yes to continue, or correct anything
that does not look right before we proceed.
```

Only after the developer confirms does the session continue.

### If memory is incomplete or unclear

```
I found memory.md but some context seems missing —
[what is unclear or absent].

Should we continue with what we have, or do you want
to fill in the gaps before we start?
```

Do not guess. Surface the gap and let the developer decide.

---

## The Rule

Every session ends with `/remember save`.
Every session starts with `/remember restore`.
`memory.md` only grows — never a full overwrite.
