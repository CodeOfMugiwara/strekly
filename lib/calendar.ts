import type { HabitCompletion, HabitStatus } from "@/types";
import { dayCompletionRatio, formatLocal, parseLocal } from "@/lib/stats";

export type CalendarCell = {
  key: string;
  day: number;
  inMonth: boolean;
};

export type CalendarHabit = {
  id: string;
  name: string;
  emoji: string;
};

export type CalendarFace = {
  value: number;
  color: string;
};

export type CalendarDayCell = {
  /** One entry per habit with a logged status, in habit order. */
  dots: HabitStatus[];
  face: CalendarFace | null;
};

/** Everything the calendar needs, fetched in one pass (personal scale). */
export type CalendarData = {
  todayKey: string;
  habits: CalendarHabit[];
  completions: HabitCompletion[];
  moodValues: Record<string, number>;
  notes: Record<string, string>;
  moodLevels: Array<{ value: number; label: string; color: string }>;
  showMoodFaces: boolean;
  enableMoodNotes: boolean;
  /** profiles.week_starts_on (0=Sun … 6=Sat) — grid + header honor it. */
  weekStartsOn: number;
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Header labels rotated to start at the profile's week start day. */
export function weekdayHeaderLabels(weekStartsOn: number): string[] {
  const start = Math.min(Math.max(Math.round(weekStartsOn), 0), 6);
  return [...WEEKDAY_LABELS.slice(start), ...WEEKDAY_LABELS.slice(0, start)];
}

/** Monthly Overview tile dot colors from CalenderPage.png (hex via inline
 *  style — HABIT_TINTS precedent: hex lives in the pure module, not UI). */
export const OVERVIEW_TILE_COLORS: Record<string, string> = {
  great: "#34D399",
  okay: "#7DD3FC",
  tough: "#FC8FA5",
  "no-data": "#C7CCD1",
};

/** Weeks of full weeks covering `month`, starting at `weekStartsOn`
 *  (leading/trailing days belong to adjacent months, keys are real dates). */
export function buildMonthCells(
  year: number,
  month: number,
  weekStartsOn: number,
): CalendarCell[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells: CalendarCell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(year, month, 1 - startOffset + i);
    cells.push({
      key: formatLocal(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month && date.getFullYear() === year,
    });
  }
  return cells;
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function dayLabel(dateKey: string): string {
  return parseLocal(dateKey).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const date = new Date(year, month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function shiftDay(dateKey: string, delta: number): string {
  const date = parseLocal(dateKey);
  date.setDate(date.getDate() + delta);
  return formatLocal(date);
}

/** unset → done → partial → missed → unset (same cycle as Home / Habits). */
export function cycleStatus(status: HabitStatus | null): HabitStatus | null {
  if (status === null) return "done";
  if (status === "done") return "partial";
  if (status === "partial") return "missed";
  return null;
}

/** Upsert (or delete when null) one completion in an array — optimistic helper.
 *  Replaces the row IN PLACE so the array order stays stable; appending the
 *  updated row to the end reordered the whole collection on every toggle. */
export function withCompletion(
  completions: HabitCompletion[],
  habitId: string,
  date: string,
  status: HabitStatus | null,
): HabitCompletion[] {
  const index = completions.findIndex(
    (c) => c.habit_id === habitId && c.date === date,
  );
  if (status === null) {
    if (index < 0) return completions;
    return [...completions.slice(0, index), ...completions.slice(index + 1)];
  }
  if (index < 0) {
    return [
      ...completions,
      {
        id: `opt-${habitId}-${date}`,
        user_id: "",
        habit_id: habitId,
        date,
        status,
      },
    ];
  }
  const next = [...completions];
  next[index] = { ...completions[index], status };
  return next;
}

/** date → habitId → status (active habits only — loader filters). */
export function buildStatusMap(
  completions: HabitCompletion[],
): Record<string, Record<string, HabitStatus>> {
  const map: Record<string, Record<string, HabitStatus>> = {};
  for (const c of completions) {
    if (!map[c.date]) map[c.date] = {};
    map[c.date][c.habit_id] = c.status;
  }
  return map;
}

/** Per-day cell content: dots in habit order (logged statuses only) + face. */
export function buildCellMap(
  habits: CalendarHabit[],
  statusMap: Record<string, Record<string, HabitStatus>>,
  moodValues: Record<string, number>,
  moodLevels: Array<{ value: number; color: string }>,
  showFaces: boolean,
): Record<string, CalendarDayCell> {
  const cells: Record<string, CalendarDayCell> = {};
  for (const [date, byHabit] of Object.entries(statusMap)) {
    const dots: HabitStatus[] = [];
    for (const habit of habits) {
      const status = byHabit[habit.id];
      if (status) dots.push(status);
    }
    cells[date] = { dots, face: null };
  }
  if (showFaces) {
    for (const [date, value] of Object.entries(moodValues)) {
      const level = moodLevels.find((l) => l.value === value);
      const cell = (cells[date] ??= { dots: [], face: null });
      if (level) cell.face = { value: level.value, color: level.color };
    }
  }
  return cells;
}

export type MonthClassification = {
  great: number;
  okay: number;
  tough: number;
  noData: number;
  /** Great + Okay — the ring's "strong completion" numerator. */
  strong: number;
  /** Days classified (month-to-date for the current month; future excluded). */
  elapsed: number;
  percent: number;
};

/** Classify every elapsed day of `month` by weighted completion ratio over
 *  the active habits: Great === 1, Okay >= 0.5, Tough > 0, No Data === 0.
 *  Unlogged habits count as 0-weight slots (denominator = all active habits),
 *  so days before a habit existed honestly fall to No Data. Month-to-date for
 *  the current month; whole month for past months; future days excluded. */
export function classifyMonth(
  completions: HabitCompletion[],
  habits: CalendarHabit[],
  year: number,
  month: number,
  todayKey: string,
): MonthClassification {
  const statusMap = buildStatusMap(completions);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = parseLocal(todayKey);
  const isCurrent =
    today.getFullYear() === year && today.getMonth() === month;
  const isFuture =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());
  const lastDay = isFuture ? 0 : isCurrent ? today.getDate() : daysInMonth;

  let great = 0;
  let okay = 0;
  let tough = 0;
  let noData = 0;

  for (let day = 1; day <= lastDay; day += 1) {
    const key = formatLocal(new Date(year, month, day));
    const byHabit = statusMap[key];
    const ratio = dayCompletionRatio(
      habits.map((h) => byHabit?.[h.id]),
    );
    if (ratio === 1) great += 1;
    else if (ratio >= 0.5) okay += 1;
    else if (ratio > 0) tough += 1;
    else noData += 1;
  }

  const elapsed = lastDay;
  const strong = great + okay;
  return {
    great,
    okay,
    tough,
    noData,
    strong,
    elapsed,
    percent:
      elapsed === 0 ? 0 : Math.round((strong / elapsed) * 100),
  };
}