"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { ActionResult, HabitStatus } from "@/types";

const STATUSES: HabitStatus[] = ["done", "partial", "missed"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function setHabitCompletion(input: {
  habitId: string;
  date: string;
  status: HabitStatus | null;
}): Promise<ActionResult> {
  try {
    if (!input.habitId || typeof input.habitId !== "string") {
      return { success: false, error: "Invalid habit" };
    }
    if (!DATE_RE.test(input.date)) {
      return { success: false, error: "Invalid date" };
    }
    if (input.status !== null && !STATUSES.includes(input.status)) {
      return { success: false, error: "Invalid status" };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: habit, error: habitError } = await insforge.database
      .from("habits")
      .select("id")
      .eq("id", input.habitId)
      .eq("user_id", user.id)
      .limit(1);

    if (habitError) {
      console.error("[actions/completions/setHabitCompletion]", habitError.message);
      return { success: false, error: "Failed to load habit" };
    }
    const habitRow = Array.isArray(habit) ? habit[0] : habit;
    if (!habitRow) {
      return { success: false, error: "Habit not found" };
    }

    if (input.status === null) {
      const { error } = await insforge.database
        .from("habit_completions")
        .delete()
        .eq("habit_id", input.habitId)
        .eq("date", input.date)
        .eq("user_id", user.id);

      if (error) {
        console.error("[actions/completions/setHabitCompletion]", error.message);
        return { success: false, error: "Failed to clear status" };
      }
    } else {
      const { error } = await insforge.database.from("habit_completions").upsert(
        {
          user_id: user.id,
          habit_id: input.habitId,
          date: input.date,
          status: input.status,
        },
        { onConflict: "habit_id,date" },
      );

      if (error) {
        console.error("[actions/completions/setHabitCompletion]", error.message);
        return { success: false, error: "Failed to save status" };
      }
    }

    revalidatePath("/home");
    revalidatePath("/habits");
    revalidatePath("/stats");
    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("[actions/completions/setHabitCompletion]", error);
    return { success: false, error: "Failed to save status" };
  }
}
