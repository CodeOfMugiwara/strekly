import { MOOD_SCALE } from "@/lib/mood-scale";

export type MoodLevel = {
  value: number;
  label: string;
  emoji: string;
  color: string;
};

export type MoodDay = {
  day: number;
  weekday: string;
  value: number | null;
};

export type MoodNote = {
  day: number;
  dateLabel: string;
  value: number | null;
  content: string;
};

export type MonthMoodData = {
  year: number;
  month: number;
  daysInMonth: number;
  monthLabel: string;
  levels: MoodLevel[];
  /** day-of-month → mood value (1–7) */
  entries: Record<number, number>;
  /** day-of-month → note content */
  notes: Record<number, string>;
  enableMoodNotes: boolean;
};

export type MoodDistribution = {
  totalDays: number;
  counts: Array<{ value: number; count: number }>;
};

export type GraphPeriod = "month" | "90d" | "year";

export const GRAPH_PERIODS: GraphPeriod[] = ["month", "90d", "year"];

/** Date-keyed mood data for a multi-month range (graph period view). */
export type MoodRangeData = {
  fromIso: string;
  toIso: string;
  /** ISO date → mood value */
  entries: Record<string, number>;
  /** ISO date → note content */
  notes: Record<string, string>;
};

/** One x-axis point for the mood graph, in any period. */
export type GraphSeriesPoint = {
  key: string;
  /** X-axis tick label (day number for month view; date or "" for ranges) */
  tick: string;
  /** Tooltip header, e.g. "Jul 12, 2026" */
  dateLabel: string;
  value: number | null;
  note: string | null;
};

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const FALLBACK_LEVELS: MoodLevel[] = MOOD_SCALE.map((m) => ({
  value: m.value,
  label: m.label,
  emoji: m.emoji,
  color: m.color,
}));

function dayLabel(year: number, month: number, day: number) {
  const mon = MONTH_NAMES[month].slice(0, 3);
  return `${mon} ${day}, ${year}`;
}

export function buildMoodDays(data: MonthMoodData): MoodDay[] {
  return Array.from({ length: data.daysInMonth }, (_, i) => {
    const day = i + 1;
    const weekday = WEEKDAYS[new Date(data.year, data.month, day).getDay()];
    return { day, weekday, value: data.entries[day] ?? null };
  });
}

export function buildMoodNotes(data: MonthMoodData): MoodNote[] {
  return Object.entries(data.notes)
    .map(([dayStr, content]) => {
      const day = Number(dayStr);
      return {
        day,
        dateLabel: dayLabel(data.year, data.month, day),
        value: data.entries[day] ?? null,
        content,
      };
    })
    .sort((a, b) => b.day - a.day);
}

export function buildMoodDistribution(data: MonthMoodData): MoodDistribution {
  const counts = data.levels.map((level) => ({
    value: level.value,
    count: Object.values(data.entries).filter((v) => v === level.value).length,
  }));
  return {
    totalDays: Object.keys(data.entries).length,
    counts,
  };
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Date bounds for a graph period, anchored to the selected month.
 * month: selected month; 90d: selected month + 2 prior; year: Jan 1 → end of selected month.
 */
export function getRangeBounds(
  period: GraphPeriod,
  year: number,
  month: number,
): { fromIso: string; toIso: string } {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const to = toIso(year, month, daysInMonth);
  if (period === "month") {
    return { fromIso: toIso(year, month, 1), toIso: to };
  }
  if (period === "90d") {
    let m = month - 2;
    let y = year;
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    return { fromIso: toIso(y, m, 1), toIso: to };
  }
  return { fromIso: toIso(year, 0, 1), toIso: to };
}

/** Graph series for the month view — day numbers on x-axis. */
export function buildMonthGraphSeries(data: MonthMoodData): GraphSeriesPoint[] {
  return Array.from({ length: data.daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      key: toIso(data.year, data.month, day),
      tick: String(day),
      dateLabel: dayLabel(data.year, data.month, day),
      value: data.entries[day] ?? null,
      note: data.notes[day] ?? null,
    };
  });
}

/** Graph series for a multi-month range — date ticks on month starts, gaps for unlogged days. */
export function buildRangeGraphSeries(range: MoodRangeData): GraphSeriesPoint[] {
  const points: GraphSeriesPoint[] = [];
  const end = parseIso(range.toIso);
  const cur = parseIso(range.fromIso);
  while (cur <= end) {
    const y = cur.getFullYear();
    const m = cur.getMonth();
    const d = cur.getDate();
    const iso = toIso(y, m, d);
    points.push({
      key: iso,
      tick: d === 1 || points.length === 0 ? `${MONTH_ABBR[m]} ${d}` : "",
      dateLabel: dayLabel(y, m, d),
      value: range.entries[iso] ?? null,
      note: range.notes[iso] ?? null,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return points;
}
