"use client";

import { Card } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  monthLabel,
  OVERVIEW_TILE_COLORS,
  type MonthClassification,
} from "@/lib/calendar";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

const TILES = [
  { id: "great", label: "Great Days" },
  { id: "okay", label: "Okay Days" },
  { id: "tough", label: "Tough Days" },
  { id: "no-data", label: "No Data" },
] as const;

type MonthlyOverviewCardProps = {
  year: number;
  month: number;
  classification: MonthClassification;
  onPrev: () => void;
  onNext: () => void;
};

export function MonthlyOverviewCard({
  year,
  month,
  classification,
  onPrev,
  onNext,
}: MonthlyOverviewCardProps) {
  const counts: Record<string, number> = {
    great: classification.great,
    okay: classification.okay,
    tough: classification.tough,
    "no-data": classification.noData,
  };
  const radius = 36;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference * (1 - classification.percent / 100);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text">Monthly Overview</h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous overview month"
            onClick={onPrev}
            className="flex h-6 w-6 items-center justify-center rounded-full text-text-secondary hover:bg-surface-hover"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <p className="text-xs font-medium text-text">
            {monthLabel(year, month)}
          </p>
          <button
            type="button"
            aria-label="Next overview month"
            onClick={onNext}
            className="flex h-6 w-6 items-center justify-center rounded-full text-text-secondary hover:bg-surface-hover"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative h-[92px] w-[92px]">
          <svg width={92} height={92} className="-rotate-90">
            <circle
              cx={46}
              cy={46}
              r={radius}
              fill="none"
              stroke="var(--color-surface-alt)"
              strokeWidth={stroke}
            />
            <circle
              cx={46}
              cy={46}
              r={radius}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold leading-none text-text">
              {classification.percent}%
            </p>
            <p className="mt-1 text-[10px] text-text-muted">
              {classification.strong} of {classification.elapsed} days
            </p>
          </div>
        </div>

        <ul className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-3">
          {TILES.map((tile) => (
            <li key={tile.id} className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor: OVERVIEW_TILE_COLORS[tile.id],
                }}
              />
              <div>
                <p className="text-sm font-bold leading-tight text-text">
                  {counts[tile.id]}
                </p>
                <p className="text-[11px] text-text-muted">{tile.label}</p>
              </div>
            </li>
          ))}
        </ul>

        <ScriptQuote size="sm" align="center" className="mt-5">
          {"Not every day will be good,\nbut there is something good in every day. 💜"}
        </ScriptQuote>
      </div>
    </Card>
  );
}