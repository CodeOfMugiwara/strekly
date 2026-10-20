"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global motion configuration.
 *
 * `reducedMotion="user"` makes every `motion` animation respect the OS
 * "reduce motion" setting. The CSS kill-switch in `globals.css` only
 * covers CSS animations and transitions — `motion` drives transforms from
 * JavaScript, so it needs this to opt out too.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  );
}
