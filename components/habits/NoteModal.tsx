"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type NoteModalProps = {
  day: number;
  year: number;
  month: number;
  initialNote: string;
  onSave: (note: string) => void;
  onDelete: () => void;
  onClose: () => void;
};

export function NoteModal({
  day,
  year,
  month,
  initialNote,
  onSave,
  onDelete,
  onClose,
}: NoteModalProps) {
  const [text, setText] = useState(initialNote);

  return (
    <Modal
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={`Note — ${MONTH_NAMES[month]} ${day}, ${year}`}
      footer={
        <>
          {initialNote ? (
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          ) : null}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(text.trim())}>Save</Button>
        </>
      }
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How did this day go?"
        rows={5}
        aria-label="Day note"
      />
    </Modal>
  );
}
