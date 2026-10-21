import { cn } from "@/lib/utils";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * The ONE save-status line in the app.
 *
 * `components/settings/SaveStatusLine.tsx` and the private
 * `PersistStatusLine` inside `AppearanceCard.tsx` were near-identical
 * copies with slightly different copy. Both now render this component.
 *
 * The key on the paragraph remounts it when the status changes, so each
 * state fades in instead of swapping text abruptly.
 */
export function SaveStatusLine({
  status,
  idle,
  error,
  className,
}: {
  status: SaveStatus;
  /** Text shown while idle. */
  idle: string;
  /** Optional error detail shown in the error state. */
  error?: string | null;
  className?: string;
}) {
  const content =
    status === "saving"
      ? "Saving to profile…"
      : status === "saved"
        ? "Saved to your profile"
        : status === "error"
          ? (error ?? "Couldn't save — changes stay on this page only.")
          : idle;

  return (
    <p
      key={status}
      role={status === "error" ? "alert" : status === "idle" ? undefined : "status"}
      className={cn(
        "status-in text-xs",
        status === "saved" && "text-success-foreground",
        status === "error" && "text-error-foreground",
        status !== "saved" && status !== "error" && "text-text-muted",
        className,
      )}
    >
      {content}
    </p>
  );
}
