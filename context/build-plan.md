# Build Plan

> **Design-driven.** The app is built to match `public/designs/*.png` exactly — layout, palette, logo, mood faces, decorations, copy. When text notes and a design disagree, **the design wins**. When two designs disagree (old vs new variant), the newer/canonical file listed below wins.

## Core Principle

Full page UI first, verified visually against the design (light **and** dark), then wire logic. Every feature visible and testable before the next. No invisible backend-only phases.

Session workflow per feature: `/architect` (if non-trivial) → build UI → visual check → wire logic → `/imprint` → `/review` → update progress-tracker.md → `/remember save`.

## Design attach map (use @ in chat)

| Feature area | Canonical design | Notes |
|--------------|------------------|-------|
| System / palette / logo / kit | `@public/designs/trakcer UI.png` | Lavender Sky palette, logo tile, buttons, accent variations |
| 01–08 Home | `@public/designs/HomePage.png` | Complete |
| 09–12 Habits | **Old tracker grid** (`D:\habit-tracker\index.html`), not HabitsPage.png | Redirected in Feature 09 — month grid, Notes row |
| 13–16 Mood | `@public/designs/MoodPage.png` | `mood graph.png` = older variant; flavor only (tooltip copy) |
| 17–21 Stats | `@public/designs/StatsPage.png` | |
| 22–24 Calendar | `@public/designs/CalenderPage.png` | Filename keeps "Calender" typo |
| 25–30 Settings & Data | `@public/designs/SettingsPage.png` | |

| 13 Marketing site (`/`) | **No design file** - built from the developer's reference mock + modern landing conventions | Landing page owns its own language; the heatmap it shows is the SAME component the Stats page renders |
| 13.1 Polish pass | Developer's reference screenshots (theme swatches, heatmap) | Swatches, shared heatmap, Lumi placements |

Filenames keep original spelling (`CalenderPage`, `trakcer UI`). Path is always `public/designs/`.

---

## Design System (from `trakcer UI.png` + page designs)

Full token tables live in `context/ui-tokens.md` (already synced to globals.css). The essentials every feature must honor:

### Palette — "Lavender Sky" (soft, modern, elegant)

| Role | Light | Dark |
|------|-------|------|
| Background | `#F9F7FD` | `#181726` |
| Surface | `#FFFFFF` | `#232038` |
| Surface alt | `#EEEFF7` | `#2D2947` |
| Primary | `#A78BFA` (wash `#DDCFFF`, deep `#7C3AED`) | `#A78BFA` / `#7C3AED` |
| Secondary | `#C4B5FD` | `#C4B5FD` |
| Accent wash | `#F0E7FF` | `#3B2D5C` |
| Success / done | `#86D6BF` | `#34D399` |
| Warning / partial | `#FCD34D` | `#FBBF24` |
| Error / missed | `#FC5A5A` | `#F87171` |
| Muted text | `#94A3B8` | `#94A3B8` |

Accent theme variations (Settings swatches): **Lavender (default)**, Mint, Peach, Ocean, Rose, Sage, Clay, Lagoon, Berry, Orchid, Custom (locked until Phase 7 custom editor).

**Color themes retheme the WHOLE app** (Post-F25 UX pass): `public/UI palette/{Lavender Sky,mint breeze,peach blossom,Ocean mist}.png` define each theme's full chrome (background/surface/surface-alt/border/text + dark variants) — globals.css `[data-theme][data-color-theme]` blocks implement them; Rose has no sheet (neutrals derived). Status colors stay shared across themes. See ui-registry "Full theme chrome" for exact hexes.

**New reference themes (added alongside, originals untouched):** Sage, Clay, Lagoon, Berry, Orchid — accents sampled from the reference mock's own theme-switcher chips. They retheme the full chrome too, but with a near-neutral page tinted only a whisper toward the accent, matching the reference. Migration `20261020150000_f14-new-reference-color-themes.sql` widens the `profiles.color_theme` CHECK constraint.

**Habit icons are custom SVG** (Post-F25.2): shared `HabitIcon` component (`components/ui/HabitIcon.tsx`) draws a tinted circle + hand-drawn glyph from habit emoji/name — system emoji only as fallback for unknowns. Sidebar logo = `BrandLeaf` SVG sprig. Never render raw `{habit.emoji}` in new UI.

### Logo & branding

