"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { HomeWeekDay } from "@/lib/home-data";
import { cn } from "@/lib/utils";

type Props = {
  days: HomeWeekDay[];
};

export function WeekStrip({ days }: Props) {
  return (
    <Card data-tour="home-week">
      <CardHeader>
        <CardTitle>This Week</CardTitle>
      </CardHeader>
      <div className="flex justify-between">
        {days.map((day) => (
          <div key={day.key} className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "text-[11px]",
                day.isToday ? "font-medium text-primary-text" : "text-text-muted",
              )}
            >
              {day.short}
            </span>
            <span className="relative inline-flex">
              <ProgressRing
                percent={day.percent}
                size={34}
                stroke={3.5}
                hideAtZero
                ariaLabel={`${day.short}: ${day.percent}% completed`}
              />
              {day.isToday ? (
                <span className="absolute -inset-0.5 rounded-full ring-2 ring-primary/60 ring-offset-1 ring-offset-surface shadow-subtle" />
              ) : null}
            </span>
            <span className="sr-only">{day.percent}% completed</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
