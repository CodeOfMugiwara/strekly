"use client";

import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function Switch({
  checked,
  onChange,
  disabled,
  ariaLabel,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:cursor-not-allowed disabled:opacity-50",
        /* The on-track is the soft pastel primary in light mode and the
           saturated primary-dark in dark mode, so the knob always clears
           the 3:1 non-text threshold against it. */
        checked ? "bg-primary dark:bg-primary-dark" : "bg-border-strong",
        className,
      )}
    >
      <span
        className={cn(
          /* The knob is the state indicator, so it needs 3:1 against the
             track. It uses the deep ink in light mode and white in dark
             mode (see --color-switch-knob) — a single colour cannot clear
             3:1 against both the pale on-track and the dark off-track. */
          "inline-block h-5 w-5 rounded-full bg-switch-knob shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
