import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The ONE decorative script quote in the app.
 *
 * Nine separate blocks rendered the same idea in slightly different sizes,
 * alignments and colours. They now share one component and one colour
 * token (`text-primary-text`, which re-themes with the active colour theme
 * — the old `text-accent-foreground` stayed violet in Mint/Ocean/Peach).
 */
type ScriptQuoteProps = {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  className?: string;
};

const SIZES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} as const;

const ALIGNS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function ScriptQuote({
  children,
  size = "md",
  align = "left",
  className,
}: ScriptQuoteProps) {
  return (
    <p
      className={cn(
        "whitespace-pre-line font-script leading-snug text-primary-text",
        SIZES[size],
        ALIGNS[align],
        className,
      )}
    >
      {children}
    </p>
  );
}
