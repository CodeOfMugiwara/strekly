# Habit Tracker — Agent Instructions

You are working on **Habit Tracker** — a Next.js 16 + InsForge habit and mood app with a Lavender Sky UI.

## Read first, always

1. `memory.md` — current phase, last completed, next step, recent session history
2. `context/project-overview.md` — what the product is
3. The context file relevant to the task:
   - Architecture / schema → `context/architecture.md`
   - UI styling → `context/ui-tokens.md`, `context/ui-rules.md`
   - Component patterns → `context/ui-registry.md`
   - Coding rules → `context/code-standards.md`
   - Library usage → `context/library-docs.md`
   - What to build next → `context/build-plan.md`, `context/progress-tracker.md`

Do not assume. Verify against context files and `public/designs/*.png`.

## Design references (@ attachments)

Primary source of truth: **`public/designs/*.png`**. Attach with `@` in chat.

| Screen / concern | File |
|------------------|------|
| Home | `@public/designs/HomePage.png` |
| Habits | Old tracker grid (`D:\habit-tracker\index.html`), **not** HabitsPage.png (redirected in Feature 09) |
| Mood page | `@public/designs/MoodPage.png` |
| Mood graph | `@public/designs/mood graph.png` |
| Stats + heatmap | `@public/designs/StatsPage.png` |
| Calendar | `@public/designs/CalenderPage.png` |
| Settings | `@public/designs/SettingsPage.png` |
| Palette / kit / dark / themes | `@public/designs/trakcer UI.png` |

Rules:

1. When the user @-attaches a design, **that image wins** over memory and text notes.
2. Read the attached image (and the matching file under `public/designs/`) **before** writing UI.
3. Match layout, spacing, status colors, and chrome — not just “purple theme”.
4. Filenames keep original spelling (`CalenderPage`, `trakcer UI`) — do not “fix” them in references.
5. After UI, `/imprint` records classes; designs remain the visual source of truth.

## Installed skills

| Skill | When to use |
|-------|-------------|
| `/remember restore` | Start of every session |
| `/architect` | Before non-trivial features — align decisions, produce implementation plan |
| `/imprint` | After building any UI component — record patterns in `ui-registry.md` |
| `/review` | After each feature — plan / system / production report |
| `/remember save` | End of every session — append to `memory.md` |
| `/recover` | When something is broken — diagnose failure mode before fixing |

Skills live in `.opencode/skills/`.

## Session workflow

```
/remember restore
    → confirm state
/architect (if needed)
    → confirm plan
Build (UI first vs designs, then wire logic)
/imprint after UI
/review after feature
Update context/progress-tracker.md
/remember save
```

## Hard rules

1. **Scope is sacred** — only what the current build-plan feature requires
2. **UI first** — full UI with mock data, visual check against `@public/designs/<File>.png`, then logic
3. **Designs are source of truth** — match Lavender Sky; sidebar layout; status colors; attach via `@public/designs/...`
4. **Heatmap is GitHub-style** using `--color-heat-0` … `--color-heat-4` (lavender ramp) — custom CSS grid, no extra packages
5. **Habit model** — one status per habit per day: `done` | `partial` | `missed`
6. **No PostHog, no AI SDKs, no analytics** — insights computed in `lib/insights.ts`
7. **Notifications** — settings toggles persist only; no push
8. **Never overwrite `memory.md`** — append-only via `/remember save`
9. **Tokens only** — no raw Tailwind palette classes, no hardcoded hex in components
10. **InsForge writes** go through Server Actions in `actions/` using `createInsforgeServer()`
11. **Pure logic** in `lib/stats.ts` / `lib/insights.ts` / `lib/utils.ts` — no React/DB imports
12. **Approved deps only** — see `context/code-standards.md`
13. **Next.js 16** — `proxy.ts` not `middleware.ts`; App Router; Server Components by default

## Folder map (quick)

- `app/` — routes and layouts
- `actions/` — Server Actions
- `components/` — UI by feature
- `lib/` — clients + pure helpers
- `types/` — shared types
- `context/` — living project context (update via skills)
- `public/designs/` — design PNGs
- `memory.md` — append-only session memory

## Definition of done (feature)

- Matches designs in light and dark
- `/imprint` updated if new patterns
- Wired to InsForge or pure helpers
- Empty states handled
- `/review` completed; issues triaged by developer
- `context/progress-tracker.md` updated
- `/remember save` run

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **habit-tracker-app** (API base `https://j7jw85z6.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
