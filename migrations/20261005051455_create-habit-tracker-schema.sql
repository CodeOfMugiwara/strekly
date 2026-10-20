CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  tracker_title text NOT NULL DEFAULT 'Being New Version of Me Challenge',
  welcome_message text NOT NULL DEFAULT 'Welcome back! Ready to grow today?',
  bio_note text,
  theme_mode text NOT NULL DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'system')),
  color_theme text NOT NULL DEFAULT 'lavender' CHECK (color_theme IN ('lavender', 'mint', 'peach', 'ocean', 'rose', 'custom')),
  custom_theme jsonb,
  week_starts_on integer NOT NULL DEFAULT 1 CHECK (week_starts_on BETWEEN 0 AND 6),
  default_reminder_time text NOT NULL DEFAULT '08:00',
  show_completed_habits boolean NOT NULL DEFAULT true,
  compact_habit_view boolean NOT NULL DEFAULT false,
  notify_habit boolean NOT NULL DEFAULT true,
  notify_daily_summary boolean NOT NULL DEFAULT true,
  notify_mood boolean NOT NULL DEFAULT true,
  notify_streak boolean NOT NULL DEFAULT true,
  notify_missed boolean NOT NULL DEFAULT false,
  mood_scale integer NOT NULL DEFAULT 5 CHECK (mood_scale IN (5, 7)),
  enable_mood_notes boolean NOT NULL DEFAULT true,
  mood_reminder_time text NOT NULL DEFAULT '21:00',
  show_mood_on_calendar boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.habit_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#A78BFA',
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.habit_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '📝',
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  habit_id uuid NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('done', 'partial', 'missed')),
  UNIQUE (habit_id, date)
);

CREATE TABLE IF NOT EXISTS public.mood_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label text NOT NULL,
  emoji text NOT NULL,
  color text NOT NULL,
  value integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, value)
);

CREATE TABLE IF NOT EXISTS public.mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  mood_value integer NOT NULL,
  UNIQUE (user_id, date)
);

CREATE TABLE IF NOT EXISTS public.daily_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS daily_notes_updated_at ON public.daily_notes;
CREATE TRIGGER daily_notes_updated_at
  BEFORE UPDATE ON public.daily_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_habit_categories_user_id ON public.habit_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_category_id ON public.habits(category_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON public.habit_completions(date);
CREATE INDEX IF NOT EXISTS idx_mood_levels_user_id ON public.mood_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_date ON public.mood_entries(date);
CREATE INDEX IF NOT EXISTS idx_daily_notes_user_id ON public.daily_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_notes_date ON public.daily_notes(date);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_categories_select_own" ON public.habit_categories;
CREATE POLICY "habit_categories_select_own" ON public.habit_categories
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_categories_insert_own" ON public.habit_categories;
CREATE POLICY "habit_categories_insert_own" ON public.habit_categories
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_categories_update_own" ON public.habit_categories;
CREATE POLICY "habit_categories_update_own" ON public.habit_categories
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_categories_delete_own" ON public.habit_categories;
CREATE POLICY "habit_categories_delete_own" ON public.habit_categories
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habits_select_own" ON public.habits;
CREATE POLICY "habits_select_own" ON public.habits
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habits_insert_own" ON public.habits;
CREATE POLICY "habits_insert_own" ON public.habits
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habits_update_own" ON public.habits;
CREATE POLICY "habits_update_own" ON public.habits
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habits_delete_own" ON public.habits;
CREATE POLICY "habits_delete_own" ON public.habits
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_completions_select_own" ON public.habit_completions;
CREATE POLICY "habit_completions_select_own" ON public.habit_completions
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_completions_insert_own" ON public.habit_completions;
CREATE POLICY "habit_completions_insert_own" ON public.habit_completions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_completions_update_own" ON public.habit_completions;
CREATE POLICY "habit_completions_update_own" ON public.habit_completions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "habit_completions_delete_own" ON public.habit_completions;
CREATE POLICY "habit_completions_delete_own" ON public.habit_completions
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_levels_select_own" ON public.mood_levels;
CREATE POLICY "mood_levels_select_own" ON public.mood_levels
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_levels_insert_own" ON public.mood_levels;
CREATE POLICY "mood_levels_insert_own" ON public.mood_levels
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_levels_update_own" ON public.mood_levels;
CREATE POLICY "mood_levels_update_own" ON public.mood_levels
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_levels_delete_own" ON public.mood_levels;
CREATE POLICY "mood_levels_delete_own" ON public.mood_levels
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_entries_select_own" ON public.mood_entries;
CREATE POLICY "mood_entries_select_own" ON public.mood_entries
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_entries_insert_own" ON public.mood_entries;
CREATE POLICY "mood_entries_insert_own" ON public.mood_entries
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_entries_update_own" ON public.mood_entries;
CREATE POLICY "mood_entries_update_own" ON public.mood_entries
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "mood_entries_delete_own" ON public.mood_entries;
CREATE POLICY "mood_entries_delete_own" ON public.mood_entries
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "daily_notes_select_own" ON public.daily_notes;
CREATE POLICY "daily_notes_select_own" ON public.daily_notes
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "daily_notes_insert_own" ON public.daily_notes;
CREATE POLICY "daily_notes_insert_own" ON public.daily_notes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "daily_notes_update_own" ON public.daily_notes;
CREATE POLICY "daily_notes_update_own" ON public.daily_notes
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "daily_notes_delete_own" ON public.daily_notes;
CREATE POLICY "daily_notes_delete_own" ON public.daily_notes
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habit_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habit_completions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mood_levels TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mood_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_notes TO authenticated;
