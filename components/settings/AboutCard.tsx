import { SettingsSection } from "@/components/settings/SettingsSection";
import { LumiMascot } from "@/components/mascot/LumiMascot";

/** Identity block only — link rows and Danger Zone removed in the UI overhaul. */
export function AboutCard() {
  return (
    <SettingsSection title="About" description="App information and support.">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-text">Habit Tracker</p>
          <p className="text-xs text-text-muted">Version 1.0.0</p>
          <p className="text-xs text-text-muted">A better you, everyday.</p>
          <p className="mt-1 text-xs text-text-muted">
            Made with <span className="text-error">♥</span> for a brighter
            tomorrow.
          </p>
        </div>
        <LumiMascot
          size="sm"
          mood="sleepy"
          showDialogue={false}
          message="That is everything for today. Rest up."
          caption="Tap Lumi for a nudge."
        />
      </div>
    </SettingsSection>
  );
}
