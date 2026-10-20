# UI Tokens

Design tokens for Habit Tracker — Lavender Sky. Extracted from `public/designs/` (especially `trakcer UI.png`) and the original HTML app palette. All values are defined in `app/globals.css` using Tailwind v4 `@theme`. Never hardcode hex values or use raw Tailwind palette classes in components.

---

## How to Use

This project uses **Tailwind CSS v4**. Tokens live in `@theme` in `app/globals.css`. No `tailwind.config.ts` color config.

```tsx
// Correct
className="bg-surface text-text border-border"
className="bg-primary text-primary-foreground"
className="bg-heat-3"

// Incorrect
className="bg-[#A78BFA] text-[#2D2947]"
className="bg-purple-500 text-gray-600"
```

Dark mode and color themes swap the underlying CSS variables on `<html>`; component classes stay the same.

---

## Light Mode (default) — Lavender Sky

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#F9F7FD` | Page background |
| `surface` | `#FFFFFF` | Cards, sidebar, topbar |
| `surface-alt` | `#EEEBF7` | Secondary panels, alt rows |
| `surface-muted` | `#F0E7FF` | Soft accent fills |
| `surface-hover` | `#F5F1FC` | Hover states |
| `border` | `#E8E4F0` | Default borders |
| `border-light` | `#EEEBF7` | Subtle dividers |
| `border-strong` | `#D4CCE3` | Stronger outlines |
| `text` | `#2D2947` | Primary text |
| `text-secondary` | `#5B5478` | Secondary text |
| `text-muted` | `#586A84` | Placeholders, captions (see Fill vs Type tokens for the per-theme value) |
| `primary` | `#A78BFA` | Accent, active nav, buttons |
| `primary-light` | `#DCC3F3` | Hover / soft primary |
| `primary-lightest` | `#F0E7FF` | Primary washes |
| `primary-dark` | `#7C3AED` | Emphasis primary |
| `primary-foreground` | `#FFFFFF` | Text on primary |
| `secondary` | `#C4B5FD` | Secondary accent |
| `accent` / `accent-light` | `#A78BFA` / `#F0E7FF` | Nav active, highlights |
| `success` / `done` | `#86D6BF` | Habit done / great day |
| `warning` / `partial` | `#FCD34D` | Partial / okay day |
| `error` / `missed` | `#FC5A5A` | Missed / tough day |
| `info` | `#7DD3FC` | Neutral info / okay mood |

### Status soft backgrounds

| Token | Hex |
|-------|-----|
| `success-light` / `done-soft` | `#D1FAE5` |
| `warning-light` / `partial-soft` | `#FEF3C7` |
| `error-light` / `missed-soft` | `#FEE2E2` |
| `info-light` | `#E0F2FE` |

---

## Dark Mode

| Token | Hex |
|-------|-----|
| `background` | `#181726` |
| `surface` | `#232038` |
| `surface-alt` | `#2D2947` |
| `surface-muted` | `#3B2D5C` |
| `border` | `#3D3558` |
| `text` | `#E5E7EB` |
| `text-secondary` | `#C4B5FD` |
| `primary` | `#A78BFA` |
| `success` / `done` | `#34D399` |
| `warning` / `partial` | `#FBBF24` |
| `error` / `missed` | `#F87171` |
| `heat-0` | `#2D2947` |
| `heat-4` | `#A78BFA` |

Enable via `data-theme="dark"` on `<html>`.

---

## Mood Faces (custom — exact per designs)

Mood levels render as **solid pastel circular faces** with darker features (MoodPage.png / HomePage.png bubbles) — never bare system-emoji text on transparent background.

**6-level scale since F26** (developer-approved; high = happier):

| Level | Value | Face (SVG) | Face color (DB seed) |
|-------|-------|------------|----------------------|
| Very Happy | 6 | closed happy eyes + open smile | `#86D6BF` |
| Happy | 5 | dot eyes + gentle smile | `#FCD34D` |
| Okay | 4 | dot eyes + straight line | `#7DD3FC` |
| Tired | 3 | half-lidded eyes + small yawn oval | `#A8A29E` |
| Sad | 2 | dot eyes + frown | `#FC8FA5` |
| Fu*ked Up | 1 | mind blown (orange/yellow fire cloud over top of head + dot eyes + O mouth) | `#A78BFA` |

