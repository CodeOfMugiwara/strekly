# Project Overview

## About the Project

Strekly (formerly "Habit Tracker") is a personal habit and mood tracking web app with a soft, modern “Lavender Sky” aesthetic. The user signs in once, tracks daily habits with a single status per habit per day, logs mood with optional notes, and reviews consistency through stats, a contribution-style heatmap, and a monthly calendar.

The product is intentionally calm and encouraging — short affirmations, streaks framed as motivation (not shame), and insights computed locally from the user’s own data. No AI, no social features, no analytics SDK.

---

## The Problem It Solves

Habit tracking fails when the tool is noisy, ugly, or scattered across notes and memory. This app gives one beautiful place to:

- Check off today’s habits in seconds
- Notice mood patterns next to habit consistency
- See streaks and completion trends without spreadsheets
- Keep data exportable and under the user’s control

---

## Pages

```
/login             → Auth page (Google + GitHub OAuth)
/                  → Home dashboard (greeting, today’s habits, streaks, mood)
/habits            → Habit management + tracking
/mood              → Mood logging, graph, distribution, insights, notes
/stats             → Completion analytics, heatmap, streak history, key insights
/calendar          → Monthly grid + day details + monthly overview
/settings          → Appearance, notifications UI, preferences, profile, data management
```

Protected app routes live under the `(app)` route group. Auth pages live under `(auth)`.

---

## Navigation

Fixed left sidebar on all authenticated pages.

```
[Logo] Strekly
       A better you / Everyday

Home
Habits
Mood
Stats
Calendar
Settings

[Decorative script quote + lavender accent]
```

- Active nav item: accent background, primary text
- Top bar of main content: theme toggle (sun/moon), user avatar initial
- Full application shell — not a marketing site. No public homepage beyond login redirect.

---

## Core User Flow

### Onboarding

- User signs in via InsForge auth (Google or GitHub OAuth)
- After login → redirect to `/` (Home)
- First load creates a `profiles` row with defaults (tracker title, welcome message, Lavender theme, 5-level mood scale, Monday week start)

### Daily check-in (Home)

- Greeting by time of day + user name
- Date navigation (prev/next day) + “today” shortcut
- Stat cards: today’s progress %, day streak, longest streak, today’s mood
- Today’s Habits list: one row per active habit with weekly dots + check control
- User sets each habit status for the selected day: done / partial / missed (cycle or explicit)
- This Week strip: per-day completion dots
- Quick Stats card (month-scoped completed / missed / completion rate / vs last month)
- Today’s Mood: emoji selector + optional note + Save

### Habit management (Habits page)

- Search habits by name
- Filter tabs: All / Active / Completed / Archived
- Sort: custom order or by name/streak
- Each habit row: emoji tile, name, description, weekly dots, streak, active toggle, kebab menu (edit, archive, delete)
- Sidebar panels: Overall Progress ring, Habit Streaks, Habit Categories with counts
- Add Habit dialog/form: name, emoji, description, category
- Categories are first-class: create, rename, recolor, manage from Habits page

### Mood (Mood page)

- Month navigation + Daily / Weekly / Monthly view tabs
- Day cells show mood emoji; click to set or change mood for that day
- Mood legend chips (Very Happy → Very Sad by default)
- Mood Graph: line chart of mood value over time with tooltip (date, label, note)
- Mood Distribution: donut of level counts for the period
- Mood Insights: count per level + optional pattern callouts
- Notes for selected day + Recent Notes list

### Stats

- Top KPI cards: overall completion %, current streak, longest streak, active habits
- Completion Overview chart: bar chart, toggle Daily / Weekly / Monthly / Yearly
- Habit Completion Rate: horizontal bars per habit with %
- Habit Consistency: **GitHub-style contribution heatmap** using the Lavender palette (levels 0–4), one row per habit or aggregated — see architecture.md
- Streak History: line/area chart of streak length over time
- Key Insights: 2–4 cards computed client-side (weekday vs weekend, strongest habit, trend, mood logging count)
- Period selector (This Month default)

### Calendar

- Month grid with leading/trailing days
- Each day cell: completion dots (status colors) + mood emoji
- Day Legend card: what green/amber/pink/gray mean + mood face key
- Click a day → Day Details: mood, note, habit checklist for that date
- Monthly Overview: % of days with all habits done, counts of great/okay/tough/no-data days
- Edit Day jumps to editing habits + mood + note for that date

