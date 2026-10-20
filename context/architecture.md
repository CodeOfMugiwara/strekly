# Architecture

## Stack

| Layer            | Tool                         | Purpose                                  |
| ---------------- | ---------------------------- | ---------------------------------------- |
| Framework        | Next.js 16 (App Router)      | Full stack framework                     |
| Auth + DB        | InsForge                     | OAuth, Postgres, RLS                     |
| Styling          | Tailwind CSS v4 (`@theme`)   | Design tokens + utilities                |
| Charts           | Recharts                     | Bar, line, area, donut charts            |
| Heatmap          | Custom CSS grid              | GitHub-style contribution heatmap        |
| Icons            | lucide-react                 | UI icons                                 |
| Validation       | zod                          | Server Action / import schemas           |
| Language         | TypeScript strict            | Throughout                               |
| Analytics        | None                         | Explicitly out of scope                  |
| AI               | None                         | Explicitly out of scope                  |

---

## Folder Structure

```
/
├── AGENTS.md
├── memory.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── .opencode/skills/
│   ├── architect/
│   ├── imprint/
│   ├── recover/
│   ├── remember/
│   └── review/
├── app/
│   ├── layout.tsx                          → Root layout (Inter + Caveat)
│   ├── globals.css                         → Tailwind v4 @theme + dark + color themes
│   ├── page.tsx                            → Redirect to / or /login
│   ├── proxy.ts                            → Route protection (Next.js 16)
│   ├── (auth)/
│   │   ├── login/page.tsx                  → Google + GitHub OAuth
│   │   └── callback/page.tsx               → OAuth callback
│   ├── (app)/
│   │   ├── layout.tsx                      → Sidebar + topbar shell
│   │   ├── page.tsx                        → Home
│   │   ├── habits/page.tsx
│   │   ├── mood/page.tsx
│   │   ├── stats/page.tsx
│   │   ├── calendar/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       └── data/
│           └── export/route.ts             → JSON export download
├── actions/
│   ├── auth.ts                             → Session helpers
│   ├── habits.ts                           → Habit + category CRUD
│   ├── completions.ts                      → Habit status writes
│   ├── moods.ts                            → Mood level + entry writes
│   ├── notes.ts                            → Daily note writes
│   ├── settings.ts                         → Profile / preference saves
│   └── data.ts                             → Import, clear, delete, reset
├── components/
│   ├── ui/                                 → Primitives (Button, Card, Input, …)
│   ├── layout/                             → Sidebar, Topbar, PageHeader
│   ├── home/                               → Greeting, StatCards, TodayHabits, WeekStrip, QuickStats, MoodSelector
│   ├── habits/                             → HabitList, HabitRow, HabitForm, CategoryManager, Filters
│   ├── mood/                               → MoodGrid, MoodGraph, MoodDistribution, MoodInsights, NotesPanel
│   ├── stats/                              → CompletionChart, HabitRates, ConsistencyHeatmap, StreakHistory, KeyInsights
│   ├── calendar/                           → MonthGrid, DayDetails, MonthlyOverview, DayLegend
│   └── settings/                           → Appearance, Notifications, HabitPrefs, MoodSettings, ProfilePanel, DataManagement, DangerZone, About
├── lib/
│   ├── insforge-client.ts                  → Browser client
│   ├── insforge-server.ts                  → Server client (cookies)
│   ├── stats.ts                            → Pure streak/rate/aggregation helpers
│   ├── insights.ts                         → Pure key-insights computation
│   ├── themes.ts                           → Color theme definitions
│   └── utils.ts                            → cn, date helpers, matrix builders
├── types/
│   └── index.ts                            → Shared TypeScript types
└── public/
    └── designs/                            → Source-of-truth design PNGs
```

---

## System Boundaries

| Folder        | Owns                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| `app/`        | Pages, layouts, route handlers only. No business logic in pages.                              |
| `actions/`    | Server Actions for all UI-triggered mutations. All InsForge writes go through here.           |
| `components/` | UI only. No direct DB calls. No fetching in leaf components.                                  |
| `lib/`        | Third-party client init + pure utilities. `stats.ts` / `insights.ts` must stay pure.          |
| `types/`      | Shared TypeScript types.                                                                      |
| `context/`    | Living project context. Updated by skills (`imprint`, `remember`) — not imported by app code. |

There is **no** `agent/` folder. This project has no AI agents.

---

## Data Flow

### UI mutations (Server Actions)

