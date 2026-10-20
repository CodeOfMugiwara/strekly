import type { HabitCompletion, MoodEntry } from "@/types";
import {
  completionPercent,
  formatLocal,
  parseLocal,
  statusWeight,
  weightedHabitRate,
} from "@/lib/stats";
import type { MoodDistribution, MoodLevel } from "@/lib/mood-view";

export type InsightPeriod = "this-month" | "last-3-months" | "this-year";

/** Calendar-month ranges anchored to real today (same convention as the
 *  Completion Overview pills — Stats has no month nav). */
export function insightRangeFor(
  period: InsightPeriod,
  today: Date,
): { from: Date; to: Date } {
  const to = today;
  if (period === "last-3-months") {
    return { from: new Date(today.getFullYear(), today.getMonth() - 2, 1), to };
  }
  if (period === "this-year") {
    return { from: new Date(today.getFullYear(), 0, 1), to };
  }
  return { from: new Date(today.getFullYear(), today.getMonth(), 1), to };
}

export type KeyInsight = {
  id: string;
  icon: "calendar" | "trend" | "moon" | "mood";
  title: string;
  detail: string;
};

const KEEP_GOING: KeyInsight = {
  id: "keep-going",
  icon: "trend",
  title: "Not enough data yet.",
  detail: "Complete a few more days and insights will appear here.",
};

export type MoodInsightRow = {
  value: number;
  count: number;
  phrase: string;
};

export function buildMoodInsightRows(
  distribution: MoodDistribution,
  levels: MoodLevel[],
): MoodInsightRow[] {
  return [...levels]
    .sort((a, b) => b.value - a.value)
    .map((level) => ({
      value: level.value,
      count:
        distribution.counts.find((c) => c.value === level.value)?.count ?? 0,
      phrase: `Felt ${level.label.toLowerCase()}`,
    }));
}

const PATTERN_MIN_DAYS = 3;
const PATTERN_MIN_GAP = 0.5;

