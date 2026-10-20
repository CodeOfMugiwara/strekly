# Project Memory

> **CRITICAL RULE: NEVER overwrite this file. Always APPEND or UPDATE in place.**
> When saving memory, read the existing content, then update the
> "Current Status" section and append a new session entry under "Session History".
> Never use the write tool to replace the entire file.

## Current Status

**Phase:** 13.3 — The theme reaches every surface + swatch placement corrected (Shipped)
**Last completed:** Three corrections. (1) The theme swatches were moved back to the **marketing page** (above the landing hero's product visual) and removed from the **signed-in app home** — the previous pass had them the other way round. (2) **The theme now reaches every surface.** The five reference themes (sage, clay, lagoon, berry, orchid) defined their DARK surfaces in *neutral greys*, so selecting lagoon repainted the page navy and left every card and the menu rail generic grey — the exact complaint in the developer's screenshot. Every surface family is now tinted with the theme's own hue (lagoon → teal-navy, clay → warm brown, sage → green, berry → plum, orchid → violet) and the dark hierarchy is **rail (deepest) → page → cards (lightest)** in all ten themes; the light surfaces of the five reference themes carry a little more hue too. (3) The five classic themes' rails got their own deeper tone so the same hierarchy holds everywhere. A contrast script that parses `globals.css` and evaluates the real cascade reports all 20 theme × mode combinations passing.
**Next:** Signed-in browser QA — click through the real authenticated pages (Home at `/home`, Habits, Mood, Stats, Calendar, Settings) and the sign-in → OAuth → app round-trip. Then the remaining product gaps: the `@radix-ui/react-tooltip` dependency is still unused.


---

## Session History

### Phase 2 Session Close (Complete)

**What was done:**
- End-of-session `/remember save` after Feature 08
- Confirmed: build + lint clean; Phase 2 Features 05–08 done; memory append-only; no secrets
- Home is live for signed-in users: check-in cycle, streaks, progress, mood + note save, week strip, quick stats

**Current state:** Phase 2 closed. Next work is Habits page (09–12). Date nav and Add Habit CTA still placeholders.

**Open questions:** (carry forward)
- Browser QA of Home check-in + mood after sign-in (OAuth provider callbacks)
- Date nav not wired (always today)
- Add Habit CTA → Habits page (Feature 09+)
- Architect before Features 24 (calendar day classes) if needed later

---

### Phase 2.08 — Mood Save + Week Strip (Complete)

**What was built:**
- `actions/moods.ts` — `saveMoodCheckin` (upsert mood_entries + daily_notes; empty note deletes)
- `lib/home-data.ts` — mood levels/entry/note, week day ratios, month quick stats, mood StatCard
- `lib/stats.ts` — `monthCompletionStats`, `vsPreviousMonthPercent`
- Wired `MoodSelector`, `WeekStrip`, `QuickStats`, `StatCards` mood card
- Phase 2 Home marked complete in progress-tracker

**Decisions made:**
- Single Save for mood + note
- DB mood levels with mock fallback
- enable_mood_notes hides note field
- No clear-mood in v1

**Open questions:**
- Date nav still not wired (always today)
- Add Habit CTA still non-navigating (Habits page next)
- Browser QA of full Home check-in + mood flow after sign-in

---

### Phase 2.06–07 — Check-in + Streaks (Complete)

**What was built:**
- `lib/stats.ts` — `accountDayStreak`, `accountLongestStreak`, `dayProgressPercent`, `isStreakDay`
- `actions/completions.ts` — `setHabitCompletion` (upsert / delete on unset)
- `lib/home-data.ts` — server loader (habits + completions + computed stats)
- `components/home/TodayHabits.tsx` — real data, cycle, pending state, empty state
- `components/home/StatCards.tsx` — props-driven progress/streaks (mood still mock)
- `app/(app)/page.tsx` — async Server Component

**Decisions made:**
- Features 06+07 shipped together
- Cycle: done → partial → missed → unset(delete)
- Only today's circles clickable
- Account streak: non-missed days; grace if today empty but yesterday active
- Progress weighted (done=1, partial=0.5)

**Open questions:**
- Add Habit CTA still non-navigating (Habits page Feature 09+)
- Date nav still not wired for past-day check-in
- Mood / WeekStrip / QuickStats mock until Feature 08

---

### Phase 2.05 — Home Page Full UI (Complete)

**What was built:**
- `lib/mock-home.ts` — Krishna profile, 7 Home habits + week statuses, mood 5-scale, week strip, quick stats, quotes (from `D:\habit-tracker\index.html` + HomePage.png)
- `components/home/Greeting.tsx`, `StatCards.tsx` (SVG progress ring), `TodayHabits.tsx`, `WeekStrip.tsx`, `InspirationCard.tsx`, `QuickStats.tsx`, `MoodSelector.tsx`, `QuoteCard.tsx`
- `app/(app)/page.tsx` — thin composer
- ui-registry Home patterns; progress-tracker Phase 2 started

**Decisions made:**
- Mock data only; local state for mood + check cycle
- Old tracker habit names/emojis; design 5-level moods (skipped crude old label)
- Extra DEF_HABITS stored in `mockHabitCatalog` for later

**Open questions:**
- Feature 06 still needs /architect for check-in cycle + Server Action
- Date nav / Add Habit / See All are non-navigating placeholders
- Browser visual QA vs HomePage.png not done this session

---

### Phase 1.04 Session Close (Complete)

**What was done:**
- End-of-session `/remember save` after review fixes + local command setup
- Confirmed: build + lint clean; memory append-only; no secrets
- Local commands ready under `.opencode/command/` (restart opencode to load `/` completions)

**Current state:** Phase 1 Features 01–04 done. Settings Appearance live with profile persist + visible save status. Auth + schema in place. Home still mock UI.

**Open questions:** (carry forward)
- Signed-in browser QA vs SettingsPage.png / dark + color themes
- OAuth Google/GitHub provider callbacks vs InsForge backend
- Login `?redirect=` not applied after OAuth
- Custom theme editor → Features 25–30
- Architect before Features 06 (check-in cycle) and 24 (calendar day classes)

---

### Phase 1.04 Review Fixes + Local Commands (Complete)

**What was done:**
- Moved `ProfileThemeSync` from root layout → `app/(app)/layout.tsx`; also gates on `getCurrentUser()` before hydrate
- ThemeProvider: debounced persist (300ms) + `persistStatus` / `persistError` in context
- AppearanceCard: user-visible Saving / Saved / Profile-sync-failed status line
- Added project commands under `.opencode/command/`: `remember`, `architect`, `imprint`, `review`, `recover`, `workflow`
- `opencode.json`: `$schema`, `instructions: [AGENTS.md]`, `skills.paths: [.opencode/skills]`

**Decisions made:**
- Persist failures are visible in UI, not console-only
- Skill commands live in project `.opencode/command/` (not global config)
- Restart opencode required to load new commands/skills

**Open questions:**
- Browser visual QA vs SettingsPage.png still needs a signed-in click-through
- OAuth provider callbacks still unverified end-to-end

---

### Phase 1.04 Review + Phase 1 Close (Complete)

**What was done:**
- Feature 04 `/review` completed — 0 critical issues
- Important leftover: browser visual QA of Settings/Appearance vs `SettingsPage.png` not done (needs signed-in session)
- Minors: persist failures only console-logged; non-Appearance cards are placeholders until Features 25–30
- Phase 1 Foundation closed in `progress-tracker.md` (Features 01–04)
- Context docs synced: ui-registry, library-docs, architecture, code-standards, build-plan

**Decisions made:**
- Next feature is Feature 05 Home Full UI (mock data first per build-plan)
- OAuth end-to-end browser check optional before Home logic; schema + auth wiring already in place

**Open questions:** (carry forward)
- Google/GitHub OAuth apps must accept InsForge backend callbacks
- Login `?redirect=` not applied after OAuth (always `/`)
- Custom color theme editor deferred to Features 25–30
- Calendar day classification + Home check-in cycle still need `/architect` before Features 24 / 06

---

### Phase 1.04 — Theme System + Settings Skeleton (Complete)

**What was built:**
- `actions/settings.ts` — `saveAppearance` + `loadAppearance` (profiles upsert/select)
- `components/layout/ThemeProvider.tsx` — persist on change after profile hydrate; `hydrateFromProfile()`
- `components/settings/ProfileThemeSync.tsx` — one-shot seed from profile when localStorage empty
- `components/settings/SettingsCard.tsx` — icon bubble + title/description pattern
- `components/settings/AppearanceCard.tsx` — Light/Dark/System + Lavender/Mint/Peach/Ocean/Rose/Custom (disabled)
- `components/settings/SettingsShell.tsx` — full 3-column settings skeleton vs SettingsPage.png
- `app/(app)/settings/page.tsx` — wires shell
- `app/layout.tsx` — mounts ProfileThemeSync inside ThemeProvider
- `app/globals.css` — `--color-swatch-*` tokens

**Decisions made:**
- Full card skeleton; only Appearance functional this feature
- localStorage first for paint; profile seeds empty storage; profile catches up on change
- Auto-persist on every appearance change (no save button)

**Problems solved:**
- Theme FOUC avoided by localStorage-first + deferred profile hydrate
- Persist gated until after hydrate so seed does not rewrite profile

**Open questions:**
- Custom theme editor still deferred (Features 25–30)
- Manual browser QA of dark + color themes against designs not done this session

---

### Phase 1.02 — Auth + Schema (Complete)

**What was built:**
- InsForge schema migration `migrations/20261005051455_create-habit-tracker-schema.sql` — profiles, habit_categories, habits, habit_completions, mood_levels, mood_entries, daily_notes + RLS + indexes + updated_at triggers
- `actions/auth.ts` — `initiateOAuth` (google/github) + `signOut`
- `app/api/auth/refresh/route.ts` — `createRefreshAuthRouter`
- `app/api/auth/callback/route.ts` — PKCE exchange, seed profile + 5 mood_levels, redirect `/`
- Login page wired to OAuth buttons (Google/GitHub) with error + pending states
- `components/layout/UserMenu.tsx` — avatar menu + sign-out
- `proxy.ts` — `updateSession()` + protect `/` and app routes
- `lib/insforge-server.ts` / `insforge-client.ts` — SDK 1.5.2 SSR clients
- `.env.local` — `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `insforge.toml` — `allowed_redirect_urls` for localhost
- Deleted conflicting `app/page.tsx` and unused `(auth)/callback/page.tsx`
- Context docs updated: library-docs, code-standards, architecture, progress-tracker, ui-registry

**Decisions made:**
- Full schema pulled into Feature 02 (not deferred to 03)
- SDK-managed cookies: `insforge_access_token` / `insforge_refresh_token` (not `ht_access_token`)
- OAuth mutations only on server via `createAuthActions`
- DB API: `insforge.database.from(...)`; auth: `getCurrentUser()`
- User fields: `metadata` + `profile.name`

**Problems solved:**
- Route conflict: `app/page.tsx` vs `(app)/page.tsx` both mapped to `/` — removed root page
- Seed needed response cookies after exchange, not request cookies
- SDK type errors: `.from` → `.database.from`; `user_metadata` → `metadata`/`profile.name`

**Current state:** Build + lint clean. 7 tables live. Login UI ready. Manual OAuth login not yet verified in browser (provider apps must accept InsForge backend callbacks).

**Open questions:**
- Confirm Google/GitHub OAuth apps in InsForge dashboard point at backend callbacks
- Login `?redirect=` param is stored but not applied after OAuth (always lands on `/`)
- Seed failure is non-blocking (logged) — Home still mock until Feature 05+

---

### Phase 1.01 — App Shell + Design Tokens (Complete)

**What was built:**
- `components/layout/ThemeProvider.tsx` — light/dark/system + color themes; localStorage keys `ht_theme_mode`, `ht_color_theme`; sets `data-theme` / `data-color-theme`
- `components/layout/Sidebar.tsx` — fixed sidebar, lucide nav icons, active state, script quote footer
- `components/layout/Topbar.tsx` — sun/moon theme toggle + avatar K
- `components/ui/Button.tsx`, `Card.tsx`, `Input.tsx` — primitives matching ui-registry baseline
- `app/(app)/layout.tsx` — client shell composing Sidebar + Topbar
- `app/layout.tsx` — wraps children in ThemeProvider
- `app/(app)/page.tsx` — Home mock UI vs HomePage.png (greeting, date nav, stat cards, habits list, week strip, quick stats, mood row, quotes)
- `proxy.ts` — protectedRoutes emptied for Feature 01 (restore Feature 02)

**Decisions made:**
- Client-side theme until Feature 04 persists to InsForge profile
- Proxy off until auth so `/` is reachable
- Mock data only on Home — no DB yet

**Problems solved:**
- None blocking; build + lint path clean after shell

**Open questions:** (unchanged from Phase 0)
- InsForge OAuth cookie names — Feature 02
- Calendar day classification — Feature 24 /architect
- Home check-in cycle — Feature 06 /architect

---

### Phase 0.01 — Design path convention (Complete)

**What was built:**
- Deleted root `D:\habit-tracker-app\designs` (duplicate)
- Kept `public/designs/` as sole source of truth (8 PNGs)
- `AGENTS.md` — Design references section + `@public/designs/` attach map + rules
- `context/build-plan.md` — feature→design attach map; Feature 01 notes proxy off until auth
- `context/ui-rules.md`, `code-standards.md`, `ui-tokens.md`, `project-overview.md`, `architecture.md` path updates
- `app/globals.css` comment → `public/designs/`
- `README.md` design path

**Decisions made:**
- Attach path: `@public/designs/<File>.png`
- Filenames keep typos (CalenderPage, trakcer UI)
- Attached design image wins over memory/text during UI work
- Feature 01 may temporarily relax `proxy.ts` until auth (Feature 02)

**Problems solved:**
- Dual designs folders → single `public/designs/`

**Open questions:** (unchanged)
- InsForge OAuth cookie names — Feature 02
- Calendar day classification thresholds — Feature 24 /architect
- Home check-in cycle — Feature 06 /architect

---

### Phase 0.00 — Context System + Scaffold (Complete)

**What was built:**
- `D:\habit-tracker-app` — Next.js 16 + TypeScript + Tailwind v4 scaffold
- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `.env.local`, `opencode.json`
- `app/globals.css` — full Lavender Sky `@theme` tokens, `[data-theme="dark"]`, color theme overrides (mint/peach/ocean/rose/lavender), heatmap `heat-0`…`heat-4`
- `app/layout.tsx` — Inter + Caveat via next/font
- `app/page.tsx` — redirect to `/login`
- `proxy.ts` — Next.js 16 route protection for app routes
- `app/(auth)/login/page.tsx` + `callback/page.tsx` — placeholder UI
- `app/(app)/layout.tsx` — sidebar + topbar shell (placeholder nav)
- `app/(app)/{habits,mood,stats,calendar,settings}/page.tsx` — placeholders
- `app/(app)/page.tsx` — Home placeholder matching design language
- `lib/insforge-client.ts`, `lib/insforge-server.ts` — InsForge SDK setup (`@insforge/sdk/ssr`, cookie `ht_access_token`)
- `lib/stats.ts`, `lib/insights.ts`, `lib/utils.ts` — pure helpers (streaks, ratios, key insights, date matrix)
- `types/index.ts` — Profile, Habit, HabitCompletion, MoodEntry, etc.
- `context/` — project-overview, architecture, ui-tokens, ui-rules, ui-registry, code-standards, library-docs, build-plan, progress-tracker
- `.opencode/skills/` — architect, imprint, recover, remember, review copied from `D:\habit-tracker\skills`
- `.opencode/skills/remember/SKILL.md` — **adapted to JobPilot append-only memory model**
- `AGENTS.md` — session workflow + hard rules
- `public/designs/` — all 8 design PNGs copied for visual source of truth

**Decisions made:**
- Stack: Next.js 16 + InsForge + Tailwind v4 + Recharts + zod + lucide-react
- Location: `D:\habit-tracker-app` (reference material stays in `D:\habit-tracker`)
- Auth: Google + GitHub OAuth via InsForge
- Habit status model: single `done` | `partial` | `missed` per habit per day
- Heatmap: GitHub contribution style, custom CSS grid, lavender heat tokens
- No PostHog, no AI, no localStorage migration, notifications are UI-only
- Memory: append-only `memory.md` (Current Status + Session History)
- Context home: `context/` + root `AGENTS.md` + `memory.md`
- Design PNGs also at `public/designs/` inside the app repo

**Problems solved:**
- None in-app yet — scaffold only

**Open questions:**
- Exact InsForge OAuth cookie names / SDK auth methods — confirm when implementing Feature 02 against installed SDK types
- Day classification thresholds for Calendar “great / okay / tough” — confirm in architect session before Feature 24
- Habit check UI cycle on Home (toggle done vs full cycle through partial/missed) — confirm in architect session before Feature 06

---

### Phase 3.09 — Habits Page Month Grid (Complete, UI redirected)

**What was built:**
- `lib/mock-habits.ts` — 9 habits from old tracker screenshot; statuses + notes keyed by full `YYYY-MM-DD` (September 2026 days 13–21 + notes); `MOCK_VIEW` = Sept 2026, `MOCK_TODAY` = Oct 11 2026
- `components/habits/MonthNav.tsx`, `HabitGridCard.tsx` (responsive `minmax(0,1fr)` day columns, h-7 cells, sticky-free w-44 labels at `text-[13px]`), `NoteModal.tsx`
- `components/ui/Switch.tsx`, `components/ui/Dropdown.tsx` (Dropdown unused after redirect — kept for later)
- `app/(app)/habits/page.tsx` — client page: month nav, cell cycle `unset→done→partial→missed→unset`, notes modal (empty save deletes), Add Habit no-op
- **Global shell:** `components/layout/Topbar.tsx` deleted; `app/(app)/layout.tsx` simplified; `Sidebar.tsx` footer now has Dark Mode switch + `UserMenu` avatar (menu opens upward) — old-tracker layout, affects all pages
- Review done (2 doc-drift issues fixed as housekeeping); ui-registry, build-plan Phase 3, AGENTS.md design map, progress-tracker all synced

**Decisions made:**
- **Major redirect:** Habits page = old tracker month grid (`D:\habit-tracker\index.html`), NOT HabitsPage.png row-list. First built the row-list (FilterTabs/HabitRow/sidebar cards), then deleted it all same session when developer compared with old tracker screenshots
- Completed filter tab: developer agreed useless — removed with the row-list
- Data month-scoped via full-date keys so navigation doesn't repeat data across months
- Status colors: success/warning/error tokens (mint/yellow/red) with matching foregrounds; legend chips included
- Notes icon: lucide `StickyNote` (developer rejected FileText)
- Topbar removed globally per "make it exactly like old tracker"; theme + profile moved to sidebar bottom
- Page opens September 2026 (data month) rather than today

**Problems solved:**
- Initial mock keyed by day-of-month only → data appeared in every month; fixed with `YYYY-MM-DD` keys
- Grid oversized (32px fixed cells + horizontal scroll + cut-off header); fixed with flexible `minmax(0,1fr)` columns, h-7 cells, tightened spacing
- Habit name truncation ("Wake up at 8:00 …"); fixed with w-44 label + text-[13px] + whitespace-nowrap

**Current state:** Feature 09 complete and developer-confirmed ("it looks fine"). Build + lint clean. Grid is mock-only; Add Habit button is a no-op.

**Open questions:**
- Feature 10 CRUD shape: form modal from Add Habit button; edit/archive/delete entry point on grid rows not yet designed (no kebab on grid) — needs /architect or quick alignment
- Feature 12: cell-click persistence will replace mock cycle; notes → `daily_notes`
- `Dropdown` primitive unused — either use in Feature 10 modals or drop later
- Browser QA of Home + Habits after OAuth sign-in still not done end-to-end
- Calendar page (Phase 6) design vs old tracker — may need similar redirect discussion; CalenderPage.png is still canonical unless developer redirects

---

### Phase 3.10–12 + Design-First Rewrite (Complete — Phase 3 closed)

**What was built:**
- **F10 CRUD:** `lib/habits-data.ts` loader, `actions/habits.ts` (create/update/archive/delete, zod in `lib/habit-form.ts`), `HabitFormModal` (name/emoji/desc/category; Archive/Restore + two-step Delete); page split into async server page → `HabitsView` client; grid name = edit entry point
- **F11 Categories:** `actions/categories.ts`, `lib/category-form.ts` (preset 5 swatches), `lib/settings-data.ts`, `components/settings/CategoriesCard.tsx` — functional Settings card, inline CRUD; wired into `SettingsShell`
- **F12 Wiring:** cells → `setHabitCompletion` (optimistic, reverts on fail; now revalidates `/habits`); notes → `actions/notes.ts` `saveDayNote`/`deleteDayNote`; native HTML5 drag reorder (`reorderHabits`, GripVertical); `loadHabitsPageData()` one-time seeds 9 demo habits + Sept completions + notes when table empty; loads ALL completions + notes; default month = latest activity
- **Bug fix:** duplicate demo habits (seed's existence check failed open on error/race) — added `dedupeSeedHabits()` self-heal on every load (keeps earliest per seed name, deletes rest + cascades) + fail-closed check
- **Design-first rewrite:** `context/build-plan.md` fully rewritten (Design System: palette, logo/branding, exact mood-face table, UI kit; per-page specs from all 8 PNGs; design-wins rule); `context/ui-tokens.md` +Mood Faces + Logo & Branding sections (shared `MoodFace` component rule; leaf SVG upgrade noted); mood seed aligned (Sad ☹️ #FC8FA5, Very Sad 😞 #A78BFA); progress-tracker synced

**Decisions made:**
- Categories manage UI lives in Settings (developer choice), not Habits page; inline in card, no modal; preset swatches only
- Mock fallback replaced by one-time DB seed + dedupe ("maintain the data" — Sept grid persists as real rows)
- `lib/mock-habits.ts` is seed-source only
- Reorder: native HTML5 DnD, no new deps; active rows only; sort_order renumbered 0..n
- Personal-scale: loader fetches all completions + notes in one pass
- **Design priority locked:** designs beat text notes; MoodPage.png canonical (mood graph.png flavor only); HabitsPage.png retired; custom mood faces = solid pastel circle + glyph from DB `mood_levels`, one shared component everywhere
- Pre-existing accounts keep old mood colors until Feature 28 (seed change only affects new signups)
- Deferred polish: leaf SVG logo mark, sidebar botanical art, scenic decorative cards

**Problems solved:**
- `"use server"` files can't export values — zod schemas moved to `lib/*-form.ts`
- `react-hooks/set-state-in-effect` — render-phase prop sync pattern in HabitsView
- Seed re-ran every load (check failed open) → fail-closed + dedupe healing
- SDK select shape uncertainty — used data-array check (same shape as working main load), not head/count

**Current state:** Phase 3 fully complete (09–12) and building against DB. Build + lint clean. Duplicate-habit bug fixed (dedupe runs on next load). Design docs (build-plan, ui-tokens, progress-tracker) are the design-first source of truth.

**Open questions:**
- Browser QA: F10–12 flows (CRUD, categories, cell/note wiring, drag) + duplicate cleanup — signed-in click-through not done
- Feature 13 architect started then paused for the rewrite: Daily/Weekly/Monthly tabs = chrome-only, Daily content only; mock `lib/mock-mood.ts` should match design counts (8/10/7/4/2) — confirm when resuming
- Existing seeded accounts' `mood_levels` colors drift from design until Feature 28
- Feature 24 day-classification thresholds still need /architect

---

### Phase 4.13–14 — Mood Page + Logging (Complete)

**What was built:**
- **F13:** `components/ui/MoodFace.tsx` — shared SVG face (procedural eyes/mouth per value 5→1 + glossy radialGradient overlay with useId); `lib/mock-mood.ts` (July 2026 design-matching data, later deleted); `components/mood/` — MonthCard (nav, Daily/Weekly pills, date strip, clickable legend chips), MoodGraphCard (Recharts area, face y-axis, custom tooltip), NotesCards, MoodSidebar (donut + insights + decorative); `MoodView` + thin server page; Home retrofit (MoodSelector + StatCards use MoodFace; `HomeMoodLevel`/`HomeMoodCard` gained `color`/`value`)
- **F14:** `lib/mood-view.ts` (pure types/builders, client-safe) + `lib/mood-data.ts` (server loader `loadMonthMood`); `actions/moods.ts` +`setDayMood` +`getMonthMood`; `saveMoodCheckin` note param now `undefined`=don't-touch / `""`=delete / string=upsert, +revalidates `/mood`; MoodView rewritten for real data (optimistic chip-set, note Save/Delete, month nav fetch, View All modal, empty states); `lib/mock-mood.ts` deleted
- **Review + fixes:** local `/review` run (3 issues); fixed — Home mood save no longer deletes notes when `enable_mood_notes` off; StatCards empty mood = neutral dashed bubble (no fake Okay face); MonthCard strip auto-scrolls selected day into view (scrollIntoView inline:center)

**Decisions made:**
- F13 faces = pure SVG, **no system emoji** (developer request after seeing F13 v1); glossy gradient = radialGradient white 45%→black 6%, top-left focus
- Legend chips on Mood page = clickable mood setters for selected day; strip day = select only
- F14 real-only, **no demo seed** (developer choice — contrasted with Habits' seed-and-maintain)
- **Module split pattern:** pure types/builders in separate client-safe file; server loader (next/headers) never imported through a shared module — Turbopack broke the client bundle when MoodView imported mood-data directly
- Selected-day column = `border-2 border-primary bg-surface shadow-card` outlined box (not filled pill)
- DB `mood_levels.emoji` column kept for compatibility but UI draws SVG from `value`+`color` only

**Problems solved:**
- Runtime error in NotesCards (entries undefined) — mid-flight prop mismatch during F14 rewrite; resolved by completing MoodView rewrite
- Turbopack "next/headers in Pages Router" build error — module graph pulled server loader into client bundle via shared types module; split mood-view/mood-data
- Review finding: disabled mood notes + Home save = silent note deletion (undefined-note semantics added)

**Current state:** Phase 4 Features 13–14 complete; build + lint clean. Mood page fully real: log from Home card or Mood page (select day → tap face chip; note Save in Notes card). Tabs/period dropdown still visual-only. Signed-in browser QA of F13–14 not done this session.

**Open questions:**
- Feature 15 scope: graph/donut/insights already real for the month — decide whether 15 = period dropdown wiring (This Month/3 Months/Year ranges) or just polish + fold into 16
- Daily/Weekly/Monthly pills still chrome-only — decide keep-deferred or drop from UI
- Signed-in QA: mood log flows (Home + Mood page), month nav, View All modal, empty-month states
- Same carry-forwards: OAuth end-to-end QA, Feature 24 thresholds, mood seed color drift on old accounts until F28

---

### Phase 4.15–16 — Graph Period + Mood Insights (Complete — Phase 4 closed)

**What was built:**
- **Pre-F15 bugfixes (4):** graph tooltip hardcoded `Jul {day}, 2026` → real date via point `dateLabel`; Y-axis domain `[1,5]` → derived from `levels`; NotesCards draft reset keyed `year-month-day` (day-only key left stale note text across month-nav on day 1); `saveDayNote`/`deleteDayNote` revalidation corrected (see decisions)
- **F15:** `lib/mood-view.ts` +`GraphPeriod`, `MoodRangeData`, `GraphSeriesPoint`, `getRangeBounds`, `buildMonthGraphSeries`/`buildRangeGraphSeries`; `lib/mood-data.ts` +`loadMoodRange`; `actions/moods.ts` +`getMoodRange`; `MoodGraphCard` rewritten (unified series, dynamic subtitle, `dataKey="tick"`); `MoodView` owns period state, fetch-on-change with revert-free failure handling, range refetch on month nav
- **F15 review fixes (5/5):** removed `revalidatePath("/mood")` from all 4 mutations (view-snap bug); visible `loadError` alerts for month/period/range fetch failures; dropped unused `MoodRangeData.levels` + `loadLevels` helper
- **F16:** `lib/insights.ts` +`buildMoodInsightRows` (phrase = `Felt ${label.toLowerCase()}`) + `computeMoodPattern` (weekend-vs-weekday → half-month trend → null; ≥3 days/side, ≥0.5 avg gap); `MoodSidebar` takes `insightRows` prop, hardcoded value→phrase map removed; `MoodView` computes rows + pattern with honest fallbacks (fake `"You felt happier on weekends…"` deleted)
- Context docs synced throughout: progress-tracker (Phase 4 closed), build-plan (F15/F16 ✅), ui-registry mood section (Last updated: Feature 16)

**Decisions made:**
- F15 = wire the period dropdown (original month-wiring had shipped in F14); **graph-only scope** — Distribution + Insights stay selected-month (design puts no period control on those cards)
- Periods anchor to the selected month: `month` = selected month; `90d` = selected + 2 prior; `year` = Jan 1 → end of selected month; month nav shifts the window; nothing anchors to real today
- `month` reuses loaded data (no fetch); wider ranges fetch `getMoodRange`; period flips only after fetch succeeds
- Unified `GraphSeriesPoint` (`key`/`tick`/`dateLabel`/`value`/`note`) — note rides on the point, tooltip needs no separate prop
- **No `revalidatePath("/mood")` from any mutation** — Next's revalidation replaces `initialData`, and MoodView's render-phase sync would snap the viewed month back to server "today" (and desync range bounds); `/mood` is dynamic, refetched on navigation; client view state is authoritative after load
- F16 pattern = one defensible sentence or nothing; **averages make it scale-agnostic** (no `mood_scale` branching — 7-scale migration stays F28); phrases derive from labels
- Fallback copy: zero data → "Log a few moods…"; thin data → "Not enough data to spot a pattern yet."

**Problems solved:**
- NotesCards stale draft when navigating months while on day 1 (reset key was day-only)
- View-snap + stale range bounds class of bugs killed at the revalidation root
- Period/month/range fetch failures were console-only → now `loadError` alert line under page header (`text-error-foreground`, `role="alert"`)
- Review of both features run: F15 found 5 (all fixed), F16 found 0

**Current state:** Phase 4 fully complete (13–16). Build + lint + tsc clean. Mood page: real logging, month nav, graph period dropdown (month/90d/year), donut + insights + real pattern line, notes CRUD. Daily/Weekly/Monthly pills still chrome-only. Signed-in browser QA of F13–16 not done.

**Open questions:**
- Signed-in QA pass: mood log (Home + Mood page), month nav, period dropdown (all 3 options + range refetch on nav), View All modal, insights/pattern on empty vs populated months
- Daily/Weekly/Monthly pills — keep deferred or drop from UI (decide before Phase 5 or when touched next)
- Carry-forwards: OAuth end-to-end QA; login `?redirect=` not applied after OAuth; Feature 24 day-classification thresholds need /architect; mood seed color drift on old accounts until F28
- Phase 5 next: Feature 17 Stats Page — Full UI, mock first vs `@public/designs/StatsPage.png`

---

### Phase 5.17 — Stats Page Full UI (Complete)

**What was built:**
- `lib/mock-stats.ts` — July 2026 design-matching mock: KPIs (78% / 12 / 28 / 7/7), 14-day completion series (half-step weighted done → derived percents, Jul 8 = 86% = 6/7), 7 design habits with per-habit bar hexes, 7×31 heatmap status matrix (single-char codes), 31-day streak series (chip 12), 3 Key Insight rows verbatim from design
- `components/stats/` — `StatsView` (client shell, pills + dropdown state), `KpiCards` (icon bubbles target/flame/crown/chart, green ↑ deltas), `CompletionOverviewCard` (Recharts bars, custom tooltip "date / % / n/7 habits", Daily/Weekly/Monthly/Yearly pills), `HabitRateCard` (emoji tile + tinted bar + %), `HabitConsistencyCard` (custom CSS grid `6.5rem repeat(31,…)`, `heat-4/2/1` cells, Missed/Partial/Completed legend, Jul axis ticks), `StreakHistoryCard` (Recharts area + gradient + "N days" chip), `KeyInsightsCard` (sparkle header + This Month Dropdown + icon rows), `StatsDecorativeCard` (gradient wash + script "Discipline today creates the freedom")
- `app/(app)/stats/page.tsx` — non-async page → StatsView (mock needs no loader)
- `/imprint` → `context/ui-registry.md` "Stats page shell (Feature 17)" entry
- `context/progress-tracker.md` + `context/build-plan.md` synced (F17 ✅ + decisions)

**Decisions made:**
- **Heatmap = custom CSS grid, NO library.** Developer proposed `uiw/react-heat-map` or shadcn-heatmap; rejected together: GitHub layout (weeks×weekdays) mismatches design (habits×month-days), hard rule 4 / build-plan rule 5 = Recharts-only deps, shadcn = copy-paste anyway and wouldn't match `heat-0…4` tokens without rewrite
- Heat mapping: missed→`heat-1`, partial→`heat-2`, completed→`heat-4`, empty→`heat-0`; legend dots match
- Mock = F13 pattern: `lib/mock-stats.ts` matches StatsPage.png exactly; throwaway when F18–21 wire real data
- Pills + insights dropdown = real toggle state, content static until F18/F21
- Per-habit bar hexes in data file → inline style (cross-cutting rule 1 allows)
- Decorative card = gradient-wash + script + glyphs (exact scenic art deferred to polish pass)

**Problems solved:**
- Review found 3 minors, all fixed same session: dead `captionMuted` field removed; duplicate lucide-react imports merged; bar heights had only 7 quantized steps → half-step weighted `done` values (4.5/5.5) so percent = `round(done/7*100)` gives design-like variance while tooltip stays honestly derived (Jul 8: 86% = "6/7 habits")

**Current state:** Feature 17 complete. Build + lint + tsc clean. Stats page renders full design on mock. Pills/dropdown chrome-only. Heatmap is pure CSS grid with tokens (works in dark + color themes by construction).

**Open questions:**
- Signed-in browser visual QA of Stats vs StatsPage.png (light + dark) not done — joins the F13–16 QA carry-forward
- Feature 18 scope: period pills should drive Overview + which other cards? (build-plan says "all cards/charts" — confirm anchoring: real today vs selected month, Mood F15 anchored to selected month but Stats design has no month nav)
- Carry-forwards unchanged: OAuth e2e QA; login `?redirect=`; F24 thresholds /architect; mood seed color drift until F28; Daily/Weekly/Monthly pills on Mood page keep-deferred-or-drop

---

### Phase 5.18 — Completion Aggregations (Complete)

**What was built:**
- `lib/stats.ts` + pure rollups/types: `buildCompletionSeries` (Daily=month-to-date; Weekly=last 12 Monday weeks — dev chose 12 over 8; Monthly×12; Yearly years-with-data cap 5; weighted done=1/partial=0.5 over active habits × elapsed days; clips pre-first-activity), `buildStatsKpis`, `streakEndingOn`, `streakSeriesForMonth` (cross-month runs via `activeRunEnding`), `buildStatsHeatRows` (future/unlogged → `none` = `bg-heat-0`), `HABIT_TINTS`, plus `StatsData`/`StatsGranularity`/`CompletionBucket` types
- `lib/stats-data.ts` — server loader (auth gate, habits incl archived, ALL completions filtered to active ids, current-month mood_entries)
- `app/(app)/stats/page.tsx` → async → `StatsView({ data })`; StatsView computes all six surfaces; zero `mock-stats` imports
- Cards updated: CompletionOverview (real buckets, empty states, tooltip "habits"/"check-ins", weekly `interval={1}`), KpiCards (`StatsKpis`, sign-aware delta), HabitRateCard (tint ramp + empty), HabitConsistencyCard (`none` cell + dynamic ticks + empty), StreakHistoryCard (dynamic axes, empty = `maxVal===0`), KeyInsightsCard (`computeKeyInsights` this-month)
- `/imprint` → ui-registry Stats entry rewritten for F18; build-plan F18 ✅; progress-tracker F18 ✅ + decisions

**Decisions made (architect session):**
- Option B: flip EVERYTHING to real in F18 (no mixed mock/real page); F19–21 = refinement passes; `mock-stats.ts` zero importers — delete candidate at F21
- Pills card-local to Completion Overview (design-literal; "Yearly" meaningless for heatmap); ranges anchored to real today (Stats has no month nav); multi-day tooltip wording "check-ins"
- Insights = `computeKeyInsights` fixed this-month; dropdown chrome until F21; KPIs not pill-driven; Active Habits = active/total incl archived

**Problems solved (review — 4/4 fixed):**
- Home vs Stats mid-month mismatch: Home divided current-month rate by FULL month days, Stats by elapsed → Home now passes `today` as range end (both use `monthCompletionStats`, ranges now agree)
- Archived-habit inflation: both `home-data.ts` and `stats-data.ts` now filter completions to active habit ids (capacity was active-count while numerator included archived)
- Streak series restarted at 0 on day 1 (undercounted cross-month runs; last point ≠ chip) → per-day `activeRunEnding` walk incl today's grace rule — last point always equals `accountDayStreak`
- Unreachable streak empty branch → now `maxVal === 0`; weekly axis 12 long labels → `interval={1}`; (also mid-build JSX paren typo in HabitConsistency cells map)

**Current state:** F18 complete. Build + lint + tsc clean; `/stats` dynamic (ƒ). All cards real with empty states; Home Quick Stats now month-to-date. Signed-in browser QA of F17–18 still not done.

**Open questions:**
- Signed-in QA: pill switching (all 4 granularities + labels/tooltips), empty vs populated accounts, KPI deltas incl negative, heat `none` cells (future days), streak chip === chart endpoint, Home Quick Stats vs Stats KPI agreement mid-month
- `lib/mock-stats.ts` unreferenced — delete at F21 review
- F19 scope: category colors for habit-rate bars + whether `habitRate` (partial counts as full) should switch to weighted partial
- Carry-forwards: OAuth e2e QA; login `?redirect=`; F24 thresholds /architect; mood seed color drift on old accounts until F28; Mood page pills keep-deferred-or-drop

---

### Phase 5.19 — Habit Completion Rates (Complete)

**What was built:**
- `lib/stats.ts` — `weightedHabitRate(completions, habitId, from, to, createdAt)`: done=1/partial=0.5/missed=0 over active days = `max(periodStart, createdDate) → periodEnd` (guard: created after period end → 0; tz-safe `formatLocal(new Date(createdAt))`); removed old `habitRate` (only caller was StatsView)
- `lib/stats-data.ts` — habits select += `category_id, created_at`; + `habit_categories` query → `categoryColors: Record<string, string>` on `StatsData`; `StatsHabit` += `categoryId`, `createdAt`
- `StatsView` — rate rows: percent via `weightedHabitRate`; color = `categoryColors[habit.categoryId] ?? HABIT_TINTS[i % n]`
- `HabitRateCard` unchanged (already props-driven percent + color); `/imprint` → ui-registry (Stats entry → Features 17–19, rate-row line)
- build-plan F19 ✅ + shipped note; progress-tracker F19 ✅ + decisions

**Decisions made (architect session, all confirmed in language step):**
- Weighting switch: partial now 0.5 not full credit — %s drop where partials exist; aligns with Overview/KPI math
- "Active days" = elapsed period ∩ days since habit creation (new habits not penalized pre-creation)
- Color priority: category preset hex → tint ramp by list index; FK SET NULL on category delete makes fallback automatic; failed category fetch degrades to tints
- Period = month-to-date fixed (pills stay card-local per F18); bar order = habit sort_order (not sorted by %)
- Insights' strongest-habit math untouched (F21 scope)

**Problems solved:** none blocking — build/lint/tsc clean first try; review found 0 issues.

**Current state:** F19 complete. Rate card fully real: category-colored bars + weighted percentages. `lib/mock-stats.ts` still unreferenced (delete at F21). Signed-in QA of F17–19 not done.

**Open questions:**
- Signed-in QA additions: category colors visible on rate bars (create category → assign → Stats); rate % dropped vs F18 for partial-heavy habits (expected); habit created mid-month doesn't get pre-creation days counted
- F20 scope question: heatmap grid + heat tokens + `none` cells + title tooltips already shipped in F17/F18 — F20 may be mostly richer hover tooltips + dark/color-theme verification; confirm scope when starting
- `lib/mock-stats.ts` unreferenced — delete at F21 review
- Carry-forwards: OAuth e2e QA; login `?redirect=`; F24 thresholds /architect; mood seed color drift until F28; Mood page pills keep-deferred-or-drop; F17–18 browser QA backlog

---

### Phase 5.20 — Consistency Heatmap Finish + GitHub-exact Mint (Complete)

**What was built:**
- `components/stats/HabitConsistencyCard.tsx` — `"use client"`; hover state (cell `onMouseEnter` stores habit/date/status/`getBoundingClientRect`); single fixed-position tooltip (escapes `overflow-x-auto`) rendered offscreen first pass (`left:-9999`) then measured in `useEffect`: X-clamped to viewport edges, flips below when < height+10 from top; clears on cell leave, container leave, any scroll (capture listener in effect); content = habit name (semibold) + "Oct 11, 2026 · Completed"; `role="tooltip"`; cells now `role="img"` + `aria-label`; native `title` removed
- `app/globals.css` — new tokens `--color-tooltip: #1f2328` + `--color-tooltip-foreground: #ffffff` (same both modes, GitHub-style); **Mint light heat ramp = GitHub exact**: `#ebedf0/#9be9a8/#40c463/#30a14e/#216e39` (first time a theme themes `heat-0`); **new `[data-theme="dark"][data-color-theme="mint"]`** `#161b22/#0e4429/#006d32/#26a641/#39d353` (specificity 0,2,0 beats base dark; only theme with a dark heat block — theme heat was otherwise light-scoped so dark+Mint would have stayed purple)
- Docs: ui-registry (Stats entry → Features 17–20, heat tooltip row + F20 Mint/token notes), ui-tokens (Mint GitHub + tooltip tokens sections), build-plan F20 ✅, progress-tracker F20 ✅ + decisions

**Decisions made (architect session):**
- Option (b) JS fixed tooltip over CSS-only (clipped by overflow) and native title (unstyled); touch loses long-press tooltip — accepted
- "Mint" = **retune existing Settings theme** to GitHub hexes, NOT add a duplicate 6th theme (confirmed with developer); dark mode explicitly included → required the new dark-scoped block
- Tooltip = GitHub dark bubble both modes via tokens (developer: "look like github")
- Month labels = existing dynamic axis, verified only; F20 scope = gaps only, no card rebuild
- Role mapping unchanged (light 1/3/4, dark 1/2/4) — mirrors GitHub structure, Mint inherits automatically

**Problems solved:**
- Mount deadlock (tooltip only rendered when positioned → ref null → never measured) → offscreen first-pass render
- Tooltip drift on scroll → capture-phase scroll listener clears hover
- Double-tooltip (native title + styled) → title removed, aria-label keeps a11y info
- Cell→axis-gap hover persistence → per-cell `onMouseLeave`

**Current state:** F20 complete. Build + lint + tsc clean. Heatmap: GitHub-structure grid + GitHub-style tooltip; Settings → Mint = GitHub green heatmap in light AND dark. Review: 1 carry-forward (browser theme QA not possible headless).

**Open questions:**
- Browser QA: hover tooltip look/positions (edges, top-row flip), Mint heatmap vs real github.com side-by-side, 5 themes × light/dark heatmap check, legend dots recolor in Mint
- Touch/mobile: no cell tooltip after title removal — accept or revisit (F21+)
- `lib/mock-stats.ts` still unreferenced — delete at F21
- Carry-forwards: OAuth e2e QA; login `?redirect=`; F24 thresholds /architect; mood seed color drift until F28; Mood pills; F17–19 browser QA backlog

---

### Phase 5.21 — Streak History + Key Insights (Complete — Phase 5 closed)

**What was built:**
- `lib/insights.ts` — `InsightPeriod` type + `insightRangeFor(period, today)` (This Month = 1st→today; Last 3 Months = 1st of month−2→today; This Year = Jan 1→today; calendar ranges anchored to real today); `computeKeyInsights` gained `habits` param and strongest-habit now uses `weightedHabitRate` with title naming the habit; mood-logged icon → own `"mood"` (Smile); shared `KEEP_GOING` fallback returned for `days.length === 0`
- `components/stats/StatsView.tsx` — `insightPeriod` typed `InsightPeriod`; insights computed over `insightRangeFor` range, client-side recompute, no server action
- `components/stats/KeyInsightsCard.tsx` — typed `DropdownOption<InsightPeriod>` options, `mood: Smile` icon + `bg-warning-light text-warning-strong` style, no cast
- `components/ui/Dropdown.tsx` — made generic `Dropdown<T extends string>` / `DropdownOption<T>`; cast also removed from `components/mood/MoodGraphCard.tsx` (bonus fix)
- `lib/stats-data.ts` — `mood_entries` query date filter removed (fetch all; range filter inside computeKeyInsights does the period scoping)
- `lib/mock-stats.ts` — deleted (zero importers since F18)
- Streak History verified real (F18) — no code changes
- Docs synced: ui-registry (Stats 17–21, insight mood icon, Dropdown generic), build-plan F21 ✅, progress-tracker Phase 5 closed

**Decisions made:**
- Dropdown ranges = calendar months anchored to real today (not rolling 90 days) — matches F18 pill convention and Mood F15 shape
- All-time mood fetch (personal-scale, F12 tradeoff) — loader never needs touching for future periods
- Strongest-habit reuses `weightedHabitRate` (F19 deferral): one rate definition across the page; ≥0.5 threshold kept; habit named in title per StatsPage.png
- Review 3 minors all fixed same session (generic Dropdown, distinct mood icon, keep-going on empty range)

**Problems solved:**
- Type escape hatch: string-typed Dropdown forced `as` casts at both call sites — generic `<T extends string>` eliminated them
- Mood count would have undercounted in wider periods (loader was month-scoped) — root-fixed at loader, not patched per-period
- Blank insights card on degenerate range — unreachable path now returns honest fallback

**Current state:** Phase 5 fully complete (17–21). Build + lint + tsc clean; `/stats` dynamic. All Stats surfaces real; insights dropdown functional across 3 periods; mock-stats gone.

**Open questions:**
- Browser QA backlog (carry-forward): insights dropdown 3 options + mood counts across periods; F17–20 QA (pill switching, heat tooltips, 5 themes × light/dark, Mint vs github.com, hover edge flips)
- Touch/mobile: heat cell tooltip lost after title removal — accept or revisit (F22+)
- Carry-forwards: OAuth e2e QA; login `?redirect=`; F24 thresholds /architect; mood seed color drift until F28; Mood pills; F17–19 browser QA backlog
- Phase 6 next: Feature 22 Calendar Page — Full UI, mock first vs `@public/designs/CalenderPage.png`

---

### Phase 6.22–24 + 7.25 — Calendar (F22–24) + Settings Full UI (F25) (Complete)

**What was built:**
- **F22 Calendar UI:** `lib/mock-calendar.ts` (July 2026, YYYY-MM-DD keys, 7-char status strings, MOVED-on in F23), `lib/calendar.ts` pure helpers (`buildMonthCells` Sun-start, `shiftMonth/Day`, `cycleStatus`, `withCompletion`, `buildStatusMap`, `buildCellMap`, `dayLabel`), `components/calendar/{CalendarView,MonthCard,DayDetailsCard,DayLegendCard,MonthlyOverviewCard}.tsx` — interactive mock (F09 pattern): month nav/Today/day select real local state; cells = date + per-habit dots (logged statuses only: done→success-strong, partial→warning, missed→error) + MoodFace 22; decorative reused `StatsDecorativeCard` quote prop
- **F23 Day Nav + Checklist (real-only flip):** `lib/calendar-data.ts` one-pass loader (active habits, ALL completions/moods/notes, mood_levels, profile flags `enable_mood_notes` + `show_mood_on_calendar`); `mock-calendar.ts` DELETED (no seed — Mood F14 precedent); CalendarView client-authoritative state seeded from props once (F15 no-snap), initial view = real today; optimistic `setHabitCompletion` full cycle unset→done→partial→missed (missed = `border-error bg-error-light` + X) with snapshot revert + per-habit in-flight guard; Day Details note block: saved note + Edit affordance / textarea+Save when empty, Save/Cancel/Delete in edit mode, draft reset via render-phase adjustment, gated by `enable_mood_notes`; **Edit Day = focus note editor; mood display-only**; **cross-page `page-enter` animation** (globals.css: fade+rise 12px 0.6s cubic-bezier(0.22,1,0.36,1), nth-child stagger 0–0.3s, prefers-reduced-motion none) applied to all 6 page roots (Mood = inner wrapper so children stagger)
- **F24 Legend + Overview:** `classifyMonth` in `lib/calendar.ts` — weighted ratio over ALL active habits (unlogged = 0-weight slot): **Great ===1, Okay ≥0.5, Tough >0, No Data =0**; month-to-date elapsed (future days excluded from tiles AND denominator); **ring = (Great+Okay)/elapsed**; tiles live (recompute on optimistic toggles); `DESIGN_OVERVIEW` deleted; tile hexes → `OVERVIEW_TILE_COLORS` in calendar.ts; DayLegend faces now from DB `mood_levels` via `levels` prop (mock-home import gone)
- **F25 Settings Full UI:** `lib/settings-data.ts` rewritten → `loadSettingsData()` returns `{categories, profile: SettingsProfile}` (Promise.all, `DEFAULT_SETTINGS_PROFILE` fallback); 7 new cards: `NotificationsCard` (5 toggles), `HabitPreferencesCard` (time/week/frequency selects + 2 switches), `MoodSettingsCard` (scale select 5/7, notes toggle, reminder time, show-on-calendar), `ProfileCard` (name+pencil, bio maxLength 100 + live counter), `DataManagementCard` (Export/Import/Backup/Reset rows+buttons), `DangerZoneCard` (Clear/Delete/Reset red rows + "later phase" note), `AboutCard` (identity + 4 chevron rows, chrome); shared `components/settings/SettingsRow.tsx` + `settingsSelectClass`; `SettingsCard` += `iconClassName` tone override; `SettingsShell` reordered to design-literal 3 columns; `formatTime12` + `TIME_OPTIONS` (30-min steps) in `lib/utils.ts`
- Docs synced throughout: ui-registry (Calendar 22–24, Page entrance, Settings F25 sections), build-plan F22–F25 ✅, progress-tracker (Phase 6 closed, Phase 7 started)

**Decisions made:**
- F22: interactive mock, mock keyed full YYYY-MM-DD (F09 bug avoided), dots = per-habit logged statuses only (legend labels stay day-level defs), first paint = design July 12 2026
- F23 (architect-confirmed): **real-only no seed** ("read [existing data]" not read-only features); **full checklist cycle** (not binary) with missed visually distinct; notes read/write directly on day click (developer hard requirement); mood display-only; Edit Day = note editor focus; Overview nav shares viewMonth (numbers static until F24)
- F24 (architect-confirmed): weighted thresholds; ring numerator = Great+Okay; **month-to-date denominator** (F18 convention — design's "of 31" belongs to its fake data)
- F25 (architect-confirmed): **hydrate + chrome** (controls seed from real profile, local state only until F26–30 persist); design-literal column order; Categories card kept col1 (F11 decision, absent from PNG); native `<select>` not Dropdown; danger buttons = light-red secondary style not solid `variant="danger"`
- Next-build note: F21 had shipped generic `Dropdown<T>` (casts removed from KeyInsights + MoodGraph)

**Problems solved:**
- Next build legend showed `○ /calendar|mood|settings` despite cookie loaders — verified prerender-manifest contains only login/_not-found HTML; stale cache cleared in later build (all now ƒ) — no action needed
- F23 Review/compliance: tile hexes initially in component → moved to `OVERVIEW_TILE_COLORS` in pure module (HABIT_TINTS precedent, cross-cutting rule 1)
- PowerShell mangles backticks in inline node scripts — append doc sections via temp `.md` file + `fs.readFileSync` instead
- Unlogged-habit denominator trap: `dayCompletionRatio` must receive full active-habit-length array (else 1-of-1-logged fakes Great)
- `SettingsShell` unused-import lint warning after placeholder removal — fixed

**Current state:** F25 complete. Build + lint + tsc clean. Calendar fully real (grid/notes/checklist/classification); Settings fully built chrome with real hydration. `page-enter` animation on all pages. Signed-in browser QA still not possible headless — backlog F17–25.

**Open questions:**
- Browser QA backlog: Calendar (cycle visuals, note flow, thresholds feel, month-to-date caption), Settings F25 vs SettingsPage.png light+dark, plus F17–20 carry-forwards (pills, heat tooltips, 5 themes × light/dark, Mint vs github.com)
- **F26 schema gap:** `default_frequency` column missing — migration needed before persisting frequency
- **About link rows** (Keyboard Shortcuts/Feedback/Privacy/Terms) have no destinations — decide F30 or elsewhere
- Carry-forwards: OAuth e2e QA; login `?redirect=`; mood seed color drift until F28; Mood pills keep-deferred-or-drop; touch heat tooltip; F24 thresholds now RESOLVED (shipped)
- Phase 7 next: Feature 26 Appearance + Preferences Save (Appearance already live; wire Habit Preferences persistence)

---

### Phase 7 — Post-F25 UX Pass (Complete)

**What was built:**
- **Full theme chrome:** `app/globals.css` theme blocks rewritten — `public/UI palette/{Lavender Sky,mint breeze,peach blossom,Ocean mist}.png` are now the per-theme chrome source (background/surface/surface-alt/surface-hover/border trio/text trio/primary tints/heat ramp) for light AND dark via `[data-theme="light|dark"][data-color-theme="X"]`; Rose derived by analogy (no sheet); dark heat ramps added for peach/ocean/rose (were falling back to lavender purple); status colors (done/partial/missed, success/warning/error) intentionally NOT themed; zero component changes (token-only rule)
- **Primary retunes:** Peach `#fdba74`→`#fb6b6b` coral (dark `#ff9a8f`); Ocean `#7dd3fc`→`#4e8af7` blue (dark `#68b8ff`); Mint kept `#34d399` + GitHub heat (F20 decision)
- **Data entrance animations:** globals.css keyframes + utilities (`.chart-dot` fade-scale, `.heat-cell` soft-fade, `.cal-cell` row-cascade, `.rate-bar` grow-x, `.ring-draw` stroke draw, `.modal-backdrop`/`.modal-panel`); all Recharts Area/Bar/Pie got `isAnimationActive` + 900–1100ms ease-out; MoodGraphCard + StreakHistory custom dots stagger via index (custom `dot` render props bypass Recharts' own dot animation — root cause of "mood graph not smooth"); MoodGraph/CompletionOverview ResponsiveContainer keyed on period/granularity/bounds to replay on switch; HabitRateCard bars, HabitConsistency heat cells, MonthCard cells, Home ProgressRing (key={percent} remount) all animate; every modal (Day/Note/HabitForm/ViewAll) shares modal classes; all `prefers-reduced-motion` safe
- **Calendar popup:** new `components/calendar/DayModal.tsx` (mood + note read/edit + checklist, prev/next inside, Esc/backdrop close, render-phase draft reset); `DayDetailsCard.tsx` DELETED; CalendarView: day cell click selects + opens modal; layout = MonthCard full-width + Overview/Legend/decorative 3-col row; modal rendered outside `.page-enter` fragment (nth-child delays would lag it); dead MoreVertical button gone
- **Habits month fix:** `lib/habits-data.ts` `defaultView` = always current real month (latest-activity logic removed — Sept seed no longer pins the view); `MonthNav` + `HabitsView`: Today shortcut button (Calendar-button style, only when off current month)
- Docs synced: ui-registry (calendar popup + 2 new sections: Full theme chrome, Data entrance animations), build-plan (palette folder note), progress-tracker (checkbox + decisions + status)

**Decisions made:**
- Theme chrome from palette sheets; status colors shared; Rose derived; peach/ocean primaries retuned to sheet hues, Mint primary kept
- Custom Recharts dots animated via CSS class + inline delay, not Recharts API
- Calendar day click = full Day Details popup; inline card removed (developer-confirmed); modal outside page-enter wrapper
- Habits always opens current month (developer-confirmed "September" complaint = Habits page)

**Problems solved:**
- Mood graph dots popped instantly while the line drew (custom dot bypasses Recharts animation) — `.chart-dot` stagger after line lead (+250ms)
- Dark mode + non-mint themes had purple heatmaps — per-theme dark heat ramps
- Popup lag: conditional modal as `.page-enter` child inherited nth-child delays — fragment-out

**Current state:** Build + lint + tsc clean. All 5 developer changes shipped. Signed-in browser QA of theming (5 themes × light/dark), animations, and calendar popup not done (headless) — joins QA backlog.

**Open questions:**
- Browser QA: theme flip across all 5 themes × both modes (chrome + heatmap + legend dots), animation smoothness (mood graph, period switches, heatmap cascade, ring), calendar popup flow (note edit/save/delete, prev/next, Esc), Habits default month + Today button
- Sheet-vs-app border softness: derived borders are softer than sheet's mid-tone borders (matches app's soft lavender border) — revisit if developer wants sheet-literal
- Carry-forwards unchanged: F26 `default_frequency` migration; About link destinations; OAuth e2e QA; login `?redirect=`; mood seed color drift until F28; Mood pills; touch heat tooltip

---

### Phase 7 — Post-F25.2 Fixes (Complete)

**What was built:**
- **Habits today-column highlight:** per-cell `ring-2 ring-offset-1` removed (collided/overflowed, worst in dark) — today's header day number is now a `bg-primary text-primary-foreground` pill; today's unset cells + empty note cell get `bg-primary-lightest/60` tint (`HabitGridCard.tsx`; also un-narrowed `status` type with a cast for the unset check)
- **Settings Manage Habits card:** `components/settings/ManageHabitsCard.tsx` in col1 under Categories — rows (HabitIcon 36 + name + category/Archived caption + Pencil/Trash2); Edit opens existing `HabitFormModal` (update/archive/two-step delete live there); Trash = inline two-step confirm strip (CategoriesCard pattern, warns completions removed); header "+ Add Habit"; `SettingsCard` gained `action` slot; `loadSettingsData` + habits query → `SettingsHabit[]` (id/name/emoji/description/category_id/sort_order/active); `revalidateHabits()` += `/settings`; page.tsx + SettingsShell wired
- **HabitIcon library:** `components/ui/HabitIcon.tsx` — 18 hand-drawn stroke-SVG glyphs (sunrise, alarm, dumbbell, eye, growth, toothbrush, shower, journal, water, moon, book, apple, lotus, walk, phone-off, leaf, flame, crown); **restyled per developer follow-up: no background circle — vivid per-glyph `text-*` token color + soft glow** (`drop-shadow(0 0 3px currentColor) drop-shadow(0 0 8px currentColor)`), glyph = size×0.72; `glyphForHabit(emoji, name)` = emoji map → name keywords → bare-emoji fallback (DB emoji column untouched); sizes: Habits grid 32, Home list 40, Calendar details 30, Settings 36, stat cards 44; `BrandLeaf` export = sidebar logo (h-12 bubble, text-primary); Home 🔥/👑 bubbles → flame/crown glyphs; Home dead "⋯" button removed; empty-state Add Habit now router.push("/habits")
- **Mood/streak graph animation v2:** per-dot `chart-dot` stagger reverted (dots lagged the finished line) — new `.chart-sweep` clip-path wipe (inset(0 100% 0 0)→inset(0), 1.2s ease-out both) on the wrapper div reveals line+fill+dots as one left-to-right sweep; wrapper key = period+bounds (replays on period switch); StreakHistory same treatment; `.chart-dot` class kept but unused
- **Calendar full revert:** DayModal.tsx deleted; DayDetailsCard.tsx recreated (prior inline card, dead MoreVertical chrome stays removed); CalendarView back to two-column layout (MonthCard + DayDetails left; Legend/decorative/Overview right), day click = select only; fragment wrapper removed; kept cal-cell cascade + habits current-month default + Today button
- **Sync:** `saveDayNote`/`deleteDayNote` now also `revalidatePath("/calendar")` + `revalidatePath("/")` (were `/habits`-only); completions action already revalidated all four routes — Habits grid + Calendar checklist share `habit_completions`, marks match across pages
- Docs synced: ui-registry (calendar revert + animations v2 + HabitIcon + Manage Habits sections), build-plan (HabitIcon rule), progress-tracker (checkbox + decisions + status)

**Decisions made:**
- Today highlight = header pill + column tint (no per-cell outlines) — developer confirmed collision complaint
- Settings habit delete = inline confirm on the card; edit/archive/delete-in-modal = reuse HabitFormModal (zero new modal code)
- Habit glyph mapping is render-time (emoji + name keywords), no schema change, emoji fallback for unknowns (my call, developer delegated)
- Area-chart entrance = single clip sweep, not per-dot stagger (developer: first version's feel was right, dots must ride the line)
- Calendar popup experiment fully reverted (developer: previous UI was good)

**Problems solved:**
- TS2367: `status === "unset"` narrowed-out — fixed with `as HabitStatus | "unset"` cast
- notes.ts stray `}` introduced during revalidation edit — caught on re-read, removed
- SettingsCard had no header action slot — added optional `action` prop (title row flex-1)

**Current state:** Build + lint + tsc clean. All 5 changes shipped. DayModal gone; HabitIcon live on grid/home/calendar/settings + sidebar/stats branding. Browser QA not done (headless).

**Open questions:**
- Browser QA: today pill/tint look (light+dark, status columns), HabitIcon glyph quality/coverage (map real habits — unknown emoji fallbacks), Manage Habits flows (add/edit/archive/delete + confirm), mood graph sweep feel + period-switch replay, calendar inline details restored correctly, sidebar leaf + stat glyphs
- Glyph tint taste: some mappings debatable (book=warning, lotus=error-light) — easy one-line retunes if developer dislikes
- Carry-forwards unchanged: F26 `default_frequency` migration; About link destinations; OAuth e2e QA; login `?redirect=`; mood seed color drift until F28; Mood pills; touch heat tooltip; first-pass theming/animation QA backlog

---

### Phase 7 — Post-F25.3 Polish (Complete)

**What was built:**
- **Graph animation = ONE motion (developer: still not it — make it one, not two):** Recharts path animation turned OFF on mood graph + streak history (`isAnimationActive={false}`); the `.chart-sweep` clip wipe is now the ONLY animation — line, fill and dots revealed together left-to-right; keyframe eased to `cubic-bezier(0.22, 1, 0.36, 1)` at 1.3s + `will-change: clip-path`; wrapper key still replays on period/bounds change
- **HabitIcon glow reduced (developer: too strong; or add a settings control):** single subtle `drop-shadow(0 0 2px color-mix(in srgb, currentColor 40%, transparent))` replacing the double full-color 3px+8px glow; no settings control added (reduction satisfies the "or else")
- **Floating cards (developer: adjust KPI/settings cards, better UI UX):** `Card` default gained `transition-shadow duration-200 hover:shadow-pop` (all cards, no layout shift); Home StatCards ×4 also lift `hover:-translate-y-0.5` via local `KPI_CARD` const; chart/settings cards deliberately shadow-only (no translate — would jitter tooltips/inputs)
- Docs synced: ui-registry (animations single-motion rows, HabitIcon glow row, new "Floating card polish" section); progress-tracker status; build unchanged

**Decisions made:**
- Single clip wipe with Recharts animation disabled — the only way to have literally one animation (developer's explicit ask); same sweep on both area charts
- Glow reduction over a settings slider (slider would need a profile column + migration = F26 scope creep)
- Hover lift only on glanceable KPI cards; hover shadow everywhere

**Problems solved:**
- Two stacked animations (Recharts draw + clip wipe desynced at the edge) — removed the Recharts one entirely

**Current state:** Build + lint + tsc clean. Mood/streak sweep = single clip motion; icons subtly glowing; all cards hover-elevated, KPI row lifts.

**Open questions:**
- Browser check: sweep smoothness at 1.3s signature ease; glow intensity now too subtle or right; KPI lift feel
- Glow setting revisit: if developer still wants a slider, needs `icon_glow` profile column (bundle with F26 migration)
- Carry-forwards unchanged (F26 migration, About links, OAuth e2e, F28 seed drift, Mood pills, touch tooltip, QA backlogs)

---

### Phase 7 — Post-F25.4 — Mood Graph Animation v3 + Mood Toggle-Off (Complete)

**What was built:**
- `app/globals.css` — `.chart-sweep` slowed + smoothed: 1.3s `cubic-bezier(0.22,1,0.36,1)` → **1.8s `cubic-bezier(0.33,1,0.68,1)`** (easeOutCubic — gentler start, long glide, pie-chart feel; still a clip wipe so strictly left→right and dots ride the line); shared class → Streak History slows identically
- `components/mood/MoodView.tsx` — new `moodRev` counter bumped on every `handleSetMood` (set OR remove); **toggle logic**: clicking the already-active chip removes the entry (optimistic delete from `entries` + `setDayMood({ moodValue: null })`); pass `rev` to MoodGraphCard
- `components/mood/MoodGraphCard.tsx` — wrapper key now `${rev}:${period}:${bounds}` — sweep replays on every mood entry change (same remount mechanism as period switch)
- `actions/moods.ts` `setDayMood` — accepts `moodValue: number | null`; null → delete `mood_entries` row (user_id+date); validation allows null
- Docs synced: ui-registry (animations section → Post-F25.4: sweep timing row + Mood entry replay row + mood chip toggle-off in mood page pattern note), progress-tracker (checkbox + decisions block + status)
- Memory appended (this entry)

**Decisions made:**
- easeOutCubic 1.8s over keeping the quint ease — developer asked for "slower and smoother, like the pie"; clip wipe retained (Recharts animation stays off — one motion rule intact)
- Shared `.chart-sweep` class tuned (Streak History follows) — kept F25.3 "same sweep on both area charts" consistency
- Toggle-off scoped to **Mood page legend chips only** — Home mood card stays select+Save flow (a toggle there would fight the Save button UX)
- `moodRev` bumps optimistically (before server confirms) — graph replays immediately; on server failure `setData(prev)` reverts but no second wipe (rev doesn't roll back — acceptable, one wipe + instant revert)

**Problems solved:**
- Sweep didn't replay when a mood was logged (key was period+bounds only — entry changes don't alter bounds) — `rev` in key fixes it
- No removal path existed — `setDayMood` was upsert-only; now dual-mode (null = delete)

**Current state:** Build + lint + tsc clean. Mood graph: 1.8s easeOutCubic left-to-right wipe, replays on every mood set/remove; second click on active chip removes the entry (month view). 90d/Year range series still doesn't refetch on entry change (pre-existing for adds — unchanged).

**Open questions:**
- Browser check: 1.8s easeOutCubic sweep feel (vs pie's 1s ease-out — is it slow enough / too slow); toggle-off affordance discoverability (active chip needs no visual hint that click removes — acceptable?)
- 90d/Year stale-range on entry change: sweep replays with old range data until month nav/refetch — pre-existing add-behavior, revisit only if developer notices
- Carry-forwards unchanged (F26 migration, About links, OAuth e2e, F28 seed drift, Mood pills, touch tooltip, QA backlogs — sweep/toggle now join browser QA)

---

### Phase 7 — Post-F25.5 — Curve-Only Reveal + Local Band Animation (Complete)

**What was built:**
- `components/ui/RevealAreaShape.tsx` — `makeRevealAreaShape({ dot, entranceDuration?, bandDuration?, padX? })` factory returning a custom Recharts Area `shape`: wraps the public `AreaRevealShape` (plain curves, since `isAnimationActive={false}`) in clipPath `<g>`s and renders dots INSIDE the same clips via the factory's `dot({cx,cy,index,payload})` callback. **Entrance** (mount/period/month-nav — chart remounts via wrapper key on period+bounds): 3s easeOutCubic RAF wipe front across the full x-span. **Data change**: shape self-diffs consecutive `points` value arrays → local band [changed−1..changed+1], 1.8s — new segment+dot draw in behind the growing rect clip while old points render clipped by a C-shaped exclusion polygon ahead of the front (no double-curve artifact); removals retract via the same front. `prefers-reduced-motion` → no RAF, plain curves. Vertical extent covers both old and new point sets
- `components/mood/MoodGraphCard.tsx` — `dot={false}`, `shape={revealShape}` (mood dot colors via `levelColor` closure), wrapper key back to `period:bounds` (rev removed), `.chart-sweep` class removed
- `components/stats/StreakHistoryCard.tsx` — same shape (dots every 3rd index, primary color), `.chart-sweep` removed
- `components/mood/MoodView.tsx` — `moodRev` state + `rev` prop removed (a per-entry remount would replay the full 3s entrance; the band handles entries in-place); toggle-off logic from F25.4 untouched
- `app/globals.css` — `@keyframes chart-sweep` + `.chart-sweep` rule deleted (reduced-motion list updated); `.chart-dot` kept unused
- Docs: ui-registry animations section rewritten for Post-F25.5; progress-tracker (checkbox + decisions); memory appended

**Decisions made (incl. 2 developer answers):**
- Developer chose **"new segment draws in"** (local band) over dot-bloom or short full redraw, and **3s** for the main wipe (much slower than 1.8s)
- Curve-only means the wipe must NOT wrap the ResponsiveContainer (old CSS clip wiped axes too) — hence the shape-level clip; Recharts renders axes/grid as sibling layers so they stay instant
- Recharts 3.10's built-in `AreaRevealShape` clips only curves but its dots render in a sibling `Dots` layer (pop instantly) — solved by rendering dots inside our shape and setting `dot={false}`; `activeDot`/tooltip unchanged
- Shape self-detection of changed index (value diff) instead of props — custom props don't reach Recharts shapes (filtered to SVG props), and it keeps MoodView clean
- Streak History migrated for consistency (same entrance); band logic inert there (data static per visit)
- Recharts ships no per-file `.d.ts` beside `es6/` — deep imports (`recharts/es6/shape/Curve`) would need ambient modules; public exports only (`AreaRevealShape` + `AreaRevealShapeProps` are public since 3.9)
- `isAnimationActive={false}` kept — Recharts point interpolation would morph the whole curve; the clip owns all motion

**Problems solved:**
- Whole-chart wipe including axes (developer complaint) → axes are outside the shape layer, now instant
- Full re-wipe on every entry (F25.4 `moodRev` key) → removed; local band animates only the changed neighborhood
- Lint: ref-read during render (old points moved into band state) + `pts` useMemo

**Current state:** Build + lint + tsc clean. Mood graph: 3s curve-only entrance; logging/changing/removing a mood animates only that day's neighborhood (1.8s); streak history shares the entrance. Toggle-off retained.

**Open questions:**
- Browser QA (headless backlog): wipe feel at 3s; band seam visibility at changed day's neighbors; removal retraction; tooltip during band anim; Streak entrance on Stats visit; reduced-motion path
- Band duration 1.8s vs entrance 3s — asymmetric by design (entrance = showcase, band = feedback); easy knob in `makeRevealAreaShape` if developer wants them equal
- **Fixed same-session: Strict Mode strand bug** (developer screenshot: empty graph — axes only) — RAF cleanup now resets `entranceDoneRef` + `setBand(null)`; degenerate 0-width spans skip entrance; graph can no longer be clipped to zero
- **Fixed same-session: fill wedge bug** (developer screenshot: triangular fill between first/last point) — `RevealAreaInner` destructured `baseLine` (for clip y-bound) but never forwarded it to `<AreaRevealShape>`; fill closed chord-style without it. Passed at all 3 render sites (plain + band old/new layers)
- Carry-forwards unchanged (F26 migration, About links, OAuth e2e, F28 seed drift, Mood pills, touch tooltip, QA backlogs)

---

### Phase 7 — Feature 26 — Preferences Save + Week Start + 6-Mood Scale (Complete)

**What was built:**
- **Migration** `migrations/20261015045254_f26-default-frequency-and-6-mood-scale.sql` (applied via `npx -y @insforge/cli db migrations up --all`, verified via `db query`): `default_frequency text NOT NULL DEFAULT 'daily' CHECK IN ('daily','weekly')`; mood_scale check replaced via DO/pg_constraint lookup → IN (5,6,7), default 6, all profile rows set to 6; one-time `mood_entries` remap `mood_value >= 3 → +1` (Sad 2 and below unchanged); `mood_levels` deleted + reseeded 6 rows per `auth.users` (Very Happy 6 #86D6BF … Tired 3 #A8A29E … Fu*ked Up 1 #A78BFA)
- **Actions** (`actions/settings.ts`): `saveHabitPreferences` (time regex, freq enum, week 0-6, booleans) + `saveNotificationPrefs` (5 booleans) — validated partial upserts on `profiles` (saveAppearance precedent), `revalidatePath("/settings")`
- **Cards:** `SaveStatusLine` shared component (`components/settings/SaveStatusLine.tsx` — idle/saving/saved/error with role=status/alert); `HabitPreferencesCard` + `NotificationsCard` auto-save on every control change with sequence counter (only latest save sets status); optimistic local state kept on failure; `MoodSettingsCard` scale select → single "6 Levels (Very Happy → Fu*ked Up)" stopgap
- **week_starts_on honored:** `buildMonthCells(year, month, weekStartsOn)` (offset formula `(getDay - wso + 7) % 7`) + new `weekdayHeaderLabels(wso)` rotation in `lib/calendar.ts`; CalendarView/MonthCard thread the profile value (`calendar-data` select += week_starts_on); Home WeekStrip — home-data now computes week keys AFTER profile fetch using `startOfWeek(today, profile.week_starts_on ?? 1)`; Stats weekly buckets — `buildCompletionSeries` gained a `weekStartsOn` param; `stats-data` fetches it into new `StatsData.weekStartsOn`; StatsView passes it. Fallback everywhere = 1 (Monday, schema default)
- **6-mood scale app-side:** `MoodFace` redesigned (clamp 1–6): 6/5/4/2 reuse old faces shifted +1; **Tired (3)** = droop-arc half-lidded eyes + pupil dots below lids + yawn ellipse; **Fu*ked Up (1)** = X-cross eyes + wavy Q/T mouth; callback seed → 6 rows; `mock-home.ts` mockMoodLevels → 6 rows (FALLBACK_LEVELS in home-data + mood-view follow); types `Profile` += default_frequency; `SettingsProfile` += defaultFrequency (default daily), moodScale default 6
- Docs synced: build-plan (Design System face table → 6, F26 shipped note, F28 scope rewritten), ui-tokens (Mood Faces 6-table + SVG rule), ui-registry (MoodFace 6 rows, Settings persistence pattern, Calendar week-start rows), architecture (seed table → 6), progress-tracker (F26 ✅, F28 rewritten, status); /review run — 0 issues

**Decisions made (architect session, all developer-confirmed):**
- Scope: persist 5 habit prefs + 5 notify toggles (notify folded in — no later feature owns them); honor ONLY week_starts_on (all 3 surfaces together — Calendar Sun vs Home/Stats Mon previously disagreed with each other); show-completed/compact/frequency/reminder-time = stored-but-inert (no design spec to honor them)
- Auto-save on change with card-level status line (design has no Save button)
- **6 moods bundled into F26**, **high-is-happier** (6=Very Happy…1=Fu*ked Up — kept existing convention so graphs/insights stay correct); developer's list is the display order top→bottom; existing entries remap cleanly (≥3 → +1); Tired color #A8A29E (proposed, not vetoed); labels verbatim incl. "Fu*ked Up"
- MoodSettings scale select = stopgap single option; F28 redesigns the card (5↔7 plan superseded — scale is fixed 6; F28 = notes toggle + reminder + show-on-calendar wiring)
- Migration kept IN (5,6,7) on mood_scale (not locked to 6) — legacy tolerance, value always 6

**Problems solved:**
- F25 schema gap (`default_frequency`) closed; F23 promise ("week_starts_on honored when F26 ships") kept; F28 seed-drift carry-forward resolved (all accounts reseeded by migration)
- Batches of edit-tool calls intermittently dropped params mid-session — several edits silently no-oped; caught by re-reading files + tsc before proceeding (settings-data type block was the one real miss)

**Current state:** Build + lint + tsc clean; migration applied + verified (6 levels, remapped entries Oct 10–14: 5,4,4,2,4 = Happy/Okay/Okay/Sad/Okay). Settings: prefs + notifications persist with visible status; week start flip needs page reload to re-read profile. Review: 0 issues.

**Open questions:**
- Browser QA: auto-save status lines, week-start flip across calendar/home/stats (Monday default = current behavior for you), 6 faces visual quality (Tired yawn + Fu*ked Up X-eyes at 22–36px), 6 chips on Home mood selector (wraps), mood graph with 6 y-axis faces (h-64 fits 6×26px), distribution donut 6 slices
- MoodSettingsCard stopgap select — F28 redesign
- Carry-forwards: About link destinations; OAuth e2e QA; login `?redirect=`; Mood pills keep-deferred-or-drop; touch heat tooltip; large browser QA backlog (F13→F26)

---

### Phase 7 — Post-F26 — Fu*ked Up Mind-Blown Face (Complete)

**What was built:**
- `components/ui/MoodFace.tsx` — value-1 (Fu*ked Up) face redesigned twice; final = `MindBlownCloud` component: orange (`#FB923C` FIRE) + yellow (`#FCD34D` FIRE_CORE) puff circles billowing over the top of the head (top puff deliberately clips the viewBox edge like the 🤯 explosion), rendered in MoodFace main SVG for `v === 1` between the gradient and features; eyes = small dots low on the face (cy 21); mouth = agape stroked ellipse
- First attempt (rejected by developer with screenshot): zigzag "explosion crown" path along the top rim + hollow ring shock eyes — read as spiky hair, not an explosion
- Docs updated: ui-registry MoodFace row, ui-tokens face table, build-plan face table (all now describe the fire-cloud design)

**Decisions made:**
- Explosion must read as a CLOUD bursting over the head (overlapping filled circles, two-tone fire colors), not a jagged crown inside the rim — developer: "create something exactly like this emoji 🤯"
- Fire colors as file constants FIRE/FIRE_CORE (precedent: FEATURE constant already lives in MoodFace; data-hex rule applies to mood colors, not component internals)
- Cloud renders only for value 1; other faces untouched

**Problems solved:**
- First design failed the "does this read as mind-blown" test — replaced crown with cloud per developer's emoji reference

**Current state:** tsc + lint clean. Fu*ked Up = fire cloud + dot eyes + O mouth everywhere MoodFace renders.

**Open questions:**
- Browser check: cloud readability at small sizes (22px calendar cells, 24px chips); puff proportions vs the real 🤯 emoji side-by-side
- Carry-forwards unchanged (F27 next, About links, OAuth e2e, QA backlogs)

---

### Phase 7.27 — Profile Save (Complete)

**What was built:**
- `actions/settings.ts` +`saveProfile` — trims, name ≤50 / bio ≤100, empty→null, upsert `profiles`, revalidates `/settings` + `/`
- `components/settings/ProfileCard.tsx` (later moved into ProfilePanel) — text-field auto-save: 500ms debounce + flush-on-blur + `lastSavedRef` trimmed-value no-op skip + sequence counter + `SaveStatusLine` (text fields must not save per keystroke, unlike F26 toggle cards)
- `lib/home-data.ts` +`profileDisplayName(saved, email)` — trimmed `display_name` → email local-part `.slice(0,3)` → "You"; `HomeDashboard.displayName` added; Home page uses it (mock "Krishna" fallback dropped)
- `components/layout/UserMenu.tsx` — name priority: DB `profiles.display_name` (client select, try/catch degrades) → OAuth profile/metadata → email prefix; avatar initial follows

**Decisions made (architect-confirmed):**
- Scope = name + bio only; `tracker_title`/`welcome_message` schema columns stay dormant (no UI — old-tracker fields absent from SettingsPage.png)
- Empty name → first 3 chars of email (developer chose 3 over full local-part)
- Sidebar avatar follows saved profile name (consistency; small change)
- `saveProfile` revalidates `/` too — Home greeting is a server component

**Current state:** Build + lint + tsc clean. Shipped, then reworked in F28.1 (ProfileCard → ProfilePanel in sheet).

---

### Phase 7.28 — Mood Settings + Settings Redirect (Complete)

**What was built:**
- `actions/settings.ts` +`saveMoodSettings` — enable_mood_notes / mood_reminder_time / show_mood_on_calendar; validated upsert; revalidates `/settings`, `/mood`, `/calendar`, `/` (flags read on those pages)
- `lib/settings-data.ts` — +`SettingsMoodLevel` type; loader now also fetches user `mood_levels` (value/label/color sorted desc) → `moodLevels` on return
- **Settings layout redirect (developer, mid-architect):** ProfileCard / NotificationsCard / MoodSettingsCard deleted from grid; Profile + Notifications/Mood became header icon dropdown panels (`SettingsQuickPanels`) — then rebuilt as sheets in F28.1
- `NotificationsPanel` = 5 notify toggles (F26 logic moved) + Mood subsection (enable notes / reminder time / show on calendar via `saveMoodSettings`) + read-only 6-face scale preview (`MoodFace size={26}` from DB levels — architect "best option" pick)
- Grid rebalanced: col1 Appearance/Categories/Manage Habits; col2 Habit Preferences/Data Management/About; col3 Danger Zone/decorative (kills the long-scroll column)

**Decisions made:**
- Mood Settings card removed entirely (developer: "what is the need of mood settings card remove it") — controls folded into the notifications surface's Mood section
- Scale row = static 6-face preview from DB (not a 1-option dropdown)
- Mood reminder time stays stored-but-inert (no push — hard rule 7)

**Current state:** Shipped; dropdown version replaced by F28.1 sheets same session.

---

### Phase 7.28.1 — Sheet Rebuild + Stacking-Context Bugfix (Complete)

**What was built:**
- `npm install @radix-ui/react-dialog` — **first non-Recharts runtime dep**, approved by developer mid-session (authorized "any UI libraries like shadcn/21st.dev"; picked the headless primitive over full shadcn — shadcn would fight the Lavender Sky token system for two components; Radix is what shadcn's Sheet wraps). Added to code-standards approved-deps list
- `components/ui/Sheet.tsx` — new shared primitive: right slide-over via Radix Dialog; overlay `fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]`; content `fixed inset-y-0 right-0 z-[61] w-[26rem] max-w-full border-l sm:rounded-l-xl`; sticky header (icon bubble + Title/Description + X close) + scrollable body; props `{ open, onOpenChange, title, description?, icon?, children }` — children = body only
- `app/globals.css` — `@keyframes sheet-in`/`sheet-out` + `.sheet-overlay`/`.sheet-content` classes with `[data-state="closed"]` exit variants (Radix Presence delays unmount while they run); added to `prefers-reduced-motion` block
- `components/settings/SettingsHeaderActions.tsx` — replaces `SettingsQuickPanels` (deleted); two circular trigger icons (User/Bell) open the Sheets; panels' local headers removed (Sheet owns chrome)
- **Global bugfix (root cause of the overlap screenshot):** `.page-enter > *` animation fill-mode `both` → `backwards` — `both` retained `transform: translateY(0)` forever; any lingering transform makes each page section a permanent stacking context, so the grid (later DOM sibling) always painted over the header regardless of the panel's z-50. `backwards` applies the start state during delay but drops the transform post-animation. Also healed the latent same-class bug on Stats insights dropdown / Mood period dropdown

**Decisions made:**
- Floating dropdown panels "look like AI slop" (developer) → slide-over sheets (Linear/Notion pattern); same two icons, new presentation
- Radix over hand-rolled (focus traps are where hand-rolled modals fail a11y) and over full shadcn/21st.dev (token-system conflict, only 2 components needed)
- Sheet registered in ui-registry as shared primitive; settings registry entry rewritten

**Problems solved:**
- Panel-under-cards overlap: diagnosed as page-enter stacking contexts, not a z-index value problem — fixed at the CSS root, not by bumping z-index
- `h-4.5` → `h-4` on trigger icons (Tailwind arbitrary-step cleanup)

**Current state:** Build + lint + tsc clean. All context docs synced (ui-registry settings+sheet entries, build-plan F27/F28/F28.1, progress-tracker, code-standards deps). Signed-in browser QA of sheets (slide motion, focus trap, Esc/backdrop close, mood toggle → Calendar reflection) not done — joins QA backlog.

**Open questions:**
- Browser QA backlog additions: sheet slide/exit feel, focus trap + Esc + backdrop close, scale-preview faces in sheet, page-enter fix side effects on all 6 pages (entrance should look identical), Home/UserMenu name follow after profile edit, email-prefix fallback when name cleared
- Carry-forwards: About link destinations; OAuth e2e QA; login `?redirect=`; Mood pills; touch heat tooltip; F13→F26 browser QA backlog; Danger/Data buttons still no-op (F30)

---

### Phase 7.29 — Export / Import JSON (Complete)

**What was built:**
- `lib/data-export.ts` — pure/client-safe: `EXPORT_VERSION = 1`, camelCase `ExportPayload` envelope (profile nullable + moodLevels/categories/habits/completions/moodEntries/notes), full zod row schemas (`exportPayloadSchema` + per-table), `summarizeImport` (confirm-strip counts), `parseExportFile` (JSON parse → version check → zod; human-readable errors), `exportFilename()` / `backupFilename()` (timestamped)
- `app/api/data/export/route.ts` — stub replaced: auth-checked via `createInsforgeServer()`; parallel select of all 7 tables scoped to `auth.uid()`; maps snake_case rows → camelCase envelope; `?backup=1` switches filename only; `Content-Disposition: attachment` + `Cache-Control: no-store`
- `actions/data.ts` — `importUserData(input: unknown)`: server-side zod re-validate; auth gate; merge-upserts in dependency order (profile → mood_levels → categories → habits → completions → mood_entries → notes); `user_id` forced to `auth.uid()`; chunked 500 rows/request; per-table error messages; `revalidatePath` on all 6 app routes
- `components/settings/DataManagementCard.tsx` — Export/Backup wired via programmatic same-origin anchor (SDK cookies ride the navigation); Import row = hidden `<input type=file accept=application/json>` + pending-file state + inline confirm strip (CategoriesCard two-step pattern: summary counts + "merges into your account; nothing is deleted.") + status line (success `text-success-foreground` / error `text-error-foreground` `role="alert"`); row caption swaps to `Selected “{file}”` while pending; Reset row still inert (F30)
- Docs synced: ui-registry (new "Settings - Data export / import (Feature 29)" section), build-plan (F29 ✅ + shipped note), progress-tracker (checkbox + decisions block + status)
- Verified: tsc clean, `npm run lint` clean, `next build` clean (`/api/data/export` dynamic ƒ)

**Decisions made (architect session, developer confirmed "proceed"):**
- **Import = merge-upsert, never deletes** — destructive wipe is F30's Reset; import only inserts/overwrites rows present in the file
- **Full payload = all 7 tables** incl. profile settings + mood_levels (full round-trip on new login); profile upserts onto `auth.uid()`, exported id ignored, `created_at` omitted (keeps signup time)
- **Natural-key upserts (implementation call):** mood_levels on `user_id,value` (id-match would duplicate the seeded scale on cross-account import — verified `UNIQUE (user_id,value)` exists in the migration); completions on `habit_id,date` (cycled cells get new ids, same keys); mood_entries + notes on `user_id,date`; habits/categories by `id`
- **Export = the existing API route** (a read; attachment headers belong in a route handler); Backup = same route + `?backup=1` (timestamped filename only)
- **Version envelope** v1; import rejects other versions before any write; zod schemas in pure `lib/data-export.ts`, never in a `"use server"` file (F10 rule)
- **Confirm = inline two-step strip** in the card, not a modal; status line below the list

**Problems solved:**
- TS union-narrowing on `parseExportFile` result — guarded on `!result.payload` instead of `result.error` (optional-property truthiness doesn't narrow)
- Postgres `ON CONFLICT` requires real unique constraints — verified all 4 natural-key targets in the schema migration before shipping

**Current state:** F29 complete. Build + lint + tsc clean. Settings → Data Management: Export downloads full JSON, Backup downloads timestamped, Import validates → confirms → merges with visible status. Reset row inert until F30. Signed-in browser QA (export file contents round-trip, confirm strip look, import into second account) not done — joins QA backlog.

**Open questions:**
- Browser QA: export → re-import same account (should be no-op-ish overwrite); import into a fresh second OAuth account (profile/theme/mood-scale restore; mood_levels merge not duplicate); bad-file error copy; confirm-strip layout in light+dark
- Theme flip after import: imported `theme_mode`/`color_theme` won't visibly apply until localStorage clears (ProfileThemeSync only seeds empty storage) — accepted edge; revisit if developer notices
- Carry-forwards: About link destinations (F30); OAuth e2e QA; login `?redirect=`; Mood pills; touch heat tooltip; F13→F28.1 browser QA backlog; Danger/Data Reset buttons live in F30

---

### Phase 7 — UI Overhaul: Settings Redesign + Home Fixes (Complete — Phase 7 closed)

**Context:** Developer shared screenshots of all pages; called the Settings card grid "AI slop"; cancelled Feature 30 outright ("no need for feature 30 — don't reset any data"). Architect session produced a full audit (6 bugs + 7 cross-page inconsistencies) + Settings redesign plan; developer confirmed: Option A (section nav + pane), remove Danger Zone + About link rows, anchored popovers (NOT sheets) for profile/bell, Home done=green/missed=red, plus extra asks (remove Home date nav, fix This Week, remove Home mood section + quote card, remove sidebar avatar).

**What was built:**
- **Settings redesign:** `SettingsShell.tsx` rebuilt — `grid lg:grid-cols-[13rem_1fr]`, sticky section nav (Appearance/Preferences/Habits/Categories/Data/About, horizontal pills on mobile) + single unboxed pane; new `SettingsSection.tsx` (h2 + one-liner + optional action, no card/icon-bubble); all six section bodies unwrapped from `SettingsCard` (deleted — zero usages); Categories/ManageHabits list rows flattened to `divide-y` (nested bordered boxes removed); Data Management lost its inert Reset row; About lost its 4 dead link rows; `DangerZoneCard.tsx` deleted (F30 cancelled)
- **Anchored popovers:** new `components/ui/Popover.tsx` (`PopoverPanel`) on `@radix-ui/react-popover` (second approved Radix primitive) — circular trigger matching the old header icons, `w-[22rem]` panel with Title/Description/X header + scrollable body, `modal-in` animation (reduced-motion safe), `z-[70]`; `SettingsHeaderActions` re-wired (Sheet → PopoverPanel); **Sign Out button added to profile popover** (replaces the removed sidebar avatar's sign-out); `Sheet.tsx` + sheet keyframes/classes deleted from globals.css
- **Home:** `Greeting.tsx` rewritten — dead date nav row (3 no-op buttons + hardcoded mock "Sat, 12 Jul 2026") removed, mock-home import gone, script accent unquoted; `StatCards` → 3 cards (mood card removed, `xl:grid-cols-4` → `sm:grid-cols-3`); `TodayHabits` — done `bg-primary` → `bg-success` (matches Habits grid tokens), literal "✓" on every circle replaced with per-status Check/Minus/X glyphs (missed was rendering a red ✓!), dead "⋯" kebab removed, bottom Add Habit wired to `/habits`; `WeekStrip` rewritten — faint tint rings (`bg-primary/5` invisible below 50%) replaced with SVG stroke mini-rings (ProgressRing language, `ring-draw`), dead "See All →" removed; `MoodSelector.tsx` + `QuoteCard.tsx` deleted; `page.tsx` recomposed; `lib/home-data.ts` trimmed (mood/levels/note fetches + `moodCard`/`moodLevels`/`selectedMoodValue`/`moodNote`/`enableMoodNotes` fields gone; `mockMoodLevels` fallback gone)
- **Sidebar:** avatar + `UserMenu.tsx` deleted (the mystery "U" initial died with it — it was the email-prefix fallback, not the profile name); footer = Dark Mode toggle only; sidebar script quote kept
- **Cross-page polish:** Stats KPI flame bubble `bg-error-light text-error` → `bg-warning-light text-warning-strong`; `HabitRateCard` emoji tiles → bare `HabitIcon size={28}`; Quick Stats tiles → `bg-surface-alt` + tinted icon chips + colored values (were full-saturation green/red fills); MoodView insight rows filtered to `count > 0`; mood date strip + settings nav get new `.scrollbar-hide` utility; Calendar DayLegendCard decorative ℹ removed; Settings "+ Add Habit" → filled primary (matches /habits)
- **Docs:** code-standards deps (+react-popover, sheet noted deleted), ui-registry (PopoverPanel + Settings section-pane entries; Sheet entry → REMOVED), build-plan (F30 struck + overhaul section), progress-tracker (F30 cancelled, overhaul checkboxes, decisions block)
- **Verified:** tsc + lint + `next build` all clean

**Decisions made:**
- F30 cancelled → Danger Zone/About-links/Reset row deleted rather than left disabled (dead chrome)
- Settings = Option A (developer pick); Profile/Notifications/Mood stay in header popovers, NOT nav sections (developer explicit)
- Popover over hand-rolled (focus/portal/collision by Radix; F28.1's hand-rolled dropdowns were the "AI slop" complaint)
- This Week bug was visual (data was always correct) — fixed at the ring rendering, not the loader
- Home mood section fully removed including the stat card (row → 3); "quote on bottom left" read as Home QuoteCard (sidebar quote kept — flagged as assumption in plan, developer approved plan)
- `mock-home.ts` survives (InspirationCard's `mockQuotes` still imports it)

**Problems solved:**
- Screenshot "Sat, 12 Jul 2026" mystery = `Greeting.tsx` still rendering `mockHomeGreeting.dateLabel` with dead nav buttons
- Home "✓" on red circles = TodayHabits rendered a literal ✓ for every status; now Check/Minus/X
- This Week "shows nothing" = `ringClass` tiers (<50% = `bg-primary/5`) invisible in dark mode; SVG rings make any percent legible
- Avatar "U" = UserMenu's own email-prefix fallback vs Home's `profileDisplayName`; both moot now (avatar gone; sign-out relocated)

**Current state:** Phase 7 closed. Build + lint + tsc clean. Settings = section nav + unboxed pane + header popovers; Home = 3 KPI cards, green/yellow/red statuses, working week rings, no dead chrome; sidebar = logo/nav/quote/toggle only. Nothing in-app is known broken; QA is browser-only.

**Open questions:**
- Browser QA backlog (top priority next session): settings nav/pane switching, both popovers (anchor position, Esc/outside-click, sign-out flow), Home This Week rings with real data, Home status colors light+dark, Quick Stats softened tiles, mood insights zero-filter, `.scrollbar-hide` on mood strip, Stats flame/rate-card polish, all in light + dark
- `@radix-ui/react-dialog` now unused (Sheet deleted) — remove dep in a later cleanup unless something re-uses it
- Carry-forwards: OAuth e2e QA; login `?redirect=`; Mood Daily/Weekly/Monthly pills chrome-only; touch heat tooltip; F13→F28.1 QA backlog; F29 export→import round-trip QA

---

### Phase 7 — Habits Pass: Today Highlight + Habit Graph (Complete)

**Context:** Developer shared a reference image of the Habits grid — wanted the today column highlighted "exactly like this" (filled rounded-rect pill on the header number + purple outlined cells down the whole column) and a habit graph below the tracker "similar to mood graph."

**What was built:**
- `HabitGridCard.tsx` — today header number: `rounded-full h-5` circle → `rounded-md h-6 min-w-6` filled pill; today-column unset cells: tint-only (`bg-primary-lightest/60`) → `border-primary bg-primary-lightest/40` (solid outline + faint fill); today notes cell: dashed → solid `border-primary` + faint fill; status-filled cells keep their solid color (design image only showed the empty case; purple-on-green border would clash)
- `lib/stats.ts` + `HabitMonthPoint` + `buildHabitMonthSeries(statuses, activeHabitIds, year, month, todayKey)` — weighted daily completion (done=1/partial=0.5 over ACTIVE habits only, archived excluded); future days of current month → `null` (chart gap); past unlogged → honest 0; past months full
- `components/habits/HabitGraphCard.tsx` — AreaChart h-56 below the grid: gradient `habitFill`, `makeRevealAreaShape` (same curve-only 3s entrance + local-band-on-toggle as mood/streak), dots r=3.5 every point, Y [0,100] ticks 0/25/50/75/100%, X ticks 1/7/14/21/28; tooltip = date + % + "n done · m partial of t habits" (loose typing per MoodGraphCard precedent); empty states (no habits / future month); wrapper `key={year-month}` replays entrance on month nav
- `HabitsView.tsx` — `monthSeries` useMemo from existing state (statuses + active ids + viewMonth); chart recomputes live on cell toggles (optimistic state feeds it); no new fetches
- Docs: ui-registry (new "Habits — today highlight + Habit Graph" section; F29 Reset-row line corrected), build-plan (Habits pass bullet), progress-tracker (checkbox); memory appended

**Decisions made:**
- Status-filled today cells keep solid fill without outline (image only specified empty cells; clashing colors avoided) — noted as a call the developer can veto after seeing it
- Graph = single weighted-% series (not per-habit lines) — true analog of the Mood Graph; active habits only (Stats F18 convention)
- Reveal shape reused as-is — cell toggles get the local-band animation for free; entrance replays on month nav via wrapper key

**Problems solved:** none blocking — tsc/lint/build clean first pass (pre-empted Recharts `TooltipProps` friction by using the loose local tooltip type from the start)

**Current state:** Build + lint + tsc clean. Habits page: reference-image highlight + full-width Habit Graph under the grid. Browser QA (outline look in dark/light, graph entrance, toggle animation, month-nav replay, archived exclusion) not done — joins QA backlog.

**Open questions:**
- Browser QA: highlight fidelity vs the reference image (pill size/radius, outline weight, notes-cell look); graph feel (entrance, band-on-toggle, tooltip); whether filled+outlined today cells should ALSO get an outline (developer veto point)
- Carry-forwards unchanged (QA backlogs, OAuth e2e, `?redirect=`, Mood pills, touch tooltip, react-dialog dep cleanup)

---

### Phase 7 — Habits Pass Fixes: Auth Refresh Gap + Colored Graph Dots (Complete)

**Context:** Developer screenshot: console error `[HabitsView/cycleStatus] "Not authenticated"` on a grid cell click; also asked for habit-graph dots in different colors like the mood graph.

**What was built:**
- `proxy.ts` — **session-refresh gap fix:** `updateSession` was writing refreshed tokens only to the RESPONSE cookie jar, but the Server Action handling the SAME request authenticates with the REQUEST cookies — so the first mutation after access-token expiry failed with "Not authenticated" (then worked on retry once the browser held the fresh cookie). Fix: run `updateSession` against a donor `NextResponse`, mirror any refreshed `insforge_access_token` / `insforge_refresh_token` onto `request.cookies`, THEN build `NextResponse.next({ request })` and copy the donor's cookies onto it. No-op when tokens are fresh; fixes the one-shot failure when they're not
- `HabitGraphCard.tsx` — dots are now day-class colored like the Calendar legend: 100% → `success-strong` (green), ≥50% → `warning` (yellow), >0% → `error` (red), 0% → `border-strong` (gray); future/null days draw no dot; shape `dot` callback reads `payload` (MoodGraphCard precedent)
- Docs: ui-registry (graph-dots row); memory appended

**Decisions made:**
- Dot colors reuse the Calendar's weighted day-class thresholds (Great/Okay/Tough/No Data) — one color language for "how did this day go" across Calendar and the new graph, instead of inventing a percent-banding
- Mirror-fix chosen over action-level retry (refresh plumbing lives in middleware, which the SDK docs designate as THE refresh point for SSR; actions stay refresh-unaware)

**Problems solved:**
- "Not authenticated" on first mutation after idle: root-caused to response-vs-request cookie timing in the proxy, not to RLS or the action itself

**Current state:** Build + lint + tsc clean. Browser verification needed: leave the app idle past the access-token lifetime, click a cell — should succeed first try; graph dots should show green/yellow/red/gray per day class.

**Open questions:**
- If the developer still sees "Not authenticated" AFTER this fix, the refresh token itself is dead (genuine re-login needed) — distinguish by whether a page reload bounces to /login
- Carry-forwards unchanged

---

### Phase 8 — Comprehensive UI/UX Enhancements & Mobile Optimization (Complete)

**What was built:**
- `components/calendar/DayDetailsCard.tsx` — Checkbox status colors unified to match the rest of the application: `done` = Mint (`bg-success`), `partial` = Gold (`bg-warning`) with Minus glyph, `missed` = Coral (`bg-error`).
- `components/mood/MonthCard.tsx` & `components/mood/MoodView.tsx` — Removed non-functional Daily/Weekly/Monthly pill controls that did not affect month view rendering.
- `components/habits/HabitGridCard.tsx` — Sticky left column (`left-0 z-10/z-20 bg-surface`) for habit names and icons during horizontal scrolling, preserving context across all days in the month.
- `components/layout/Sidebar.tsx` — Universal Sign Out button added to the desktop sidebar footer.
- `components/layout/MobileNav.tsx` & `components/layout/MobileHeader.tsx` — Full mobile responsiveness:
  - Fixed mobile bottom navigation with icons and active status pills.
  - Sticky mobile header with brand badge, dark mode switch, and sign out button.
  - Desktop sidebar hidden on viewports `< 768px` (`hidden md:flex`) and main area padding adjusted accordingly.
- `components/home/TodayHabits.tsx` — Interactive improvements:
  - Multi-day check-in capability across the current week.
  - Aligned weekday column initials (`Su`, `Mo`, `Tu`, `We`, `Th`, `Fr`, `Sa`) above the status dots.
  - Optimistic client updates with rollback on action error for instant feedback.
- `lib/insights.ts` — Mood vs Habit correlation analytics computing mood averages on high-completion days vs lower-completion days.
- `components/habits/HabitGraphCard.tsx` — Habit Graph dots updated to match Mood Graph: larger radius `r=5` (activeDot `r=7`), card height `h-64`, and vibrant multi-color tier spectrum (100% Mint, ≥80% Sky, ≥60% Gold, ≥40% Lavender, >0% Coral, 0% Muted slate) with matching colored dot badge in tooltip.

**Verification:**
- Full Next.js production build (`npm run build`) succeeded with 0 errors and all routes compiled.

---

### Phase 9 — Next-Gen Modern Sleek UI/UX & Lumi Mascot (Complete)

**Context:** Developer requested a full app UI/UX modernization: sleek modern UI implementation, modern UI libraries, and an interactive mascot companion.

**What was built:**
- **Modern Libraries:** Installed `motion`, `canvas-confetti`, `@types/canvas-confetti`, `sonner`, `@radix-ui/react-tooltip`.
- **Lumi Mascot System (`components/mascot/LumiMascot.tsx`):**
  - Interactive SVG character with glossy 3D highlight, sprout on head, blushing cheeks, and reactive emotional states (`idle`, `happy`, `celebrate`, `streak`, `sleepy`, `supportive`).
  - Speech bubble dialogue system with science-backed encouraging affirmations and streak motivation.
  - Interactive tap feedback: bouncing animation and star particle confetti bursts.
  - Automatic `canvas-confetti` fireworks when user achieves 100% daily habit completion.
- **Modern Design System & Tokens (`app/globals.css`):**
  - Added `.glass-card` with `backdrop-filter: blur(16px)` for light and dark modes.
  - Neon glow utilities: `.glow-primary`, `.glow-success`, `.glow-warning`, `.glow-error`.
  - Floating and pulsing animation keyframes: `.animate-float`, `.animate-pulse-glow`.
- **Global Chrome & Ambient Aurora (`app/(app)/layout.tsx`):**
  - Ambient pointer-events-none background aurora glowing orbs (lavender, mint, warm gold) creating modern depth across all routes.
  - Added Sonner `Toaster` in `app/layout.tsx` with glass styling.
- **Home Dashboard Redesign:**
  - `components/home/Greeting.tsx`: Sleek journey pill badge, vibrant gradient display name, and integrated `LumiMascot`.
  - `components/home/StatCards.tsx`: High-definition multi-color SVG gradient ring, glowing flame card for active streaks, golden crown sheen, and `rounded-2xl` glass cards.
  - `components/home/TodayHabits.tsx`: Tactile rounded row styling, glowing status toggles, instant toast feedback on check-in, full-screen celebratory confetti on all-done, and friendly empty-state featuring Lumi.
  - `components/home/WeekStrip.tsx`: Gradient stroke mini rings with active today glow.
  - `components/home/QuickStats.tsx`: Modern rounded-xl tiles with hover border glow and crisp metrics.
- **Cross-Page Glassmorphic Overhaul:**
  - `components/ui/Card.tsx`: Upgraded base card to `rounded-2xl border-border/80 bg-surface/90 backdrop-blur-md hover:shadow-soft hover:border-primary/35`.
  - `components/habits/HabitGridCard.tsx` & `HabitGraphCard.tsx`: Glassmorphic containers, neon glowing status cells with subtle hover scale.
  - `components/mood/MonthCard.tsx` & `MoodView.tsx`: Glassmorphic styling, sonner toast feedback on mood logging.
  - `components/stats/HabitConsistencyCard.tsx`: Glassmorphic container with `hover:scale-125` tactile heat cells.
  - `components/calendar/MonthCard.tsx` & `DayDetailsCard.tsx`: Glassmorphic card styling.

**Verification:**
- Verified with `npm run build`: compiled 100% cleanly in 7.8s with 0 errors across all routes.

---

### Phase 9.02 — Stats Page GitHub-Style Heatmap Overhaul (Complete)

**What was built:**
- **Code Audit & Flaw Identification:**
  - Column width & tick blowout in monthly grid (day tick labels wider than column track causing misalignment).
  - Lack of month navigation (locked to server current month with no way to view history).
  - Habit names scrolled away on mobile/tablet (missing sticky left column).
  - Future dates rendered identically to past unlogged dates with confusing "No data" tooltip.
  - Zero touch/click interaction on mobile devices (hover-only).
  - Habit emoji icons and consistency percentages absent from matrix rows.
  - Absence of an annual 52-week contribution graph (the hallmark GitHub calendar experience).
- **Dual-Mode Consistency Card (`components/stats/HabitConsistencyCard.tsx`):**
  - **Segmented Mode Switch:** Clean toggle between `[ By Habit ]` and `[ Annual Activity ]`.
  - **Mode 1 — Monthly Habit Matrix:**
    - Interactive month navigation (`< Prev Month`, `Next Month >`, and `Today` quick reset).
    - Sticky left habit column (`sticky left-0 z-20 bg-surface/95 backdrop-blur-md`) with habit emoji badge, habit name, and monthly consistency percentage badge (`{rate}%`).
    - Differentiated future days (`border border-dashed border-border/50 bg-heat-0/35 opacity-40`) with `"Upcoming"` tooltip.
    - Clean numbered tick axis (`1, 7, 14, 21, 28, {days}`) preventing column track distortions.
  - **Mode 2 — 52-Week GitHub Contribution Calendar:**
    - True GitHub matrix layout: 7 weekday rows × 53 week columns.
    - Top month headers positioned over starting week columns (`monthHeaders`).
    - Left weekday indicators (`Mon`, `Wed`, `Fri`) aligned to rows.
    - Annual check-in summary metrics banner (total check-ins in the last year, active days, avg daily completion rate).
    - GitHub standard heat ramp legend: `Less [0] [1] [2] [3] [4] More` adapting to Lavender Sky, Mint, Peach, Ocean, Rose palettes.
  - **Interactive Cell Click / Touch Inspector:**
    - Clicking/tapping any cell in either view displays an interactive Inspector Card with full date, habit/progress details, and status badge.
    - Dismissible via close button or outside click.
- **Pure Statistics Engine (`lib/stats.ts`):**
  - Added `buildContributionCalendar` computing 53-week matrix, month boundaries, weekday labels, and weighted completion level (0–4).
  - Extended `buildStatsHeatRows` to compute `emoji`, `rate`, and `completedCount` for every habit row.
  - Added `ContributionDay`, `ContributionMonthHeader`, `ContributionCalendarData` types.
- **Quality & Housekeeping:**
  - Resolved pre-existing ESLint warnings in `TodayHabits.tsx`, `LumiMascot.tsx`, and `DayDetailsCard.tsx`.
  - Verified `npm run lint`: 0 errors, 0 warnings.
  - Verified `npm run build`: 100% clean production build.

---

### Phase 9.03 — Heatmap Feedback Polish: Removed Percentages, Edge-to-Edge Full Width, Authentic GitHub Styling (Complete)

**What was built:**
- **Removed Percentages:** Eliminated `{row.rate}%` badges from habit rows entirely. Expanded habit column to `minmax(11rem, 13rem)` so full habit names ("Wake up at 8:00 AM", "Core Exercise", "Bath before sleep", "Sleep at 12:00 AM") fit cleanly without truncation or ellipses.
- **Fixed Empty Space on the Right:**
  - Replaced fixed `repeat(${currentDays}, minmax(13px, 16px))` with `repeat(${currentDays}, minmax(0, 1fr))`.
  - Both Monthly Grid and 52-Week GitHub Heatmap now stretch proportionally across 100% of the card width with zero dead space on the right.
- **Authentic GitHub Aesthetics:**
  - Removed wireframe dashed borders on future days; replaced with flat, clean subtle cells matching GitHub inactive style.
  - Removed bulky neon double-ring outline on today's cell; today is cleanly accented on the axis tick number.
  - Removed unnecessary "GitHub Style" badge in card header.
  - Renamed segmented toggle to `Monthly Grid` and `GitHub Heatmap` for maximum clarity.
- **Verification:**
  - `npx tsc --noEmit`: 0 errors.
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: Compiled 100% cleanly.



---

### Phase 9.04 - Habit Consistency Monthly Heatmap: Exact GitHub-Style Reference Match (Complete)

**What was built:**
- **User-attached reference image wins:** matched `HabitConsistencyCard.tsx` "By Habit" monthly view exactly to the attached GitHub-style dark card screenshot (Ocean dark theme; color ramp already theme-driven via `--heat-cell-*` tokens, no hardcoded hex).
- **Header:** restored "GitHub Style" pill badge beside the title; subtitle now "Daily breakdown by individual habit for the selected month."
- **Segmented toggle:** renamed to "By Habit" / "Annual Activity" (was "Monthly Grid" / "GitHub Heatmap").
- **Habit rows:** restored monthly consistency % pill (`{row.rate}%`, `bg-surface-alt text-primary tabular-nums`) in the sticky habit column; name truncates with full-name tooltip; column widened to `minmax(11.5rem, 13.5rem)`.
- **Cells:** flat GitHub-style `rounded-[3px]` squares; future days render identically to unlogged (`bg-heat-0`, removed dashed/bordered variants); today keeps a subtle primary ring.
- **Month nav:** borderless circular chevron buttons; axis label changed to "Day:" (ticks 1/7/14/21/28/31 unchanged).
- **Verification:** temporary unauthenticated `/preview-heat` route rendered the card with Oct 2026 mock data; Playwright (msedge channel) screenshots confirmed dark, light, and Annual Activity tab all match the reference; route deleted afterward. `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.

**Open questions / carry-forwards:**
- Browser QA of the real `/stats` route still needs a signed-in session (auth redirect blocks automated capture).
- Annual view month headers truncate to "N.." / "J..." at 53 columns (pre-existing, out of scope this pass).

---

### Phase 10 — Correctness & Contrast Pass (Complete)

**Context:** Developer asked for a full-project audit: bugs, flaws, UI/UX gaps, and a better
route to a modern sleek design with smooth motion. Two deep audits were run in parallel
(one over `lib/` + `actions/`, one over `components/` + `app/`), then every high-severity
finding was verified against the real source and fixed.

**What was fixed (5 critical):**

- **Aurora orbs were invisible on every page.** `app/(app)/layout.tsx` was
  `position: relative; z-index: auto` (no stacking context); the orbs were `-z-10`
  (CSS paint step 2) while the wrapper's opaque `bg-background` painted at step 6 and
  covered them. Fix: `isolate` on the wrapper + orbs at `z-0` + content left at
  `z-index: auto` (so in-page modals at z-50 still paint above the z-40 sidebar).
  Extracted to `components/layout/AuroraBackdrop.tsx`; added transform-only drift.
- **`animate-in` / `fade-in` / `slide-in-from-*` are not Tailwind classes** — the
  `tailwindcss-animate` plugin was never installed, so the Lumi speech bubble and the
  heatmap inspector appeared with zero motion. Replaced with real `motion` animations
  (`motion/react`: `AnimatePresence`, spring, `useReducedMotion`). `motion@14` had been
  installed in Phase 9 and never imported anywhere.
- **`.modal-in` class did not exist** — only the `@keyframes modal-in`. Settings
  popovers opened with no motion. Class added.
- **The 3s chart wipe restarted on every parent re-render.** `makeRevealAreaShape` was
  called inside component bodies, producing a new component *type* each render → React
  remounted the shape → the entrance flag reset. Now hoisted to module scope
  (HabitGraphCard, StreakHistoryCard) or `useCallback` + `useMemo` (MoodGraphCard).
  The RAF loop now writes the clip `<rect>`/`<polygon>` attributes directly, so a 3s
  entrance costs 2 React renders instead of ~180.
- **Contrast collapse.** `--color-primary` (`#a78bfa`, 2.72:1 on white) was used as
  body text in 57 places; `--color-text-muted` (`#94a3b8`, 2.57:1) in 118. New
  `--color-primary-text` token (per theme, ≥4.5:1 verified), light `--color-text-muted`
  darkened per theme, plus `--color-primary-on`, `--color-danger-button`,
  `--color-switch-knob`. `text-primary` → `text-primary-text` across 50 files.

**Data-correctness fixes (4, all with executable proof):**

- **Stats buckets were not clipped to today** — a perfect October scored 61% on the
  chart next to a KPI reading 100% for identical data; the current year was meaningless.
- **Three conflicting "completion rate" definitions** — a habit created mid-month was
  charged for days before it existed (KPI 53% vs habit-rate card 100% vs heatmap 53%).
  Unified behind one `periodCompletionRate` / `weightedHabitRate`.
- **Insights divided by *logged* habits, not *active* habits** — a day with 1 of 5
  habits done scored 100%, so the weekday/weekend insight could never fire. Also fixed:
  days with no habit logging no longer count as "low completion" days.
- **Longest streak broke across a DST boundary** — the check was
  `getTime() - getTime() === 86_400_000`, which is false for the 23h/25h gaps a DST
  change creates. Replaced with a calendar-day gap. Verified: 43 consecutive days
  across a spring-forward boundary now reports 43 (was 33).

**Also fixed:** mood value validated against the account's real `mood_levels` (a `7`
stored on a 6-level scale and rendered no face); `NEXT_REDIRECT` no longer swallowed by
the mood loaders (an expired session said "Failed to load month" instead of redirecting
to login); calendar mood-level ordering aligned with every other page (the legend listed
"Fu*ked Up" first); per-key optimistic rollback + stale-request guards in Habits / Home
/ Mood / Calendar; missing `revalidatePath` calls (`/stats`, `/calendar`, week-start
across four routes); `withCompletion` now replaces in place instead of reordering the
array; `@custom-variant dark` so `dark:` utilities follow the app's theme instead of the
OS.

**New:** `app/(app)/loading.tsx` (shimmer skeleton — every route is dynamic, so
navigation previously had zero feedback), `app/(app)/error.tsx` (branded boundary with
retry), `components/ui/Skeleton.tsx`, `components/ui/StatusPop.tsx` (`status-pop` motion
on the core check-in interaction, only on a genuine status change), `transition-all`
replaced with targeted transitions.

**Decisions made:**
- The soft pastel `--color-primary` stays the brand **fill**; a separate
  `--color-primary-text` carries type. Solid primary surfaces use deep ink on the
  pastel rather than white on it — which also matches the reference PNG's "Add Habit"
  button (a light fill with dark text).
- The switch knob flips with the mode: no single colour clears 3:1 against both a pale
  on-track and a deep off-track.
- The 3s chart entrance duration was **kept** — it was a deliberate developer decision
  in Phase 7.25.5. The bug was that it restarted, not that it was slow.
- `saveMoodCheckin` is dead code (no importers since the Home mood section was
  removed). Fixed to use the shared scale validator rather than deleted. **Flagged for
  deletion.**

**Verification:** `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/warnings ·
`npm run build` clean (all app routes still dynamic) · executable stats suite
(Node `--experimental-strip-types`, `TZ=Europe/Berlin`) 10/10 checks pass · Playwright +
Edge 10 screenshots (5 themes × light/dark) of a temporary `/preview-phase-a` route
confirming the aurora now renders, contrast is legible, the switch knob is readable and
the skeleton animates. Route deleted after capture.

**Problems solved:**
- `memory.md` was truncated by a PowerShell string-surgery write during this session
  (109,847 → 7,691 chars). Recovered byte-exact from opencode's own session database
  (`~/.local/share/opencode/opencode.db`, `part` table — the stored `read` tool
  outputs), which had every line of the file. **Lesson: use the `edit` tool for
  in-place file edits, never PowerShell `Substring`/`IndexOf` surgery.**
- PowerShell's `Set-Content -Encoding UTF8` writes a BOM; it was added to 29 `.tsx`
  files during a bulk class rename and had to be stripped afterwards. Use
  `[System.IO.File]::WriteAllText($p, $c, (New-Object System.Text.UTF8Encoding($false)))`.
- `eslint` rejects a non-literal dependency array in `useMemo` — memoise with
  `useCallback` + `useMemo` instead of a `deps` parameter.

**Open questions / carry-forwards:**
- **Signed-in browser QA is still outstanding** for everything except the preview route.
  The auth redirect blocks automated capture of the real pages.
- Phase B (one design language) is next: unify `<Card>` (23 hand-rolled variants), the
  3 progress-ring implementations, the 3 hand-rolled modals (no focus trap → Radix
  Dialog), 3 month navigators, 2 nav definitions, 2 dark-mode toggles, 2 save-status
  lines, 6 script-quote blocks, 2 stat-tile shapes.
- Phase C (motion system) is next: `motion` wired across the app, heatmap cascade,
  count-ups, mood-face spring, tooltip spring, FLIP habit reorder, settings cross-fade.
- Dead settings still ship with no effect: `show_completed_habits`,
  `compact_habit_view`, `default_reminder_time`, `default_frequency`. Implement or delete.
- `actions/moods.ts` → `saveMoodCheckin` — delete.
- `@radix-ui/react-dialog` and `@radix-ui/react-tooltip` are installed but unused.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.
---

### Phase 11 — One Design Language (shared primitives) (Complete)

**Context:** Developer approved Phase B ("one design language") after the Phase 10 audit
found nine duplicated UI patterns. Goal: collapse each into one shared primitive so
radius, border, surface, padding, spacing and motion are identical everywhere.

**What was built — 9 shared primitives, 30+ call sites migrated:**

- **`<Card>`** — one card surface for **23** hand-rolled variants
  (`rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md p-5 shadow-card`).
  The base hover that advertised interactivity on every non-clickable card is now behind
  an `interactive` prop. `transition-all` was already replaced with targeted transitions.
- **`<ProgressRing>`** — one ring for the three former implementations (Home progress,
  Home week strip, Calendar overview). The Calendar ring previously had **no** draw
  animation at all; it does now. `aria-label` support fixes the "progress % hidden from
  screen readers" defect.
- **`<Modal>`** — **Radix Dialog** replaces three hand-rolled modals that had no focus
  trap, no focus restore, and a page behind that stayed tabbable. Adds portal, scroll
  lock, Escape, outside-click dismiss, `aria-labelledby`/`aria-describedby`, a `motion`
  spring entrance, `useReducedMotion` support, and a `footer` slot.
- **`<StatTile>`** — one tile for the Home Quick Stats tiles and the Stats KPI cards.
- **`<ScriptQuote>`** — one decorative script quote for six near-duplicate blocks. Colour
  moved from `text-accent-foreground` (mode-only, stayed violet in Mint/Ocean/Peach) to
  `text-primary-text` (theme-aware).
- **`<SaveStatusLine>`** — one status line; AppearanceCard's private copy deleted.
- **`<MonthNav>`** + **`<TodayButton>`** — one month navigator for the Habits page, the
  Mood card and the Calendar card. Exports `TodayButton` so the right-aligned variant
  (Calendar) matches the inline one (Habits).
- **`<DarkModeToggle>`** — one dark-mode switch for the sidebar and the mobile header.
- **`components/layout/nav-items.ts`** — one `NAV_ITEMS` + one `isActivePath` predicate for
  both nav bars.

**Deleted:** `components/habits/MonthNav.tsx`, `components/settings/SaveStatusLine.tsx`,
the dead `.modal-backdrop` / `.modal-panel` CSS, and ManageHabitsCard's duplicate global
Escape listener (Radix owns it now).

**Decisions made:**
- The card keeps the glass treatment Phase 9 introduced — it now actually reads, because
  the aurora orbs render behind it. Cards that intentionally differ: the floating chrome
  (Modal, Popover), tinted sub-tiles inside a card, and the decorative gradient panels.
- `<Modal>` ships an **enter** animation only. An exit animation needs Radix
  `forceMount` + `AnimatePresence`, which risks leaving a closed modal in the DOM.
  Deferred rather than shipped half-working.
- Script quotes use `text-primary-text` so they re-theme with the active colour theme.

**Problems solved (self-inflicted — recorded so it is not repeated):**
- A bulk class rename run through PowerShell `Get-Content -Raw` → `Set-Content -Encoding
  UTF8` **corrupted every non-ASCII character in the 29 files it touched** (emoji became
  mojibake) and added a UTF-8 BOM to each. Both were detected and fully repaired: BOMs
  stripped, and 102 mojibake runs across 16 files reversed by re-decoding the CP1252 bytes
  as UTF-8. **Lesson: never round-trip source files through PowerShell.**
- A JSX bulk-rewrite script computed its replacement as `before + "<Card>" + after`, which
  **deleted the card bodies of 15 files**. Recovered byte-exact from the Turbopack source
  maps in `.next` (the production build window holds exactly one version per file) plus the
  pre-damage backup, then re-verified with `tsc` + `lint` + a head/tail match against the
  surviving file. **Lesson: keep the body in a structural rewrite, and dry-run the diff.**
- The `edit` tool fuzzy-matches when the old string contains characters that differ from
  the file (correct emoji vs mojibake) and left a duplicated tail in `Sidebar.tsx`. Caught
  by `tsc`; a duplicate-block scanner was added to the verification set.

**Verification:** `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/0 warnings ·
`npm run build` clean (all app routes still dynamic) · Playwright + Edge screenshots of
every new primitive in light and dark plus a DOM probe confirming the modal exposes
`role="dialog"`, `aria-labelledby` and `aria-describedby` · integrity sweep: no BOM, no
mojibake, no duplicated structural blocks.

**Open questions / carry-forwards:**
- **Signed-in browser QA is still outstanding** — the auth redirect blocks automated
  capture of the real pages. The primitives were verified in isolation, not in situ.
- Phase C next: `motion` wired as the single motion system — heatmap cascade, count-ups,
  mood-face spring, tooltip spring, FLIP habit reorder, settings cross-fade, modal exit
  animation.
- 4 dead settings still ship with no effect: `show_completed_habits`,
  `compact_habit_view`, `default_reminder_time`, `default_frequency`.
- `actions/moods.ts` → `saveMoodCheckin` — dead, delete.
- `@radix-ui/react-tooltip` is installed but still unused.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.
---

### Phase 12 — Motion system (`motion` as the single driver) (Complete)

**Context:** Developer approved Phase C. `motion@14` had been installed in Phase 9
and never imported — it was the intended animation library all along.

**What shipped:**

- **Modal enter AND exit** — `AnimatePresence` + Radix `forceMount`. `Dialog.Root`
  is hard-coded `open` and `AnimatePresence` owns the lifecycle, so the exit plays
  before the tree unmounts. (Phase B shipped enter-only; exit needed Radix
  `forceMount` and was deferred rather than shipped half-working.)
- **`<CountUp>`** — RAF ease-out over 700 ms on the Home progress %, both streak
  counts and the Quick Stats tiles. The animated text is `aria-hidden` with an
  `sr-only` sibling carrying the final value, so a screen reader hears the number
  once instead of 60 times.
- **`<MoodFacePop>`** — cross-fade + spring when a mood value changes. Used on the
  Mood page's date strip; `MoodFace` itself stays a static SVG for the graph axis.
- **Heatmap cascade** — the `.heat-cell` class had existed since Phase 7 but was
  **never applied**. Now: the monthly matrix fills in as a diagonal wave, the
  annual grid drops in one week column at a time (GitHub-style).
- **Heatmap tooltip glide** — 120 ms. The position is now computed in the mouse
  handler (before the tooltip mounts), so the first placement is instant and later
  ones glide instead of teleporting. The tooltip is now width-bounded — it was
  `whitespace-nowrap`, so a long habit name produced a bubble that ran off-screen.
- **FLIP on habit reorder** — rows glide to their new positions.
- **Settings section cross-fade** + a shared-layout nav pill that SLIDES between
  items instead of the background jumping.
- **Drag-over re-render storm fixed** — `dragover` fires ~60×/s and the handler
  was re-rendering the whole 31-column grid on every event.
- **Reduced motion, two switches** — a global CSS kill-switch (`*` with
  `!important`) plus `<MotionConfig reducedMotion="user">` for the JS-driven
  animations, because `motion` animates transforms from JavaScript and the CSS
  switch cannot reach it. Previously only a named list of classes was suppressed:
  the mascot still floated forever and every Tailwind `transition-*` still ran.
- **Cascade layers** — the custom classes were unlayered, so they silently beat
  every Tailwind utility (the Toaster's `border-border shadow-pop` were dead
  because `.glass-card` won). They now live in explicit `components` /
  `utilities` layers.

**Decisions made:**
- The neon `glow-*` classes go in `@layer utilities`, not `components`. They set
  `box-shadow`, which collides with the base card's `shadow-card` and the cells'
  `shadow-xs` — as components they would have lost and the glows would have
  disappeared.
- The heatmap cascade animates `transform` with `backwards` fill, not `both`. A
  `both` fill keeps `transform: scale(1)` applied forever, and a CSS animation
  outranks the `hover:scale-*` utility — the hover pop would be dead.
- The tooltip position moved from an effect into the mouse handler so the tooltip
  mounts already positioned (a freshly mounted element never transitions its
  initial style).

**Verification (Playwright + Edge, against a temporary preview route):**
- Count-up: `0%` at 90 ms → `78%` at 1.5 s
- Heat cascade: 36 cells, all animating with `heat-cell-in`, 16 distinct delays
- Modal exit: dialog still in the DOM 60 ms after close, unmounted afterwards
- FLIP: row positions converge mid-animation (`[650,650,651,651]`) then settle
- Zero console errors (only a pre-existing favicon 404)

`npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/0 warnings · `npm run build`
clean · integrity sweep: no BOM, no mojibake, no duplicated structural blocks.

**Open questions / carry-forwards:**
- **Signed-in browser QA is still outstanding** — the auth redirect blocks automated
  capture of the real pages. Everything so far was verified in isolation.
- 4 dead settings still ship with no effect: `show_completed_habits`,
  `compact_habit_view`, `default_reminder_time`, `default_frequency`.
- `actions/moods.ts` → `saveMoodCheckin` — dead, delete.
- `@radix-ui/react-tooltip` is installed but still unused.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.

---

### Phase 13 — Missing-column fix + 5 new reference color themes (Complete)

**Context:** Developer hit a console error on `/habits` —
`[lib/habits-data/loadHabitsPageData] habits: "column habits.reminder_time does
not exist"` — and the Habits grid rendered empty. Then attached 5 new theme
screenshots and asked to keep the current themes and add these too.

**The error (root cause found and fixed):** migration
`20261020101500_f13-habit-reminder-time.sql` existed in the repo but was
**never applied to the remote database**. `lib/habits-data.ts` selects
`reminder_time`, so the whole habits query failed → empty grid despite 9
seeded rows being present. Fixed with
`npx -y @insforge/cli db migrations up --all`. Verified: column exists, the
exact loader query returns all 9 rows, and PostgREST's schema cache serves it.
**Lesson: a migration file in `migrations/` is not applied — check
`db migrations list` before assuming the schema matches the code.**

**Build-breaking TS errors (same half-landed F13 change):** `GridHabit.reminderTime`
was required but never set by `HabitFormModal` or `ManageHabitsCard` →
`tsc` failed on 4 errors, so the app could not build. Fixed by threading the
field through, and F13's UI was completed at the same time:
- `lib/settings-data.ts` — `SettingsHabit` += `reminderTime`; habits select
  += `reminder_time`; mapper updated.
- `components/settings/ManageHabitsCard.tsx` — both GridHabit mappers carry
  `reminderTime`.
- `components/habits/HabitFormModal.tsx` — **new "Planned time" `<input type="time">`**
  (display-only, no push — hard rule 7), prefilled from the habit, sent on
  create + update. **Without this, every edit would have wiped the stored
  value** (the action writes `reminder_time` from the form payload).

**The 5 new themes (added ALONGSIDE the 5 existing ones — nothing replaced):**

| Theme | Accent | Reference |
|-------|--------|-----------|
| Sage | `#aec69f` | img_02 — dark, sage green |
| Clay | `#a85d3c` | img_03 — light, terracotta |
| Lagoon | `#6fcac3` | img_04 — dark, teal |
| Berry | `#ab5268` | img_05 — light, raspberry |
| Orchid | `#b8a6eb` | img_06 — dark, violet |

- **Accent source:** the reference mock's own theme-switcher chips, which
  list the canonical accent of every theme and are identical across all five
  screenshots. Sampled programmatically, not eyeballed.
- **Reference chrome:** near-neutral page tinted a whisper toward the accent.
  Reference page bgs — sage `#1c1d1c`, clay `#f3eee4`, lagoon `#0e1d28`,
  berry `#f6eeee`, orchid `#171624`. The mode each theme is NOT shown in was
  derived from the same recipe.
- **Unlike the original five**, these also override the full chrome
  (background/surface/border/text) in both modes, because the reference
  renders a neutral page with one saturated accent.
- **`--color-primary-on` is per-theme:** deep ink `#1e1b4b` on the pastel
  light primaries, `#ffffff` on the saturated ones (clay, berry) — matching
  the reference, whose light-mode buttons carry white text on the saturated
  accent.
- **`--color-switch-knob` flips with the mode** (deep ink light / white dark)
  so it clears 3:1 against both the on-track and the off-track. The Switch's
  on-track is `bg-primary` in light and `bg-primary-dark` in dark, so the
  knob must be checked against the right one per mode.
- **Palettes were generated in OKLCH** (perceptually even ramps) from the
  sampled reference anchors, then contrast-solved, rather than hand-picked.
- **Registration:** `types/index.ts` ColorTheme, `ThemeProvider` VALID_COLORS,
  `actions/settings.ts` COLOR_THEMES, `lib/data-export.ts` colorThemeSchema,
  `AppearanceCard` COLOR_OPTIONS (10 swatches + disabled Custom),
  `--color-swatch-*` tokens for the 5 new ones.
- **Migration** `20261020150000_f14-new-reference-color-themes.sql` widens the
  `profiles.color_theme` CHECK constraint (it enumerates allowed values, so
  a new theme cannot be persisted without it). Applied + verified.

**Verification:**
- `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/0 warnings ·
  `npm run build` clean (all app routes still dynamic).
- **DOM probe over all 10 new theme × mode combinations**: every real
  app pairing (`bg-primary`+`text-primary-on`, `bg-primary-lightest`+
  `text-primary-text`, `bg-primary/15`+`text-primary-text`, `text-primary-text`
  on surface) clears WCAG AA 4.5:1; switch knob and heat cells clear 3:1.
  The one failure found (`dark lavender soft 3.58`) is **pre-existing in the
  untouched Lavender theme**, not introduced here.
- Playwright + Edge screenshots of all 20 combinations: the 5 original
  themes are visually unchanged; the 5 new ones render distinctly with the
  reference chrome. Temporary `/preview-themes` route deleted afterwards.
- Integrity sweep: no BOM, no mojibake in any edited file.

**Problems solved:**
- "Habits page is empty" was a missing migration, not missing data — the 9
  demo habits were in the DB the whole time.
- The build was broken independently of the runtime error (4 TS errors from
  the same half-landed change); fixed at the root by threading the field
  through rather than loosening the type.
- Editing a habit would have silently wiped `reminder_time`; caught while
  fixing the type errors and fixed by actually adding the form field.

**Open questions / carry-forwards:**
- Signed-in browser QA still outstanding — the auth redirect blocks automated
  capture of the real pages; the new themes were verified via a temporary
  preview route, not in situ on `/settings`.
- The 5 new themes are not covered by the old `public/UI palette/*.png`
  sheets (no sheet exists for them) — their chrome comes from the reference
  screenshots only.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; 4 dead
  settings; `saveMoodCheckin`; `@radix-ui/react-tooltip` unused; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.

---

### Phase 13 (part 2) — Motion parity: sliding side menu + page cross-fade

**Context:** Developer asked for the Settings page's animation to be applied
to (a) the side menu and (b) all other pages — and for the pages to use the
fade+slide **instead of the skeleton loading**.

**Side menu — sliding pill (done):**
- New shared primitive `components/ui/SlidingIndicator.tsx` — a `motion.span`
  with a `layoutId`, so the active highlight **slides** between nav items
  instead of jumping. Spring `stiffness: 420, damping: 34` (the same values
  the Settings tab pill already used).
- `Sidebar.tsx` — active item now renders the pill (`bg-accent-light`) with
  the icon+label in a `relative z-10` span; the active **text** colour moved
  from the item's class to `text-accent-foreground`.
- `MobileNav.tsx` — the icon bubble's `bg-primary-lightest` became a sliding
  32×32 circle pill.
- `SettingsShell.tsx` — refactored to use the same shared primitive (it was
  the original inline implementation).
- **layoutIds must stay unique**: `sidebar-nav-pill`, `mobile-nav-pill`,
  `settings-nav-pill`. Two indicators sharing an id fight over the same
  layout slot — checked and verified unique.

**Pages — cross-fade instead of skeleton (done):**
- New `components/layout/PageTransition.tsx`: `AnimatePresence mode="wait"`
  keyed on `usePathname()`, wrapping the app router's children in
  `app/(app)/layout.tsx`. Enter `{ opacity: 0, x: 10 }` → `{ opacity: 1, x: 0 }`,
  exit `{ opacity: 0, x: -10 }` — **the exact motion of the Settings section
  cross-fade**, 0.18s, `cubic-bezier(0.22, 1, 0.36, 1)`.
- `mode="wait"` (not the default "sync") is required for pages: both trees
  are static in the document flow, so overlapping them stacks two full pages
  and jumps the layout.
- **Deleted:** `app/(app)/loading.tsx`, `components/ui/Skeleton.tsx`, the
  `.skeleton` class and the `skeleton-sweep` keyframes (no remaining
  references).

**The conflict this exposed (the important find):** the pages already had a
CSS `page-enter` class that faded their blocks in with a stagger. On a route
change that animation re-ran, so the container was still fading in while the
blocks were *independently* fading from 0 — **the page read as blank for
~0.9s** (caught on a 10-frame filmstrip, not visible in a static screenshot).
Fixed by making `@keyframes page-enter` **rise-only** (the opacity was
removed) so the container owns the opacity and the class only adds the rise.
Re-measured: block opacity stays 1.00 for the whole transition.

**Decisions made:**
- The route transition reuses the Settings motion **verbatim** rather than
  inventing a new one — the developer's reference was the Settings page.
- Kept the per-block `page-enter` stagger (rise-only) so the page still
  assembles itself block by block.
- Reduced motion: `useReducedMotion()` disables the enter/exit transform;
  the CSS class is already covered by the global `prefers-reduced-motion` kill-switch.

**Verification:**
- `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/warnings ·
  `npm run build` clean (all app routes still dynamic).
- **Playwright + Edge, per-frame sampling of computed styles:**
  - Sidebar pill slides 176px → 223px across 24 sampled positions.
  - Mobile pill slides 21px → 68px across 17 positions (32×32 circle).
  - Page transition: wrapper opacity 1.00 → 0.00 → 0.99, transform
    0 → −10 → +9.85 → 0 — i.e. the old page fades and slides LEFT, the new
    one fades in from the RIGHT, exactly like the Settings tabs.
- Screenshots confirm the pill lands on the new item and the new page
  renders. Temporary `/preview-motion`, `/preview-enter`, `/preview-mobile`
  routes deleted afterwards; `nav-items.ts` restored to its real hrefs.

**Problems solved:**
- A skeleton that flashed a placeholder grid on every navigation is gone;
  navigation now cross-fades.
- Caught a latent "page looks blank for 0.9s" regression that only a
  frame-by-frame capture would show — a static screenshot looked fine.

**Open questions / carry-forwards:**
- The route cross-fade was verified on the preview route inside the real
  `(app)` layout (same wrapper, same nav); the real authenticated pages
  were not clicked through in a browser.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; 4 dead
  settings; `saveMoodCheckin`; `@radix-ui/react-tooltip` unused; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.

---

### Phase 13 (part 3) — Motion direction fix: everything slides from the LEFT

**Context:** Developer reported that the Settings page behaved correctly but
"all other pages slide from below", and asked that **all** pages fade in
and slide **from the left**, with the animation "slightly slower and
smoother".

**Two separate causes, both fixed:**

1. **The "slide from below" was the CSS `page-enter` class**, not the JS
   transition. It rose each page's blocks from below
   (`translateY(12px) → 0`) and was applied to all six page roots (Home,
   Habits, Mood, Stats, Calendar, Settings) + the error boundary. It was
   **removed entirely** — keyframes, `.page-enter` rules, the
   `prefers-reduced-motion` entry, and every usage. The page-level
   entrance is now `PageTransition` alone.

2. **The transition direction was mirrored.** It was entering from the
   RIGHT (`x: 10 → 0`) and exiting LEFT. It now **enters from the LEFT**
   (`x: -16 → 0`) and **exits to the RIGHT** (`x: 0 → 16`).

**Timing — "slightly slower and smoother":**
- before: 0.18s, `cubic-bezier(0.22, 1, 0.36, 1)`, 10px
- after: enter 0.32s `cubic-bezier(0.32, 0.72, 0, 1)` (decelerate — it
  glides to a stop) · exit 0.28s `cubic-bezier(0.4, 0, 0.6, 1)`
  (accelerate — it drifts away) · 16px travel.

**New shared module `lib/motion.ts`:** `EASE_IN`, `EASE_OUT`,
`ENTER_DURATION`, `EXIT_DURATION`, `SLIDE_DISTANCE`. Both the route
transition (`components/layout/PageTransition.tsx`) and the Settings section
cross-fade (`components/settings/SettingsShell.tsx`) import from it, so
switching a Settings tab and switching a page are literally the same
gesture. The Settings section previously ran its own hardcoded 0.18s /
`x: 10` values; it now shares the presets and matches the new direction.

**Verification (per-frame sampling of computed styles, Playwright + Edge):**
- Route transition: x sequence `0 → 16` (exit, fading out) then
  `-16 → 0` (enter, fading up). 18 exit frames at x>0 (max 16), 7 enter
  frames at x<0 (min -16).
- Settings section: x sequence `0 → 16 → -16 → 0`, 17 exit frames,
  8 enter frames. Same direction as the route transition.
- Filmstrip confirms the incoming page is visibly offset to the LEFT
  mid-flight and settles into place.
- `npx tsc --noEmit` 0 errors · `npm run lint` 0 · `npm run build` clean.
- Temporary `/preview-enter` + `/preview-settings` routes deleted.

**Note on the probe:** the first attempts recorded 0 frames — a raw
`<a href>` triggers a full document load (destroying the recorder), and a
`page.evaluate` rAF loop dies with the context. Fixed by using `next/link`
(SPA nav keeps the window alive) and a `setInterval` sampler that runs
inside the page.

**Open questions / carry-forwards:**
- The new direction was verified on preview routes; the real
  authenticated pages still need a click-through.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; 4 dead
  settings; `saveMoodCheckin`; `@radix-ui/react-tooltip` unused; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.

---

### Phase 13 (part 4) — Public marketing landing page + auth redesign

**Context:** Developer asked for a landing page that appears BEFORE login,
selling RESULTS not the app, with a sign-in option, Lumi the mascot in 2–4
places with different messages/variations, sleek light+dark design, and a
sign-in page that also allows sign-up and shows the account the user last
used (masked). Explicitly instructed: research UI/UX designs first, ask
questions, then start.

**Research (web + local patterns) — what it changed:**
- **Dark mode is now a premium signal** (Linear/Vercel/Orbit ship dark-first);
  product-first heroes with real UI beat illustration heroes.
- **Bento grids** have replaced uniform 3-column grids — the LAYOUT signals
  which feature is flagship.
- **Outcome headlines** lift ~18% over category claims; named-customer
  social proof lifts ~22% — but there ARE no real users, so fabricating
  testimonials was rejected in favour of live product visuals.
- Decisions confirmed with the developer: landing at `/` + app Home at
  `/home`; two OAuth tabs (no email/password form — OAuth auto-creates the
  account); live product visuals instead of testimonials; headline
  "Build the version of you that shows up."

**What was built:**
- `app/(marketing)/page.tsx` owns `/` (public, static). `app/(app)/page.tsx`
  → `app/(app)/home/page.tsx`. `proxy.ts` protected routes now start at
  `/home`; all `revalidatePath("/")` → `revalidatePath("/home")` (7 action
  files); the OAuth callback redirects to `/home`; `nav-items.ts` Home href
  → `/home`.
- `components/landing/`: `LandingHeader` (sticky, transparent → frosted on
  scroll), `LandingHero` (outcome headline + real habit-grid visual +
  risk-reducer line), `LandingResults` (bento grid of OUTCOMES, flagship
  tile 2×2), `LandingHowItWorks` (3 steps), `LandingCta`, `LandingFooter`,
  `LandingHabitGrid` (the app's REAL cell language — same tokens, same
  ✓/~/✗ glyphs — with a staggered spring entrance), `LandingHeatmap` (the
  same GitHub-contribution ramp the Stats page uses), `Reveal` (scroll
  reveal: fade + rise, `once: true`).
- **Lumi in 4 places with distinct moods + messages:** hero (`happy`),
  results grid (`supportive`), how-it-works (`streak`), closing CTA
  (`celebrate`). `LumiMascot` gained `message`/`caption` props (a fixed
  line instead of the random quote) and — importantly — `supportive` and
  `streak` got their OWN faces (both previously fell through to the
  default, so two of the four placements would have looked identical).
- **Auth redesign:** `Sign in` / `Create account` tabs with a sliding
  `layoutId` pill, panel cross-fade matching the app's page transitions.
- **Remembered account** (`lib/remembered-account.ts`): a cookie
  (`ht_last_account`) written by the OAuth callback, which knows the email
  and the provider the visitor picked (`ht_oauth_provider` short-lived
  cookie). Read via `useSyncExternalStore` (server snapshot null → no
  hydration mismatch). Shows avatar initial + **masked** email
  (`ad••••@example.com`) + provider + Continue + "Use a different account".
  The full email is NEVER rendered.

**Key design decision — the SDK has no "list accounts" call, and should not
have one:** a list of every account that ever signed in on the device would
leak other people's addresses. The app remembers exactly ONE account — the
one THIS browser used last — locally.

**Verification:**
- `npx tsc --noEmit` 0 · `npm run lint` 0 · `npm run build` clean (`/` static,
  `/home` dynamic).
- Playwright + Edge: 4 mascots + 4 bubbles on the landing page; login shows
  NO remembered card when the cookie is absent and the masked card when
  present (`ad••••@example.com`, `leaksFullEmail: false`); signup tab
  switches the CTA labels; `/home` redirects to `/login` when signed out;
  "Get started" → `/login?mode=signup` with the Create account tab
  active; hero CTA → same; header "Sign in" → `/login`; anchor links scroll
  to their sections. Zero console errors (only the favicon 404).
- Screenshots of the landing page in light + dark across lavender and a new
  theme (clay) — chrome and accent both correct.

**Problems solved:**
- `react-hooks/set-state-in-effect` lint error on the cookie read → switched
  to `useSyncExternalStore` (the correct primitive, and it removes the
  hydration mismatch that a `useEffect` read would have caused).
- `response.cookies.set()` rejects a raw header string → appended the
  serialized `Set-Cookie` header instead.
- Unescaped `"` in JSX → `&ldquo;` / `&rdquo;`.

**Open questions / carry-forwards:**
- The landing page and auth page were verified unauthenticated; the
  remembered-account WRITE path (OAuth callback → cookie → next login) could
  not be exercised end-to-end without a real Google/GitHub account.
- The app's Home URL changed from `/` to `/home` — any external links to
  `/` now land on the marketing page (intended), but bookmarks to the old
  Home will show the landing page.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; 4 dead
  settings; `saveMoodCheckin`; `@radix-ui/react-tooltip` unused; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.

---

### Phase 13 Session Close (Complete)

**Consolidating entry for the whole Phase 13 session.** The four entries
above record the detail; this one is the state a fresh session should start
from.

**What the app looks like now:**
- **Routes:** `/` = public marketing landing page (static) · `/home` = the app
  Home (was `/`) · `/habits` `/mood` `/stats` `/calendar` `/settings` =
  protected app pages · `/login` = sign-in / create-account.
- **Auth:** Google + GitHub OAuth only, no email/password form. Sign-in page
  has **Sign in** / **Create account** tabs (both OAuth) and shows the account
  this browser last used, masked, when a cookie exists.
- **Themes:** 10 total — the original Lavender Sky family (lavender, mint,
  peach, ocean, rose) plus the 5 reference themes (sage, clay, lagoon, berry,
  orchid) which use a near-neutral chrome with one saturated accent.
- **Motion:** one language app-wide, driven by `motion` + the shared presets
  in `lib/motion.ts` — content that replaces other content fades and slides
  in from the LEFT, exits to the RIGHT. Active nav items use a shared
  `layoutId` pill that slides between them.

**Decisions that future work depends on:**
- **`/` is marketing, `/home` is the app.** Any new app page goes under
  `app/(app)/`, any new public page under `app/(marketing)/`.
- **The CSS `page-enter` class is DELETED** (keyframes, rules, and the
  `prefers-reduced-motion` entry are all gone). Do NOT re-add it to a page
  root: it faded the blocks independently of `PageTransition`, so the two
  fought and the page read as blank for ~0.9s. `PageTransition` owns the
  page-level entrance; `Reveal` (in `components/landing/`) is the
  scroll-reveal primitive.
- **`layoutId` values must stay unique per indicator** — `sidebar-nav-pill`,
  `mobile-nav-pill`, `settings-nav-pill`, and the auth tab's
  `auth-tab-pill`. Two indicators sharing an id fight over the same layout
  slot.
- **The remembered account is ONE account, stored in a cookie**
  (`ht_last_account`), written by the OAuth callback. The SDK has no "list
  accounts" call and must not get one — a list of every account that ever
  signed in on the device would leak other people's addresses. The full
  email is never rendered; only `maskEmail()` output.
- **No fabricated social proof.** There are no real users, so the landing
  page sells with live product visuals instead of testimonials or counts.
- **Migrations are applied, not just written.** This session's bug was a
  migration file that existed but was never applied to the remote DB. Check
  `insforge db migrations list` before assuming the schema matches the code.

**Migrations applied this session:** `20261020101500_f13-habit-reminder-time`
(the pending one) and `20261020160000_f15-new-reference-color-themes` (widens
the `profiles.color_theme` CHECK constraint to the 5 new values).

**Current state — what works:**
- `npx tsc --noEmit` 0 · `npm run lint` 0 · `npm run build` clean (`/` static,
  `/home` + all app routes dynamic).
- Landing page, sign-in page (both tabs), the remembered-account card, the
  sliding pills, the page cross-fade, all 10 themes and both modes were
  verified in Edge via Playwright with screenshots.
- The app's real pages were NOT clicked through — the auth redirect blocks
  automated capture of the real pages, which is the long-standing QA gap.

**What comes next:** signed-in browser QA of the real pages and the
sign-in → OAuth → app round-trip (the only way to exercise the
remembered-account write path end to end).

**Open questions:**
- The remembered-account WRITE path (OAuth callback → cookie → next login)
  is unverified — it needs a real Google/GitHub account.
- Old bookmarks to `/` now show the landing page instead of the app Home.
- Unchanged carry-forwards: OAuth e2e QA; login `?redirect=`; 4 dead
  settings; `saveMoodCheckin`; `@radix-ui/react-tooltip` unused; Mood
  Daily/Weekly/Monthly pills chrome-only; touch heat tooltip.

---

### Phase 13.1 — Polish pass: smooth scroll, one shared heatmap, quick themes, Lumi in the app (Complete)

**Context:** Five asks from the developer, all against the marketing page and
the app: (1) the landing header's "Results" / "How it works" anchors jumped
instantly — make them a smooth glide; (2) add five theme swatches as small
squares "on top right of the This week floating card"; (3) the Stats page's
consistency heatmap did not look like the one shown on the home/landing page
— fix it to match exactly, "with no. of days tracked on top right of it";
(4) add the mascot to the app in different places/pages/variations; (5) remove
the sign-in and create-account options from the footer.

**What was built:**
- **Smooth scroll** — `app/globals.css` base block: `scroll-behavior: smooth;`
  + `scroll-padding-top: 5rem;` on `html`. The native smooth scroll eases in
  and decelerates to a stop; the global `prefers-reduced-motion` kill-switch
  already forces `scroll-behavior: auto !important`, so reduced-motion users
  still get an instant jump. **`scroll-padding-top` fixed a second bug**: the
  sticky landing header is ~64px tall and no anchor target had a scroll
  margin, so every jump hid the section's first line UNDER the header.
- **One heatmap, two surfaces** — NEW `components/ui/ContributionHeatmap.tsx`
  (`ContributionHeatmap` grid, `ContributionHeatmapPanel` = label row + grid +
  Less/More legend, `HeatmapLegend`, types `HeatLevel` / `ContributionCell` /
  `ContributionCellInfo`). Geometry: 7 weekday rows × one column per week
  (`grid-auto-flow: column` + explicit `gridTemplateRows: repeat(7, …)`),
  cells `aspect-square rounded-[2px]`, gap `3px`, colour via inline
  `var(--color-heat-0…4)`, `motion` `whileInView` entrance with a diagonal
  wave, `whileHover` scale 1.25. `components/landing/LandingHeatmap.tsx` was
  refactored onto it and `LandingResults.tsx` lost its hand-rolled label row
  and legend.
- **Stats card restructured** — `components/stats/HabitConsistencyCard.tsx`:
  tabs are now **Consistency** (default) and **By Habit**. The Consistency tab
  renders the shared panel filled with the user's own history:
  "Last 16 weeks" left, the **real** "N days tracked" right (days in the
  window with ≥1 check-in), the Less→More legend, plus the three metrics that
  used to live in the annual tab (check-ins / active days / avg daily rate).
  The 52-week "Annual Activity" tab was **folded in**; the per-habit monthly
  matrix survives unchanged as "By Habit". Hover tooltip + click inspector
  work on the new grid. `lib/stats.ts`: `buildContributionCalendar` and the
  `Contribution*` types were **replaced** by `buildConsistencyWindow(completions,
  habits, todayKey, weekStartsOn, weeks = 16)` + `ConsistencyDay` /
  `ConsistencyWindow`, with one shared `consistencyLevel()` helper (the ≤3
  habits case still jumps to a mid level). `StatsView.tsx` lost the now-unused
  `monthLabel` / `initialMonthLabel` / `days` props.
- **Quick theme swatches** — NEW `components/ui/ThemeSwatches.tsx`: five
  `h-4 w-4 rounded-[4px]` squares (`bg-swatch-*`) for **Sage, Clay, Lagoon,
  Berry, Orchid**; click → `useTheme().setColorTheme` (persisted to the
  profile); the active one gets `ring-2 ring-primary/70`.
- **Lumi in the app** — `LumiMascot` added to five app surfaces, one mood
  each: Stats `streak` (streak-count aware, badge shows the streak), Mood
  `supportive`, Calendar `idle`, Habits `celebrate`, Settings → About
  `sleepy`. All use `showDialogue={false}` so the bubble stays closed until
  tapped, and all sit in the **page header's right-hand group** next to the
  script quote (the bubble is up to 320px wide and does not fit a 300px
  sidebar column).
- **Footer** — `LandingFooter.tsx`: the `<nav>` with "Sign in" / "Create an
  account" deleted (the logo link stays).

**Decisions made:**
- **CSS-native smooth scroll, not a JS scroller** — the browser's own curve
  already accelerates and decelerates; no animation loop, and reduced motion
  was already wired.
- **The Stats heatmap was a DRIFT bug, so the fix removed the possibility of
  drift** — one shared component, not a copy of the landing's pixels.
- **Two tabs, not three** — the developer's complaint was that the Stats
  heatmap did not match; keeping a second heatmap style beside it would have
  kept the confusion. The annual view's metrics were preserved, its grid was
  not.
- **"N days tracked" is real** on both surfaces. The landing's mock label was
  made honest too (derived from its own sample — the old hardcoded "143" was
  larger than the 112-day window it described).
- **Swatches float ABOVE the card, right-aligned (developer correction)** —
  the first pass put them inside the card header; the developer asked for
  them above the card on the right. The rule is now in the ui-registry.
  Applied to the app Home "This Week" card and the landing hero visual.
- **Five themes, not ten** — the reference-derived set; all ten stay in
  Settings → Appearance.

**Problems solved:**
- **Self-inflicted:** a PowerShell `Get-Content -Raw` → `Set-Content` round
  trip on `HabitConsistencyCard.tsx` corrupted its em dashes (mojibake) and
  silently did NOT apply the intended variable rename — the same failure mode
  recorded in Phase 11. Recovered by rewriting the whole file with the `write`
  tool. **Lesson repeated: never round-trip source files through PowerShell;
  use the `edit` / `write` tools.**
- The mascot's speech bubble is in normal flow (it sits beside the mascot, not
  overlaid), so it must live where there is horizontal room — that is why the
  app placements are in page headers and not in the narrow sidebars.
- The landing's mock heatmap was row-major (16 days per row) while a real
  contribution grid is column-major (7 days per week column). The shared
  component uses the GitHub orientation; the mock data was reshaped to match,
  so the two surfaces are now the same grid, not just the same picture.

**Verification:**
- `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/0 warnings ·
  `npm run build` clean (`/` static, `/home` + all app routes dynamic; the
  temporary QA routes are deleted).
- **Playwright + Edge** (scripts kept in the temp QA dir, not in the repo):
  `scrollBehavior: "smooth"`, `scrollPadding: "80px"`; the anchor scroll
  sampled **13 distinct positions** (0 → 2 → 35 → 181 → 448 → 591 → … → 801,
  accelerating then settling) instead of one jump; `#results` lands 80px from
  the viewport top, clear of the 64px sticky header; the footer's only link
  is the logo ("Habit Tracker"); 5 swatches on the landing and on the app Home
  card; clicking one flips `data-color-theme` lavender → clay; the new Stats
  card renders 16 × 7 with "107 days tracked", the metrics row and today's
  ring in light, dark and clay; the mascot bubble opens with the "12d" streak
  badge and a confetti burst; no horizontal overflow at 390px; zero console
  errors (only the pre-existing favicon 404).
- Temporary `/preview-consistency` and `/preview-chrome` routes were used for
  the visual check and **deleted** afterwards (both the auth redirect and the
  missing signed-in session block capture of the real pages).
- **Context docs synced:** `context/ui-registry.md` (new "Phase 13.1" section:
  smooth scroll, the shared heatmap primitive, the swatch placement rule, the
  mascot table), `context/progress-tracker.md` (Phase 13.1 checkbox block +
  decisions + status), `context/build-plan.md` (Phase 13 + 13.1 sections and
  the design attach map rows), `context/ui-rules.md` (new sections: the
  contribution grid, theme swatches, the mascot, in-page scrolling).

**Current state:** Build + lint + tsc clean. The landing page scrolls smoothly,
shows the shared heatmap and the floating theme swatches, and has a trimmed
footer. The Stats card shows the landing-style consistency grid with a real
tracked-days count. Five app pages carry Lumi.

**Open questions:**
- The app pages themselves (Home, Habits, Mood, Stats, Calendar, Settings)
  still need a **signed-in click-through** — the mascot placements, the Home
  swatch row and the new Stats tab were verified on preview routes, not in
  situ.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`; 4 dead
  settings (`show_completed_habits`, `compact_habit_view`,
  `default_reminder_time`, `default_frequency`); `saveMoodCheckin` (dead);
  `@radix-ui/react-tooltip` unused; Mood Daily/Weekly/Monthly pills
  chrome-only; touch heat tooltip.

---

### Phase 13.2 — Tooltip portal, heatmap-only card, settings honesty, theme clarity (Complete)

**Context:** The developer sent a screenshot of the Stats heatmap with three
complaints and three more asks: the hover tooltip "shows somewhere else and
far away and some of them shows under the other floating cards"; remove the
"GitHub Style" tag; remove "By Habit" completely; remove the theme swatches
from the homepage; "in settings go through the notifications figure whether
those settings actually work or else remove them, and do this for all the
settings"; "improve the existing themes to be even more clear and clean in
both light and dark mode, especially on the menu side cause in some themes
it turn dark shade".

**What was built:**
- **Tooltip portal** — `components/stats/HabitConsistencyCard.tsx` now renders
  the tooltip through `createPortal(…, document.body)` with `z-[70]` and
  `w-max`. **Root cause:** the card is a glass surface (`backdrop-blur-md`),
  and a filtered ancestor is the *containing block* for `position: fixed`
  descendants — so the tooltip's viewport coordinates were interpreted
  relative to the CARD. That is why it appeared hundreds of pixels away and
  under neighbouring cards (the card's own stacking context also trapped it
  below them). `Modal` (Radix Dialog) and `PopoverPanel` (Radix Popover)
  already portal; this was the only raw `fixed` overlay left.
- **"GitHub Style" badge removed** from the card header.
- **"By Habit" tab removed** — the Stats card is ONE view now: title,
  three metrics (check-ins / active days / avg daily rate) and the shared
  contribution panel. The per-habit monthly matrix, `buildStatsHeatRows`,
  `StatsHeatRow` and `HeatCell` were **deleted** (dead code), and
  `StatsView.tsx` lost its `heatRows` plumbing.
- **Theme swatches removed from the marketing page** (`LandingHero.tsx`);
  they stay above the app Home "This Week" card.
- **Settings audit — 10 inert controls removed** (a script-free manual
  audit: persisted? read by a surface? changes visible behaviour?):
  the five notification switches (`notify_habit`, `notify_daily_summary`,
  `notify_mood`, `notify_streak`, `notify_missed` — no notification system
  exists anywhere: no service worker, no scheduler, no `showNotification`),
  the mood reminder time, the default reminder time, the default frequency,
  show completed habits, compact habit view, the bio field (saved, never
  displayed) and the hard-disabled "Custom" colour swatch.
  - `NotificationsPanel.tsx` → **`MoodPanel.tsx`** (bell icon → `Smile`
    icon; holds the two working mood controls + the read-only scale
    preview). `SettingsHeaderActions.tsx` rewired.
  - `HabitPreferencesCard.tsx` keeps **"Week starts on"** only — the one
    preference read by Home, Habits, Stats and Calendar.
  - `ProfilePanel.tsx` keeps the **name** only.
  - `AppearanceCard.tsx`: the "Custom" swatch deleted.
  - `actions/settings.ts`: `saveNotificationPrefs` **deleted**;
    `saveHabitPreferences` now saves the week start only; `saveProfile`
    saves the name only; `saveMoodSettings` lost the reminder time;
    `COLOR_THEMES` lost "custom".
  - `lib/settings-data.ts`: `SettingsProfile` pruned to the four fields the
    UI actually reads; the loader stopped selecting the other ten columns.
  - `lib/habits-data.ts`: the orphaned `prefs` object (loaded, returned,
    never consumed) deleted, with its `profiles` query.
  - `lib/utils.ts`: `TIME_OPTIONS` + `formatTime12` deleted (no consumers).
  - `types/index.ts`, `ThemeProvider`, `lib/data-export.ts`: "custom"
    removed from the theme type / allow-list / export schema.
  - **The DB columns and the export envelope keep every field** — a backup
    written by an older build must still import.
- **Theme clarity pass** (`app/globals.css`):
  - New **`--color-sidebar`** token — the menu column no longer shares
    `--color-surface` with every card, popover and modal. `Sidebar.tsx`
    uses `bg-sidebar`; `MobileNav` / `MobileHeader` use `bg-sidebar/95`.
  - **The surface is now always LIGHTER than the page background in light
    mode.** The five reference themes (sage, clay, lagoon, berry, orchid)
    defined a tinted grey surface on a tinted page — that is what made the
    menu "turn a dark shade". They now use a near-white surface
    (e.g. clay surface `#ebe1dd` → `#faf7f3`).
  - Hairlines: `--color-border` re-tuned in all ten light themes and in the
    five dark reference themes; every border/sidebar pair is now ≥ 1.33:1
    (was 1.16–1.17 in the reference themes, i.e. an invisible divider).
  - `--color-text-muted` re-tuned in the five reference light themes; it
    failed AA (4.03–4.10:1) on the sidebar surface there.
  - **Lavender got its missing dark block.** It was the only theme without
    one, so the mode-agnostic `[data-color-theme="lavender"]` rule (same
    specificity, later in the file) leaked the LIGHT `--color-primary-text`
    (#6d28d9) into dark mode — 2.21:1 on the sidebar surface, which made
    the logo glyph and the script quote effectively invisible.
  - Shadows are neutral ink instead of lavender ink (a clay card used to
    cast a violet shadow).
  - Both navs now use the same active tokens (`text-primary-text` +
    `bg-primary-lightest`); the desktop nav used `text-accent-foreground` +
    `bg-accent-light`.
- **`saveMoodCheckin` deleted** (`actions/moods.ts`, ~100 dead lines) — a
  carry-forward from Phase 10; no importers since the Home mood section was
  removed in the UI overhaul.

**Decisions made:**
- **The tooltip bug was a CSS containing-block bug, not a math bug** — the
  fix is a portal, not better clamping. The rule is now in ui-rules.md:
  any `position: fixed` overlay inside a card must portal.
- **"By Habit" was deleted, not hidden** — the developer asked for the
  heatmap only; keeping the matrix around as dead code would be worse than
  removing it.
- **Inert settings were removed rather than implemented.** A notification
  system is a feature, not a fix, and the developer's instruction was
  explicit: if it does not work, remove it. The bell icon became a smile.
- **The menu got its own token** instead of re-tuning `--color-surface`,
  because `--color-surface` was doing two jobs (cards AND the menu rail) —
  fixing the menu that way would have de-tinted every card in the theme.
- **Surfaces are always lighter than the page in light mode** — that is
  the rule behind "the menu turns a dark shade".

**Problems solved:**
- The tooltip's "far away" symptom had a non-obvious cause (a blurred
  ancestor becoming the containing block for fixed positioning). Worth
  remembering: in a glassmorphic UI, `position: fixed` inside a card is a
  trap.
- Every theme needed BOTH halves: only Lavender was missing a dark block,
  and that one omission silently broke four surfaces at once.

**Verification:**
- `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/0 warnings ·
  `npm run build` clean (`/` static, `/home` + all app routes dynamic).
- **A contrast script that parses `globals.css` and evaluates the real
  cascade** for all 10 themes × 2 modes: text / text-secondary / text-muted
  / primary-text ≥ 4.5:1 on sidebar, surface and page; the sidebar is never
  darker than the page in light mode; every hairline ≥ 1.33:1.
  **All 20 combinations pass** (before the pass: 5 light themes had a dark
  sidebar, 5 more had an invisible hairline, 5 had sub-AA muted text, and
  dark lavender failed at 2.21:1).
- **Playwright + Edge**: the tooltip is now a child of `BODY` with
  `z-index: 70`, 182px wide (the date no longer wraps into four lines), and
  it renders directly above the hovered cell; 20 screenshots (10 themes ×
  light/dark) confirm the menu rail, the hairline and the text in every
  combination; the landing page has 0 theme swatches; zero console errors
  (only the pre-existing favicon 404).
- Integrity sweep: no BOM, no mojibake, no leftover references to
  `NotificationsPanel`, `saveNotificationPrefs`, `buildStatsHeatRows`,
  `StatsHeatRow`, `TIME_OPTIONS`, `formatTime12`, `HabitsViewPrefs` or
  `"custom"`.
- Temporary `/preview-themes` route used for the visual check and
  **deleted** afterwards.

**Current state:** Build + lint + tsc clean. The heatmap card is one clean
view with a correctly-placed tooltip; Settings contains only controls that
work; all ten themes read clearly in both modes with a menu that no longer
turns dark.

**Open questions:**
- The app pages still need a **signed-in click-through** — the Settings
  panels (Mood / Profile), the Home swatch row and the mascot placements
  were verified by types, lint and preview routes, not in situ.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`;
  `@radix-ui/react-tooltip` unused; Mood Daily/Weekly/Monthly pills
  chrome-only; touch heat tooltip.

---

### Phase 13.3 — The theme reaches every surface + swatch placement corrected (Complete)

**Context:** Two corrections. (a) The developer's instruction about the theme
swatches had been read the wrong way round the first time: they wanted them
**kept on the marketing page** and **removed from the signed-in app home**
(I had done the opposite). (b) A screenshot of the app in lagoon DARK showed
the real complaint: "when lagoon theme selected only the background changes
… the floating cards still stay dark. I want the entire app to change the
theme, not just background, same with all other themes. the side menu should
also adapt to theme."

**What was built:**
- **Swatch placement corrected** — `components/landing/LandingHero.tsx` renders
  `<ThemeSwatches />` above the habit-grid card again;
  `app/(app)/home/page.tsx` no longer renders it (the `ThemeSwatches` import
  was removed with it). `ThemeSwatches` now appears in exactly one place in
  the repo.
- **The five reference themes' dark surfaces were neutral greys** — that was
  the whole bug. Sage, clay, lagoon, berry and orchid defined their DARK
  `--color-surface` / `-alt` / `-muted` / `-hover` / `--color-border` /
  text-secondary / text-muted in greys (`#222727`, `#292e2e`, `#191d1d`,
  `#2f3333`, `#3e4343` …). So picking lagoon repainted the page background
  navy and left every card, the rail and the borders as generic dark grey.
  Each theme was rewritten around its own accent:
  - **lagoon** → teal-navy: surface `#14272f`, alt `#1a3038`, muted
    `#16292f`, hover `#1d343d`, border `#22404a`, sidebar `#0a1720`,
    text-secondary `#a8c8c6`, text-muted `#8ba3a3`
  - **clay** → warm brown: surface `#26201d`, border `#3d3632`,
    sidebar `#1a1412`, text-secondary `#c5b7b1`
  - **sage** → green: surface `#1e231d`, border `#333b31`,
    sidebar `#141814`, text-secondary `#bcc3b8`
  - **berry** → plum: surface `#262021`, border `#3f3436`,
    sidebar `#1b1517`, text-secondary `#c6b8ba`
  - **orchid** → violet: surface `#1f1e2d`, border `#383649`,
    sidebar `#12111c`, text-secondary `#c0bcd0`
- **One dark hierarchy in all ten themes:** `rail (deepest) → page → cards
  (lightest)`. The five classic themes' rails got their own deeper tone
  (lavender `#12111d`, mint `#0a1714`, peach `#1b1311`, ocean `#09131b`,
  rose `#170e11`) so the menu recedes and the cards pop — the same shape the
  reference themes now have.
- **Light surfaces of the five reference themes carry more hue** (lagoon
  `#ecf7f5`, clay `#f9f4ee`, sage `#f0f5ec`, berry `#fbf1f3`, orchid
  `#f4f1fb`) while still staying lighter than the page.

**Decisions made:**
- **A theme's surfaces are tinted with its own hue, in both modes.** A themed
  background with grey cards is not a theme — that is now the rule in
  ui-rules.md and ui-registry.md.
- **The rail is the deepest surface in dark mode**, not the same value as
  the cards: it gives the menu its own identity and makes the content
  cards float above it.

**Problems solved:**
- The Phase 13.2 pass fixed the *light* side of the reference themes (a
  dark slab menu) but never looked at their DARK blocks, which were neutral
  greys from the start. The audit had flagged "surface darker than page in
  light mode" but not "surface is not tinted at all in dark mode" — a
  different failure of the same rule.

**Verification:**
- `npx tsc --noEmit` 0 errors · `npm run lint` 0 · `npm run build` clean.
- The contrast script (parses `globals.css`, evaluates the real cascade for
  all 10 themes × 2 modes) reports **ALL 20 combinations pass**: text /
  text-secondary / text-muted / primary-text ≥ 4.5:1 on rail, surface and
  page; the rail never darker than the page in light mode; every hairline
  ≥ 1.33:1.
- Playwright + Edge screenshots of all 20 combinations: lagoon dark is now
  teal-navy throughout (cards, rail, heatmap, accents), clay dark is warm
  brown throughout, sage dark is green throughout. The landing page renders
  5 theme swatches; the app home renders none. Zero console errors (only
  the pre-existing favicon 404).
- Temporary `/preview-themes` route deleted afterwards; integrity sweep
  clean (no BOM, no mojibake, no leftovers).

**Current state:** Build + lint + tsc clean. Every theme now repaints the
whole app — page, cards, menu rail, borders and text all carry the theme's
hue — and the theme swatches live only on the marketing page.

**Open questions:**
- The app pages still need a **signed-in click-through** — the Settings
  panels, the mascot placements and the themed Home page were verified by
  types, lint and preview routes, not in situ.
- Unchanged carry-forwards: OAuth end-to-end QA; login `?redirect=`;
  `@radix-ui/react-tooltip` unused; Mood Daily/Weekly/Monthly pills
  chrome-only; touch heat tooltip.
