"use client";

import {
  ContributionHeatmapPanel,
  type ContributionCell,
  type HeatLevel,
} from "@/components/ui/ContributionHeatmap";

/**
 * The marketing page's consistency heatmap.
 *
 * It is the SAME component the Stats page renders — the landing page is
 * showing the real product, not a mock-up of it. Only the data differs:
 * here it is a deterministic sample, because a stranger's account cannot
 * be shown; on Stats it is the user's own history.
 */

// Deterministic pattern (no random) so it renders identically every time.
const LEVELS = [
  0, 1, 0, 2, 3, 1, 0, 2, 4, 3, 0, 1, 2, 2, 0, 0, 3, 4, 2, 1, 0, 2, 3, 3, 1, 0, 1, 4, 3, 2, 0, 1,
  2, 3, 4, 2, 0, 0, 1, 3, 2, 1, 0, 2, 4, 3, 1, 0, 2, 3, 2, 1, 0, 3, 4, 2, 0, 1, 2, 3, 3, 1,
  0, 2, 4, 3, 1, 0, 1, 2, 3, 2, 0, 1, 2, 3, 1, 0, 1, 2, 3, 2, 0, 1, 2, 3, 1, 0, 2, 3, 1, 2, 0, 1, 3,
  2, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 2, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 2, 3, 1, 0, 1, 2,
  3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 2, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2,
  3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1,
];

export function LandingHeatmap({
  weeks = 16,
  className,
}: {
  weeks?: number;
  className?: string;
}) {
  const sample = LEVELS.slice(0, weeks * 7);

  // Column-major: seven days down each week column.
  const cells: ContributionCell[] = sample.map((level) => ({
    level: level as HeatLevel,
  }));
  const daysTracked = sample.filter((level) => level > 0).length;

  return (
    <ContributionHeatmapPanel
      cells={cells}
      weeks={weeks}
      weeksLabel={`Last ${weeks} weeks`}
      trackedLabel={`${daysTracked} days tracked`}
      className={className}
    />
  );
}
