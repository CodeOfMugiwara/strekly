"use client";

import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { HabitIcon } from "@/components/ui/HabitIcon";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils";

type Props = {
  progressPercent: number;
  progressHint: string;
  dayStreak: number;
  longestStreak: number;
};

export function StatCards({
  progressPercent,
  progressHint,
  dayStreak,
  longestStreak,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="flex items-center gap-4">
        <ProgressRing
          percent={progressPercent}
          ariaLabel={`${progressPercent}% complete`}
        >
          <CountUp
            value={progressPercent}
            format={(v) => `${Math.round(v)}%`}
            className="text-lg font-bold tracking-tight text-text tabular-nums"
          />
        </ProgressRing>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-text">Today&apos;s Progress</div>
          <div className="mt-1 text-xs text-text-muted">{progressHint}</div>
        </div>
      </Card>

      <Card
        className={cn(
          "flex items-start gap-4",
          dayStreak > 0 && "border-warning/30",
        )}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning-light/80 text-warning-strong shadow-xs">
          <HabitIcon emoji="🔥" name="streak" size={32} />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold tracking-tight text-text tabular-nums">
            <CountUp value={dayStreak} />{" "}
            <span className="text-xs font-medium text-text-muted">days</span>
          </div>
          <div className="text-sm font-medium text-text">Day Streak</div>
          <div className="mt-0.5 text-xs text-text-muted">
            {dayStreak > 0 ? "You are on a roll!" : "Check in today to start"}
          </div>
        </div>
      </Card>

      <Card className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-lightest text-primary-text shadow-xs">
          <HabitIcon emoji="👑" name="longest" size={32} />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold tracking-tight text-text tabular-nums">
            <CountUp value={longestStreak} />{" "}
            <span className="text-xs font-medium text-text-muted">days</span>
          </div>
          <div className="text-sm font-medium text-text">Longest Streak</div>
          <div className="mt-0.5 text-xs text-text-muted">
            {longestStreak > 0 ? "Personal record" : "Build your best run"}
          </div>
        </div>
      </Card>
    </div>
  );
}

