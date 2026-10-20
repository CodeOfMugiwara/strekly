import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  EXPORT_VERSION,
  backupFilename,
  exportFilename,
  type ExportPayload,
} from "@/lib/data-export";

export async function GET(request: Request) {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const [
      { data: profileRows, error: profileError },
      { data: moodLevelRows, error: moodLevelError },
      { data: categoryRows, error: categoryError },
      { data: habitRows, error: habitError },
      { data: completionRows, error: completionError },
      { data: moodEntryRows, error: moodEntryError },
      { data: noteRows, error: noteError },
    ] = await Promise.all([
      insforge.database
        .from("profiles")
        .select(
          "display_name, tracker_title, welcome_message, bio_note, theme_mode, color_theme, custom_theme, week_starts_on, default_reminder_time, default_frequency, show_completed_habits, compact_habit_view, notify_habit, notify_daily_summary, notify_mood, notify_streak, notify_missed, mood_scale, enable_mood_notes, mood_reminder_time, show_mood_on_calendar",
        )
        .eq("id", user.id)
        .limit(1),
      insforge.database
        .from("mood_levels")
        .select("id, label, emoji, color, value, sort_order")
        .eq("user_id", user.id)
        .order("value", { ascending: false }),
      insforge.database
        .from("habit_categories")
        .select("id, name, color, sort_order")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      insforge.database
        .from("habits")
        .select(
          "id, category_id, name, emoji, description, sort_order, active, archived_at, created_at",
        )
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      insforge.database
        .from("habit_completions")
        .select("id, habit_id, date, status")
        .eq("user_id", user.id)
        .order("date", { ascending: true }),
      insforge.database
        .from("mood_entries")
        .select("id, date, mood_value")
        .eq("user_id", user.id)
        .order("date", { ascending: true }),
      insforge.database
        .from("daily_notes")
        .select("id, date, content, created_at")
        .eq("user_id", user.id)
        .order("date", { ascending: true }),
    ]);

    if (profileError || moodLevelError || categoryError || habitError ||
        completionError || moodEntryError || noteError) {
      console.error("[api/data/export]", {
        profile: profileError?.message,
        moodLevels: moodLevelError?.message,
        categories: categoryError?.message,
        habits: habitError?.message,
        completions: completionError?.message,
        moodEntries: moodEntryError?.message,
        notes: noteError?.message,
      });
      return NextResponse.json(
        { success: false, error: "Failed to read your data" },
        { status: 500 },
      );
    }

    const profileRow = Array.isArray(profileRows) ? profileRows[0] : profileRows;

    const payload: ExportPayload = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      profile: profileRow
        ? {
            displayName: profileRow.display_name ?? null,
            trackerTitle: profileRow.tracker_title ?? "",
            welcomeMessage: profileRow.welcome_message ?? "",
            bioNote: profileRow.bio_note ?? null,
            themeMode: profileRow.theme_mode ?? "light",
            colorTheme: profileRow.color_theme ?? "lavender",
            customTheme: profileRow.custom_theme ?? null,
            weekStartsOn: profileRow.week_starts_on ?? 1,
            defaultReminderTime: profileRow.default_reminder_time ?? "08:00",
            defaultFrequency: profileRow.default_frequency ?? "daily",
            showCompletedHabits: profileRow.show_completed_habits ?? true,
            compactHabitView: profileRow.compact_habit_view ?? false,
            notifyHabit: profileRow.notify_habit ?? true,
            notifyDailySummary: profileRow.notify_daily_summary ?? true,
            notifyMood: profileRow.notify_mood ?? true,
            notifyStreak: profileRow.notify_streak ?? true,
            notifyMissed: profileRow.notify_missed ?? false,
            moodScale: profileRow.mood_scale ?? 6,
            enableMoodNotes: profileRow.enable_mood_notes ?? true,
            moodReminderTime: profileRow.mood_reminder_time ?? "21:00",
            showMoodOnCalendar: profileRow.show_mood_on_calendar ?? true,
          }
        : null,
      moodLevels: (moodLevelRows ?? []).map(
        (m: { id: string; label: string; emoji: string; color: string; value: number; sort_order: number }) => ({
          id: m.id,
          label: m.label,
          emoji: m.emoji,
          color: m.color,
          value: m.value,
          sortOrder: m.sort_order,
        }),
      ),
      categories: (categoryRows ?? []).map(
        (c: { id: string; name: string; color: string; sort_order: number }) => ({
          id: c.id,
          name: c.name,
          color: c.color,
          sortOrder: c.sort_order,
        }),
      ),
      habits: (habitRows ?? []).map(
        (h: { id: string; category_id: string | null; name: string; emoji: string; description: string | null; sort_order: number; active: boolean; archived_at: string | null; created_at: string | null }) => ({
          id: h.id,
          categoryId: h.category_id,
          name: h.name,
          emoji: h.emoji,
          description: h.description,
          sortOrder: h.sort_order,
          active: h.active,
          archivedAt: h.archived_at,
          createdAt: h.created_at,
        }),
      ),
      completions: (completionRows ?? []).map(
        (c: { id: string; habit_id: string; date: string; status: string }) => ({
          id: c.id,
          habitId: c.habit_id,
          date: c.date,
          status: c.status as ExportPayload["completions"][number]["status"],
        }),
      ),
      moodEntries: (moodEntryRows ?? []).map(
        (m: { id: string; date: string; mood_value: number }) => ({
          id: m.id,
          date: m.date,
          moodValue: m.mood_value,
        }),
      ),
      notes: (noteRows ?? []).map(
        (n: { id: string; date: string; content: string; created_at: string | null }) => ({
          id: n.id,
          date: n.date,
          content: n.content,
          createdAt: n.created_at,
        }),
      ),
    };

    const isBackup = new URL(request.url).searchParams.get("backup") === "1";
    const filename = isBackup ? backupFilename() : exportFilename();

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/data/export]", error);
    return NextResponse.json(
      { success: false, error: "Failed to export data" },
      { status: 500 },
    );
  }
}
