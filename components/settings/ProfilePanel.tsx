"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { saveProfile } from "@/actions/settings";
import {
  SaveStatusLine,
  type SaveStatus,
} from "@/components/ui/SaveStatusLine";
import { Input } from "@/components/ui/Input";
import type { SettingsProfile } from "@/lib/settings-data";

const NAME_MAX = 50;
const DEBOUNCE_MS = 500;

type ProfilePanelProps = {
  profile: SettingsProfile;
};

/**
 * Profile name — rendered in the header popover.
 *
 * The name is the one profile field the app actually shows: it drives the
 * Home greeting and the signed-in initials. The former "a little note about
 * you" field was saved but never displayed anywhere, so it was removed
 * instead of being left as a box that quietly disappears.
 */
export function ProfilePanel({ profile }: ProfilePanelProps) {
  const [name, setName] = useState(profile.displayName);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const seqRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef({ name: profile.displayName });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const save = (nextName: string) => {
    const trimmedName = nextName.trim();
    if (trimmedName === lastSavedRef.current.name.trim()) {
      return;
    }
    const seq = ++seqRef.current;
    setStatus("saving");
    void saveProfile({ displayName: nextName }).then((result) => {
      if (seq !== seqRef.current) return;
      if (result.success) {
        lastSavedRef.current = { name: trimmedName };
        setStatus("saved");
      } else {
        setStatus("error");
      }
    });
  };

  const scheduleSave = (nextName: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      save(nextName);
    }, DEBOUNCE_MS);
  };

  const flushSave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    save(name);
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="settings-profile-name"
          className="mb-1.5 block text-xs font-medium text-text-muted"
        >
          Name
        </label>
        <div className="relative">
          <Input
            id="settings-profile-name"
            value={name}
            onChange={(e) => {
              const next = e.target.value.slice(0, NAME_MAX);
              setName(next);
              scheduleSave(next);
            }}
            onBlur={flushSave}
            maxLength={NAME_MAX}
            placeholder="Your name"
            className="pr-9"
          />
          <Pencil
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-text-muted">
          Used for your greeting and your initials.
        </p>
      </div>

      <SaveStatusLine status={status} idle="Changes save automatically." />
    </div>
  );
}