function avg(values: number[]): number {
  return values.length === 0
    ? 0
    : values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * One defensible observation for the month, or null when data is too thin.
 * Rules (first hit wins): weekend vs weekday average → first-half vs
 * second-half trend → null. Comparing averages keeps this scale-agnostic
 * (works for 5- and 7-point mood scales).
 */
export function computeMoodPattern(
  entries: Record<number, number>,
  year: number,
  month: number,
): string | null {
  const logged = Object.entries(entries).map(([dayStr, value]) => ({
    day: Number(dayStr),
    value,
  }));
  if (logged.length === 0) return null;

  const weekend: number[] = [];
  const weekday: number[] = [];
  for (const { day, value } of logged) {
    const dow = new Date(year, month, day).getDay();
    if (dow === 0 || dow === 6) weekend.push(value);
    else weekday.push(value);
  }

  if (weekend.length >= PATTERN_MIN_DAYS && weekday.length >= PATTERN_MIN_DAYS) {
    const diff = avg(weekend) - avg(weekday);
    if (diff >= PATTERN_MIN_GAP) return "You felt happier on weekends this month!";
    if (diff <= -PATTERN_MIN_GAP) return "You felt happier on weekdays this month!";
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mid = Math.ceil(daysInMonth / 2);
  const early: number[] = [];
  const late: number[] = [];
  for (const { day, value } of logged) {
    if (day < mid) early.push(value);
    else late.push(value);
  }

  if (early.length >= PATTERN_MIN_DAYS && late.length >= PATTERN_MIN_DAYS) {
    const diff = avg(late) - avg(early);
    if (diff >= PATTERN_MIN_GAP) return "Your mood has been improving this month!";
    if (diff <= -PATTERN_MIN_GAP) return "Your mood has been dipping this month.";
  }

  return null;
}

export function computeKeyInsights(
  completions: HabitCompletion[],
  moods: MoodEntry[],
  habits: Array<{ id: string; name: string; createdAt: string }>,
  fromDate: Date,
  toDate: Date,
): KeyInsight[] {
  const insights: KeyInsight[] = [];
  const days = eachDate(fromDate, toDate);

  if (days.length === 0) return [KEEP_GOING];

  /* Every rate in this file uses the SAME denominator: the number of habits
     that actually existed on that day. The old code divided by the number
     of habits the user HAPPENED TO LOG that day, so a day with 1 of 5
     habits done scored 100% — identical to a perfect day. The weekday vs
     weekend insight could then never fire, and the trend line had no
     relationship to the app's own completion percentage. */
  const habitMeta = habits.map((h) => ({
    id: h.id,
    name: h.name,
    createdAt: h.createdAt,
    createdKey: formatLocal(new Date(h.createdAt)),
  }));
  const habitMetaById = new Map(habitMeta.map((h) => [h.id, h]));

  const weightByDate = new Map<string, number>();
  const countByDate = new Map<string, number>();
  for (const c of completions) {
    const habit = habitMetaById.get(c.habit_id);
    if (!habit) continue;
    if (c.date < habit.createdKey) continue;
    weightByDate.set(c.date, (weightByDate.get(c.date) ?? 0) + statusWeight(c.status));
    countByDate.set(c.date, (countByDate.get(c.date) ?? 0) + 1);
  }

  /* Days before the first habit existed cannot be "missed", so they are not
     part of the comparison at all. */
  const earliestKey = habitMeta.length
    ? habitMeta.reduce(
        (min, h) => (h.createdKey < min ? h.createdKey : min),
        habitMeta[0].createdKey,
      )
    : null;
  const effectiveDays = earliestKey
    ? days.filter((d) => formatLocal(d) >= earliestKey)
    : days;

  const activeCountOn = (key: string) => {
    let count = 0;
    for (const h of habitMeta) if (h.createdKey <= key) count += 1;
    return count;
  };

  /** Weighted completion over the habits active that day (0–1). */
  const ratioFor = (day: Date): number => {
    const key = formatLocal(day);
    const active = activeCountOn(key);
    if (active === 0) return 0;
    return (weightByDate.get(key) ?? 0) / active;
  };

  const weekdayRatios: number[] = [];
  const weekendRatios: number[] = [];

  for (const day of effectiveDays) {
    const ratio = ratioFor(day);
    const dow = day.getDay();
    if (dow === 0 || dow === 6) weekendRatios.push(ratio);
    else weekdayRatios.push(ratio);
  }

  const avg = (arr: number[]) =>
    arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

  const weekdayAvg = avg(weekdayRatios);
  const weekendAvg = avg(weekendRatios);

  if (weekdayRatios.length > 0 && weekendRatios.length > 0) {
    const diff = Math.round((weekdayAvg - weekendAvg) * 100);
    if (Math.abs(diff) >= 5) {
      insights.push({
        id: "weekday-vs-weekend",
        icon: "calendar",
        title:
          diff > 0
            ? "You're most consistent on weekdays."
            : "You're most consistent on weekends.",
        detail:
          diff > 0
            ? `Your completion rate is ${Math.abs(diff)}% higher on weekdays.`
            : `Your completion rate is ${Math.abs(diff)}% higher on weekends.`,
      });
    }
  }

  let bestHabit: { name: string } | null = null;
  let bestRate = 0;

  for (const habit of habits) {
    const rate = weightedHabitRate(
      completions,
      habit.id,
      fromDate,
      toDate,
      habit.createdAt,
    );
    if (rate > bestRate) {
      bestRate = rate;
      bestHabit = habit;
    }
  }

  if (bestHabit && bestRate >= 0.5) {
    insights.push({
      id: "strongest-habit",
      icon: "moon",
      title: `Your ${bestHabit.name} habit is your strongest.`,
      detail: `You've completed it ${Math.round(bestRate * 100)}% of the time this period.`,
    });
  }

  const firstHalf = effectiveDays.slice(0, Math.floor(effectiveDays.length / 2));
  const secondHalf = effectiveDays.slice(Math.floor(effectiveDays.length / 2));

  const avgFor = (range: Date[]) => {
    if (range.length === 0) return 0;
    return avg(range.map((d) => ratioFor(d)));
  };

  const early = avgFor(firstHalf);
  const late = avgFor(secondHalf);
  const change = Math.round((late - early) * 100);

  if (Math.abs(change) >= 10) {
    insights.push({
      id: "trend",
      icon: "trend",
      title:
        change > 0
          ? "Your consistency is improving."
          : "Your consistency dipped recently.",
      detail:
        change > 0
          ? `Completion is up ${change}% compared to the earlier part of this period.`
          : `Completion is down ${Math.abs(change)}% compared to the earlier part of this period.`,
    });
  }

  const moodByDate = new Map<string, number>();
  for (const m of moods) {
    const d = parseLocal(m.date);
    if (d >= fromDate && d <= toDate) {
      moodByDate.set(m.date, m.mood_value);
    }
  }

  if (moodByDate.size > 0) {
    // Check correlation between habits completed and mood
    const highCompletionMoods: number[] = [];
    const lowCompletionMoods: number[] = [];

    for (const [dateStr, moodVal] of moodByDate.entries()) {
      /* Only days where the user actually logged a habit count. A day with
         no habit entries at all is "no data", not "a low completion day" —
         counting it as low dragged every correlation downwards. */
      if (!countByDate.has(dateStr)) continue;
      const day = parseLocal(dateStr);
      const ratio = ratioFor(day);
      if (ratio >= 0.6) highCompletionMoods.push(moodVal);
      else lowCompletionMoods.push(moodVal);
    }

    if (highCompletionMoods.length >= 2 && lowCompletionMoods.length >= 2) {
      const highAvg = avg(highCompletionMoods);
      const lowAvg = avg(lowCompletionMoods);
      const diff = highAvg - lowAvg;
      if (diff >= 0.3) {
        insights.push({
          id: "mood-habit-correlation",
          icon: "mood",
          title: "Habits elevate your mood ✨",
          detail: `On days you complete your habits, your mood averages ${highAvg.toFixed(1)} vs ${lowAvg.toFixed(1)} on lower completion days.`,
        });
      } else {
        insights.push({
          id: "mood-logged",
          icon: "mood",
          title: `${moodByDate.size} mood ${moodByDate.size === 1 ? "entry" : "entries"} this period.`,
          detail: `Average mood is ${avg(Array.from(moodByDate.values())).toFixed(1)}. Keep logging to discover personal patterns.`,
        });
      }
    } else if (highCompletionMoods.length >= 2) {
      const highAvg = avg(highCompletionMoods);
      insights.push({
        id: "mood-habit-correlation",
        icon: "mood",
        title: "Habits support positive moods ✨",
        detail: `On days with completed habits, your mood averages ${highAvg.toFixed(1)}.`,
      });
    } else {
      insights.push({
        id: "mood-logged",
        icon: "mood",
        title: `${moodByDate.size} mood ${moodByDate.size === 1 ? "entry" : "entries"} this period.`,
        detail: "Keep logging to notice emotional patterns over time.",
      });
    }
  }

  if (insights.length === 0) {
    insights.push(KEEP_GOING);
  }

  return insights.slice(0, 4);
}

function eachDate(from: Date, to: Date): Date[] {
  const out: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export { completionPercent };