Rules:
- Faces come from DB `mood_levels` (emoji + color + label + value), seeded on first login and reseeded to the 6 rows by the F26 migration; UI reads DB, never hardcodes
- Component: shared `MoodFace` (`components/ui/MoodFace.tsx`) draws **procedural SVG** eyes/mouth keyed by value (clamped 1–6) + glossy radial gradient — no system emoji (F13 decision)
- Reuse the same faces for graph y-axis markers, distribution dots, insights rows, legend chips
- Labels are DB-owned; F26 seed labels are verbatim ("Fu*ked Up" included); insight phrases derive from labels (`Felt tired` etc.)

---

## Logo & Branding

- **Logo tile:** `rounded-xl bg-primary-lightest` containing a purple **leaf/sprout mark** in `primary` (custom leaf SVG — upgrade from the 🌿 placeholder; matches trakcer UI.png)
- **Wordmark:** "Habit Tracker" `text-[15px] font-bold text-text`; tagline "A better you / Everyday" `text-[11px] text-text-muted`
- **Script accents:** Caveat (`font-script`) in `text-primary/85` or `text-primary-dark` — sidebar footer quotes, page-header quotes, decorative cards
- **Sidebar footer:** botanical glyph (decorative) + script quote; below it Dark Mode switch + profile avatar (no topbar)
- **Scenic decorative cards:** lavender gradient wash + script line (v1 approximation of the lavender-field illustration)

---

## Color Themes (Settings)

Each theme overrides the **primary family** and **heatmap ramp** only. Surfaces, text, and status colors stay stable so the app remains readable.

| Theme | Primary | Lightest | Dark | Heat 1→4 |
|-------|---------|----------|------|----------|
| Lavender (default) | `#A78BFA` | `#F0E7FF` | `#7C3AED` | `#DCC3F3` → `#7C3AED` |
| Mint | `#34D399` | `#ECFDF5` | `#059669` | `#A7F3D0` → `#059669` |
| Peach | `#FDBA74` | `#FFF7ED` | `#F97316` | `#FED7AA` → `#F97316` |
| Ocean | `#7DD3FC` | `#F0F9FF` | `#0284C7` | `#BAE6FD` → `#0284C7` |
| Rose | `#FDA4AF` | `#FFF1F2` | `#E11D48` | `#FECDD3` → `#E11D48` |
| Sage | `#AEC69F` | `#EAF4E4` | `#8FA681` | `#CCD9C4` → `#435339` |
| Clay | `#A85D3C` | `#FFE8DB` | `#88401E` | `#F7C8B5` → `#713D26` |
| Lagoon | `#6FCAC3` | `#D7F8F5` | `#4EAAA4` | `#B1DFDB` → `#135854` |
| Berry | `#AB5268` | `#FFE6EC` | `#8A354C` | `#FBC3CD` → `#743645` |
| Orchid | `#B8A6EB` | `#F2EBFF` | `#9987CA` | `#D7CEF5` → `#514471` |
| Custom | user-defined | — | — | — |

Apply with `data-color-theme="mint"` etc. on `<html>`.

**Two families, not one.** The original five (Lavender, Mint, Peach, Ocean,
Rose) are the "Lavender Sky" family: pastel accents over a softly tinted
chrome. The five added in Phase 13 (Sage, Clay, Lagoon, Berry, Orchid) come
from the reference mock and use a **near-neutral page with one saturated
accent** — a dark mode of near-black with a whisper of hue, and a light mode
of warm paper. Their accent hexes were sampled from the reference's own
theme-switcher chips; the chrome from its page backgrounds
(sage `#1c1d1c` dark / clay `#f3eee4` light / lagoon `#0e1d28` dark /
berry `#f6eeee` light / orchid `#171624` dark). Every pairing clears WCAG AA
(4.5:1 text, 3:1 knob and heat cells) in both modes.

### New reference themes (Sage / Clay / Lagoon / Berry / Orchid)

