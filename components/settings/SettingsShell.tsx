"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Database,
  Heart,
  Info,
  ListTodo,
  Palette,
  SlidersHorizontal,
  Tags,
} from "lucide-react";
import { AboutCard } from "@/components/settings/AboutCard";
import { AppearanceCard } from "@/components/settings/AppearanceCard";
import { CategoriesCard } from "@/components/settings/CategoriesCard";
import { DataManagementCard } from "@/components/settings/DataManagementCard";
import { HabitPreferencesCard } from "@/components/settings/HabitPreferencesCard";
import { ManageHabitsCard } from "@/components/settings/ManageHabitsCard";
import { SettingsHeaderActions } from "@/components/settings/SettingsHeaderActions";
import { SlidingIndicator } from "@/components/ui/SlidingIndicator";
import { cn } from "@/lib/utils";
import {
  EASE_IN,
  EASE_OUT,
  ENTER_DURATION,
  EXIT_DURATION,
  SLIDE_DISTANCE,
} from "@/lib/motion";
import type {
  SettingsCategory,
  SettingsHabit,
  SettingsMoodLevel,
  SettingsProfile,
} from "@/lib/settings-data";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

type SettingsShellProps = {
  categories: SettingsCategory[];
  habits: SettingsHabit[];
  profile: SettingsProfile;
  moodLevels: SettingsMoodLevel[];
};

type SectionKey =
  | "appearance"
  | "preferences"
  | "habits"
  | "categories"
  | "data"
  | "about";

const SECTIONS: Array<{
  key: SectionKey;
  label: string;
  icon: React.ReactNode;
}> = [
  { key: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
  {
    key: "preferences",
    label: "Preferences",
    icon: <SlidersHorizontal className="h-4 w-4" />,
  },
  { key: "habits", label: "Habits", icon: <ListTodo className="h-4 w-4" /> },
  { key: "categories", label: "Categories", icon: <Tags className="h-4 w-4" /> },
  { key: "data", label: "Data", icon: <Database className="h-4 w-4" /> },
  { key: "about", label: "About", icon: <Info className="h-4 w-4" /> },
];

/**
 * Settings layout (UI overhaul): section nav + single unboxed pane
 * (Linear/Stripe pattern). Profile + Notifications open as anchored
 * popovers from the header icons. No cards, no icon-bubble section
 * headers, no decorative filler.
 */
export function SettingsShell({
  categories,
  habits,
  profile,
  moodLevels,
}: SettingsShellProps) {
  const [section, setSection] = useState<SectionKey>("appearance");
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            Settings
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Customize your experience. Make it yours.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <ScriptQuote size="lg" className="hidden items-center gap-2 sm:flex">
            {"Small changes\nmake a big difference"}
            <Heart className="h-4 w-4 shrink-0 fill-primary text-primary-text" />
          </ScriptQuote>
          <SettingsHeaderActions profile={profile} moodLevels={moodLevels} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[13rem_1fr] lg:gap-12">
        <nav
          aria-label="Settings sections"
          className="scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:sticky lg:top-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 lg:self-start"
        >
          {SECTIONS.map((item) => {
            const active = section === item.key;
            return (
              <button
                key={item.key}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => setSection(item.key)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  active
                    ? "font-medium text-primary-text"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text",
                )}
              >
                {/* One shared pill that SLIDES between nav items instead of
                    a background that jumps. */}
                {active ? (
                  <SlidingIndicator
                    layoutId="settings-nav-pill"
                    className="rounded-lg bg-primary-lightest"
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={section}
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -SLIDE_DISTANCE,
                      transition: { duration: ENTER_DURATION, ease: EASE_IN },
                    }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 0,
                      x: SLIDE_DISTANCE,
                      transition: { duration: EXIT_DURATION, ease: EASE_OUT },
                    }
              }
            >
              {section === "appearance" ? <AppearanceCard /> : null}
              {section === "preferences" ? (
                <HabitPreferencesCard profile={profile} />
              ) : null}
              {section === "habits" ? (
                <ManageHabitsCard habits={habits} categories={categories} />
              ) : null}
              {section === "categories" ? (
                <CategoriesCard initialCategories={categories} />
              ) : null}
              {section === "data" ? <DataManagementCard /> : null}
              {section === "about" ? <AboutCard /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
