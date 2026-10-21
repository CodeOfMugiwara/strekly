"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  EASE_IN,
  EASE_OUT,
  ENTER_DURATION,
  EXIT_DURATION,
  SLIDE_DISTANCE,
} from "@/lib/motion";

/**
 * The Settings pane-swap recipe, extracted.
 *
 * `mode="wait"` so the outgoing view leaves before the incoming one takes
 * its place (the two are in normal flow, not overlaid). `initial={false}`
 * means mounting the page never animates — only a user-triggered `swapKey`
 * change does.
 *
 * This is deliberately STATE-keyed, not route-keyed. A pathname-keyed
 * AnimatePresence used to live in the app shell and left pages blank in
 * production because the RSC payload and `usePathname()` commit in a
 * different order on the server than in dev. Never reintroduce that.
 */
export type SwapDirection = 1 | -1;

type MotionSwapProps = {
  swapKey: string | number;
  /** 1 = incoming from the right (next); -1 = incoming from the left (prev). */
  direction?: SwapDirection;
  className?: string;
  children: React.ReactNode;
};

export function MotionSwap({
  swapKey,
  direction = 1,
  className,
  children,
}: MotionSwapProps) {
  const reduced = useReducedMotion();
  const offset = SLIDE_DISTANCE * direction;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        className={className}
        initial={
          reduced
            ? false
            : {
                opacity: 0,
                x: offset,
                transition: { duration: ENTER_DURATION, ease: EASE_IN },
              }
        }
        animate={{ opacity: 1, x: 0 }}
        exit={
          reduced
            ? undefined
            : {
                opacity: 0,
                x: -offset,
                transition: { duration: EXIT_DURATION, ease: EASE_OUT },
              }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
