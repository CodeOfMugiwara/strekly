import { SettingsShell } from "@/components/settings/SettingsShell";
import { loadSettingsData } from "@/lib/settings-data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { categories, habits, profile, moodLevels } = await loadSettingsData();
  return (
    <SettingsShell
      categories={categories}
      habits={habits}
      profile={profile}
      moodLevels={moodLevels}
    />
  );
}