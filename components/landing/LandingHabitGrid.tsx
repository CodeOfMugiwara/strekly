"use client";

import { motion, useReducedMotion } from "motion/react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The hero's product visual — a REAL habit grid.
 *
 * The research is consistent on this: visitors convert on seeing the
 * product, not on an illustration of it. So this renders the same cell
 * language the app uses (done / partial / missed / unset, the same token
 * colours, the same icon treatment) and animates a week filling in.
 *
 * It is static sample data on purpose — the point is to show the SHAPE of
 * the thing, and a real account's grid cannot be shown to a stranger.
 */

type Row = {
  name: string;
  emoji: string;
  /** 7 statuses for one week, Monday → Sunday. */
  week: ("done" | "partial" | "missed" | "unset")[];
};

const ROWS: Row[] = [
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

const cellClasses: Record<string, string> = {
  done: "border-transparent bg-success text-success-foreground shadow-xs",
  partial: "border-transparent bg-warning text-warning-foreground shadow-xs",
  missed: "border-transparent bg-error text-error-foreground shadow-xs",
  unset: "border-border/70 bg-surface/60 text-transparent",
};

const glyphs: Record<string, string> = {
  done: "✓",
  partial: "~",
  missed: "✗",
  unset: "",
};

export function LandingHabitGrid() {
  const reduced = useReducedMotion();

  return (
    <div className="relative">
      {/* Glow behind the card so it reads as the hero's focal object. */}
      <div

        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-primary/12 blur-2xl"
      />

      <div className="rounded-2xl border border-border/80 bg-surface/90 p-4 shadow-pop backdrop-blur-md sm:p-5">
        {/* Window chrome — makes the grid read as a real app surface. */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <p className="text-xs font-medium text-text-muted">This week</p>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-warning-light px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
            <Flame className="h-3 w-3 fill-current" />
            12 day streak
          </span>
        </div>

        {/* Day header */}
        <div className="mb-2 grid grid-cols-[1fr_repeat(7,minmax(0,1fr))] items-center gap-1.5">
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
          {ROWS.map((row, rowIndex) => (
            <div
              key={row.name}
              className="grid grid-cols-[1fr_repeat(7,minmax(0,1fr))] items-center gap-1.5"
            >
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-text-secondary">
                <span aria-hidden className="text-sm">
                  {row.emoji}
                </span>
                <span className="truncate">{row.name}</span>
              </span>

              {row.week.map((status, dayIndex) => {
                const index = rowIndex * 7 + dayIndex;
                return (
                  <motion.span
                    key={dayIndex}
                    className={cn(
                      "flex h-7 items-center justify-center rounded-md border text-[11px] font-bold",
                      cellClasses[status],
                    )}
                    initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 460,
                      damping: 26,
                      // Each cell pops in on its own beat, sweeping row by
                      // row — the grid assembles itself.
                      delay: reduced ? 0 : 0.12 + index * 0.045,
                    }}
                  >
                    {glyphs[status]}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/70 pt-3 text-[11px] text-text-muted">
          {[
            { label: "Done", status: "done" },
            { label: "Partial", status: "partial" },
            { label: "Missed", status: "missed" },
          ].map((item) => (
            <span key={item.status} className="inline-flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold",
                  cellClasses[item.status],
                )}
              >
                {glyphs[item.status]}
              </span>
              {item.label}
            </span>
          ))}
          <span className="ml-auto">A missed day is data, not failure.</span>
        </div>
      </div>
    </div>
  );
}
