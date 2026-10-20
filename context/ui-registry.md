# UI Registry

Living document. Updated after every component is built via `/imprint`. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — run `/imprint` to append or update its entry.

---

## Baseline

Established in Feature 01 (Phase 1) from `@public/designs/trakcer UI.png` + `@public/designs/HomePage.png`.

| Property | Correct class / value |
|----------|------------------------|
| Page background | `bg-background` |
| Card | `rounded-xl border border-border bg-surface p-6 shadow-card` |
| Card compact | `p-5` |
| Primary button | `bg-primary text-primary-foreground` + `rounded-sm h-10 px-4 text-sm` |
| Secondary button | `bg-surface text-text border border-border` |
| Input | `rounded-sm border border-border bg-surface px-3 py-2 text-sm` |
| Nav active | `bg-accent-light text-accent-foreground` |
| Nav inactive | `text-text-secondary hover:bg-surface-hover` |
| Emoji tile | `h-10 w-10 rounded-lg bg-accent-light` (Home habit row) |
| Check circle done | `h-7 w-7 rounded-full bg-primary text-primary-foreground` |
| Check circle empty | `h-7 w-7 rounded-full border border-border bg-surface` |
| Sidebar width | `w-[var(--sidebar-width)]` (240px) |
| Topbar | `h-16 sticky border-b border-border bg-surface/90` |
| Script accent | `font-script text-primary/80` or `text-primary-dark` |
| Stat icon bubble | `h-11 w-11 rounded-full` + soft tint (`bg-primary-lightest`, `bg-error-light`, …) |

---

## Components

### ThemeProvider

File: `components/layout/ThemeProvider.tsx`
Last updated: Feature 01

| Property | Value |
|----------|--------|
| API | `useTheme()` → themeMode, colorTheme, setThemeMode, setColorTheme, resolvedTheme |
| Storage keys | `ht_theme_mode`, `ht_color_theme` |
| DOM | `data-theme`, `data-color-theme` on `<html>` |
| Modes | light / dark / system |

**Pattern notes:** Client-only. Root layout wraps app in provider. Feature 04 will persist to InsForge profile.

---

### Topbar — REMOVED

Removed in Feature 09 (rebuild) to match the old tracker: no sticky header. Theme toggle + `UserMenu` now live in the Sidebar footer. `components/layout/Topbar.tsx` deleted.

---

### Sidebar

File: `components/layout/Sidebar.tsx`
Last updated: Feature 09 (rebuild)

| Property | Class |
|----------|--------|
| Container | `fixed inset-y-0 left-0 z-40 w-[var(--sidebar-width)] flex flex-col border-r border-border bg-surface` |
| Logo block | `flex flex-col items-center gap-2 px-4 py-7` |
| Logo tile | `h-11 w-11 rounded-xl bg-primary-lightest` |
| Brand | `text-[15px] font-bold text-text` |
| Tagline | `text-[11px] text-text-muted` |
| Nav item base | `flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium` |
| Nav active | `bg-accent-light text-accent-foreground` |
| Nav inactive | `text-text-secondary hover:bg-surface-hover hover:text-text` |
| Icons | lucide 18px stroke 2 |
| Script accent | `font-script text-[20px] text-primary/85` (compact block above footer) |
| Footer | `border-t border-border px-4 py-4 space-y-3` — "Dark Mode" label + `Switch` (resolvedTheme) + `UserMenu` avatar |
| UserMenu panel | opens upward: `absolute bottom-12 left-0` |

**Pattern notes:** Client component (`usePathname` + `useTheme`). Old-tracker-style bottom controls: dark-mode switch + profile icon. Avatar menu pops upward. Decorative lavender glyph removed for a cleaner footer.

---

### UserMenu

File: `components/layout/UserMenu.tsx`
Last updated: Feature 02

| Property | Class |
|----------|--------|
| Trigger | same as Topbar avatar |
| Menu panel | `absolute bottom-12 left-0 z-50 w-52 overflow-hidden rounded-lg border border-border bg-surface shadow-pop` (opens upward — lives in Sidebar footer) |
| Menu item | `flex w-full items-center gap-2 px-3 py-2.5 text-sm text-text hover:bg-surface-hover` |
| Sign-out icon | `h-3.5 w-3.5 text-error` |
| User email | `mt-0.5 truncate text-xs text-text-muted` |

**Pattern notes:** Client component. Hydrates via `insforge.auth.getCurrentUser()`. Outside-click closes. Sign-out calls `actions/auth.ts` `signOut()`.

---

### Login OAuth card

File: `app/(auth)/login/page.tsx`
Last updated: Feature 02

| Property | Class |
|----------|--------|
| Card | `w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card` |
| Logo tile | `mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-primary` |
| OAuth button | `flex w-full items-center justify-center gap-2.5 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text hover:bg-surface-hover` |
| Error alert | `rounded-sm border border-error/30 bg-error-light px-3 py-2 text-xs text-error-foreground` |

**Pattern notes:** No dedicated login design PNG — chrome matches existing card language. Buttons call Server Action `initiateOAuth`. Pending state shows spinner + disabled siblings.

---

### Button

File: `components/ui/Button.tsx`
Last updated: Feature 01

| Property | Value |
|----------|--------|
| Variants | primary, secondary, ghost, danger |
| Sizes | sm h-8, md h-10, lg h-11 |
| Radius | `rounded-sm` (md), lg uses `rounded-md` |
| Primary | `bg-primary text-primary-foreground` |
| Secondary | `bg-surface text-text border border-border hover:bg-surface-hover` |
| Focus | `focus-visible:ring-2 focus-visible:ring-primary/40` |

---

### Card

File: `components/ui/Card.tsx`
Last updated: Feature 01

| Property | Class |
|----------|--------|
| Root | `rounded-xl border border-border bg-surface p-6 shadow-card` |
| Header row | `mb-4 flex items-center justify-between gap-3` |
| Title | `text-base font-semibold text-text` |
| Description | `text-xs text-text-muted` |

**Pattern notes:** Prefer Card over ad-hoc divs. Override padding with `className="p-5"` when design is denser.

---

### Sheet (right slide-over)

File: `components/ui/Sheet.tsx`
Last updated: F28.1 (sheet rebuild)

| Property | Class / value |
|----------|----------------|
| Primitive | `@radix-ui/react-dialog` (headless — focus trap, scroll lock, Esc, portal, Presence-animated unmount) |
| Overlay | `sheet-overlay fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]` |
| Content | `sheet-content fixed inset-y-0 right-0 z-[61] w-[26rem] max-w-full flex-col border-l border-border bg-surface shadow-pop sm:rounded-l-xl` |
| Header | sticky row `border-b border-border px-5 py-4`: optional icon bubble `h-9 w-9 rounded-full bg-primary-lightest text-primary` + Title (`text-sm font-semibold`) / Description (`text-xs text-text-muted`, sr-only fallback) + Close button `h-8 w-8 rounded-full hover:bg-surface-hover` `aria-label="Close"` |
| Body | `flex-1 overflow-y-auto px-5 py-4` |
| Motion | open: overlay soft-fade-in 0.2s + content `sheet-in` 0.3s `cubic-bezier(0.22,1,0.36,1)`; close: `sheet-out` 0.2s `cubic-bezier(0.4,0,1,1)`; `prefers-reduced-motion` → none |
| Z-order | above page-enter sections (z-60/61 beats cards at auto) — do NOT rely on sibling order |

**Pattern notes:** Use for focused side-editing surfaces (settings quick access). Props: `{ open, onOpenChange, title, description?, icon?, children }`. Children are the panel body only — the Sheet owns title/icon/close. First shipped consumer: Settings `ProfilePanel` + `NotificationsPanel` (F28.1). Radix Presence keeps content mounted until the close animation ends — no manual unmount handling.

---

### Input / Textarea

File: `components/ui/Input.tsx`
Last updated: Feature 01

| Property | Class |
|----------|--------|
| Input | `w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text` |
| Placeholder | `placeholder:text-text-muted` |
| Focus | `focus:ring-2 focus:ring-primary/40` |

---

### Home Greeting

File: `components/home/Greeting.tsx`
Last updated: Feature 05

| Property | Class |
|----------|--------|
| Title | `text-3xl font-bold tracking-tight text-text` + name in `text-primary` |
| Subtitle | `mt-1 text-sm text-text-muted` |
| Date nav btn | `h-9 w-9 rounded-full border border-border bg-surface` |
| Calendar btn | same + `text-primary hover:bg-surface-hover` |
| Script quote | `font-script text-xl text-primary/80` |

**Pattern notes:** Time-of-day greeting from client clock; name/dates from `lib/mock-home.ts` until profile/real dates (06+).

---

### Home StatCards

File: `components/home/StatCards.tsx`
Last updated: Feature 05

| Property | Class |
|----------|--------|
| Grid | `grid gap-4 sm:grid-cols-2 xl:grid-cols-4` |
| Card | Card + `p-5` |
| Progress ring | SVG 72px, stroke `stroke-border` track + `stroke-primary` value |
| Icon bubble | `h-11 w-11 rounded-full` + `bg-error-light` / `bg-primary-lightest` / `bg-warning-light` |
| Stat number | `text-2xl font-semibold leading-tight text-text` |
| Label | `text-sm font-medium text-text` |
| Hint | `text-xs text-text-muted` |

---

### Home TodayHabits

File: `components/home/TodayHabits.tsx`
Last updated: Feature 06+07

| Property | Class |
|----------|--------|
| Emoji tile | `h-10 w-10 rounded-lg bg-accent-light text-lg` |
| Check done | `h-7 w-7 rounded-full bg-primary text-primary-foreground border-transparent` |
| Check partial | `bg-warning text-warning-foreground` |
| Check missed | `bg-error text-error-foreground` |
| Check empty | `border-border bg-surface text-transparent` |
| Today ring | `ring-2 ring-primary/40` on selected-date circles |
| Add Habit | Button secondary full-width + Plus |
| Empty state | centered muted copy + Add Habit CTA |

**Pattern notes:** Wire to `setHabitCompletion` Server Action; cycle `done → partial → missed → unset(delete)`. Only selected-date (today) circles are clickable. `useTransition` dims list while pending. Data from `lib/home-data.ts`.

### Home StatCards

File: `components/home/StatCards.tsx`
Last updated: Feature 06+07

| Property | Class |
|----------|--------|
| Props | `progressPercent`, `progressHint`, `dayStreak`, `longestStreak` |
| Progress ring | SVG 72px, stroke `stroke-border` track + `stroke-primary` value |
| Mood card | still mock until Feature 08 |

**Pattern notes:** Account-level streaks via `accountDayStreak` / `accountLongestStreak`; progress via `dayProgressPercent` (done=1, partial=0.5).

---

### Home WeekStrip / QuickStats / MoodSelector

Files: `components/home/WeekStrip.tsx`, `QuickStats.tsx`, `MoodSelector.tsx`
Last updated: Feature 08

| Property | Class |
|----------|--------|
| Week ring done | `h-8 w-8 rounded-full border-2 border-primary bg-primary/20` |
| Week ring today | + `ring-2 ring-primary/30`; label `text-primary font-medium` |
| QuickStats tile | `rounded-lg p-3` + success/error/info/accent light tints |
| Mood chip active | `border-primary bg-primary-lightest rounded-xl` |
| Mood chip idle | `border-border bg-surface hover:bg-surface-hover` |
| Mood note | textarea input recipe + Save primary button |
| Mood saved | `text-xs text-success-foreground` + `role="status"` |
| Mood error | `text-xs text-error-foreground` + `role="alert"` |

**Pattern notes:** Single Save writes `mood_entries` + `daily_notes` via `saveMoodCheckin`. Levels from DB `mood_levels`. `enable_mood_notes` hides note field. WeekStrip + QuickStats are props-driven from `loadHomeDashboard`.

---

### SettingsCard

File: `components/settings/SettingsCard.tsx`
Last updated: Feature 04

| Property | Class |
|----------|--------|
| Root | Card + `flex flex-col` |
| Header | `mb-5 flex items-start gap-3` |
| Icon bubble | `h-11 w-11 rounded-full bg-primary-lightest text-primary` |
| Title | `text-base font-semibold text-text` |
| Description | `text-xs text-text-muted` |

**Pattern notes:** Matches SettingsPage.png card headers (icon left, title + subtitle stacked). Placeholder body uses `text-sm text-text-muted`.

---

### AppearanceCard

File: `components/settings/AppearanceCard.tsx`
Last updated: Feature 04 (review fixes)

| Property | Class |
|----------|--------|
| Mode label | `mb-2.5 text-sm font-medium text-text` |
| Mode active | `border-transparent bg-primary text-primary-foreground rounded-md px-4 py-2` |
| Mode inactive | `border-border bg-surface text-text-secondary hover:bg-surface-hover` |
| Swatch | `h-10 w-10 rounded-full border-2` + `bg-swatch-*` |
| Swatch active | `border-primary ring-2 ring-primary/35 ring-offset-2 ring-offset-surface` |
| Swatch label | `text-[11px]` (active: `font-medium text-text`) |
| Custom swatch | `bg-border-strong` + Palette icon, `disabled opacity-70` |
| Persist idle | `text-xs text-text-muted` |
| Persist saving | `text-xs text-text-muted` + `role="status"` |
| Persist saved | `text-xs text-success-foreground` + `role="status"` |
| Persist error | `text-xs text-error-foreground` + `role="alert"` |

