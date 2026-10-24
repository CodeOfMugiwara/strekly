import { BarChart3, Crown, Flame, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { cn } from "@/lib/utils";
import type { StatsKpis } from "@/lib/stats";

type KpiCardsProps = {
  kpis: StatsKpis;
};

type KpiDef = {
  icon: React.ElementType;
  bubble: string;
  iconColor: string;
  value: string;
  label: string;
  delta?: string;
  caption: string;
};

export function KpiCards({ kpis }: KpiCardsProps) {
  const defs: KpiDef[] = [
    {
      icon: Target,
      bubble: "bg-primary-lightest",
      iconColor: "text-primary-text",
      value: `${kpis.overallCompletion}%`,
      label: "Overall Completion",
      delta: kpis.completionVsLast ?? undefined,
      caption: kpis.completionVsLast ? "vs last month" : "monthly completion rate",
    },
    {
      icon: Flame,
      bubble: "bg-warning-light",
      iconColor: "text-warning-strong",
      value: String(kpis.currentStreak),
      label: "Current Streak",
      delta: kpis.streakVsLast ?? undefined,
      caption: kpis.streakVsLast ? "vs last month" : "active day streak",
    },
    {
      icon: Crown,
      bubble: "bg-primary-lightest",
      iconColor: "text-primary-text",
      value: String(kpis.longestStreak),
      label: "Longest Streak",
      caption: "all-time best run",
    },
    {
      icon: BarChart3,
      bubble: "bg-primary-lightest",
      iconColor: "text-primary-text",
      value: `${kpis.activeHabits}/${kpis.totalHabits}`,
      label: "Active Habits",
      caption: "habits in rotation",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {defs.map((def) => {
        const Icon = def.icon;
        return (
          <Card key={def.label} className="p-4">
            <StatTile
              icon={<Icon className={cn("h-4 w-4", def.iconColor)} />}
              iconClassName={def.bubble}
              value={def.value}
              label={def.label}
              caption={def.caption}
              delta={def.delta}
            />
          </Card>
        );
      })}
    </div>
  );
}
