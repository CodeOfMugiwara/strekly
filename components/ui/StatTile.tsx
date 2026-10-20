import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The ONE stat tile in the app.
 *
 * The Home "Quick Stats" tiles and the Stats "KPI" cards built the same
 * thing — icon bubble + value + label (+ optional delta and caption) — with
 * different class names, different radii and different data shapes. The
 * tile renders only the CONTENT; the caller owns the surface (a `Card` for
 * a KPI, a tinted sub-tile inside a Card for Quick Stats).
 */
type StatTileProps = {
  icon?: ReactNode;
  /** Icon bubble classes, e.g. `bg-success-light text-success-strong`. */
  iconClassName?: string;
  value: ReactNode;
  /** Value colour, e.g. `text-success-strong`. */
  valueClassName?: string;
  label: ReactNode;
  caption?: ReactNode;
  /** Signed delta, e.g. `+12%` or `-3 days`. */
  delta?: string;
  className?: string;
};

export function StatTile({
  icon,
  iconClassName,
  value,
  valueClassName,
  label,
  caption,
  delta,
  className,
}: StatTileProps) {
  const isDown = delta?.startsWith("-") ?? false;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {icon ? (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            iconClassName,
          )}
          aria-hidden
        >
          {icon}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-lg font-bold leading-tight tracking-tight text-text",
            valueClassName,
          )}
        >
          {value}
        </p>
        <p className="truncate text-xs text-text-muted">{label}</p>
        {caption ? (
          <p className="mt-0.5 text-[11px] text-text-muted">{caption}</p>
        ) : null}
      </div>

      {delta ? (
        <p
          className={cn(
            "flex shrink-0 items-center gap-0.5 text-xs font-semibold",
            isDown ? "text-error-strong" : "text-success-strong",
          )}
        >
          {isDown ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUp className="h-3 w-3" />
          )}
          {delta.replace("-", "")}
        </p>
      ) : null}
    </div>
  );
}
