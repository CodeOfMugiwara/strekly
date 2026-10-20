"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A number that counts up to its value.
 *
 * The two numbers a user opens Home to read — today's progress and the
 * streak — previously changed with zero feedback. This interpolates the
 * value over ~700ms with an ease-out.
 *
 * Accessibility: the animated text is `aria-hidden`; a visually-hidden
 * sibling carries the final value, so a screen reader announces the number
 * once instead of on every animation frame.
 */
export function CountUp({
  value,
  duration = 700,
  format = (v) => String(Math.round(v)),
  className,
}: {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = currentRef.current;
    const to = value;
    if (from === to) return;

    /* Reduced motion still goes through the RAF path, with a zero-length
       duration — the first frame lands on the final value. Calling
       `setState` directly in the effect body is flagged by
       `react-hooks/set-state-in-effect`. */
    const dur = reduced ? 0 : duration;
    const start = performance.now();
    const tick = (now: number) => {
      const t = dur <= 0 ? 1 : Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;
      currentRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentRef.current = to;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value, duration, reduced]);

  return (
    <>
      <span aria-hidden className={cn("tabular-nums", className)}>
        {format(display)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
