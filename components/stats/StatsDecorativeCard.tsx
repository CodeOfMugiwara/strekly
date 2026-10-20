import { Card } from "@/components/ui/Card";
import { ScriptQuote } from "@/components/ui/ScriptQuote";
import { cn } from "@/lib/utils";

type StatsDecorativeCardProps = {
  quote?: string;
};

export function StatsDecorativeCard({
  quote = "Discipline today\ncreates the freedom",
}: StatsDecorativeCardProps) {
  return (
    <Card
      className={cn(
        "relative min-h-[180px] overflow-hidden border-border",
        "bg-gradient-to-br from-primary-lightest via-surface-muted to-primary-light",
      )}
    >
      <ScriptQuote size="lg" align="center">
        {quote}
      </ScriptQuote>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-2 flex justify-center gap-1 select-none text-4xl opacity-30"
      >
        🏔️
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-3 right-4 text-2xl opacity-40"
      >
        ⛅
      </div>
    </Card>
  );
}
