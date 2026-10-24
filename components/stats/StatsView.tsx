"use client";

import { useState } from "react";
import { CompletionOverviewCard } from "@/components/stats/CompletionOverviewCard";
import { HabitConsistencyCard } from "@/components/stats/HabitConsistencyCard";
import { HabitRateCard } from "@/components/stats/HabitRateCard";
import { KeyInsightsCard } from "@/components/stats/KeyInsightsCard";
import { KpiCards } from "@/components/stats/KpiCards";
import { StreakHistoryCard } from "@/components/stats/StreakHistoryCard";
import { StatsDecorativeCard } from "@/components/stats/StatsDecorativeCard";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import { ScriptQuote } from "@/components/ui/ScriptQuote";
import { computeKeyInsights, insightRangeFor, type InsightPeriod } from "@/lib/insights";
import {
  buildCompletionSeries,
  buildStatsKpis,
  parseLocal,
  streakSeriesForMonth,
  weightedHabitRate,
  HABIT_TINTS,
  type StatsData,
  type StatsGranularity,
} from "@/lib/stats";

type StatsViewProps = {
  data: StatsData;
};

export function StatsView({ data }: StatsViewProps) {
  const [granularity, setGranularity] = useState<StatsGranularity>("Daily");
  const [insightPeriod, setInsightPeriod] = useState<InsightPeriod>("this-month");

  const today = parseLocal(data.todayKey);
  const activeHabits = data.habits.filter((h) => h.active);
  const activeCount = activeHabits.length;
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const series = buildCompletionSeries(
    granularity,
    data.completions,
    activeCount,
    today,
    data.weekStartsOn,
  );
  const kpis = buildStatsKpis(
    data.completions,
    data.habits,
    activeCount,
    today,
  );
  const streakSeries = streakSeriesForMonth(
    data.completions,
    today.getFullYear(),
    today.getMonth(),
    data.todayKey,
  );
  const rateRows = activeHabits.map((habit, i) => {
    const categoryColor = habit.categoryId
      ? data.categoryColors[habit.categoryId]
      : undefined;
    return {
      id: habit.id,
      name: habit.name,
      emoji: habit.emoji,
      percent: Math.round(
        weightedHabitRate(
          data.completions,
          habit.id,
          monthStart,
          today,
          habit.createdAt,
        ) * 100,
      ),
      color: categoryColor ?? HABIT_TINTS[i % HABIT_TINTS.length],
    };
  });
  const insightRange = insightRangeFor(insightPeriod, today);
  const insights = computeKeyInsights(
    data.completions,
    data.moodEntries,
    activeHabits,
    insightRange.from,
    insightRange.to,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Stats</h1>
          <p className="mt-1 text-sm text-text-muted">
            A closer look at your journey. Consistency creates change.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScriptQuote
            size="md"
            slant
            underline
            className="hidden sm:inline-flex"
          >
            {"Progress looks good on you."}
          </ScriptQuote>
          <LumiMascot
            size="sm"
            mood="streak"
            streakCount={kpis.currentStreak}
            showDialogue={false}
            message={
              kpis.currentStreak > 0
                ? `${kpis.currentStreak} days and counting. Keep the flame alive.`
                : "Your first streak is one day away. Tap a habit to start it."
            }
            caption="Tap Lumi for a nudge."
          />
        </div>
      </div>

      <KpiCards kpis={kpis} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <CompletionOverviewCard
            series={series}
            granularity={granularity}
            onGranularityChange={setGranularity}
            activeHabitCount={activeCount}
          />
          <HabitConsistencyCard
            habits={data.habits}
            completions={data.completions}
            todayKey={data.todayKey}
            weekStartsOn={data.weekStartsOn}
          />
          <KeyInsightsCard
            insights={insights}
            period={insightPeriod}
            onPeriodChange={setInsightPeriod}
          />
        </div>
        <div className="space-y-4">
          <HabitRateCard rates={rateRows} />
          <StreakHistoryCard
            series={streakSeries}
            chipValue={kpis.currentStreak}
          />
          <StatsDecorativeCard />
        </div>
      </div>
    </div>
  );
}