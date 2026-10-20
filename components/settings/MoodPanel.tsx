"use client";

import { useRef, useState } from "react";
import { Calendar, PenLine, Smile } from "lucide-react";
import { saveMoodSettings } from "@/actions/settings";
import { SettingsRow } from "@/components/settings/SettingsRow";
import {
  SaveStatusLine,
  type SaveStatus,
} from "@/components/ui/SaveStatusLine";
import { MoodFace } from "@/components/ui/MoodFace";
import { Switch } from "@/components/ui/Switch";
import type { SettingsMoodLevel, SettingsProfile } from "@/lib/settings-data";

type MoodPanelProps = {
  profile: SettingsProfile;
  moodLevels: SettingsMoodLevel[];
};

/**
 * Mood settings body for the header popover.
 *
 * Every control here has a visible effect somewhere in the app:
 * "Enable Mood Notes" gates the note editor on the Mood and Calendar pages,
 * "Show Mood on Calendar" gates the mood faces on the calendar, and the
 * scale preview shows the account's real `mood_levels` rows.
 *
 * The notification switches that used to live here (habit reminders, daily
 * summary, streak alerts, missed-habit nudges) and the mood reminder time
 * were removed: nothing in the app ever sent a notification, so they were
 * switches that saved a value and changed nothing.
 */
export function MoodPanel({ profile, moodLevels }: MoodPanelProps) {
  const [enableNotes, setEnableNotes] = useState(profile.enableMoodNotes);
  const [showOnCalendar, setShowOnCalendar] = useState(
    profile.showMoodOnCalendar,
  );
  const [status, setStatus] = useState<SaveStatus>("idle");
  const seqRef = useRef(0);

  const saveMood = (patch: {
    enableNotes?: boolean;
    showOnCalendar?: boolean;
  }) => {
    const next = {
      enableNotes,
      showOnCalendar,
      ...patch,
    };
    const seq = ++seqRef.current;
    setStatus("saving");
    void saveMoodSettings({
      enableMoodNotes: next.enableNotes,
      showMoodOnCalendar: next.showOnCalendar,
    }).then((result) => {
      if (seq !== seqRef.current) return;
      setStatus(result.success ? "saved" : "error");
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-lightest text-primary-text"
          aria-hidden
        >
          <Smile className="h-3.5 w-3.5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-text">Mood</h3>
          <p className="text-xs text-text-muted">
            Notes and the calendar.
          </p>
        </div>
      </div>

      {moodLevels.length > 0 ? (
        <div className="mb-3 rounded-lg bg-surface-alt p-3">
          <p className="mb-2 text-xs font-medium text-text-muted">
            Mood Scale
          </p>
          <div className="flex items-center gap-2">
            {moodLevels.map((level) => (
              <MoodFace
                key={level.value}
                value={level.value}
                color={level.color}
                size={28}
              />
            ))}
            <span className="ml-1 text-xs text-text-muted">
              {moodLevels.length} Levels
            </span>
          </div>
        </div>
      ) : null}

      <div className="-mx-1 divide-y divide-border">
        <SettingsRow
          icon={<PenLine className="h-4 w-4" />}
          title="Enable Mood Notes"
          description="Add a note to any day you log a mood"
          control={
            <Switch
              checked={enableNotes}
              onChange={() => {
                setEnableNotes((v) => !v);
                saveMood({ enableNotes: !enableNotes });
              }}
              ariaLabel="Enable mood notes"
            />
          }
        />
        <SettingsRow
          icon={<Calendar className="h-4 w-4" />}
          title="Show Mood on Calendar"
          description="See your mood face on every calendar day"
          control={
            <Switch
              checked={showOnCalendar}
              onChange={() => {
                setShowOnCalendar((v) => !v);
                saveMood({ showOnCalendar: !showOnCalendar });
              }}
              ariaLabel="Show mood on calendar"
            />
          }
        />
      </div>

      <SaveStatusLine
        status={status}
        idle="Choices save to your profile automatically."
      />
    </div>
  );
}
