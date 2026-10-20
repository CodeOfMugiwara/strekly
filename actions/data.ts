"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  exportPayloadSchema,
  type ExportPayload,
} from "@/lib/data-export";
import type { ActionResult } from "@/types";

/** Rows per upsert request — keeps gateway bodies comfortably small. */
const CHUNK = 500;

const APP_PATHS = ["/home", "/habits", "/mood", "/stats", "/calendar", "/settings"];

function chunk<T>(rows: T[]): T[][] {
  if (rows.length === 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += CHUNK) {
    out.push(rows.slice(i, i + CHUNK));
  }
  return out;
}

/**
 * Merge-upsert an exported payload into the signed-in account.
 *
 * Never deletes — rows already in the account but absent from the file are
 * untouched (destructive restore is Feature 30's Reset). `user_id` is forced
 * to `auth.uid()`; parents match by `id`, date-keyed tables by their natural
 * unique key, and mood levels by `value` (an account always has its own
 * seeded set — matching by id would duplicate the scale on cross-account
 * import).
 */
export async function importUserData(input: unknown): Promise<ActionResult> {
  try {
    const parsed = exportPayloadSchema.safeParse(input);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return {
        success: false,
        error: `Invalid import data: ${first?.path.join(".") || "file"} ${first?.message ?? "check failed"}`,
      };
    }
    const payload: ExportPayload = parsed.data;

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }
    const uid = user.id;

    // 1. Profile — upsert onto auth.uid(); exported id ignored; created_at
    //    omitted so an existing row keeps its signup time.
    if (payload.profile) {
      const p = payload.profile;
      const { error } = await insforge.database.from("profiles").upsert(
        {
          id: uid,
          display_name: p.displayName,
          tracker_title: p.trackerTitle,
          welcome_message: p.welcomeMessage,
          bio_note: p.bioNote,
          theme_mode: p.themeMode,
          color_theme: p.colorTheme,
          custom_theme: p.customTheme,
          week_starts_on: p.weekStartsOn,
          default_reminder_time: p.defaultReminderTime,
          default_frequency: p.defaultFrequency,
          show_completed_habits: p.showCompletedHabits,
          compact_habit_view: p.compactHabitView,
          notify_habit: p.notifyHabit,
          notify_daily_summary: p.notifyDailySummary,
          notify_mood: p.notifyMood,
          notify_streak: p.notifyStreak,
          notify_missed: p.notifyMissed,
          mood_scale: p.moodScale,
          enable_mood_notes: p.enableMoodNotes,
          mood_reminder_time: p.moodReminderTime,
          show_mood_on_calendar: p.showMoodOnCalendar,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
      if (error) {
        console.error("[actions/data/importUserData] profiles:", error.message);
        return { success: false, error: "Failed to import profile settings" };
      }
    }

    // 2. Mood levels — natural key (user_id, value) so a seeded account's
    //    rows are updated in place, never duplicated.
    for (const batch of chunk(payload.moodLevels)) {
      const { error } = await insforge.database.from("mood_levels").upsert(
        batch.map((m) => ({
          id: m.id,
          user_id: uid,
          label: m.label,
          emoji: m.emoji,
          color: m.color,
          value: m.value,
          sort_order: m.sortOrder,
        })),
        { onConflict: "user_id,value" },
      );
      if (error) {
        console.error("[actions/data/importUserData] mood_levels:", error.message);
        return { success: false, error: "Failed to import mood levels" };
      }
    }

    // 3. Categories — by id.
    for (const batch of chunk(payload.categories)) {
      const { error } = await insforge.database.from("habit_categories").upsert(
        batch.map((c) => ({
          id: c.id,
          user_id: uid,
          name: c.name,
          color: c.color,
          sort_order: c.sortOrder,
        })),
        { onConflict: "id" },
      );
      if (error) {
        console.error("[actions/data/importUserData] habit_categories:", error.message);
        return { success: false, error: "Failed to import categories" };
      }
    }

    // 4. Habits — by id (category_id may point at rows imported above).
    for (const batch of chunk(payload.habits)) {
      const { error } = await insforge.database.from("habits").upsert(
        batch.map((h) => ({
          id: h.id,
          user_id: uid,
          category_id: h.categoryId,
          name: h.name,
          emoji: h.emoji,
          description: h.description,
          sort_order: h.sortOrder,
          active: h.active,
          archived_at: h.archivedAt,
          created_at: h.createdAt,
        })),
        { onConflict: "id" },
      );
      if (error) {
        console.error("[actions/data/importUserData] habits:", error.message);
        return { success: false, error: "Failed to import habits" };
      }
    }

    // 5. Completions — natural key (habit_id, date); a cell recreated since
    //    the export carries a new id but the same keys, so match on those.
    for (const batch of chunk(payload.completions)) {
      const { error } = await insforge.database.from("habit_completions").upsert(
        batch.map((c) => ({
          id: c.id,
          user_id: uid,
          habit_id: c.habitId,
          date: c.date,
          status: c.status,
        })),
        { onConflict: "habit_id,date" },
      );
      if (error) {
        console.error("[actions/data/importUserData] habit_completions:", error.message);
        return { success: false, error: "Failed to import habit completions" };
      }
    }

    // 6. Mood entries — natural key (user_id, date).
    for (const batch of chunk(payload.moodEntries)) {
      const { error } = await insforge.database.from("mood_entries").upsert(
        batch.map((m) => ({
          id: m.id,
          user_id: uid,
          date: m.date,
          mood_value: m.moodValue,
        })),
        { onConflict: "user_id,date" },
      );
      if (error) {
        console.error("[actions/data/importUserData] mood_entries:", error.message);
        return { success: false, error: "Failed to import mood entries" };
      }
    }

    // 7. Daily notes — natural key (user_id, date); created_at passthrough,
    //    updated_at refreshed.
    for (const batch of chunk(payload.notes)) {
      const { error } = await insforge.database.from("daily_notes").upsert(
        batch.map((n) => ({
          id: n.id,
          user_id: uid,
          date: n.date,
          content: n.content,
          created_at: n.createdAt,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "user_id,date" },
      );
      if (error) {
        console.error("[actions/data/importUserData] daily_notes:", error.message);
        return { success: false, error: "Failed to import notes" };
      }
    }

    for (const path of APP_PATHS) {
      revalidatePath(path);
    }
    return { success: true };
  } catch (error) {
    console.error("[actions/data/importUserData]", error);
    return { success: false, error: "Failed to import data" };
  }
}
