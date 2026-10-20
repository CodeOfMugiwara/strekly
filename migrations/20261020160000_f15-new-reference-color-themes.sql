-- New reference color themes — sage / clay / lagoon / berry / orchid.
--
-- Added ALONGSIDE the existing Lavender Sky family (lavender, mint, peach,
-- ocean, rose), which is untouched. The accent hexes were sampled from the
-- reference mock's own theme switcher chips.
--
-- `profiles.color_theme` carries a CHECK constraint that enumerates the
-- allowed values, so it has to be widened before the app can persist one
-- of the new themes. Existing rows are untouched — a user on any current
-- theme keeps it.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_color_theme_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_color_theme_check
  CHECK (
    color_theme IN (
      'lavender',
      'mint',
      'peach',
      'ocean',
      'rose',
      'sage',
      'clay',
      'lagoon',
      'berry',
      'orchid',
      'custom'
    )
  );
