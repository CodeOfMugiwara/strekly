-- New reference color themes — sage / clay / lagoon / berry / orchid.
--
-- Added ALONGSIDE the existing Lavender Sky family (lavender, mint, peach,
-- ocean, rose), which is untouched. The accent hexes were sampled from the
-- reference mock's own theme switcher chips:
--
--   sage   #aec69f    clay   #a85d3c    lagoon #6fcac3
--   berry  #ab5268    orchid #b8a6eb
--
-- The `profiles.color_theme` CHECK constraint enumerates the allowed
-- values, so it has to be widened before the app can persist a new theme.
-- Existing rows are untouched — a user on any current theme keeps it.

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
