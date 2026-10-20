import { Greeting } from "@/components/home/Greeting";
import { InspirationCard } from "@/components/home/InspirationCard";
import { QuickStats } from "@/components/home/QuickStats";
import { StatCards } from "@/components/home/StatCards";
import { TodayHabits } from "@/components/home/TodayHabits";
import { WeekStrip } from "@/components/home/WeekStrip";
import { loadHomeDashboard } from "@/lib/home-data";

export default async function HomePage() {
  const data = await loadHomeDashboard();

  return (
    <div className="space-y-6">
      <Greeting
        displayName={data.displayName}
        dayStreak={data.dayStreak}
        progressPercent={data.progressPercent}
      />
      <StatCards
        progressPercent={data.progressPercent}
        progressHint={data.progressHint}
        dayStreak={data.dayStreak}
        longestStreak={data.longestStreak}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <TodayHabits
          habits={data.habits}
          weekDateKeys={data.weekDateKeys}
          selectedDate={data.selectedDate}
        />
        <div className="space-y-6">
          <WeekStrip days={data.weekDays} />
          <InspirationCard />
          <QuickStats stats={data.quickStats} />
        </div>
      </div>
    </div>
  );
}
