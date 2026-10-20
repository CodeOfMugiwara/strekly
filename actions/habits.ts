"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createInsforgeServer } from "@/lib/insforge-server";
import { habitFormSchema, type HabitFormInput } from "@/lib/habit-form";
import type { ActionResult } from "@/types";

function revalidateHabits() {
  revalidatePath("/habits");
  revalidatePath("/home");
  revalidatePath("/settings");
  /* Stats lists habit names, sort order and category colours, and the
     Calendar renders the same habit set — both were left stale when a
     habit was created, renamed, archived or deleted. */
  revalidatePath("/stats");
  revalidatePath("/calendar");
}

export async function createHabit(input: HabitFormInput): Promise<
  ActionResult & { id?: string }
> {
  try {
    const parsed = habitFormSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid habit",
      };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data: last, error: lastError } = await insforge.database
      .from("habits")
      .select("sort_order")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: false })
      .limit(1);

    if (lastError) {
      console.error("[actions/habits/createHabit] last:", lastError.message);
      return { success: false, error: "Failed to load habits" };
    }

    const lastRow = Array.isArray(last) ? last[0] : last;
    const nextOrder = lastRow ? Number(lastRow.sort_order) + 1 : 0;

    const { data: created, error } = await insforge.database
      .from("habits")
      .insert({
        user_id: user.id,
        name: parsed.data.name,
        emoji: parsed.data.emoji,
        description: parsed.data.description,
        category_id: parsed.data.categoryId ?? null,
        reminder_time: parsed.data.reminderTime ?? null,
        sort_order: nextOrder,
        active: true,
      })
      .select("id")
      .limit(1);

    if (error) {
      console.error("[actions/habits/createHabit]", error.message);
      return { success: false, error: "Failed to create habit" };
    }

    revalidateHabits();
    const row = Array.isArray(created) ? created[0] : created;
    return { success: true, id: row?.id };
  } catch (error) {
    console.error("[actions/habits/createHabit]", error);
    return { success: false, error: "Failed to create habit" };
  }
}

export async function updateHabit(
  habitId: string,
  input: HabitFormInput,
): Promise<ActionResult> {
  try {
    if (!habitId) return { success: false, error: "Invalid habit" };
    const parsed = habitFormSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid habit",
      };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await insforge.database
      .from("habits")
      .update({
        name: parsed.data.name,
        emoji: parsed.data.emoji,
        description: parsed.data.description,
        category_id: parsed.data.categoryId ?? null,
        reminder_time: parsed.data.reminderTime ?? null,
      })
      .eq("id", habitId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[actions/habits/updateHabit]", error.message);
      return { success: false, error: "Failed to update habit" };
    }

    revalidateHabits();
    return { success: true };
  } catch (error) {
    console.error("[actions/habits/updateHabit]", error);
    return { success: false, error: "Failed to update habit" };
  }
}

export async function setHabitArchived(
  habitId: string,
  archived: boolean,
): Promise<ActionResult> {
  try {
    if (!habitId) return { success: false, error: "Invalid habit" };

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await insforge.database
      .from("habits")
      .update({
        active: !archived,
        archived_at: archived ? new Date().toISOString() : null,
      })
      .eq("id", habitId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[actions/habits/setHabitArchived]", error.message);
      return { success: false, error: "Failed to archive habit" };
    }

    revalidateHabits();
    return { success: true };
  } catch (error) {
    console.error("[actions/habits/setHabitArchived]", error);
    return { success: false, error: "Failed to archive habit" };
  }
}

export async function deleteHabit(habitId: string): Promise<ActionResult> {
  try {
    if (!habitId) return { success: false, error: "Invalid habit" };

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await insforge.database
      .from("habits")
      .delete()
      .eq("id", habitId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[actions/habits/deleteHabit]", error.message);
      return { success: false, error: "Failed to delete habit" };
    }

    revalidateHabits();
    return { success: true };
  } catch (error) {
    console.error("[actions/habits/deleteHabit]", error);
    return { success: false, error: "Failed to delete habit" };
  }
}

const reorderSchema = z.array(z.string().uuid()).min(1).max(200);

export async function reorderHabits(orderedIds: string[]): Promise<ActionResult> {
  try {
    const parsed = reorderSchema.safeParse(orderedIds);
    if (!parsed.success) {
      return { success: false, error: "Invalid order" };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    for (let i = 0; i < parsed.data.length; i++) {
      const { error } = await insforge.database
        .from("habits")
        .update({ sort_order: i })
        .eq("id", parsed.data[i])
        .eq("user_id", user.id);
      if (error) {
        console.error("[actions/habits/reorderHabits]", error.message);
        return { success: false, error: "Failed to reorder habits" };
      }
    }

    revalidateHabits();
    return { success: true };
  } catch (error) {
    console.error("[actions/habits/reorderHabits]", error);
    return { success: false, error: "Failed to reorder habits" };
  }
}
