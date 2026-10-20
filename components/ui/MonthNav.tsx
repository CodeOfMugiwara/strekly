"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * The ONE month navigator in the app.
 *
 * Three separate implementations existed (Habits page header, Mood month
 * card, Calendar month card) with different button sizes, different title
 * typography and different "Today" behaviour. One component now serves all
 * three; `title` overrides the default label for callers that already have
 * a formatted month string.
 */
type MonthNavProps = {
  /** 0-based month index. Optional when `title` is supplied. */
  month?: number;
  year?: number;
  onPrev: () => void;
  onNext: () => void;
  /** Renders a "Today" shortcut. Requires `onToday`. */
  onToday?: () => void;
  showToday?: boolean;
  /** Replaces the default "September 2026" label. */
  title?: React.ReactNode;
  /** Heading element for the title — use `h1` for a page title. */
  as?: "h1" | "h2" | "span";
  className?: string;
  titleClassName?: string;
};

/** The "Today" shortcut, shared by the inline and right-aligned layouts. */
export function TodayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-primary-lightest px-3 py-1.5 text-xs font-medium text-primary-text transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      Today
    </button>
  );
}

export function MonthNav({
  year,
  month,
  onPrev,
  onNext,
  onToday,
  showToday = false,
  title,
  as: TitleTag = "span",
  className,
  titleClassName,
}: MonthNavProps) {
  const defaultTitle =
    month === undefined ? null : `${MONTH_NAMES[month]} ${year ?? ""}`.trim();
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        aria-label="Previous month"
        onClick={onPrev}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <TitleTag
        className={cn(
          "whitespace-nowrap text-xl font-bold tracking-tight text-text",
          titleClassName,
        )}
      >
        {title ?? defaultTitle}
      </TitleTag>

      <button
        type="button"
        aria-label="Next month"
        onClick={onNext}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {showToday && onToday ? <TodayButton onClick={onToday} /> : null}
    </div>
  );
}
