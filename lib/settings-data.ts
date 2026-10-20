import { createInsforgeServer } from "@/lib/insforge-server";

export type SettingsCategory = {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
};

/** Habit rows the Settings "Habits" management card lists. */
export type SettingsHabit = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  categoryId: string | null;
  reminderTime: string | null;
  sortOrder: number;
  active: boolean;
};

/**
 * Profile fields the Settings UI reads (schema defaults as fallback).
 *
 * Only fields that a visible control reads live here. The columns that
 * were saved but never read by any surface — the five `notify_*` flags,
 * `default_reminder_time`, `default_frequency`, `show_completed_habits`,
 * `compact_habit_view`, `mood_reminder_time` and `bio_note` — were removed
 * from the UI, so the loader stopped fetching them too.
 */
export type SettingsProfile = {
  displayName: string;
  weekStartsOn: number;
  enableMoodNotes: boolean;
  showMoodOnCalendar: boolean;
};

/** Mood level row for the settings scale preview (faces render from DB). */
export type SettingsMoodLevel = {
  value: number;
  label: string;
  color: string;
};

export const DEFAULT_SETTINGS_PROFILE: SettingsProfile = {
  displayName: "",
  weekStartsOn: 1,
  enableMoodNotes: true,
  showMoodOnCalendar: true,
};

export async function loadSettingsData(): Promise<{
  categories: SettingsCategory[];
  habits: SettingsHabit[];
  profile: SettingsProfile;
  moodLevels: SettingsMoodLevel[];
}> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user)
    return {
      categories: [],
      habits: [],
      profile: DEFAULT_SETTINGS_PROFILE,
      moodLevels: [],
    };

  const [
    { data: categoryRows, error: categoryError },
    { data: profileRows, error: profileError },
    { data: habitRows, error: habitError },
    { data: moodRows, error: moodError },
  ] = await Promise.all([
    insforge.database
      .from("habit_categories")
      .select("id, name, color, sort_order")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("profiles")
      .select(
        "display_name, week_starts_on, enable_mood_notes, show_mood_on_calendar",
      )
      .eq("id", user.id)
      .limit(1),
    insforge.database
      .from("habits")
      .select(
        "id, name, emoji, description, category_id, reminder_time, sort_order, active",
      )
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("mood_levels")
      .select("value, label, color, sort_order")
      .eq("user_id", user.id)
      .order("value", { ascending: false }),
  ]);

  if (categoryError) {
    console.error("[lib/settings-data/loadSettingsData] categories:", categoryError.message);
  }
  if (profileError) {
    console.error("[lib/settings-data/loadSettingsData] profiles:", profileError.message);
  }
  if (habitError) {
    console.error("[lib/settings-data/loadSettingsData] habits:", habitError.message);
  }
  if (moodError) {
    console.error("[lib/settings-data/loadSettingsData] mood_levels:", moodError.message);
  }

  const categories: SettingsCategory[] = (categoryRows ?? []).map(
    (c: { id: string; name: string; color: string; sort_order: number }) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      sortOrder: c.sort_order,
    }),
  );

  const habits: SettingsHabit[] = (
    (habitRows ?? []) as Array<{
      id: string;
      name: string;
      emoji: string;
      description: string;
      category_id: string | null;
      reminder_time: string | null;
      sort_order: number;
      active: boolean;
    }>
  ).map((h) => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    description: h.description,
    categoryId: h.category_id,
    reminderTime: h.reminder_time,
    sortOrder: h.sort_order,
    active: h.active,
  }));

  const row = Array.isArray(profileRows) ? profileRows[0] : profileRows;
  const profile: SettingsProfile = row
    ? {
        displayName: row.display_name ?? "",
        weekStartsOn: row.week_starts_on ?? 1,
        enableMoodNotes: row.enable_mood_notes ?? true,
        showMoodOnCalendar: row.show_mood_on_calendar ?? true,
      }
    : DEFAULT_SETTINGS_PROFILE;

  const moodLevels: SettingsMoodLevel[] = (
    (moodRows ?? []) as Array<{
      value: number;
      label: string;
      color: string;
      sort_order: number;
    }>
  )
    .slice()
    .sort((a, b) => b.value - a.value)
    .map((m) => ({ value: m.value, label: m.label, color: m.color }));

  return { categories, habits, profile, moodLevels };
}