Added **alongside** the Lavender Sky family — the five original themes are
untouched. Unlike them, these five also override the **full chrome**
(background / surface / border / text) in both modes, because the
reference renders a near-neutral page with a single saturated accent.

- **Accent source:** the reference mock's own theme-switcher chips —
  sage `#aec69f`, clay `#a85d3c`, lagoon `#6fcac3`, berry `#ab5268`,
  orchid `#b8a6eb`.
- **Chrome:** near-neutral, tinted only a whisper toward the accent hue.
  Reference page backgrounds: sage `#1c1d1c` (dark), clay `#f3eee4`
  (light), lagoon `#0e1d28` (dark), berry `#f6eeee` (light),
  orchid `#171624` (dark). The mode each theme is *not* shown in is
  derived from the same near-neutral recipe.
- **Primary ink:** `--color-primary-on` is the deep ink `#1e1b4b` for the
  pastel light-mode primaries and `#ffffff` for the saturated ones
  (clay, berry) — matching the reference, whose light-mode buttons carry
  white text on the saturated accent.
- **Switch knob:** `--color-switch-knob` flips with the mode (deep ink in
  light, white in dark) so it clears 3:1 against both tracks in every
  combination.
- **Accessibility:** every text pairing clears WCAG AA (4.5:1) and the
  switch knob / heat cells clear 3:1, in all ten theme × mode
  combinations.
- **Database:** `profiles.color_theme` CHECK constraint widened by
  migration `20261020150000_f14-new-reference-color-themes.sql`.


---

## Heatmap Tokens (GitHub-style)

Five steps, Lavender by default:

| Level | Light hex | Dark hex | Meaning (aggregated day) |
|-------|-----------|----------|---------------------------|
| heat-0 | `#EEEBF7` | `#2D2947` | No data / none completed |
| heat-1 | `#DCC3F3` | `#4C3A7A` | Low / partial |
| heat-2 | `#C4B5FD` | `#6D4FC0` | Moderate |
| heat-3 | `#A78BFA` | `#8B5CF6` | High |
| heat-4 | `#7C3AED` | `#A78BFA` | All habits done |

Per-habit rows use the role vars from `globals.css` — `--heat-cell-missed` / `--heat-cell-partial` / `--heat-cell-done` — not raw levels: light maps 1/3/4 (pale → deep, GitHub-light structure), dark maps 1/2/4 (dim → bright, GitHub-dark structure). (Static heat-2 for partial made partial nearly identical to missed in light mode.)

**Mint theme = GitHub contributions (Feature 20):** Mint's heat ramp uses GitHub's exact hexes (including `heat-0` empty) — light `#ebedf0 / #9be9a8 / #40c463 / #30a14e / #216e39`; dark via `[data-theme="dark"][data-color-theme="mint"]` → `#161b22 / #0e4429 / #006d32 / #26a641 / #39d353` (only color theme with a dark heat block). Switch Settings → Color Theme → Mint for a GitHub-green heatmap.

**Tooltip tokens (Feature 20):** `--color-tooltip: #1F2328` + `--color-tooltip-foreground: #FFFFFF` — same in light and dark (GitHub-style contribution hover).

---

## Typography

| Role | Class pattern | Notes |
|------|---------------|-------|
| Page title | `text-3xl font-bold tracking-tight text-text` | e.g. Habits, Stats |
| Page subtitle | `text-sm text-text-muted` | Under title |
| Section title | `text-base font-semibold text-text` | Card headers |
| Body | `text-sm text-text` | Rows, values |
| Caption | `text-xs text-text-muted` | Hints, timestamps |
| Stat number | `text-2xl font-semibold text-text` or `text-primary` | KPI cards |
| Script accent | `font-script text-2xl text-primary/80` | Quotes only |
| Nav item | `text-sm font-medium` | Sidebar |

Font stack: Inter via `next/font/google` → `--font-sans`. Script: Caveat → `--font-script`.

---

## Spacing, Radius, Shadow

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 8px | Buttons, inputs |
| radius-md | 10px | Tiles, chips |
| radius-lg | 14px | Nested panels |
| radius-xl | 16px | Cards |
| radius-2xl | 20px | Large hero cards |
| radius-full | 9999px | Pills, avatars, dots |
| shadow-card | soft 1px lift | Default card |
| shadow-soft | primary-tinted | Featured cards |
| shadow-pop | larger | Modals/popovers |

