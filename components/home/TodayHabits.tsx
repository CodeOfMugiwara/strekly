"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { setHabitCompletion } from "@/actions/completions";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { HabitIcon } from "@/components/ui/HabitIcon";
import { StatusPop } from "@/components/ui/StatusPop";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import type { HomeHabitRow } from "@/lib/home-data";
import type { HabitStatus } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  habits: HomeHabitRow[];
  weekDateKeys: string[];
  selectedDate: string;
};

const circleClass: Record<HabitStatus | "unset", string> = {
  done: "border-transparent bg-success text-success-foreground glow-success shadow-xs",
  partial: "border-transparent bg-warning text-warning-foreground glow-warning shadow-xs",
  missed: "border-transparent bg-error text-error-foreground shadow-xs",
  unset: "border-border/80 bg-surface text-transparent hover:border-primary/60 hover:bg-surface-hover/80",
};

function StatusGlyph({ status }: { status: HabitStatus | null }) {
  if (status === "done") return <Check className="h-3.5 w-3.5 stroke-[3]" />;
  if (status === "partial") return <Minus className="h-3.5 w-3.5 stroke-[3]" />;
  if (status === "missed") return <X className="h-3 w-3 stroke-[3]" />;
  return null;
}

function cycleStatus(current: HabitStatus | null): HabitStatus | null {
  const cycle: Array<HabitStatus | null> = ["done", "partial", "missed", null];
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
}

function getDayHeader(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()];
}

export function TodayHabits({ habits, weekDateKeys, selectedDate }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  /* Per-cell request sequence numbers — used to drop stale rollbacks. */
  const seqRef = useRef(new Map<string, number>());

  // Optimistic local state for snappy check-ins
  const [localStatuses, setLocalStatuses] = useState<Record<string, Array<HabitStatus | null>>>(() => {
    const map: Record<string, Array<HabitStatus | null>> = {};
    for (const h of habits) {
      map[h.id] = [...h.weekStatuses];
    }
    return map;
  });

  // Sync localStatuses when habits prop updates
  const [prevHabits, setPrevHabits] = useState(habits);
  if (habits !== prevHabits) {
    setPrevHabits(habits);
    const map: Record<string, Array<HabitStatus | null>> = {};
    for (const h of habits) {
      map[h.id] = [...h.weekStatuses];
    }
    setLocalStatuses(map);
  }

  function handleClick(habitId: string, dayIndex: number, dateKey: string, current: HabitStatus | null) {
    const next = cycleStatus(current);

    /* Sequence guard per cell — see the rollback in handleClick's request
       handler. */
    const cellKey = `${habitId}:${dateKey}`;
    const seq = (seqRef.current.get(cellKey) ?? 0) + 1;
    seqRef.current.set(cellKey, seq);

    // Optimistically update
    setLocalStatuses((prev) => {
      const row = [...(prev[habitId] ?? [])];
      row[dayIndex] = next;
      return { ...prev, [habitId]: row };
    });

    if (next === "done") {
      // Check if all habits for this dateKey are now completed
      const allDone = habits.every((h) => {
        if (h.id === habitId) return true;
        const currentStatus = (localStatuses[h.id] ?? h.weekStatuses)[dayIndex];
        return currentStatus === "done";
      });

      if (allDone) {
        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#a78bfa", "#86d6bf", "#fcd34d", "#f43f5e", "#60a5fa"],
          });
        } catch {
          // Ignore in non-browser
        }
        toast.success("All habits completed! Lumi is celebrating with you! 🎉");
      } else {
        toast.success("Habit checked off! Keep the momentum! ✨", { duration: 1800 });
      }
    }

    startTransition(async () => {
      const res = await setHabitCompletion({
        habitId,
        date: dateKey,
        status: next,
      });

      if (!res.success) {
        /* Drop stale rollbacks: if the same cell was clicked again while
           this request was in flight, the newer optimistic value must
           survive this older request's failure. */
        const cellKey = `${habitId}:${dateKey}`;
        if (seqRef.current.get(cellKey) !== seq) return;
        // Rollback on failure — only this habit+day
        setLocalStatuses((prev) => {
          const row = [...(prev[habitId] ?? [])];
          row[dayIndex] = current;
          return { ...prev, [habitId]: row };
        });
        toast.error("Could not save check-in. Reverted.");
      }
    });
  }

  if (habits.length === 0) {
    return (
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Today&apos;s Habits</CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <LumiMascot size="lg" mood="idle" showDialogue={false} />
          <div className="max-w-xs">
            <h3 className="text-base font-semibold text-text">Your habit canvas is ready</h3>
            <p className="mt-1 text-xs text-text-muted">
              Add your daily rituals and let Lumi keep you motivated each day.
            </p>
          </div>
          <Button
            variant="primary"
            disabled={isPending}
            onClick={() => router.push("/habits")}
            className="mt-1 glow-primary"
          >
            <Plus className="h-4 w-4" />
            Add First Habit
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Today&apos;s Habits</CardTitle>
          <span className="rounded-full bg-primary-lightest px-2 py-0.5 text-[11px] font-semibold text-primary-text">
            {habits.length}
          </span>
        </div>
        <span className="text-xs text-text-muted">Click any day to cycle status</span>
      </CardHeader>

      {/* Weekday column headers aligned with check-in circles */}
      <div className="flex items-center justify-end pb-1 pt-2">
        <div className="flex gap-1.5">
          {weekDateKeys.map((dateKey) => {
            const isToday = dateKey === selectedDate;
            const header = getDayHeader(dateKey);
            return (
              <div
                key={dateKey}
                className={cn(
                  "flex h-7 w-7 items-center justify-center text-[11px] font-medium transition-colors",
                  isToday ? "font-bold text-primary-text" : "text-text-muted",
                )}
                title={dateKey}
              >
                {header}
              </div>
            );
          })}
        </div>
      </div>

      <ul className="space-y-1.5 pt-1" data-tour="home-checkin">
        {habits.map((habit) => {
          const statuses = localStatuses[habit.id] ?? habit.weekStatuses;
          return (
            <li
              key={habit.id}
              className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-alt/60"
            >
              <HabitIcon emoji={habit.emoji} name={habit.name} size={40} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-text">{habit.name}</div>
                {habit.description ? (
                  <div className="truncate text-xs text-text-muted">
                    {habit.description}
                  </div>
                ) : null}
              </div>
              <div className="flex gap-1.5">
                {statuses.map((status, i) => {
                  const dateKey = weekDateKeys[i];
                  const isToday = dateKey === selectedDate;
                  const label = status ?? "unset";
                  return (
                    <button
                      key={dateKey}
                      type="button"
                      aria-label={`${habit.name} ${dateKey}: ${label} (click to cycle)`}
                      aria-pressed={status === "done"}
                      onClick={() => handleClick(habit.id, i, dateKey, status)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-[transform,background-color,border-color] duration-150 hover:scale-110 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        circleClass[status ?? "unset"],
                        isToday && "ring-2 ring-primary/40",
                      )}
                    >
                      <StatusPop status={status ?? "unset"}>
                        <StatusGlyph status={status} />
                      </StatusPop>
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        variant="secondary"
        className="mt-4 w-full border-border/80 hover:border-primary/40 hover:bg-surface-hover/80 transition-[border-color,background-color] duration-200"
        disabled={isPending}
        onClick={() => router.push("/habits")}
      >
        <Plus className="h-4 w-4" />
        Manage Habits
      </Button>
    </Card>
  );
}
