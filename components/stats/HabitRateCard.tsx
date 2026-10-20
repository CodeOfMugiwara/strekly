import { Card } from "@/components/ui/Card";
import { HabitIcon } from "@/components/ui/HabitIcon";

type HabitRate = {
  id: string;
  name: string;
  emoji: string;
  percent: number;
  color: string;
};

type HabitRateCardProps = {
  rates: HabitRate[];
};

export function HabitRateCard({ rates }: HabitRateCardProps) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-text">
        Habit Completion Rate
      </h2>
      {rates.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">
          Add a habit to see completion rates.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rates.map((rate, i) => (
            <li key={rate.id} className="flex items-center gap-3">
              <HabitIcon emoji={rate.emoji} name={rate.name} size={28} />
              <span className="w-28 shrink-0 truncate text-xs text-text-secondary">
                {rate.name}
              </span>
              <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-alt">
                <div
                  className="rate-bar h-2 rounded-full"
                  style={{
                    width: `${rate.percent}%`,
                    backgroundColor: rate.color,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-xs font-semibold text-text">
                {rate.percent}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}