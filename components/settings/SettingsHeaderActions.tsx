"use client";

import { LogOut, Smile, User } from "lucide-react";
import { signOut } from "@/actions/auth";
import { MoodPanel } from "@/components/settings/MoodPanel";
import { ProfilePanel } from "@/components/settings/ProfilePanel";
import { Button } from "@/components/ui/Button";
import { PopoverPanel } from "@/components/ui/Popover";
import type { SettingsMoodLevel, SettingsProfile } from "@/lib/settings-data";

type SettingsHeaderActionsProps = {
  profile: SettingsProfile;
  moodLevels: SettingsMoodLevel[];
};

/**
 * Settings header icon buttons: Profile + Mood open as small anchored
 * popovers next to their icons (UI overhaul — replaced the F28.1 slide-over
 * sheets). Sign-out lives in the profile popover now that the sidebar
 * avatar is gone.
 *
 * The second surface used to be "Notifications" — five reminder switches
 * and a reminder time that nothing ever read. It is now "Mood" and holds
 * only the mood controls that actually change something.
 */
export function SettingsHeaderActions({
  profile,
  moodLevels,
}: SettingsHeaderActionsProps) {
  return (
    <div className="flex items-start gap-2">
      <PopoverPanel
        triggerLabel="Your profile"
        triggerIcon={<User className="h-4 w-4" />}
        title="Your Profile"
        description="Manage your personal details."
      >
        <ProfilePanel profile={profile} />
        <div className="mt-4 border-t border-border pt-3">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => void signOut()}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </PopoverPanel>

      <PopoverPanel
        triggerLabel="Mood"
        triggerIcon={<Smile className="h-4 w-4" />}
        title="Mood"
        description="Notes and the calendar."
      >
        <MoodPanel profile={profile} moodLevels={moodLevels} />
      </PopoverPanel>
    </div>
  );
}
