"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  categoryFormSchema,
  type CategoryFormInput,
} from "@/lib/category-form";
import type { ActionResult } from "@/types";

function revalidateCategories() {
  revalidatePath("/settings");
  revalidatePath("/habits");
  /* The Stats habit-rate bars are coloured by category. */
  revalidatePath("/stats");
}

export async function createCategory(
  input: CategoryFormInput,
): Promise<ActionResult & { id?: string }> {
  try {
    const parsed = categoryFormSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid category",
      };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data: last, error: lastError } = await insforge.database
      .from("habit_categories")
      .select("sort_order")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: false })
      .limit(1);

    if (lastError) {
      console.error("[actions/categories/createCategory] last:", lastError.message);
      return { success: false, error: "Failed to load categories" };
    }

    const lastRow = Array.isArray(last) ? last[0] : last;
    const nextOrder = lastRow ? Number(lastRow.sort_order) + 1 : 0;

    const { data: created, error } = await insforge.database
      .from("habit_categories")
      .insert({
        user_id: user.id,
        name: parsed.data.name,
        color: parsed.data.color,
        sort_order: nextOrder,
      })
      .select("id")
      .limit(1);

    if (error) {
      console.error("[actions/categories/createCategory]", error.message);
      return { success: false, error: "Failed to create category" };
    }

    revalidateCategories();
    const row = Array.isArray(created) ? created[0] : created;
    return { success: true, id: row?.id };
  } catch (error) {
    console.error("[actions/categories/createCategory]", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  categoryId: string,
  input: CategoryFormInput,
): Promise<ActionResult> {
  try {
    if (!categoryId) return { success: false, error: "Invalid category" };
    const parsed = categoryFormSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid category",
      };
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await insforge.database
      .from("habit_categories")
      .update({
        name: parsed.data.name,
        color: parsed.data.color,
      })
      .eq("id", categoryId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[actions/categories/updateCategory]", error.message);
      return { success: false, error: "Failed to update category" };
    }

    revalidateCategories();
    return { success: true };
  } catch (error) {
    console.error("[actions/categories/updateCategory]", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  try {
    if (!categoryId) return { success: false, error: "Invalid category" };

    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await insforge.database
      .from("habit_categories")
      .delete()
      .eq("id", categoryId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[actions/categories/deleteCategory]", error.message);
      return { success: false, error: "Failed to delete category" };
    }

    revalidateCategories();
    return { success: true };
  } catch (error) {
    console.error("[actions/categories/deleteCategory]", error);
    return { success: false, error: "Failed to delete category" };
  }
}
