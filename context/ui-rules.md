# UI Rules

Concise rules for Strekly UI. Design assets in `public/designs/` are the visual source of truth. Attach them in chat with `@public/designs/<File>.png` (see AGENTS.md design map). `trakcer UI.png` is the palette / UI kit / dark + color-theme board. These rules keep the interface consistent without over-specifying every pixel.

---

## Font

Always load Inter (body) and Caveat (script accents) via `next/font/google` in the root layout. Apply both CSS variables on `<html>`. Never use system fonts as primary. Never use Caveat for body, labels, buttons, or data.

---

## Layout

- Fixed left sidebar: `240px`, full viewport height, surface background, right border
- Main column: `margin/padding-left` equal to sidebar width; topbar sticky at top
- Topbar: 64px, surface background, theme toggles + avatar on the right
- Page content padding: 24px mobile, 32px desktop
- Section gap: 24px
- Cards are the only major content containers
- Max readable width for text-heavy panels; allow full width for grids/charts

---

## Sidebar

- Logo tile + “Strekly” + tagline “Your streak / Everyday”
- Nav: Home, Habits, Mood, Stats, Calendar, Settings — icon + label
- Active item: accent background, accent-foreground text, font-semibold
- Inactive: text-secondary; hover → accent-light
- Bottom decorative block: script quote (e.g. “Small Steps Brighter Days”) — non-interactive
- Sidebar does not scroll with page content (nav list can scroll if needed)

---

## Page Header Pattern

Every main page:

1. Large title (page name)
2. Subtitle (one encouraging line from designs)
3. Optional right-aligned script phrase + heart accent

Do not invent alternate header layouts.

---

## Cards

```
background: surface
border: 1px solid border
border-radius: 16px
padding: 24px
box-shadow: shadow-card
```

- Card titles: section-title style, optional right-side text button (“See All →”)
- Never colored full-card backgrounds for standard sections
- Color appears inside cards via badges, bars, dots, icons — not the card surface
- Featured/quote cards may use `surface-alt` or `surface-muted` fills

---

## Typography Hierarchy

| Level | Size / weight | Color |
|-------|---------------|-------|
| Page title | 30px / 700 | text |
| Subtitle | 14px / 400 | text-muted |
| Section title | 16px / 600 | text |
| Body | 14px / 400–500 | text |
| Caption | 12px / 400 | text-muted |
| Stat number | 24–30px / 600–700 | text or primary |
| Script accent | 24–32px / 400 Caveat | primary/80 |

---

## Status Colors

| Meaning | Token | Where |
|---------|-------|-------|
| Done / great day | success / done | Checks, calendar green, heat high |
| Partial / okay | warning / partial | Partial status, calendar amber |
| Missed / tough | error / missed | Missed status, calendar pink/red |
| No data | heat-0 / border | Empty calendar days, heatmap empty |

Mood faces use `mood_levels.color` + emoji — not the status palette.

---

## Buttons

**Primary:** bg-primary, text-primary-foreground, radius-sm, px-4 py-2.5, text-sm font-medium  
**Secondary:** surface + border + text  
**Ghost / text:** text-primary hover:bg-accent-light  
**Danger:** bg-error text-error-foreground (or outline error for softer danger)  
**Icon button:** 36–40px circle/square, border-border  

Add Habit and Save are the most prominent actions on their pages.

---

## Forms

- Label above input: text-sm font-medium text-text
- Input: see ui-tokens recipe
- Helper / error: text-xs; errors use error color; never raw exception text
- Selects and toggles match input height language
- Emoji pickers: grid of buttons with soft tiles

---

## Habit Row

- Left: emoji tile (accent-light bg)
- Middle: name (font-medium) + description (caption)
- Right controls depend on page:
  - Home: check circles / status control + streak
  - Habits: weekly dots (S M T W T F S), % or streak, active toggle, kebab
- Weekly dots: filled primary = done; softer fill = partial; empty border = missed/none
- Do not cram more than one primary action button per row

---

## Heatmap (GitHub-style)

- Custom grid, not a chart library
- **One implementation, shared surfaces** — `components/ui/ContributionHeatmap.tsx`. The marketing page and the Stats page render the SAME component, so the product can never drift from the promise
- Use heat-0…heat-4 tokens only
- Cell ~10–12px, gap 3px, radius 2px
- Month labels above; optional weekday labels on left
- Hover tooltip with date + status
- Legend “Less → More” with five swatches
- Must remain legible in dark mode (heat tokens already dark-aware)

---

## Contribution grid (the consistency heatmap)

- 7 weekday rows × one column per week (GitHub orientation) — `grid-auto-flow: column` with an explicit `gridTemplateRows: repeat(7, …)`
- Cell = `aspect-square rounded-[2px]`, colour via inline `var(--color-heat-N)` (not a Tailwind `bg-heat-*` utility)
- Panel = scale label left, tracked count right (`font-medium text-primary-text`), grid, Less→More legend
- The tracked count is REAL (days in the window with at least one check-in) — never a decorative number

