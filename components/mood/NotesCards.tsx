"use client";

import { Card } from "@/components/ui/Card";
import { useState } from "react";

import { ArrowRight } from "lucide-react";
import { saveDayNote, deleteDayNote } from "@/actions/notes";
import { MoodFace } from "@/components/ui/MoodFace";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { MoodLevel, MoodNote } from "@/lib/mood-view";

type NotesCardsProps = {
  year: number;
  month: number;
  selectedDay: number;
  levels: MoodLevel[];
  notes: MoodNote[];
  entries: Record<number, number>;
  enableMoodNotes: boolean;
  onSelectNoteDay?: (day: number) => void;
  onNoteChange: (day: number, content: string | null) => void;
};

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function ViewAllModal({
  notes,
  levels,
  onClose,
}: {
  notes: MoodNote[];
  levels: MoodLevel[];
  onClose: () => void;
}) {
  return (
    <Modal
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title="All Notes"
    >
      <ul className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
        {notes.map((note) => {
          const level = note.value
            ? levels.find((l) => l.value === note.value)
            : null;
          return (
            <li key={note.day} className="flex items-start gap-3">
              {level ? (
                <MoodFace
                  value={level.value}
                  color={level.color}
                  size={32}
                  className="mt-0.5"
                />
              ) : (
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-border text-xs text-text-muted">
                  —
                </span>
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-text">
                  {note.dateLabel}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">{note.content}</p>
              </div>
            </li>
          );
        })}
        {notes.length === 0 ? (
          <li className="py-8 text-center text-sm text-text-muted">
            No notes this month.
          </li>
        ) : null}
      </ul>
    </Modal>
  );
}

export function NotesCards({
  year,
  month,
  selectedDay,
  levels,
  notes,
  entries,
  enableMoodNotes,
  onSelectNoteDay,
  onNoteChange,
}: NotesCardsProps) {
  const selectedNote = notes.find((n) => n.day === selectedDay);
  const selectedValue = entries[selectedDay] ?? null;
  const selectedLevel = selectedValue
    ? levels.find((l) => l.value === selectedValue)
    : null;

  const [text, setText] = useState(selectedNote?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Reset draft when selected day or month changes
  const [prevKey, setPrevKey] = useState(
    `${year}-${month}-${selectedDay}`,
  );
  const syncKey = `${year}-${month}-${selectedDay}`;
  if (prevKey !== syncKey) {
    setPrevKey(syncKey);
    setText(selectedNote?.content ?? "");
    setStatus("idle");
    setError(null);
  }

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    setError(null);
    const key = dateKey(year, month, selectedDay);
    if (!text.trim()) {
      const result = await deleteDayNote(key);
      setSaving(false);
      if (!result.success) {
        setStatus("error");
        setError(result.error ?? "Failed to delete note");
        return;
      }
      onNoteChange(selectedDay, null);
      setStatus("saved");
      return;
    }
    const result = await saveDayNote({ date: key, content: text.trim() });
    setSaving(false);
    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Failed to save note");
      return;
    }
    onNoteChange(selectedDay, text.trim());
    setStatus("saved");
  };

  const recentNotes = notes.slice(0, 3);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Notes for selected day */}
        <Card>
          <h2 className="text-base font-semibold text-text">
            Notes for{" "}
            {new Date(year, month, selectedDay).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
          <div className="mt-3 flex items-start gap-3">
            {selectedLevel ? (
              <MoodFace
                value={selectedLevel.value}
                color={selectedLevel.color}
                size={36}
                className="mt-0.5"
              />
            ) : (
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-border text-text-muted">
                ?
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-text-muted">
                {selectedLevel
                  ? "How did you feel today?"
                  : "No mood logged for this day yet."}
              </p>
              {enableMoodNotes ? (
                <>
                  <Textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setStatus("idle");
                    }}
                    placeholder="What's on your mind?"
                    rows={4}
                    className="mt-2"
                    disabled={saving}
                    aria-label={`Note for day ${selectedDay}`}
                  />
                  <div className="mt-2 flex items-center justify-end gap-3">
                    {status === "saved" ? (
                      <p className="text-xs text-success-foreground" role="status">
                        Saved
                      </p>
                    ) : null}
                    {status === "error" && error ? (
                      <p className="text-xs text-error-foreground" role="alert">
                        {error}
                      </p>
                    ) : null}
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-text-muted">
                  Mood notes are disabled in settings.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Recent Notes */}
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text">Recent Notes</h2>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-text hover:underline"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="mt-3 space-y-3">
            {recentNotes.map((note) => {
              const level = note.value
                ? levels.find((l) => l.value === note.value)
                : null;
              return (
                <li key={note.day}>
                  <button
                    type="button"
                    onClick={() => onSelectNoteDay?.(note.day)}
                    className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-hover"
                  >
                    {level ? (
                      <MoodFace
                        value={level.value}
                        color={level.color}
                        size={32}
                        className="mt-0.5"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text">
                        {note.dateLabel}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
                        {note.content}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
            {recentNotes.length === 0 ? (
              <li className="py-6 text-center text-sm text-text-muted">
                No notes yet this month.
              </li>
            ) : null}
          </ul>
        </Card>
      </div>

      {showAll ? (
        <ViewAllModal
          notes={notes}
          levels={levels}
          onClose={() => setShowAll(false)}
        />
      ) : null}
    </>
  );
}