**Pattern notes:** Swatch colors are tokens `--color-swatch-lavender` … `--color-swatch-rose`, plus `--color-swatch-sage` / `-clay` / `-lagoon` / `-berry` / `-orchid` for the new reference themes. Auto-persist debounced 300ms via ThemeProvider → `saveAppearance`. Status line is user-visible on profile sync failure (not console-only).


---

### SettingsShell layout

File: `components/settings/SettingsShell.tsx`
Last updated: Feature 04

| Property | Class |
|----------|--------|
| Page title | `text-3xl font-bold tracking-tight text-text` |
| Subtitle | `mt-1 text-sm text-text-muted` |
| Script accent | `font-script text-2xl text-primary/80` |
| Grid | `grid gap-6 xl:grid-cols-3` |
| Column | `space-y-6` |
| Decorative card | `bg-surface-muted` + script + footer chips |

**Pattern notes:** Full card skeleton vs SettingsPage.png. Only Appearance is live until Features 25–30.

---

### Switch

File: `components/ui/Switch.tsx`
Last updated: Feature 09

| Property | Class |
|----------|--------|
| Root on | `h-6 w-11 rounded-full bg-primary` |
| Root off | `h-6 w-11 rounded-full bg-border-strong` |
| Knob | `h-5 w-5 rounded-full bg-white shadow` + `translate-x-[22px]` on / `translate-x-0.5` off |
| Focus | `focus-visible:ring-2 focus-visible:ring-primary/40 ring-offset-2 ring-offset-surface` |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |

**Pattern notes:** `role="switch"` + `aria-checked`. Props: `checked`, `onChange`, `ariaLabel`. Used in HabitRow active toggle.

---

### Dropdown

File: `components/ui/Dropdown.tsx`
Last updated: Feature 21

| Property | Class |
|----------|--------|
| Trigger | `rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text` + ChevronDown (rotates when open) |
| Trigger hover | `hover:bg-surface-hover` |
| Panel | `absolute z-50 mt-1 min-w-36 rounded-lg border border-border bg-surface py-1 shadow-pop` |
| Item | `px-3 py-2 text-xs text-text hover:bg-surface-hover` |
| Item active | `font-medium text-primary` + Check icon |

**Pattern notes:** Generic select replacement, **typed generic `Dropdown<T extends string>`** (F21) — annotate options as `Array<DropdownOption<T>>` so `value`/`onChange` infer the exact union (no `as` casts at call sites). Props: `options`, `value`, `onChange`, `align`, `triggerLabel` (custom trigger text fn). Outside-click closes. Used by MoodGraphCard (GraphPeriod) + KeyInsightsCard (InsightPeriod).

---

### Habits MonthNav

File: `components/habits/MonthNav.tsx`
Last updated: Feature 09 (rebuild)

| Property | Class |
|----------|--------|
| Prev/next btn | `h-9 w-9 rounded-full border border-border bg-surface text-text-secondary hover:bg-surface-hover` |
| Month title | `text-2xl font-bold tracking-tight text-text` |

**Pattern notes:** Same chrome as Home date-nav buttons. Wraps year on month overflow. Page subtitle sits under it in `text-sm text-text-muted`.

---

### Habits HabitGridCard

File: `components/habits/HabitGridCard.tsx`
Last updated: Feature 09 (rebuild)

| Property | Class |
|----------|--------|
| Root | `rounded-xl border border-border bg-surface p-5 shadow-card` |
| Layout | `overflow-x-auto` + inner `min-w-[680px]`; label column `w-40 shrink-0`; day columns `grid gap-1` with `repeat(N, minmax(0, 1fr))` — cells fill width, no horizontal scroll on desktop |
| Cell size | `h-7 w-full rounded-md border-2 text-[11px] font-bold` |
| Cell done | `bg-success text-success-foreground` + ✓ |
| Cell partial | `bg-warning text-warning-foreground` + ~ |
| Cell missed | `bg-error text-error-foreground` + ✗ |
| Cell unset | `border-border bg-surface text-transparent` |
| Today column | + `ring-2 ring-primary ring-offset-1 ring-offset-surface` (cells + note chip) |
| Day header | `text-[11px] font-medium text-text-muted` centered per column |
| Habit label | emoji + `text-sm font-medium text-text` |
| Notes chip empty | `border-dashed border-border bg-surface text-text-muted` hover `border-primary/40 text-primary` |
| Notes chip filled | `border-primary bg-primary-lightest text-primary` (lucide StickyNote h-3.5) |
| Legend chip | 20×20 rounded-md border-2 + same status classes; label `text-xs text-text-secondary` |
| Legend divider | `mt-4 border-t border-border pt-4` |

**Pattern notes:** Habits page = month grid (habits × days) per developer's old tracker — not HabitsPage.png. Statuses + notes are keyed by **full date `YYYY-MM-DD`** so data lives only in its month. Mock: 9 habits from old tracker; September 2026 days 13–21 seeded + notes; page opens on Sept 2026 (`MOCK_VIEW`); today ring only when viewing `MOCK_TODAY` month. Cell click cycles `unset → done → partial → missed → unset`. Notes chip → `NoteModal`. Add Habit button no-op until Feature 10.

---

### Habits NoteModal

File: `components/habits/NoteModal.tsx`
Last updated: Feature 09 (rebuild)

| Property | Class |
|----------|--------|
| Backdrop | `fixed inset-0 z-50 bg-text/40` + flex center, p-4 |
| Panel | `w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-pop` |
| Title | `text-base font-semibold text-text` — "Note — October 11, 2026" |
| Body | Textarea recipe, rows=5, autoFocus |
| Footer | `justify-end gap-2` — Delete (danger), Cancel (secondary), Save (primary) |
| Close | Escape key, backdrop click, Cancel |

**Pattern notes:** Delete button only renders when a note already exists. Save with empty text deletes the note. Local state only until Feature 14 (`daily_notes`).

---

### Habits HabitFormModal

File: `components/habits/HabitFormModal.tsx`
Last updated: Feature 10

| Property | Class |
|----------|--------|
| Backdrop/panel | same recipe as NoteModal (max-w-md, shadow-pop) |
| Title | Add: "Add a New Habit"; Edit: `Edit — {name}` |
| Field label | `mb-1.5 block text-sm font-medium text-text` (+ `text-error *` for required) |
| Field inputs | Input / Textarea recipes; Category = native `<select>` with input recipe classes |
| Error | `text-xs text-error-foreground` + `role="alert"` |
| Delete confirm | `rounded-lg border border-error/40 bg-error-light p-3` — copy + Keep (secondary sm) / Delete forever (danger sm) |
| Footer (edit) | left: Archive/Restore (secondary sm) + Delete (ghost sm, `text-error hover:bg-error-light`); right: Cancel + Save |
| Footer (add) | right-aligned Cancel + Save only |

**Pattern notes:** One modal serves add + edit (header Add button or grid habit-name click). zod schema in `lib/habit-form.ts` (not in the `"use server"` file — those may only export async fns). Mock rows (`isMock`) mutate local state only; real rows call `actions/habits.ts` then sync from revalidated server props.

---

### Habits page shell (server → client view)

Files: `app/(app)/habits/page.tsx`, `components/habits/HabitsView.tsx`, `lib/habits-data.ts`
Last updated: Feature 10

| Property | Value |
|----------|--------|
| Page | async Server Component — `loadHabitsPageData()` (redirects `/login`); passes `initialHabits` + `categories` to client |
| Client view | `HabitsView` — owns month/status/notes/form state; render-phase prop sync (no setState-in-effect) |
| Row sort | active first, then `sortOrder`; archived rows `opacity-60` |
| Habit name | button `truncate text-left text-[13px] font-medium hover:text-primary hover:underline` |
| DB fallback | empty `habits` table → mock rows (`isMock: true`, mock ids preserve Sept demo statuses) |

**Pattern notes:** Same server→client page pattern as Home. After Server Actions, `revalidatePath("/habits")` refreshes props; HabitsView replaces local habit state from props. Creating the first real habit drops the mock fallback (demo cells disappear) — expected.

---

### Settings CategoriesCard

File: `components/settings/CategoriesCard.tsx`
Last updated: Feature 11

| Property | Class |
|----------|--------|
| Card | SettingsCard + Tags icon — "Habit Categories" |
| Row | `flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5` |
| Row swatch | `h-3.5 w-3.5 rounded-full` + inline style hex (data-driven) |
| Row icon btns | `h-7 w-7 rounded-full text-text-muted` — Pencil hover `bg-surface-hover`; Trash hover `bg-error-light text-error` |
| Edit panel | `rounded-lg border border-border bg-surface-muted p-3` — Input + SwatchPicker + Cancel/Save (sm) |
| Delete confirm | `rounded-lg border border-error/40 bg-error-light p-3` — copy + Keep/Delete forever (sm) |
| Add form | `rounded-lg border-dashed border-border p-3` — Input + Add (sm) + SwatchPicker |
| SwatchPicker | `h-6 w-6 rounded-full` preset 5; active `border-text ring-2 ring-primary/30`; role=radiogroup |
| Empty | `text-sm text-text-muted` copy |
| Error | `text-xs text-error-foreground` + `role="alert"` |

**Pattern notes:** Lives in Settings (Habit Preferences column) per developer — not on the Habits page. Inline editing, no modal. Preset swatches from `lib/category-form.ts` `CATEGORY_SWATCHES` (design greens/purple/pink/blue/orange); zod schema refuses non-preset hexes. Server Actions in `actions/categories.ts`; loader `lib/settings-data.ts` `loadSettingsCategories()` (no try/catch — let cookie access mark the route dynamic). Delete nulls `habits.category_id` via FK SET NULL. Card keeps local state after mutations (no prop sync needed — only mutates from itself).

---

### MoodFace (shared primitive)

File: `components/ui/MoodFace.tsx`
Last updated: Feature 26 (6-level scale)

| Property | Value |
|----------|--------|
| Props | `value` (1–6), `color`, `size` (px, default 36), `className` |
| Root | `<svg viewBox="0 0 36 36">` + `<circle fill=color>` + procedural eyes/mouth |
| Feature color | `#2D2947` (constant FEATURE) |
| Very Happy (6) | closed happy eyes (upward arcs) + filled open smile (rounded wedge) |
| Happy (5) | dot eyes (r 1.9) + gentle smile arc (stroke 2) |
| Okay (4) | dot eyes + straight horizontal line mouth |
| Tired (3) | half-lidded eyes (droop arcs + small pupils below) + yawn ellipse |
| Sad (2) | dot eyes + frown arc (stroke 2) |
| Fu*ked Up (1) | mind blown 🤯 — `MindBlownCloud` (orange `#FB923C` + yellow `#FCD34D` puff circles bursting over the top of the head, may clip the viewBox top) + dot eyes (r 2, low at cy 21) + agape mouth (stroked ellipse) |

**Pattern notes:** Pure SVG — **no system emoji**. One implementation everywhere: Home MoodSelector/StatCards, Mood date strip/legend/graph tooltip/y-axis/donut/insights, Calendar day cells. Color + value always come from the level object (DB `mood_levels` or mock). The `emoji` column in `mood_levels` is retained for DB compatibility but the UI draws SVG from `value` + `color`. Scale is 6 levels since F26 (high = happier); value clamped 1–6.

---

### Mood page shell

Files: `app/(app)/mood/page.tsx`, `components/mood/MoodView.tsx`, `MonthCard.tsx`, `MoodGraphCard.tsx`, `NotesCards.tsx`, `MoodSidebar.tsx`
Last updated: Feature 16

| Property | Class |
|----------|--------|
| Page title | `text-3xl font-bold tracking-tight text-text` |
| Script accent | `font-script text-xl leading-snug text-primary/80` |
| Layout grid | `grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]` |
| MonthCard root | `rounded-xl border border-border bg-surface p-5 shadow-card` |
| View pills | `rounded-full` — active `bg-primary text-primary-foreground`; inactive `text-text-secondary` |
| Month nav btn | `h-8 w-8 rounded-full border border-border bg-surface hover:bg-surface-hover` |
| Date strip day | `w-14 shrink-0 rounded-xl border-2 px-1 py-2.5` + MoodFace 30px; selected `border-primary bg-surface shadow-card` (outlined column box per design) |
| Legend chip | `rounded-full border border-border bg-surface px-3 py-1.5` + MoodFace 24px |
| Graph | Recharts AreaChart (h-64); unified `GraphSeriesPoint[]` series (`key`/`tick`/`dateLabel`/`value`/`note`); custom tooltip = dateLabel + MoodFace/label + note; dots colored per level; face y-axis = flex column of MoodFaces left of chart; Y-domain derived from `levels`; X-axis `dataKey="tick"` + `interval={0}` (day numbers for month, sparse date ticks for ranges) |
| Graph period dropdown | `Dropdown` right-aligned in card header; options month/90d/year; **graph-only scope**; subtitle dynamic per period |
| Donut | Recharts PieChart inner 38 outer 60; center overlay `text-lg font-bold` + "days" |
| Insights row | `rounded-lg bg-surface-muted p-2.5` + MoodFace 32px; rows from `insightRows` prop (count + label-derived phrase) |
| Pattern callout | `rounded-lg bg-primary-lightest p-3` + Lightbulb icon |
| Note card | MoodFace 36px + Textarea recipe; Recent Notes rows `hover:bg-surface-hover` clickable → selects day |
| Decorative | `bg-primary-lightest` + script quote + 🪻 glyph |

