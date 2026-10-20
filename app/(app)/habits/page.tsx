import { loadHabitsPageData } from "@/lib/habits-data";
import { HabitsView } from "@/components/habits/HabitsView";

export default async function HabitsPage() {
  const { habits, categories, statuses, notes, defaultView } =
    await loadHabitsPageData();

  return (
    <HabitsView
      initialHabits={habits}
      categories={categories}
      initialStatuses={statuses}
      initialNotes={notes}
      defaultView={defaultView}
    />
  );
}
