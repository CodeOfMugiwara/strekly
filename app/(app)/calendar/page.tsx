import { CalendarView } from "@/components/calendar/CalendarView";
import { loadCalendarData } from "@/lib/calendar-data";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const data = await loadCalendarData();
  return <CalendarView data={data} />;
}