import type { HabitCompletion, HabitStatus, MoodEntry } from "@/types";
import { addDays, startOfWeek } from "@/lib/utils";

export type HabitStreak = {
  current: number;
  longest: number;
};

export type StatsGranularity = "Daily" | "Weekly" | "Monthly" | "Yearly";

export type CompletionBucket = {
  key: string;
  tick: string;
  dateLabel: string;
  percent: number;
  done: number;
  total: number;
};

export type StatsKpis = {
  overallCompletion: number;
  completionVsLast: string | null;
  currentStreak: number;
  streakVsLast: string | null;
  longestStreak: number;
  activeHabits: number;
  totalHabits: number;
};

/** One day in the consistency window — the cell of the contribution grid. */
export type ConsistencyDay = {
  key: string;
  date: Date;
  doneCount: number;
  partialCount: number;
  activeCount: number;
  totalHabits: number;
  rate: number;
  level: 0 | 1 | 2 | 3 | 4;
  isToday: boolean;
  isFuture: boolean;
  dayOfWeek: number;
};

export type ConsistencyWindow = {
  /** One array per week column; each holds 7 days (one per weekday row). */
  weeks: ConsistencyDay[][];
  /** Days inside the window that carry at least one check-in. */
  daysTracked: number;
  /** Days inside the window that are in the past (future days excluded). */
  elapsedDays: number;
  totalCheckins: number;
  activeDaysCount: number;
  avgDailyRate: number;
};

export type StreakPoint = {
  key: string;
  tick: string;
  day: number;
  value: number;
};

export type StatsHabit = {
  id: string;
  name: string;
  emoji: string;
  sortOrder: number;
  active: boolean;
  categoryId: string | null;
  createdAt: string;
};

export type StatsData = {
  todayKey: string;
  habits: StatsHabit[];
  completions: HabitCompletion[];
  moodEntries: MoodEntry[];
  categoryColors: Record<string, string>;
  /** profiles.week_starts_on — weekly buckets honor it. */
  weekStartsOn: number;
};

export const HABIT_TINTS = [
  "#818CF8",
  "#60A5FA",
  "#FB7185",
  "#FBBF24",
  "#6EE7B7",
  "#38BDF8",
  "#A78BFA",
  "#F472B6",
];

export function statusWeight(status: HabitStatus | undefined): number {
  if (status === "done") return 1;
  if (status === "partial") return 0.5;
  return 0;
}

export function dayCompletionRatio(
  statuses: Array<HabitStatus | undefined>,
): number {
  if (statuses.length === 0) return 0;
  const sum = statuses.reduce((acc, s) => acc + statusWeight(s), 0);
  return sum / statuses.length;
}

export function completionPercent(ratio: number): number {
  return Math.round(ratio * 100);
}

export type HabitMonthPoint = {
  key: string;
  tick: string;
  day: number;
  /** Weighted completion 0–100; null = future day (gap on the chart). */
  percent: number | null;
  done: number;
  partial: number;
  total: number;
};

/**
 * Daily weighted completion (done=1, partial=0.5) over the active habits
 * for one calendar month — the Habits-page graph series. Future days of
 * the current month are null (chart gap); past unlogged days are an
 * honest 0. `todayKey` enables month-to-date clipping; viewed past
 * months render in full.
 */
export function buildHabitMonthSeries(
  statuses: Record<string, Record<string, HabitStatus>>,
  activeHabitIds: string[],
  year: number,
  month: number,
  todayKey: string,
): HabitMonthPoint[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  const total = activeHabitIds.length;

  const points: HabitMonthPoint[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    const isFuture = key > todayKey;
    let done = 0;
    let partial = 0;
    const dayStatuses: Array<HabitStatus | undefined> = [];
    for (const id of activeHabitIds) {
      const s = statuses[id]?.[key];
      dayStatuses.push(s);
      if (s === "done") done += 1;
      else if (s === "partial") partial += 1;
    }
    points.push({
      key,
      tick: String(day),
      day,
      percent: isFuture ? null : completionPercent(dayCompletionRatio(dayStatuses)),
      done,
      partial,
      total,
    });
  }
  return points;
}

export function dayProgressPercent(
  activeHabitCount: number,
  statuses: Array<HabitStatus | undefined>,
): number {
  if (activeHabitCount === 0) return 0;
  return completionPercent(dayCompletionRatio(statuses));
}

export function isStreakDay(status: HabitStatus | undefined): boolean {
  return status !== undefined && status !== "missed";
}