**Pattern notes:** Page = thin async server (`loadMonthMood` current real month) → `MoodView` client. **Real data only — no seed** (empty months show empty states; donut "0 days"; graph gaps). Interaction: strip day = select only; legend chip = set mood for selected day (optimistic → `setDayMood`; active chip highlights); **second click on the active chip removes the entry** (optimistic delete + `setDayMood({ moodValue: null })` — action deletes the `mood_entries` row; Home mood card stays select+Save flow, no toggle there). Notes card = explicit Save (optimistic → `saveDayNote`/`deleteDayNote`); `enable_mood_notes=false` hides textarea. Recent Notes = month notes desc; View All = modal. Month nav → `getMonthMood` server action. **Module split:** pure types/builders in `lib/mood-view.ts` (client-safe); server loader in `lib/mood-data.ts` (next/headers — never import from client components directly). **Graph period (F15):** period state lives in MoodView; `month` reuses loaded month data, wider ranges fetch `getMoodRange` → `loadMoodRange` (date-keyed); period flips only after fetch succeeds; month nav refetches range when period ≠ month (falls back to month on failure); Distribution + Insights stay selected-month; Daily/Weekly/Monthly pills still chrome-only. **Notes draft reset keyed `year-month-day`** (day-only key left stale text across month nav). **No `revalidatePath("/mood")` from mutations** — MoodView owns the viewed month as client state; revalidation would replace `initialData` and snap the view to the server's current month. Fetch failures render a `loadError` alert line under the page header (`text-xs text-error-foreground`, `role="alert"`). **Insights (F16):** rows from `buildMoodInsightRows` (phrase = `Felt ${label.toLowerCase()}` — never hardcode value→phrase maps); pattern from `computeMoodPattern` (weekend/weekday → half-month trend → null → fallback copy) in `lib/insights.ts` — pure fns, computed in MoodView, passed as props (`insightRows`, `pattern` to MoodSidebar).

---

### Habits grid — wired data + drag reorder (Feature 12)

Files: `components/habits/HabitsView.tsx`, `HabitGridCard.tsx`, `lib/habits-data.ts`
Last updated: Feature 12

| Property | Class / value |
|----------|----------------|
| Drag handle | GripVertical `h-3.5 w-3.5 text-text-muted/60` (active habits only; cursor-grab) |
| Dragging row | `opacity-40` |
| Drop target | `ring-2 ring-primary/50` on row |
| Cell click | optimistic status update → `setHabitCompletion` (revert + console.error on fail) |
| Note save/delete | optimistic → `saveDayNote` / `deleteDayNote` (`daily_notes` upsert on `user_id,date`) |
| Reorder | native HTML5 DnD (no new deps) — active rows only; `reorderHabits(ids)` renumbers `sort_order` 0..n |
| Prop sync | render-phase adjustments for habits + statuses + notes |
| Today ring | real `new Date()` (not mock) |
| Default month | month of latest completion/note, else current month |

**Pattern notes:** No mock fallback — all rows real. `loadHabitsPageData()` **one-time seeds** demo data (9 habits + Sept 2026 completions + notes from `lib/mock-habits.ts`) when `habits` table is empty, so the developer's September grid persists as real DB rows. `mock-habits.ts` is now seed source only. Personal-scale: loads ALL completions + notes in one pass (fine for a single-user tracker; revisit if data grows).

---

### Stats page shell (Features 17–21)

Files: `app/(app)/stats/page.tsx`, `components/stats/StatsView.tsx`, `components/stats/HabitConsistencyCard.tsx`, `lib/stats-data.ts`, `lib/stats.ts`
Last updated: Feature 21

| Property | Class / value |
|----------|----------------|
| Page title | `text-3xl font-bold tracking-tight text-text` |
| Subtitle | `mt-1 text-sm text-text-muted` |
| Script accent | `font-script text-xl leading-snug text-primary/80` ("Progress / looks good on you 💜") |
| KPI grid | `grid gap-4 sm:grid-cols-2 xl:grid-cols-4` |
| KPI card | `rounded-xl border border-border bg-surface p-4 shadow-card` |
| KPI icon bubble | `h-11 w-11 rounded-full` + `bg-primary-lightest` (target/crown/chart) or `bg-error-light` (flame) |
| KPI value | `text-2xl font-bold leading-tight text-text`; label `text-xs text-text-muted` |
| Layout grid | `grid items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]` — left: Overview/Consistency/Insights, right: Rate/Streak/Decorative |
| Card root | `rounded-xl border border-border bg-surface p-5 shadow-card` |
| Granularity pills | `rounded-full px-4 py-1.5 text-sm font-medium` — active `bg-primary text-primary-foreground`, inactive `text-text-muted hover:text-text` (no pill container — free-floating per design) |
| Bar chart | Recharts BarChart h-64; bars `fill-primary radius-[4,4,0,0] maxBarSize-28`; Y ticks 0/25/50/75/100 `%`; cursor `bg-primary-lightest`; tooltip = dateLabel + `text-primary` % + `{done}/{total}` + "habits" (Daily) / "check-ins" (multi-day); **empty states:** no habits → "Add a habit…", no data → "No completion data yet…" (both `h-64` centered muted) |
| Habit rate row | emoji tile `h-7 w-7 rounded-md bg-surface-muted`; name `w-28 text-xs text-text-secondary`; track `h-2 rounded-full bg-surface-alt`; fill = **category color if set, else `HABIT_TINTS[i % n]`** (inline style); pct `w-9 text-right text-xs font-semibold` = weighted `weightedHabitRate` (done=1/partial=0.5 over active days = period ∩ since `created_at`); empty → muted line |
| KPI delta | centered; `+`/no-sign → `text-success-strong` + ArrowUp; `-` → `text-error-strong` + ArrowDown (sign stripped from label); no delta → caption only |
| Streak chart | Recharts AreaChart h-56, gradient `streakFill` primary 0.3→0.02, sparse dots (every 3rd); Y domain `max(30, ceil(max/30)*30)` ticks step 10; X ticks = days 1/7/14/21/28/(last) from series |
| Heat grid | **Dual-mode GitHub Consistency Card:** Segmented toggle `[ By Habit ]  [ Annual Activity ]`. **Mode 1 (By Habit):** CSS grid `8.5rem repeat(days, minmax(13px,16px))`, `columnGap: 3px`, `rowGap: 6px`. Sticky left habit label column (`sticky left-0 z-20 bg-surface/95 backdrop-blur-md pr-2 border-r border-border/50`) with habit emoji badge + name + month consistency score pill (`{rate}%`). Month navigation (`< Prev`, `Next >`, and `Today` button). Cells: `bg-[var(--heat-cell-done)]` / `bg-[var(--heat-cell-partial)]` / `bg-[var(--heat-cell-missed)]` / `bg-heat-0` (unlogged) / `bg-heat-0/35 border-dashed` (upcoming future days with distinct low-opacity styling). Day tick numbers `1, 7, 14, 21, 28, {days}` cleanly aligned. **Mode 2 (Annual Activity):** 52-week (53 columns × 7 weekday rows) GitHub contribution calendar matrix (`grid-cols-[2.25rem_repeat(53,11px)]`). Month headers across the top, weekday labels (Mon, Wed, Fri) on the left. Annual metrics banner (total check-ins, active days, avg daily rate). Standard GitHub ramp legend (`Less [0][1][2][3][4] More`). Both modes: cell click/tap opens an interactive Inspector Card for touch/mobile devices; hover shows fixed-position GitHub dark tooltip. |
| Heat hover tooltip (F20) | state-driven (cell `onMouseEnter` stores rect; cell + container `onMouseLeave` clear); **fixed-position** (escapes `overflow-x-auto`), measured via effect (renders offscreen at `left:-9999` first pass), X-clamped to viewport edges, flips below when insufficient room above; `pointer-events-none fixed z-50 rounded-md bg-tooltip px-2.5 py-1.5 shadow-pop`; line 1 `text-xs font-semibold text-tooltip-foreground` habit name; line 2 `text-[11px] text-tooltip-foreground/85` "Oct 11, 2026 · Completed"; `role="tooltip"`; native `title` removed |
| Heat legend | Mode-dependent: By Habit shows `h-2.5 w-2.5 rounded-full` dots (Missed / Partial / Completed / Unlogged); Annual Activity shows `Less` + 5-tier GitHub ramp squares (`bg-heat-0` to `bg-heat-4`) + `More` |
| Streak chip | `rounded-lg border border-border bg-surface px-3 py-1 text-center` — `text-lg font-bold` value + `text-[10px] text-text-muted` "days" |
| Key Insights header | sparkle SVG in `h-7 w-7 bg-primary-lightest` + title; `Dropdown` right (`This Month`) |
| Insight row | icon `h-8 w-8 rounded-lg` — calendar `bg-primary-lightest text-primary`, trend `bg-success-light text-success-strong`, moon `bg-primary-lightest text-primary`, mood (Smile) `bg-warning-light text-warning-strong`; title `text-sm font-medium`, detail `text-xs text-text-muted` |
| Decorative | `bg-gradient-to-br from-primary-lightest via-surface-muted to-primary-light p-6` + `font-script text-2xl text-accent-foreground` centered + 🏔️/⛅ glyphs |

