import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const settingsSelectClass =
  "rounded-xl border border-border/80 bg-surface px-3 py-1.5 text-xs text-text shadow-subtle focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50";

type SettingsRowProps = {
  icon?: ReactNode;
  iconClassName?: string;
  title: string;
  description?: string;
  control: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SettingsRow({
  icon,
  iconClassName,
  title,
  description,
  control,
  titleClassName,
  descriptionClassName,
}: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-lightest text-primary-text",
              iconClassName,
            )}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <p className={cn("text-sm font-medium text-text", titleClassName)}>
            {title}
          </p>
          {description ? (
            <p className={cn("text-xs text-text-muted", descriptionClassName)}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}