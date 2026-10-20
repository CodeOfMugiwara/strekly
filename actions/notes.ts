"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { ActionResult } from "@/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const noteSchema = z.object({
  date: z.string().regex(DATE_RE, "Invalid date"),
  content: z.string().trim().min(1, "Note is empty").max(2000),
});

export async function saveDayNote(input: {
  date: string;
  content: string;
}): Promise<ActionResult> {
  try {
    const parsed = noteSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid note",
      };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await insforge.database.from("daily_notes").upsert(
      {
        user_id: user.id,
        date: parsed.data.date,
        content: parsed.data.content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,date" },
    );

    if (error) {
      console.error("[actions/notes/saveDayNote]", error.message);
      return { success: false, error: "Failed to save note" };
    }

    revalidatePath("/habits");
    revalidatePath("/calendar");
    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error("[actions/notes/saveDayNote]", error);
    return { success: false, error: "Failed to save note" };
  }
}

export async function deleteDayNote(date: string): Promise<ActionResult> {
  try {
    if (!DATE_RE.test(date)) return { success: false, error: "Invalid date" };

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await insforge.database
      .from("daily_notes")
      .delete()
      .eq("user_id", user.id)
      .eq("date", date);

    if (error) {
      console.error("[actions/notes/deleteDayNote]", error.message);
      return { success: false, error: "Failed to delete note" };
    }

    revalidatePath("/habits");
    revalidatePath("/calendar");
    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error("[actions/notes/deleteDayNote]", error);
    return { success: false, error: "Failed to delete note" };
  }
}

