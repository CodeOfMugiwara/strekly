-- Feature 26: habit preference persistence + 6-mood scale.
--
-- 1) default_frequency preference column (was a schema gap flagged in F25).
-- 2) mood scale moves to 6 levels: relax the old IN (5, 7) check, default 6,
--    existing profile rows updated.
-- 3) One-time remap of existing mood entries from the old 5-scale to the new
--    6-scale (high = happier on both): old 5->6, 4->5, 3->4; 2 and 1 stay
--    (Sad stays Sad; Very Sad becomes Fu*ked Up).
-- 4) Reseed mood_levels for every user to the developer-approved 6 rows.

-- ---------------------------------------------------------------------------
-- 1. default_frequency
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS default_frequency text
  NOT NULL DEFAULT 'daily'
  CONSTRAINT profiles_default_frequency_check
  CHECK (default_frequency IN ('daily', 'weekly'));

-- ---------------------------------------------------------------------------
-- 2. mood_scale: allow 6, default 6, migrate existing rows
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  con text;
BEGIN
  SELECT conname INTO con
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%mood_scale%';
  IF con IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', con);
  END IF;
END $$;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_mood_scale_check
  CHECK (mood_scale IN (5, 6, 7));

ALTER TABLE public.profiles
  ALTER COLUMN mood_scale SET DEFAULT 6;

UPDATE public.profiles
SET mood_scale = 6
WHERE mood_scale <> 6;

-- ---------------------------------------------------------------------------
-- 3. Remap existing mood entries 5-scale -> 6-scale (values >= 3 shift up)
-- ---------------------------------------------------------------------------
UPDATE public.mood_entries
SET mood_value = mood_value + 1
WHERE mood_value >= 3;

-- ---------------------------------------------------------------------------
-- 4. Reseed mood_levels: 6 levels per user, top -> bottom display order
-- ---------------------------------------------------------------------------
DELETE FROM public.mood_levels;

INSERT INTO public.mood_levels (user_id, label, emoji, color, value, sort_order)
SELECT
  u.id,
  v.label,
  v.emoji,
  v.color,
  v.value,
  v.sort_order
FROM auth.users u
CROSS JOIN (VALUES
  (6, 'Very Happy', '😊', '#86D6BF', 0),
  (5, 'Happy',      '🙂', '#FCD34D', 1),
  (4, 'Okay',       '😐', '#7DD3FC', 2),
  (3, 'Tired',      '😴', '#A8A29E', 3),
  (2, 'Sad',        '☹️', '#FC8FA5', 4),
  (1, 'Fu*ked Up',  '🤯', '#A78BFA', 5)
) AS v(value, label, emoji, color, sort_order);