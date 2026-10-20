import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  FALLBACK_LEVELS,
  type MoodLevel,
  type MonthMoodData,
  type MoodRangeData,
} from "@/lib/mood-view";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export async function loadMonthMood(
  year: number,
  month: number,
): Promise<MonthMoodData> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstIso = isoDate(year, month, 1);
  const lastIso = isoDate(year, month, daysInMonth);

  const [levelsRes, entriesRes, notesRes, profileRes] = await Promise.all([
    insforge.database
      .from("mood_levels")
      .select("value, label, emoji, color")
      .eq("user_id", user.id)
      .order("value", { ascending: false }),
    insforge.database
      .from("mood_entries")
      .select("date, mood_value")
      .eq("user_id", user.id)
      .gte("date", firstIso)
      .lte("date", lastIso),
    insforge.database
      .from("daily_notes")
      .select("date, content")
      .eq("user_id", user.id)
      .gte("date", firstIso)
      .lte("date", lastIso),
    insforge.database
      .from("profiles")
      .select("enable_mood_notes")
      .eq("id", user.id)
      .limit(1),
  ]);

  if (levelsRes.error) {
    console.error("[lib/mood-data/loadMonthMood] levels:", levelsRes.error.message);
  }
  if (entriesRes.error) {
    console.error("[lib/mood-data/loadMonthMood] entries:", entriesRes.error.message);
  }
  if (notesRes.error) {
    console.error("[lib/mood-data/loadMonthMood] notes:", notesRes.error.message);
  }
  if (profileRes.error) {
    console.error("[lib/mood-data/loadMonthMood] profile:", profileRes.error.message);
  }

  const levelRows = (Array.isArray(levelsRes.data)
    ? levelsRes.data
    : []) as MoodLevel[];
  const levels: MoodLevel[] =
    levelRows.length > 0
      ? levelRows.slice().sort((a, b) => b.value - a.value)
      : FALLBACK_LEVELS;

  const entries: Record<number, number> = {};
  for (const row of (Array.isArray(entriesRes.data)
    ? entriesRes.data
    : []) as Array<{ date: string; mood_value: number }>) {
    const day = Number(row.date.split("-")[2]);
    if (day >= 1 && day <= daysInMonth) entries[day] = row.mood_value;
  }

  const notes: Record<number, string> = {};
  for (const row of (Array.isArray(notesRes.data)
    ? notesRes.data
    : []) as Array<{ date: string; content: string }>) {
    const day = Number(row.date.split("-")[2]);
    if (day >= 1 && day <= daysInMonth) notes[day] = row.content;
  }

  const profileRow = Array.isArray(profileRes.data)
    ? profileRes.data[0]
    : profileRes.data;

  return {
    year,
    month,
    daysInMonth,
    monthLabel: `${MONTH_NAMES[month]} ${year}`,
    levels,
    entries,
    notes,
    enableMoodNotes: profileRow?.enable_mood_notes ?? true,
  };
}

/** Mood entries + notes for an arbitrary date range (graph period view). */
export async function loadMoodRange(
  fromIso: string,
  toIso: string,
): Promise<MoodRangeData> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  const [entriesRes, notesRes] = await Promise.all([
    insforge.database
      .from("mood_entries")
      .select("date, mood_value")
      .eq("user_id", user.id)
      .gte("date", fromIso)
      .lte("date", toIso),
    insforge.database
      .from("daily_notes")
      .select("date, content")
      .eq("user_id", user.id)
      .gte("date", fromIso)
      .lte("date", toIso),
  ]);

  if (entriesRes.error) {
    console.error("[lib/mood-data/loadMoodRange] entries:", entriesRes.error.message);
  }
  if (notesRes.error) {
    console.error("[lib/mood-data/loadMoodRange] notes:", notesRes.error.message);
  }

  const entries: Record<string, number> = {};
  for (const row of (Array.isArray(entriesRes.data)
    ? entriesRes.data
    : []) as Array<{ date: string; mood_value: number }>) {
    entries[row.date] = row.mood_value;
  }

  const notes: Record<string, string> = {};
  for (const row of (Array.isArray(notesRes.data)
    ? notesRes.data
    : []) as Array<{ date: string; content: string }>) {
    notes[row.date] = row.content;
  }

  return { fromIso, toIso, entries, notes };
}
