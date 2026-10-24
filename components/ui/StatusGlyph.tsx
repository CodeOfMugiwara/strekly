"use client";

import { motion, AnimatePresence } from "motion/react";
import type { HabitStatus } from "@/types";

type StatusGlyphProps = {
  status: HabitStatus | "unset" | null;
  className?: string;
  size?: number;
};

/**
 * Silky Spring Status Icon Morph (Emil Kowalski Style)
 *
 * Smoothly morphs between checkmark, partial dash, and missed X
 * with physics-based spring easing and path drawing.
 * Never scales from 0 (always enters from scale 0.85 with opacity).
 */
export function StatusGlyph({ status, className, size = 14 }: StatusGlyphProps) {
  if (!status || status === "unset") return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.svg
        key={status}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
        className={className}
        aria-hidden
      >
        {status === "done" && (
          <motion.path
            d="M20 6L9 17L4 12"
            initial={{ pathLength: 0.3 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
        {status === "partial" && (
          <motion.path
            d="M5 12H19"
            initial={{ pathLength: 0.3 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
        {status === "missed" && (
          <motion.path
            d="M18 6L6 18M6 6L18 18"
            initial={{ pathLength: 0.3 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
      </motion.svg>
    </AnimatePresence>
  );
}
