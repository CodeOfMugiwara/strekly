"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MoodFace } from "@/components/ui/MoodFace";

/**
 * A mood face that springs when its value changes.
 *
 * `MoodFace` itself is a static SVG — right for the graph's y-axis and any
 * fixed reference. Where the face represents LIVE state (the Mood page's
 * date strip, the insight rows), a change of mood should be felt as well as
 * seen, so this wrapper cross-fades and springs the face.
 */
export function MoodFacePop({
  value,
  color,
  size = 36,
  className,
}: {
  value: number;
  color: string;
  size?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      <motion.span
        key={value}
        initial={reduced ? false : { opacity: 0, scale: 0.55, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.55, rotate: 10 }}
        transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.6 }}
        className="inline-flex shrink-0"
      >
        <MoodFace value={value} color={color} size={size} className={className} />
      </motion.span>
    </AnimatePresence>
  );
}
