"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { ColorTheme, ThemeMode, ActionResult } from "@/types";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const COLOR_THEMES: ColorTheme[] = [
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
];

const NAME_MAX = 50;

export async function saveProfile(input: {
  displayName: string;
}): Promise<ActionResult> {
  try {
    if (typeof input.displayName !== "string") {
      return { success: false, error: "Invalid profile value" };
    }
    const displayName = input.displayName.trim();
    if (displayName.length > NAME_MAX) {
      return { success: false, error: `Name must be ${NAME_MAX} characters or less` };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await insforge.database.from("profiles").upsert(
      {
        id: user.id,
        display_name: displayName === "" ? null : displayName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("[actions/settings/saveProfile]", error.message);
      return { success: false, error: "Failed to save profile" };
    }

    revalidatePath("/settings");
    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error("[actions/settings/saveProfile]", error);
    return { success: false, error: "Failed to save profile" };
  }
}

export async function saveAppearance(input: {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
}): Promise<ActionResult> {
  try {
    if (!THEME_MODES.includes(input.themeMode)) {
      return { success: false, error: "Invalid theme mode" };
    }
    if (!COLOR_THEMES.includes(input.colorTheme)) {
      return { success: false, error: "Invalid color theme" };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await insforge.database.from("profiles").upsert(
      {
        id: user.id,
        theme_mode: input.themeMode,
        color_theme: input.colorTheme,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("[actions/settings/saveAppearance]", error.message);
      return { success: false, error: "Failed to save appearance" };
    }

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("[actions/settings/saveAppearance]", error);
    return { success: false, error: "Failed to save appearance" };
  }
}

/**
 * The one habit preference that actually changes something: where the week
 * starts. It is read by four surfaces — the Home week strip, the Habits
 * grid, the Stats weekly buckets and the Calendar layout.
 *
 * The other preference columns (`default_reminder_time`,
 * `default_frequency`, `show_completed_habits`, `compact_habit_view`) were
 * saved but never read by any surface. They were removed from the UI rather
 * than left as switches that do nothing.
 */
export async function saveHabitPreferences(input: {
  weekStartsOn: number;
}): Promise<ActionResult> {
  try {
    if (
      !Number.isInteger(input.weekStartsOn) ||
      input.weekStartsOn < 0 ||
      input.weekStartsOn > 6
    ) {
      return { success: false, error: "Invalid week start" };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await insforge.database.from("profiles").upsert(
      {
        id: user.id,
        week_starts_on: input.weekStartsOn,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("[actions/settings/saveHabitPreferences]", error.message);
      return { success: false, error: "Failed to save preferences" };
    }

    revalidatePath("/settings");
    /* `week_starts_on` is read by four surfaces — the Home week strip, the
       Habits grid, the Stats weekly buckets and the Calendar layout. Only
       invalidating /settings left the other three showing the old week
       start until a hard reload. */
    revalidatePath("/home");
    revalidatePath("/habits");
    revalidatePath("/stats");
    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("[actions/settings/saveHabitPreferences]", error);
    return { success: false, error: "Failed to save preferences" };
  }
}

export async function saveMoodSettings(input: {
  enableMoodNotes: boolean;
  showMoodOnCalendar: boolean;
}): Promise<ActionResult> {
  try {
    if (
      typeof input.enableMoodNotes !== "boolean" ||
      typeof input.showMoodOnCalendar !== "boolean"
    ) {
      return { success: false, error: "Invalid mood setting value" };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await insforge.database.from("profiles").upsert(
      {
        id: user.id,
        enable_mood_notes: input.enableMoodNotes,
        show_mood_on_calendar: input.showMoodOnCalendar,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("[actions/settings/saveMoodSettings]", error.message);
      return { success: false, error: "Failed to save mood settings" };
    }

    revalidatePath("/settings");
    revalidatePath("/mood");
    revalidatePath("/calendar");
    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error("[actions/settings/saveMoodSettings]", error);
    return { success: false, error: "Failed to save mood settings" };
  }
}

export async function loadAppearance(): Promise<{
  success: boolean;
  themeMode?: ThemeMode;
  colorTheme?: ColorTheme;
  error?: string;
}> {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data, error } = await insforge.database
      .from("profiles")
      .select("theme_mode, color_theme")
      .eq("id", user.id)
      .limit(1);

    if (error) {
      console.error("[actions/settings/loadAppearance]", error.message);
      return { success: false, error: "Failed to load appearance" };
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      return { success: true, themeMode: "light", colorTheme: "lavender" };
    }

    return {
      success: true,
      themeMode: (row.theme_mode as ThemeMode) ?? "light",
      colorTheme: (row.color_theme as ColorTheme) ?? "lavender",
    };
  } catch (error) {
    console.error("[actions/settings/loadAppearance]", error);
    return { success: false, error: "Failed to load appearance" };
  }
}
