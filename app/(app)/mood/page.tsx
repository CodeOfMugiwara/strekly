import { loadMonthMood } from "@/lib/mood-data";
import { MoodView } from "@/components/mood/MoodView";

export const dynamic = "force-dynamic";

export default async function MoodPage() {
  const now = new Date();
  const data = await loadMonthMood(now.getFullYear(), now.getMonth());
  return <MoodView initialData={data} />;
}
