"use client";

import { SlidingIndicator } from "@/components/ui/SlidingIndicator";
import { cn } from "@/lib/utils";

/**
 * Pill-style switch with the Settings nav's sliding selection.
 *
 * The active background is a shared `layoutId` element that moves between
 * options instead of a `bg-*` class jumping from one button to the next.
 * `layoutId` MUST be unique per control instance.
 */
type SegmentedItem<T extends string> = {
  value: T;
  label: React.ReactNode;
};

type SegmentedControlProps<T extends string> = {
  items: Array<SegmentedItem<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Unique per control group (e.g. "stats-granularity-pill"). */
  layoutId: string;
  ariaLabel: string;
  className?: string;
  buttonClassName?: string;
};

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  layoutId,
  ariaLabel,
  className,
  buttonClassName,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              active
                ? "text-primary-text"
                : "text-text-muted hover:text-text",
              buttonClassName,
            )}
          >
            {active ? (
              <SlidingIndicator
                layoutId={layoutId}
                className="rounded-full bg-primary-lightest"
              />
            ) : null}
            <span className="relative z-10 flex items-center gap-2">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
