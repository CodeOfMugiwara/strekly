# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 15.8 — Sidebar Quote Position Adjustment (Shipped)
**Last completed:**
1. **Shifted Sidebar Quote Right:**
   - Moved the quote container in [Sidebar.tsx](file:///d:/habit-tracker-app/components/layout/Sidebar.tsx) from `left-3.5` (14px) to `left-10` (40px) with `max-w-[165px]`.
   - The cursive text now cleanly clears the botanical leaves and stems on the left while staying in the exact same anchored position and size across all pages.
2. **Production Build Clean:** Verified `npm run build` exits code 0 with all 12 routes intact.
**Next:** Production deploy & signed-in user QA.



---

## Design attach convention

- Source of truth: `public/designs/*.png` — **designs win over text notes**; canonical map in `context/build-plan.md` (Design System section + attach map)
- Palette/logo/mood-face/branding specs: `context/build-plan.md` Design System + `context/ui-tokens.md`
- Habits page: old tracker grid (`D:\habit-tracker\index.html`), **not** HabitsPage.png (Feature 09 redirect)
- `mood graph.png` = older Mood variant — flavor only (tooltip copy); MoodPage.png is canonical
- Chat attach: `@public/designs/<File>.png`; filenames keep original spelling (CalenderPage, trakcer UI)
- No root-level `designs/` folder

---

## Progress

### Phase 1 — Foundation

- [x] 01 App Shell + Design Tokens
- [x] 02 Auth
- [x] 03 Database Schema
- [x] 04 Theme System + Settings Skeleton

### Phase 2 — Home

- [x] 05 Home Page — Full UI
- [x] 06 Habit Check-in Logic
- [x] 07 Streaks + Progress
- [x] 08 Mood Save + Week Strip

### Phase 3 — Habits

- [x] 09 Habits Page — Full UI (month grid — old tracker style, **redirected from HabitsPage.png**)
- [x] 10 Habit CRUD + Archive
- [x] 11 Categories CRUD
- [x] 12 Reorder + Toggles

### Phase 4 — Mood (vs MoodPage.png; custom face bubbles; Recharts)

- [x] 13 Mood Page — Full UI (mock `lib/mock-mood.ts` matching design counts; Daily only; tabs chrome; shared MoodFace; Home retrofit)
- [x] 14 Mood Logging + Notes (real-only; chip sets mood; notes save/delete; month nav via getMonthMood; View All modal; mood-view/mood-data split)
- [x] 15 Graph + Distribution Wiring (period dropdown → real ranges, graph-only scope; bugfixes: tooltip date, dynamic Y-domain, notes draft month reset)
- [x] 16 Mood Insights (per-level counts; pattern line; `lib/insights.ts` — Phase 4 closed)

### Phase 5 — Stats (vs StatsPage.png; Recharts + custom heat grid)

- [x] 17 Stats Page — Full UI (mock `lib/mock-stats.ts`; custom CSS-grid heatmap — no lib)
- [x] 18 Completion Aggregations (rollups in `lib/stats.ts`; pills card-local; all surfaces real; `lib/stats-data.ts`)
- [x] 19 Habit Completion Rates (weighted `weightedHabitRate` + category-color bars)
- [x] 20 Consistency Heatmap (GitHub-style tooltip + GitHub-exact Mint ramp; grid shipped F17/F18)
- [x] 21 Streak History + Key Insights (dropdown periods wired; weighted strongest-habit; mock-stats deleted — Phase 5 closed)

### Phase 6 — Calendar (vs CalenderPage.png)

- [x] 22 Calendar Page — Full UI (interactive mock vs CalenderPage.png; month grid + dots + faces; Day Details; legend + overview static)
- [x] 23 Day Navigation + Checklist (real-only flip; optimistic cycle; note read/write in Day Details; Edit Day = focus note; page-enter animation on all pages)
- [x] 24 Legend + Monthly Overview (weighted classification thresholds; month-to-date ring = Great+Okay/elapsed — Phase 6 closed)

### Phase 7 — Settings & Data (vs SettingsPage.png; extend existing skeleton)

- [x] 25 Settings Page — Full UI (7 new cards, hydrated chrome, design-literal columns; Categories kept col1)
- [x] Post-F25 UX pass — full theme chrome from `public/UI palette/` (all 4 themes + derived Rose retheme bg/surface/border/text in light AND dark), data entrance animations everywhere (Recharts props + CSS sweep utilities), Habits page opens current month (not Sept seed) + Today shortcut button
- [x] Post-F25.2 fixes — habits today-column highlight rebuilt; Settings Manage Habits card; HabitIcon SVG glyph library + BrandLeaf logo + stat icons; mood/streak `.chart-sweep`; Calendar popup reverted to inline Day Details + notes revalidation sync
- [x] Post-F25.4 — mood graph sweep slowed + replayed on entry change; mood chip second-click removes entry
- [x] Post-F25.5 — area reveal rebuilt (curve-only 3s entrance + local band reveal on entry change; `.chart-sweep` CSS deleted)
- [x] 26 Appearance + Preferences Save — prefs + notifications persist (auto-save), week_starts_on honored (calendar/home/stats), **6-mood scale** (migration + MoodFace + seeds) — Appearance already live (F04)
- [x] 27 Profile Save (name + bio persist with debounce+blur auto-save; Home greeting + UserMenu follow profile name; email-prefix fallback; tracker_title/welcome_message stay dormant)
- [x] 28 Mood Settings (mood prefs persist via saveMoodSettings; **Settings redirect:** Profile/Notifications → header quick-access, Mood Settings card removed/folded in with 6-face scale preview, grid rebalanced; **F28.1:** dropdowns rebuilt as right-side sheets + global page-enter stacking-context bugfix)
- [x] 29 Export / Import JSON (versioned v1 envelope, all 7 tables; merge-upsert import, never deletes; Backup = timestamped filename; Reset row inert until F30)
- [ ] ~~30 Danger Zone + About~~ — **CANCELLED (developer: "no need for feature 30, don't reset any data")** — Danger Zone card + About link rows + Reset row removed entirely in the UI overhaul instead of being wired
- [x] **UI overhaul** — Settings section-pane redesign (no cards; popovers replace sheets; Danger Zone/About-links/decorative filler deleted); Home fixes (date nav + mood section + dead kebab removed, status colors unified, This Week SVG rings); sidebar avatar removed; cross-page polish
- [x] **Habits pass** — today-column highlight rebuilt per developer image (rounded-rect pill + outlined column cells); Habit Graph card below the grid (daily weighted completion %, mood-graph reveal animation, live on toggles)

### Phase 8 — Comprehensive UI/UX Enhancements & Mobile Optimization
- [x] **Calendar status color alignment** — Unified checkbox status tokens (`bg-success`, `bg-warning`, `bg-error`) and icons (`Check`, `Minus`, `X`) in DayDetailsCard.
- [x] **Dead mood pills removed** — Removed inert Daily/Weekly/Monthly pills from MonthCard and MoodView.
- [x] **Sticky habit column** — Sticky left habit names & icons in HabitGridCard (`sticky left-0 bg-surface z-10/20`) for horizontal scroll readability.
- [x] **Universal sign out** — Added persistent Sign Out trigger to desktop Sidebar footer.
- [x] **Mobile responsive shell** — Fixed mobile bottom navigation (`MobileNav.tsx`), sticky mobile header (`MobileHeader.tsx`), and responsive layout margins in `AppLayout`.
- [x] **Interactive Home check-ins** — Multi-day check-in capability across the current week, optimistic UI updates, and aligned weekday headers (`Su`, `Mo`, etc.) in `TodayHabits.tsx`.
- [x] **Mood vs Habit correlation** — Replaced raw mood counter in `lib/insights.ts` with deep mood-habit correlation analytics in Stats Key Insights.

### Phase 13.1 — Polish pass (Smooth scroll, one heatmap, quick themes, Lumi in the app)

- [x] **Smooth in-page scroll** — `scroll-behavior: smooth` + `scroll-padding-top: 5rem` on `html`; the landing anchor links glide and now land *below* the sticky header instead of under it.
- [x] **One shared heatmap** — new `components/ui/ContributionHeatmap.tsx` (`ContributionHeatmap` / `ContributionHeatmapPanel` / `HeatmapLegend`); the landing page and the Stats card render the same component, so the product matches the promise.
- [x] **Stats card restructured** — tabs are now **Consistency** (default: 16-week contribution grid, "Last 16 weeks" left, real "N days tracked" right) and **By Habit** (the old per-habit monthly matrix); the old 52-week "Annual Activity" tab was folded in, its metrics moved above the panel. `lib/stats.ts`: `buildContributionCalendar` → `buildConsistencyWindow` (+ `consistencyLevel`), `ConsistencyDay` / `ConsistencyWindow` types.
- [x] **Quick theme swatches** — new `components/ui/ThemeSwatches.tsx` (Sage, Clay, Lagoon, Berry, Orchid); they float **above** the app Home "This Week" card and above the landing hero's product visual, right-aligned, and switch + persist the theme in one click.
- [x] **Lumi in the app** — mascot added to Stats (`streak`), Mood (`supportive`), Calendar (`idle`), Habits (`celebrate`) and Settings → About (`sleepy`), all in the page header's right-hand group with `showDialogue={false}`.
- [x] **Footer cleanup** — "Sign in" / "Create an account" removed from the landing footer.

### Phase 13.2 — Tooltip portal, heatmap-only card, settings honesty, theme clarity

- [x] **Heatmap tooltip fixed** — the tooltip is portalled to `document.body` (a `backdrop-blur` card is the containing block for `position: fixed`, so the tooltip was positioned by the card and appeared far away / under other cards). `z-[70]`, `w-max` so the date no longer wraps.
- [x] **"GitHub Style" badge removed** from the heatmap card.
- [x] **"By Habit" tab removed** — the Stats card is one view now (the shared consistency heatmap). `buildStatsHeatRows` / `StatsHeatRow` / `HeatCell` deleted as dead code.
- [x] **Theme swatches removed from the marketing page** (kept on the app Home "This Week" card).
- [x] **Settings audit** — 10 inert controls removed (5 notification switches, mood reminder time, default reminder time, default frequency, show completed habits, compact habit view, the bio field, the disabled "Custom" swatch). The Notifications popover became the **Mood** popover. `saveNotificationPrefs` deleted; `saveHabitPreferences` now saves the week start only; `saveProfile` saves the name only; the orphaned `prefs` object in `lib/habits-data.ts` deleted; `TIME_OPTIONS` / `formatTime12` deleted.
- [x] **Theme clarity pass** — new `--color-sidebar` token; the surface is lighter than the page in every light theme (the menu no longer turns into a dark slab); hairlines ≥ 1.33:1; muted text ≥ 4.5:1 everywhere; Lavender got its missing dark block (its sidebar logo and script quote were invisible at 2.21:1); neutral shadows; both navs now use the same active tokens.
- [x] **The theme now reaches every surface** — the five reference themes defined their DARK surfaces in neutral greys, so picking lagoon repainted the page and left the cards and the menu generic grey. Every surface family is now tinted with the theme's own hue, and the dark hierarchy is rail → page → cards in all ten themes.
- [x] **Theme swatches** — kept on the marketing page (above the landing hero's product visual), removed from the signed-in app home.

### Phase 14.0 — Strekly launched on Netlify

- [x] **Renamed to Strekly** — wordmark + tagline "Your streak, everyday." across the sidebar, mobile header, landing header/footer, login page, Settings → About, the export error copy, the package name, the README and every `context/` doc. `app/layout.tsx` gained `metadataBase` + openGraph/twitter. The mascot stays Lumi.
- [x] **Netlify site created** — `strekly.netlify.app` (site id `a25cd364-5339-4ca6-abd7-867509129b74`), `netlify.toml` (build `npm run build` → publish `.next`, `NODE_VERSION = 22`, `NEXT_TELEMETRY_DISABLED`, unpinned `@netlify/plugin-nextjs`), `.nvmrc` = 22, `.netlify/` git-ignored and ESLint-ignored.
- [x] **Env vars on the site** — `NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`, `NEXT_PUBLIC_APP_URL` (all scopes; production + deploy-preview + branch-deploy contexts). Set through the Netlify API: env vars are **account-scoped** and the write endpoint requires `?site_id=`, and the free plan rejects explicit `scopes` ("Upgrade your Netlify account to set specific scopes") — omitting `scopes` grants all of them.
- [x] **InsForge allow-list** — `allowed_redirect_urls` now carries the Netlify origin **and** its `/api/auth/callback`; applied with `npx @insforge/cli config apply` and re-verified with `config plan` ("No changes. Live state matches insforge.toml.").
- [x] **The middleware moved to the edge runtime** — `proxy.ts` → `middleware.ts` with `runtime: "experimental-edge"`. Netlify's OpenNext adapter cannot package a Node-runtime middleware on Next 16 (upstream, open: #3562 / #3575).
- [x] **GitHub repo renamed** to `CodeOfMugiwara/strekly`; `gh repo rename` rewrote the remote URL.
- [x] **Deployed and verified** — `https://strekly.netlify.app` serves the marketing page (title "Strekly - Habit & Mood Tracker", 12 "Strekly" hits, 0 "Habit Tracker"), `/login` renders, `/home` 307-redirects to `/login` (the edge middleware is live), `/api/auth/refresh` answers 405 on GET.
- [ ] **Auto-deploys** — connect the repo in the Netlify UI (the API cannot link a GitHub repo without the Netlify GitHub App).
- [ ] **Signed-in QA** — sign in with a real Google/GitHub account and click through Home, Habits, Mood, Stats, Calendar, Settings.

### Phase 14.1 — Starter habits for every account + the product tour

- [x] **The personal demo seed removed** — `lib/habits-data.ts` no longer seeds anything. The seed it used (`lib/mock-habits.ts` — the developer's own September 2026 tracker, with his habit names, statuses and first-person journal notes) and the `mockProfile` block holding `"Krishna"` are deleted. `lib/mock-home.ts` is gone; the mood scale moved to `lib/mood-scale.ts` and the quote to `lib/quotes.ts`.
- [x] **Universal starter set** — `lib/starter-habits.ts`: 3 categories (Health `#34D399`, Mind `#A78BFA`, Evening `#60A5FA`) + 6 habits (Drink water, Move your body, Read 20 minutes, Journal, Sleep by 11 PM, No phone in bed), **no completions, no notes**. Every emoji maps to a real `HabitIcon` glyph.
- [x] **Seeded at sign-up** — `app/api/auth/callback/route.ts` → `seedStarterHabits()`: categories first, then habits with their category ids. Guarded by an existence check, fail-closed.
- [x] **The product tour** — `components/tour/`: `TourProvider` (the engine), `TourOverlay` (the spotlight + card), `TourButton` (replay), `tour-steps.ts` (11 steps). Mounted in the app layout. Auto-runs once per browser on `/home`; replayable from Settings → About.
- [x] **Anchors added** — `data-tour` on the habit list, the week strip, the habits grid, a habit name, Add Habit, the mood chips, the calendar grid, the heatmap, the profile trigger, the name field and the theme swatches. `PopoverPanel` gained `triggerTourId`.
- [x] **`LumiMascot` gained `interactive={false}`** — decorative mode: no click, no speech bubble, out of the tab order. Lumi is the guide in the tour card.
- [x] **Verified** — `npx tsc --noEmit` 0 · `npm run lint` 0 · `next build` clean. The engine was driven end to end with Playwright + Edge on a temporary `/preview-tour` route (route deleted afterwards): every placement lands in the viewport, the card never covers its target, the popover step opens the panel itself and the panel is closed again when the step is left or the tour ends. All 12 anchor ids verified present in the source.

### Phase 15.0 — UI/UX Enhancement Audit & Reimplementation

- [x] **Habits Category Filter Tabs** — Category filter pills (`All Habits` + user categories with active counts and color dots) above habits grid in `HabitsView.tsx`; wired `filteredHabits` to `HabitGridCard.tsx` with friendly empty state fallback.
- [x] **Direct Calendar Mood Logging** — Interactive 1-tap mood chips with face icons, tooltips, active states, and a Clear button inside `DayDetailsCard.tsx` wired to `setDayMood` in `CalendarView.tsx`.
- [x] **Home 1-Tap Daily Mood Check-in** — Compact `HomeMoodCard.tsx` mounted in `/home` dashboard; queries user's `mood_levels` and today's `mood_entries` with optimistic UI updates.
- [x] **Repository Cleanup** — Removed accidental stray `command-palette/` root folder.
- [x] **Audit & Preservation Verification** — Verified all previous features (multi-color habit graph dots matching mood graph, sticky habit name column, WeekStrip snappy check-ins, mobile nav/header, status token alignment) remain intact and fully operational.
- [x] **Production Build Clean** — `next build` passes with code 0 across all 12 routes.

---

## Decisions Made During Build

### Phase 13.2 — Tooltip portal, settings honesty, theme clarity (complete)

- **The tooltip bug was a CSS containing-block bug, not a math bug** — `backdrop-filter` on the card made the CARD the containing block for `position: fixed` children, so the tooltip's viewport coordinates were interpreted relative to the card. The fix is a portal, not better clamping. Recorded as a rule: any fixed overlay inside a card must portal (`Modal` and `PopoverPanel` already did).
- **"By Habit" removed, not hidden** — the developer asked for the heatmap only. The per-habit monthly matrix, its builder and its types were deleted rather than left in the file as dead code.
- **Inert settings were removed, not implemented** — the developer's instruction was "check whether those settings actually work or else remove them". Ten controls saved a value no surface read. Implementing a notification system was out of scope; removing the switches was the honest move. The schema columns stay (a backup written by an older build must still import).
- **The Notifications popover became the Mood popover** — with the reminder switches gone, a bell icon would have been a lie. It is now a `Smile` icon holding the two mood controls that work, plus the read-only scale preview.
- **The bio field was removed** — it was saved and never displayed anywhere. The profile panel is now the name only, which is the field that drives the Home greeting.
- **The menu gets its own token** (`--color-sidebar`) — `--color-surface` was doing two jobs (cards AND the menu rail), which is why fixing the "dark slab" menu would have de-tinted every card. Separating them let the menu be fixed on its own.
- **Surfaces are always lighter than the page in light mode** — this is the rule behind "the menu turns a dark shade". The five reference themes had a tinted grey surface on a tinted page; they now use a near-white surface, so the menu reads as a clean rail.
- **Lavender needed a dark block** — it was the only theme without one, so the mode-agnostic rule leaked the LIGHT `--color-primary-text` into dark mode (2.21:1). The sidebar logo glyph and the script quote were invisible. Every theme now has both halves.
- **Shadows are neutral** — they were lavender ink in every light theme, so a clay card cast a violet shadow.

### Phase 13.1 — Polish pass (complete)

- **Smooth scroll = CSS native, not JS** — `scroll-behavior: smooth` on `html` gives the browser's own ease (accelerate then decelerate to a stop) with no animation loop, and the existing `prefers-reduced-motion` kill-switch already forces `auto !important`. A JS rAF scroller would have been more code for the same feel.
- **`scroll-padding-top: 5rem` came with it** — the sticky landing header is ~64px tall and the anchor targets had no scroll margin, so every jump hid the section's first line under the header. Found while implementing the smooth scroll.
- **ONE heatmap implementation, two surfaces** — `components/ui/ContributionHeatmap.tsx` is shared by the landing page and the Stats card. The developer's complaint ("the consistency heatmap on stats is not like the one on the home page") was a drift bug, so the fix was to delete the possibility of drift, not to copy pixels.
- **Stats card = Consistency (default) + By Habit** — the 52-week "Annual Activity" tab was folded into the new Consistency view rather than kept as a third tab: two heatmap styles in one card was the confusion being complained about. Its three metrics (check-ins, active days, avg daily rate) moved above the panel so nothing was lost.
- **"N days tracked" is real** — the count of days inside the 16-week window with at least one check-in. The landing page's mock label was also made honest (derived from its own sample instead of a hardcoded 143 that exceeded the window).
- **Day-level levels, not habit-level** — the shared grid is one cell per DAY (7 weekday rows × 16 week columns), matching the landing visual. The per-habit monthly breakdown stays available in the By Habit tab.
- **Swatches float ABOVE the card, right-aligned (developer correction)** — the first pass put them inside the card header; the developer asked for them above the card on the right. Rule recorded in the ui-registry so future swatch rows follow it.
- **Five themes, not ten** — Sage, Clay, Lagoon, Berry, Orchid (the reference-derived set). All ten remain available in Settings → Appearance; the quick row is the visually distinct half.
- **Mascot in the page header, not a narrow column** — the speech bubble is up to 320px wide, so Lumi sits in the header's right-hand group (next to the script quote) where there is room. `showDialogue={false}` keeps the bubble closed until tapped, so it never disturbs the layout on load.
- **One mood per surface** — Stats `streak`, Mood `supportive`, Calendar `idle`, Habits `celebrate`, Settings `sleepy`, Home auto. The app now shows all six faces.

### UI overhaul (complete)

- **F30 cancelled (developer):** "don't reset any data" — Danger Zone stays unwired → then removed entirely along with About link rows and the Data Management Reset row (dead chrome principle: don't advertise features the app won't let you use). SettingsPage.png's Danger Zone block is superseded by developer instruction
- **Settings = section nav + single unboxed pane (developer chose Option A):** Linear/Stripe pattern; sections Appearance/Preferences/Habits/Categories/Data/About; the card grid, nested bordered rows, ragged 3-col masonry and decorative gradient card were the identified "AI slop" tells — all removed; row-level icon bubbles kept (scanning aid, not a tell)
- **Header panels = anchored popovers, not sheets (developer):** "a small normal window that appears near the profile icon" — new `PopoverPanel` on `@radix-ui/react-popover` (second approved Radix primitive, same headless rationale as F28.1's dialog); `Sheet.tsx` + sheet CSS deleted; Profile/Notifications/Mood deliberately NOT folded into the nav sections (developer kept the icon surfaces)
- **Sign-out moved to the profile popover** — sidebar avatar removed (it showed a bare "U" from the email-prefix fallback while the app knew the real name); `UserMenu.tsx` deleted
- **Home mood section removed:** MoodSelector card + mood StatCard + QuoteCard deleted (mood logs on /mood only); stat row → 3 cards; loader trimmed (mood/levels/note fetches gone)
- **Home date nav removed:** dead buttons + hardcoded `mockHomeGreeting.dateLabel` ("Sat, 12 Jul 2026" — the screenshot bug); accent unquoted; subtitle is a static string (`welcome_message` stays dormant)
- **Home status colors unified (developer):** done=green/partial=yellow/missed=red matching the Habits grid tokens; every circle previously rendered a literal "✓" glyph regardless of status (missed read as red-check); proper Check/Minus/X icons now
- **This Week fixed:** data was always computed correctly — the tint-ring classes (`bg-primary/5` at <50%) were invisible; replaced with SVG stroke mini-rings (same language as Today's Progress); dead "See All →" removed
- **Add Habit unified:** filled primary on both /habits and Settings; Home's bottom Add Habit button wired to /habits (was dead)
- **Polish:** Stats flame bubble `bg-error-light` → `bg-warning-light text-warning-strong` (positive stat wearing error color); rate card bare `HabitIcon` (was emoji tiles); Quick Stats tiles → `bg-surface-alt` + tinted icon chips (were full-saturation fills); Mood Insights filters `count > 0` rows; `.scrollbar-hide` utility on mood strip + settings nav; Day Legend decorative ℹ removed
- **New dep:** `@radix-ui/react-popover` (developer-authorized UI-libraries sign-off from F28.1 extended to sibling primitive)

### Phase 7 — Feature 29 (complete)

- **Import = merge-upsert, never deletes** (architect-confirmed): rows in the file insert or overwrite; account rows absent from the file are untouched. Destructive wipe is owned by F30's Reset row — two adjacent "nuke everything" buttons would be indistinguishable. Confirm strip copy states the merge explicitly
- **Full payload = all 7 user tables** incl. profile settings + mood_levels: full round-trip (new login restores theme/prefs/notify flags/6-face scale with the data); profile upserts onto `auth.uid()` (exported id ignored; `created_at` omitted so existing row keeps signup time)
- **Natural-key upserts (implementation call during build):** mood levels upsert on `user_id,value` — an account always has its own seeded set, so id-matching would duplicate the scale (12 rows) on cross-account import; completions on `habit_id,date` (a cell cycled since export has a new id, same keys); mood entries + notes on `user_id,date`; parents (habits/categories) on `id`
- **Export delivery = the existing API route** (architecture primary path; stub replaced): a read, not a mutation; `Content-Disposition: attachment` belongs in a route handler; card triggers a same-origin programmatic anchor so SDK cookies ride the navigation; `?backup=1` query param switches the filename only (timestamped)
- **Version envelope:** `{ version: 1, exportedAt, profile, moodLevels, categories, habits, completions, moodEntries, notes }`, camelCase (file format ours, decoupled from DB columns); import rejects non-1 versions with a readable message before any write; zod schemas live in pure `lib/data-export.ts` (never exported from a `"use server"` file); client pre-checks with `parseExportFile`, server re-validates the same schema
- **Import confirm = inline two-step strip** (CategoriesCard delete pattern): file pick → summary line with counts ("9 habits · 42 completions … — merges into your account; nothing is deleted.") + Cancel/Import; status line below the list on completion/failure
- Chunked upserts at 500 rows/request; import revalidates all 6 app routes; Reset row stays inert (F30)

### Phase 7 — F28.1 Sheet rebuild (complete)

- **Developer: floating dropdown panels "look like AI slop" + rendered under the grid cards** → replaced with right-side slide-over sheets from the same two header icons; panel content (Profile / Notifications+Mood) unchanged, presentation rebuilt
- **`@radix-ui/react-dialog` approved as a dep** (developer authorized UI libraries; picked the headless primitive over full shadcn/21st.dev — shadcn would fight the Lavender Sky token system for two components; Radix is exactly what shadcn's Sheet wraps). First non-Recharts runtime dep; noted as a deliberate exception to the approved-deps rule with developer sign-off
- **Root cause of the overlap bug:** `.page-enter > *` used `animation-fill-mode: both`, which retains the final `transform: translateY(0)` forever — a lingering transform makes each page section a permanent stacking context; the grid (later DOM sibling) always painted over the header regardless of the panel's z-50. Fixed globally: `both` → `backwards` (identical entrance; transform dropped post-animation). Latent same-class bug on Stats insights dropdown / Mood period dropdown also healed
- New shared primitive `components/ui/Sheet.tsx`: overlay z-60 + content z-61 (beats page sections at auto), `w-[26rem]`, sticky header (icon + title/description + close), scrollable body, `sheet-in`/`sheet-out` CSS animations with Radix Presence unmount, reduced-motion safe
- `SettingsQuickPanels` deleted → `SettingsHeaderActions` (triggers + Sheets); `ProfilePanel`/`NotificationsPanel` lost their local headers (Sheet header owns them)

### Phase 7 — Feature 28 (complete)

- **Settings layout redirect (developer, mid-architect):** ProfileCard + NotificationsCard + MoodSettingsCard removed from the grid — Profile and Notifications/Mood open as header icon dropdowns (`SettingsQuickPanels` next to the script accent); this supersedes the design-literal 3-column card layout of SettingsPage.png for those three cards
- **Mood Settings card folded into the notifications panel** (developer: "what is the need of mood settings card remove it") — Mood subsection at the bottom of NotificationsPanel: enable notes / reminder time / show on calendar, auto-save via new `saveMoodSettings` action; scale row = read-only 6-face preview from DB `mood_levels` (`MoodFace size={26}`) per the architect "best option" pick
- **`saveMoodSettings` revalidates `/settings`, `/mood`, `/calendar`, `/`** — the flags are read by those page loaders; flipping "Show Mood on Calendar" should affect the calendar on next visit without a hack
- **Grid rebalanced:** col1 Appearance/Categories/Manage Habits; col2 Habit Preferences/Data Management/About; col3 Danger Zone/decorative (developer: previous col1 forced a long scroll)
- **Dropdown mechanics:** one panel open at a time (shared state), outside mousedown + Escape close (UserMenu precedent), `w-[22rem]` anchored `right-0 top-full`, script accent `hidden sm:flex` so icons fit on narrow widths
- **Mood reminder time stays stored-but-inert** (no push — hard rule 7), consistent with habit reminder time (F26)

### Phase 7 — Feature 27 (complete)

- **Scope: name + bio only** — `tracker_title` / `welcome_message` schema columns stay dormant, no UI (developer decision; old-tracker setup fields not in SettingsPage.png)
- **Text-field auto-save shape:** 500ms debounce + flush-on-blur + `lastSavedRef` trimmed-value comparison (whitespace-only edits don't fire the action); toggle/select cards keep save-on-every-change (F26). Sequence counter still guards status
- **Empty name → email prefix:** `profileDisplayName(display_name, email)` = trimmed saved name → email local-part `.slice(0, 3)` → `"You"` — used by Home `HomeDashboard.displayName`; UserMenu mirrors the same fallback after DB→OAuth priority
- **UserMenu reads DB `profiles.display_name`** via client SDK select (RLS owner-read already in place); name priority = saved profile → OAuth name/metadata → email prefix; failure of the select degrades silently to OAuth name
- **`saveProfile` revalidates `/` as well as `/settings`** — Home greeting is a server component; without it the greeting would stay stale until a hard navigation
- **Name max 50 chars** (UI `maxLength` + action validation); schema is unbounded text

### Phase 7 — Post-F25.5 (complete)

- **Reveal rebuilt as a custom Area shape (developer: slower still; animate only the curves, not the axis; new entries should animate only the new part):** new `components/ui/RevealAreaShape.tsx` — `makeRevealAreaShape({ dot })` factory returns a shape that wraps Recharts' public `AreaRevealShape` in clipPath `<g>`s and renders dots inside the same clips (Recharts renders dots in a sibling layer, which is why the built-in reveal left dots popping instantly). Axes/grid are separate Recharts layers → they appear instantly; only curve+fill+dots wipe
- **Entrance = 3s easeOutCubic RAF wipe front** on mount / period switch / month nav (wrapper key on period+bounds still remounts). **Entry change = 1.8s local band**: the shape diffs consecutive `points` values itself (no props from MoodView) and animates a band [changed−1..changed+1] — new segment + dot draw in behind the front, old segment erases ahead of it (C-shaped polygon exclusion clip on the old points layer); rest of line static. Removals retract via the same front
- **Post-F25.4's `moodRev` key + `rev` prop removed** — remounting per entry would replay the full 3s entrance; the band handles it in-place. `.chart-sweep` class + keyframes deleted from globals.css (`.chart-dot` kept, unused)
- **Strict Mode strand bug (developer screenshot: empty graph in dev):** the RAF-cleanup effect only cancelled the frame — Strict Mode's setup→cleanup→setup left `entranceDone=true` with the band stuck at its zero-width start frame (curve+dots clipped to nothing, axes visible). Fix: cleanup now also resets `entranceDoneRef` + `setBand(null)` so the entrance restarts (worst case = no animation, never invisible); degenerate 0-width spans (ResponsiveContainer pre-measure, all x equal) no longer burn the entrance
- **Fill wedge bug (developer screenshot):** `RevealAreaInner` destructured `baseLine` out of the shape props (used it for the clip's vertical bound) but never forwarded it to the three `<AreaRevealShape>` renders — the fill closed chord-wise between first and last point instead of dropping to the axis, producing a triangular wedge. Fixed by passing `baseLine` at all three render sites (plain, old-band layer, new-band layer)
- **Streak History migrated to the same shape** (same 3s curve-only entrance; dots still every 3rd index) — both area charts share one reveal mechanism, per the "same sweep on both" precedent
- `isAnimationActive={false}` kept on both Areas (Recharts point interpolation would morph the whole curve — the clip owns all motion); `dot={false}` — dots now come from the shape's callback
- Deep-import trap avoided: Recharts 3 ships no per-file `.d.ts` next to `es6/` — only public exports (`AreaRevealShape`, `AreaRevealShapeProps`) are usable without a local ambient module

### Phase 7 — Post-F25.4 (complete)

- **Sweep slowed + smoothed (developer: slower, smoother, like the pie):** `.chart-sweep` 1.3s `cubic-bezier(0.22,1,0.36,1)` → **1.8s `cubic-bezier(0.33,1,0.68,1)`** (easeOutCubic — gentler start, long glide; pie-feel while staying a clip wipe so it's strictly left→right and dots ride the line); shared class → Streak History slows identically (F25.3 "same sweep on both charts" consistency kept)
- **Sweep replays on new/removed mood entries (developer):** `MoodView` keeps a `moodRev` counter bumped in `handleSetMood`; `MoodGraphCard` includes `rev` in the wrapper key — same remount mechanism as period-switch; clicking a chip re-wipes the graph slowly with the new point
- **Second click on active mood chip removes the entry (developer):** `setDayMood` accepts `moodValue: number | null` — null deletes the `mood_entries` row; `handleSetMood` toggles (optimistic delete + null call when `selectedValue === value`); Mood page legend chips only — Home mood card stays select+Save flow (no toggle)
- 90d/Year range data doesn't refetch on entry change (pre-existing for adds — unchanged; month view is the live-updating one)

### Phase 7 — Post-F25.2 fixes (complete)

- **Habits today-column highlight (developer: rings collide/overflow):** per-cell `ring-2 ring-offset` removed — today's day number in the header is now a `bg-primary text-primary-foreground` pill; today's unset cells + empty note cell get `bg-primary-lightest/60` column tint; status cells keep their solid color (column reads via header pill + tinted neighbors)
- **Settings Manage Habits card (developer: edit/update/delete in settings):** new col1 card under Habit Categories — rows (HabitIcon 36 + name + category/archived caption + Pencil/Trash2); Edit opens existing `HabitFormModal` (update + Archive/Restore + two-step delete already lived there); row Trash = inline two-step confirm strip (CategoriesCard pattern, warns completions go too); header "+ Add Habit" via new `SettingsCard` `action` slot; `loadSettingsData` gains habits query; `revalidateHabits()` now also revalidates `/settings`
- **HabitIcon SVG glyph library (developer: custom SVG logos like mood page, bigger habit logos):** `components/ui/HabitIcon.tsx` — 18 hand-drawn glyphs; render-time mapping emoji→glyph then name-keyword fallback; unknown emoji → bare-emoji fallback (DB untouched, no migration); sizes: grid 32, home 40, calendar 30, settings 36, stat cards 44; `BrandLeaf` replaces sidebar 🌿 (h-12 bubble); Home 🔥/👑 stat bubbles → flame/crown glyphs; dead "⋯" button on Home habits card removed; empty-state Add Habit now navigates to /habits; **follow-up restyle (developer):** no background circles — vivid per-glyph `text-*` color + soft glow (`drop-shadow` ×2 in currentColor), glyph scaled to size×0.72
- **Mood graph animation v2 (developer: dots lagged the line):** per-dot stagger dropped — `.chart-sweep` clip-path wipe (inset 100%→0, 1.2s ease-out) on the chart wrapper reveals line + fill + colored dots as ONE left-to-right sweep; wrapper `key` on period+bounds still replays on period switch; same treatment on Streak History
- **Calendar fully reverted (developer: previous UI was good):** DayModal deleted; inline DayDetailsCard restored (recreated from prior version, kebab stays removed); two-column layout back; day click = select only; kept: cal-cell cascade, current-month default, Today button on Habits
- **Sync gap closed:** `saveDayNote`/`deleteDayNote` now revalidate `/calendar` + `/` (were `/habits`-only); completions already revalidated all four routes — Habits grid and Calendar checklist share `habit_completions` so marks match across pages on navigation

### Phase 7 — Post-F25 UX pass (complete)

- **Full theme chrome (developer: "changing the theme only changes icons/buttons — it should change the entire theme"):** `public/UI palette/*.png` are the theme source of truth — each color theme now rethemes background/surface/surface-alt/surface-hover/border trio/text trio/primary tints/heat ramp in **both** light and dark via `[data-theme][data-color-theme]` blocks; components untouched (token-only rule pays off). Status colors (done/partial/missed, success/warning/error) deliberately NOT themed
- **Primary retunes from sheets:** Peach orange `#fdba74`→coral `#fb6b6b` (dark `#ff9a8f`); Ocean sky `#7dd3fc`→blue `#4e8af7` (dark `#68b8ff`); Mint primary kept `#34d399` (F20 GitHub-heat decision); Rose has no sheet — neutrals derived by analogy
- **Dark heat ramps for every theme** (was mint-only — peach/ocean/rose dark heatmaps were purple before)
- **Data entrance animations (developer: mood graph not smooth + want everywhere):** custom Recharts `dot` render props bypass Recharts' built-in dot animation (why the pie felt smooth but the mood graph didn't) — fixed with CSS `.chart-dot` stagger keyed off `index`; all Area/Bar/Pie get explicit `isAnimationActive` + 900–1100ms ease-out; MoodGraph/CompletionOverview ResponsiveContainer keyed on period/granularity/bounds so period switches replay the draw; CSS utilities `.heat-cell`/`.cal-cell`/`.rate-bar`/`.ring-draw`/`.modal-*` with inline delay stagger; all `prefers-reduced-motion` safe
- **Calendar day click → popup (developer request):** `DayModal` replaces inline DayDetailsCard (deleted) — mood + note read/edit + checklist, prev/next inside, Esc/backdrop close; MonthCard full-width, Overview/Legend/decorative now a 3-col row; modal rendered outside `.page-enter` fragment so nth-child delays don't lag it; dead MoreVertical button gone with the old card
- **Habits page default month = current real month** (developer confirmed the "September" complaint was Habits, not Settings — loader no longer pins to latest-activity month; Sept seed still reachable via nav); MonthNav gained a Today shortcut (shown only when off current month, Calendar-button style)
- **All modals animated:** DayModal, NoteModal, HabitFormModal, NotesCards View All share `modal-backdrop`/`modal-panel` classes

### Phase 7 — Feature 25 (complete)

- **Hydrate + chrome (developer-confirmed):** `loadSettingsData` returns `{ categories, profile }` (one server client, Promise.all; schema defaults as fallback when profile row absent); controls seed from profile and update **local state only** — no persistence until F26–30 add save actions on top; design typo "Krisha" ignored (real name shown)
- **Design-literal 3-column layout:** col1 = Appearance, Categories, Habit Preferences, Data Management; col2 = Notifications, Mood Settings, About; col3 = Your Profile, Danger Zone, decorative card (Categories kept despite missing from PNG — F11 decision, F25 list marks it done)
- **`SettingsRow` shared primitive** (`components/settings/SettingsRow.tsx`): icon bubble (`h-8 w-8 rounded-lg` default `bg-primary-lightest text-primary`, `iconClassName` override) + title/caption + right control; `settingsSelectClass` export for compact chevron selects; `-mx-1 divide-y divide-border` row lists
- **`SettingsCard` + `iconClassName`** — tone overrides: Data Management = `bg-success-light text-success-strong`, Danger Zone = `bg-error-light text-error` (design's colored header bubbles)
- **Row icon tones:** Streak Alerts = error bubble (flame), Missed Habit Reminder = `bg-surface-alt` neutral (off by default like schema), Backup = success, Reset rows = error; danger-row text = `text-error` / `text-error-foreground` caption
- **Buttons:** normal actions = `Button variant="secondary" size="sm"` with icon; danger actions = secondary + `border-error bg-error-light text-error` (design's light-red buttons, not solid `variant="danger"`)
- **Time selects:** `formatTime12` + `TIME_OPTIONS` (every 30 min, 12-hour labels) in pure `lib/utils.ts` — profile stores `HH:MM` 24h (`08:00` → "8:00 AM", `21:00` → "9:00 PM")
- **Mood Scale options:** `5 Levels (Very Happy → Very Sad)` / `7 Levels (More fine-grained)` — value from `mood_scale`; 7-scale migration itself stays F28
- **Profile card:** Name input with decorative pencil (absolute, pointer-events-none); bio `Textarea` `maxLength=100` + live counter inside box bottom-right (`pb-6` on textarea)
- **Danger Zone:** 3 red rows (Clear/Delete/Reset, no per-row icons per design) + note line "These actions will be enabled in a later phase."; distinct from Data Management's own Reset All Data row (both exist in PNG)
- **About:** identity block (Habit Tracker / Version 1.0.0 / tagline / "Made with ♥ for a brighter tomorrow.") + 4 chevron link rows (Keyboard Shortcuts, Send Feedback, Privacy, Terms of Use) — **link destinations undecided, chrome only**
- **Schema gap flagged for F26:** `default_frequency` column does not exist (select is chrome; persistence needs a migration)
- Native `<select>` (habit-form precedent) not the `Dropdown` primitive — form-style selects with long option labels

### Phase 6 — Feature 24 (complete — Phase 6 closed)

- **Classification thresholds (developer-confirmed):** weighted day ratio over ALL active habits (unlogged habit = 0-weight slot in the denominator — dayCompletionRatio needs full-length array, not logged-only, or 1-of-1-logged would fake a Great): **Great === 1.0** (strict — legend "All habits completed"), **Okay ≥ 0.5** ("Most"; all-partial day = exactly 0.5 → Okay), **Tough > 0** ("Some"), **No Data === 0** (no rows, all missed, or pre-habit-creation days)
- **Ring numerator = Great + Okay** ("strong completion", developer-confirmed) — design's 71% ≈ (12+9)/31 supports the top-two-classes reading; caption `{strong} of {elapsed} days`
- **Month-to-date denominator (developer-confirmed):** current month classifies days 1→`todayKey`; past months full month; future months → elapsed 0 ("0 of 0 days", percent 0, no divide-by-zero); future days of the current month excluded from tiles AND denominator — matches F18 month-to-date convention, avoids early-month No-Data punishment (design's literal "of 31" belongs to its fake end-of-month data)
- `classifyMonth(completions, habits, year, month, todayKey)` pure in `lib/calendar.ts` (uses `dayCompletionRatio`); recomputed each render → optimistic checklist toggles update tiles/ring live; classification is for the **viewed** month (overview nav shares `viewMonth`)
- `DESIGN_OVERVIEW` deleted; tile hex colors (`#34D399/#7DD3FC/#FC8FA5/#C7CCD1`) moved to a local `TILES` const in `MonthlyOverviewCard` (data-style constants, inline style — HABIT_TINTS precedent)
- **Day Legend:** labels unchanged (they ARE the class definitions — static by design); mood faces switched from `mockMoodLevels` (mock-home leftover) to real DB `mood_levels` via new `levels` prop
- `show_mood_on_calendar` already honored since F23 — no new work
- Zero active habits → every elapsed day No Data; ring 0% — honest empty

### Phase 6 — Feature 23 (complete)

- **Real-only, no seed** (developer: "read-only [data] first" — meaning read existing DB rows, not read-only features): `loadCalendarData` one-pass fetch (active habits by sort_order, ALL completions filtered to active ids, all mood_entries → date map, all daily_notes → map, mood_levels, profile flags); `lib/mock-calendar.ts` deleted; empty accounts get honest empty states
- **Client-authoritative state (F15 no-snap):** `CalendarView` seeds `completions` + `notes` state from props once at mount; viewMonth/selectedKey start at **real today**; revalidated props never re-sync state (component identity preserved across RSC re-renders — no view snap); mutations optimistic with snapshot revert; per-habit in-flight guard prevents cycle races
- **Checklist = full cycle** (developer confirmed): unset→done→partial→missed→unset via existing `setHabitCompletion`; **missed = `border-error bg-error-light` + X icon** (distinguishes from unset neutral box); done/partial as F22; rows are full-width buttons with focus rings
- **Notes (developer hard requirement):** clicking a day shows that day's saved note for reading; no note → textarea + Save directly available; saved note → text + Edit affordance → Save/Cancel/Delete; gated by `enable_mood_notes` (whole section + Edit Day button hidden when off); draft resets on day change via render-phase adjustment (F14 pattern, not setState-in-effect); save = await-then-commit with pending state, delete = optimistic revert
- **Edit Day = jump/focus the note editor** (openEditor: sets draft, editing, focus nonce → effect focuses textarea); **mood display-only** on calendar (logged from Home/Mood page only)
- **`show_mood_on_calendar` honored now** (column exists, default true): `buildCellMap` skips faces when off; toggle UI arrives F28
- **Week starts Sunday** hardcoded (design-literal) — `week_starts_on` column honored when F26 ships the setting
- **`DESIGN_OVERVIEW`** (design-static 71% / 12/9/6/4 + tile hexes) moved to pure `lib/calendar.ts` (HABIT_TINTS precedent — no hex in components); F24 computes real classification
- **Overview nav** shares viewMonth (label follows; numbers stay design-static until F24)
- **Cross-page `page-enter` animation (developer request):** `@keyframes page-enter` fade+rise (12px, 0.6s cubic-bezier(0.22,1,0.36,1)) on `.page-enter > *` with nth-child delays 0→0.3s (6 steps), `prefers-reduced-motion: none`; applied to Home, Habits, Mood (inner wrapper so children stagger — outer keeps pending opacity), Stats, Calendar, Settings roots; Recharts keeps its own mount draw
- Build artifact note: Next 16 build legend shows `○ /calendar` (also mood/settings) but prerender-manifest contains only login/_not-found/_global-error HTML — those routes still render per request; no action needed

### Phase 6 — Feature 22 (complete)

- **Interactive mock (developer-confirmed, F09 pattern):** month nav, Today, cell click, and Day Details prev/next are real local state in `CalendarView` (`viewMonth` + `selectedKey`); mock keyed full `YYYY-MM-DD` (the F09 day-of-month bug not repeated); checkboxes + Edit Day + kebab stay inert until F23
- **Cell dots = one dot per habit with a logged status** (done→`bg-success-strong`, partial→`bg-warning`, missed→`bg-error`, no entry→no dot) — reconciles design's mixed-color multi-dot cells with its day-level Day Legend copy; gray legend dot = "no habits completed" day class (F24)
- **First paint = design:** `MOCK_TODAY_KEY = 2026-07-12`, `MOCK_VIEW = July 2026`; Today button returns there; July fully populated (31 status strings verified 7 chars, mood every day, 3 notes incl. the design's Jul 12 note); day 12 = "5 / 7 completed" per build-plan (design PNG shows 4 checks vs 5/7 header — internal inconsistency, header wins)
- **Mock scope:** non-July months render date-only cells (honest empty); Day Details empty states ("No mood logged." / "No note for this day."); mood faces always shown (profile flag `show_mood_on_calendar` arrives F28)
- **Monthly Overview:** nav shares `viewMonth` with the main card; numbers stay design-static (71%, 12/9/6/4) until F24 thresholds; tile hexes live in mock data (cross-cutting rule 1 — inline style allowed); ring = inline SVG (Home StatCards pattern, no Recharts needed for one arc)
- **Decorative card reused** `StatsDecorativeCard` (quote prop) — no new gradient component
- **Grid helpers** pure in `lib/calendar.ts` (`buildMonthCells` Sun-start dynamic week count, `shiftMonth`/`shiftDay`, labels) — F23 reuses for day nav
- Day Legend divider removed (design has none — continuous list)
- Headless session: signed-in visual QA vs CalenderPage.png (light + dark) = carry-forward with F17–21 backlog

### Phase 5 — Feature 21 (complete — Phase 5 closed)

- **Insights periods = calendar ranges anchored to real today** (consistent with F18 pills; Stats has no month nav): This Month = 1st→today; Last 3 Months = 1st of month−2→today (Date arithmetic rolls January into the prior year); This Year = Jan 1→today; pure helper `insightRangeFor(period, today)` lives in `lib/insights.ts`; recompute is client-side (all data already loaded — no server action)
- **Strongest-habit reuses `weightedHabitRate`** (F19 deferral paid off): done=1/partial=0.5 over period ∩ since `created_at` — one rate definition across KPIs/Overview/rate card/insights; `computeKeyInsights` gained a `habits` param (`{id, name, createdAt}[]`, StatsView passes `activeHabits`); ≥0.5 display threshold kept; **title now names the habit** ("Your X habit is your strongest.") matching StatsPage.png copy
- **Loader fetches ALL `mood_entries`** (date filter removed from `stats-data.ts`): the range filter inside `computeKeyInsights` makes mood counts honest for any period; personal-scale one-pass accepted (same tradeoff as F12 Habits)
- **Streak History = verify only** — already real since F18 (series/chip/empty state correct); no code changes
- **`lib/mock-stats.ts` deleted** (zero importers since F18)
- **Review 3 minors fixed same session:** (1) `Dropdown` made generic `Dropdown<T extends string>` — `DropdownOption<T>` options annotate the union; removed `as` casts in KeyInsightsCard AND MoodGraphCard (bonus); (2) mood-logged insight got its own icon `"mood"` (lucide Smile, `bg-warning-light text-warning-strong`) instead of colliding with weekday/weekend calendar icon; (3) `days.length === 0` now returns the shared `KEEP_GOING` fallback instead of `[]` (blank card — unreachable but honest)
- Ranges/thresholds otherwise unchanged: weekday/weekend ≥5%, trend ≥10%, max 4 rows, period-generic "this period" copy
- Carry-forward: browser QA of dropdown (3 options, mood counts across periods) joins F17–20 QA backlog

### Phase 5 — Feature 20 (complete)

- **Scope = remaining gaps only** (grid/geometry/tokens/`none` cells/axis labels shipped in F17/F18): F20 delivered (a) styled hover tooltip, (b) GitHub-exact Mint heat ramp
- **Tooltip = option (b)** chosen over CSS-only (overflow clipping) and native `title` (slow/unstyled): cell `onMouseEnter` stores `getBoundingClientRect`; single fixed-position tooltip measured via offscreen first pass (`left:-9999`), X-clamped to viewport, flips below when cramped; clears on cell leave / container leave / any scroll (capture); `role="tooltip"`; content = habit name + "Oct 11, 2026 · Completed"
- **Native `title` removed** (avoids double tooltips); cells gained `role="img"` + `aria-label` for screen readers; **touch loses long-press tooltip** — accepted (chart tooltips already mouse-only)
- **Mint = GitHub-exact greens** (existing Settings theme retuned, NOT a new theme — confirmed with developer): light `heat-0…4 = #ebedf0/#9be9a8/#40c463/#30a14e/#216e39`; **new `[data-theme="dark"][data-color-theme="mint"]` block** `#161b22/#0e4429/#006d32/#26a641/#39d353` — only theme with a dark heat block (theme heat was light-scoped, so dark+Mint would have stayed purple); role vars reference `--color-heat-*` so cells + legend recolor automatically
- **`heat-0` themed for Mint** (themes previously didn't touch empty cells); other themes unchanged; Mint primary stays `#34d399`
- **New tokens** `--color-tooltip: #1f2328` + `--color-tooltip-foreground: #ffffff` (same both modes, GitHub-style) — no hex in components
- Month labels: existing dynamic axis verified, no change needed
- Review: 1 carry-forward (browser theme QA — 5 themes × light/dark click-through)

### Phase 5 — Feature 19 (complete)

- **Rate math switched to weighted:** `weightedHabitRate` (done=1/partial=0.5/missed=0) replaces `habitRate` (which gave partial full credit — any non-missed counted as success). Percentages drop where partials exist; now consistent with Overview/KPI weighting
- **"Active days" = elapsed period days ∩ days since habit `created_at`** — mid-month/mid-period habits aren't penalized for pre-creation days; window `max(periodStart, createdDate) → periodEnd`, guard returns 0 when created after period end
- **Color priority:** `habit_categories.color` hex (via new `StatsData.categoryColors` record) → `HABIT_TINTS[i % n]` fallback; category delete already nulls `category_id` (FK SET NULL) so fallback is automatic; failed category fetch degrades to tints
- **Period stays month-to-date** (pills remain card-local per F18 — rate card has no control in the design)
- Loader select += `category_id`, `created_at` + new `habit_categories` query; `StatsHabit` extended with `categoryId`/`createdAt`
- Sort order = habit `sort_order` (design order matches habit list, not sorted by %); insights' strongest-habit math untouched (F21 scope)
- Review: 0 issues

### Phase 5 — Feature 18 (complete)

- **Option B — flip everything to real in F18**: loader fetches once, all six data surfaces real; F19–21 become refinement passes (category colors, heat tooltips, insights-dropdown wiring). `lib/mock-stats.ts` now has zero importers — delete candidate at F21
- **Pills card-local** (design-literal): Daily/Weekly/Monthly/Yearly drives Completion Overview only; Insights keeps its own dropdown (chrome until F21); heatmap + streak chart = current real month, ignore pills
- **Ranges anchored to real today:** Daily = month-to-date (day 1→today, no future bars); Weekly = last **12** Monday-start weeks (developer: 12, not 8); Monthly = last 12 months; Yearly = years with data ∪ current, cap 5. Days before first recorded completion are clipped (no leading zero bars)
- **Rate math:** weighted done=1/partial=0.5 over active habits × **elapsed** days (`buildCompletionSeries`/`bucketOf`); tooltip "habits" (Daily) vs "check-ins" (multi-day)
- **KPIs:** Overall Completion = month-to-date vs last full month; streak delta = current − `streakEndingOn(last day of prev month)`; Active Habits = active/total incl archived; delta rendering sign-aware (down = error + ArrowDown)
- **Archived-habit filter (review fix):** both `home-data.ts` and `stats-data.ts` now filter completions to active habit ids — archived habits' rows no longer inflate rates (capacity is active-count; numerator must match)
- **Home/Stats alignment (review fix):** Home Quick Stats current-month range changed from full-month to **month-to-date** (`today` as range end) so mid-month rates match Stats — previously Home divided by full month days while Stats divided by elapsed
- **Streak series (review fix):** `streakSeriesForMonth` counts runs **across month boundaries** (day-1 includes last month's run; measured via `activeRunEnding` walk) so the chart's last point always equals the chip/`accountDayStreak` (incl. today's grace rule); empty state = `maxVal === 0` (reachable)
- **Heatmap `none` cell:** future days + never-logged past days render `bg-heat-0`; legend stays the design's 3 chips
- **Weekly axis:** `interval={1}` (12 long labels like "Jun 30" would crowd)
- **Tints:** `HABIT_TINTS` array in `lib/stats.ts` indexed by habit order (category colors = F19)
- Module split: `StatsData` type lives in pure `lib/stats.ts`; `lib/stats-data.ts` holds the server loader (F14 Turbopack rule)

### Phase 5 — Feature 17 (complete)

- **Heatmap = custom CSS grid, no library** — developer proposed `uiw/react-heat-map` or shadcn-heatmap; rejected together because (a) GitHub layout is weeks×weekdays but Stats design is habits×month-days, (b) hard rule 4 / build-plan rule 5 = Recharts-only deps, (c) shadcn components are copy-paste anyway and wouldn't match `heat-0…4` tokens without rewriting
- Heat cells use **role vars** (`--heat-cell-missed/partial/done` in globals.css), not raw `bg-heat-*`: light maps 1/3/4 (pale→deep — raw 1/2/4 made partial≈missed), dark maps 1/2/4 (dim→bright) — both follow GitHub's light-top-dark / dark-top-bright structure
- **globals.css color-theme blocks split:** vivid (`primary`/`primary-dark`/`accent`) apply in both modes; tints (`primary-light(est)`, `accent-light`, `accent-foreground`, heat) scoped to `[data-theme="light"]` — combined blocks let light hexes (#f0e7ff) override dark surfaces, white-washing nav pills, bar-chart hover cursor, callouts, and decorative cards in dark mode
- Decorative script text on tinted cards switched `text-primary-dark` → `text-accent-foreground` (5 components: Stats/Mood decorative, Home Inspiration+Quote, SettingsShell) — primary-dark unreadable once tints render dark
- Mock = `lib/mock-stats.ts` matching StatsPage.png exactly (July 2026, 7 design habits, 78%/12/28/7/7, insight copy verbatim); throwaway once F18–21 wire real data
- Structure: non-async page → `StatsView` client (no loader needed for mock); components in `components/stats/`
- Granularity pills + Key Insights dropdown = real toggle state, content static (Daily/month) until F18/F21
- Per-habit bar colors = hex in data file applied via inline style (allowed by cross-cutting rule 1)
- Bar series uses half-step weighted `done` (4.5/5.5…) so percent = `round(done/7*100)` gives design-like variance while tooltip stays derived ("6/7 habits" on Jul 8 = 86%)
- Decorative card = gradient-wash + script + glyphs approximation (exact scenic art stays polish pass)
- Review: 3 minors fixed same session (dead `captionMuted`, merged lucide import, bar variance); signed-in visual QA vs StatsPage.png still open (carry-forward with F13–16 QA)

### Phase 4 — Feature 16 (complete — Phase 4 closed)

- **Pattern rules (first hit wins):** weekend-vs-weekday average → first-half vs second-half month trend → `null` (honest fallback copy). Sufficiency bar: ≥3 logged days per group, ≥0.5 average gap
- **Scale-agnostic by construction:** comparing group averages + `Felt ${label.toLowerCase()}` phrases means no `mood_scale` branching — 5- and 7-scale both correct (7-scale migration stays Feature 28)
- **Pure fns in `lib/insights.ts`:** `buildMoodInsightRows(distribution, levels)` + `computeMoodPattern(entries, year, month)` — client-safe, computed in MoodView from loaded month data
- **Fallback copy:** zero data → "Log a few moods to start seeing patterns."; data but no qualifying pattern → "Not enough data to spot a pattern yet."
- **Removed:** hardcoded `"You felt happier on weekends this month!"` and the component-local value→phrase mapping (redundant with label-derived phrase on 5-scale)

### Phase 4 — Feature 15 (complete)

- **F15 scope:** wire the graph period dropdown to real ranges — the original build-plan month-wiring already shipped in F14; dead dropdown was the remaining gap
- **Graph-only:** dropdown drives MoodGraph card only; Distribution + Insights stay on the selected month (MoodPage.png puts no period control on those cards; sidebar copy is month-language; F16 owns Insights)
- **Anchoring:** all periods anchor to the month selected in month nav — `month` = selected month; `90d` = selected + 2 prior months; `year` = Jan 1 → end of selected month. Month nav shifts the whole window; nothing anchors to real today
- **Data flow:** `month` reuses already-loaded month data (no fetch); wider periods fetch via `getMoodRange` action → `loadMoodRange` (date-keyed entries/notes); period state lives in MoodView, flips only after fetch succeeds (revert-free on failure — stays on previous period)
- **Series model:** unified `GraphSeriesPoint { key, tick, dateLabel, value, note }` in `lib/mood-view.ts` — `buildMonthGraphSeries` (day-number ticks) vs `buildRangeGraphSeries` (date ticks on month starts, `""` otherwise); note rides on the point so tooltip needs no separate notes prop
- **X-axis:** `dataKey="tick"` + `interval={0}`; month view keeps design's 1–31 day numbers
- **Subtitle dynamic:** "this month." / "over the last 3 months." / "this year."
- **Y-domain** derived from `levels` (supports 5- and 7-scale — was hardcoded `[1,5]`)
- **Range refetch on month nav:** if period ≠ month when nav fires, range refetches for new bounds; fetch failure falls back to month period
- **Bugfixes bundled:** tooltip date was hardcoded `Jul {day}, 2026`; NotesCards draft reset only keyed on day (stale text when navigating months on day 1 — now `year-month-day`); `saveDayNote`/`deleteDayNote` now also `revalidatePath("/mood")`
- **Deferred:** Daily/Weekly/Monthly pills still chrome-only; pattern callout still hardcoded placeholder (Feature 16)
- **Review fixes (5/5):** **mutations no longer `revalidatePath("/mood")`** — replacing `initialData` after a mutation snapped the viewed month back to the server's current month (and left range bounds stale); `/mood` is dynamic and refetched on navigation, so client view state is authoritative after load. Fetch failures (month nav, period switch, range fallback) now surface a visible `loadError` line under the page header (was console-only). Dropped unused `MoodRangeData.levels` + `loadLevels` helper (card uses month-loader levels — same per-user rows)

### Phase 4 — Feature 14 (complete)

- Real-only, **no demo seed** (developer choice) — empty states everywhere when no data
- Module split forced by Turbopack: `lib/mood-view.ts` (pure types + builders, client-safe) vs `lib/mood-data.ts` (server loader with next/headers) — importing server loader through a shared module broke the client bundle
- `actions/moods.ts` +`setDayMood` (mood-only upsert) +`getMonthMood` (client month-nav fetch); `saveMoodCheckin` now also revalidates `/mood`
- Legend chips = clickable setters for selected day (optimistic, revert on fail); active chip = `border-primary bg-primary-lightest`
- Notes card: explicit Save; empty save deletes note; respects `enable_mood_notes`; View All = modal (`fixed inset-0 z-50` recipe)
- `lib/mock-mood.ts` deleted
- Month nav: `getMonthMood` action; pending dims page (`opacity-70`)
- Face SVG + glossy gradient landed in F13 follow-up (user request): radialGradient overlay (white 45% top-left → black 6% bottom-right), useId for unique gradient ids

### Phase 4 — Feature 13 (complete)

- `components/ui/MoodFace.tsx` — shared solid-circle + glyph face; one implementation everywhere
- Home retrofitted: `MoodSelector` chips + `StatCards` mood bubble now use MoodFace; `HomeMoodLevel` gained `color` (DB select extended); `mockMoodLevels` in mock-home.ts updated to design colors + glyphs (Sad ☹️ #FC8FA5, Very Sad 😞 #A78BFA)
- `lib/mock-mood.ts` — July 2026, 31 days, distribution 8/10/7/4/2, 3 sample notes, Jul 12 selected
- MoodView = client (mock state: view pill, selectedDay); thin server page
- Graph: Recharts AreaChart with custom tooltip (date + face + note snippet); dots colored per level; face labels as flex column left of chart (not Recharts custom tick — simpler)
- Distribution donut: PieChart inner/outer; center overlay; counts from mock
- Daily/Weekly/Monthly: toggle state only, Daily content; graph period dropdown visual-only
- Page opens with mood graph showing gaps for null days intentionally (connectNulls=false)

### Cross-phase — Design-first rewrite (session after Feature 12)

- `context/build-plan.md` fully rewritten: Design System section (palette, logo/branding, **exact custom mood-face table**, UI kit) + per-page feature specs extracted from all 8 PNGs; design-wins-over-text rule stated at top
- `context/ui-tokens.md`: appended Mood Faces spec (solid pastel circle + glyph; one shared `MoodFace` component; faces from DB `mood_levels`) and Logo & Branding (leaf mark upgrade from 🌿 placeholder, wordmark, script accents, sidebar footer)
- Mood seed aligned: Sad = ☹️ `#FC8FA5`, Very Sad = 😞 `#A78BFA` (pre-existing accounts keep old colors until Feature 28)
- Deferred polish noted in plan: leaf SVG mark, botanical sidebar art, scenic decorative cards
- `mood graph.png` demoted to flavor-only; MoodPage.png canonical

### Phase 3 — Feature 12 (complete — Phase 3 closed)

- **Mock fallback removed**; instead `loadHabitsPageData()` one-time **seeds** demo data into the DB when `habits` is empty (9 habits + Sept 13–21 completions + notes from `lib/mock-habits.ts`) — developer's "maintain the data"
- `lib/mock-habits.ts` is now seed-source only; MOCK_VIEW/MOCK_TODAY unused
- Cell cycling → existing `setHabitCompletion` (now also revalidates `/habits`); optimistic update with revert on failure
- Notes → new `actions/notes.ts` `saveDayNote` (upsert `user_id,date`) / `deleteDayNote`; optimistic
- Reorder: native HTML5 drag on active rows (GripVertical handle, no new deps); `reorderHabits(ids)` renumbers sort_order 0..n sequentially
- Loader fetches ALL completions + notes in one pass (personal-scale accepted)
- Default view month = latest activity month, else current real month; today ring = real `new Date()`
- Archive/restore "toggles" already shipped in Feature 10 edit modal — nothing new in 12

### Phase 3 — Feature 11 (complete)

- Manage UI in **Settings**, not Habits page (developer preference; matches build-plan habit-preferences home)
- `components/settings/CategoriesCard.tsx` — functional card next to Appearance; inline list/edit/add, no modal
- Preset 5-swatch palette only (`CATEGORY_SWATCHES` in `lib/category-form.ts`); zod rejects non-preset colors
- `actions/categories.ts` — create/update/delete; sort_order appends; revalidates `/settings` + `/habits`
- `lib/settings-data.ts` `loadSettingsCategories()` — no try/catch (cookie access must propagate to mark route dynamic)
- Delete: FK SET NULL keeps habit data; confirm copy explains that
- Habit form select on Habits page needs no changes — already reads categories

### Phase 3 — Feature 10 (complete)

- `lib/habits-data.ts` `loadHabitsPageData()` — habits + categories from DB; **empty table → mock fallback** (`isMock: true`, mock ids so Sept demo statuses still match)
- `actions/habits.ts` — `createHabit` / `updateHabit` / `setHabitArchived` / `deleteHabit`; zod schema lives in `lib/habit-form.ts` (not exported from the `"use server"` file)
- One `HabitFormModal` for add + edit; entry points = header Add button + grid habit-name click (no kebab)
- Edit modal: Archive/Restore (left), Delete → inline confirm panel (`border-error/40 bg-error-light`), Cancel/Save (right)
- Mock rows: all CRUD is local-state only; real rows call Server Actions, then HabitsView syncs from revalidated props (render-phase adjustment, not setState-in-effect)
- Delete cascades completions via DB `ON DELETE CASCADE`
- Archived habits: visible, `opacity-60`, sorted to bottom; restorable via edit modal
- Category select in habit form is a native `<select>` (empty until Feature 11 creates categories)
- Creating the first real habit removes the mock fallback + Sept demo cells — accepted behavior

### Phase 3 — Feature 09 (complete — grid redirect)

- **Habits page UI redirected**: month grid (habits × days) matching old tracker `D:\habit-tracker\index.html`, **not** HabitsPage.png row-list. Filter tabs, row cards, and right sidebar (progress/streaks/categories) were built then deleted same session.
- Grid cells cycle `unset → done → partial → missed → unset` (local mock state)
- Statuses + notes keyed by full `YYYY-MM-DD` so data is month-scoped; mock seeds September 2026 days 13–21 from the developer's real old-tracker data; page opens on Sept 2026 (`MOCK_VIEW`); `MOCK_TODAY` = Oct 11 2026 (today ring)
- Notes row: StickyNote chip per day → `NoteModal` (Delete shown only when note exists; empty save deletes)
- Responsive day columns `repeat(N, minmax(0,1fr))`; h-7 cells; scroll only below ~680px; label column w-44, names `text-[13px]` no-truncate
- **Global shell change:** Topbar deleted; sidebar footer now has Dark Mode switch + `UserMenu` avatar (menu opens upward) — old-tracker layout. Affects ALL app pages.
- `Switch` + `Dropdown` primitives added to `components/ui/` (Dropdown currently unused after redirect — keep for settings/filters later)
- Add Habit button is a no-op until Feature 10; mock data in `lib/mock-habits.ts`
- Build-plan Phase 3 + AGENTS.md design map updated to record the redirect

### Phase 2 — Feature 08 (complete)

- Single Save writes mood + note together (`saveMoodCheckin`)
- Mood levels from DB `mood_levels` (fallback architecture 5-scale)
- Empty note deletes `daily_notes` row
- `enable_mood_notes` gates note UI
- WeekStrip: weighted day ratio; QuickStats: this month vs last month
- Today’s Mood StatCard wired from `mood_entries`

### Phase 2 — Features 06 + 07 (complete, shipped together)

- Cycle: `done → partial → missed → unset` (unset deletes the row)
- Only today's (selected date) circles are clickable; week dots are read-only display
- Account day streak: any non-missed (done/partial) on a day counts; empty today falls back to yesterday (grace for in-progress day)
- Today's Progress: weighted `done=1`, `partial=0.5` over active habits
- `lib/stats.ts` extended with `accountDayStreak`, `accountLongestStreak`, `dayProgressPercent`, `isStreakDay`
- `lib/home-data.ts` server loader (redirects to /login); Home page is now dynamic Server Component
- Mood card + WeekStrip + QuickStats still mock until Feature 08

### Phase 2 — Feature 05 (complete)

- Home split into `components/home/*` + pure `lib/mock-home.ts`
- Mock source: old tracker `D:\habit-tracker\index.html` (name Krishna, DEF_HABITS, welcome copy) + HomePage.png layout/mood 5-scale
- Local UI state only: mood chips + check-circle cycle (unset→done→partial→missed); no Server Actions
- Today’s Progress = SVG ring (primary stroke)
- Old tracker extra habits kept in `mockHabitCatalog` for Habits page later
- Profanity mood label from old tracker **not** copied; using design 5-level scale

### Phase 1 — Feature 04 (complete)

- Full Settings card skeleton now; only Appearance live until Features 25–30
- localStorage paints first; `ProfileThemeSync` seeds from `profiles` when storage empty
- Appearance changes auto-persist via `actions/settings.ts` `saveAppearance` (no save button); debounced 300ms
- Custom color theme swatch visible but disabled
- Swatch hexes live as `--color-swatch-*` tokens in globals.css
- `ProfileThemeSync` mounted in **`(app)` layout** only (not root) — skips `/login`
- Persist status is user-visible in AppearanceCard (saving / saved / error)
- Local opencode commands: `.opencode/command/{remember,architect,imprint,review,recover,workflow}.md`

### Phase 1 — Features 02 + 03 (complete)

- Full schema created in Feature 02 (pulled Feature 03 forward) via `migrations/20261005051455_create-habit-tracker-schema.sql`
- Auth cookies are SDK-managed: `insforge_access_token`, `insforge_refresh_token` (replaced scaffold `ht_access_token`)
- OAuth SSR: `createAuthActions` + `/api/auth/callback` route + `/api/auth/refresh`
- Seed on first login in callback route: `profiles` + 5 `mood_levels`
- `proxy.ts` uses `updateSession()` + route protection; matcher includes `/`
- Deleted conflicting `app/page.tsx` (duplicate `/` route vs `(app)/page.tsx`)
- DB API is `insforge.database.from(...)` on SDK 1.5.2
- User shape: `metadata` + `profile.name` (not `user_metadata`)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000` + InsForge `allowed_redirect_urls` in `insforge.toml`
- Minimal Topbar `UserMenu` sign-out for testability

### Phase 1 — Feature 01 (complete)

- Theme persisted client-side in localStorage (`ht_theme_mode`, `ht_color_theme`) until Feature 04 DB persist
- `proxy.ts` protected routes temporarily **empty** so shell is testable without auth — restore in Feature 02
- Sidebar/Topbar are client components (pathname + theme); pages can stay server components
- UI primitives: Button, Card (+Header/Title/Description), Input/Textarea in `components/ui/`
- Home is **mock UI only** — structure matches HomePage.png; logic in Features 06–08
- lucide-react for nav/topbar icons; decorative accents may use emoji/glyphs

### Phase 0 — Context System (locked with developer)

- Stack: Next.js 16 + TypeScript + Tailwind v4 + InsForge
- App location: `D:\habit-tracker-app`
- Auth: Google + GitHub OAuth
- Habit model: single status per day (`done` | `partial` | `missed`)
- No PostHog, no AI, no localStorage migration
- Notifications: UI toggles only
- Heatmap: GitHub contribution style using Lavender heat tokens (`heat-0`…`heat-4`)
- Memory: JobPilot append-only `memory.md`; `remember` skill save mode adapted
- Skills: architect, imprint, recover, remember, review (copied from `D:\habit-tracker\skills`)
- Context lives in `context/` + root `AGENTS.md` + `memory.md`
- Design PNGs at `public/designs/` — sole source of truth; `@public/designs/` attach convention

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._

---

### Phase 10 — Correctness & Contrast Pass

- [x] 10.1 Aurora orbs visible (stacking-context fix) — the Phase 9 headline effect rendered on **no** page
- [x] 10.2 `animate-in` / `fade-in` / `slide-in-from-*` replaced with real `motion` animations (the `tailwindcss-animate` plugin was never installed, so those classes were no-ops)
- [x] 10.3 `.modal-in` class added (the keyframes existed; the class rule never did → Settings popovers had no motion)
- [x] 10.4 Reveal-shape identity stabilised (the 3s chart wipe restarted on every parent re-render) + RAF switched to direct DOM writes
- [x] 10.5 Colour contrast: `--color-primary-text` token split (`text-primary` was 2.7:1 across 57 sites), `--color-text-muted` darkened per theme (2.57:1 across 118 sites), `--color-primary-on` / `--color-danger-button` / `--color-switch-knob` added
- [x] 10.6 `@custom-variant dark` — `dark:` utilities followed the OS instead of the app's theme toggle
- [x] 10.7 Stats buckets clipped to today (the chart said 61% next to a KPI reading 100% for identical data)
- [x] 10.8 One canonical completion rate (`periodCompletionRate`) — three surfaces reported three different numbers
- [x] 10.9 Insights denominator = active habits, not logged habits (the weekday/weekend insight could never fire)
- [x] 10.10 DST-safe longest streak (a 43-day streak reported 33 across a DST boundary)
- [x] 10.11 Mood value validated against the account's real scale (a value of 7 stored on a 6-level scale and rendered no face)
- [x] 10.12 `NEXT_REDIRECT` no longer swallowed by the mood loaders (an expired session said "Failed to load month" instead of redirecting to login)
- [x] 10.13 Calendar mood-level ordering aligned with every other page (the legend listed "Fu*ked Up" first)
- [x] 10.14 Per-key optimistic rollback + stale-request guards across Habits / Home / Mood / Calendar
- [x] 10.15 Missing `revalidatePath` calls (`/stats`, `/calendar`, week-start across 4 routes)
- [x] 10.16 Route-level `loading.tsx` skeleton + `error.tsx` boundary
- [x] 10.17 `status-pop` motion on the core check-in interaction
- [x] 10.18 `transition-all` removed in favour of targeted transitions (paint cost over `backdrop-blur`)

**Decisions made:**

- The soft pastel `--color-primary` stays the brand FILL. A separate `--color-primary-text` carries type. Changing `--color-primary` itself would have re-coloured every button, ring, chart stroke and heat ramp.
- Solid primary surfaces use deep ink on the pastel, not white on the pastel (2.7:1). The result still matches the design language — the reference PNG's "Add Habit" button is a light fill with dark text.
- The switch knob flips with the mode. No single colour can clear 3:1 against both a pale on-track and a deep off-track, so light mode uses deep ink and dark mode uses white.
- `dark:` is bound to `[data-theme="dark"]`, not `prefers-color-scheme` — the app's theme is an explicit user choice.
- The 3s chart entrance duration was **kept** (it was a deliberate developer decision in Phase 7.25.5). The bug was that it restarted, not that it was slow.
- `saveMoodCheckin` (`actions/moods.ts`) is dead code — no importers since the Home mood section was removed. Fixed to use the shared scale validator rather than deleted, to avoid removing a public action unasked. **Flagged for deletion.**

**Verification:**

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 0 warnings
- `npm run build` — clean; all app routes still dynamic
- Executable stats suite (Node `--experimental-strip-types`, `TZ=Europe/Berlin`) — 10/10 checks pass: monthly/yearly bucket clipping, KPI↔chart agreement, created_at-aware rate, 43-day streak across a DST boundary, weekday/weekend insight detection
- Playwright + Edge: 10 screenshots (5 themes × light/dark) of a temporary `/preview-phase-a` route — aurora visible, contrast legible, switch knob readable, skeleton rendering. Route deleted after capture. The app was never signed in, so the authenticated pages remain visually unverified.

**Carry-forwards:** signed-in browser QA · Phase B (one design language) · Phase C (motion system) · 4 dead settings to implement or delete · `saveMoodCheckin` to delete · unused `@radix-ui/react-dialog` + `@radix-ui/react-tooltip` deps · OAuth e2e QA · login `?redirect=` · Mood pills chrome-only · touch heat tooltip.
---

### Phase 11 — One Design Language (shared primitives)

- [x] 11.1 `<Card>` — one card surface for all 23 hand-rolled variants (rounded-2xl, border-border/80, bg-surface/90, backdrop-blur-md, p-5, shadow-card); `interactive` prop replaces the base hover that advertised interactivity on every non-clickable card
- [x] 11.2 `<ProgressRing>` — one ring for the 3 former implementations (Home progress, Home week strip, Calendar overview); the Calendar ring gained the `.ring-draw` animation it never had
- [x] 11.3 `<Modal>` — Radix Dialog replaces 3 hand-rolled modals with no focus trap, no focus restore and a page behind that stayed tabbable
- [x] 11.4 `<StatTile>` — one tile for the Home Quick Stats tiles and the Stats KPI cards
- [x] 11.5 `<ScriptQuote>` — one decorative script quote for 6 near-duplicate blocks; colour is now `text-primary-text` (theme-aware) instead of `text-accent-foreground` (mode-only)
- [x] 11.6 `<SaveStatusLine>` — one status line; AppearanceCard's private copy deleted
- [x] 11.7 `<MonthNav>` — one month navigator for the Habits page, Mood card and Calendar card; exports `<TodayButton>` so both Today placements match
- [x] 11.8 `<DarkModeToggle>` — one dark-mode switch for the sidebar and the mobile header
- [x] 11.9 `lib`→`components/layout/nav-items.ts` — one nav definition + one `isActivePath` predicate
- [x] 11.10 Deleted `components/habits/MonthNav.tsx`, `components/settings/SaveStatusLine.tsx`, the dead `.modal-backdrop` / `.modal-panel` CSS, and ManageHabitsCard's duplicate global Escape listener

**Decisions made:**

- The card surface keeps the glass treatment (`bg-surface/90 backdrop-blur-md`) that Phase 9 introduced — now visible because the aurora orbs actually render behind it. Cards that intentionally differ: the floating chrome (Modal, Popover), tinted sub-tiles inside a card, and the decorative gradient panels.
- `<Modal>` uses Radix (already a dependency) rather than a hand-rolled focus trap, and drives its entrance with `motion` (spring) instead of a CSS keyframe, so it respects `prefers-reduced-motion` for free.
- The modal keeps an **enter** animation only. Exit animation needs Radix's `forceMount` + `AnimatePresence`; that combination risks leaving a closed modal in the DOM. Deferred rather than shipped half-working.
- `text-primary-text` replaced `text-accent-foreground` on the script quotes so they re-theme with the active colour theme.

**Problems solved (self-inflicted, recorded for next time):**

- A bulk class rename run through PowerShell `Get-Content -Raw` → `Set-Content -Encoding UTF8` **corrupted every non-ASCII character in the 29 files it touched** (emoji became mojibake) and added a UTF-8 BOM to each. Both were detected and fully repaired: BOMs stripped, and 102 mojibake runs in 16 files reversed by re-decoding the CP1252 bytes as UTF-8. **Lesson: never round-trip source files through PowerShell; use the `edit` tool, and `[System.IO.File]::WriteAllText` with `UTF8Encoding($false)` if a script must write.**
- A JSX bulk-rewrite script computed the replacement as `before + "<Card>" + after`, which **deleted the card bodies** of 15 files. Recovered byte-exact from the Turbopack source maps in `.next` (the production build window contains exactly one version per file) plus the pre-damage backup, then re-verified with `tsc` + `lint` + a head/tail match against the surviving file. **Lesson: always keep the body when doing a structural rewrite, and dry-run the diff before writing.**
- The `edit` tool fuzzy-matches when the old string contains characters that differ from the file (correct emoji vs mojibake), which left a duplicated tail in `Sidebar.tsx`. Caught by `tsc`, fixed, and a duplicate-block scanner was added to the verification set.

**Verification:** `npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/0 warnings · `npm run build` clean (all app routes dynamic) · Playwright + Edge screenshots of every new primitive in light and dark, plus a DOM probe confirming the modal exposes `role="dialog"`, `aria-labelledby` and `aria-describedby` · integrity sweep: no BOM, no mojibake, no duplicated structural blocks.

**Carry-forwards:** signed-in browser QA of the real pages (auth redirect still blocks automated capture) · Phase C (wire `motion` as the single motion system: heatmap cascade, count-ups, mood-face spring, tooltip spring, FLIP habit reorder, settings cross-fade, modal exit animation) · 4 dead settings to implement or delete · `saveMoodCheckin` to delete · `@radix-ui/react-tooltip` still unused.
---

### Phase 12 — Motion system (`motion` as the single driver)

- [x] 12.1 Modal **enter and exit** animation (`AnimatePresence` + Radix `forceMount`)
- [x] 12.2 `<CountUp>` — Home progress %, both streak counts, Quick Stats tiles; `aria-hidden` animated text + `sr-only` final value
- [x] 12.3 `<MoodFacePop>` — spring + cross-fade when a mood value changes
- [x] 12.4 Heatmap cascade entrance — the `.heat-cell` class existed but was never applied; monthly = diagonal wave, annual = GitHub-style week-by-week
- [x] 12.5 Heatmap tooltip glide (120 ms) — position now computed before the tooltip mounts, so the first placement is instant and later ones glide
- [x] 12.6 FLIP layout animation on habit reorder
- [x] 12.7 Settings section cross-fade + a shared-layout nav pill that slides between items
- [x] 12.8 Drag-over re-render storm fixed (`dragover` fired ~60×/s and re-rendered the whole grid)
- [x] 12.9 Global `prefers-reduced-motion` kill-switch in CSS + `<MotionConfig reducedMotion="user">` for the JS-driven animations
- [x] 12.10 Custom CSS moved into explicit cascade layers (`components` / `utilities`) so Tailwind utilities can override it again

**Decisions made:**

- The neon `glow-*` classes live in `@layer utilities`, not `components`. They set `box-shadow`, which collides with the base card's `shadow-card` and the cells' `shadow-xs` — as components they would have lost and the glows would have disappeared. Every other custom class moved to `components` so utilities win.
- The heatmap cascade animates `transform` with `backwards` fill, not `both`. A `both` fill keeps the final `transform: scale(1)` applied forever, and a CSS animation outranks the `hover:scale-*` utility — the hover pop would be dead.
- The tooltip's position is computed in the mouse handler rather than in an effect, so the tooltip mounts already positioned. A freshly mounted element never transitions its initial style, so the first placement is instant; moving between cells keeps it mounted, so the transition applies.
- The tooltip's width is now bounded (`max-w-64`) — it was `whitespace-nowrap`, so a long habit name produced a bubble that could run off-screen.

**Verification (Playwright + Edge, against a temporary preview route):**
- Count-up: sampled `0%` at 90 ms → `78%` at 1.5 s ✓
- Heat cascade: 36 cells, every one animating with `heat-cell-in`, 16 distinct delays ✓
- Modal exit: dialog still in the DOM 60 ms after close, unmounted afterwards ✓
- FLIP: row positions converge mid-animation (`[650,650,651,651]`) then settle ✓
- Screenshots in light mode; zero console errors (only a pre-existing favicon 404)

`npx tsc --noEmit` 0 errors · `npm run lint` 0 errors/0 warnings · `npm run build` clean (all app routes dynamic) · integrity sweep: no BOM, no mojibake, no duplicated structural blocks.

**Carry-forwards:** signed-in browser QA of the real pages (the auth redirect still blocks automated capture) · 4 dead settings to implement or delete · `saveMoodCheckin` to delete · `@radix-ui/react-tooltip` still unused · OAuth e2e QA · login `?redirect=` · Mood Daily/Weekly/Monthly pills chrome-only · touch heat tooltip.
