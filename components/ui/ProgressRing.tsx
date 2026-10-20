"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The ONE progress ring in the app.
 *
 * Three separate ring implementations existed (Home progress, Home week
 * strip, Calendar monthly overview) with different sizes, different stroke
 * colours and — critically — the Calendar's ring had no draw animation at
 * all. Every ring now uses this component and the `.ring-draw` animation.
 */
type ProgressRingProps = {
  /** 0–100 */
  percent: number;
  /** Outer diameter in px. */
  size?: number;
  /** Stroke width in px. */
  stroke?: number;
  /**
   * `gradient` runs primary → success (the Home language).
   * `solid` uses the flat primary colour (the Calendar language).
   */
  variant?: "gradient" | "solid";
  /** Track colour class. */
  trackClassName?: string;
  /** Centre content. Hidden from assistive tech when `ariaLabel` is set. */
  children?: ReactNode;
  /** Accessible name. When set, the centre content becomes decorative. */
  ariaLabel?: string;
  /** Skip the arc entirely at 0% (the week strip did this). */
  hideAtZero?: boolean;
  className?: string;
};

export function ProgressRing({
  percent,
  size = 76,
  stroke = 8,
  variant = "gradient",
  trackClassName = "stroke-border/70",
  children,
  ariaLabel,
  hideAtZero = false,
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const gradientId = `ringGrad-${size}-${variant}`;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          {variant === "gradient" ? (
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-success)" />
            </linearGradient>
          ) : null}
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={trackClassName}
        />
        {hideAtZero && clamped <= 0 ? null : (
          <circle
            /* Re-key on the value so the draw animation replays when the
               number changes. */
            key={`${gradientId}-${Math.round(clamped)}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke={
              variant === "gradient"
                ? `url(#${gradientId})`
                : "var(--color-primary)"
            }
            className="ring-draw drop-shadow-sm"
            style={
              {
                "--ring-circumference": circumference,
                "--ring-offset": offset,
              } as CSSProperties
            }
          />
        )}
      </svg>
      {children ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden={ariaLabel ? true : undefined}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
