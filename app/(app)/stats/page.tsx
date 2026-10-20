import { loadStatsData } from "@/lib/stats-data";
import { StatsView } from "@/components/stats/StatsView";

export default async function StatsPage() {
  const data = await loadStatsData();
  return <StatsView data={data} />;
}