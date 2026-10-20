"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Route-level error boundary.
 *
 * A failing server loader used to render Next's default error screen, which
 * looks nothing like the app. This keeps the failure inside the app's own
 * visual language and offers a retry.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/(app)/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-surface/90 p-8 text-center shadow-pop">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error-light text-error">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-lg font-semibold text-text">Something went wrong</h1>
        <p className="mt-2 text-sm text-text-secondary">
          We couldn&apos;t load this page. Your data is safe — try again, and if
          it keeps happening, sign out and back in.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[11px] text-text-muted">
            Reference: {error.digest}
          </p>
        ) : null}
        <Button onClick={reset} className="mt-6">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
