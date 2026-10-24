"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { makeRevealAreaShape } from "@/components/ui/RevealAreaShape";
import { Card } from "@/components/ui/Card";
import type { HabitMonthPoint } from "@/lib/stats";

type HabitGraphCardProps = {
  series: HabitMonthPoint[];
  year: number;
  month: number;
};

const TICK_DAYS = [1, 7, 14, 21, 28];

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getHabitDotColor(percent: number | null): string {
  if (percent === null) return "var(--color-border)";
  if (percent === 100) return "var(--color-success)"; // Mint #86d6bf
  if (percent >= 80) return "var(--color-info)"; // Sky Blue #7dd3fc
  if (percent >= 60) return "var(--color-warning)"; // Gold #fcd34d
  if (percent >= 40) return "var(--color-primary)"; // Lavender #a78bfa
  if (percent > 0) return "var(--color-error)"; // Coral #fc5a5a
  return "var(--color-border-strong)"; // Muted slate #d4cce3
}

function GraphTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: HabitMonthPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  if (point.percent === null) return null;
  const color = getHabitDotColor(point.percent);
  return (
    <div className="rounded-xl border border-border/80 bg-surface/95 px-3 py-2 shadow-pop backdrop-blur-md [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.2)]">
      <p className="text-xs font-semibold text-text">{point.key}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="font-mono text-sm font-bold tabular-nums text-text">{point.percent}%</p>
      </div>
      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-text-muted">
        {point.done} done · {point.partial} partial of {point.total} habits
      </p>
    </div>
  );
}

const revealShape = makeRevealAreaShape({
  dot: ({ cx, cy, payload }) => {
    const point = payload as HabitMonthPoint | null;
    if (!point || point.percent === null) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={getHabitDotColor(point.percent)}
        stroke="var(--color-surface)"
        strokeWidth={2}
      />
    );
  },
});

export function HabitGraphCard({
  series,
  year,
  month,
}: HabitGraphCardProps) {
  const total = series.length > 0 ? series[0].total : 0;
  const hasPastData = series.some((p) => p.percent !== null);

  const lastDay = series.length > 0 ? series[series.length - 1].day : 0;
  const xTicks = series
    .filter(
      (p) => TICK_DAYS.includes(p.day) || (lastDay >= 29 && p.day === lastDay),
    )
    .map((p) => p.tick);

  return (
    <Card key={`${year}-${month}`}>
      <h2 className="text-base font-semibold text-text">Habit Graph</h2>
      <p className="mt-0.5 text-xs text-text-muted">
        Daily completion — {MONTH_LABELS[month]} {year}.
      </p>

      {total === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-text-muted">
            Add a habit to see your progress.
          </p>
        </div>
      ) : !hasPastData ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-text-muted">
            This month hasn&apos;t started yet.
          </p>
        </div>
      ) : (
        <div className="mt-4 h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="habitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="tick"
                ticks={xTicks}
                interval={0}
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                content={<GraphTooltip />}
                cursor={{ stroke: "var(--color-primary)", strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="percent"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#habitFill)"
                isAnimationActive={false}
                dot={false}
                shape={revealShape}
                activeDot={{ r: 7, strokeWidth: 2 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
