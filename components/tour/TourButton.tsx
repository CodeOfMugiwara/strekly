"use client";

import { Compass } from "lucide-react";
import { useTour } from "@/components/tour/TourProvider";
import { Button } from "@/components/ui/Button";

/**
 * Replays the product tour. The tour auto-runs once per browser, so this
 * is the only way back into it afterwards.
 */
export function TourButton() {
  const { start, active } = useTour();

  return (
    <Button
      variant="secondary"
      size="sm"
      data-tour="settings-tour"
      onClick={start}
      disabled={active}
    >
      <Compass className="h-3.5 w-3.5" />
      {active ? "Tour running…" : "Take the tour"}
    </Button>
  );
}