- **Logo tile:** rounded square (`rounded-xl`), `bg-primary-lightest`, purple **leaf/sprout** glyph — not emoji-placeholder quality: a proper leaf (custom SVG or polished glyph) in `primary`, matching trakcer UI.png
- **Wordmark:** "Strekly" (`font-bold text-text`) + tagline "Your streak / Everyday" (`text-[11px] text-text-muted`, two lines)
- **Sidebar footer:** lavender botanical illustration (decorative, non-interactive) + rotating **script quotes** in Caveat (`font-script text-primary/85`): "A calmer you / A brighter tomorrow", "Small Steps / Brighter Days", "Good Days / Build Great Days", "Same Calmer You / Brighter Days"
- **Page headers:** page title (`text-3xl font-bold`) + subtitle + right-aligned **script accent** ("A calmer mind / A brighter tomorrow 💜" etc.) in Caveat
- **Decorative lavender cards:** scenic lavender-field illustration + script quote (Home inspiration card, Stats/Settings footer cards). v1 approximation: gradient wash + script text + botanical glyph; exact illustration assets optional enhancement
- **Shell:** fixed sidebar (240px) + main content. **No topbar** — theme Dark Mode switch + profile avatar live in sidebar footer (old-tracker layout, Feature 09 rebuild)

### Mood emoji faces (custom — exact per designs)

Mood levels are **solid pastel circular faces** with darker features — not raw system-emoji text. Implementation: shared `MoodFace` component draws procedural SVG eyes/mouth keyed by value + glossy gradient (F13).

