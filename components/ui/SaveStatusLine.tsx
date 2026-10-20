import { cn } from "@/lib/utils";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * The ONE save-status line in the app.
 *
 * `components/settings/SaveStatusLine.tsx` and the private
 * `PersistStatusLine` inside `AppearanceCard.tsx` were near-identical
 * copies with slightly different copy. Both now render this component.
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
  if (status === "saving") {
    return (
      <p className={cn("text-xs text-text-muted", className)} role="status">
        Saving to profile…
      </p>
    );
  }
  if (status === "saved") {
    return (
      <p
        className={cn("text-xs text-success-foreground", className)}
        role="status"
      >
        Saved to your profile
      </p>
    );
  }
  if (status === "error") {
    return (
      <p
        className={cn("text-xs text-error-foreground", className)}
        role="alert"
      >
        {error ?? "Couldn’t save — changes stay on this page only."}
      </p>
    );
  }
  return <p className={cn("text-xs text-text-muted", className)}>{idle}</p>;
}
