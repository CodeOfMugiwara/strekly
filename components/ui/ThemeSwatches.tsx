"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";
import type { ColorTheme } from "@/types";

/**
 * A row of small colour squares that switch the app's colour theme.
 *
 * The full picker lives in Settings, but a theme you can only reach by
 * walking through Settings is a theme nobody changes. These are the fast
 * way in — one click, the whole page re-themes, and the choice is saved.
 */

type ThemeOption = {
  value: ColorTheme;
  label: string;
  /** Tailwind class for the swatch (from the `--color-swatch-*` tokens). */
  swatchClass: string;
};

const QUICK_THEMES: ThemeOption[] = [
  { value: "sage", label: "Sage", swatchClass: "bg-swatch-sage" },
  { value: "clay", label: "Clay", swatchClass: "bg-swatch-clay" },
  { value: "lagoon", label: "Lagoon", swatchClass: "bg-swatch-lagoon" },
  { value: "berry", label: "Berry", swatchClass: "bg-swatch-berry" },
  { value: "orchid", label: "Orchid", swatchClass: "bg-swatch-orchid" },
];

export function ThemeSwatches({
  className,
  themes = QUICK_THEMES,
}: {
  className?: string;
  themes?: ThemeOption[];
}) {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="group"
      aria-label="Quick colour theme"
    >
      {themes.map((theme) => {
        const active = colorTheme === theme.value;
        return (
          <button
            key={theme.value}
            type="button"
            onClick={() => setColorTheme(theme.value)}
            aria-pressed={active}
            aria-label={`${theme.label} theme`}
            title={theme.label}
            className={cn(
              "h-4 w-4 rounded-[4px] transition-transform duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              "hover:scale-110",
              theme.swatchClass,
              active &&
                "ring-2 ring-primary/70 ring-offset-1 ring-offset-surface",
            )}
          />
        );
      })}
    </div>
  );
}
