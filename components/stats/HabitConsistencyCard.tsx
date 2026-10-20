"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Flame, Sparkles, X, CheckCircle2 } from "lucide-react";
import {
  ContributionHeatmapPanel,
  type ContributionCell,
} from "@/components/ui/ContributionHeatmap";
import {
  buildConsistencyWindow,
  formatLocal,
  type StatsHabit,
} from "@/lib/stats";
import type { HabitCompletion } from "@/types";

type HabitConsistencyCardProps = {
  habits?: StatsHabit[];
  completions?: HabitCompletion[];
  todayKey?: string;
  weekStartsOn?: number;
};

type HoverState = {
  title: string;
  subtitle: string;
  badge?: string;
};

type TipPos = {
  left: number;
  top: number;
  transform: string;
};

const EDGE_MARGIN = 8;
const GAP_ABOVE = 10;
const WINDOW_WEEKS = 16;

export function HabitConsistencyCard({
  habits = [],
  completions = [],
  todayKey: propTodayKey,
  weekStartsOn = 1,
}: HabitConsistencyCardProps) {
  // Determine current today key
  const effectiveTodayKey = useMemo(() => {
    return propTodayKey || formatLocal(new Date());
  }, [propTodayKey]);

  /**
   * The consistency window — the SAME heatmap the marketing page shows,
   * filled with the user's own history.
   */
  const consistencyWindow = useMemo(() => {
    if (habits.length === 0) return null;
    return buildConsistencyWindow(
      completions,
      habits,
      effectiveTodayKey,
      weekStartsOn,
      WINDOW_WEEKS,
    );
  }, [completions, habits, effectiveTodayKey, weekStartsOn]);

  /** Flat, column-major cell list for the shared heatmap. */
  const contributionCells = useMemo<ContributionCell[]>(() => {
    if (!consistencyWindow) return [];
    const cells: ContributionCell[] = [];
    for (const column of consistencyWindow.weeks) {
      for (const day of column) {
        const dateText = day.date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        cells.push({
          level: day.level,
          ariaLabel: day.isFuture
            ? `${dateText}: Upcoming`
            : `${dateText}: ${day.doneCount} of ${day.totalHabits} habits completed`,
        });
      }
    }
    return cells;
  }, [consistencyWindow]);

  const contributionDays = useMemo(() => {
    if (!consistencyWindow) return [];
    return consistencyWindow.weeks.flat();
  }, [consistencyWindow]);

  const todayCellIndex = useMemo(() => {
    if (!consistencyWindow) return null;
    for (const column of consistencyWindow.weeks) {
      for (const day of column) {
        if (day.isToday) {
          return consistencyWindow.weeks.indexOf(column) * 7 + column.indexOf(day);
        }
      }
    }
    return null;
  }, [consistencyWindow]);

  // Hover and floating tooltip state
  const [hover, setHover] = useState<HoverState | null>(null);
  const [pos, setPos] = useState<TipPos | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /**
   * The tooltip is rendered in a PORTAL. The card is a glass surface
   * (`backdrop-blur-md`), and a blurred ancestor is the containing block
   * for `position: fixed` descendants — a tooltip rendered inside the card
   * was positioned against the CARD, not the viewport, which is why it
   * used to appear far away from the cell and slip under other cards.
   *
   * The portal only mounts once the user hovers a cell, so it never
   * renders during SSR or hydration.
   */

  /* The tooltip's measured size, cached so the position can be computed
     BEFORE the tooltip mounts. A freshly mounted element never transitions
     its initial style, so the first placement is instant; moving to the
     next cell keeps the element mounted, so the transition applies and the
     tooltip glides instead of teleporting. */
  const tipSizeRef = useRef({ width: 240, height: 56 });

  const placeTooltip = (rect: DOMRect) => {
    const { width, height } = tipSizeRef.current;
    const center = rect.left + rect.width / 2;
    const left = Math.min(
      Math.max(center, width / 2 + EDGE_MARGIN),
      window.innerWidth - width / 2 - EDGE_MARGIN,
    );
    const above = rect.top - height - GAP_ABOVE >= EDGE_MARGIN;
    setPos({
      left,
      top: above ? rect.top - GAP_ABOVE + 2 : rect.bottom + GAP_ABOVE - 2,
      transform: above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
    });
  };

  // Selected cell for interactive click inspection / mobile touch
  const [inspectedDay, setInspectedDay] = useState<{
    title: string;
    dateText: string;
    details: string;
    statusLabel?: string;
  } | null>(null);

  /* Keep the cached tooltip size fresh so the next placement clamps
     against the real dimensions. Runs after the tooltip has rendered with
     the new content. */
  useLayoutEffect(() => {
    const tip = tipRef.current;
    if (!tip) return;
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    if (width > 0 && height > 0) {
      tipSizeRef.current = { width, height };
    }
  }, [hover]);

  /* Any scroll invalidates the measured position: drop the tooltip. */
  useEffect(() => {
    if (!hover) return;
    const clear = () => setHover(null);
    window.addEventListener("scroll", clear, true);
    return () => window.removeEventListener("scroll", clear, true);
  }, [hover]);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">
            Habit Consistency
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Every day you tracked, laid out the way contribution graphs made
            it obvious.
          </p>
        </div>
      </div>

      {!consistencyWindow || habits.length === 0 ? (
        <p className="mt-6 py-6 text-center text-sm text-text-muted">
          Add a habit to see your consistency map.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-border/60 pb-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-text">
              <Sparkles className="h-3.5 w-3.5 text-primary-text" />
              <strong className="font-semibold text-text">
                {consistencyWindow.totalCheckins}
              </strong>{" "}
              habit completions
            </span>
            <span className="flex items-center gap-1.5 text-text-muted">
              <Flame className="h-3.5 w-3.5 text-warning" />
              <strong className="font-semibold text-text">
                {consistencyWindow.activeDaysCount}
              </strong>{" "}
              active days
            </span>
            <span className="flex items-center gap-1.5 text-text-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <strong className="font-semibold text-text">
                {consistencyWindow.avgDailyRate}%
              </strong>{" "}
              avg daily completion
            </span>
          </div>

          <ContributionHeatmapPanel
            className="mt-4"
            cells={contributionCells}
            weeks={WINDOW_WEEKS}
            weeksLabel={`Last ${WINDOW_WEEKS} weeks`}
            trackedLabel={`${consistencyWindow.daysTracked} days tracked`}
            todayIndex={todayCellIndex}
            onCellEnter={(info) => {
              const day = contributionDays[info.index];
              if (!day) return;
              const dateText = day.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              placeTooltip(info.rect);
              setHover({
                title: dateText,
                subtitle: day.isFuture
                  ? "Upcoming"
                  : `${day.doneCount} of ${day.totalHabits} habits completed (${day.rate}%)`,
                badge: day.isFuture ? "Upcoming" : `Level ${day.level}`,
              });
            }}
            onCellLeave={() => setHover(null)}
            onCellClick={(info) => {
              const day = contributionDays[info.index];
              if (!day) return;
              const dateText = day.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              setInspectedDay({
                title: dateText,
                dateText: `${day.doneCount} of ${day.totalHabits} habits completed`,
                details: day.isFuture
                  ? "Upcoming future date."
                  : `${day.rate}% completion rate (${day.doneCount} done, ${day.partialCount} partial)`,
                statusLabel: day.isFuture ? "Upcoming" : `Level ${day.level}`,
              });
            }}
          />
        </>
      )}

      {/* Interactive Selected Day Inspector Card (On-Click / Mobile Tap) */}
      <AnimatePresence initial={false}>
        {inspectedDay && (
          <motion.div
            key="heat-inspector"
            role="status"
            aria-live="polite"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3.5 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text">{inspectedDay.title}</span>
                {inspectedDay.statusLabel && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary-text">
                    {inspectedDay.statusLabel}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-secondary">{inspectedDay.dateText}</p>
              <p className="text-[11px] text-text-muted">{inspectedDay.details}</p>
            </div>
            <button
              type="button"
              onClick={() => setInspectedDay(null)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface hover:text-text transition-colors"
              aria-label="Close inspector"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GitHub-Style Floating Dark Tooltip — portalled to the body so it is
          positioned against the viewport, not the blurred card. */}
      {hover
        ? createPortal(
            <div
              ref={tipRef}
              role="tooltip"
              className="pointer-events-none fixed z-[70] w-max max-w-64 rounded-lg bg-tooltip px-3 py-2 text-left shadow-pop"
              style={
                pos
                  ? {
                      left: pos.left,
                      top: pos.top,
                      transform: pos.transform,
                      /* The first placement is a fresh mount (no transition);
                         moving to the next cell keeps the element mounted, so
                         the tooltip glides instead of teleporting. */
                      transition: prefersReducedMotion
                        ? "none"
                        : "left 120ms cubic-bezier(0.22, 1, 0.36, 1), top 120ms cubic-bezier(0.22, 1, 0.36, 1), opacity 120ms ease",
                    }
                  : { left: -9999, top: 0, transform: "translate(-50%, -100%)" }
              }
            >
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-tooltip-foreground">
                  {hover.title}
                </p>
                {hover.badge ? (
                  <span className="rounded bg-white/15 px-1.5 py-0.2 text-[9px] font-medium text-tooltip-foreground">
                    {hover.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-[11px] text-tooltip-foreground/85">
                {hover.subtitle}
              </p>
            </div>,
            document.body,
          )
        : null}
    </Card>
  );
}
