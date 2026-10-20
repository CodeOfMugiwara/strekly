"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { DayDetailsCard } from "@/components/calendar/DayDetailsCard";
import { DayLegendCard } from "@/components/calendar/DayLegendCard";
import { MonthCard } from "@/components/calendar/MonthCard";
import { MonthlyOverviewCard } from "@/components/calendar/MonthlyOverviewCard";
import { StatsDecorativeCard } from "@/components/stats/StatsDecorativeCard";
import { setHabitCompletion } from "@/actions/completions";
import { deleteDayNote, saveDayNote } from "@/actions/notes";
import {
  buildCellMap,
  buildStatusMap,
  classifyMonth,
  cycleStatus,
  shiftDay,
  shiftMonth,
  withCompletion,
  type CalendarData,
} from "@/lib/calendar";
import { parseLocal } from "@/lib/stats";
import type { HabitCompletion } from "@/types";
import { ScriptQuote } from "@/components/ui/ScriptQuote";
import { LumiMascot } from "@/components/mascot/LumiMascot";

const DECORATIVE_QUOTE = "Consistency today creates\na brighter tomorrow. 💜";

type CalendarViewProps = {
  data: CalendarData;
};

export function CalendarView({ data }: CalendarViewProps) {
  const today = parseLocal(data.todayKey);
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedKey, setSelectedKey] = useState(data.todayKey);

  // Client-authoritative copies (seeded once from props — never re-synced,
  // the F15 no-snap rule). Mutations are optimistic with revert-on-fail.
  const [completions, setCompletions] = useState<HabitCompletion[]>(
    data.completions,
  );
  const [notes, setNotes] = useState<Record<string, string>>(data.notes);
  const pendingRef = useRef(new Set<string>());

  const statusMap = buildStatusMap(completions);
  const cellMap = buildCellMap(
    data.habits,
    statusMap,
    data.moodValues,
    data.moodLevels,
    data.showMoodFaces,
  );
  const classification = classifyMonth(
    completions,
    data.habits,
    view.year,
    view.month,
    data.todayKey,
  );
  const selectedMoodValue = data.moodValues[selectedKey];

  const goPrevMonth = () => setView((v) => shiftMonth(v.year, v.month, -1));
  const goNextMonth = () => setView((v) => shiftMonth(v.year, v.month, 1));
  const goToday = () => {
    setView({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedKey(data.todayKey);
  };
  const selectDay = (dateKey: string) => {
    setSelectedKey(dateKey);
    const date = parseLocal(dateKey);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  };
  const shiftSelected = (delta: number) => selectDay(shiftDay(selectedKey, delta));

  const toggleHabit = async (habitId: string, dateKey: string) => {
    const token = `${habitId}:${dateKey}`;
    if (pendingRef.current.has(token)) return;
    pendingRef.current.add(token);

    const previous = statusMap[dateKey]?.[habitId] ?? null;
    const next = cycleStatus(previous);
    setCompletions((prev) => withCompletion(prev, habitId, dateKey, next));

    const result = await setHabitCompletion({
      habitId,
      date: dateKey,
      status: next,
    });
    pendingRef.current.delete(token);
    if (!result.success) {
      /* Roll back ONLY this habit+day. Restoring the whole completion
         array would discard other check-ins that succeeded while this
         request was in flight. */
      setCompletions((prev) => withCompletion(prev, habitId, dateKey, previous));
      toast.error("Could not save check-in. Reverted.");
    }
  };

  const saveNote = async (dateKey: string, content: string) => {
    const snapshot = notes;
    setNotes((prev) => ({ ...prev, [dateKey]: content }));
    const result = await saveDayNote({ date: dateKey, content });
    if (!result.success) setNotes(snapshot);
    return result.success;
  };

  const deleteNote = async (dateKey: string) => {
    const snapshot = notes;
    setNotes((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
    const result = await deleteDayNote(dateKey);
    if (!result.success) setNotes(snapshot);
    return result.success;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Look back, stay consistent. Every day counts.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ScriptQuote align="right">
            {"A little progress\nevery day 💜"}
          </ScriptQuote>
          <LumiMascot
            size="sm"
            mood="idle"
            showDialogue={false}
            message="Every square you fill is a day you showed up."
            caption="Tap Lumi for a nudge."
          />
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <MonthCard
            year={view.year}
            month={view.month}
            todayKey={data.todayKey}
            selectedKey={selectedKey}
            cellMap={cellMap}
            weekStartsOn={data.weekStartsOn}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            onToday={goToday}
            onSelect={selectDay}
          />
          <DayDetailsCard
            dateKey={selectedKey}
            statusMap={statusMap[selectedKey] ?? {}}
            habits={data.habits}
            moodValue={selectedMoodValue}
            moodLevels={data.moodLevels}
            note={notes[selectedKey]}
            enableMoodNotes={data.enableMoodNotes}
            onToggleHabit={toggleHabit}
            onPrevDay={() => shiftSelected(-1)}
            onNextDay={() => shiftSelected(1)}
            onSaveNote={saveNote}
            onDeleteNote={deleteNote}
          />
        </div>
        <div className="space-y-4">
          <DayLegendCard levels={data.moodLevels} />
          <StatsDecorativeCard quote={DECORATIVE_QUOTE} />
          <MonthlyOverviewCard
            year={view.year}
            month={view.month}
            classification={classification}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
          />
        </div>
      </div>
    </div>
  );
}