**Pattern notes:** **Async server page** (`loadStatsData` → redirect /login) passes `StatsData` to `StatsView` client — **real DB data, no mock** (F18; `lib/mock-stats.ts` deleted at F21). Pure rollups live in `lib/stats.ts`: `buildCompletionSeries` (Daily = month-to-date; Weekly = last **12** Monday-start weeks; Monthly = last 12 months; Yearly = years with data cap 5; weighted done=1/partial=0.5 over active habits × elapsed days; clips days before first activity), `buildStatsKpis` (month-to-date vs last full month; streak delta vs last-day-of-prev-month via `streakEndingOn`), `streakSeriesForMonth` (counts across month boundaries; today holds yesterday's streak — last point always equals chip), `buildStatsHeatRows` (future + never-logged → `none` cell = `bg-heat-0`, returns emoji + rate + counts per habit row), `buildContributionCalendar` (**52-week GitHub contribution calendar matrix** with 53 week columns × 7 weekday rows, month headers, weekday labels, annual check-ins rollup, and 0–4 heat ramp levels), `weightedHabitRate` (**F19** — done=1/partial=0.5 over active days = period ∩ since habit `created_at`; replaces old `habitRate` which gave partial full credit), `HABIT_TINTS` fallback ramp. **Bar color priority (F19):** `habit_categories.color` hex (via `StatsData.categoryColors[categoryId]`) → `HABIT_TINTS[i % n]`. Server DB stays in `lib/stats-data.ts` (selects `category_id`, `created_at` + fetches category colors); `StatsData` type lives in the pure module (Turbopack rule: client never value-imports server loaders). **Pills card-local** (drive Overview only); **insights dropdown wired (F21):** `insightRangeFor` → This Month = 1st→today, Last 3 Months = 1st of month−2→today, This Year = Jan 1→today (all anchored to real today); `computeKeyInsights` recomputes client-side with `weightedHabitRate` for strongest-habit (title names the habit) + mood rows filtered by range (loader fetches all `mood_entries`); heatmap/streak = current real month, ignore pills. **Custom CSS grid heatmap — no chart library** (developer-confirmed; hard rule 4). Cells **capped 16px + 3px gap** (GitHub look). **Heat status cells use role vars** `--heat-cell-missed/partial/done` (light 1/3/4, dark 1/2/4); only the `none` state uses raw `bg-heat-0`. **F20 Mint = GitHub-exact:** Mint's heat ramp (incl. `heat-0`) now uses GitHub's exact hexes — light `#ebedf0/#9be9a8/#40c463/#30a14e/#216e39`, dark `[data-theme="dark"][data-color-theme="mint"]` `#161b22/#0e4429/#006d32/#26a641/#39d353` (only theme with a dark heat block); role vars reference `--color-heat-*` so cells + legend recolor automatically. **Hover tooltip (F20):** GitHub-style dark bubble both modes via `--color-tooltip` / `--color-tooltip-foreground` tokens — fixed-position JS tooltip (measure-offscreen pass), not native `title`; cells carry `role="img"` + `aria-label`. **`globals.css` color-theme blocks split:** vivid both modes, tints `[data-theme="light"]` only (combined blocks white-washed dark mode). Decorative **script on tinted cards = `text-accent-foreground`**. KPI delta: `+`/unsigned → success ArrowUp, `-` → error ArrowDown. Empty states: no habits / no completions → centered muted copy in Overview + Rate + Heat; insights fallback from `computeKeyInsights`.
---

### Calendar page shell (Features 22–24)

Files: `app/(app)/calendar/page.tsx`, `components/calendar/{CalendarView,MonthCard,DayDetailsCard,DayLegendCard,MonthlyOverviewCard}.tsx`, `lib/calendar.ts`, `lib/calendar-data.ts`
Last updated: Post-F25.2 revert (inline Day Details restored; DayModal popup removed)

| Property | Class / value |
|----------|----------------|
| Page header | `text-3xl font-bold tracking-tight text-text` + `mt-1 text-sm text-text-muted`; script accent `whitespace-pre-line text-right font-script text-xl leading-snug text-primary/80` ("A little progress / every day 💜") |
| Layout grid | `grid items-start gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]` — left: MonthCard + DayDetailsCard, right: Legend/decorative/Overview (inline Day Details restored Post-F25.2 — popup reverted) |
| Card root | `rounded-xl border border-border bg-surface p-5 shadow-card` |
| Month nav | chevrons `h-8 w-8 rounded-full border border-border` + title `text-xl font-bold`; Today = `rounded-md bg-primary-lightest px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light` |
| Weekday header | `grid grid-cols-7 gap-1.5`, labels `text-xs font-medium text-text-muted` centered — order from `weekdayHeaderLabels(weekStartsOn)` (F26: honors `profiles.week_starts_on`, default Monday) |
| Month cell (in-month) | button `min-h-[76px] flex-col gap-1 rounded-lg` + `hover:bg-surface-hover`; date `text-sm` (`font-semibold text-text` when today/selected else `text-text-secondary`); dots `h-1.5 w-1.5 rounded-full gap-[3px]` — done `bg-success-strong`, partial `bg-warning`, missed `bg-error`, no-entry = no dot; MoodFace size 22 (placeholder `h-[22px]` when absent); selected `border-2 border-primary`, today-not-selected `border border-primary/60`; focus `ring-2 ring-primary/40` |
| Month cell (adjacent) | muted div (not button): date `text-sm text-text-muted/50`, no dots/face |
| Day Details header | title `text-sm font-semibold` + Edit Day chrome pill `rounded-md border border-border px-3 py-1.5 text-xs` + Pencil (kebab removed — dead chrome) |
| Day nav | chevrons `h-7 w-7 rounded-full border` + date `text-sm font-semibold text-text` ("July 12, 2026") |
| Mood block | MoodFace 44 + `text-[11px] text-text-muted` label + `text-sm font-semibold`; empty → "No mood logged." |
| Note block | label `text-xs font-medium text-text-muted`; body `rounded-lg border border-border p-3 text-sm text-text-secondary`; empty → textarea + Save directly |
| Checklist | header `text-sm font-semibold` + `(n / 7 completed)` muted; rows `gap-2.5`: done `h-5 w-5 rounded-md bg-primary text-primary-foreground` + Check, partial `bg-primary/45`, else `border border-border-strong bg-surface`; habit icon = **`HabitIcon` size 30** (Post-F25.2) + name `text-sm` |
| Day Legend | title + Info icon `h-4 w-4 text-text-muted`; status rows `h-3 w-3 rounded-full` dots (success-strong/warning/error/border-strong) + `text-sm` (labels = F24 class definitions, static); mood rows MoodFace 20 + label from **DB `mood_levels` via `levels` prop** (F24 — no more mock-home import) |
| Monthly Overview | header title + shared-month chevrons `h-6 w-6` + `text-xs font-medium` month label; ring = inline SVG 92px (`-rotate-90`, track `stroke=var(--color-surface-alt)`, arc `var(--color-primary)`, r=36 stroke 8) + center `text-lg font-bold` % / `text-[10px]` "{strong} of {elapsed} days"; tiles `grid-cols-2`: dot `h-3 w-3` **hex via inline style from local `TILES` const** (great `#34D399`, okay `#7DD3FC`, tough `#FC8FA5`, no-data `#C7CCD1`) + `text-sm font-bold` **live count** + `text-[11px]` label; closer `font-script text-base text-accent-foreground` centered |
| Decorative | `StatsDecorativeCard` reused with `quote` prop ("Consistency today creates / a brighter tomorrow. 💜") |

**Pattern notes:** **Real-only since F23 — no mock, no seed.** Async server page (`loadCalendarData` → redirect /login) passes `CalendarData` (one-pass: active habits, all completions/moods/notes, mood_levels, profile flags) to `CalendarView` client. **Client-authoritative state (F15 no-snap):** `viewMonth`/`selectedKey` init to real today; `completions` + `notes` state seeded from props once, never re-synced on revalidation; mutations optimistic + snapshot revert; per-habit in-flight guard. **Post-F25.2 revert (developer):** DayModal popup experiment rolled back — Day Details is the inline card below the grid again (two-column layout); day click selects only; dead MoreVertical chrome stays removed. **Cross-page sync:** `setHabitCompletion` revalidates `/`, `/habits`, `/stats`, `/calendar`; `saveDayNote`/`deleteDayNote` now also revalidate `/calendar` + `/` (were `/habits`-only) — Habits grid and Calendar checklist read the same `habit_completions` rows. **Checklist cycle (F23):** unset→done→partial→missed→unset via `setHabitCompletion`; missed = `border-error bg-error-light` + X (`Checkbox` in DayDetailsCard); rows are full-width buttons; habit icons = shared `HabitIcon` size 30. **Notes (F23):** saved note shown with Edit affordance; no note → textarea + Save directly; edit mode = Save/Cancel/Delete; draft resets on day change via **render-phase adjustment** (not setState-in-effect); gated by `enable_mood_notes`; mood display-only. Cells: `show_mood_on_calendar` false → no faces (`buildCellMap`); dots = logged statuses in habit order; faces from DB `mood_levels` via shared `MoodFace`. Pure helpers in `lib/calendar.ts`: `buildMonthCells` (dynamic weeks starting at `weekStartsOn` — F26 param + `weekdayHeaderLabels` header rotation), `cycleStatus`, `withCompletion`, `buildStatusMap`, `buildCellMap`, `shiftMonth`/`shiftDay`, **`classifyMonth` (F24)** — weighted ratio over all active habits (unlogged = 0 slot): Great ===1, Okay ≥0.5, Tough >0, No Data =0; month-to-date elapsed (future days excluded); ring = (Great+Okay)/elapsed; tiles live, recompute on optimistic toggles; month cells cascade-in via `.cal-cell` (Post-F25). Decorative = `StatsDecorativeCard` quote prop. Headless: signed-in QA vs CalenderPage.png carried with F17–23 backlog.---

### Route transition + sliding nav indicator (Phase 13)

Files: `components/layout/PageTransition.tsx`, `components/ui/SlidingIndicator.tsx`, `components/layout/{Sidebar,MobileNav}.tsx`, `app/(app)/layout.tsx`, `lib/motion.ts`
Last updated: Phase 13

| Property | Class / value |
|----------|----------------|
| Page transition | `PageTransition` wraps the app router's children in `app/(app)/layout.tsx`; `AnimatePresence mode="wait"` keyed on `usePathname()` |
| Enter | `initial { opacity: 0, x: -16 }` → `animate { opacity: 1, x: 0 }` — **slides in FROM THE LEFT** |
| Exit | `exit { opacity: 0, x: 16 }` (drifts out to the RIGHT) |
| Timing | enter 0.32s `cubic-bezier(0.32, 0.72, 0, 1)` (decelerate) · exit 0.28s `cubic-bezier(0.4, 0, 0.6, 1)` (accelerate) — see `lib/motion.ts` |
| Travel | 16px (`SLIDE_DISTANCE` in `lib/motion.ts`) |
| Reduced motion | `useReducedMotion()` → no enter/exit transform |
| Sliding pill | `SlidingIndicator` = `motion.span` with a `layoutId`; one shared element per nav, so the highlight SLIDES between items instead of jumping |
| Pill spring | `type: "spring", stiffness: 420, damping: 34` |
| layoutIds | `sidebar-nav-pill` (desktop), `mobile-nav-pill` (bottom bar), `settings-nav-pill` (settings tabs) — **must stay unique**; two indicators sharing an id fight over the same layout slot |
| Skeleton | **deleted** — `app/(app)/loading.tsx` + `components/ui/Skeleton.tsx` + the `.skeleton` CSS are gone |

**Pattern notes:** The route transition and the Settings section cross-fade
share their easings/durations/distance from `lib/motion.ts`, so switching a
Settings tab and switching a page are the same gesture — content that
replaces other content **fades in sliding from the LEFT** and drifts out to
the RIGHT. `mode="wait"` (not the default "sync") is required for pages:
both trees are static in the document flow, so overlapping them would stack
two full pages and jump the layout.

The sidebar's active item keeps `text-accent-foreground` as the text color
and the pill supplies `bg-accent-light`; the label + icon sit in a
`relative z-10` span above the absolutely-positioned pill. The mobile bar's
pill is a 32×32 circle behind the icon (it replaced a `bg-primary-lightest`
class on the icon bubble).

The skeleton existed because every route is dynamic, so a navigation left
the previous screen up with no feedback. The transition replaces it: the
outgoing page fades and slides out, the incoming one fades and slides in.

### Page entrance — REMOVED (Phase 13)

The CSS `page-enter` class (a staggered fade + rise of each page's blocks)
is **gone**. Two problems with it:

1. It was the "slide from below" the developer asked to replace.
2. It fought the JS transition — the container was still fading in while
   the blocks independently faded from 0, so a route change read as
   **blank for ~0.9s** before content appeared. (First made rise-only,
   then removed entirely once the container owned the entrance.)

`@keyframes page-enter`, the `.page-enter` rules and their
`prefers-reduced-motion` entry are all deleted from `globals.css`. The
page-level entrance is `PageTransition` alone.



### Settings page shell (Feature 25)

Files: `app/(app)/settings/page.tsx`, `components/settings/{SettingsShell,SettingsRow,SettingsHeaderActions,ProfilePanel,NotificationsPanel,HabitPreferencesCard,ManageHabitsCard,DataManagementCard,DangerZoneCard,AboutCard}.tsx`, `components/ui/Sheet.tsx`, `lib/settings-data.ts`, `lib/utils.ts` (`formatTime12`, `TIME_OPTIONS`)
Last updated: Feature 28 (quick panels redirect)

| Property | Class / value |
|----------|----------------|
| Layout | **F28 redirect + F28.1 sheet rebuild:** grid = `grid gap-6 xl:grid-cols-3` — col1: Appearance, Categories, Manage Habits; col2: Habit Preferences, Data Management, About; col3: Danger Zone, decorative. Profile + Notifications + Mood Settings **removed from grid** — open as right-side slide-over sheets from header icons |
| Header right | script accent + `SettingsHeaderActions` icon pair |
| Sheet trigger icons | circular `h-10 w-10 rounded-full border`; idle `border-border bg-surface text-text hover:bg-surface-hover`; pressed `border-primary bg-primary text-primary-foreground`; `focus-visible:ring-2 focus:ring-primary/40` |
| Sheet chrome | Radix Dialog (`@radix-ui/react-dialog`) portal: overlay `fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]` (`.sheet-overlay`); content `fixed inset-y-0 right-0 z-[61] w-[26rem] max-w-full border-l border-border bg-surface shadow-pop sm:rounded-l-xl` (`.sheet-content`); sticky header row (icon bubble + Title/Description + X close) + scrollable body `px-5 py-4` |
| Sheet motion | `.sheet-overlay` = soft-fade-in 0.2s; `.sheet-content` = `sheet-in` 0.3s `cubic-bezier(0.22,1,0.36,1)`; close = `sheet-out` 0.2s `cubic-bezier(0.4,0,1,1)`; Radix Presence delays unmount; `prefers-reduced-motion` → none |
| Sheet a11y | focus trap + scroll lock + Esc + portal handled by Radix; Title = `text-sm font-semibold`; Description = `text-xs text-text-muted` (sr-only fallback if none); Close button `aria-label="Close"` |
| Panel header | `h-9 w-9 rounded-lg bg-primary-lightest text-primary` bubble + `text-sm font-semibold` title + `text-xs text-text-muted` subtitle (compact SettingsCard-header look) |
| Panel sections | Notifications panel = notify rows + `border-t border-border pt-4` Mood subsection (own `h-7 w-7` bubble, `text-sm` title); scale preview row: `MoodFace size={26}` × N + `{n} Levels` caption |
| SettingsRow | `flex items-center justify-between gap-3 py-2`; icon bubble `h-8 w-8 rounded-lg bg-primary-lightest text-primary` (`iconClassName` override); title `text-sm font-medium`, caption `text-xs text-text-muted`; control `shrink-0` right |
| Row lists | `-mx-1 divide-y divide-border` on the card body |
| Settings select | `settingsSelectClass` = `rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs` + `focus:ring-2 focus:ring-primary/40`; full-width mood-scale select adds `w-full py-2 text-sm`; native `<select>` (habit-form precedent) |
| Toggle rows | existing `Switch` (`h-6 w-11`, checked `bg-primary`) |
| Card header tone | `SettingsCard` `iconClassName`: default `bg-primary-lightest text-primary`; Data Management `bg-success-light text-success-strong`; Danger Zone `bg-error-light text-error` |
| Danger buttons | `Button variant="secondary" size="sm"` + `border-error bg-error-light text-error hover:bg-error-light/70` (design light-red, not solid danger) |
| Normal buttons | `Button variant="secondary" size="sm"` + leading lucide icon (Export/Import/Backup) |
| Danger row text | title `text-sm font-medium text-error`, caption `text-xs text-error-foreground` (Data Mgmt reset row) |
| Profile name | `Input` + `pr-9` + absolute `Pencil` `right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none` |
| Profile bio | `Textarea` rows=4 `maxLength=100` `pb-6` + counter `absolute bottom-2 right-3 text-[10px]` "{n}/100" |
| About identity | `text-sm font-semibold` name + `text-xs text-text-muted` lines (version, tagline, "Made with ♥ for a brighter tomorrow.") |
| About link rows | full-width button rows: icon bubble `h-8 w-8` + `text-sm font-medium` + `ChevronRight`; `hover:bg-surface-hover`, focus ring |
| Row icon tones | Streak Alerts `bg-error-light text-error`; Missed Habit Reminder `bg-surface-alt text-text-muted`; Backup `bg-success-light text-success-strong`; Reset rows `bg-error-light text-error` |

**Pattern notes:** **Hydrated chrome (F25) — persistence F26/F27/F28.** `loadSettingsData` returns `{ categories, habits, profile, moodLevels }` in one pass (Promise.all, schema defaults via `DEFAULT_SETTINGS_PROFILE`; moodLevels = user's `mood_levels` sorted value desc for the scale preview). **F28 redirect (developer):** ProfileCard / NotificationsCard / MoodSettingsCard deleted — Profile + Notifications/Mood now render inside header quick-access surfaces; grid rebalanced to 3/3/2. **F28.1 sheet rebuild (developer: floating dropdowns looked like AI slop + rendered under cards):** `SettingsQuickPanels` anchored dropdowns replaced by right-side **slide-over sheets** (`components/ui/Sheet.tsx` — Radix Dialog primitive `@radix-ui/react-dialog`, styled entirely with our tokens; this is what shadcn's Sheet is built on, without importing shadcn). `SettingsHeaderActions` owns the two trigger icons + Sheets; `ProfilePanel`/`NotificationsPanel` lost their local headers (Sheet header owns title/description/icon/close). **Root-cause bugfix shipped with this:** `.page-enter > *` used `animation-fill-mode: both`, which retained `transform: translateY(0)` forever — every page section stayed a permanent stacking context, so absolutely-positioned z-indexed UI (the old dropdowns, and latently Stats/Mood dropdowns) painted in DOM order and got covered by later sibling sections; fixed to `backwards` (identical entrance, no lingering transform). **Persistence:** all auto-save on control change → validated partial-upsert actions (`saveHabitPreferences`, `saveNotificationPrefs`, `saveMoodSettings`, `saveProfile`); each surface keeps `SaveStatus` + sequence counter (only latest save sets status) + shared `SaveStatusLine`; text fields (ProfilePanel) debounce 500ms + flush-on-blur + `lastSavedRef` no-op skip; `saveMoodSettings` revalidates `/settings`, `/mood`, `/calendar`, `/` (flags are read on those pages). Controls keep optimistic local state on failure. **Card-as-state owner:** each card/panel owns local state (no lifted state in SettingsShell). Time fields: DB `HH:MM` 24h, UI 12-hour via `formatTime12`; `TIME_OPTIONS` = 48 entries (30-min steps). **Open:** About link rows have no destinations; Danger/Data buttons no-op (note line under Danger rows says so). `tracker_title`/`welcome_message` schema columns stay dormant (F27 decision). Mood reminder time stored-but-inert (no push — hard rule 7). ---

### Sheet (right slide-over) — REMOVED in UI overhaul

Former `components/ui/Sheet.tsx` (Radix Dialog, F28.1) was deleted in the UI overhaul — settings header panels moved to `PopoverPanel` (below). The `@radix-ui/react-dialog` dep remains installed until confirmed unused elsewhere. Sheet CSS (`sheet-in`/`sheet-out` keyframes + classes) removed from globals.css; `.modal-in` now serves popovers too.

---

### PopoverPanel (shared primitive — UI overhaul)

Files: `components/ui/Popover.tsx`, `components/settings/SettingsHeaderActions.tsx`
Last updated: UI overhaul

| Property | Class / value |
|----------|----------------|
| Primitive | `@radix-ui/react-popover` (headless — focus management, outside-click, Esc, portal, collision-aware side/align) |
| Trigger | circular `h-10 w-10 rounded-full border-border bg-surface` (SettingsHeaderActions pattern); open state via `data-[state=open]` → `border-primary bg-primary text-primary-foreground` |
| Panel | portal Content `w-[22rem] max-w-[calc(100vw-1.5rem)] rounded-xl border border-border bg-surface shadow-pop z-[70]`, `sideOffset={10} align="end" collisionPadding={12}`; animation = `modal-in` (fade-scale — already reduced-motion safe) |
| Panel chrome | header row (Title `text-sm font-semibold` + Description `text-xs text-text-muted` + X close `h-7 w-7`) `border-b border-border px-4 py-3`; body `max-h-[min(70vh,32rem)] overflow-y-auto px-4 py-3` |
| Usage | Settings header: profile icon → `ProfilePanel` + Sign Out button; bell icon → `NotificationsPanel` (bodies unchanged, re-parented) |
| Sign-out home | Settings profile popover (sidebar avatar/UserMenu deleted in the same overhaul) |

**Pattern notes:** replaces the F28.1 slide-over sheets per developer ("a small normal window that appears near the profile icon only"). Same trigger icons, anchored-popover presentation. Radix Popover over hand-rolled for the same reasons as F28.1 (focus/portal/collision handled by the primitive).

---

### Settings — section pane shell (UI overhaul)

Files: `components/settings/SettingsShell.tsx`, `components/settings/SettingsSection.tsx`, section bodies (`AppearanceCard`, `HabitPreferencesCard`, `ManageHabitsCard`, `CategoriesCard`, `DataManagementCard`, `AboutCard`)
Last updated: UI overhaul

| Property | Class / value |
|----------|----------------|
| Layout | `grid lg:grid-cols-[13rem_1fr] gap-8 lg:gap-12` — sticky left nav (`lg:sticky lg:top-6 lg:self-start`) + single content pane; **no cards anywhere in settings** |
| Section nav | horizontal scrollable pill row on small screens (`scrollbar-hide overflow-x-auto`), vertical list ≥lg; items `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm`; active `bg-primary-lightest font-medium text-primary`, idle `text-text-secondary hover:bg-surface-hover` |
| Sections | Appearance · Preferences · Habits · Categories · Data · About (client state `section`, plain useState — no deep links) |
| `SettingsSection` | unboxed section: `h2 text-lg font-semibold` + `text-sm text-text-muted` one-liner + optional header-right `action` slot; body = children (no wrapper, no icon bubble) |
| Rows | existing `SettingsRow` kept (icon bubble + title/caption + control); lists use `divide-y divide-border`; list items flat `py-2` (nested bordered boxes removed) |
| Header | title/subtitle + script accent (`hidden sm:flex`) + `SettingsHeaderActions` (two `PopoverPanel` triggers) |
| Deleted | `DangerZoneCard` (F30 cancelled — dead buttons removed), `SettingsCard` (zero usages after unwrap), About link rows (dead chevrons), decorative gradient filler card, Data Management Reset row (inert) |

**Pattern notes:** developer: "I don't like these cards UI it's like AI slop" → rebuilt on the Linear/Stripe settings pattern (section nav + one unboxed pane). Card border-soup (bordered rows in bordered cards in a bordered grid) and the ragged 3-column masonry with dead whitespace are the specific tells that got removed. Profile/Notifications/Mood stay OUT of the nav — they live in the header popovers (developer choice). Sign-out moved into the profile popover with the sidebar avatar removal. `loadSettingsData` unchanged; sections unmount/remount on switch (auto-save means state reseeds from props).---

### Full theme chrome (Post-F25 UX pass)

Files: `app/globals.css` (theme blocks), source `public/UI palette/{Lavender Sky,mint breeze,peach blossom,Ocean mist}.png`
Last updated: Post-F25 UX pass

| Property | Class / value |
|----------|----------------|
| What a theme rethemes | **Everything chrome:** background, surface, surface-alt, surface-muted, surface-hover, border trio, text trio, primary tints, heat ramp — in light AND dark |
| What stays shared | Status colors: success / warning / error / done / partial / missed + their soft variants — habit meaning never shifts |
| Mint light | bg `#f6fafb` alt `#e8f4f1` border `#d5e5e0` text `#2e3a36`; heat = GitHub exact (unchanged F20) |
| Mint dark | bg `#0f1f1c` surface `#162825` alt `#1e3430` text `#e6f3ef` + GitHub dark heat |
| Peach light | bg `#fff8f6` alt `#fff0e9` border `#efd9d2` text `#5b4a48`; primary retuned orange→coral `#fb6b6b` (sheet) |
| Peach dark | bg `#241a17` surface `#2e2220` alt `#3a2a27` text `#eae2de` primary `#ff9a8f` |
| Ocean light | bg `#f4f8fc` alt `#d9eaf7` border `#dfe7f1` text `#4a6079`; primary retuned sky→blue `#4e8af7` (sheet) |
| Ocean dark | bg `#0e1a26` surface `#162336` alt `#1f3448` text `#e6f1fa` primary `#68b8ff` |
| Rose (no sheet) | light bg `#fff5f6` alt `#ffe9ec`; dark bg `#1f1418` surface `#2b1b21` alt `#3a242c` — neutrals derived by analogy |
| Dark heat ramps | every theme now has one (was mint-only; others fell back to lavender purple in dark) |
| Block structure | `[data-color-theme="X"]` = vivid primary both modes → `[data-theme="light"][data-color-theme="X"]` = light chrome + tints + heat → `[data-theme="dark"][data-color-theme="X"]` = dark chrome + dark primary + dark heat |
| New reference themes | **Sage / Clay / Lagoon / Berry / Orchid** added alongside (the five original themes are untouched). Accents sampled from the reference mock's own theme-switcher chips: sage `#aec69f`, clay `#a85d3c`, lagoon `#6fcac3`, berry `#ab5268`, orchid `#b8a6eb`. Unlike the original five they override the **full chrome** (near-neutral page tinted a whisper toward the accent) because the reference renders a neutral page with one saturated accent |
| Reference dark bgs | sage `#1c1d1c`, lagoon `#0e1d28`, orchid `#171624` |
| Reference light bgs | clay `#f3eee4`, berry `#f6eeee` |
| Primary ink | `--color-primary-on` = deep ink `#1e1b4b` on the pastel light primaries, `#ffffff` on the saturated ones (clay, berry) — the reference's light-mode buttons carry white text on the saturated accent |
| Switch knob | `--color-switch-knob` flips with the mode (deep ink light / white dark) so it clears 3:1 against both tracks in all ten combinations |
| Accessibility | all text pairings clear WCAG AA 4.5:1; knob and heat cells clear 3:1 — verified by DOM probe over every theme × mode |


**Pattern notes:** Components are token-only (hard rule 9), so retheming the CSS variables rethemes the entire app — sidebar, cards, buttons, nav, charts, modals — with zero component changes. Status/semantic colors deliberately NOT themed. Swatch picker dots unchanged. `body` has a 0.25s background/color transition so theme flips feel soft.---

### Data entrance animations (Post-F25 UX pass; reveal rebuilt Post-F25.5)

Files: `components/ui/RevealAreaShape.tsx`, chart components
Last updated: Post-F25.5

| Property | Class / value |
|----------|----------------|
| Recharts standard | Bar/Pie get `isAnimationActive animationDuration={900–1150} animationEasing="ease-out"`; **swept Area charts use `isAnimationActive={false}` + `dot={false}` + `shape={makeRevealAreaShape(...)}`** — all motion is owned by the custom shape |
| **Area reveal (curve-only)** | `makeRevealAreaShape({ dot })` (components/ui/RevealAreaShape.tsx) wraps Recharts' public `AreaRevealShape` in clipPath groups and renders dots INSIDE the same clips — axes/grid/labels are separate layers and appear instantly (developer: animate just the curves, not the axis). One wipe front, easeOutCubic via RAF |
| Entrance | Mount / period switch / month nav (wrapper `key` on period+bounds remounts the chart): full left-to-right reveal of curve + fill + dots, **3s** |
| Data change (band reveal) | Shape self-detects the changed point index by diffing consecutive `points` values — **no extra props needed**. A local band [changed−1 .. changed+1] animates: new segment + dot draw in behind a wipe front while the old segment erases ahead of it; the rest of the line never moves. **1.8s**. Removals use the same front (segment retracts). Wrapper key must NOT include an entry counter — remount would replay the full entrance |
| `prefers-reduced-motion` | shape skips the RAF wipe (band set to null → curves render plain) |
| `.heat-cell` | `soft-fade-in` 0.45s; heatmap cells delay `min(col*10ms, 400ms)` |
| `.cal-cell` | `fade-scale-in` 0.45s; month grid delay `row*30ms + col*15ms` (row cascade) |
| `.rate-bar` | `grow-x` (scaleX 0→1, origin left) 0.9s; habit-rate rows `i*80ms` |
| `.ring-draw` | Home ProgressRing stroke-dashoffset draw 1.1s; SVG circle `key={percent}` remounts on change; CSS vars `--ring-circumference` / `--ring-offset` |
| `.modal-backdrop` / `.modal-panel` | fade 0.2s / rise+scale 0.28s — NoteModal, HabitFormModal, NotesCards View All (DayModal deleted in revert) |
| `.chart-dot` | legacy fade-scale utility, currently unused (kept) |

**Pattern notes:** Area charts (mood graph + streak history) no longer use the `.chart-sweep` CSS clip — that class and its keyframes are deleted. The reveal shape renders `AreaRevealShape` (public Recharts 3.9+ export) twice during a band animation: old points clipped to exclude the growing band (C-shaped polygon), new points clipped to the growing rect — a single wipe front separates them so no double-curve artifact. Dots come from the shape's `dot` callback (per-point colors), not Recharts' `dot` prop. Custom props do NOT reach a Recharts shape — the factory closure carries config instead.---

### HabitIcon — custom SVG habit glyphs (Post-F25.2)

Files: `components/ui/HabitIcon.tsx`
Last updated: Post-F25.2

| Property | Class / value |
|----------|----------------|
| Pattern | **No background circle** (developer: filled tiles looked flat) — hand-drawn stroke SVG (viewBox 24, strokeWidth 1.8, currentColor) with a vivid per-glyph color + **subtle glow** (`drop-shadow(0 0 2px color-mix(in srgb, currentColor 40%, transparent))` — reduced from a double full-color drop-shadow per developer); system emoji only when no glyph matches |
| Glyph set (18) | sunrise, alarm, dumbbell, eye, growth, toothbrush, shower, journal, water, moon, book, apple, lotus, walk, phone-off, leaf, flame, crown |
| Mapping | `glyphForHabit(emoji, name)`: emoji map first (💧→water, 🌙→moon, 💪→dumbbell, …), then name keywords (/water|drink/, /sleep|night/, /exercise|gym/, /brush|teeth/…); no match → bare emoji fallback (no tile) |
| Colors | per-glyph token classes (theme-aware): water/shower `text-info-strong`; toothbrush `text-info`; moon `text-primary`; journal `text-secondary`; sunrise/book/walk/crown `text-warning-strong`; alarm/lotus/flame `text-error`; dumbbell/phone-off `text-error-strong`; eye/growth/apple/leaf `text-success-strong` |
| Glyph size | svg = size×0.72 (larger now that there is no circle padding) |
| API | `<HabitIcon emoji={habit.emoji} name={habit.name} size={32} className?/>` — circle diameter = size; glyph = size×0.56 |
| Sizes in use | Habits grid label 32; Home Today's Habits 40; Calendar Day Details 30; Settings manage list 36; Home stat cards 🔥/👑 44 |
| BrandLeaf | same file — two-leaf sprig in currentColor for the sidebar logo bubble (`text-primary`, bubble h-12 w-12 rounded-xl bg-primary-lightest) |

**Pattern notes:** new habit-facing UI MUST use `HabitIcon`, never raw `{habit.emoji}` — one glyph set everywhere (developer: "custom SVG logos for everything, similar to mood page"). DB `emoji` column unchanged — mapping is render-time, unknown emojis keep working via fallback. Decorative text emoji inside script copy (💜 etc.) are typography, not icons — leave them.---

### Settings — Manage Habits card (Post-F25.2)

Files: `components/settings/ManageHabitsCard.tsx`, `lib/settings-data.ts` (+`SettingsHabit`, habits query), `components/settings/SettingsCard.tsx` (+`action` slot), `actions/habits.ts` (+`/settings` revalidation)
Last updated: Post-F25.2

| Property | Class / value |
|----------|----------------|
| Card | `SettingsCard` icon ListTodo, title "Habits", header `action` = secondary sm "+ Add Habit" button |
| Row | `flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5` — `HabitIcon` 36 + name `text-sm font-medium` + category/archived caption `text-xs text-text-muted`; Pencil (edit) + Trash2 (delete) round icon buttons `h-7 w-7`, trash hover `bg-error-light text-error` |
| Archived rows | opacity via `text-text-muted` name + "Archived" caption; sorted to bottom with actives |
| Edit | opens existing `HabitFormModal` in edit mode (update + Archive/Restore + two-step delete all live there) |
| Delete | inline two-step confirm strip (CategoriesCard pattern): `border-error/40 bg-error-light p-3` + Keep/Delete buttons; copy warns completions are removed too |
| Add | same modal in add mode; `onLocalMutate` updates list; render-phase re-sync from revalidated props (HabitsView pattern) |
| Loader | `loadSettingsData` Promise.all now includes habits (id, name, emoji, description, category_id, sort_order, active by sort_order) → `SettingsHabit[]` |
| Placement | Settings col1, directly under Habit Categories |

**Pattern notes:** `SettingsCard` gained an optional `action` slot (header-right control) — title row is `flex-1` so action right-aligns. Habit mutations revalidate `/settings` too (was `/habits` + `/` only) so the card's props refresh after modal edits.---

### Floating card polish (Post-F25.3)

Files: `components/ui/Card.tsx`, `components/home/StatCards.tsx`
Last updated: Post-F25.3

| Property | Class / value |
|----------|----------------|
| Card default | `+ transition-shadow duration-200 hover:shadow-pop` — every card deepens its shadow on hover (no layout shift; safe with inputs and chart tooltips) |
| KPI cards (Home StatCards ×4) | also `hover:-translate-y-0.5` via local `KPI_CARD` const (`transition-all duration-200`) — glanceable cards lift slightly; chart/settings cards deliberately do NOT translate (would jitter while reading tooltips / typing) |

**Pattern notes:** developer asked to "adjust KPI / floating cards for better UI UX" — delivered as elevation-on-hover everywhere + lift-on-hover for the KPI row only. No radius/padding changes (design-literal `rounded-xl` + card paddings stay).---

### Settings - Data export / import (Feature 29)

Files: `lib/data-export.ts`, `app/api/data/export/route.ts`, `actions/data.ts`, `components/settings/DataManagementCard.tsx`
Last updated: Feature 29

| Property | Class / value |
|----------|----------------|
| Export / Backup buttons | same-origin programmatic anchor to `/api/data/export` (+ `?backup=1` for Backup) — SDK cookies ride the navigation; route streams JSON with `Content-Disposition: attachment` |
| Import flow | hidden `<input type="file" accept="application/json,.json">` → `parseExportFile` (client zod) → pending-file state → inline confirm strip → `importUserData` Server Action |
| Confirm strip | CategoriesCard delete pattern: `li` `rounded-lg border border-error/40 bg-error-light p-3`; summary line = "profile settings · N categories · N mood levels · N habits · N completions · N mood entries · N notes — merges into your account; nothing is deleted."; Cancel (secondary) + Import (`variant="danger"`) |
| Status line | below the row list: success `text-success-foreground` ("Import complete — {summary}."), error `text-error-foreground` prefixed "Import failed — " with `role="alert"`; idle = hidden |
| Row description swap | while a file is pending, the Import row's caption becomes `Selected “{fileName}”` |
| Reset row | **removed in UI overhaul** (F30 cancelled — Reset All Data row deleted along with Danger Zone) |

**Pattern notes:** file format is versioned (`EXPORT_VERSION = 1` in `lib/data-export.ts`) — import rejects other versions with a readable error before any write. Payload = camelCase envelope over all 7 user tables (`profile` nullable). Import is **merge-upsert, never deletes**: parents (habits/categories) upsert by `id`, date-keyed tables (completions `habit_id,date`; mood entries + notes `user_id,date`) by natural key, mood levels by `user_id,value` (an account always has its own seeded set — id-matching would duplicate the scale on cross-account import), profile onto `auth.uid()`. Chunked 500 rows/request; `user_id` forced to `auth.uid()`; server re-validates with the same zod schema; `revalidatePath` on all 6 app routes. Export/Backup are one payload — Backup only changes the filename (`habit-tracker-backup-YYYY-MM-DDTHH-MM-SS.json`).---

### Habits — today highlight + Habit Graph (post-overhaul)

Files: `components/habits/HabitGridCard.tsx`, `components/habits/HabitGraphCard.tsx`, `components/habits/HabitsView.tsx`, `lib/stats.ts` (`buildHabitMonthSeries`, `HabitMonthPoint`)
Last updated: post-overhaul habits pass

| Property | Class / value |
|----------|----------------|
| Today header pill | `h-6 min-w-6 rounded-md bg-primary text-primary-foreground` (rounded RECT, not the old full-circle) |
| Today column cells (unset) | `border-primary bg-primary-lightest/40` — solid lavender outline + faint fill on every habit-row cell in the today column (was tint-only) |
| Today column notes cell | no-note cell switches `border-dashed` → `border-solid border-primary bg-primary-lightest/40`; has-note cell unchanged (`border-primary bg-primary-lightest`) |
| Status-filled today cells | keep solid done/partial/missed fill (no outline — purple border on green/yellow/red clashes; column reads via pill + outlined neighbors) |
| Habit Graph card | below the grid, full width; title "Habit Graph" + dynamic subtitle "Daily completion — {Month} {year}."; Recharts AreaChart h-64, gradient `habitFill` primary 0.3→0.02, `makeRevealAreaShape` (same curve-only 3s entrance as mood/streak; local band animates on cell toggle), dots r=5 every point (activeDot r=7), Y domain [0,100] ticks 0/25/50/75/100 `%`, X ticks 1/7/14/21/28 (+ last day when ≥29) |
| Graph data | `buildHabitMonthSeries(statuses, activeIds, year, month, todayKey)` — weighted done=1/partial=0.5 over ACTIVE habits only (archived excluded); future days of current month = null (gap); past unlogged = honest 0; computed client-side in HabitsView `useMemo` from state already loaded (toggles update the chart live) |
| Graph dots | multi-colored dots matching the Mood Graph spectrum and size: 100% → `var(--color-success)` (Mint), ≥80% → `var(--color-info)` (Sky Blue), ≥60% → `var(--color-warning)` (Gold), ≥40% → `var(--color-primary)` (Lavender), >0% → `var(--color-error)` (Coral), 0% → `var(--color-border-strong)` (Muted); null (future) → no dot; r=5 with surface stroke; activeDot r=7 |
| Graph tooltip | key date + colored dot badge + % + "{done} done · {partial} partial of {total} habits"; suppressed on null (future) points; primary dashed cursor line |
| Graph empty states | no active habits → "Add a habit to see your progress."; viewed month entirely future → "This month hasn't started yet." |
| Entrance replay | wrapper `key={year-month}` remounts on month nav (mood pattern) |

**Pattern notes:** highlight rebuilt to match the developer's reference image (filled header pill + outlined column cells) — the F25.2 tint-only treatment was replaced. Graph is the habits-page analog of the Mood Graph: same card chrome, same reveal animation, same weighting math as Stats. Loose tooltip typing follows the MoodGraphCard precedent (Recharts `TooltipProps` friction).

---

### Phase 8 — Mobile Nav, Sticky Habits, and Snappy Check-ins

Files: `components/layout/MobileNav.tsx`, `components/layout/MobileHeader.tsx`, `components/layout/Sidebar.tsx`, `components/habits/HabitGridCard.tsx`, `components/home/TodayHabits.tsx`, `components/calendar/DayDetailsCard.tsx`
Last updated: Phase 8 UI/UX Enhancement Sprint

| Component / Feature | Pattern & Tokens |
|---------------------|------------------|
| Mobile Header | `sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-2.5 backdrop-blur-md md:hidden` — brand leaf logo, dark mode switch, sign out button |
| Mobile Bottom Nav | `fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 px-2 py-2 backdrop-blur-md md:hidden` — 6 items with active indicator `bg-primary-lightest text-primary` |
| Desktop Sidebar | `hidden md:flex` on `<aside>` — cleanly disappears on mobile (< 768px) and adapts main padding via `md:pl-[var(--sidebar-width)]` |
| Sticky Habit Column | `sticky left-0 z-10/20 bg-surface pr-2.5` on header, habit rows, and notes row — keeps habit names visible when horizontally scrolling long months |
| Interactive Home Check-ins | Any week day is clickable (not just today); weekday headers (`Su`, `Mo`, `Tu`, ...) aligned above circles; optimistic client updates for instantaneous tactile feel |
| Calendar Checkbox Colors | `bg-success` (done), `bg-warning` (partial), `bg-error` (missed) — aligned exactly with Home and Habits page token system |
| Mood vs Habit Correlation | Pure statistical rollup in `lib/insights.ts` correlating habit completion with elevated mood average scores |

---

### Marketing landing page (Phase 13)

Files: `app/(marketing)/page.tsx`, `components/landing/{LandingHeader,LandingHero,LandingResults,LandingHowItWorks,LandingCta,LandingFooter,LandingHabitGrid,LandingHeatmap,Reveal}.tsx`, `components/mascot/LumiMascot.tsx`
Last updated: Phase 13

The landing page owns `/`; the app's Home moved to `/home` (`proxy.ts` sends
signed-out visitors to `/login`).

| Property | Class / value |
|----------|----------------|
| Route split | `app/(marketing)/page.tsx` = `/` (public, static) · `app/(app)/home/page.tsx` = `/home` (protected) |
| Headline | Outcome-led: "Build the version of you that shows up." — a result, not a feature list |
| Hero visual | `LandingHabitGrid` — the REAL habit-grid cell language (same token colours, same ✓ / ~ / ✗ glyphs) with a staggered spring entrance |
| Proof | `LandingHeatmap` — the same GitHub-contribution ramp the Stats page uses, not a decorative mock-up. **No testimonials or user counts** (there are no real users — fabricating them would be dishonest) |
| Results layout | Bento grid, not a uniform 3-col grid: the flagship result takes a 2×2 tile, supporting ones sit beside it. Layout signals priority |
| Scroll reveal | `Reveal` — fades + rises as each block enters the viewport (`once: true`), staggered per block |
| Hover | Tiles lift `-translate-y-0.5` on a spring; the CTA row and swatches have their own hover states |
| Mascot | `LumiMascot` appears in **4 places** with distinct moods + messages: hero (`happy`), results grid (`supportive`), how-it-works (`streak`), closing CTA (`celebrate`). New `message`/`caption` props override the random quote so each placement has its own copy |
| Mascot faces | `supportive` and `streak` got their OWN faces (previously both fell through to the default) so the four placements look different |
| Header | Sticky, transparent over the hero → frosted `bg-background/80` once scrolled |

**Pattern notes:** The page is token-only (hard rule 9) — every colour comes
from the app's existing tokens, so it re-themes with the user's chosen
palette. The dark and light chrome of the NEW themes is what makes this
work: a near-neutral page with one saturated accent, so the product visual
pops the way it does in the reference.

### Auth — tabs + remembered account (Phase 13)

Files: `app/(auth)/login/page.tsx`, `lib/remembered-account.ts`, `actions/auth.ts`, `app/api/auth/callback/route.ts`
Last updated: Phase 13

| Property | Class / value |
|----------|----------------|
| Tabs | `Sign in` / `Create account`, with a `layoutId` pill that slides between them (same pattern as the Settings nav) |
| Panel switch | `AnimatePresence mode="wait"` — the panel slides in from the right, matching the app's page/section transitions |
| Remembered account | Shown when a cookie from a PREVIOUS sign-in exists: avatar initial, **masked** email (`ad••••@example.com`), provider name, a "Continue" button and a "Use a different account" link |
| Storage | Cookie `ht_last_account` (not localStorage — the OAuth round-trip leaves the app, so a cookie is the only store that survives the hop) |
| Written by | The OAuth callback route, which knows the email and the provider the visitor picked (`ht_oauth_provider` short-lived cookie) |
| Read via | `useSyncExternalStore` — the server snapshot is null (no cookie server-side) so there is no hydration mismatch |
| Privacy | The FULL email is never rendered — only `maskEmail()`. `clearRememberedAccount()` wipes the cookie |
| Sign-up | Both tabs use Google / GitHub — OAuth creates the account on first use, so there is no separate form and no extra friction |

**Pattern notes:** The SDK has no "list accounts" call, and it should not
have one — a list of every account that ever signed in on the device would
leak other people's addresses. The app remembers exactly ONE account: the
one THIS browser used last, locally.

---

### Phase 10 — Correctness & Contrast Pass (Token split, Aurora, motion primitives)


Files: `app/globals.css`, `app/(app)/layout.tsx`, `components/layout/AuroraBackdrop.tsx`, `components/ui/{Card,Button,Switch,StatusPop,SlidingIndicator}.tsx`, `components/ui/RevealAreaShape.tsx`, `lib/{stats,insights,calendar}.ts`, `lib/{home-data,stats-data,calendar-data}.ts`, `actions/{moods,habits,categories,settings}.ts`
Last updated: Phase 10

#### Colour tokens — fill vs type

`--color-primary` is a soft pastel. It is fine as a fill but only **2.7:1** on white, so it must never be used for type. Two new tokens split the roles:

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--color-primary-text` | `#6d28d9` (lavender) / `#047857` (mint) / `#b91c1c` (peach) / `#1d4ed8` (ocean) / `#be123c` (rose) | `#c4b5fd` / `#5dd1b0` / `#ffb4a7` / `#a7d8eb` / `#fecdd3` | **type** on a light surface. Replaces every `text-primary` (57 sites). Verified ≥ 4.5:1 on all four light surfaces of every theme. |
| `--color-primary-on` | `#1e1b4b` | `#1e1b4b` | foreground for content placed ON a `bg-primary` fill (primary button, filled chips). ≥ 4.8:1 on every theme's primary in both modes. |
| `--color-switch-knob` | `#1e1b4b` | `#ffffff` | Switch knob. Flips with the mode because no single colour clears 3:1 against both the pale on-track and the dark off-track. |
| `--color-danger-button` | `#991b1b` | `#7f1d1d` | destructive button fill, with `--color-danger-button-foreground: #ffffff` (8.3:1 / 10.0:1). |
| `--color-text-muted` (light) | `#586a84` / `#5d716c` / `#7b6965` / `#566881` / `#7a646d` | unchanged (`#94a3b8`) | was `#94a3b8` = **2.57:1** on white and used 118×. Darkened per theme, hue preserved. |

**Rule:** `text-primary` → `text-primary-text` for type. `text-primary` stays for icons, borders, rings, chart strokes.

#### `dark:` variant

`@custom-variant dark (&:where([data-theme="dark"] *));` — the app's theme is an explicit user choice on `<html>`, NOT the OS preference. Tailwind v4's default `dark:` is `prefers-color-scheme`, so every `dark:` utility used to follow the operating system instead of the app's Light/Dark toggle.

#### Ambient aurora

`components/layout/AuroraBackdrop.tsx` — the orbs must live inside a stacking context that also contains the page content. The shell provides it with `isolate` on the wrapper; the orbs are `z-0` and the content wrapper is left at `z-index: auto` so in-page modals (z-50) still resolve against the same shared context and paint above the sidebar. Previously the wrapper was `position: relative; z-index: auto` (no stacking context) and the orbs were `-z-10` — they painted at CSS step 2 while the wrapper's opaque `bg-background` painted at step 6, so **the orbs were invisible on every page**. Drift is `transform`-only (`aurora-drift-1/2/3`, 46–58s) so the blurred layer is never re-rasterised.

#### New primitives

| Primitive | Pattern |
|-----------|---------|
| `app/(app)/error.tsx` | Branded error boundary with a Retry button and the error digest. Replaces Next's default error screen. |
| `components/ui/StatusPop.tsx` | Wraps a status glyph and replays the `status-pop` keyframe (scale .72 → 1.14 → 1, 280ms) **only on a genuine status change** — a month grid holds hundreds of cells and a mount-time pop is noise. Implemented by bumping a `key` so the span remounts and the CSS animation restarts. |
| `.modal-in` class | The keyframes existed but the class rule never did — Settings popovers opened with no motion. Now defined alongside `.modal-panel`. |
| ~~`components/ui/Skeleton.tsx`~~ | **DELETED in Phase 13** — the route skeleton was replaced by the route transition. |
| ~~`app/(app)/loading.tsx`~~ | **DELETED in Phase 13** — navigation now cross-fades instead of flashing a placeholder grid. |


#### Card

`Card` no longer carries a hover treatment by default (it advertised interactivity on every non-clickable card). Opt in with `interactive`. `transition-all` → `transition-[box-shadow,border-color,transform]` — `transition-all` over a `backdrop-blur-md` animates layout properties and forces a full blur re-composite on every hover.

#### Chart reveal shape

`makeRevealAreaShape` returns a React **component**. Calling it during render produced a new component type every render → React remounted the shape → the entrance flag reset → the 3s wipe restarted on every parent re-render. Callers now hoist it to module scope (HabitGraphCard, StreakHistoryCard) or memoise it with `useCallback` + `useMemo` (MoodGraphCard, which captures `levels`). The animation itself is driven by direct DOM writes on the clip `<rect>`/`<polygon>` inside the RAF loop, so a 3s entrance costs 2 React renders instead of ~180.

#### Motion tokens

| Class | Duration | Notes |
|-------|----------|-------|
| `.status-pop` | 280ms `cubic-bezier(0.22,1,0.36,1)` | core check-in interaction |
| `.aurora-orb-1/2/3` | 46/58/52s infinite | `transform`-only drift |
| `.modal-in` | 280ms | popover entrance |

All of the above are covered by the `prefers-reduced-motion` block. The
route transition and the sliding nav pills are `motion` components and are
covered by `<MotionConfig reducedMotion="user">` instead.


---
---

### Phase 11 — One Design Language (shared primitives)

Files: `components/ui/{Card,ProgressRing,Modal,StatTile,ScriptQuote,SaveStatusLine,MonthNav,StatusPop}.tsx`, `components/layout/{DarkModeToggle,nav-items,AuroraBackdrop}.tsx`
Last updated: Phase 11

The app had three card languages, three progress rings, three month navigators, three
modals, two nav definitions, two dark-mode toggles, two save-status lines, two stat-tile
shapes and six script quotes. Each is now ONE shared primitive.

| Primitive | Surface / behaviour |
|-----------|---------------------|
| `<Card>` | **The** card: `rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md p-5 shadow-card` + `transition-[box-shadow,border-color,transform] duration-200`. `interactive` prop opts into the lift-on-hover. Every card in the app renders through it. |
| `<ProgressRing>` | One ring for all three former implementations. `size` / `stroke` / `variant="gradient\|solid"` / `hideAtZero` / `ariaLabel`. Uses the `.ring-draw` animation and `--ring-circumference` / `--ring-offset` CSS vars. The Calendar ring previously had **no** draw animation — it does now. |
| `<Modal>` | Radix Dialog. Focus trap, focus restore, Escape, outside-click dismiss, scroll lock, portal, `aria-labelledby` + `aria-describedby` — all of which the three hand-rolled modals lacked. `motion` spring entrance, `useReducedMotion` respected. `size="sm\|md\|lg"`, `footer` slot. |
| `<StatTile>` | One tile: icon bubble + value + label + optional caption + optional signed delta. Used by Home Quick Stats and the Stats KPI row. |
| `<ScriptQuote>` | The decorative script quote. `size="sm\|md\|lg"`, `align`. One colour token (`text-primary-text`, which re-themes with the colour theme — the old `text-accent-foreground` stayed violet in Mint/Ocean/Peach). |
| `<SaveStatusLine>` | One status line: `idle` / `saving` / `saved` / `error` + optional `error` detail. AppearanceCard now uses it instead of its private copy. |
| `<MonthNav>` | One month navigator: prev chevron, title, next chevron, optional Today. `as="h1\|h2\|span"`, `title` override, `titleClassName`. Exports `<TodayButton>` so the right-aligned variant (Calendar) matches the inline one (Habits). |
| `<DarkModeToggle>` | One dark-mode switch (was duplicated in the sidebar and the mobile header). |
| `components/layout/nav-items.ts` | `NAV_ITEMS` + `isActivePath(pathname, href)` — one nav definition for the sidebar and the mobile bar. |

**Removed:** `components/habits/MonthNav.tsx`, `components/settings/SaveStatusLine.tsx`,
the `.modal-backdrop` / `.modal-panel` CSS classes (the hand-rolled modals are gone), and
`ManageHabitsCard`'s duplicate global Escape listener (Radix owns it now).

**Notes:**
- Cards that intentionally differ from the surface recipe: the floating chrome
  (`<Modal>`, `<Popover>`) and the tinted sub-tiles inside a card (Home Quick Stats) and the
  decorative gradient panels (`bg-primary-lightest`, `bg-surface-muted`).
- `<Card>` is `p-5`; the previous base was `p-6` and the hand-rolled cards were `p-5`. Pass
  `className="p-4"` to tighten (the Stats KPI row does).
---

### Phase 12 — Motion system (motion as the single animation driver)

Files: `app/globals.css`, `app/layout.tsx`, `components/layout/MotionProvider.tsx`, `components/ui/{Modal,CountUp,MoodFacePop}.tsx`, `components/settings/SettingsShell.tsx`, `components/habits/HabitGridCard.tsx`, `components/habits/HabitsView.tsx`, `components/stats/HabitConsistencyCard.tsx`, `components/mood/MonthCard.tsx`
Last updated: Phase 12

`motion@14` had been installed in Phase 9 and never imported. It is now the single
driver for everything that moves, alongside the CSS keyframes that remain for
decorative effects.

| What | Mechanism | Notes |
|------|-----------|-------|
| Modal enter **and exit** | `AnimatePresence` + Radix `forceMount` | `Dialog.Root` is hard-coded `open`; `AnimatePresence` owns the lifecycle so the exit plays before the tree unmounts. Verified: the dialog is still in the DOM 60 ms after close, then unmounts. |
| Count-up numbers | `<CountUp>` (RAF, ease-out cubic, 700 ms) | Home progress %, both streak counts, Quick Stats tiles. The animated text is `aria-hidden`; an `sr-only` sibling carries the final value so AT hears the number once, not 60×. |
| Mood face spring | `<MoodFacePop>` | Cross-fades and springs the face when the *value* changes. Used on the Mood page's date strip (live state). `MoodFace` itself stays a static SVG for the graph axis. |
| Heatmap cascade | `.heat-cell` + per-cell `animationDelay` | The `heat-cell` class existed but was **never applied**. Monthly matrix: diagonal wave (`row*22 + col*7`, capped 700 ms). Annual grid: GitHub-style, one week column at a time (`week*11 + row*3`). |
| Heatmap tooltip | CSS `transition-[left,top]` 120 ms | The position is now computed in the mouse handler (before the tooltip mounts) so the first placement is instant and later ones glide. The tooltip's measured size is cached and the tooltip is width-bounded (`max-w-64`) so long habit names no longer produce an unbounded bubble. |
| Habit reorder | `motion` `layout` (FLIP) | Rows glide to their new positions instead of teleporting. |
| Settings section switch | `AnimatePresence mode="wait"` + `layoutId` | The pane cross-fades and a single pill **slides** between nav items instead of the background jumping. |
| Drag-over re-render storm | state guard | `dragover` fires ~60×/s; the handler now only writes state when the hovered id actually changes (it was re-rendering the whole 31-column grid on every event). |

#### Cascade layers

The custom classes used to be **unlayered**, so they silently beat every Tailwind
utility (the Toaster's `border-border shadow-pop` were dead because `.glass-card`
won). They now live in explicit layers:

- `@layer components` — structural / decorative classes. Utilities may override.
- `@layer utilities` — the neon `glow-*` classes, which must beat the base card's
  `shadow-card` and the cells' `shadow-xs`.

#### Reduced motion

Two switches, because CSS and JS animate differently:

- `globals.css` — a global `prefers-reduced-motion: reduce` kill-switch
  (`animation-duration`, `animation-iteration-count`, `transition-duration`,
  `scroll-behavior` → `!important` on `*`). Previously only a named list of
  classes was suppressed: the mascot still floated forever, the stars still
  pulsed, and every Tailwind `transition-*` still ran.
- `components/layout/MotionProvider.tsx` — `<MotionConfig reducedMotion="user">`
  wraps the app. `motion` drives transforms from JavaScript, so the CSS
  kill-switch cannot reach it.

#### Animation fill-mode rules learned here

- A CSS animation with `both`/`forwards` keeps its final `transform` applied
  forever, and a CSS animation outranks the `hover:scale-*` utility — the hover
  pop would be dead. `.heat-cell` uses `backwards` for exactly this reason.
- `backwards` (not `both`) is also why `.page-enter > *` doesn't leave every page
  section as a permanent stacking context.

---

### Phase 13.1 — Smooth scroll, one shared heatmap, quick theme swatches, Lumi in the app

#### Smooth in-page scroll

| Pattern | Where | Notes |
|---------|-------|-------|
| `scroll-behavior: smooth` on `html` | `app/globals.css` base block | The landing header's "Results" / "How it works" anchors now glide instead of jumping. Native smooth scroll eases in and decelerates to a stop — exactly the feel asked for. The global `prefers-reduced-motion` kill-switch already forces `scroll-behavior: auto !important`, so reduced-motion users still get an instant jump. |
| `scroll-padding-top: 5rem` on `html` | `app/globals.css` | The landing header is sticky and ~64px tall. Without this, an anchor target scrolled flush to the top and hid UNDER the header. Now the section lands 80px down, clear of the chrome. |

#### One heatmap, two surfaces (shared primitive)

`components/ui/ContributionHeatmap.tsx` — the contribution grid is now a single
implementation shared by the marketing page and the Stats page, so the real
product can never drift from the promise.

| Element | Rule |
|---------|------|
| Geometry | 7 weekday rows × one column per week (GitHub orientation), `grid-auto-flow: column` + explicit `gridTemplateRows: repeat(7, …)` |
| Cell | `aspect-square rounded-[2px]`, colour via inline `var(--color-heat-0…4)` (NOT Tailwind `bg-heat-*`) |
| Gap | `gap-[3px]` (both axes) |
| Entrance | `motion` `whileInView` (once), per-cell delay `(row * 0.012) + (col * 0.02)` — a diagonal wave |
| Hover | `whileHover` scale 1.25 (motion owns the transform, so a Tailwind `hover:scale-*` would be dead) |
| Panel | `ContributionHeatmapPanel` = scale label left, tracked count right (`font-medium text-primary-text`), grid, `Less ▪▪▪▪▪ More` legend |
| Exported pieces | `ContributionHeatmap`, `ContributionHeatmapPanel`, `HeatmapLegend`, types `HeatLevel` / `ContributionCell` / `ContributionCellInfo` |

The Stats card's **Consistency** tab is the landing panel filled with the user's
own history (`buildConsistencyWindow` in `lib/stats.ts`, 16 weeks = 112 days,
one level per day). "N days tracked" is the real count of days in the window
with at least one check-in. The old 52-week "Annual Activity" tab was folded
into this view (its three metrics — check-ins, active days, avg daily rate —
sit above the panel); the per-habit monthly matrix survives as the **By Habit**
tab.

#### Quick theme swatches

`components/ui/ThemeSwatches.tsx` — five small rounded squares
(`h-4 w-4 rounded-[4px]`, `bg-swatch-*`) that switch the colour theme via
`useTheme().setColorTheme` (persisted to the profile). Active theme gets
`ring-2 ring-primary/70`.

Placement rule: **the swatches float ABOVE the card, right-aligned — never
inside it.** They sit above the app Home "This Week" card (right column of
`app/(app)/home/page.tsx`) and above the landing hero's product visual
(`LandingHero`). The quick set is the five reference themes — Sage, Clay,
Lagoon, Berry, Orchid — not all ten.

#### Lumi in the app

`LumiMascot` is now on five app surfaces, one per mood, always with
`showDialogue={false}` so the speech bubble never eats layout until tapped:

| Page | Mood | Message |
|------|------|---------|
| Home (`Greeting`) | auto (data-driven) | existing |
| Stats | `streak` (with the streak badge) | streak-aware |
| Mood | `supportive` | "Bad days count too…" |
| Calendar | `idle` | "Every square you fill is a day you showed up." |
| Habits | `celebrate` | "One more habit, one more reason to show up." |
| Settings → About | `sleepy` | "That is everything for today." |

Placement rule: the mascot goes in the **page header's right-hand group**
(next to the script quote), not inside a narrow sidebar column — the speech
bubble is up to 320px wide, which does not fit a 300px sidebar.

---

### Phase 13.2 — Tooltip portal, heatmap-only card, settings honesty, theme clarity

#### Overlays must be portalled

`position: fixed` inside a glass card is positioned by the CARD, not the
viewport: `backdrop-filter` (and `filter`, `transform`, `will-change`) make
an ancestor the containing block for fixed descendants. The heatmap tooltip
was therefore landing hundreds of pixels away from the cell and slipping
under neighbouring cards.

**Rule: any fixed-position overlay inside a card must be rendered through a
portal** (`createPortal(…, document.body)`), exactly as `Modal` (Radix
Dialog) and `PopoverPanel` (Radix Popover) already do. The heatmap tooltip
now portals to the body with `z-[70]`, `w-max` (so the date does not wrap
into a four-line bubble) and the same 120 ms glide.

#### The Stats heatmap card is ONE view

The "By Habit" tab and the "GitHub Style" badge are gone. The card is now
just the consistency heatmap: title, three metrics (check-ins / active days
/ avg daily rate) and the shared contribution panel. The per-habit monthly
matrix and its builder (`buildStatsHeatRows`, `StatsHeatRow`, `HeatCell`)
were deleted — dead code does not stay.

#### Settings: every control must do something

A full audit of every Settings control (persisted AND read AND changing
behaviour) found ten switches that saved a value and changed nothing. They
were **removed**, not left as decoration:

| Removed | Why |
|---------|-----|
| Habit Reminders, Daily Summary, Mood Reminder, Streak Alerts, Missed Habit Reminder | No notification system exists anywhere — no service worker, no scheduler, no `showNotification`. The whole "Notifications" popover became the **Mood** popover (`MoodPanel.tsx`, `Smile` icon). |
| Mood Reminder (time select) | Same — nothing ever read it. |
| Default Reminder Time, Default Frequency | Stored on the profile, read by no surface. |
| Show Completed Habits, Compact Habit View | Stored, read by no surface. The loader even returned them in an orphaned `prefs` object that no component consumed. |
| "A little note about you" (bio) | Saved but never displayed anywhere. The profile panel now has the name only. |
| The disabled "Custom" colour swatch | Chrome for a theme that does not exist (`custom` was removed from the `ColorTheme` type, the provider, the action allow-list and the export schema). |

What stayed, because it demonstrably works: theme mode, the ten colour
themes, **Week starts on** (read by Home, Habits, Stats and Calendar),
**Enable mood notes** (read by Mood and Calendar), **Show mood on
calendar** (read by Calendar), the profile name (drives the Home
greeting), sign out, and the whole Habits / Categories / Data CRUD.

The columns stay in the schema and in the export envelope — the export is a
backup, and an old file must still import.

#### Theme clarity pass (`--color-sidebar`)

The five reference themes (sage, clay, lagoon, berry, orchid) defined
`--color-surface` DARKER than `--color-background`, so the menu column read
as a dark slab. New rules:

| Token | Rule |
|-------|------|
| `--color-sidebar` | **New.** The menu column has its own token, so the sidebar can be tuned without dragging every card, popover and modal along. `Sidebar.tsx` uses `bg-sidebar`; the mobile header and bottom bar use `bg-sidebar/95`. |
| `--color-surface` | In every light theme the surface is now LIGHTER than the page background (cards float above the page). The five reference themes moved from a tinted grey surface to a near-white one. |
| `--color-border` | Hairlines are visible against the sidebar in all 20 combinations (≥ 1.33:1 light, ≥ 1.37:1 dark). |
| `--color-text-muted` | Now clears AA (4.5:1) on the sidebar surface in all 20 combinations. It failed at 4.03–4.10:1 in the five reference themes. |
| `--color-primary-text` | Lavender had **no dark block**, so the mode-agnostic rule leaked the LIGHT value (#6d28d9) into dark mode: 2.21:1 on the sidebar. The sidebar logo glyph and the script quote were effectively invisible. A `[data-theme="dark"][data-color-theme="lavender"]` block now re-asserts the dark palette. |
| `--shadow-card/soft/pop` | Were lavender ink in EVERY light theme. Now neutral ink, so a clay card does not cast a violet shadow. |
| Nav active state | Desktop used `text-accent-foreground` + `bg-accent-light`, mobile used `text-primary-text` + `bg-primary-lightest`. Both navs now use `text-primary-text` + `bg-primary-lightest`. |

Verified by a script that parses `globals.css` and evaluates the real
cascade for all 10 themes × 2 modes: text / text-secondary / text-muted /
primary-text ≥ 4.5:1 on sidebar, surface and page; the sidebar never darker
than the page in light mode; every hairline ≥ 1.33:1.

#### The theme must reach EVERY surface (the "only the background changed" bug)

The five reference themes (sage, clay, lagoon, berry, orchid) defined their
DARK surfaces in **neutral greys** (`#222727`, `#292e2e`, `#191d1d` …). So
selecting lagoon repainted the page background navy and left every card and
the menu rail as generic dark grey — the theme did not reach the app.

The rule now: **a theme's dark surfaces are tinted with the theme's own
hue.** Each of the five was rewritten around its accent (lagoon → teal-navy
surfaces, clay → warm brown, sage → green, berry → plum, orchid → violet),
and every classic theme's rail got its own deeper tone so the same
three-level hierarchy holds everywhere:

```
rail (deepest)  →  page  →  cards (lightest)
```

The light surfaces of the five reference themes carry a little more hue too
(lagoon `#ecf7f5`, clay `#f9f4ee`, sage `#f0f5ec`, berry `#fbf1f3`, orchid
`#f4f1fb`) while still staying lighter than the page.

**When adding a theme, tint the whole surface family — a themed background
with grey cards is not a theme.**



