"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The contribution heatmap — ONE implementation, shared by the marketing
 * page and the Stats page.
 *
 * The landing page promises a contribution-graph view of your consistency.
 * The Stats page has to look exactly like that promise, so both render
 * this component: same cell size, same 3px gap, same 2px radius, same
 * heat ramp. If the product ever changes its heat language, it changes in
 * one place.
 *
 * Geometry: 7 weekday rows, one column per week — the GitHub orientation.
 */

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionCell = {
  level: HeatLevel;
  /** Screen-reader label, e.g. "Oct 12, 2026 — 3 of 7 habits completed". */
  ariaLabel?: string;
};

export type ContributionCellInfo = {
  /** Index into the flat cell list. */
  index: number;
  weekIndex: number;
  /** Row within the week (0 = the first weekday of the week). */
  dayIndex: number;
  cell: ContributionCell;
  rect: DOMRect;
};

type GridProps = {
  /** Flat, column-major: seven weekday rows per week column. */
  cells: ContributionCell[];
  /** Number of week columns. */
  weeks: number;
  className?: string;
  cellClassName?: string;
  /** Index (into `cells`) of today — it gets a ring. */
  todayIndex?: number | null;
  onCellEnter?: (info: ContributionCellInfo) => void;
  onCellLeave?: () => void;
  onCellClick?: (info: ContributionCellInfo) => void;
};

export function ContributionHeatmap({
  cells,
  weeks,
  className,
  cellClassName,
  todayIndex = null,
  onCellEnter,
  onCellLeave,
  onCellClick,
}: GridProps) {
  const reduced = useReducedMotion();
  const interactive = Boolean(onCellEnter || onCellClick);

  return (
    <div
      className={cn("grid gap-[3px]", className)}
      style={{
        gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
        gridTemplateRows: "repeat(7, minmax(0, 1fr))",
        gridAutoFlow: "column",
      }}
    >
      {cells.map((cell, index) => {
        const info: Omit<ContributionCellInfo, "rect"> = {
          index,
          weekIndex: Math.floor(index / 7),
          dayIndex: index % 7,
          cell,
        };

        return (
          <motion.div
            key={index}
            role="img"
            tabIndex={0}
            aria-label={cell.ariaLabel}
            className={cn(
              "aspect-square rounded-[2px] transition-[background-color,opacity] duration-150",
              interactive && "cursor-pointer",
              index === todayIndex &&
                "ring-1 ring-primary/80 ring-offset-1 ring-offset-surface",
              cellClassName,
            )}
            style={{ backgroundColor: `var(--color-heat-${cell.level})` }}
            initial={reduced ? false : { opacity: 0, scale: 0.55 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={interactive ? { scale: 1.25 } : undefined}
            whileTap={interactive ? { scale: 1.1 } : undefined}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
              // A diagonal wave: the grid fills in column by column.
              delay: reduced ? 0 : (index % 7) * 0.012 + Math.floor(index / 7) * 0.02,
            }}
            onMouseEnter={(event) =>
              onCellEnter?.({
                ...info,
                rect: event.currentTarget.getBoundingClientRect(),
              })
            }
            onMouseLeave={() => onCellLeave?.()}
            onClick={() => onCellClick?.(info as ContributionCellInfo)}
          />
        );
      })}
    </div>
  );
}

/** The "Less ▪▪▪▪▪ More" ramp key. */
export function HeatmapLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-[10px] text-text-muted",
        className,
      )}
    >
      <span>Less</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <span
          key={level}
          className="h-2.5 w-2.5 rounded-[2px]"
          style={{ backgroundColor: `var(--color-heat-${level})` }}
        />
      ))}
      <span>More</span>
    </div>
  );
}

type PanelProps = GridProps & {
  /** Left-hand label, e.g. "Last 16 weeks". */
  weeksLabel: string;
  /** Right-hand label, e.g. "143 days tracked". */
  trackedLabel?: string;
};

/**
 * The framed panel: scale label on the left, tracked count on the right,
 * the grid, then the ramp key.
 */
export function ContributionHeatmapPanel({
  weeksLabel,
  trackedLabel,
  className,
  ...grid
}: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-background/60 p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between text-[11px] text-text-muted">
        <span>{weeksLabel}</span>
        {trackedLabel ? (
          <span className="font-medium text-primary-text">{trackedLabel}</span>
        ) : null}
      </div>
      <ContributionHeatmap {...grid} />
      <HeatmapLegend className="mt-3" />
    </div>
  );
}