```
User interaction in component
        ↓
Server Action in actions/
        ↓
InsForge DB write (server client, scoped to auth.uid())
        ↓
revalidatePath(...) for the affected page
        ↓
return { success, error? }
```

### Theme / color theme (client-side)

```
User picks theme in Settings
        ↓
Set document.documentElement data-theme / data-color-theme
        ↓
CSS variables in globals.css swap automatically
        ↓
Server Action persists choice on profiles row
```

### Export

```
User clicks Export
        ↓
GET /api/data/export  (or Server Action returning JSON)
        ↓
Read all rows for auth.uid()
        ↓
Return application/json attachment
```

### Import

```
User selects JSON file
        ↓
Client parses + zod-validates payload
        ↓
Server Action inserts rows in dependency order
        ↓
revalidatePath all app pages
```

---

## InsForge Database Schema

### `profiles`

| Column                   | Type      | Notes                                      |
| ------------------------ | --------- | ------------------------------------------ |
| id                       | uuid      | References auth.users, PK                 |
| display_name             | text      | Shown in greeting                          |
| tracker_title            | text      | Default: "Being New Version of Me Challenge" |
| welcome_message          | text      | Shown on Home                              |
| bio_note                 | text      | Optional profile note                      |
| theme_mode               | text      | light / dark / system                      |
| color_theme              | text      | lavender / mint / peach / ocean / rose / custom |
| custom_theme             | jsonb     | Optional overrides for custom              |
| week_starts_on           | integer   | 0=Sunday … 6=Saturday; default 1 (Monday)  |
| default_reminder_time    | text      | UI preference only in v1 (e.g. "08:00")    |
| show_completed_habits    | boolean   | default true                               |
| compact_habit_view       | boolean   | default false                              |
| notify_habit             | boolean   | UI toggle only                             |
| notify_daily_summary     | boolean   | UI toggle only                             |
| notify_mood              | boolean   | UI toggle only                             |
| notify_streak            | boolean   | UI toggle only                             |
| notify_missed            | boolean   | UI toggle only                             |
| mood_scale               | integer   | 5 or 7; default 5                          |
| enable_mood_notes        | boolean   | default true                               |
| mood_reminder_time       | text      | UI preference only                         |
| show_mood_on_calendar    | boolean   | default true                               |
| created_at               | timestamptz |                                          |
| updated_at               | timestamptz |                                          |

### `habit_categories`

| Column     | Type      | Notes                         |
| ---------- | --------- | ----------------------------- |
| id         | uuid      | PK                            |
| user_id    | uuid      | → profiles.id, CASCADE        |
| name       | text      | e.g. Health, Productivity     |
| color      | text      | Hex string for category dot   |
| sort_order | integer   |                               |

### `habits`

| Column       | Type         | Notes                            |
| ------------ | ------------ | -------------------------------- |
| id           | uuid         | PK                               |
| user_id      | uuid         | → profiles.id, CASCADE           |
| category_id  | uuid         | → habit_categories.id, SET NULL  |
| name         | text         |                                  |
| emoji        | text         | default 📝                       |
| description  | text         | Optional subtitle                |
| sort_order   | integer      | Custom order on Habits page      |
| active       | boolean      | false = archived                 |
| archived_at  | timestamptz  | null when active                 |
| created_at   | timestamptz  |                                  |

### `habit_completions`

| Column    | Type         | Notes                                      |
| --------- | ------------ | ------------------------------------------ |
| id        | uuid         | PK                                         |
| user_id   | uuid         | → profiles.id                              |
| habit_id  | uuid         | → habits.id, CASCADE                       |
| date      | date         | Local calendar date as YYYY-MM-DD          |
| status    | text         | CHECK in ('done','partial','missed')       |

Unique: `(habit_id, date)`.

### `mood_levels`

| Column     | Type    | Notes                           |
| ---------- | ------- | ------------------------------- |
| id         | uuid    | PK                              |
| user_id    | uuid    | → profiles.id                   |
| label      | text    | e.g. Very Happy                 |
| emoji      | text    |                                 |
| color      | text    | Hex                             |
| value      | integer | 1 = lowest … N = highest        |
| sort_order | integer |                                 |

Seed default 6 levels on profile creation (F26 scale — high = happier):

| value | label       | emoji | color   |
| ----- | ----------- | ----- | ------- |
| 6     | Very Happy  | 😊    | #86D6BF |
| 5     | Happy       | 🙂    | #FCD34D |
| 4     | Okay        | 😐    | #7DD3FC |
| 3     | Tired       | 😴    | #A8A29E |
| 2     | Sad         | ☹️    | #FC8FA5 |
| 1     | Fu*ked Up   | 🤯    | #A78BFA |