export function startOfMonthKey(date: Date): string {
  return formatLocal(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonthKey(date: Date): string {
  return formatLocal(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function previousMonthDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export type MonthCompletionStats = {
  completed: number;
  missed: number;
  partial: number;
  totalEntries: number;
  /** Weighted rate 0–100 using done=1, partial=0.5 over active habits × days elapsed */
  rate: number;
};

/** Minimal habit shape needed to compute a rate. */
export type RateHabit = {
  id: string;
  createdAt?: string | null;
};

/**
 * THE definition of "completion rate" for a period.
 *
 * Weighted per habit (done = 1, partial = 0.5, missed = 0) over the days
 * that habit actually existed inside the period, then averaged across
 * habits. Returns 0–1.
 *
 * Every surface reads from here — the Stats KPI, the heatmap's per-habit
 * percentage pills, the habit-rate rows and the Home progress card — so
 * they can never report three different numbers for the same data. (They
 * used to: a habit created mid-month was charged for days before it
 * existed, so the KPI said 53% while the habit-rate card said 100%.)
 */
export function periodCompletionRate(
  completions: HabitCompletion[],
  habits: RateHabit[],
  fromDate: Date,
  toDate: Date,
): number {
  if (habits.length === 0) return 0;
  const startKey = formatLocal(fromDate);
  let sum = 0;
  for (const habit of habits) {
    const createdAt = habit.createdAt ?? startKey;
    sum += weightedHabitRate(completions, habit.id, fromDate, toDate, createdAt);
  }
  return sum / habits.length;
}

export function monthCompletionStats(
  completions: HabitCompletion[],
  monthStart: Date,
  monthEnd: Date,
  habits: RateHabit[],
): MonthCompletionStats {
  const from = formatLocal(monthStart);
  const to = formatLocal(monthEnd);
  let completed = 0;
  let missed = 0;
  let partial = 0;

  for (const c of completions) {
    if (c.date < from || c.date > to) continue;
    if (c.status === "done") {
      completed += 1;
    } else if (c.status === "partial") {
      partial += 1;
    } else if (c.status === "missed") {
      missed += 1;
    }
  }

  const rate = Math.round(
    periodCompletionRate(completions, habits, monthStart, monthEnd) * 100,
  );

  return {
    completed,
    missed,
    partial,
    totalEntries: completed + missed + partial,
    rate,
  };
}

export function vsPreviousMonthPercent(
  currentRate: number,
  previousRate: number,
): string {
  const delta = currentRate - previousRate;
  if (delta === 0) return "0%";
  return `${delta > 0 ? "+" : ""}${delta}%`;
}

/** Account-level: any non-missed completion on a day keeps the streak alive. */
export function accountDayStreak(
  completions: HabitCompletion[],
  today: Date,
): number {
  const activeDates = new Set<string>();
  for (const c of completions) {
    if (isStreakDay(c.status)) activeDates.add(c.date);
  }

  let current = 0;
  const cursor = new Date(today);

  if (!activeDates.has(formatLocal(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!activeDates.has(formatLocal(cursor))) return 0;
  }

  while (activeDates.has(formatLocal(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return current;
}

/**
 * Calendar-day gap between two local dates: 1 = the next day, 2 = a day
 * was skipped.
 *
 * Deliberately NOT a raw millisecond subtraction. Two consecutive local
 * midnights are 23h apart across a spring-forward DST boundary and 25h
 * apart across fall-back, so `getTime() - getTime() === 86_400_000` cut
 * every streak that crossed a DST change. Normalising to midnight and
 * rounding is stable for both 23h and 25h gaps.
 */
function dayGap(from: Date, to: Date): number {
  const a = new Date(from);
  a.setHours(0, 0, 0, 0);
  const b = new Date(to);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function accountLongestStreak(completions: HabitCompletion[]): number {
  const activeDates = [...new Set(
    completions.filter((c) => isStreakDay(c.status)).map((c) => c.date),
  )].sort();

  let longest = 0;
  let run = 0;
  let prev: Date | null = null;

  for (const key of activeDates) {
    const date = parseLocal(key);
    if (prev && dayGap(prev, date) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = date;
  }

  return longest;
}

/** Longest run of consecutive days (by calendar day) with activity. */
function longestRun(dates: string[]): number {
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of dates) {
    const date = parseLocal(key);
    if (prev && dayGap(prev, date) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = date;
  }
  return longest;
}

export function computeStreak(
  completionsByDate: Map<string, HabitStatus>,
  today: Date,
  hasActivity: (status: HabitStatus | undefined) => boolean = isStreakDay,
): HabitStreak {
  const activityDates = [...completionsByDate.keys()]
    .filter((key) => hasActivity(completionsByDate.get(key)))
    .sort();
  const longest = longestRun(activityDates);

  let current = 0;
  const cursor = new Date(today);

  if (!hasActivity(completionsByDate.get(formatLocal(cursor)))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!hasActivity(completionsByDate.get(formatLocal(cursor)))) {
      // No activity today or yesterday — the streak is broken, but the
      // historical longest run is still a fact about the account.
      return { current: 0, longest };
    }
  }

  while (hasActivity(completionsByDate.get(formatLocal(cursor)))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, longest: Math.max(longest, current) };
}

export function formatLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocal(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Weighted completion rate for one habit over its active days in
 *  [fromDate, toDate] — days before the habit's creation don't count.
 *  done=1, partial=0.5, missed=0. Returns 0–1. */
export function weightedHabitRate(
  completions: HabitCompletion[],
  habitId: string,
  fromDate: Date,
  toDate: Date,
  createdAt: string,
): number {
  const createdKey = formatLocal(new Date(createdAt));
  const startKey = formatLocal(fromDate);
  const endKey = formatLocal(toDate);
  const fromKey = createdKey > startKey ? createdKey : startKey;
  if (fromKey > endKey) return 0;

  const days = daysBetween(parseLocal(fromKey), parseLocal(endKey));
  if (days <= 0) return 0;

  let weighted = 0;
  for (const c of completions) {
    if (c.habit_id !== habitId) continue;
    if (c.date < fromKey || c.date > endKey) continue;
    weighted += statusWeight(c.status);
  }
  return Math.min(1, weighted / days);
}

function dayWeightMap(completions: HabitCompletion[]): Map<string, number> {
  const weights = new Map<string, number>();
  for (const c of completions) {
    weights.set(c.date, (weights.get(c.date) ?? 0) + statusWeight(c.status));
  }
  return weights;
}

function rangeWeight(
  weights: Map<string, number>,
  from: Date,
  to: Date,
): number {
  let sum = 0;
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    sum += weights.get(formatLocal(cursor)) ?? 0;
    cursor.setDate(cursor.getDate() + 1);
  }
  return sum;
}

function daysBetween(from: Date, to: Date): number {
  return (
    Math.round(
      (to.getTime() - from.getTime()) / 86_400_000,
    ) + 1
  );
}

function clamp(from: Date, to: Date): { from: Date; to: Date; days: number } | null {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  if (start > end) return null;
  return { from: start, to: end, days: daysBetween(start, end) };
}

function bucketOf(
  key: string,
  tick: string,
  dateLabel: string,
  done: number,
  activeCount: number,
  days: number,
): CompletionBucket {
  const total = activeCount * days;
  return {
    key,
    tick,
    dateLabel,
    percent: total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0,
    done,
    total,
  };
}

/**
 * Weighted completion series (done=1, partial=0.5 over active habits × elapsed
 * days), anchored to `today`. Days before the first recorded completion are
 * clipped so new accounts don't render a row of leading zeros.
 */
export function buildCompletionSeries(
  granularity: StatsGranularity,
  completions: HabitCompletion[],
  activeHabitCount: number,
  today: Date,
  weekStartsOn: number,
): CompletionBucket[] {
  if (activeHabitCount <= 0 || completions.length === 0) return [];

  const weights = dayWeightMap(completions);
  const firstKey = completions.reduce(
    (min, c) => (c.date < min ? c.date : min),
    completions[0].date,
  );
  const firstDate = parseLocal(firstKey);

  const rangeWeightClipped = (from: Date, to: Date): { done: number; days: number } | null => {
    const effFrom = from > firstDate ? from : firstDate;
    /* A period that is still running must only be charged for the days that
       have actually happened. Without this the current month is divided by
       31 while only 19 days of data exist, so the chart reported 61% next
       to a KPI reading 100% for the exact same data — and the current year
       was meaningless (a perfect January scored 0%). */
    const effTo = to > today ? today : to;
    const span = clamp(effFrom, effTo);
    if (!span) return null;
    return { done: rangeWeight(weights, span.from, span.to), days: span.days };
  };

  const shortMonth = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short" });

  if (granularity === "Daily") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const buckets: CompletionBucket[] = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= today) {
      if (cursor >= firstDate) {
        const key = formatLocal(cursor);
        const done = weights.get(key) ?? 0;
        const day = cursor.getDate();
        buckets.push(
          bucketOf(
            key,
            day === 1 ? `${shortMonth(cursor)} 1` : String(day),
            `${shortMonth(cursor)} ${day}`,
            done,
            activeHabitCount,
            1,
          ),
        );
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return buckets;
  }

  if (granularity === "Weekly") {
    const thisWeek = startOfWeek(today, weekStartsOn);
    const buckets: CompletionBucket[] = [];
    for (let i = 11; i >= 0; i -= 1) {
      const weekStart = addDays(thisWeek, -7 * i);
      const weekEnd = addDays(weekStart, 6);
      const span = rangeWeightClipped(weekStart, weekEnd);
      if (!span) continue;
      buckets.push(
        bucketOf(
          formatLocal(weekStart),
          `${shortMonth(weekStart)} ${weekStart.getDate()}`,
          `Week of ${shortMonth(weekStart)} ${weekStart.getDate()}`,
          span.done,
          activeHabitCount,
          span.days,
        ),
      );
    }
    return buckets;
  }

  if (granularity === "Monthly") {
    const buckets: CompletionBucket[] = [];
    for (let i = 11; i >= 0; i -= 1) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      const span = rangeWeightClipped(monthStart, monthEnd);
      if (!span) continue;
      buckets.push(
        bucketOf(
          `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
          monthDate.toLocaleDateString("en-US", { month: "short" }),
          monthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          span.done,
          activeHabitCount,
          span.days,
        ),
      );
    }
    return buckets;
  }

  const years = new Set<number>([today.getFullYear()]);
  for (const c of completions) years.add(Number(c.date.slice(0, 4)));
  const recent = [...years].sort((a, b) => b - a).slice(0, 5).sort((a, b) => a - b);
  const buckets: CompletionBucket[] = [];
  for (const year of recent) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const span = rangeWeightClipped(yearStart, yearEnd);
    if (!span) continue;
    buckets.push(
      bucketOf(
        String(year),
        String(year),
        String(year),
        span.done,
        activeHabitCount,
        span.days,
      ),
    );
  }
  return buckets;
}

function activeRunEnding(
  activeDates: Set<string>,
  date: Date,
): number {
  let run = 0;
  const cursor = new Date(date);
  cursor.setHours(0, 0, 0, 0);
  while (activeDates.has(formatLocal(cursor))) {
    run += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return run;
}

function activeDateSet(completions: HabitCompletion[]): Set<string> {
  const activeDates = new Set<string>();
  for (const c of completions) {
    if (isStreakDay(c.status)) activeDates.add(c.date);
  }
  return activeDates;
}

export function streakEndingOn(
  completions: HabitCompletion[],
  date: Date,
): number {
  return activeRunEnding(activeDateSet(completions), date);
}

/** Streak length at the end of each day of `month`, counted continuously
 *  across month boundaries (day 1 includes runs started last month). Capped
 *  at `todayKey`; today gets Home's grace rule — if today has no activity
 *  yet, hold yesterday's streak so the series' last point equals the chip. */
export function streakSeriesForMonth(
  completions: HabitCompletion[],
  year: number,
  month: number,
  todayKey: string,
): StreakPoint[] {
  const activeDates = activeDateSet(completions);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const points: StreakPoint[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const key = formatLocal(date);
    if (key > todayKey) break;

    let measureDate = date;
    if (!activeDates.has(key)) {
      if (key !== todayKey) {
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        points.push({ key, tick: label, day, value: 0 });
        continue;
      }
      measureDate = new Date(year, month, day - 1);
    }

    const label = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    points.push({
      key,
      tick: label,
      day,
      value: activeRunEnding(activeDates, measureDate),
    });
  }
  return points;
}

/**
 * Map a day to its contribution level (0–4).
 *
 * One definition, shared by every consistency surface. With only a couple
 * of habits the raw rate is too coarse to split into four buckets — one
 * habit out of three is not "25% done" — so those days jump to a mid
 * level instead of pretending to be a light day.
 */
function consistencyLevel(
  activeCount: number,
  rate: number,
  totalHabits: number,
): 0 | 1 | 2 | 3 | 4 {
  if (activeCount <= 0) return 0;
  if (totalHabits <= 3) {
    if (activeCount === 1 && totalHabits > 1) return 2;
    if (activeCount >= totalHabits) return 4;
    return 3;
  }
  if (rate <= 25) return 1;
  if (rate <= 50) return 2;
  if (rate <= 75) return 3;
  return 4;
}

/**
 * The consistency window — a GitHub-style contribution grid covering the
 * last `weeks` weeks (7 weekday rows, one column per week).
 *
 * This is the SAME language the marketing page shows, so the real product
 * looks like the promise: every day you tracked, laid out the way a
 * contribution graph makes it obvious.
 */
export function buildConsistencyWindow(
  completions: HabitCompletion[],
  habits: StatsHabit[],
  todayKey: string,
  weekStartsOn: number = 1,
  weeks: number = 16,
): ConsistencyWindow {
  const today = parseLocal(todayKey);
  const activeHabits = habits.filter((h) => h.active);
  const totalHabits = activeHabits.length;
  const activeIds = new Set(activeHabits.map((h) => h.id));

  const byDate = new Map<string, { done: number; partial: number }>();
  for (const c of completions) {
    if (!activeIds.has(c.habit_id)) continue;
    const cur = byDate.get(c.date) ?? { done: 0, partial: 0 };
    if (c.status === "done") cur.done += 1;
    else if (c.status === "partial") cur.partial += 1;
    byDate.set(c.date, cur);
  }

  // The window ends with the current week; every column is one week.
  const todayDayOfWeek = (today.getDay() - weekStartsOn + 7) % 7;
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - todayDayOfWeek);

  const windowStart = new Date(startOfCurrentWeek);
  windowStart.setDate(startOfCurrentWeek.getDate() - (weeks - 1) * 7);

  const columns: ConsistencyDay[][] = [];
  let daysTracked = 0;
  let elapsedDays = 0;
  let totalCheckins = 0;
  let activeDaysCount = 0;
  let sumDailyRate = 0;

  for (let w = 0; w < weeks; w++) {
    const column: ConsistencyDay[] = [];

    for (let d = 0; d < 7; d++) {
      const cursor = new Date(windowStart);
      cursor.setDate(windowStart.getDate() + w * 7 + d);
      const key = formatLocal(cursor);
      const isToday = key === todayKey;
      const isFuture = key > todayKey;

      const counts = byDate.get(key) ?? { done: 0, partial: 0 };
      const done = counts.done;
      const partial = counts.partial;
      const activeCount = done + partial;
      const weighted = done + partial * 0.5;
      const rate =
        totalHabits > 0
          ? Math.min(100, Math.round((weighted / totalHabits) * 100))
          : 0;
      const level = isFuture ? 0 : consistencyLevel(activeCount, rate, totalHabits);

      if (!isFuture) {
        elapsedDays += 1;
        sumDailyRate += rate;
        if (activeCount > 0) {
          activeDaysCount += 1;
          daysTracked += 1;
          totalCheckins += done + partial;
        }
      }

      column.push({
        key,
        date: cursor,
        doneCount: done,
        partialCount: partial,
        activeCount,
        totalHabits,
        rate,
        level,
        isToday,
        isFuture,
        dayOfWeek: cursor.getDay(),
      });
    }
    columns.push(column);
  }

  const avgDailyRate = elapsedDays > 0 ? Math.round(sumDailyRate / elapsedDays) : 0;

  return {
    weeks: columns,
    daysTracked,
    elapsedDays,
    totalCheckins,
    activeDaysCount,
    avgDailyRate,
  };
}

export function buildStatsKpis(
  completions: HabitCompletion[],
  habits: StatsHabit[],
  activeCount: number,
  today: Date,
): StatsKpis {
  const activeHabits = habits.filter((h) => h.active);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const current = monthCompletionStats(
    completions,
    monthStart,
    today,
    activeHabits,
  );

  const prevDate = previousMonthDate(today);
  const prevStart = new Date(prevDate.getFullYear(), prevDate.getMonth(), 1);
  const prevEnd = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0);
  const prev = monthCompletionStats(
    completions,
    prevStart,
    prevEnd,
    activeHabits,
  );

  const currentStreak = accountDayStreak(completions, today);
  const prevRefDate = new Date(
    prevDate.getFullYear(),
    prevDate.getMonth() + 1,
    0,
  );
  const prevStreak = streakEndingOn(completions, prevRefDate);
  const streakDelta = currentStreak - prevStreak;

  const completionDelta = current.rate - prev.rate;

  return {
    overallCompletion: current.rate,
    completionVsLast:
      completionDelta === 0
        ? null
        : `${completionDelta > 0 ? "+" : ""}${completionDelta}%`,
    currentStreak,
    streakVsLast:
      streakDelta === 0 ? null : `${streakDelta > 0 ? "+" : ""}${streakDelta} days`,
    longestStreak: accountLongestStreak(completions),
    activeHabits: activeCount,
    totalHabits: habits.length,
  };
}
