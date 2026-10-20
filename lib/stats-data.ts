import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { formatLocal } from "@/lib/stats";
import type { StatsData, StatsHabit } from "@/lib/stats";
import type { HabitCompletion, MoodEntry } from "@/types";

export async function loadStatsData(): Promise<StatsData> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  const today = new Date();
  const todayKey = formatLocal(today);

  const [
    { data: habitRows, error: habitError },
    { data: completionRows, error: completionError },
    { data: moodRows, error: moodError },
    { data: categoryRows, error: categoryError },
    { data: profileRows, error: profileError },
  ] = await Promise.all([
    insforge.database
      .from("habits")
      .select("id, name, emoji, sort_order, active, category_id, created_at")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("habit_completions")
      .select("id, user_id, habit_id, date, status")
      .eq("user_id", user.id),
    insforge.database
      .from("mood_entries")
      .select("id, user_id, date, mood_value")
      .eq("user_id", user.id),
    insforge.database
      .from("habit_categories")
      .select("id, color")
      .eq("user_id", user.id),
    insforge.database
      .from("profiles")
      .select("week_starts_on")
      .eq("id", user.id)
      .limit(1),
  ]);

  if (habitError) {
    console.error("[lib/stats-data/loadStatsData] habits:", habitError.message);
  }
  if (completionError) {
    console.error(
      "[lib/stats-data/loadStatsData] completions:",
      completionError.message,
    );
  }
  if (moodError) {
    console.error(
      "[lib/stats-data/loadStatsData] mood_entries:",
      moodError.message,
    );
  }
  if (categoryError) {
    console.error(
      "[lib/stats-data/loadStatsData] habit_categories:",
      categoryError.message,
    );
  }
  if (profileError) {
    console.error(
      "[lib/stats-data/loadStatsData] profiles:",
      profileError.message,
    );
  }

  const habits: StatsHabit[] = ((habitRows ?? []) as Array<{
    id: string;
    name: string;
    emoji: string;
    sort_order: number;
    active: boolean;
    category_id: string | null;
    created_at: string;
  }>).map((h) => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    sortOrder: h.sort_order,
    active: h.active,
    categoryId: h.category_id,
    createdAt: h.created_at,
  }));

  const categoryColors: Record<string, string> = {};
  for (const row of (categoryRows ?? []) as Array<{
    id: string;
    color: string;
  }>) {
    categoryColors[row.id] = row.color;
  }

  const activeIds = new Set(habits.filter((h) => h.active).map((h) => h.id));
  const completions = ((completionRows ?? []) as HabitCompletion[]).filter(
    (c) => activeIds.has(c.habit_id),
  );
  const moodEntries = (moodRows ?? []) as MoodEntry[];

  const profileRow = Array.isArray(profileRows) ? profileRows[0] : profileRows;
  const weekStartsOn =
    profileRow && typeof profileRow.week_starts_on === "number"
      ? profileRow.week_starts_on
      : 1;

  return {
    todayKey,
    habits,
    completions,
    moodEntries,
    categoryColors,
    weekStartsOn,
  };
}