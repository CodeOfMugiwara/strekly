import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { HabitStatus } from "@/types";

export type GridHabit = {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  categoryId: string | null;
  /** Planned time of day ("HH:MM") or null. */
  reminderTime: string | null;
  sortOrder: number;
  active: boolean;
};

export type GridCategory = {
  id: string;
  name: string;
  color: string;
};

export type StatusMap = Record<string, Record<string, HabitStatus>>;

export type HabitsPageData = {
  habits: GridHabit[];
  categories: GridCategory[];
  statuses: StatusMap;
  notes: Record<string, string>;
  defaultView: { year: number; month: number };
};

export async function loadHabitsPageData(): Promise<HabitsPageData> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  // No seeding here. A new account is given the starter set at sign-up
  // (see `app/api/auth/callback/route.ts` → `seedStarterHabits`), and the
  // old lazy seed that copied the developer's personal tracker into every
  // account has been removed.
  const [
    { data: habitRows, error: habitError },
    { data: categoryRows, error: categoryError },
    { data: completionRows, error: completionError },
    { data: noteRows, error: noteError },
  ] = await Promise.all([
    insforge.database
      .from("habits")
      .select(
        "id, name, emoji, description, category_id, reminder_time, sort_order, active",
      )
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("habit_categories")
      .select("id, name, color, sort_order")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("habit_completions")
      .select("habit_id, date, status")
      .eq("user_id", user.id),
    insforge.database
      .from("daily_notes")
      .select("date, content")
      .eq("user_id", user.id),
  ]);

  if (habitError) {
    console.error("[lib/habits-data/loadHabitsPageData] habits:", habitError.message);
  }
  if (categoryError) {
    console.error("[lib/habits-data/loadHabitsPageData] categories:", categoryError.message);
  }
  if (completionError) {
    console.error(
      "[lib/habits-data/loadHabitsPageData] completions:",
      completionError.message,
    );
  }
  if (noteError) {
    console.error("[lib/habits-data/loadHabitsPageData] notes:", noteError.message);
  }

  const habits: GridHabit[] = (habitRows ?? []).map(
    (h: {
      id: string;
      name: string;
      emoji: string;
      description: string | null;
      category_id: string | null;
      reminder_time: string | null;
      sort_order: number;
      active: boolean;
    }) => ({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      description: h.description,
      categoryId: h.category_id,
      reminderTime: h.reminder_time ?? null,
      sortOrder: h.sort_order,
      active: h.active,
    }),
  );

  const categories: GridCategory[] = (categoryRows ?? []).map(
    (c: { id: string; name: string; color: string }) => ({
      id: c.id,
      name: c.name,
      color: c.color,
    }),
  );

  const statuses: StatusMap = {};
  for (const row of (completionRows ?? []) as Array<{
    habit_id: string;
    date: string;
    status: HabitStatus;
  }>) {
    if (!statuses[row.habit_id]) statuses[row.habit_id] = {};
    statuses[row.habit_id][row.date] = row.status;
  }

  const notes: Record<string, string> = {};
  for (const row of (noteRows ?? []) as Array<{ date: string; content: string }>) {
    notes[row.date] = row.content;
  }

  // Always open on the current real month (developer decision — the Sept
  // demo seed should not pin the view; users can nav back to it).
  const now = new Date();
  const defaultView = { year: now.getFullYear(), month: now.getMonth() };

  return { habits, categories, statuses, notes, defaultView };
}
