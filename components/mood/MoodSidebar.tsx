"use client";

import { Card } from "@/components/ui/Card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Lightbulb } from "lucide-react";
import { MoodFace } from "@/components/ui/MoodFace";
import type { MoodInsightRow } from "@/lib/insights";
import type { MoodDistribution, MoodLevel } from "@/lib/mood-view";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

type MoodSidebarProps = {
  distribution: MoodDistribution;
  levels: MoodLevel[];
  insightRows: MoodInsightRow[];
  pattern: string;
};

export function MoodSidebar({
  distribution,
  levels,
  insightRows,
  pattern,
}: MoodSidebarProps) {
  const pieData = distribution.counts.map((c) => ({
    name: levels.find((l) => l.value === c.value)?.label ?? "",
    value: c.count,
    color: levels.find((l) => l.value === c.value)?.color ?? "var(--color-primary)",
  }));

  const levelOrder = [...levels].sort((a, b) => b.value - a.value);

  return (
    <aside className="space-y-4">
      {/* Distribution */}
      <Card>
        <h2 className="text-base font-semibold text-text">Mood Distribution</h2>
        <div className="mt-3 flex items-center gap-4">
          <div className="relative h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={38}
                  outerRadius={60}
                  paddingAngle={2}
                  strokeWidth={0}
                  isAnimationActive
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-text">
                {distribution.totalDays}
              </span>
              <span className="text-[10px] text-text-muted">days</span>
            </span>
          </div>
          <ul className="min-w-0 flex-1 space-y-2">
            {levelOrder.map((level) => {
              const count =
                distribution.counts.find((c) => c.value === level.value)?.count ??
                0;
              return (
                <li key={level.value} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="flex-1 truncate text-xs text-text-secondary">
                    {level.label}
                  </span>
                  <span className="text-xs font-semibold text-text">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>

      {/* Insights */}
      <Card>
        <h2 className="text-base font-semibold text-text">Mood Insights</h2>
        <ul className="mt-3 space-y-2.5">
          {insightRows.map((row) => {
            const level = levels.find((l) => l.value === row.value);
            if (!level) return null;
            return (
              <li
                key={row.value}
                className="flex items-center gap-3 rounded-lg bg-surface-muted p-2.5"
              >
                <MoodFace value={level.value} color={level.color} size={32} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text">
                    {row.count} days
                  </p>
                  <p className="text-xs text-text-muted">{row.phrase}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-primary-lightest p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" />
          <p className="text-xs text-text-secondary">{pattern}</p>
        </div>
      </Card>

      {/* Decorative */}
      <Card className="relative overflow-hidden bg-primary-lightest">
        <ScriptQuote className="leading-relaxed">
          {"Progress\nlooks different\nevery day\nand that's okay."}
        </ScriptQuote>
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-2 right-2 select-none text-4xl opacity-40"
        >
          🪻
        </span>
      </Card>
    </aside>
  );
}
