"use client";

import { Card } from "@/components/ui/Card";
import { useCallback, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { makeRevealAreaShape, type RevealDotInput } from "@/components/ui/RevealAreaShape";
import { MoodFace } from "@/components/ui/MoodFace";
import type { GraphPeriod, GraphSeriesPoint, MoodLevel } from "@/lib/mood-view";

type MoodGraphCardProps = {
  series: GraphSeriesPoint[];
  levels: MoodLevel[];
  period: GraphPeriod;
  onPeriodChange: (period: GraphPeriod) => void;
};

const PERIOD_OPTIONS: Array<DropdownOption<GraphPeriod>> = [
  { value: "month", label: "This Month" },
  { value: "90d", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
];

const SUBTITLES: Record<GraphPeriod, string> = {
  month: "Your emotional journey this month.",
  "90d": "Your emotional journey over the last 3 months.",
  year: "Your emotional journey this year.",
};

function levelColor(levels: MoodLevel[], value: number | null): string {
  if (value === null) return "var(--color-border)";
  return levels.find((l) => l.value === value)?.color ?? "var(--color-primary)";
}

function CustomTooltip({
  active,
  payload,
  levels,
}: {
  active?: boolean;
  payload?: Array<{ payload: GraphSeriesPoint }>;
  levels: MoodLevel[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const level =
    point.value !== null
      ? levels.find((l) => l.value === point.value)
      : null;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-pop">
      <p className="text-xs font-medium text-text">{point.dateLabel}</p>
      {level ? (
        <div className="mt-1 flex items-center gap-1.5">
          <MoodFace value={level.value} color={level.color} size={20} />
          <span className="text-xs text-text">{level.label}</span>
        </div>
      ) : (
        <p className="mt-1 text-xs text-text-muted">No mood logged</p>
      )}
      {point.note ? (
        <p className="mt-1 max-w-48 truncate text-[11px] text-text-muted">
          {point.note}
        </p>
      ) : null}
    </div>
  );
}

export function MoodGraphCard({
  series,
  levels,
  period,
  onPeriodChange,
}: MoodGraphCardProps) {
  const scaleValues = levels.map((l) => l.value);
  const domainMin = Math.min(...scaleValues);
  const domainMax = Math.max(...scaleValues);

  /* Memoise the shape so its component type stays stable. Building it inline
     produced a new type each render => React remounted the shape => the
     entrance wipe restarted on every parent re-render. `levels` is the only
     captured data, and it is reference-stable across mood edits. */
  const dot = useCallback(
    ({ cx, cy, payload }: RevealDotInput) => {
      const point = payload as GraphSeriesPoint;
      return (
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill={levelColor(levels, point.value)}
          stroke="var(--color-surface)"
          strokeWidth={2}
        />
      );
    },
    [levels],
  );

  const revealShape = useMemo(() => makeRevealAreaShape({ dot }), [dot]);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">Mood Graph</h2>
          <p className="mt-0.5 text-xs text-text-muted">{SUBTITLES[period]}</p>
        </div>
        <Dropdown
          options={PERIOD_OPTIONS}
          value={period}
          onChange={onPeriodChange}
          align="right"
          ariaLabel="Graph period"
        />
      </div>

      <div className="mt-4 flex gap-2">
        {/* Face y-axis labels */}
        <div className="flex w-8 shrink-0 flex-col justify-between py-1">
          {[...levels]
            .sort((a, b) => b.value - a.value)
            .map((level) => (
              <MoodFace
                key={level.value}
                value={level.value}
                color={level.color}
                size={26}
              />
            ))}
        </div>

        <div
          key={`${period}:${series[0]?.key ?? ""}:${series[series.length - 1]?.key ?? ""}`}
          className="h-64 min-w-0 flex-1"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
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
                interval={0}
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                domain={[domainMin, domainMax]}
                ticks={scaleValues.slice().sort((a, b) => a - b)}
                tick={false}
                axisLine={false}
                tickLine={false}
                width={0}
              />
              <Tooltip
                content={<CustomTooltip levels={levels} />}
                cursor={{ stroke: "var(--color-primary)", strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#moodFill)"
                isAnimationActive={false}
                dot={false}
                shape={revealShape}
                activeDot={{ r: 7, strokeWidth: 2 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}