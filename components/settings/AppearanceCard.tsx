"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SaveStatusLine } from "@/components/ui/SaveStatusLine";
import { cn } from "@/lib/utils";
import type { ColorTheme, ThemeMode } from "@/types";

const MODE_OPTIONS: Array<{
  value: ThemeMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
  { value: "system", label: "System", icon: <Monitor className="h-3.5 w-3.5" /> },
];

const COLOR_OPTIONS: Array<{
  value: ColorTheme;
  label: string;
  swatchClass: string;
}> = [
  { value: "lavender", label: "Lavender", swatchClass: "bg-swatch-lavender" },
  { value: "mint", label: "Mint", swatchClass: "bg-swatch-mint" },
  { value: "peach", label: "Peach", swatchClass: "bg-swatch-peach" },
  { value: "ocean", label: "Ocean", swatchClass: "bg-swatch-ocean" },
  { value: "rose", label: "Rose", swatchClass: "bg-swatch-rose" },
  { value: "sage", label: "Sage", swatchClass: "bg-swatch-sage" },
  { value: "clay", label: "Clay", swatchClass: "bg-swatch-clay" },
  { value: "lagoon", label: "Lagoon", swatchClass: "bg-swatch-lagoon" },
  { value: "berry", label: "Berry", swatchClass: "bg-swatch-berry" },
  { value: "orchid", label: "Orchid", swatchClass: "bg-swatch-orchid" },
];

export function AppearanceCard() {
  const { themeMode, colorTheme, setThemeMode, setColorTheme, persistStatus, persistError } =
    useTheme();

  return (
    <SettingsSection
      title="Appearance"
      description="Make it look and feel right."
    >
      <div className="space-y-5">
        <div>
          <div className="mb-2.5 text-sm font-medium text-text">Theme Mode</div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Theme mode"
          >
            {MODE_OPTIONS.map((option) => {
              const active = themeMode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setThemeMode(option.value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    active
                      ? "border-transparent bg-primary text-primary-on"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text",
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2.5 text-sm font-medium text-text">Color Theme</div>
          <div
            className="flex flex-wrap items-start gap-4"
            role="group"
            aria-label="Color theme"
            data-tour="settings-appearance"
          >
            {COLOR_OPTIONS.map((option) => {
              const active = colorTheme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setColorTheme(option.value)}
                  className={cn(
                    "flex w-14 cursor-pointer flex-col items-center gap-1.5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-shadow",
                      option.swatchClass,
                      active
                        ? "border-primary ring-2 ring-primary/35 ring-offset-2 ring-offset-surface"
                        : "border-border",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px]",
                      active ? "font-medium text-text" : "text-text-secondary",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <SaveStatusLine
          status={persistStatus}
          idle="Theme applies instantly and saves to your profile."
          error={
            persistError
              ? `${persistError} — theme is kept on this device only.`
              : "Profile sync failed — theme is kept on this device only."
          }
        />
      </div>
    </SettingsSection>
  );
}
