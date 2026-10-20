"use client";

import { useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { setHabitCompletion } from "@/actions/completions";
import { Button } from "@/components/ui/Button";
import { MonthNav } from "@/components/ui/MonthNav";
import { HabitGridCard } from "@/components/habits/HabitGridCard";
import { HabitGraphCard } from "@/components/habits/HabitGraphCard";
import { NoteModal } from "@/components/habits/NoteModal";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import { reorderHabits } from "@/actions/habits";
import { saveDayNote, deleteDayNote } from "@/actions/notes";
import { buildHabitMonthSeries } from "@/lib/stats";
import type { HabitStatus } from "@/types";
import type { GridCategory, GridHabit, StatusMap } from "@/lib/habits-data";

const CYCLE: Record<HabitStatus | "unset", HabitStatus | null> = {
  unset: "done",
  done: "partial",
  partial: "missed",
  missed: null,
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

type HabitsViewProps = {
  initialHabits: GridHabit[];
  categories: GridCategory[];
  initialStatuses: StatusMap;
  initialNotes: Record<string, string>;
  defaultView: { year: number; month: number };
};

export function HabitsView({
  initialHabits,
  categories,
  initialStatuses,
  initialNotes,
  defaultView,
}: HabitsViewProps) {
  const [year, setYear] = useState(defaultView.year);
  const [month, setMonth] = useState(defaultView.month);
  const [habits, setHabits] = useState<GridHabit[]>(initialHabits);
  const [statuses, setStatuses] = useState<StatusMap>(initialStatuses);
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);
  const [noteDay, setNoteDay] = useState<number | null>(null);
  const [formHabit, setFormHabit] = useState<GridHabit | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  /* `dragover` fires continuously (~60/s) while the pointer moves over the
     grid. Updating state on every event re-rendered the whole 31-column
     grid each time, so the id is only written when it actually changes. */
  const handleDragOver = (habitId: string) => {
    setDragOverId((prev) => (prev === habitId ? prev : habitId));
  };

  /* Per-cell request sequence numbers — used to drop stale rollbacks. */
  const seqRef = useRef(new Map<string, number>());

  const [prevInitialHabits, setPrevInitialHabits] = useState(initialHabits);
  if (prevInitialHabits !== initialHabits) {
    setPrevInitialHabits(initialHabits);
    setHabits(initialHabits);
  }
  const [prevInitialStatuses, setPrevInitialStatuses] = useState(initialStatuses);
  if (prevInitialStatuses !== initialStatuses) {
    setPrevInitialStatuses(initialStatuses);
    setStatuses(initialStatuses);
  }
  const [prevInitialNotes, setPrevInitialNotes] = useState(initialNotes);
  if (prevInitialNotes !== initialNotes) {
    setPrevInitialNotes(initialNotes);
    setNotes(initialNotes);
  }

  const totalDays = useMemo(() => daysInMonth(year, month), [year, month]);

  const now = new Date();
  const todayDay =
    year === now.getFullYear() && month === now.getMonth()
      ? now.getDate()
      : null;

  const sortedHabits = useMemo(
    () =>
      [...habits].sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        return a.sortOrder - b.sortOrder;
      }),
    [habits],
  );

  const monthSeries = useMemo(() => {
    const nowDate = new Date();
    const todayKey = dateKey(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate(),
    );
    const activeIds = sortedHabits.filter((h) => h.active).map((h) => h.id);
    return buildHabitMonthSeries(statuses, activeIds, year, month, todayKey);
  }, [statuses, sortedHabits, year, month]);

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const cycleStatus = (habitId: string, day: number) => {
    const key = dateKey(year, month, day);
    /* `Record` indexing is non-nullable in TS, so `?? "unset"` is seen as
       unreachable and `current` narrows to `HabitStatus` — the cast is what
       lets the "unset" comparison below type-check (same pattern as
       HabitGridCard). */
    const current = (statuses[habitId]?.[key] ??
      "unset") as HabitStatus | "unset";
    const next = CYCLE[current];

    setStatuses((s) => {
      const habitDays = { ...s[habitId] };
      if (next) habitDays[key] = next;
      else delete habitDays[key];
      return { ...s, [habitId]: habitDays };
    });

    /* Sequence guard per cell: if the user clicks the same cell again
       before this request resolves, the older request must not roll the
       cell back over the newer optimistic value. */
    const cellKey = `${habitId}:${key}`;
    const seq = (seqRef.current.get(cellKey) ?? 0) + 1;
    seqRef.current.set(cellKey, seq);

    void setHabitCompletion({
      habitId,
      date: key,
      status: next,
    }).then((result) => {
      if (!result.success) {
        if (seqRef.current.get(cellKey) !== seq) return;
        /* Roll back ONLY this cell. Restoring the whole status map would
           discard other habits' successful writes that landed while this
           request was in flight. */
        setStatuses((s) => {
          const habitDays = { ...(s[habitId] ?? {}) };
          if (current === "unset") delete habitDays[key];
          else habitDays[key] = current;
          return { ...s, [habitId]: habitDays };
        });
        console.error("[HabitsView/cycleStatus]", result.error);
      }
    });
  };

  const handleReorder = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const activeIds = sortedHabits.filter((h) => h.active).map((h) => h.id);
    const from = activeIds.indexOf(dragId);
    const to = activeIds.indexOf(targetId);
    if (from < 0 || to < 0) return;

    const reordered = [...activeIds];
    reordered.splice(from, 1);
    reordered.splice(to, 0, dragId);

    const orderById = new Map(reordered.map((id, i) => [id, i]));
    setHabits((prevHabits) =>
      prevHabits.map((h) =>
        h.active && orderById.has(h.id)
          ? { ...h, sortOrder: orderById.get(h.id)! }
          : h,
      ),
    );

    void reorderHabits(reordered).then((result) => {
      if (!result.success) {
        console.error("[HabitsView/handleReorder]", result.error);
      }
    });
    setDragId(null);
    setDragOverId(null);
  };

  const saveNote = (day: number, text: string) => {
    const key = dateKey(year, month, day);
    if (!text) {
      setNotes((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setNoteDay(null);
      void deleteDayNote(key).then((result) => {
        if (!result.success) {
          console.error("[HabitsView/saveNote delete]", result.error);
        }
      });
      return;
    }

    setNotes((prev) => ({ ...prev, [key]: text }));
    setNoteDay(null);
    void saveDayNote({ date: key, content: text }).then((result) => {
      if (!result.success) {
        console.error("[HabitsView/saveNote]", result.error);
      }
    });
  };

  const handleDeleteNote = (day: number) => {
    saveNote(day, "");
  };

  const openAdd = () => {
    setFormHabit(null);
    setFormOpen(true);
  };

  const openEdit = (habit: GridHabit) => {
    setFormHabit(habit);
    setFormOpen(true);
  };

  const goToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <MonthNav
            as="h1"
            year={year}
            month={month}
            onPrev={goPrev}
            onNext={goNext}
            onToday={goToday}
            showToday={
              !(year === now.getFullYear() && month === now.getMonth())
            }
            titleClassName="text-2xl"
          />
          <p className="mt-1 text-sm text-text-muted">
            Track every habit, every day — at a glance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LumiMascot
            size="sm"
            mood="celebrate"
            showDialogue={false}
            message="One more habit, one more reason to show up."
            caption="Tap Lumi for a nudge."
          />
          <Button onClick={openAdd} data-tour="habits-add">
            <Plus className="h-4 w-4" />
            Add Habit
          </Button>
        </div>
      </div>

      <HabitGridCard
        habits={sortedHabits}
        daysInMonth={totalDays}
        todayDay={todayDay}
        statuses={statuses}
        notes={notes}
        year={year}
        month={month}
        onCycle={cycleStatus}
        onOpenNote={setNoteDay}
        onOpenEdit={openEdit}
        dragId={dragId}
        dragOverId={dragOverId}
        onDragStart={setDragId}
        onDragOver={handleDragOver}
        onDrop={handleReorder}
        onDragEnd={() => {
          setDragId(null);
          setDragOverId(null);
        }}
      />

      <HabitGraphCard series={monthSeries} year={year} month={month} />

      {noteDay !== null && (
        <NoteModal
          day={noteDay}
          year={year}
          month={month}
          initialNote={notes[dateKey(year, month, noteDay)] ?? ""}
          onSave={(text) => saveNote(noteDay, text)}
          onDelete={() => handleDeleteNote(noteDay)}
          onClose={() => setNoteDay(null)}
        />
      )}

      {formOpen && (
        <HabitFormModal
          habit={formHabit}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onLocalMutate={(mutator) => setHabits(mutator)}
        />
      )}
    </div>
  );
}
