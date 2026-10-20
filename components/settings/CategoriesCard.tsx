"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/categories";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CATEGORY_SWATCHES } from "@/lib/category-form";
import { cn } from "@/lib/utils";
import type { SettingsCategory } from "@/lib/settings-data";

function SwatchPicker({
  value,
  onChange,
  idPrefix,
}: {
  value: string;
  onChange: (v: string) => void;
  idPrefix: string;
}) {
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Category color">
      {CATEGORY_SWATCHES.map((swatch) => (
        <button
          key={swatch.value}
          type="button"
          role="radio"
          aria-checked={value === swatch.value}
          aria-label={swatch.name}
          id={`${idPrefix}-${swatch.value}`}
          onClick={() => onChange(swatch.value)}
          className={cn(
            "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
            value === swatch.value
              ? "border-text ring-2 ring-primary/30"
              : "border-transparent",
          )}
          style={{ backgroundColor: swatch.value }}
        />
      ))}
    </div>
  );
}

type CategoriesCardProps = {
  initialCategories: SettingsCategory[];
};

export function CategoriesCard({ initialCategories }: CategoriesCardProps) {
  const [categories, setCategories] =
    useState<SettingsCategory[]>(initialCategories);
  const [addName, setAddName] = useState("");
  const [addColor, setAddColor] = useState<string>(CATEGORY_SWATCHES[0].value);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState<string>(CATEGORY_SWATCHES[0].value);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (category: SettingsCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
    setConfirmDeleteId(null);
    setError(null);
  };

  const handleAdd = async () => {
    if (!addName.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await createCategory({ name: addName.trim(), color: addColor });
    setSaving(false);
    if (!result.success || !result.id) {
      setError(result.error ?? "Failed to create category");
      return;
    }
    setCategories((prev) => [
      ...prev,
      {
        id: result.id!,
        name: addName.trim(),
        color: addColor,
        sortOrder: prev.length,
      },
    ]);
    setAddName("");
    setAddColor(CATEGORY_SWATCHES[0].value);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (!editName.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await updateCategory(editingId, {
      name: editName.trim(),
      color: editColor,
    });
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to update category");
      return;
    }
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? { ...c, name: editName.trim(), color: editColor }
          : c,
      ),
    );
    setEditingId(null);
  };

  const handleDelete = async (categoryId: string) => {
    setSaving(true);
    setError(null);
    const result = await deleteCategory(categoryId);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to delete category");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setConfirmDeleteId(null);
  };

  return (
    <SettingsSection
      title="Categories"
      description="Group your habits however you like."
    >
      <div className="space-y-3">
        {categories.length === 0 && editingId === null ? (
          <p className="text-sm text-text-muted">
            No categories yet. Add one below — habits can then pick it up in
            their form.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((category) => {
              if (editingId === category.id) {
                return (
                  <li
                    key={category.id}
                    className="rounded-lg border border-border bg-surface-muted p-3"
                  >
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category name"
                      maxLength={40}
                      aria-label="Category name"
                      className="mb-2"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <SwatchPicker
                        value={editColor}
                        onChange={setEditColor}
                        idPrefix={`edit-${category.id}`}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit} disabled={saving}>
                          {saving ? "Saving…" : "Save"}
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              }

              if (confirmDeleteId === category.id) {
                return (
                  <li
                    key={category.id}
                    className="rounded-lg border border-error/40 bg-error-light p-3"
                  >
                    <p className="text-sm text-text">
                      Delete “{category.name}”? Habits using it will keep their
                      data but lose this category.
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
                        onClick={() => handleDelete(category.id)}
                        disabled={saving}
                      >
                        {saving ? "Deleting…" : "Delete"}
                      </Button>
                    </div>
                  </li>
                );
              }

              return (
                <li
                  key={category.id}
                  className="flex items-center gap-3 py-2"
                >
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 truncate text-sm text-text">
                    {category.name}
                  </span>
                  <button
                    type="button"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => startEdit(category)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover hover:text-text"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${category.name}`}
                    onClick={() => {
                      setConfirmDeleteId(category.id);
                      setEditingId(null);
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

        <div className="mt-3 flex items-center gap-2">
          <Input
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            placeholder="New category name"
            maxLength={40}
            aria-label="New category name"
            disabled={saving}
          />
          <Button size="sm" onClick={handleAdd} disabled={saving}>
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        <div className="mt-2.5">
          <SwatchPicker
            value={addColor}
            onChange={setAddColor}
            idPrefix="add"
          />
        </div>

        {error ? (
          <p className="mt-3 text-xs text-error-foreground" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </SettingsSection>
  );
}
