import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  accountDayStreak,
  accountLongestStreak,
  completionPercent,
  dayCompletionRatio,
  dayProgressPercent,
  formatLocal,
  monthCompletionStats,
  previousMonthDate,
  vsPreviousMonthPercent,
} from "@/lib/stats";
import { addDays, startOfWeek } from "@/lib/utils";
import type { Habit, HabitCompletion, HabitStatus, Profile } from "@/types";

export type HomeHabitRow = {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  /** Habit creation timestamp — used so a habit added mid-month is not
   *  charged for days before it existed. */
  createdAt: string;
  weekStatuses: Array<HabitStatus | null>;
};

export type HomeWeekDay = {
  key: string;
  short: string;
  percent: number;
  isToday: boolean;
};

export type HomeQuickStats = {
  completed: number;
  missed: number;
  rate: number;
  vsLastMonth: string;
};

export type HomeDashboard = {
  profile: Pick<Profile, "display_name"> | null;
  /** Saved profile name, else first 3 chars of the account email. */
  displayName: string;
  habits: HomeHabitRow[];
  weekDateKeys: string[];
  weekDays: HomeWeekDay[];
  selectedDate: string;
  progressPercent: number;
  progressHint: string;
  dayStreak: number;
  longestStreak: number;
  hasHabits: boolean;
  quickStats: HomeQuickStats;
};

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Saved profile name, else first 3 chars of the email local-part. */
export function profileDisplayName(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  const saved = displayName?.trim();
  if (saved) return saved;
  const local = (email ?? "").split("@")[0];
  return local.slice(0, 3) || "You";
}

export async function loadHomeDashboard(): Promise<HomeDashboard> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  const today = new Date();
  const selectedDate = formatLocal(today);
  const streakFrom = formatLocal(addDays(today, -365));
  const monthStart = startOfMonth(today);
  const prevMonth = previousMonthDate(today);
  const prevStart = startOfMonth(prevMonth);
  const prevEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);

  const [profileRes, habitsRes, completionsRes] = await Promise.all([
    insforge.database
      .from("profiles")
      .select("display_name, week_starts_on")
      .eq("id", user.id)
      .limit(1),
    insforge.database
      .from("habits")
      .select("id, name, emoji, description, sort_order, created_at")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("habit_completions")
      .select("id, user_id, habit_id, date, status")
      .eq("user_id", user.id)
      .gte("date", streakFrom)
      .lte("date", selectedDate),
  ]);

  if (profileRes.error) {
    console.error("[loadHomeDashboard] profile", profileRes.error.message);
  }
  if (habitsRes.error) {
    console.error("[loadHomeDashboard] habits", habitsRes.error.message);
  }
  if (completionsRes.error) {
    console.error(
      "[loadHomeDashboard] completions",
      completionsRes.error.message,
    );
  }

  const profileRow = Array.isArray(profileRes.data)
    ? profileRes.data[0]
    : profileRes.data;

  // Week strip follows the profile's week start (fetched above).
  const weekStart = startOfWeek(today, profileRow?.week_starts_on ?? 1);
  const weekDateKeys = Array.from({ length: 7 }, (_, i) =>
    formatLocal(addDays(weekStart, i)),
  );
  const habitRows = (Array.isArray(habitsRes.data)
    ? habitsRes.data
    : []) as Array<
    Pick<Habit, "id" | "name" | "emoji" | "description" | "sort_order"> & {
      created_at: string;
    }
  >;
  const activeHabitIds = new Set(habitRows.map((h) => h.id));
  const completions = (
    (Array.isArray(completionsRes.data)
      ? completionsRes.data
      : []) as HabitCompletion[]
  ).filter((c) => activeHabitIds.has(c.habit_id));

  const statusByHabitDate = new Map<string, HabitStatus>();
  for (const c of completions) {
    statusByHabitDate.set(`${c.habit_id}|${c.date}`, c.status);
  }

  const habits: HomeHabitRow[] = habitRows.map((h) => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    description: h.description,
    createdAt: h.created_at,
    weekStatuses: weekDateKeys.map(
      (key) => statusByHabitDate.get(`${h.id}|${key}`) ?? null,
    ),
  }));

  const todayStatuses = habits.map(
    (h) => statusByHabitDate.get(`${h.id}|${selectedDate}`),
  );
  const progressPercent = dayProgressPercent(habits.length, todayStatuses);
  const doneCount = todayStatuses.filter((s) => s === "done").length;
  const partialCount = todayStatuses.filter((s) => s === "partial").length;
  const progressHint =
    habits.length === 0
      ? "Add a habit to start tracking"
      : `${doneCount} of ${habits.length} habits completed${partialCount > 0 ? ` · ${partialCount} partial` : ""}`;

  const weekDays: HomeWeekDay[] = weekDateKeys.map((key) => {
    const statuses = habits.map((h) => statusByHabitDate.get(`${h.id}|${key}`));
    const hasAny = statuses.some((s) => s !== undefined);
    const percent = hasAny
      ? completionPercent(dayCompletionRatio(statuses))
      : 0;
    return {
      key,
      short: new Date(`${key}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      percent,
      isToday: key === selectedDate,
    };
  });

  const currentMonth = monthCompletionStats(
    completions,
    monthStart,
    today,
    habits,
  );
  const prevMonthStats = monthCompletionStats(
    completions,
    prevStart,
    prevEnd,
    habits,
  );

  return {
    profile: profileRow ? { display_name: profileRow.display_name } : null,
    displayName: profileDisplayName(profileRow?.display_name, user.email),
    habits,
    weekDateKeys,
    weekDays,
    selectedDate,
    progressPercent,
    progressHint,
    dayStreak: accountDayStreak(completions, today),
    longestStreak: accountLongestStreak(completions),
    hasHabits: habits.length > 0,
    quickStats: {
      completed: currentMonth.completed,
      missed: currentMonth.missed,
      rate: currentMonth.rate,
      vsLastMonth: vsPreviousMonthPercent(
        currentMonth.rate,
        prevMonthStats.rate,
      ),
    },
  };
}
