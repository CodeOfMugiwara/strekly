"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { MoodFace } from "@/components/ui/MoodFace";
import { setDayMood } from "@/actions/moods";
import { cn } from "@/lib/utils";
import type { MoodScaleLevel } from "@/lib/mood-scale";

type HomeMoodCardProps = {
  dateKey: string;
  moodLevels: MoodScaleLevel[];
  initialMoodValue: number | null;
};

export function HomeMoodCard({
  dateKey,
  moodLevels,
  initialMoodValue,
}: HomeMoodCardProps) {
  const [currentMood, setCurrentMood] = useState<number | null>(initialMoodValue);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (val: number) => {
    const nextVal = currentMood === val ? null : val;
    setCurrentMood(nextVal);

    startTransition(async () => {
      const result = await setDayMood({
        date: dateKey,
        moodValue: nextVal,
      });
      if (!result.success) {
        // Rollback on failure
        setCurrentMood(currentMood);
        console.error("[HomeMoodCard/setDayMood]", result.error);
      }
    });
  };

  const activeLevel = moodLevels.find((lvl) => lvl.value === currentMood);

  return (
    <Card className="flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-text">Daily Mood</h3>
          <p className="text-xs text-text-muted">
            {activeLevel
              ? `You're feeling ${activeLevel.label.toLowerCase()} today`
              : "How are you feeling today?"}
          </p>
        </div>
        {activeLevel && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-lightest px-2.5 py-1 text-xs font-medium text-primary-text animate-fade-in">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activeLevel.color }}
              aria-hidden
            />
            {activeLevel.label}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 sm:gap-2">
        {moodLevels.map((level) => {
          const isSelected = currentMood === level.value;
          return (
            <button
              key={level.value}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(level.value)}
              title={`${level.label} (Tap to ${isSelected ? "clear" : "select"})`}
              className={cn(
                "group relative flex flex-1 flex-col items-center gap-1.5 rounded-xl p-2 transition-all",
                "hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isSelected
                  ? "border border-primary/40 bg-primary-lightest shadow-xs"
                  : "border border-transparent hover:border-border hover:bg-surface-hover",
              )}
            >
              <MoodFace
                value={level.value}
                color={level.color}
                size={32}
                className={cn(
                  "transition-transform group-hover:scale-110",
                  currentMood !== null && !isSelected && "opacity-45 hover:opacity-100",
                )}
              />
              <span
                className={cn(
                  "truncate text-[11px] font-medium transition-colors",
                  isSelected
                    ? "text-primary-text font-semibold"
                    : "text-text-muted group-hover:text-text",
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
