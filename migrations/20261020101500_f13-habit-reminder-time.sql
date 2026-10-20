-- F13 — per-habit reminder time.
--
-- `profiles.default_reminder_time` existed but was dead: it configured a
-- per-habit attribute that the `habits` table had no column for, so every
-- new habit ignored the user's chosen default. This adds the column and
-- wires it through the habit form (prefilled from the profile default) and
-- the Habits grid row.
--
-- Display-only by design: there is no push/notification system (hard rule 7),
-- so the value is a "planned time of day" annotation on the habit, not a
-- scheduled reminder.
--
-- `profiles.default_frequency` is intentionally LEFT IN PLACE (data
-- preservation) even though its Settings row was removed: a "weekly" habit
-- would need frequency-aware scoring in the grid, the stats denominators,
-- the heatmap, the habit graph AND the streak logic. That is a product
-- feature, not a settings fix, and shipping it half-way would recreate the
-- exact "KPI says 100%, chart says 61%" inconsistency class that F18/F25
-- fixed. The column and the export field remain so an account's value is
-- never silently destroyed.

ALTER TABLE public.habits
  ADD COLUMN IF NOT EXISTS reminder_time text;
