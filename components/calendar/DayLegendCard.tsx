import { Card } from "@/components/ui/Card";
import { MoodFace } from "@/components/ui/MoodFace";

const DAY_CLASSES = [
  { label: "All habits completed", dotClass: "bg-success-strong" },
  { label: "Most habits completed", dotClass: "bg-warning" },
  { label: "Some habits completed", dotClass: "bg-error" },
  { label: "No habits completed", dotClass: "bg-border-strong" },
];

type DayLegendCardProps = {
  levels: Array<{ value: number; label: string; color: string }>;
};

export function DayLegendCard({ levels }: DayLegendCardProps) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-text">Day Legend</h2>

      <ul className="mt-4 space-y-2.5">
        {DAY_CLASSES.map((row) => (
          <li key={row.label} className="flex items-center gap-2.5">
            <span
              aria-hidden
              className={`h-3 w-3 shrink-0 rounded-full ${row.dotClass}`}
            />
            <span className="text-sm text-text">{row.label}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-4 space-y-2.5">
        {levels.map((level) => (
          <li key={level.value} className="flex items-center gap-2.5">
            <MoodFace value={level.value} color={level.color} size={20} />
            <span className="text-sm text-text">{level.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}