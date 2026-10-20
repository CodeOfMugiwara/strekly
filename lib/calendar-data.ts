import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { formatLocal } from "@/lib/stats";
import type { CalendarData, CalendarHabit } from "@/lib/calendar";
import type { HabitCompletion } from "@/types";

export async function loadCalendarData(): Promise<CalendarData> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  const todayKey = formatLocal(new Date());

  const [
    { data: habitRows, error: habitError },
    { data: completionRows, error: completionError },
    { data: moodRows, error: moodError },
    { data: noteRows, error: noteError },
    { data: levelRows, error: levelError },
    { data: profileRows, error: profileError },
  ] = await Promise.all([
    insforge.database
      .from("habits")
      .select("id, name, emoji")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("habit_completions")
      .select("id, user_id, habit_id, date, status")
      .eq("user_id", user.id),
    insforge.database
      .from("mood_entries")
      .select("date, mood_value")
      .eq("user_id", user.id),
    insforge.database
      .from("daily_notes")
      .select("date, content")
      .eq("user_id", user.id),
    insforge.database
    .from("mood_levels")
    .select("value, label, color")
    .eq("user_id", user.id)
    /* Order by VALUE descending, like the Mood page and Settings do. This
       used to sort by `sort_order` descending, but the seed assigns
       sort_order 0 to the BEST mood, so the Calendar's Day Legend listed
       "Fu*ked Up" first and "Very Happy" last — the exact reverse of every
       other page. */
    .order("value", { ascending: false }),
    insforge.database
      .from("profiles")
      .select("enable_mood_notes, show_mood_on_calendar, week_starts_on")
      .eq("id", user.id)
      .limit(1),
  ]);

  if (habitError) {
    console.error("[lib/calendar-data/loadCalendarData] habits:", habitError.message);
  }
  if (completionError) {
    console.error(
      "[lib/calendar-data/loadCalendarData] habit_completions:",
      completionError.message,
    );
  }
  if (moodError) {
    console.error("[lib/calendar-data/loadCalendarData] mood_entries:", moodError.message);
  }
  if (noteError) {
    console.error("[lib/calendar-data/loadCalendarData] daily_notes:", noteError.message);
  }
  if (levelError) {
    console.error("[lib/calendar-data/loadCalendarData] mood_levels:", levelError.message);
  }
  if (profileError) {
    console.error("[lib/calendar-data/loadCalendarData] profiles:", profileError.message);
  }

  const activeIds = new Set(
    ((habitRows ?? []) as CalendarHabit[]).map((h) => h.id),
  );
  const completions = ((completionRows ?? []) as HabitCompletion[]).filter(
    (c) => activeIds.has(c.habit_id),
  );

  const moodValues: Record<string, number> = {};
  for (const row of (moodRows ?? []) as Array<{
    date: string;
    mood_value: number;
  }>) {
    moodValues[row.date] = row.mood_value;
  }

  const notes: Record<string, string> = {};
  for (const row of (noteRows ?? []) as Array<{
    date: string;
    content: string;
  }>) {
    notes[row.date] = row.content;
  }

  const profile = Array.isArray(profileRows) ? profileRows[0] : profileRows;

  return {
    todayKey,
    habits: (habitRows ?? []) as CalendarHabit[],
    completions,
    moodValues,
    notes,
    moodLevels: (levelRows ?? []) as Array<{
      value: number;
      label: string;
      color: string;
    }>,
    showMoodFaces: profile?.show_mood_on_calendar ?? true,
    enableMoodNotes: profile?.enable_mood_notes ?? true,
    weekStartsOn: profile?.week_starts_on ?? 1,
  };
}