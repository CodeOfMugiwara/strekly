"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Plays the `status-pop` animation whenever `status` changes.
 *
 * The check-in control is the app's core interaction and it used to snap
 * between states with no motion at all. This wraps the status glyph so the
 * change is felt, not just seen.
 *
 * It deliberately does NOT animate on first render — a month grid holds
 * hundreds of cells, and having all of them pop at once is noise rather
 * than feedback. Only genuine status changes animate.
 */
export function StatusPop({
  status,
  className,
  children,
}: {
  status: string;
  className?: string;
  children: ReactNode;
}) {
  const previousStatus = useRef(status);
  const [popKey, setPopKey] = useState(0);

  useEffect(() => {
    if (previousStatus.current === status) return;
    previousStatus.current = status;
    // Bumping the key remounts the span, which restarts the CSS animation.
    setPopKey((k) => k + 1);
  }, [status]);

  return (
    <span
      key={popKey}
      className={cn(
        "inline-flex items-center justify-center",
        popKey > 0 && "status-pop",
        className,
      )}
    >
      {children}
    </span>
  );
}