Card padding: `p-5` / `p-6`. Gaps between sections: `gap-4` / `gap-6`. Page padding: `p-6 lg:p-8`.

---

## Layout Tokens

| Token | Value |
|-------|-------|
| `--sidebar-width` | 240px |
| Topbar height | 64px (`h-16`) |

---

## Component Class Recipes

### Card

```
rounded-xl border border-border bg-surface p-6 shadow-card
```

### Primary button

```
rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90
```

### Secondary button

```
rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text hover:bg-surface-hover
```

### Input

```
w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40
```

### Nav active

```
bg-accent-light text-accent-foreground font-semibold
```

### Filter pill active

```
bg-primary text-primary-foreground
```

### Filter pill inactive

```
bg-surface-alt text-text-secondary hover:bg-surface-hover
```

### Toggle (on)

```
bg-primary
```

### Toggle (off)

```
bg-border-strong
```

### Habit emoji tile

```
flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-lg
```

### Heat cell

```
h-2.5 w-2.5 rounded-[2px] bg-heat-{0-4}
```

---

## Do Nots

- Never use `bg-purple-500`, `text-gray-600`, etc.
- Never write hex in component className or style props (except category color pickers which store user hex)
- Never put gradients on standard cards
- Never use script font for functional UI text
- Never more than one font-weight emphasis inside a single control
- Never `position: fixed` except Sidebar and Topbar shells

---

## Fill vs Type tokens (Phase 10)

`--color-primary` is a soft pastel. It is a **fill**, not a text colour: on white it
measures only **2.72:1** (WCAG AA needs 4.5:1 for normal text). The same is true of
`--color-text-muted` at `#94A3B8` (2.57:1).

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `primary` | `#a78bfa` | theme value | Fills, icons, borders, rings, chart strokes — **never type** |
| `primary-text` | `#6d28d9` / `#047857` / `#b91c1c` / `#1d4ed8` / `#be123c` | `#c4b5fd` / `#5dd1b0` / `#ffb4a7` / `#a7d8eb` / `#fecdd3` | **Type** on a light surface (`text-primary-text`) |
| `primary-on` | `#1e1b4b` | `#1e1b4b` | Foreground for content ON a `bg-primary` fill |
| `switch-knob` | `#1e1b4b` | `#ffffff` | Switch knob (flips with the mode) |
| `danger-button` | `#991b1b` | `#7f1d1d` | Destructive button fill (white text, 8.3:1 / 10.0:1) |
| `text-muted` (light) | `#586a84` / `#5d716c` / `#7b6965` / `#566881` / `#7a646d` | `#94a3b8` | Captions, placeholders, secondary labels |

Light-mode `text-muted` is darkened per theme, hue preserved. Every value above was
verified against all four light surfaces of its theme (surface, background, surface-alt,
surface-muted / primary-lightest) and all four dark surfaces.

**Rule:** type uses `text-primary-text` and `text-text-muted`; `text-primary` is for
non-text. Solid primary surfaces use deep ink on the pastel, never white on the pastel.

### The `dark:` variant

The app's theme is an explicit user choice stored on `<html>` as `data-theme`, **not** the
OS preference. `app/globals.css` therefore declares:

```css
@custom-variant dark (&:where([data-theme="dark"] *));
```

Without it, Tailwind v4's default `dark:` (`prefers-color-scheme`) made every `dark:`
utility follow the operating system while the app's own toggle did something else.

### New motion classes

| Class | Duration | Use |
|-------|----------|-----|
| `.status-pop` | 280ms `cubic-bezier(0.22,1,0.36,1)` | Check-in status change (via `components/ui/StatusPop.tsx`) |
| `.skeleton` | 1.7s infinite | Route loading placeholder |
| `.aurora-orb-1/2/3` | 46/58/52s infinite | Ambient backdrop drift, `transform`-only |
| `.modal-in` | 280ms | Popover entrance (mirrors `.modal-panel`) |

All are listed in the `prefers-reduced-motion: reduce` block.
