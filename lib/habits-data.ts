import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  mockGridHabits,
  mockGridStatuses,
  mockDayNotes,
} from "@/lib/mock-habits";
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

type InsforgeServer = Awaited<ReturnType<typeof createInsforgeServer>>;

/** One-time healing: if the demo habits were seeded multiple times,
 * keep the earliest copy of each seed name and delete the rest. */
async function dedupeSeedHabits(
  insforge: InsforgeServer,
  userId: string,
): Promise<void> {
  try {
    const seedNames = new Set(mockGridHabits.map((h) => h.name));
    const { data: rows, error } = await insforge.database
      .from("habits")
      .select("id, name, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !rows) {
      if (error) {
        console.error("[lib/habits-data/dedupeSeedHabits]", error.message);
      }
      return;
    }

    const keptNames = new Set<string>();
    const toDelete: string[] = [];
    for (const row of rows as Array<{ id: string; name: string }>) {
      if (!seedNames.has(row.name)) continue;
      if (keptNames.has(row.name)) toDelete.push(row.id);
      else keptNames.add(row.name);
    }

    for (const id of toDelete) {
      const { error: delError } = await insforge.database
        .from("habits")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (delError) {
        console.error("[lib/habits-data/dedupeSeedHabits] delete:", delError.message);
      }
    }
    if (toDelete.length > 0) {
      console.warn(
        `[lib/habits-data/dedupeSeedHabits] removed ${toDelete.length} duplicate demo habits`,
      );
    }
  } catch (error) {
    console.error("[lib/habits-data/dedupeSeedHabits]", error);
  }
}

async function seedDemoData(
  insforge: InsforgeServer,
  userId: string,
): Promise<void> {
  try {
    const habitRows = mockGridHabits.map((h, i) => ({
      user_id: userId,
      name: h.name,
      emoji: h.emoji,
      description: null,
      category_id: null,
      sort_order: i,
      active: true,
    }));

    const { data: created, error: habitError } = await insforge.database
      .from("habits")
      .insert(habitRows)
      .select("id, name");

    if (habitError || !created) {
      console.error("[lib/habits-data/seedDemoData] habits:", habitError?.message);
      return;
    }

    const idByName = new Map(
      (created as Array<{ id: string; name: string }>).map((r) => [r.name, r.id]),
    );

    const completions: Array<{
      user_id: string;
      habit_id: string;
      date: string;
      status: HabitStatus;
    }> = [];
    for (const mock of mockGridHabits) {
      const habitId = idByName.get(mock.name);
      if (!habitId) continue;
      const dayMap = mockGridStatuses[mock.id] ?? {};
      for (const [date, status] of Object.entries(dayMap)) {
        if (status === "unset") continue;
        completions.push({
          user_id: userId,
          habit_id: habitId,
          date,
          status,
        });
      }
    }
    if (completions.length > 0) {
      const { error } = await insforge.database
        .from("habit_completions")
        .insert(completions);
      if (error) {
        console.error("[lib/habits-data/seedDemoData] completions:", error.message);
      }
    }

    const notes = Object.entries(mockDayNotes).map(([date, content]) => ({
      user_id: userId,
      date,
      content,
    }));
    if (notes.length > 0) {
      const { error } = await insforge.database.from("daily_notes").insert(notes);
      if (error) {
        console.error("[lib/habits-data/seedDemoData] notes:", error.message);
      }
    }
  } catch (error) {
    console.error("[lib/habits-data/seedDemoData]", error);
  }
}

export async function loadHabitsPageData(): Promise<HabitsPageData> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  // Heal any duplicate demo rows from earlier buggy seeding, then seed once if empty.
  // Fail closed: if the check query errors, do NOT seed (duplicates are worse than no demo).
  await dedupeSeedHabits(insforge, user.id);

  const { data: existing, error: existingError } = await insforge.database
    .from("habits")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (existingError) {
    console.error(
      "[lib/habits-data/loadHabitsPageData] seed check:",
      existingError.message,
    );
  } else if (Array.isArray(existing) && existing.length === 0) {
    await seedDemoData(insforge, user.id);
  }

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
