"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteHabit } from "@/actions/habits";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { Button } from "@/components/ui/Button";
import { HabitIcon } from "@/components/ui/HabitIcon";
import type { GridCategory, GridHabit } from "@/lib/habits-data";
import type { SettingsCategory, SettingsHabit } from "@/lib/settings-data";

type ManageHabitsCardProps = {
  habits: SettingsHabit[];
  categories: SettingsCategory[];
};

export function ManageHabitsCard({
  habits: initialHabits,
  categories,
}: ManageHabitsCardProps) {
  const [habits, setHabits] = useState<GridHabit[]>(() =>
    initialHabits.map((h) => ({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      description: h.description,
      categoryId: h.categoryId,
      reminderTime: h.reminderTime,
      sortOrder: h.sortOrder,
      active: h.active,
    })),
  );
  const [formHabit, setFormHabit] = useState<GridHabit | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Render-phase re-sync from revalidated props (HabitsView pattern).
  const [prevInitial, setPrevInitial] = useState(initialHabits);
  if (prevInitial !== initialHabits) {
    setPrevInitial(initialHabits);
    setHabits(
      initialHabits.map((h) => ({
        id: h.id,
        name: h.name,
        emoji: h.emoji,
        description: h.description,
        categoryId: h.categoryId,
        reminderTime: h.reminderTime,
        sortOrder: h.sortOrder,
        active: h.active,
      })),
    );
  }

  const gridCategories: GridCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
  }));

  const openAdd = () => {
    setFormHabit(null);
    setFormOpen(true);
  };

  const openEdit = (habit: GridHabit) => {
    setFormHabit(habit);
    setFormOpen(true);
  };

  const handleDelete = async (habitId: string) => {
    setSaving(true);
    setError(null);
    const result = await deleteHabit(habitId);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to delete habit");
      return;
    }
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setConfirmDeleteId(null);
  };

  const sorted = [...habits].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  const categoryName = (id: string | null) =>
    id ? categories.find((c) => c.id === id)?.name ?? null : null;

  return (
    <SettingsSection
      title="Habits"
      description="Update or remove your habits."
      action={
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add Habit
        </Button>
      }
    >
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-sm text-text-muted">
            No habits yet. Add one to start tracking.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map((habit) => {
              if (confirmDeleteId === habit.id) {
                return (
                  <li
                    key={habit.id}
                    className="rounded-lg border border-error/40 bg-error-light p-3"
                  >
                    <p className="text-sm text-text">
                      Delete “{habit.name}”? Its completion history will be
                      removed too.
                    </p>
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={saving}
                      >
                        Keep
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(habit.id)}
                        disabled={saving}
                      >
                        {saving ? "Deleting…" : "Delete"}
                      </Button>
                    </div>
                  </li>
                );
              }

              const cat = categoryName(habit.categoryId);
              return (
                <li
                  key={habit.id}
                  className="flex items-center gap-3 py-2"
                >
                  <HabitIcon emoji={habit.emoji} name={habit.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        habit.active
                          ? "truncate text-sm font-medium text-text"
                          : "truncate text-sm font-medium text-text-muted"
                      }
                    >
                      {habit.name}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {habit.active ? (cat ?? "No category") : "Archived"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Edit ${habit.name}`}
                    onClick={() => openEdit(habit)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${habit.name}`}
                    onClick={() => {
                      setConfirmDeleteId(habit.id);
                      setError(null);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted hover:bg-error-light hover:text-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {error ? (
          <p className="text-xs text-error-foreground" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {formOpen && (
        <HabitFormModal
          habit={formHabit}
          categories={gridCategories}
          onClose={() => setFormOpen(false)}
          onLocalMutate={(mutator) => setHabits(mutator)}
        />
      )}
    </SettingsSection>
  );
}
