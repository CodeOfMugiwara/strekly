export type HabitStatus = "done" | "partial" | "missed";

export type ThemeMode = "light" | "dark" | "system";

export type ColorTheme =
  | "lavender"
  | "mint"
  | "peach"
  | "ocean"
  | "rose"
  /* Reference-derived themes (added alongside the Lavender Sky family). */
  | "sage"
  | "clay"
  | "lagoon"
  | "berry"
  | "orchid";

export type Profile = {
  id: string;
  display_name: string | null;
  tracker_title: string;
  welcome_message: string;
  bio_note: string | null;
  theme_mode: ThemeMode;
  color_theme: ColorTheme;
  custom_theme: Record<string, string> | null;
  week_starts_on: number;
  default_reminder_time: string;
  default_frequency: string;
  show_completed_habits: boolean;
  compact_habit_view: boolean;
  notify_habit: boolean;
  notify_daily_summary: boolean;
  notify_mood: boolean;
  notify_streak: boolean;
  notify_missed: boolean;
  mood_scale: number;
  enable_mood_notes: boolean;
  mood_reminder_time: string;
  show_mood_on_calendar: boolean;
  created_at: string;
  updated_at: string;
};

export type HabitCategory = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  sort_order: number;
};

export type Habit = {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  emoji: string;
  description: string | null;
  sort_order: number;
  active: boolean;
  archived_at: string | null;
  created_at: string;
};

export type HabitCompletion = {
  id: string;
  user_id: string;
  habit_id: string;
  date: string;
  status: HabitStatus;
};

export type MoodLevel = {
  id: string;
  user_id: string;
  label: string;
  emoji: string;
  color: string;
  value: number;
  sort_order: number;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  date: string;
  mood_value: number;
};

export type DailyNote = {
  id: string;
  user_id: string;
  date: string;
  content: string;
};

export type ActionResult = {
  success: boolean;
  error?: string;
};
