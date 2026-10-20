"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setDayMood, getMonthMood, getMoodRange } from "@/actions/moods";
import { MonthCard } from "@/components/mood/MonthCard";
import { MoodGraphCard } from "@/components/mood/MoodGraphCard";
import { NotesCards } from "@/components/mood/NotesCards";
import { MoodSidebar } from "@/components/mood/MoodSidebar";
import {
  buildMoodDays,
  buildMoodDistribution,
  buildMoodNotes,
  buildMonthGraphSeries,
  buildRangeGraphSeries,
  type GraphPeriod,
  type MonthMoodData,
  type MoodRangeData,
} from "@/lib/mood-view";
import { buildMoodInsightRows, computeMoodPattern } from "@/lib/insights";
import { ScriptQuote } from "@/components/ui/ScriptQuote";
import { LumiMascot } from "@/components/mascot/LumiMascot";

export function MoodView({ initialData }: { initialData: MonthMoodData }) {
  const [data, setData] = useState<MonthMoodData>(initialData);
  const [period, setPeriod] = useState<GraphPeriod>("month");
  const [rangeData, setRangeData] = useState<MoodRangeData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(() => {
    const now = new Date();
    if (
      now.getFullYear() === initialData.year &&
      now.getMonth() === initialData.month
    ) {
      return now.getDate();
    }
    return 1;
  });
  const [isPending, startTransition] = useTransition();

  const [prevInitial, setPrevInitial] = useState(initialData);
  if (prevInitial !== initialData) {
    setPrevInitial(initialData);
    setData(initialData);
  }

  const days = buildMoodDays(data);
  const notes = buildMoodNotes(data);
  const distribution = buildMoodDistribution(data);
  const insightRows = buildMoodInsightRows(distribution, data.levels).filter(
    (row) => row.count > 0,
  );
  const computedPattern = computeMoodPattern(
    data.entries,
    data.year,
    data.month,
  );
  const pattern =
    computedPattern ??
    (distribution.totalDays === 0
      ? "Log a few moods to start seeing patterns."
      : "Not enough data to spot a pattern yet.");

  const goMonth = (delta: number) => {
    let newMonth = data.month + delta;
    let newYear = data.year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setLoadError(null);
    startTransition(async () => {
      const result = await getMonthMood(newYear, newMonth);
      if (result.success && result.data) {
        setData(result.data);
        setSelectedDay(1);
        if (period !== "month") {
          const rangeResult = await getMoodRange(period, newYear, newMonth);
          if (rangeResult.success && rangeResult.data) {
            setRangeData(rangeResult.data);
          } else {
            console.error("[MoodView/goMonth] range refetch failed", rangeResult.error);
            setPeriod("month");
            setRangeData(null);
            setLoadError("Couldn't load that range — showing this month instead.");
          }
        }
      } else {
        console.error("[MoodView/goMonth]", result.error);
        setLoadError("Couldn't load that month. Try again.");
      }
    });
  };

  const handlePeriodChange = (next: GraphPeriod) => {
    if (next === period) return;
    setLoadError(null);
    if (next === "month") {
      setPeriod("month");
      return;
    }
    startTransition(async () => {
      const result = await getMoodRange(next, data.year, data.month);
      if (result.success && result.data) {
        setRangeData(result.data);
        setPeriod(next);
      } else {
        console.error("[MoodView/handlePeriodChange]", result.error);
        setLoadError("Couldn't load that period. Try again.");
      }
    });
  };

  const series =
    period === "month"
      ? buildMonthGraphSeries(data)
      : rangeData
        ? buildRangeGraphSeries(rangeData)
        : [];

  const handleSetMood = (value: number) => {
    const date = `${data.year}-${String(data.month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const prevValue = data.entries[selectedDay];
    const removing = data.entries[selectedDay] === value;
    // optimistic — second click on the active mood removes the entry
    setData((d) => {
      const nextEntries = { ...d.entries };
      if (removing) delete nextEntries[selectedDay];
      else nextEntries[selectedDay] = value;
      return { ...d, entries: nextEntries };
    });

    if (removing) {
      toast.info("Mood cleared for this day");
    } else {
      toast.success("Mood logged! ✨", { duration: 1800 });
    }

    startTransition(async () => {
      const result = await setDayMood({
        date,
        moodValue: removing ? null : value,
      });
      if (!result.success) {
        /* Roll back ONLY this day. Restoring the whole month would discard
           other edits made while the request was in flight. */
        setData((d) => {
          const nextEntries = { ...d.entries };
          if (prevValue === undefined) delete nextEntries[selectedDay];
          else nextEntries[selectedDay] = prevValue;
          return { ...d, entries: nextEntries };
        });
        toast.error("Could not save mood. Reverted.");
        console.error("[MoodView/handleSetMood]", result.error);
      }
    });
  };


  const handleNoteChange = (day: number, content: string | null) => {
    setData((d) => {
      const nextNotes = { ...d.notes };
      if (content) nextNotes[day] = content;
      else delete nextNotes[day];
      return { ...d, notes: nextNotes };
    });
  };

  const selectedValue = data.entries[selectedDay] ?? null;

  return (
    <div
      className={
        isPending
          ? "opacity-70 transition-opacity"
          : "transition-opacity"
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text">
              Mood Tracker
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Track your emotions. Notice patterns. Be kinder to yourself.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ScriptQuote>
              {"A calmer mind\nA brighter tomorrow 💜"}
            </ScriptQuote>
            <LumiMascot
              size="sm"
              mood="supportive"
              showDialogue={false}
              message="Bad days count too. Log them and we will find the pattern together."
              caption="Tap Lumi for a nudge."
            />
          </div>
        </div>

        {loadError ? (
          <p role="alert" className="text-xs text-error-foreground">
            {loadError}
          </p>
        ) : null}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <MonthCard
              monthLabel={data.monthLabel}
              days={days}
              levels={data.levels}
              selectedDay={selectedDay}
              selectedValue={selectedValue}
              onSelectDay={setSelectedDay}
              onSetMood={handleSetMood}
              onPrev={() => goMonth(-1)}
              onNext={() => goMonth(1)}
            />
            <MoodGraphCard
              series={series}
              levels={data.levels}
              period={period}
              onPeriodChange={handlePeriodChange}
            />
            <NotesCards
              year={data.year}
              month={data.month}
              selectedDay={selectedDay}
              levels={data.levels}
              notes={notes}
              entries={data.entries}
              enableMoodNotes={data.enableMoodNotes}
              onSelectNoteDay={setSelectedDay}
              onNoteChange={handleNoteChange}
            />
          </div>
          <MoodSidebar
            distribution={distribution}
            levels={data.levels}
            insightRows={insightRows}
            pattern={pattern}
          />
        </div>
      </div>
    </div>
  );
}
