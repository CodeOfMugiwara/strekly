import { Card } from "@/components/ui/Card";
import { ScriptQuote } from "@/components/ui/ScriptQuote";
import { INSPIRATION_QUOTE } from "@/lib/quotes";

export function InspirationCard() {
  return (
    <Card className="relative min-h-[160px] overflow-hidden bg-surface-muted">
      <ScriptQuote size="lg">{INSPIRATION_QUOTE}</ScriptQuote>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -right-2 text-5xl opacity-30"
      >
        🏔️
      </div>
    </Card>
  );
}
