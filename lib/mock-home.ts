import type { ColorTheme, ThemeMode } from "@/types";

export type MockHabitStatus = "done" | "partial" | "missed" | "unset";

export type MockHabit = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Last 7 day statuses, oldest → newest (index 6 = today) */
  weekStatuses: MockHabitStatus[];
  streak: number;
};

export type MockMoodLevel = {
  value: number;
  label: string;
  emoji: string;
  color: string;
};

export type MockWeekDay = {
  key: string;
  label: string;
  short: string;
  completion: number;
  isToday: boolean;
};

/** Defaults adapted from D:\habit-tracker\index.html DEF_HABITS + config */
export const mockProfile = {
  displayName: "Krishna",
  trackerTitle: "Being New Version of Me Challenge",
  welcomeMessage: "Small steps, big changes. You're doing great!",
  themeMode: "light" as ThemeMode,
  colorTheme: "lavender" as ColorTheme,
};

export const mockHomeGreeting = {
  title: "Good morning",
  subtitle: "A new day, a new opportunity to be better.",
  scriptQuote: "Progress, not perfection.",
  dateLabel: "Sat, 12 Jul 2026",
};

export const mockStatCards = {
  progressPercent: 71,
  progressHint: "5 of 7 habits completed",
  dayStreak: 12,
  dayStreakHint: "Keep going!",
  longestStreak: 28,
  longestStreakHint: "You've got this!",
  todayMoodLabel: "Good",
  todayMoodHint: "Change mood →",
  todayMoodEmoji: "🙂",
};

export const mockHabits: MockHabit[] = [
  {
    id: "drink-water",
    name: "Drink Water",
    emoji: "💧",
    description: "8 glasses",
    weekStatuses: ["done", "done", "done", "done", "unset", "unset", "unset"],
    streak: 4,
  },
  {
    id: "exercise",
    name: "Exercise",
    emoji: "💪",
    description: "30 mins",
    weekStatuses: ["done", "done", "done", "unset", "unset", "unset", "unset"],
    streak: 3,
  },
  {
    id: "read-book",
    name: "Read a Book",
    emoji: "📖",
    description: "20 mins",
    weekStatuses: ["done", "done", "done", "unset", "unset", "unset", "unset"],
    streak: 3,
  },
  {
    id: "meditate",
    name: "Meditate",
    emoji: "🧘",
    description: "10 mins",
    weekStatuses: ["done", "done", "unset", "unset", "unset", "unset", "unset"],
    streak: 2,
  },
  {
    id: "eat-healthy",
    name: "Eat Healthy",
    emoji: "🍏",
    description: "Eat clean",
    weekStatuses: ["done", "done", "unset", "unset", "unset", "unset", "unset"],
    streak: 2,
  },
  {
    id: "no-social",
    name: "No Social Media",
    emoji: "📵",
    description: "Stay focused",
    weekStatuses: ["done", "done", "unset", "unset", "unset", "unset", "unset"],
    streak: 2,
  },
  {
    id: "sleep-early",
    name: "Sleep Early",
    emoji: "🌙",
    description: "Before 11 PM",
    weekStatuses: ["done", "done", "unset", "unset", "unset", "unset", "unset"],
    streak: 2,
  },
];

/** Extra habits from old tracker DEF_HABITS (not on Home list yet) */
export const mockHabitCatalog = [
  { name: "Wake up before 6:00 AM", emoji: "⏰" },
  { name: "Study 5 hr+", emoji: "📚" },
  { name: "No Junk / Sugar", emoji: "🚫" },
  { name: "1 hr New Skill", emoji: "🎯" },
  { name: "Drink 2-3L H₂O", emoji: "💧" },
  { name: "Current Affairs", emoji: "📰" },
  { name: "Feel Gratitude", emoji: "🙏" },
];

/** Design + architecture 5-level scale (HomePage.png / MoodPage.png custom faces) */
export const mockMoodLevels: MockMoodLevel[] = [
  { value: 6, label: "Very Happy", emoji: "😊", color: "#86D6BF" },
  { value: 5, label: "Happy", emoji: "🙂", color: "#FCD34D" },
  { value: 4, label: "Okay", emoji: "😐", color: "#7DD3FC" },
  { value: 3, label: "Tired", emoji: "😴", color: "#A8A29E" },
  { value: 2, label: "Sad", emoji: "☹️", color: "#FC8FA5" },
  { value: 1, label: "Fu*ked Up", emoji: "🤯", color: "#A78BFA" },
];

export const mockSelectedMoodValue = 3;

export const mockMoodNotePlaceholder = "What's on your mind?";

export const mockWeek: MockWeekDay[] = [
  { key: "mon", label: "Mon", short: "Mon", completion: 100, isToday: false },
  { key: "tue", label: "Tue", short: "Tue", completion: 85, isToday: false },
  { key: "wed", label: "Wed", short: "Wed", completion: 70, isToday: false },
  { key: "thu", label: "Thu", short: "Thu", completion: 55, isToday: false },
  { key: "fri", label: "Fri", short: "Fri", completion: 40, isToday: false },
  { key: "sat", label: "Sat", short: "Sat", completion: 60, isToday: true },
  { key: "sun", label: "Sun", short: "Sun", completion: 0, isToday: false },
];

export const mockQuickStats = {
  periodLabel: "This Month",
  completed: 18,
  missed: 10,
  completionRate: 78,
  vsLastMonth: "+12%",
};

export const mockQuotes = {
  inspiration: "A calmer mind\nA brighter you",
  discipline:
    "“Discipline today creates the freedom tomorrow.”",
};

export function countMockDoneToday(habits: MockHabit[]): number {
  return habits.filter((h) => h.weekStatuses[6] === "done").length;
}
