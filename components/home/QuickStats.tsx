"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { StatTile } from "@/components/ui/StatTile";
import type { HomeQuickStats } from "@/lib/home-data";

type Props = {
  stats: HomeQuickStats;
};

export function QuickStats({ stats }: Props) {
  const tiles = [
    {
      key: "completed",
      value: <CountUp value={stats.completed} />,
      label: "Habits Completed",
      icon: "✓",
      valueClassName: "text-success-strong",
      iconClassName: "bg-success-light text-success-strong",
    },
    {
      key: "missed",
      value: <CountUp value={stats.missed} />,
      label: "Habits Missed",
      icon: "✕",
      valueClassName: "text-error",
      iconClassName: "bg-error-light text-error",
    },
    {
      key: "rate",
      value: (
        <CountUp value={stats.rate} format={(v) => `${Math.round(v)}%`} />
      ),
      label: "Completion Rate",
      icon: "◷",
      iconClassName: "bg-primary-lightest text-primary-text",
    },
    {
      key: "vs",
      value: stats.vsLastMonth,
      label: "vs Last Month",
      icon: "▮",
      iconClassName: "bg-accent-light text-accent-foreground",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-muted">
          This Month
        </span>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((s) => (
          <div
            key={s.key}
            className="rounded-xl border border-border/60 bg-surface-alt/70 p-3.5 transition-[border-color,background-color,box-shadow] duration-200 hover:border-primary/30 hover:bg-surface-alt hover:shadow-xs"
          >
            <StatTile
              icon={<span className="text-xs font-bold">{s.icon}</span>}
              iconClassName={s.iconClassName}
              value={s.value}
              valueClassName={s.valueClassName}
              label={s.label}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
