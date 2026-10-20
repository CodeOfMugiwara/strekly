"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  EASE_IN,
  EASE_OUT,
  ENTER_DURATION,
  EXIT_DURATION,
  SLIDE_DISTANCE,
} from "@/lib/motion";

/**
 * Route transition — the ONE page-entrance animation.
 *
 * Every page fades in and slides in from the LEFT: the incoming page
 * starts off-screen to the left and glides right into place while fading
 * up, and the outgoing page drifts out to the right. The Settings page
 * switches between its sections with the same cross-fade and a sliding
 * pill on its nav — this brings that motion language to the whole app.
 *
 * The pages previously ALSO carried the CSS `page-enter` class, which rose
 * their blocks from below. Two entrances on one element fought each other
 * (the container was still fading while the blocks independently faded
 * from 0, so the page read as blank), and the rise was the wrong motion
 * anyway — this is the motion to keep. The class is now used only by the
 * error boundary.
 *
 * `mode="wait"` matters for pages specifically: the outgoing and incoming
 * trees are both static in the document flow, so overlapping them (the
 * default "sync" mode) would stack two full pages on top of each other
 * and jump the layout. Waiting lets the old page leave before the new one
 * takes its place.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={
          reduced
            ? false
            : {
                opacity: 0,
                x: -SLIDE_DISTANCE,
                transition: { duration: ENTER_DURATION, ease: EASE_IN },
              }
        }
        animate={{ opacity: 1, x: 0 }}
        exit={
          reduced
            ? undefined
            : {
                opacity: 0,
                x: SLIDE_DISTANCE,
                transition: { duration: EXIT_DURATION, ease: EASE_OUT },
              }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
