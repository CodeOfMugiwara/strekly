import type { MockHabitStatus } from "./mock-home";

export type MockGridHabit = {
  id: string;
  name: string;
  emoji: string;
  sortOrder: number;
};

/** habitId → (YYYY-MM-DD → status) */
export type MockStatusMap = Record<
  string,
  Record<string, MockHabitStatus>
>;

/** Seeded from the developer's old tracker Habits grid (September 2026) */
export const mockGridHabits: MockGridHabit[] = [
  { id: "wake-8am", name: "Wake up at 8:00 AM", emoji: "⏰", sortOrder: 0 },
  { id: "core-exercise", name: "Core Exercise", emoji: "💪", sortOrder: 1 },
  { id: "eye-exercise", name: "Eye Exercise", emoji: "👁", sortOrder: 2 },
  { id: "height-exercise", name: "Height Exercise", emoji: "🧘", sortOrder: 3 },
  { id: "brush", name: "Brush", emoji: "🪥", sortOrder: 4 },
  { id: "bath-9am", name: "Bath before 9 AM", emoji: "🚿", sortOrder: 5 },
  { id: "journal", name: "Journal", emoji: "📔", sortOrder: 6 },
  { id: "drink-h2o", name: "Drink 2-3L H₂O", emoji: "💧", sortOrder: 7 },
  { id: "sleep-12pm", name: "Sleep at 12:00 PM", emoji: "🌙", sortOrder: 8 },
];

const d = (day: number) => `2026-09-${String(day).padStart(2, "0")}`;

/** September 2026, days 13–21 — from the old tracker screenshot */
export const mockGridStatuses: MockStatusMap = {
  "wake-8am": {
    [d(13)]: "missed", [d(14)]: "missed", [d(15)]: "missed",
    [d(16)]: "done", [d(17)]: "done", [d(18)]: "done",
    [d(19)]: "partial", [d(20)]: "partial", [d(21)]: "done",
  },
  "core-exercise": {
    [d(13)]: "missed", [d(14)]: "missed",
    [d(15)]: "done", [d(16)]: "done", [d(17)]: "done", [d(18)]: "done",
    [d(19)]: "missed", [d(20)]: "missed", [d(21)]: "missed",
  },
  "eye-exercise": {
    [d(13)]: "missed", [d(14)]: "missed",
    [d(15)]: "partial", [d(16)]: "partial", [d(17)]: "partial", [d(18)]: "partial",
    [d(19)]: "missed", [d(20)]: "missed", [d(21)]: "missed",
  },
  "height-exercise": {
    [d(13)]: "missed", [d(14)]: "missed",
    [d(15)]: "partial", [d(16)]: "partial", [d(17)]: "partial", [d(18)]: "partial",
    [d(19)]: "missed", [d(20)]: "missed", [d(21)]: "missed",
  },
  brush: {
    [d(13)]: "missed", [d(14)]: "missed", [d(15)]: "missed",
    [d(16)]: "missed", [d(17)]: "missed", [d(18)]: "missed",
    [d(19)]: "done", [d(20)]: "done", [d(21)]: "missed",
  },
  "bath-9am": {
    [d(13)]: "missed", [d(14)]: "done", [d(15)]: "partial",
    [d(16)]: "done", [d(17)]: "done", [d(18)]: "done",
    [d(19)]: "done", [d(20)]: "done", [d(21)]: "done",
  },
  journal: {
    [d(13)]: "done", [d(14)]: "done", [d(15)]: "done",
    [d(16)]: "done", [d(17)]: "done", [d(18)]: "done",
  },
  "drink-h2o": {
    [d(13)]: "partial", [d(14)]: "partial", [d(15)]: "done",
    [d(16)]: "partial", [d(17)]: "partial", [d(18)]: "done",
  },
  "sleep-12pm": {
    [d(13)]: "missed", [d(14)]: "partial", [d(15)]: "partial",
    [d(16)]: "done", [d(17)]: "partial",
    [d(18)]: "missed", [d(19)]: "missed",
  },
};

/** dateKey (YYYY-MM-DD) → note text — September 2026 */
export const mockDayNotes: Record<string, string> = {
  [d(13)]: " rough start, missed the morning routine.",
  [d(14)]: "Finally fixed my sleep schedule.",
  [d(15)]: "Core exercise felt easier today.",
  [d(16)]: "Good focus day. Journal entry done.",
  [d(17)]: "Eye strain was low — the 20-20-20 rule works.",
  [d(18)]: "Bath before 9 AM: cold shower, surprisingly nice.",
  [d(19)]: "Brush streak back on track.",
  [d(20)]: "Lazy evening, skipped wind-down.",
  [d(21)]: "Today my 1st swimming class.",
};

export const MOCK_TODAY = { year: 2026, month: 9, day: 11 };

/** Page opens on the month that has data */
export const MOCK_VIEW = { year: 2026, month: 8 };
