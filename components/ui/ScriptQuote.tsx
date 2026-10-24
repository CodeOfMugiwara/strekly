import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScriptQuoteProps = {
  children: ReactNode;
  size?: "xs" | "sm" | "base" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right";
  slant?: boolean;
  underline?: boolean;
  className?: string;
};

const SIZES = {
  xs: "text-xs sm:text-sm leading-tight",
  sm: "text-lg sm:text-xl leading-snug",
  base: "text-xl sm:text-2xl leading-snug",
  md: "text-2xl sm:text-3xl leading-snug",
  lg: "text-3xl sm:text-4xl leading-normal",
  xl: "text-4xl sm:text-5xl leading-tight",
} as const;

const ALIGNS = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
} as const;

export function ScriptQuote({
  children,
  size = "md",
  align = "left",
  slant = false,
  underline = false,
  className,
}: ScriptQuoteProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col select-none transition-transform duration-200",
        ALIGNS[align],
        slant && "-rotate-[4deg]",
        className,
      )}
    >
      <p
        className={cn(
          "font-script font-medium tracking-wide text-primary-text whitespace-pre-line drop-shadow-xs",
          SIZES[size],
        )}
      >
        {children}
      </p>

      {underline && (
        <svg
          viewBox="0 0 120 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-1 h-2 w-28 sm:w-36 text-primary/75 max-w-full"
          aria-hidden="true"
        >
          <path
            d="M2 7 C 30 3, 80 3, 118 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
