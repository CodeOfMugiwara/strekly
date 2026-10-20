"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useRef } from "react";
import { MoodFace } from "@/components/ui/MoodFace";
import { MoodFacePop } from "@/components/ui/MoodFacePop";
import { cn } from "@/lib/utils";
import type { MoodDay, MoodLevel } from "@/lib/mood-view";
import { MonthNav } from "@/components/ui/MonthNav";

type MonthCardProps = {
  monthLabel: string;
  days: MoodDay[];
  levels: MoodLevel[];
  selectedDay: number;
  selectedValue: number | null;
  onSelectDay: (day: number) => void;
  onSetMood: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function MonthCard({
  monthLabel,
  days,
  levels,
  selectedDay,
  selectedValue,
  onSelectDay,
  onSetMood,
  onPrev,
  onNext,
}: MonthCardProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedDay]);
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthNav title={monthLabel} onPrev={onPrev} onNext={onNext} />
      </div>

      {/* Date strip */}
      <div ref={stripRef} className="scrollbar-hide mt-4 overflow-x-auto pb-1">
        <div className="flex gap-1.5">
          {days.map((day) => {
            const level = day.value
              ? levels.find((l) => l.value === day.value)
              : null;
            const selected = day.day === selectedDay;
            return (
              <button
                key={day.day}
                ref={selected ? selectedRef : undefined}
                type="button"
                onClick={() => onSelectDay(day.day)}
                className={cn(
                  "flex w-14 shrink-0 flex-col items-center gap-1.5 rounded-xl border-2 px-1 py-2.5 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  selected
                    ? "border-primary bg-surface shadow-card"
                    : "border-transparent hover:bg-surface-hover",
                )}
              >
                <span className="text-[11px] text-text-muted">
                  {day.weekday}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    selected ? "text-text" : "text-text-secondary",
                  )}
                >
                  {day.day}
                </span>
                {level ? (
                  <MoodFacePop value={level.value} color={level.color} size={30} />
                ) : (
                  <span className="h-[30px] w-[30px] rounded-full border border-dashed border-border" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend chips — click to set mood for the selected day */}
      <div className="mt-4 flex flex-wrap gap-2" data-tour="mood-log">
        {levels.map((level) => {
          const active = selectedValue === level.value;
          return (
            <button
              key={level.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSetMood(level.value)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                active
                  ? "border-primary bg-primary-lightest"
                  : "border-border bg-surface hover:bg-surface-hover",
              )}
            >
              <MoodFace value={level.value} color={level.color} size={24} />
              <span
                className={cn(
                  "text-xs",
                  active ? "font-medium text-text" : "text-text-secondary",
                )}
              >
                {level.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
