"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { loadMonthMood, loadMoodRange } from "@/lib/mood-data";
import {
  GRAPH_PERIODS,
  getRangeBounds,
  type GraphPeriod,
  type MonthMoodData,
  type MoodRangeData,
} from "@/lib/mood-view";
import type { ActionResult } from "@/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type InsforgeServer = Awaited<ReturnType<typeof createInsforgeServer>>;

/**
 * The mood values this account actually has a face for.
 *
 * The scale is per-account (5, 6 or 7 levels) and lives in `mood_levels`.
 * Validating against a hardcoded 1–7 range accepted a value of 7 on a
 * 6-level scale: it stored fine, matched no `mood_levels` row, and the
 * calendar then rendered no face for that day at all.
 */
async function validMoodValues(
  insforge: InsforgeServer,
  userId: string,
): Promise<Set<number>> {
  const { data, error } = await insforge.database
    .from("mood_levels")
    .select("value")
    .eq("user_id", userId);
  if (error) {
    throw new Error(`mood_levels: ${error.message}`);
  }
  const rows = (Array.isArray(data) ? data : []) as Array<{ value: number }>;
  if (rows.length > 0) return new Set(rows.map((r) => r.value));

  // Account whose scale has not been seeded yet — fall back to the
  // configured profile scale.
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("mood_scale")
    .eq("id", userId)
    .limit(1);
  const row = (Array.isArray(profile) ? profile[0] : profile) as {
    mood_scale?: number;
  } | null;
  const scale = row?.mood_scale ?? 6;
  return new Set(Array.from({ length: scale }, (_, i) => i + 1));
}

/** `redirect()` throws a NEXT_REDIRECT error — it must not be swallowed. */
function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function getMonthMood(
  year: number,
  month: number,
): Promise<{ success: boolean; data?: MonthMoodData; error?: string }> {
  try {
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
      return { success: false, error: "Invalid month" };
    }
    const data = await loadMonthMood(year, month);
    return { success: true, data };
  } catch (error) {
    /* The loader redirects to /login when the session is gone. That throw
       was being caught here and reported as "Failed to load month", so an
       expired session looked like a broken page instead of a login. */
    if (isRedirectError(error)) throw error;
    console.error("[actions/moods/getMonthMood]", error);
    return { success: false, error: "Failed to load month" };
  }
}

export async function getMoodRange(
  period: string,
  year: number,
  month: number,
): Promise<{ success: boolean; data?: MoodRangeData; error?: string }> {
  try {
    if (!GRAPH_PERIODS.includes(period as GraphPeriod)) {
      return { success: false, error: "Invalid period" };
    }
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
      return { success: false, error: "Invalid month" };
    }
    const { fromIso, toIso } = getRangeBounds(period as GraphPeriod, year, month);
    const data = await loadMoodRange(fromIso, toIso);
    return { success: true, data };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[actions/moods/getMoodRange]", error);
    return { success: false, error: "Failed to load range" };
  }
}

export async function setDayMood(input: {
  date: string;
  /** null removes the day's mood entry */
  moodValue: number | null;
}): Promise<ActionResult> {
  try {
    if (!DATE_RE.test(input.date)) {
      return { success: false, error: "Invalid date" };
    }
    if (input.moodValue !== null && !Number.isInteger(input.moodValue)) {
      return { success: false, error: "Invalid mood value" };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    if (input.moodValue !== null) {
      const allowed = await validMoodValues(insforge, user.id);
      if (!allowed.has(input.moodValue)) {
        return { success: false, error: "Invalid mood value" };
      }
    }

    if (input.moodValue === null) {
      const { error } = await insforge.database
        .from("mood_entries")
        .delete()
        .eq("user_id", user.id)
        .eq("date", input.date);

      if (error) {
        console.error("[actions/moods/setDayMood] delete", error.message);
        return { success: false, error: "Failed to remove mood" };
      }
    } else {
      const { error } = await insforge.database.from("mood_entries").upsert(
        {
          user_id: user.id,
          date: input.date,
          mood_value: input.moodValue,
        },
        { onConflict: "user_id,date" },
      );

      if (error) {
        console.error("[actions/moods/setDayMood]", error.message);
        return { success: false, error: "Failed to save mood" };
      }
    }

    // No revalidatePath("/mood") — see note in saveMoodCheckin.
    revalidatePath("/home");
    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("[actions/moods/setDayMood]", error);
    return { success: false, error: "Failed to save mood" };
  }
}
