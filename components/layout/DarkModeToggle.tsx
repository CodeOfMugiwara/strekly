"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

/**
 * The ONE dark-mode toggle.
 *
 * The desktop sidebar and the mobile header each rendered the same
 * `Switch` + `useTheme` wiring by hand.
 */
export function DarkModeToggle({
  showLabel = false,
  className,
}: {
  showLabel?: boolean;
  className?: string;
}) {
  const { resolvedTheme, setThemeMode } = useTheme();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLabel ? (
        <span className="text-sm font-medium text-text">Dark Mode</span>
      ) : null}
      <Switch
        checked={resolvedTheme === "dark"}
        onChange={() => setThemeMode(resolvedTheme === "dark" ? "light" : "dark")}
        ariaLabel="Toggle dark mode"
      />
    </div>
  );
}