---

## Theme swatches

- Quick swatches are five small squares (`h-4 w-4 rounded-[4px]`, `bg-swatch-*`): Sage, Clay, Lagoon, Berry, Orchid
- **They float ABOVE the card, right-aligned — never inside it**
- The active theme gets `ring-2 ring-primary/70`; clicking switches + persists via `useTheme().setColorTheme`
- All ten themes remain available in Settings → Appearance
- **Only on the marketing page** — above the landing hero's product visual.
  The signed-in app has no swatch row; the themes live in Settings →
  Appearance.

---

## Settings

- **Every control must change something.** A control that saves a value no
  surface reads is removed, not shipped as a switch that does nothing.
- Current list (all verified working): theme mode, ten colour themes, week
  starts on, enable mood notes, show mood on calendar, profile name, sign
  out, plus the Habits / Categories / Data CRUD.
- Removed because nothing read them: the five notification switches, the
  mood reminder time, default reminder time, default frequency, show
  completed habits, compact habit view, the bio field, the "Custom" swatch.
- The columns stay in the schema and in the export envelope — a backup file
  written by an older build must still import.

---

## Overlays

- Any `position: fixed` overlay inside a card is rendered through a
  **portal** (`createPortal(…, document.body)`). A blurred ancestor
  (`backdrop-filter`) is the containing block for fixed descendants, so an
  in-card fixed element is positioned by the card and ends up far away from
  where it should be, underneath other cards.
- `Modal` (Radix Dialog) and `PopoverPanel` (Radix Popover) already portal.
- Overlays that sit above app chrome use `z-[70]`.

---

## Themes

- `--color-sidebar` is the menu column's own token. The sidebar and the
  mobile chrome use it, so the menu can be tuned without dragging every
  card, popover and modal along.
- **The surface is always LIGHTER than the page background in light mode** —
  cards and the menu float above the page. A darker surface made the menu
  read as a dark slab.
- **A theme's surfaces are tinted with its own hue, in BOTH modes.** The
  five reference themes once shipped neutral-grey dark surfaces, so picking
  one repainted the page and left the cards generic — the theme did not
  reach the app. A themed background with grey cards is not a theme.
- Dark mode has a three-level hierarchy in every theme:
  **rail (deepest) → page → cards (lightest)**.
- Every colour theme needs BOTH a `[data-theme="light"]` and a
  `[data-theme="dark"]` block. A theme with only the light half leaks the
  light values into dark mode (this is how Lavender's sidebar logo became
  invisible at 2.21:1).
- Hairlines must clear 1.3:1 against the surface they sit on; muted text
  must clear 4.5:1 on every surface it is used on.
- Shadows are neutral ink, never a tinted hue.

---

## Mascot (Lumi)

- One mood per surface — Home auto, Stats `streak`, Mood `supportive`, Calendar `idle`, Habits `celebrate`, Settings → About `sleepy`
- Lives in the **page header’s right-hand group** next to the script quote; never in a narrow sidebar column (the speech bubble is up to 320px wide)
- `showDialogue={false}` in the app — the bubble stays closed until tapped, so it never disturbs the layout on load
- The bubble sits in normal flow beside the mascot, so any placement must have horizontal room for it

---

## In-page scrolling

- `scroll-behavior: smooth` + `scroll-padding-top: 5rem` on `html` (globals.css base block)
- The scroll padding exists because the sticky header is ~64px tall — without it an anchor target hides under the chrome
- Reduced motion keeps the instant jump (global kill-switch sets `scroll-behavior: auto !important`)

---

## Charts (Recharts)

- Style with tokens — no default Recharts colors
- CartesianGrid: border color, subtle
- Axis tick: text-muted, 12px
- Tooltip: card-like surface, border, small text
- Bar fills: primary or primary with opacity steps
- Line/area: primary stroke, soft primary fill
- Donut: mood level colors from data; center label shows total days
- Empty chart state: muted text, same as empty cards

---

## Empty States

Every list, chart, calendar month, and notes panel needs an empty state:

- Short muted sentence
- Optional icon
- CTA if there is a logical next action (“Add Habit”, “Log mood”)

---

## Motion

- Subtle transitions only (150–200ms) on hover/active
- No bouncy marketing animations in the app shell
- Progress rings and bars may animate width once on mount — keep it calm

---

## Do Nots

- Never use raw Tailwind color classes
- Never define colors outside `globals.css` tokens
- Never gradients on standard cards
- Never show raw error messages to users
- Never stack more than two nested border radii that fight each other
- Never `position: fixed` for page content
- Never invent a second navigation pattern (no top nav bar for primary routes)
- Never hardcode habit/mood sample data in production paths after Phase 2 logic lands — mock data only during UI-first build of a feature
