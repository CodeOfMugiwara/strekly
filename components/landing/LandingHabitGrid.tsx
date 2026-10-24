"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Flame, RotateCcw, Sparkles } from "lucide-react";
import { StatusGlyph } from "@/components/ui/StatusGlyph";
import { cn } from "@/lib/utils";
import type { HabitStatus } from "@/types";

type GridStatus = HabitStatus | "unset";

type Row = {
  name: string;
  emoji: string;
  week: GridStatus[];
};

const INITIAL_ROWS: Row[] = [
  {
    name: "Drink 2L water",
    emoji: "💧",
    week: ["done", "done", "done", "done", "done", "partial", "unset"],
  },
  {
    name: "Read 20 min",
    emoji: "📖",
    week: ["done", "done", "partial", "done", "unset", "unset", "unset"],
  },
  {
    name: "Move for 30 min",
    emoji: "🏃",
    week: ["done", "missed", "done", "done", "unset", "unset", "unset"],
  },
  {
    name: "Sleep by 11pm",
    emoji: "🌙",
    week: ["partial", "done", "done", "unset", "unset", "unset", "unset"],
  },
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const cellClasses: Record<GridStatus, string> = {
  done: "border-transparent bg-success text-success-foreground shadow-xs shadow-success/20 ring-1 ring-inset ring-white/20",
  partial: "border-transparent bg-warning text-warning-foreground shadow-xs shadow-warning/20 ring-1 ring-inset ring-white/20",
  missed: "border-transparent bg-error text-error-foreground shadow-xs shadow-error/20 ring-1 ring-inset ring-white/20",
  unset: "border-border/70 bg-surface/60 text-text-muted hover:border-primary/40 hover:bg-surface-hover/80",
};

const NEXT_STATUS: Record<GridStatus, GridStatus> = {
  unset: "done",
  done: "partial",
  partial: "missed",
  missed: "unset",
};

export function LandingHabitGrid() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const handleCellClick = (rowIndex: number, dayIndex: number) => {
    setRows((prev) => {
      const next = prev.map((row, rIdx) => {
        if (rIdx !== rowIndex) return row;
        const newWeek = [...row.week];
        newWeek[dayIndex] = NEXT_STATUS[newWeek[dayIndex]];
        return { ...row, week: newWeek };
      });
      return next;
    });
    setLastClicked(`${rowIndex}-${dayIndex}`);
  };

  const handleReset = () => {
    setRows(INITIAL_ROWS);
    setLastClicked(null);
  };

  // Calculate total completed or partial
  const totalCompleted = rows.reduce(
    (acc, row) => acc + row.week.filter((s) => s === "done" || s === "partial").length,
    0,
  );

  return (
    <div className="relative">
      {/* Specular soft glow behind focal card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-2xl"
      />

      <div className="rounded-2xl border border-border/80 bg-surface/95 p-4 shadow-pop backdrop-blur-md sm:p-5">
        {/* Window chrome & interactive badge */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>

          <p className="text-xs font-medium text-text-muted">This week</p>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-primary/25 bg-primary-lightest/70 px-2.5 py-0.5 text-[11px] font-medium text-primary-text sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-text animate-pulse" />
              Live preview: tap any cell
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-warning-light px-2.5 py-0.5 text-[11px] font-semibold text-warning-foreground">
              <Flame className="h-3 w-3 fill-current" />
              {12 + (totalCompleted > 16 ? 1 : 0)}d streak
            </span>
          </div>
        </div>

        {/* Day header */}
        <div className="mb-2 grid grid-cols-[1.1fr_repeat(7,minmax(0,1fr))] items-center gap-1.5">
          <span className="sr-only">Habit</span>
          {DAYS.map((day, i) => (
            <span
              key={i}
              className={cn(
                "text-center text-[10px] font-semibold",
                i === 4 ? "text-primary-text" : "text-text-muted",
              )}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Habit rows */}
        <div className="space-y-1.5">
          {rows.map((row, rowIndex) => (
            <div
              key={row.name}
              className="grid grid-cols-[1.1fr_repeat(7,minmax(0,1fr))] items-center gap-1.5"
            >
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-text-secondary">
                <span aria-hidden className="text-sm">
                  {row.emoji}
                </span>
                <span className="truncate">{row.name}</span>
              </span>

              {row.week.map((status, dayIndex) => {
                const cellKey = `${rowIndex}-${dayIndex}`;
                const isJustClicked = lastClicked === cellKey;

                return (
                  <motion.button
                    type="button"
                    key={dayIndex}
                    onClick={() => handleCellClick(rowIndex, dayIndex)}
                    aria-label={`${row.name}, ${DAYS[dayIndex]}: ${status}. Click to change.`}
                    whileTap={{ scale: 0.88 }}
                    className={cn(
                      "group relative flex h-7 items-center justify-center rounded-lg border text-[11px] font-bold transition-[background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      cellClasses[status],
                      isJustClicked && "animate-status-pop",
                    )}
                    initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 460,
                      damping: 26,
                      delay: reduced ? 0 : 0.08 + (rowIndex * 7 + dayIndex) * 0.03,
                    }}
                  >
                    <StatusGlyph status={status} size={13} />
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend & Demo Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-[11px] text-text-muted">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            {[
              { label: "Done", status: "done" as const },
              { label: "Partial", status: "partial" as const },
              { label: "Missed", status: "missed" as const },
            ].map((item) => (
              <span key={item.status} className="inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-md text-[9px]",
                    cellClasses[item.status],
                  )}
                >
                  <StatusGlyph status={item.status} size={10} />
                </span>
                <span className="font-medium text-text-secondary">{item.label}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-text-muted md:inline">
              Partial days preserve momentum.
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Reset grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
