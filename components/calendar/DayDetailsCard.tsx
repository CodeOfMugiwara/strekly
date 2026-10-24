"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { MoodFace } from "@/components/ui/MoodFace";
import { MoodFacePop } from "@/components/ui/MoodFacePop";
import { HabitIcon } from "@/components/ui/HabitIcon";
import { StatusPop } from "@/components/ui/StatusPop";
import { StatusGlyph } from "@/components/ui/StatusGlyph";
import { dayLabel } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { CalendarHabit } from "@/lib/calendar";
import type { HabitStatus } from "@/types";

type DayDetailsCardProps = {
  dateKey: string;
  habits: CalendarHabit[];
  statusMap: Record<string, HabitStatus>;
  moodValue: number | undefined;
  moodLevels: Array<{ value: number; label: string; color: string }>;
  note: string | undefined;
  enableMoodNotes: boolean;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onSaveNote: (dateKey: string, content: string) => Promise<boolean>;
  onDeleteNote: (dateKey: string) => Promise<boolean>;
  onSetMood?: (dateKey: string, value: number | null) => void;
};

function Checkbox({
  status,
}: {
  status: HabitStatus | null;
}) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold shadow-xs transition-colors",
        status === "done" && "border-transparent bg-success text-success-foreground [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.25)]",
        status === "partial" && "border-transparent bg-warning text-warning-foreground [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.25)]",
        status === "missed" && "border-transparent bg-error text-error-foreground [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.25)]",
        !status && "border-border/80 bg-surface",
      )}
    >
      <StatusGlyph status={status} size={12} />
    </span>
  );
}

export function DayDetailsCard({
  dateKey,
  habits,
  statusMap,
  moodValue,
  moodLevels,
  note,
  enableMoodNotes,
  onToggleHabit,
  onPrevDay,
  onNextDay,
  onSaveNote,
  onDeleteNote,
  onSetMood,
}: DayDetailsCardProps) {
  const mood = moodValue
    ? moodLevels.find((l) => l.value === moodValue)
    : undefined;
  const completed = habits.filter(
    (h) => statusMap[h.id] === "done" || statusMap[h.id] === "partial",
  ).length;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note ?? "");
  const [pending, setPending] = useState(false);
  const [focusNonce, setFocusNonce] = useState(0);
  const [lastKey, setLastKey] = useState(dateKey);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  // Render-phase reset when another day is selected (F14 pattern — not an
  // effect: avoids stale draft text carried across days).
  if (lastKey !== dateKey) {
    setLastKey(dateKey);
    setDraft(note ?? "");
    setEditing(false);
    setPending(false);
  }

  useEffect(() => {
    if (focusNonce > 0) noteRef.current?.focus();
  }, [focusNonce, editing]);

  const openEditor = () => {
    if (!enableMoodNotes) return;
    setDraft(note ?? "");
    setEditing(true);
    setFocusNonce((n) => n + 1);
  };

  const handleSave = async () => {
    const content = draft.trim();
    if (!content || pending) return;
    setPending(true);
    const ok = await onSaveNote(dateKey, content);
    setPending(false);
    if (ok) setEditing(false);
  };

  const handleDelete = async () => {
    if (pending) return;
    setPending(true);
    const ok = await onDeleteNote(dateKey);
    setPending(false);
    if (ok) {
      setDraft("");
      setEditing(false);
    }
  };

  const showEditor =
    enableMoodNotes && (!note || editing);
  const showSavedNote = enableMoodNotes && note && !editing;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text">Day Details</h2>
        {enableMoodNotes && (
          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-hover"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Day
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Previous day"
          onClick={onPrevDay}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:bg-surface-hover"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <p className="text-sm font-semibold text-text">{dayLabel(dateKey)}</p>
        <button
          type="button"
          aria-label="Next day"
          onClick={onNextDay}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:bg-surface-hover"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-text-muted">Mood</p>
              {mood && onSetMood && (
                <button
                  type="button"
                  onClick={() => onSetMood(dateKey, null)}
                  className="text-[11px] text-text-muted hover:text-error transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {mood ? (
              <div className="mt-1 flex items-center gap-3">
                <MoodFacePop value={mood.value} color={mood.color} size={40} />
                <div>
                  <p className="text-sm font-semibold text-text">
                    {mood.label}
                  </p>
                  <p className="text-[11px] text-text-muted">Tap a face below to change</p>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-xs text-text-muted">How did you feel this day?</p>
            )}

            {/* Direct 1-tap mood logging buttons */}
            {onSetMood && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {moodLevels.map((level) => {
                  const active = moodValue === level.value;
                  return (
                    <button
                      key={level.value}
                      type="button"
                      aria-label={`Set mood: ${level.label}`}
                      onClick={() => onSetMood(dateKey, active ? null : level.value)}
                      title={level.label}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all",
                        "hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        active
                          ? "border-primary bg-primary-lightest font-medium text-primary-text shadow-xs"
                          : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:bg-surface-hover",
                      )}
                    >
                      <MoodFace value={level.value} color={level.color} size={18} />
                      <span className="text-[11px]">{level.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {enableMoodNotes && (
            <div>
              <p className="text-xs font-medium text-text-muted">Note</p>
              {showSavedNote && (
                <div className="mt-2 rounded-lg border border-border bg-surface p-3">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {note}
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={openEditor}
                      className="text-xs font-medium text-primary-text hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
              {showEditor && (
                <div className="mt-2">
                  <textarea
                    ref={noteRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={4}
                    placeholder="Write a note for this day…"
                    className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div>
                      {note && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={pending}
                          className="text-xs font-medium text-error hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {note && (
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          disabled={pending}
                          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-hover disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={pending || !draft.trim()}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-on hover:brightness-95 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text">
              Habits{" "}
              <span className="font-normal text-text-muted">
                ({completed} / {habits.length} completed)
              </span>
            </h3>
          </div>
          {habits.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">
              No habits yet — add one from the Habits page.
            </p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {habits.map((habit) => (
                <li key={habit.id}>
                  <button
                    type="button"
                    onClick={() => onToggleHabit(habit.id, dateKey)}
                    className="flex w-full items-center gap-2.5 rounded-md p-0.5 text-left hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <StatusPop status={statusMap[habit.id] ?? "unset"}>
                      <Checkbox status={statusMap[habit.id] ?? null} />
                    </StatusPop>
                    <HabitIcon
                      emoji={habit.emoji}
                      name={habit.name}
                      size={30}
                    />
                    <span className="text-sm text-text">{habit.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}
