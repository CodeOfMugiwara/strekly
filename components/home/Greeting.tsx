import { LumiMascot } from "@/components/mascot/LumiMascot";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good day";
  return "Good evening";
}

function timeEmojiForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "🌤️";
  if (hour < 18) return "☀️";
  return "🌙";
}

type Props = {
  displayName: string;
  dayStreak?: number;
  progressPercent?: number;
};

export function Greeting({ displayName, dayStreak = 0, progressPercent = 0 }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          {greetingForNow()},{" "}
          <span className="text-primary-text font-semibold">
            {displayName}
          </span>{" "}
          <span className="inline-block text-2xl">{timeEmojiForNow()}</span>
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          A new day, a new opportunity to be better.
        </p>
      </div>

      {/* Script Quote & Lumi Mascot — Normal Size and Position */}
      <div className="flex items-center gap-4 self-end sm:self-auto">
        <ScriptQuote
          size="md"
          align="right"
          slant
          underline
          className="text-primary-text font-bold hidden sm:inline-flex"
        >
          {"“Progress, not perfection.”"}
        </ScriptQuote>

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
