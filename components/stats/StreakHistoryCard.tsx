"use client";

import { Card } from "@/components/ui/Card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { makeRevealAreaShape } from "@/components/ui/RevealAreaShape";
import type { StreakPoint } from "@/lib/stats";

type StreakHistoryCardProps = {
  series: StreakPoint[];
  chipValue: number;
};

const TICK_DAYS = [1, 7, 14, 21, 28];

/* Module scope on purpose. `makeRevealAreaShape` returns a React component
   type — building it inside the component body would produce a NEW type on
   every render, so React would remount the shape and restart the entrance
   wipe from zero on every parent re-render. */
const revealShape = makeRevealAreaShape({
  dot: ({ cx, cy, index }) => {
    if (index % 3 !== 0) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="var(--color-primary)"
        stroke="var(--color-surface)"
        strokeWidth={2}
      />
    );
  },
});

export function StreakHistoryCard({
  series,
  chipValue,
}: StreakHistoryCardProps) {
  const maxVal = series.reduce((max, p) => Math.max(max, p.value), 0);
  const domainMax = Math.max(30, Math.ceil(maxVal / 30) * 30);
  const yTicks: number[] = [];
  for (let v = 0; v <= domainMax; v += 10) yTicks.push(v);

  const lastDay = series.length > 0 ? series[series.length - 1].day : 0;
  const xTicks = series
    .filter(
      (p) => TICK_DAYS.includes(p.day) || (lastDay >= 28 && p.day === lastDay),
    )
    .map((p) => p.tick);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-text">Streak History</h2>
        <div className="rounded-xl border border-border/80 bg-surface/90 px-3.5 py-1.5 text-center shadow-card [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.2)]">
          <p className="font-mono text-lg font-bold leading-none tabular-nums text-text">{chipValue}</p>
          <p className="mt-0.5 text-[10px] font-medium text-text-muted">days</p>
        </div>
      </div>

      {maxVal === 0 ? (
        <div className="flex h-56 items-center justify-center">
          <p className="text-sm text-text-muted">
            Complete a habit to start your streak.
          </p>
        </div>
      ) : (
        <div className="mt-4 h-56 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="streakFill" x1="0" y1="0" x2="0" y2="1">
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
                domain={[0, domainMax]}
                ticks={yTicks}
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#streakFill)"
                isAnimationActive={false}
                dot={false}
                shape={revealShape}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}