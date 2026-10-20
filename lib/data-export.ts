import { z } from "zod";
import type { HabitStatus } from "@/types";

/**
 * Export / Import payload format (Feature 29).
 *
 * Pure + client-safe: the browser validates a picked file against these
 * schemas before the Server Action re-validates the same shape server-side.
 * Version bump here when the file format changes — import rejects
 * anything but EXPORT_VERSION.
 */

export const EXPORT_VERSION = 1 as const;

/** Date column format used across habit_completions / mood_entries / daily_notes. */
const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

const timeStr = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected HH:MM");

const uuidStr = z.string().uuid();

const colorThemeSchema = z.enum([
  "lavender",
  "mint",
  "peach",
  "ocean",
  "rose",
  "sage",
  "clay",
  "lagoon",
  "berry",
  "orchid",
]);

const themeModeSchema = z.enum(["light", "dark", "system"]);

// ---------------------------------------------------------------------------
// Row shapes (camelCase — the file format is ours, decoupled from DB columns)
// ---------------------------------------------------------------------------

export type ExportProfile = {
  displayName: string | null;
  trackerTitle: string;
  welcomeMessage: string;
  bioNote: string | null;
  themeMode: string;
  colorTheme: string;
  customTheme: Record<string, string> | null;
  weekStartsOn: number;
  defaultReminderTime: string;
  defaultFrequency: string;
  showCompletedHabits: boolean;
  compactHabitView: boolean;
  notifyHabit: boolean;
  notifyDailySummary: boolean;
  notifyMood: boolean;
  notifyStreak: boolean;
  notifyMissed: boolean;
  moodScale: number;
  enableMoodNotes: boolean;
  moodReminderTime: string;
  showMoodOnCalendar: boolean;
};

export type ExportMoodLevel = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  value: number;
  sortOrder: number;
};

export type ExportCategory = {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
};

export type ExportHabit = {
  id: string;
  categoryId: string | null;
  name: string;
  emoji: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  archivedAt: string | null;
  createdAt: string | null;
};

export type ExportCompletion = {
  id: string;
  habitId: string;
  date: string;
  status: HabitStatus;
};

export type ExportMoodEntry = {
  id: string;
  date: string;
  moodValue: number;
};

export type ExportNote = {
  id: string;
  date: string;
  content: string;
  createdAt: string | null;
};

export type ExportPayload = {
  version: typeof EXPORT_VERSION;
  exportedAt: string;
  profile: ExportProfile | null;
  moodLevels: ExportMoodLevel[];
  categories: ExportCategory[];
  habits: ExportHabit[];
  completions: ExportCompletion[];
  moodEntries: ExportMoodEntry[];
  notes: ExportNote[];
};

// ---------------------------------------------------------------------------
// Zod schemas (same names/types — used by both the client pre-check and
// the Server Action re-validation)
// ---------------------------------------------------------------------------

export const exportProfileSchema = z.object({
  displayName: z.string().max(50).nullable(),
  trackerTitle: z.string().max(200),
  welcomeMessage: z.string().max(500),
  bioNote: z.string().max(100).nullable(),
  themeMode: themeModeSchema,
  colorTheme: colorThemeSchema,
  customTheme: z.record(z.string(), z.string()).nullable(),
  weekStartsOn: z.number().int().min(0).max(6),
  defaultReminderTime: timeStr,
  defaultFrequency: z.enum(["daily", "weekly"]),
  showCompletedHabits: z.boolean(),
  compactHabitView: z.boolean(),
  notifyHabit: z.boolean(),
  notifyDailySummary: z.boolean(),
  notifyMood: z.boolean(),
  notifyStreak: z.boolean(),
  notifyMissed: z.boolean(),
  moodScale: z.number().int().min(1).max(10),
  enableMoodNotes: z.boolean(),
  moodReminderTime: timeStr,
  showMoodOnCalendar: z.boolean(),
});

export const exportMoodLevelSchema = z.object({
  id: uuidStr,
  label: z.string().min(1).max(50),
  emoji: z.string().max(8),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Expected #RRGGBB"),
  value: z.number().int().min(1).max(10),
  sortOrder: z.number().int(),
});

export const exportCategorySchema = z.object({
  id: uuidStr,
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Expected #RRGGBB"),
  sortOrder: z.number().int(),
});

export const exportHabitSchema = z.object({
  id: uuidStr,
  categoryId: uuidStr.nullable(),
  name: z.string().min(1).max(100),
  emoji: z.string().max(8),
  description: z.string().max(500).nullable(),
  sortOrder: z.number().int(),
  active: z.boolean(),
  archivedAt: z.string().nullable(),
  createdAt: z.string().nullable(),
});

export const exportCompletionSchema = z.object({
  id: uuidStr,
  habitId: uuidStr,
  date: dateStr,
  status: z.enum(["done", "partial", "missed"]),
});

export const exportMoodEntrySchema = z.object({
  id: uuidStr,
  date: dateStr,
  moodValue: z.number().int().min(1).max(10),
});

export const exportNoteSchema = z.object({
  id: uuidStr,
  date: dateStr,
  content: z.string().min(1).max(5000),
  createdAt: z.string().nullable(),
});

export const exportPayloadSchema = z.object({
  version: z.literal(EXPORT_VERSION),
  exportedAt: z.string(),
  profile: exportProfileSchema.nullable(),
  moodLevels: z.array(exportMoodLevelSchema),
  categories: z.array(exportCategorySchema),
  habits: z.array(exportHabitSchema),
  completions: z.array(exportCompletionSchema),
  moodEntries: z.array(exportMoodEntrySchema),
  notes: z.array(exportNoteSchema),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Counts shown in the import confirm strip. */
export type ImportSummary = {
  habits: number;
  completions: number;
  moodEntries: number;
  notes: number;
  categories: number;
  moodLevels: number;
  hasProfile: boolean;
};

export function summarizeImport(payload: ExportPayload): ImportSummary {
  return {
    habits: payload.habits.length,
    completions: payload.completions.length,
    moodEntries: payload.moodEntries.length,
    notes: payload.notes.length,
    categories: payload.categories.length,
    moodLevels: payload.moodLevels.length,
    hasProfile: payload.profile !== null,
  };
}

/** Parse + validate a picked file's text. Returns the payload or a human error. */
export function parseExportFile(
  text: string,
): { payload: ExportPayload; error?: undefined } | { payload?: undefined; error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { error: "That file isn't valid JSON." };
  }

  const shapeCheck = z
    .object({ version: z.unknown() })
    .safeParse(raw);
  if (!shapeCheck.success || typeof shapeCheck.data.version !== "number") {
    return { error: "That file doesn't look like a Habit Tracker export." };
  }
  if (shapeCheck.data.version !== EXPORT_VERSION) {
    return {
      error: `Unsupported export version (${shapeCheck.data.version}). This app reads version ${EXPORT_VERSION} files.`,
    };
  }

  const result = exportPayloadSchema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    const path = first?.path.join(".") || "file";
    return { error: `Invalid export data at ${path}: ${first?.message ?? "check failed"}.` };
  }
  return { payload: result.data };
}

/** Filename for the Export download. */
export function exportFilename(): string {
  return "habit-tracker-export.json";
}

/** Filename for the Backup download — timestamped, per build plan. */
export function backupFilename(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp =
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
  return `habit-tracker-backup-${stamp}.json`;
}
