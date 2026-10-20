"use client";

import { Card } from "@/components/ui/Card";
import { Calendar, Moon, Smile, TrendingUp } from "lucide-react";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils";
import type { InsightPeriod, KeyInsight } from "@/lib/insights";

const PERIOD_OPTIONS: Array<DropdownOption<InsightPeriod>> = [
  { value: "this-month", label: "This Month" },
  { value: "last-3-months", label: "Last 3 Months" },
  { value: "this-year", label: "This Year" },
];

const ICONS: Record<KeyInsight["icon"], React.ElementType> = {
  calendar: Calendar,
  trend: TrendingUp,
  moon: Moon,
  mood: Smile,
};

const ICON_STYLE: Record<KeyInsight["icon"], string> = {
  calendar: "bg-primary-lightest text-primary-text",
  trend: "bg-success-light text-success-strong",
  moon: "bg-primary-lightest text-primary-text",
  mood: "bg-warning-light text-warning-strong",
};

type KeyInsightsCardProps = {
  insights: KeyInsight[];
  period: InsightPeriod;
  onPeriodChange: (value: InsightPeriod) => void;
};

export function KeyInsightsCard({
  insights,
  period,
  onPeriodChange,
}: KeyInsightsCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-lightest">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-4 w-4 text-primary-text"
              fill="currentColor"
            >
              <path d="M12 2l1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5L12 2zm7 11l.9 2.6L22 17l-2.1.9L19 21l-.9-2.1L16 17l2.1-.9L19 13zM5 14l1.1 3.2L9 18l-2.9 1L5 22l-1.1-3L1 18l2.9-.8L5 14z" />
            </svg>
          </span>
          <h2 className="text-base font-semibold text-text">Key Insights</h2>
        </div>
        <Dropdown
          options={PERIOD_OPTIONS}
          value={period}
          onChange={onPeriodChange}
          align="right"
          ariaLabel="Insights period"
        />
      </div>

      <ul className="mt-4 space-y-3">
        {insights.map((insight) => {
          const Icon = ICONS[insight.icon];
          return (
            <li key={insight.id} className="flex items-start gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  ICON_STYLE[insight.icon],
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text">
                  {insight.title}
                </p>
                <p className="text-xs text-text-muted">{insight.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}