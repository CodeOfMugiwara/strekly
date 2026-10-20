"use client";

import { Card } from "@/components/ui/Card";
import { GripVertical, StickyNote } from "lucide-react";
import { motion } from "motion/react";
import { HabitIcon } from "@/components/ui/HabitIcon";
import { StatusPop } from "@/components/ui/StatusPop";
import { cn } from "@/lib/utils";
import type { GridHabit, StatusMap } from "@/lib/habits-data";
import type { HabitStatus } from "@/types";

const cellClasses: Record<string, string> = {
  done: "border-transparent bg-success text-success-foreground glow-success shadow-xs",
  partial: "border-transparent bg-warning text-warning-foreground glow-warning shadow-xs",
  missed: "border-transparent bg-error text-error-foreground shadow-xs",
  unset: "border-border/80 bg-surface text-transparent hover:border-primary/50",
};

const glyphs: Record<string, string> = {
  done: "✓",
  partial: "~",
  missed: "✗",
  unset: "",
};

const LEGEND = [
  { label: "Done", glyph: "✓", className: cellClasses.done },
  { label: "Partial", glyph: "~", className: cellClasses.partial },
  { label: "Missed", glyph: "✗", className: cellClasses.missed },
];

type HabitGridCardProps = {
  habits: GridHabit[];
  daysInMonth: number;
  todayDay: number | null;
  statuses: StatusMap;
  notes: Record<string, string>;
  year: number;
  month: number;
  onCycle: (habitId: string, day: number) => void;
  onOpenNote: (day: number) => void;
  onOpenEdit: (habit: GridHabit) => void;
  dragId: string | null;
  dragOverId: string | null;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
};

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function HabitGridCard({
  habits,
  daysInMonth,
  todayDay,
  statuses,
  notes,
  year,
  month,
  onCycle,
  onOpenNote,
  onOpenEdit,
  dragId,
  dragOverId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: HabitGridCardProps) {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const columns = `repeat(${daysInMonth}, minmax(0, 1fr))`;

  return (
    <Card data-tour="habits-grid">
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Day-number header */}
          <div className="flex items-end">
            <div className="sticky left-0 z-20 w-44 shrink-0 bg-surface pr-2.5" />
            <div
              className="grid flex-1 gap-1"
              style={{ gridTemplateColumns: columns }}
            >
              {days.map((day) => (
                <div key={day} className="flex justify-center">
                  <span
                    className={cn(
                      "flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[11px] font-medium",
                      todayDay === day
                        ? "bg-primary font-bold text-primary-on"
                        : "text-text-muted",
                    )}
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Habit rows */}
          <div className="mt-1.5 space-y-1">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                /* FLIP: when the order changes, each row glides to its new
                   position instead of teleporting. */
                layout
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
                draggable={habit.active}
                onDragStart={() => onDragStart(habit.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver(habit.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  onDrop(habit.id);
                }}
                onDragEnd={onDragEnd}
                className={cn(
                  "flex items-center rounded-md",
                  !habit.active && "opacity-60",
                  dragId === habit.id && "opacity-40",
                  dragOverId === habit.id &&
                    dragId !== habit.id &&
                    "ring-2 ring-primary/50",
                )}
              >
                <div className="sticky left-0 z-10 flex w-44 shrink-0 items-center gap-1.5 bg-surface pr-2.5">
                  {habit.active ? (
                    <span
                      className="cursor-grab text-text-muted/60 hover:text-text-muted active:cursor-grabbing"
                      aria-hidden
                    >
                      <GripVertical className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="w-3.5" aria-hidden />
                  )}
                  <HabitIcon emoji={habit.emoji} name={habit.name} size={32} />
                  <button
                    type="button"
                    onClick={() => onOpenEdit(habit)}
                    title={`Edit ${habit.name}`}
                    data-tour="habits-edit"
                    className="truncate whitespace-nowrap text-left text-[13px] font-medium text-text hover:text-primary-text hover:underline"
                  >
                    {habit.name}
                  </button>
                </div>
                <div
                  className="grid flex-1 gap-1"
                  style={{ gridTemplateColumns: columns }}
                >
                  {days.map((day) => {
                    const key = dateKey(year, month, day);
                    const status = (statuses[habit.id]?.[key] ??
                      "unset") as HabitStatus | "unset";
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-label={`${habit.name} — ${key}: ${status}`}
                        onClick={() => onCycle(habit.id, day)}
                        className={cn(
                          "flex h-7 w-full items-center justify-center rounded-md border-2 text-[11px] font-bold transition-transform hover:scale-105",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                          cellClasses[status],
                          todayDay === day &&
                            status === "unset" &&
                            "border-primary bg-primary-lightest/40",
                        )}
                      >
                        <StatusPop status={status}>{glyphs[status]}</StatusPop>
                      </button>
                    );
                  })}
                  </div>
                </motion.div>
            ))}
          </div>


          {/* Notes row */}
          <div className="mt-2.5 flex items-center">
            <div className="sticky left-0 z-10 flex w-44 shrink-0 items-center bg-surface pr-2.5">
              <span className="text-sm font-medium text-text-muted">Notes</span>
            </div>
            <div
              className="grid flex-1 gap-1"
              style={{ gridTemplateColumns: columns }}
            >
              {days.map((day) => {
                const key = dateKey(year, month, day);
                const hasNote = Boolean(notes[key]);
                return (
                  <button
                    key={day}
                    type="button"
                    aria-label={
                      hasNote
                        ? `Edit note for ${key}`
                        : `Add note for ${key}`
                    }
                    onClick={() => onOpenNote(day)}
                    className={cn(
                      "flex h-7 w-full items-center justify-center rounded-md border transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      hasNote
                        ? "border-primary bg-primary-lightest text-primary-text"
                        : "border-dashed border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary-text",
                      todayDay === day &&
                        !hasNote &&
                        "border-solid border-primary bg-primary-lightest/40",
                    )}
                  >
                    <StickyNote className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 border-t border-border pt-4">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md border-2 text-[10px] font-bold",
                item.className,
              )}
            >
              {item.glyph}
            </span>
            <span className="text-xs text-text-secondary">
              {item.label} {item.glyph}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