### Settings

- **Appearance**: Theme Mode (Light / Dark / System), Color Theme (Lavender, Mint, Peach, Ocean, Rose, Sage, Clay, Lagoon, Berry, Orchid, Custom)
- **Notifications**: toggles for habit reminder, daily summary, mood reminder, streak alerts, missed habit reminder — **persisted only; no real push in v1**
- **Habit Preferences**: default reminder time, week starts on, default frequency, show completed habits, compact habit view
- **Mood Settings**: mood scale (5 or 7 levels), enable mood notes, mood reminder time, show mood on calendar
- **Your Profile**: display name + optional bio note (shown with welcome message)
- **Data Management**: Export JSON, Import JSON, Create local backup (download), Reset All Data
- **Danger Zone**: Clear All Completed Habits, Delete All Habits (keep settings), Reset Everything
- **About**: app name, version, tagline, static links (shortcuts/feedback/privacy/terms can be placeholders)

---

## Data Architecture

### Single-user-per-account model

All data is scoped to `auth.uid()` via InsForge RLS. One profile row per user.

### Habit status model (locked decision)

**One status per habit per day.** Values: `done` | `partial` | `missed`.

- Home shows a check control that sets/cycles status for the selected day
- Habits page weekly dots reflect that day’s status
- Calendar legend maps day-level rollups:
  - All habits `done` → green (great day)
  - Most habits `done` → amber (okay day)
  - Some habits `done` → pink (tough day)
  - No habits done / no data → gray
- There is **no** multi-times-per-day check-in in v1
- “Default Frequency” in settings is a preference label for UI copy, not a multi-check schema

### Mood

One mood entry per user per day (`mood_value` references `mood_levels.value`). Optional note can live on `daily_notes` for that date (shared with habit day notes) or a dedicated mood note field — implementation choice documented in architecture.md; prefer single `daily_notes` per date to match Calendar Day Details.

### Settings

All user preferences live on the `profiles` row. Theme mode + color theme are applied client-side by setting `data-theme` and `data-color-theme` on `<html>`, then persisted via Server Action.

---

## Features In Scope

- Login with Google + GitHub OAuth (InsForge)
- App shell: sidebar + topbar + theming
- Home dashboard with real check-in, streaks, week strip, quick stats, mood save
- Habits CRUD, archive, reorder, categories, search, filters, sort
- Mood logging, graph, distribution, insights, notes
- Stats with period toggles, per-habit rates, **Lavender GitHub-style heatmap**, streak history, key insights
- Calendar month grid, day details, monthly overview
- Settings for appearance, color themes, notification toggles, preferences, profile
- JSON export + import + danger-zone operations
- Light + dark mode + 5 color themes
- Data persisted in InsForge with RLS

---

## Features Out of Scope

- PostHog or any analytics SDK
- AI-generated insights or chat
- Real push / email / browser notifications (toggles only)
- Mobile native app
- Team or multi-user shared trackers
- Payments or subscriptions
- Browser extension
- localStorage → cloud migration tool
- Multi check-ins per habit per day
- Social sharing, feeds, or public profiles
- Photo attachments on notes
- Habits with numeric targets (e.g. “8 glasses”) as structured data — description text only in v1

---

## Target User

The primary user is the developer themselves (Krishna) — personal habit and mood tracking — but the app is built multi-user via InsForge auth so accounts and RLS are correct from day one.

---

## Success Criteria

- Sign-in works with Google and GitHub; protected routes redirect when signed out
- Daily check-in (habits + mood + note) takes under 30 seconds on Home
- Streaks and completion % match manual calculation on a known week
- Heatmap renders with Lavender heat tokens and reads clearly in light and dark mode
- All six pages match the visual language in `public/designs/` (sidebar, cards, typography, status colors) — attach via `@public/designs/<File>.png`
- Export produces a valid JSON file; import restores habits, completions, moods, notes, categories, and settings
- Theme + color theme choices survive refresh (DB-backed)
- No hardcoded raw Tailwind palette classes or hex values in components — tokens only
- `/review` passes Layer 1–3 for each feature before it is marked complete in progress-tracker.md