**6-level scale since F26** (developer list, high = happier; supersedes the designs' original 5-face set):

| Level | Value | Face (SVG) | Color |
|-------|-------|------------|-------|
| Very Happy | 6 | closed happy eyes + open smile | green `#86D6BF` |
| Happy | 5 | dot eyes + gentle smile | yellow `#FCD34D` |
| Okay | 4 | dot eyes + line | blue `#7DD3FC` |
| Tired | 3 | half-lidded eyes + yawn oval | warm gray `#A8A29E` |
| Sad | 2 | dot eyes + frown | pink `#FC8FA5` |
| Fu*ked Up | 1 | mind blown (orange/yellow fire cloud over top of head + dot eyes + O mouth) | purple `#A78BFA` |

- Seeded into DB `mood_levels` (emoji + color + label + value) on first login; F26 migration reseeded all existing users + remapped entries (≥3 → +1)
- Users may later edit scale/labels (Feature 28); faces render from DB values, not hardcoded
- Same faces reused on: Home mood card, Mood page strip/graph/distribution/insights, Calendar day cells, tooltips

### UI kit (from trakcer UI.png)

- Primary button: `bg-primary text-primary-foreground rounded-full` (pill in kit; page CTAs may use `rounded-sm/md` per ui-registry baseline — match page design)
- Icon buttons (calendar, prev/next): circular, `border-border bg-surface` (light) / dark surface
- Status colors always from tokens; heatmap uses `heat-0…4` lavender ramp
- Typography: Inter (UI) + Caveat (script accents) via next/font

---

## Phase 1 — Foundation ✅

- [x] 01 App Shell + Design Tokens (sidebar, tokens, primitives; Topbar later removed)
- [x] 02 Auth (Google + GitHub OAuth, schema seeded: profiles, habits, completions, mood_levels, notes, categories)
- [x] 03 Database Schema (pulled into 02)
- [x] 04 Theme System + Settings Appearance card

**Deferred polish (bundle into nearest later feature or a Phase 8 polish pass):** replace 🌿 logo with proper leaf mark; add sidebar botanical illustration; scenic decorative cards.

## Phase 2 — Home ✅

- [x] 05 Home Full UI vs HomePage.png
- [x] 06 Check-in cycle (done → partial → missed → unset)
- [x] 07 Streaks + progress
- [x] 08 Mood save + week strip (single Save = mood + note via `saveMoodCheckin`)

Matches HomePage.png: greeting + name, date nav + calendar btn, script quote, 4 stat cards (Progress ring, Day Streak, Longest Streak, Today's Mood), Today's Habits card (emoji tile, 7 circles, kebab, Add Habit row), This Week rings + See All, inspiration scenic card, Quick Stats 2×2 + This Month dropdown, Today's Mood (5 face bubbles + note + Save), quote card.

## Phase 3 — Habits ✅ (redirect: old tracker grid)

- [x] 09 Month grid (habits × days, Notes row, legend; Topbar removed globally)
- [x] 10 Habit CRUD (form modal: name/emoji/description/category; archive/restore; delete confirm)
- [x] 11 Categories CRUD (Settings card, preset swatches)
- [x] 12 Wired cells/notes + drag reorder; one-time demo seed (Sept 2026) with dedupe healing

HabitsPage.png is **retired** — do not build against it.

## Phase 4 — Mood (build to MoodPage.png)

### 13 Mood Page — Full UI

**UI (main column):**
- Header: "Mood Tracker" + "Track your emotions. Notice patterns. Be kinder to yourself." + script accent "A calmer mind / A brighter tomorrow 💜"
- Month card: month nav (‹ July 2026 ›), Daily/Weekly/Monthly pills (Daily active = primary pill); date strip (day label + number + **mood face circle** per day; selected day = outlined column); legend chips row (5 levels: face + label)
- Mood Graph card: title + "Your emotional journey this month." + "This Month" dropdown; Recharts area chart — y-axis = 5 mood faces, x-axis = day numbers, points colored per level, connecting line, soft gradient fill; tooltip: date + face/label + note snippet
- Bottom row: "Notes for {Selected Date}" card (face + "How did you feel today?" + note textarea) and "Recent Notes" card (View All →, 3 rows: date + face + snippet)

**UI (right column, 300px):**
- Mood Distribution card: donut (Recharts) with "N days" center + legend rows (face dot, label, count)
- Mood Insights card: per-level rows (face, "N days / Felt {label}") + pattern callout ("You felt happier on weekends this month!")
- Decorative script card ("Progress looks different every day and that's okay.")

**Logic:** mock data only (`lib/mock-mood.ts`) seeded to match the design exactly (July 2026: 8/10/7/4/2 counts, sample notes) so visual QA is 1:1. Tabs are real toggle state; only Daily content exists. Verify faces match the custom-face spec above.

### 14 Mood Logging + Notes

- Click any day in the strip → select; click face/level chip (or strip day) sets mood for that date (upsert, one per day)
- Note textarea writes `daily_notes` (respect `enable_mood_notes`; reuse/extend `saveMoodCheckin`)
- Recent Notes derived from `daily_notes`; View All → full list (inline expand or modal)
- Month nav loads real `mood_entries` for visible month

### 15 Graph + Distribution Wiring ✅

- Series from `mood_entries` + `mood_levels` for selected month; gaps for missing days (intentional)
- Tooltip: date, face+label, note snippet (mood graph.png flavor)
- Donut counts per level for the month; "N days" = days with any mood logged
- **Shipped:** period dropdown wired (This Month / Last 3 Months / This Year) — graph-only scope; ranges anchor to selected month (90d = selected + 2 prior; year = Jan 1 → end of selected month); dynamic subtitle; date ticks on month starts for ranges; Y-domain from levels

### 16 Mood Insights ✅

- Per-level day counts (pure fns in `lib/insights.ts`)
- Optional trivial pattern line (e.g. happier weekends) — no AI
- Respects `mood_scale` (5 vs 7) from profile when rendering levels
- **Shipped:** `buildMoodInsightRows` (label-derived phrases) + `computeMoodPattern` (weekend/weekday → half-month trend → honest fallback; averages = scale-agnostic); MoodSidebar rows-driven; fake pattern removed

## Phase 5 — Stats (build to StatsPage.png)

### 17 Stats Page — Full UI ✅

- Header: "Stats" + "A closer look at your journey. Consistency creates change." + script accent
- 4 KPI cards: Overall Completion % (+ ↑ vs last month), Current Streak (+ ↑ vs last), Longest Streak, Active Habits (n/n) — icon bubbles (target/flame/crown/chart)
- Completion Overview card: Daily/Weekly/Monthly/Yearly pills + bar chart (Recharts, lavender bars, tooltip "Jul 8 / 86% / 6/7 habits")
- Habit Completion Rate card: per habit — emoji, name, colored bar (per-habit tint), % right
- Habit Consistency card: legend Missed/Partial/Completed + rows = habits, columns = days; lavender heat ramp (`heat-0…4`), GitHub-style custom grid (no extra packages)
- Streak History card: area/line chart of streak length over month + "N days" chip
- Key Insights card: This Month dropdown + insight rows (icon + title + caption)
- Decorative scenic/script card

**Logic:** mock first vs StatsPage.png.
**Shipped:** full UI on `lib/mock-stats.ts`; heatmap built as **custom CSS grid — no library** (developer-confirmed over `uiw/react-heat-map`/shadcn; layout is habits×days, dep rules); pills + insights dropdown = toggle state only; review minors fixed; visual QA vs design pending with F13–16 QA.

### 18 Completion Aggregations ✅

Daily/weekly/monthly/yearly rollups in `lib/stats.ts`; period pills update all cards/charts.
**Shipped (scope aligned in /architect):** rollups in pure `lib/stats.ts` (`buildCompletionSeries`, `buildStatsKpis`, `streakSeriesForMonth`, `buildStatsHeatRows`); `lib/stats-data.ts` server loader; **all six surfaces real** — mock-stats unused; pills **card-local** to Completion Overview (design-literal), Insights dropdown chrome until F21; ranges anchored to real today (Daily = month-to-date, Weekly = last 12 Monday weeks, Monthly ×12, Yearly cap 5); review fixes: Home Quick Stats → month-to-date range, active-habit completion filter (Home + Stats), cross-month streak series. Delete `lib/mock-stats.ts` at F21 if still unreferenced.

### 19 Habit Completion Rates ✅

Per-habit done(+partial weight) over active days in period; bar color = category color if set, else per-habit tint ramp.
**Shipped:** `weightedHabitRate` in `lib/stats.ts` (done=1/partial=0.5 over active days = period ∩ since `created_at`; removed old `habitRate`); bar fill = `categoryColors[categoryId]` → `HABIT_TINTS[i % n]`; loader fetches `category_id` + `created_at` + `habit_categories` colors; period = month-to-date (pills card-local); review 0 issues.

### 20 Consistency Heatmap ✅

Custom CSS grid per architecture spec; lavender heat tokens only; hover tooltips; month labels; works in dark + color themes.
**Shipped (grid itself landed in F17/F18):** GitHub-style **fixed-position hover tooltip** (state-driven, edge clamp, below-flip, scroll-clear; `--color-tooltip` tokens — dark bubble both modes; native `title` removed; `role="img"` + `aria-label` per cell); **Mint theme heat ramp = GitHub exact hexes** light (`#ebedf0…#216e39`) and dark (new `[data-theme="dark"][data-color-theme="mint"]` block, `#161b22…#39d353`); axis month labels verified dynamic; role vars auto-recolor cells + legend. Carry-forward: 5 themes × light/dark browser QA.
### 21 Streak History + Key Insights ✅

Streak length over time from completions; `computeKeyInsights` in `lib/insights.ts`; default period = this month.
**Shipped:** insights dropdown wired — `insightRangeFor` (This Month = 1st→today; Last 3 Months = 1st of month−2→today; This Year = Jan 1→today; all anchored to real today), client-side recompute, no server action; strongest-habit switched to `weightedHabitRate` (title now names the habit); loader fetches all `mood_entries` (date filter removed) so mood-logged counts are honest across periods; Streak History verified real (no change — shipped F18); `lib/mock-stats.ts` deleted; review 3 minors fixed same session (Dropdown made generic `Dropdown<T>` — casts removed from KeyInsightsCard + MoodGraphCard, mood row got its own Smile + warning tint icon, `days.length===0` returns keep-going fallback instead of blank list).

## Phase 6 — Calendar (build to CalenderPage.png)

### 22 Calendar Page — Full UI ✅

- Header: "Calendar" + "Look back, stay consistent. Every day counts." + script accent
- Month card: month nav + Today button; 7-col grid Sun–Sat; each cell: date number, **completion dots row** (green/yellow/pink/gray per legend), **mood face** (if `show_mood_on_calendar`); today = primary outline; leading/trailing adjacent-month dates muted
- Right column: Day Legend card (All/Most/Some/No habits completed dots + 5 mood faces), decorative script card, Monthly Overview card (ring % + "n of 31 days", 2×2 tiles: Great/Okay/Tough/No Data with colored dots, closing script line)
- Below: Day Details card — day nav (‹ July 12, 2026 ›), Edit Day button, Mood block (face + label), Note block, Habits checklist (checkbox + emoji + name, "5 / 7 completed")

**Logic:** mock first vs CalenderPage.png.
**Shipped:** interactive mock (F09 pattern) — `lib/mock-calendar.ts` keyed `YYYY-MM-DD` (July 2026 only; 7-char status strings per day, moods all 31 days, 3 sample notes; `MOCK_TODAY_KEY = 2026-07-12` = first paint matches design); pure grid helpers in `lib/calendar.ts` (`buildMonthCells`, `shiftMonth/Day`, labels); components in `components/calendar/` (CalendarView owns viewMonth + selectedKey; MonthCard cells = date + per-habit dots for logged statuses only + MoodFace; DayDetailsCard static checklist done=`bg-primary` / partial=`bg-primary/45` / else empty box, Edit Day + kebab chrome; DayLegendCard status dots + 5 faces; MonthlyOverviewCard SVG ring + hex tiles from mock data, nav shared with main month); decorative = `StatsDecorativeCard` with calendar quote. Cell click / day nav / month nav / Today = real local state; checkboxes + Edit Day inert until F23; overview numbers static until F24. Headless visual QA vs design = carry-forward with F17–21 backlog.
### 23 Day Navigation + Checklist ✅

Select day → Day Details updates; checklist toggles `habit_completions` (reuse `setHabitCompletion`); prev/next day; Edit Day focuses mood/note editing.
**Shipped (scope aligned in /architect):** real-only flip — `lib/calendar-data.ts` one-pass loader (active habits, all completions/moods/notes, mood_levels, `enable_mood_notes` + `show_mood_on_calendar` flags); `CalendarView` client-authoritative state seeded from props once (F15 no-snap) with optimistic `setHabitCompletion` (full cycle unset→done→partial→missed→unset; missed = error-tinted box + X) and optimistic note save/delete; Day Details note block = read saved note (Edit affordance) or write when empty (gated `enable_mood_notes`; Save/Cancel/Delete); **Edit Day = jump/focus note editor, mood display-only**; cells keep dots+faces (faces respect `show_mood_on_calendar`); initial view = real today; `lib/mock-calendar.ts` deleted, no seed; `DESIGN_OVERVIEW` moved to `lib/calendar.ts` (HABIT_TINTS precedent, F24 replaces); plus **cross-page `page-enter` animation** (globals.css keyframes, fade+rise 0.6s staggered, `prefers-reduced-motion` respected) applied to all six app pages per developer request.
### 24 Legend + Monthly Overview ✅

Classify days: great (all done), okay (most), tough (some), none/no data — confirm exact thresholds in `/architect` before wiring; overview ring = % of days with strong completion; respect `show_mood_on_calendar`.
**Shipped (thresholds aligned in /architect):** `classifyMonth` in `lib/calendar.ts` — weighted day ratio over all active habits (unlogged = 0-weight slot): **Great === 1.0, Okay ≥ 0.5, Tough > 0, No Data === 0**; **month-to-date denominator** (current month = days 1→today, past = full month, future = 0 days — no future-day punishment, F18 convention); **ring = (Great + Okay) of {elapsed} days** (design's 71% ≈ (12+9)/31 read); tiles live counts, recomputed on optimistic toggles; `DESIGN_OVERVIEW` deleted (tile hex constants local to `MonthlyOverviewCard`); Day Legend keeps definition labels + **mood faces now from DB `mood_levels`** (dropped `mock-home` import); `show_mood_on_calendar` already honored (F23).

## Phase 7 — Settings & Data (build to SettingsPage.png)

### 25 Settings Page — Full UI ✅

3-column card grid (already skeleton'd — flesh out per design):
- Appearance (done), Notifications (5 toggle rows: Habit Reminders, Daily Summary, Mood Reminder, Streak Alerts, Missed Habit Reminder — icon + label + caption + switch)
- Your Profile (Name + pencil, bio textarea "A little note about you (optional)" + counter n/100)
- Habit Preferences (Default Reminder Time select, Week Starts On select, Default Frequency select, Show Completed Habits toggle, Compact Habit View toggle)
- Mood Settings (Mood Scale select 5/7, Enable Mood Notes toggle, Mood Reminder time, Show Mood on Calendar toggle)
- Data Management (Export/Import/Backup rows + buttons; Reset All Data danger row)
- Danger Zone (Clear All Completed Habits / Delete All Habits / Reset Everything — per-row action buttons)
- About (version 1.0.0, leaf mark, "Made with 💜", Keyboard Shortcuts / Feedback / Privacy / Terms rows)
- Habit Categories card (done, Feature 11)
- Decorative scenic/script card

**Shipped (scope aligned in /architect):** hydrated + chrome — `loadSettingsData` fetches categories + full profile row (schema defaults as fallback); 7 new card components (`NotificationsCard`, `HabitPreferencesCard`, `MoodSettingsCard`, `ProfileCard`, `DataManagementCard`, `DangerZoneCard`, `AboutCard`) with **local-state-only** controls seeded from profile (persist = F26–30); `SettingsRow` shared row primitive (icon bubble + title/caption + right control) + `settingsSelectClass`; `SettingsCard` gained `iconClassName` tone override (Data = success, Danger = error); layout reordered to design-literal 3 columns (col1 Appearance/Categories/HabitPrefs/Data, col2 Notifications/Mood/About, col3 Profile/Danger/decorative); `formatTime12` + `TIME_OPTIONS` (30-min steps) in `lib/utils.ts`; About link rows = chevron chrome; Danger Zone has an "enabled in a later phase" note; design typo "Krisha" ignored (real name from profile). **Schema gap flagged for F26:** no `default_frequency` column yet (F25 chrome doesn't need it).

### 26 Appearance + Preferences Save
Theme + color theme already live; persist habit preferences to profile (reminder time, week starts on, frequency, show completed, compact view).

**Shipped (scope aligned in /architect):** migration `20261015045254_f26-default-frequency-and-6-mood-scale.sql` (adds `default_frequency` CHECK daily/weekly default daily; mood_scale CHECK → IN (5,6,7), default 6, rows updated; one-time entry remap ≥3 → +1; mood_levels reseeded to 6 rows for every user); `saveHabitPreferences` + `saveNotificationPrefs` partial-upsert actions; **HabitPreferencesCard + NotificationsCard auto-save on change** with shared `SaveStatusLine` (Saving/Saved/Error — Appearance pattern); `week_starts_on` **honored** in Calendar grid (`buildMonthCells` param + `weekdayHeaderLabels` rotation), Home WeekStrip, Stats weekly buckets (loaders fetch it; fallback 1=Monday); show-completed/compact/frequency/reminder-time stored but inert (no design spec); **6-mood scale bundled** (developer list: Very Happy→Fu*ked Up, high=happier) — MoodFace redesigned with Tired + Fu*ked Up SVGs, callback + fallback seeds updated; MoodSettingsCard scale select = single "6 Levels" stopgap (F28 redesigns the card).
### 27 Profile Save ✅

Display name + bio note (+ tracker title/welcome if kept) → Home greeting reflects profile.
**Shipped (scope aligned in /architect):** `saveProfile` action (trim, name ≤50, bio ≤100, empty→null, upsert, revalidates `/settings` + `/`); ProfileCard auto-save = 500ms debounce + flush-on-blur + `lastSavedRef` no-op skip + SaveStatusLine (text fields don't save per keystroke); Home `displayName` = saved name → email local-part `.slice(0,3)` → "You" (`profileDisplayName` in home-data; mock "Krishna" fallback dropped); UserMenu prefers DB `profiles.display_name` (client select) → OAuth name → email prefix; **tracker_title / welcome_message stay dormant** (no UI — developer decision).
### 28 Mood Settings ✅ (redirect: header quick panels)

Scale is fixed at 6 since F26 (migration + reseed done) — this feature wires the remaining card controls: enable notes; reminder time UI; show on calendar flag. Redesign/replace the scale row (stopgap single-option select today).
**Shipped (developer redirect mid-architect):** `saveMoodSettings` action (booleans + `HH:MM` time, revalidates `/settings` + `/mood` + `/calendar` + `/` — flags are read on those pages); **Settings layout redirect:** ProfileCard / NotificationsCard / MoodSettingsCard deleted from the grid — Profile + Notifications/Mood now open as **header quick-access surfaces**; `ProfilePanel` = F27 name/bio logic; `NotificationsPanel` = 5 notify toggles + Mood subsection (enable notes, reminder time, show on calendar, auto-save) + **read-only 6-face mood scale preview** (DB `mood_levels` via `SettingsMoodLevel`, `MoodFace size={26}`); grid rebalanced col1 Appearance/Categories/Manage Habits, col2 Habit Preferences/Data Management/About, col3 Danger Zone/decorative.
**F28.1 sheet rebuild (developer: floating dropdowns looked like AI slop + rendered under cards):** anchored dropdowns replaced by right-side **slide-over sheets** — new `components/ui/Sheet.tsx` on `@radix-ui/react-dialog` (headless primitive; focus trap / scroll lock / Esc / portal free, styled with our tokens — this is what shadcn's Sheet is built on); `SettingsHeaderActions` owns the two trigger icons + sheets; **root-cause bugfix:** `.page-enter > *` fill-mode `both` → `backwards` (the retained `transform: translateY(0)` made every page section a permanent stacking context, so z-indexed overlays painted in DOM order and got covered by later sibling sections — latent bug on Stats/Mood dropdowns too).

### 29 Export / Import JSON ✅

Export all user tables → versioned JSON; zod-validated import upserts in dependency order; Backup = timestamped download.
**Shipped:** `lib/data-export.ts` (v1 camelCase envelope, zod schemas, `parseExportFile` client pre-check, filename helpers) + `GET /api/data/export` (auth-checked; all 7 tables; `?backup=1` = timestamped filename) + `actions/data.ts` `importUserData` (server re-validate; merge-upsert never deletes — profile onto `auth.uid()`, mood levels by `user_id,value`, parents by `id`, completions by `habit_id,date`, entries/notes by `user_id,date`; chunked 500; revalidates all 6 app routes) + DataManagementCard wiring (programmatic-anchor download, hidden file input, inline confirm strip with row-count summary, status line; Reset row still inert — F30). Architect-aligned: merge semantics (replace = F30's Reset), full payload incl. profile + mood_levels, confirm = CategoriesCard two-step pattern.

### ~~30 Danger Zone + About~~ — CANCELLED (developer)

Clear completions / delete habits / reset all + About link destinations. **Cancelled by developer before build:** "no need for feature 30 — don't reset any data." Danger Zone card, About link rows, and the Data Management Reset row were then removed entirely in the UI overhaul (dead chrome).

### UI overhaul — Settings redesign + Home fixes (post-F29, developer-driven)

Developer screenshot review of all pages → full pass, superseding parts of the SettingsPage.png layout where it conflicted with the redesign direction:

- **Settings rebuilt:** 3-column card grid → section nav + single unboxed pane (Linear/Stripe pattern) — no cards, no icon-bubble section headers, no decorative filler; Profile/Notifications/Mood remain header-icon surfaces but as **anchored popovers** (`PopoverPanel` on `@radix-ui/react-popover`) replacing the F28.1 sheets; Sign Out moved into the profile popover; Danger Zone + About link rows + Reset row deleted (F30 cancelled)
- **Home fixes:** date nav (dead buttons + hardcoded July mock label) removed; mood section removed (MoodSelector card, mood StatCard, QuoteCard — mood logging lives on /mood only; stat row → 3 cards); status colors unified (done=green, partial=yellow, missed=red — was purple done + wrong glyphs on all circles); dead kebab removed; This Week rewritten as visible SVG progress rings (old faint tint rings were invisible with real data); Add Habit button wired to /habits
- **Sidebar:** avatar/UserMenu removed (footer = Dark Mode toggle only); "U" initial bug died with it
- **Cross-page:** Stats flame KPI bubble error-red → warm amber; Stats rate card bare HabitIcon glyphs (was emoji tiles); Quick Stats tiles softened to surface-alt + tinted chips; Mood Insights hides zero-count rows; mood strip + settings nav scrollbars hidden (`.scrollbar-hide`); Calendar Day Legend decorative ℹ removed; Settings Habits "+ Add Habit" → filled primary (matches /habits)
- **Habits page pass (post-overhaul):** today-column highlight rebuilt to match developer's reference image (filled rounded-RECT header pill + solid `border-primary` outline + faint fill on every today-column cell incl. notes row; status fills keep their color); new **Habit Graph** card below the grid — daily weighted completion % for the viewed month (Recharts Area + `makeRevealAreaShape` reveal, same language as Mood Graph; active habits only; future days = gaps; live-recomputes on cell toggles; pure `buildHabitMonthSeries` in lib/stats.ts)

---

## Phase 13 — Marketing site + theme + motion parity (shipped)

- **Routes:** `/` = public marketing landing page (static), `/home` = the app Home (was `/`). Any new app page goes under `app/(app)/`, any new public page under `app/(marketing)/`.
- **Landing page:** outcome-led hero (headline "Build the version of you that shows up."), a REAL habit-grid product visual (`LandingHabitGrid` — the app's own cell language), a bento grid of OUTCOMES (flagship tile = "A year of your consistency, in one glance"), 3-step how-it-works, closing CTA, footer with the logo, a script quote and a tagline only.
- **No fabricated social proof.** There are no real users, so the landing sells with live product visuals, never testimonials or user counts.
- **Themes:** 10 total — the original Lavender Sky family (lavender, mint, peach, ocean, rose) plus the 5 reference themes (sage, clay, lagoon, berry, orchid) which use a near-neutral chrome with one saturated accent. `profiles.color_theme` CHECK constraint had to be widened by migration for the new values.
- **Auth:** Google + GitHub OAuth only. The sign-in page has **Sign in** / **Create account** tabs (both OAuth) and remembers ONE account — the one this browser used last — masked, in a cookie (`ht_last_account`). The SDK gets no "list accounts" call: that would leak other people's addresses.
- **Motion:** one language app-wide from `lib/motion.ts` — content that replaces other content fades and slides in from the LEFT and exits to the RIGHT; active nav items use a shared `layoutId` pill that slides between them. The CSS `page-enter` class is DELETED; `PageTransition` owns the page entrance.

---

## Phase 13.1 — Polish pass (smooth scroll, one heatmap, quick themes, Lumi in the app)

Developer-driven polish across the marketing page and the app:

- **Smooth in-page scroll:** `scroll-behavior: smooth` + `scroll-padding-top: 5rem` on `html` in `globals.css`. The landing anchors glide and land BELOW the sticky header (they used to hide under it). Reduced motion keeps the instant jump via the global kill-switch.
- **ONE heatmap, two surfaces:** `components/ui/ContributionHeatmap.tsx` is shared by the landing page and the Stats card. Geometry is fixed: 7 weekday rows × one column per week (GitHub orientation), cells `aspect-square rounded-[2px]`, gap `3px`, colour via inline `var(--color-heat-0…4)`. **Design rule: the real product must look exactly like the marketing promise — a heatmap shown on the landing page is a promise the Stats page has to keep.**
- **Stats card:** tabs are **Consistency** (default) and **By Habit**. Consistency = the shared panel with the user's own 16-week history ("Last 16 weeks" left, the real "N days tracked" right, Less→More legend, plus check-ins / active days / avg daily rate above it). By Habit = the per-habit monthly matrix. The old 52-week annual tab was folded in — **two heatmap styles in one card is what the developer complained about.**
- **Quick theme swatches:** five small squares (Sage, Clay, Lagoon, Berry, Orchid) that switch + persist the colour theme in one click. **Placement rule: the swatches float ABOVE the card, right-aligned — never inside it.** Applied above the app Home "This Week" card and above the landing hero's product visual. All ten themes stay in Settings → Appearance.
- **Lumi in the app:** one mood per surface — Stats `streak`, Mood `supportive`, Calendar `idle`, Habits `celebrate`, Settings → About `sleepy`, Home auto. They live in the **page header's right-hand group** (next to the script quote), never in a narrow sidebar, and use `showDialogue={false}` so the speech bubble stays closed until tapped.
- **Footer:** "Sign in" / "Create an account" removed — the header already carries both CTAs.

---

## Cross-cutting rules

1. Tokens only — no raw palette classes, no hardcoded hex in components (data files may carry hex applied via inline style)
2. Faces/logos render from data (DB `mood_levels`) or shared components — never ad-hoc emoji per page
3. Light + dark both verified every feature
4. Script accents: Caveat via next/font; decorative elements non-interactive
5. Approved deps only (Recharts for charts; no chart libs beyond it; heatmap = custom CSS grid)

## Definition of Done (per feature)

- [ ] Matches canonical design in light and dark
- [ ] `/imprint` updated if new patterns
- [ ] Wired to InsForge or pure helpers
- [ ] Empty states handled
- [ ] `/review` completed; issues triaged
- [ ] progress-tracker.md updated
- [ ] `/remember save`
