"use client";

import { Card } from "@/components/ui/Card";
import { MoodFace } from "@/components/ui/MoodFace";
import {
  buildMonthCells,
  monthLabel,
  weekdayHeaderLabels,
  type CalendarDayCell,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { MonthNav, TodayButton } from "@/components/ui/MonthNav";
import { MotionSwap, type SwapDirection } from "@/components/ui/MotionSwap";
import { SlidingIndicator } from "@/components/ui/SlidingIndicator";

const DOT_CLASS: Record<string, string> = {
  done: "bg-success-strong",
  partial: "bg-warning",
  missed: "bg-error",
};

type MonthCardProps = {
  year: number;
  month: number;
  todayKey: string;
  selectedKey: string;
  cellMap: Record<string, CalendarDayCell>;
  weekStartsOn: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onSelect: (dateKey: string) => void;
  /** Which way the user moved: 1 = next, -1 = previous. */
  direction: SwapDirection;
};

export function MonthCard({
  year,
  month,
  todayKey,
  selectedKey,
  cellMap,
  weekStartsOn,
  onPrev,
  onNext,
  onToday,
  onSelect,
  direction,
}: MonthCardProps) {
  const cells = buildMonthCells(year, month, weekStartsOn);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <MonthNav
          as="h2"
          year={year}
          month={month}
          title={monthLabel(year, month)}
          onPrev={onPrev}
          onNext={onNext}
        />
        <TodayButton onClick={onToday} />
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {weekdayHeaderLabels(weekStartsOn).map((label) => (
          <div
            key={label}
            className="pb-1 text-center text-xs font-medium text-text-muted"
          >
            {label}
          </div>
        ))}
      </div>

      <MotionSwap swapKey={`${year}-${month}`} direction={direction}>
        <div className="grid grid-cols-7 gap-1.5" data-tour="calendar-grid">
        {cells.map((cell, idx) => {
          const delay = `${Math.floor(idx / 7) * 30 + (idx % 7) * 15}ms`;
          if (!cell.inMonth) {
            return (
              <div
                key={cell.key}
                className="flex min-h-[76px] flex-col items-center gap-1 rounded-lg px-1 py-1.5"
              >
                <span className="text-sm text-text-muted/50">{cell.day}</span>
              </div>
            );
          }

          const data = cellMap[cell.key];
          const isSelected = cell.key === selectedKey;
          const isToday = cell.key === todayKey;

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onSelect(cell.key)}
              aria-label={cell.key}
              aria-pressed={isSelected}
              style={{ animationDelay: delay }}
              className={cn(
                "cal-cell relative flex min-h-[76px] flex-col items-center gap-1 rounded-lg border-2 border-transparent px-1 py-1.5",
                "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                !isSelected && isToday && "border-primary/60",
              )}
            >
              {isSelected ? (
                <SlidingIndicator
                  layoutId="calendar-day-pill"
                  className="rounded-lg border-2 border-primary bg-surface"
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 text-sm",
                  isSelected || isToday
                    ? "font-semibold text-text"
                    : "text-text-secondary",
                )}
              >
                {cell.day}
              </span>
              <span
                aria-hidden
                className="relative z-10 flex min-h-[6px] items-center justify-center gap-[3px]"
              >
                {(data?.dots ?? []).map((status, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      DOT_CLASS[status],
                    )}
                  />
                ))}
              </span>
              {data?.face ? (
                <MoodFace
                  value={data.face.value}
                  color={data.face.color}
                  size={22}
                  className="relative z-10"
                />
              ) : (
                <span className="relative z-10 h-[22px]" aria-hidden />
              )}
            </button>
          );
        })}
        </div>
      </MotionSwap>
    </Card>
  );
}