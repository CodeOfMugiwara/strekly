"use client";

import { LumiMascot } from "@/components/mascot/LumiMascot";

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good day";
  return "Good evening";
}

type Props = {
  displayName: string;
  dayStreak?: number;
  progressPercent?: number;
};

export function Greeting({ displayName, dayStreak = 0, progressPercent = 0 }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-lightest/70 px-3 py-1 text-xs font-semibold text-primary-text backdrop-blur-sm">
          <span>✨ Daily Journey</span>
          {dayStreak > 0 && <span>· 🔥 {dayStreak} Day Streak</span>}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          {greetingForNow()},{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            {displayName}
          </span>{" "}
          <span aria-hidden>🌤️</span>
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Your daily habits shape your future. One small step at a time.
        </p>
      </div>

      <div className="flex items-center self-end sm:self-auto">
        <LumiMascot
          streakCount={dayStreak}
          progressPercent={progressPercent}
          displayName={displayName}
          size="md"
        />
      </div>
    </div>
  );
}

