"use client";

import { Card } from "@/components/ui/Card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { CompletionBucket, StatsGranularity } from "@/lib/stats";

type CompletionOverviewCardProps = {
  series: CompletionBucket[];
  granularity: StatsGranularity;
  onGranularityChange: (g: StatsGranularity) => void;
  activeHabitCount: number;
};

const GRANULARITIES: StatsGranularity[] = [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
];

function formatDone(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function CustomTooltip({
  active,
  payload,
  granularity,
}: {
  active?: boolean;
  payload?: Array<{ payload: CompletionBucket }>;
  granularity: StatsGranularity;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-pop">
      <p className="text-xs font-medium text-text">{point.dateLabel}</p>
      <p className="mt-0.5 text-xs font-semibold text-primary-text">
        {point.percent}%
      </p>
      <p className="text-[11px] text-text-muted">
        {formatDone(point.done)}/{formatDone(point.total)}{" "}
        {granularity === "Daily" ? "habits" : "check-ins"}
      </p>
    </div>
  );
}

export function CompletionOverviewCard({
  series,
  granularity,
  onGranularityChange,
  activeHabitCount,
}: CompletionOverviewCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text">
          Completion Overview
        </h2>
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Granularity"
        >
          {GRANULARITIES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGranularityChange(g)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                granularity === g
                  ? "bg-primary text-primary-on"
                  : "text-text-muted hover:text-text",
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {activeHabitCount === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-text-muted">
            Add a habit to start tracking your progress.
          </p>
        </div>
      ) : series.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-text-muted">
            No completion data yet — check off a habit to see your progress.
          </p>
        </div>
      ) : (
        <div className="mt-4 h-64 min-w-0">
          <ResponsiveContainer
            key={`${granularity}:${series[0]?.tick ?? ""}:${series.length}`}
            width="100%"
            height="100%"
          >
            <BarChart
              data={series}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="tick"
                interval={granularity === "Weekly" ? 1 : 0}
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
                width={40}
              />
              <Tooltip
                content={<CustomTooltip granularity={granularity} />}
                cursor={{ fill: "var(--color-primary-lightest)" }}
              />
              <Bar
                dataKey="percent"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}