### `mood_entries`

| Column     | Type    | Notes                             |
| ---------- | ------- | --------------------------------- |
| id         | uuid    | PK                                |
| user_id    | uuid    | → profiles.id                     |
| date       | date    | YYYY-MM-DD                        |
| mood_value | integer | → mood_levels.value               |

Unique: `(user_id, date)`.

### `daily_notes`

| Column      | Type         | Notes                    |
| ----------- | ------------ | ------------------------ |
| id          | uuid         | PK                       |
| user_id     | uuid         | → profiles.id            |
| date        | date         | YYYY-MM-DD               |
| content     | text         |                          |
| created_at  | timestamptz  |                          |
| updated_at  | timestamptz  |                          |

Unique: `(user_id, date)`. Used for both calendar day notes and mood page notes for the same day.

---

## Row Level Security

Enable RLS on every table. Policies filter by `auth.uid()`:

- SELECT / INSERT / UPDATE / DELETE as appropriate per table
- `habit_completions`, `mood_entries`, `daily_notes` are user-owned rows keyed also by date/habit
- No shared or public data

---

## Authentication

- Provider: InsForge Auth
- Methods: Google OAuth, GitHub OAuth (SSR PKCE via `createAuthActions`)
- Protected routes: `/`, `/habits`, `/mood`, `/stats`, `/calendar`, `/settings` (via `proxy.ts`)
- Public routes: `/login`, `/callback` (page is optional), `/api/auth/*`
- Cookies (SDK-managed Feature 02): `insforge_access_token` (browser-readable), `insforge_refresh_token` (httpOnly), `insforge_code_verifier` (httpOnly during OAuth)
- `proxy.ts` runs `updateSession()` from `@insforge/sdk/ssr/middleware` then enforces login
- OAuth callback: `GET /api/auth/callback` exchanges code, seeds `profiles` + `mood_levels`, redirects to `/`
- Refresh: `POST /api/auth/refresh` via `createRefreshAuthRouter()`
- Env: `NEXT_PUBLIC_APP_URL` required for OAuth `redirectTo`
- On login → `/`

---

## Storage

**None in v1.** No file uploads. Export is a JSON download; import is a JSON file chosen by the user and parsed client-side before a Server Action write.

Do not create storage buckets unless a future feature requires them.

---

## Heatmap Spec (GitHub-style, Lavender palette)

Location: Stats page — Habit Consistency.

- Custom CSS grid (not Recharts)
- Columns = days (typically last ~26–35 weeks or current period), rows = habits or a single aggregated row
- Cell size ~10–12px, gap ~3px, radius ~2px
- Level mapping for a habit-day:
  - **0** no completion data / missed → `--color-heat-0`
  - **1** partial only → `--color-heat-1`
  - **2** done on some habits (aggregated view) or lower-intensity band → `--color-heat-2`
  - **3** strong completion → `--color-heat-3`
  - **4** all habits done → `--color-heat-4`
- Per-habit rows: 0 = missed/none, 4 = done (binary-ish: use heat-0 vs heat-4, or heat-0/2/4 for missed/partial/done)
- Tooltip on hover: date + habit name + status
- Month labels above columns (GitHub-style)
- Works in light and dark via the heat tokens; color themes may override heat ramp (already in globals.css)
- Legend: Less → More using the five heat tokens

---

## Styling Architecture

- Tailwind v4 only — tokens in `app/globals.css` `@theme`
- Dark mode: `[data-theme="dark"]` on `<html>`
- Color themes: `[data-color-theme="mint|peach|ocean|rose|lavender"]` overrides primary + heat
- Never define colors in `tailwind.config.ts`
- Never use built-in Tailwind palette classes in components
- Decorative script font (`font-script` / Caveat) only for accent quotes — never for body UI text

---

## Environment Variables

| Variable                      | Used In                 |
| ----------------------------- | ----------------------- |
| `NEXT_PUBLIC_INSFORGE_URL`    | lib/insforge-*.ts, auth |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | lib/insforge-*.ts, auth |
| `NEXT_PUBLIC_APP_URL`         | OAuth redirectTo        |

No other secrets in v1.

---

## Import Alias

Always `@/` — never deep relative imports beyond one level.

```typescript
import { createInsforgeServer } from "@/lib/insforge-server";
import { computeStreak } from "@/lib/stats";
```
