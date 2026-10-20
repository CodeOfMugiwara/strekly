"use client";

import { useState } from "react";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { createHabit, updateHabit, setHabitArchived, deleteHabit } from "@/actions/habits";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { GridCategory, GridHabit } from "@/lib/habits-data";

type HabitFormModalProps = {
  /** null = add mode */
  habit: GridHabit | null;
  categories: GridCategory[];
  onClose: () => void;
  onLocalMutate: (mutator: (habits: GridHabit[]) => GridHabit[]) => void;
};

export function HabitFormModal({
  habit,
  categories,
  onClose,
  onLocalMutate,
}: HabitFormModalProps) {
  const [name, setName] = useState(habit?.name ?? "");
  const [emoji, setEmoji] = useState(habit?.emoji ?? "");
  const [description, setDescription] = useState(habit?.description ?? "");
  const [categoryId, setCategoryId] = useState(habit?.categoryId ?? "");
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEdit = habit !== null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError(null);

    const input = {
      name: name.trim(),
      emoji: emoji.trim(),
      description: description.trim(),
      categoryId: categoryId || null,
      reminderTime: reminderTime || null,
    };

    if (!isEdit) {
      const result = await createHabit(input);
      setSaving(false);
      if (!result.success) {
        setError(result.error ?? "Failed to create habit");
        return;
      }
      if (result.id) {
        onLocalMutate((prev) => [
          ...prev,
          {
            id: result.id!,
            name: input.name,
            emoji: input.emoji || "📝",
            description: input.description,
            categoryId: input.categoryId,
            reminderTime: input.reminderTime,
            sortOrder: prev.length,
            active: true,
          },
        ]);
      }
      onClose();
      return;
    }

    const result = await updateHabit(habit!.id, input);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to update habit");
      return;
    }
    onLocalMutate((prev) =>
      prev.map((h) =>
        h.id === habit!.id
          ? {
              ...h,
              name: input.name,
              emoji: input.emoji || "📝",
              description: input.description,
              categoryId: input.categoryId,
              reminderTime: input.reminderTime,
            }
          : h,
      ),
    );
    onClose();
  };

  const handleArchiveToggle = async () => {
    if (!habit) return;
    setSaving(true);
    setError(null);

    const result = await setHabitArchived(habit.id, habit.active);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to archive habit");
      return;
    }
    onLocalMutate((prev) =>
      prev.map((h) =>
        h.id === habit.id ? { ...h, active: !habit.active } : h,
      ),
    );
    onClose();
  };

  const handleDelete = async () => {
    if (!habit) return;
    setSaving(true);
    setError(null);

    const result = await deleteHabit(habit.id);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to delete habit");
      return;
    }
    onLocalMutate((prev) => prev.filter((h) => h.id !== habit.id));
    onClose();
  };

  return (
    <Modal
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={isEdit ? `Edit — ${habit.name}` : "Add a New Habit"}
      footer={
        confirmDelete ? (
          <div className="w-full">
            <p className="text-sm text-text">
              Delete “{habit?.name}” forever? Its check-ins will be removed
              too. This cannot be undone.
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmDelete(false)}
                disabled={saving}
              >
                Keep
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting…" : "Delete forever"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isEdit ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleArchiveToggle}
                    disabled={saving}
                  >
                    {habit.active ? (
                      <>
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restore
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error-light"
                    onClick={() => setConfirmDelete(true)}
                    disabled={saving}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-3">
        <div>
          <label
            htmlFor="habit-name"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Name <span className="text-error">*</span>
          </label>
          <Input
            id="habit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Drink Water"
            maxLength={100}
            aria-invalid={error === "Name is required"}
            aria-describedby={error ? "habit-form-error" : undefined}
          />
        </div>

        <div>
          <label
            htmlFor="habit-emoji"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Emoji
          </label>
          <Input
            id="habit-emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="💧"
            maxLength={8}
          />
        </div>

        <div>
          <label
            htmlFor="habit-desc"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Description
          </label>
          <Textarea
            id="habit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 8 glasses daily"
            rows={2}
            maxLength={500}
          />
        </div>

        <div>
          <label
            htmlFor="habit-category"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Category
          </label>
          <select
            id="habit-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="habit-reminder-time"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Planned time
          </label>
          <input
            id="habit-reminder-time"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <p className="mt-1 text-xs text-text-muted">
            A planned time of day for this habit. Display only — no notifications
            are sent.
          </p>
        </div>
      </div>

      {error ? (
        <p
          id="habit-form-error"
          className="mt-3 text-xs text-error-foreground"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
