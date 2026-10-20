"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The ONE sliding active-state indicator.
 *
 * A nav item's active background used to be a plain `bg-*` class on the
 * item itself, so the highlight JUMPED when the selection moved. The
 * Settings section nav already used a shared `layoutId` pill that slides
 * between items; this component extracts that pattern so the sidebar and
 * the mobile bar can use it too.
 *
 * `layoutId` is what makes the motion: the element is unmounted from one
 * item and mounted in another, and `motion` animates the position and size
 * between the two. The `layoutId` MUST be unique per indicator — two
 * indicators sharing an id would fight over the same layout slot.
 */
type SlidingIndicatorProps = {
  /** Unique per indicator group (e.g. "sidebar-nav-pill"). */
  layoutId: string;
  className?: string;
};

export function SlidingIndicator({
  layoutId,
  className,
}: SlidingIndicatorProps) {
  return (
    <motion.span
      layoutId={layoutId}
      className={cn("pointer-events-none absolute inset-0", className)}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 34,
      }}
    />
  );
}
