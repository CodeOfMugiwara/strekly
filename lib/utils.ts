export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getWeekdayIndex(date: Date, weekStartsOn: number): number {
  return (date.getDay() - weekStartsOn + 7) % 7;
}

export function startOfWeek(date: Date, weekStartsOn: number): Date {
  const d = startOfDay(date);
  const diff = getWeekdayIndex(d, weekStartsOn);
  return addDays(d, -diff);
}

export function eachDayOfWeek(weekStartDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
}

export function monthMatrix(
  year: number,
  month: number,
  weekStartsOn: number,
): Date[] {
  const first = new Date(year, month, 1);
  const start = startOfWeek(first, weekStartsOn);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = getWeekdayIndex(first, weekStartsOn);
  const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
  return Array.from({ length: totalCells }, (_, i) => addDays(start, i));
}
