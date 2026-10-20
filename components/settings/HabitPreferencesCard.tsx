"use client";

import { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { saveHabitPreferences } from "@/actions/settings";
import { SettingsSection } from "@/components/settings/SettingsSection";
import {
  SaveStatusLine,
  type SaveStatus,
} from "@/components/ui/SaveStatusLine";
import { SettingsRow, settingsSelectClass } from "@/components/settings/SettingsRow";
import type { SettingsProfile } from "@/lib/settings-data";

const WEEKDAY_OPTIONS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

type HabitPreferencesCardProps = {
  profile: SettingsProfile;
};

/**
 * Preferences.
 *
 * "Week starts on" is the only preference left here, because it is the only
 * one that changed anything: the Home week strip, the Habits grid, the
 * Stats weekly buckets and the Calendar layout all follow it. The former
 * rows (default reminder time, default frequency, show completed habits,
 * compact habit view) were saved and never read, so they were removed
 * rather than left as switches that do nothing.
 */
export function HabitPreferencesCard({ profile }: HabitPreferencesCardProps) {
  const [weekStartsOn, setWeekStartsOn] = useState(profile.weekStartsOn);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const seqRef = useRef(0);

  const save = (value: number) => {
    const seq = ++seqRef.current;
    setStatus("saving");
    void saveHabitPreferences({ weekStartsOn: value }).then((result) => {
      if (seq !== seqRef.current) return;
      setStatus(result.success ? "saved" : "error");
    });
  };

  return (
    <SettingsSection
      title="Preferences"
      description="How your week is laid out."
    >
      <div className="-mx-1 divide-y divide-border">
        <SettingsRow
          icon={<CalendarDays className="h-4 w-4" />}
          title="Week Starts On"
          description="Applies to your home, habits, stats and calendar"
          control={
            <select
              value={weekStartsOn}
              onChange={(e) => {
                const value = Number(e.target.value);
                setWeekStartsOn(value);
                save(value);
              }}
              aria-label="Week starts on"
              className={settingsSelectClass}
            >
              {WEEKDAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          }
        />
      </div>
      <SaveStatusLine
        status={status}
        idle="Changes save to your profile automatically."
      />
    </SettingsSection>
  );
}
