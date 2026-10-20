"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import { Button } from "@/components/ui/Button";
import type { TourStep } from "@/components/tour/tour-steps";

export type TourRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  /** Convenience: `left + width`. */
  right: number;
  /** Convenience: `top + height`. */
  bottom: number;
};

type TourOverlayProps = {
  step: TourStep;
  rect: TourRect | null;
  index: number;
  total: number;
  onNext: () => void;
  onBack: () => void;
  onEnd: () => void;
};

const CARD_WIDTH = 352;
const GAP = 14;
const EDGE = 12;

/**
 * The spotlight.
 *
 * One element does both jobs: the element is placed exactly over the
 * target and carries a huge `box-shadow` spread, so everything OUTSIDE
 * the target is dimmed and the target itself stays bright. A second,
 * transparent full-screen layer above it swallows clicks, so a tour in
 * progress cannot be clicked through.
 *
 * Both layers are portalled to `document.body`: the app shell is an
 * `isolate` stacking context, so an overlay rendered inside it would be
 * painted under the Radix popovers (which portal to the body themselves).
 */
export function TourOverlay({
  step,
  rect,
  index,
  total,
  onNext,
  onBack,
  onEnd,
}: TourOverlayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const prefersReducedMotion = useReducedMotion();

  /* The portal needs a real document. `useSyncExternalStore` is the
     client-only pattern that does it without a setState-in-effect. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Place the card next to the spotlight: try the preferred side first,
  // then the opposite one, and fall back to the preferred side (clamped)
  // if neither fits without covering the target.
  useLayoutEffect(() => {
    if (!rect) return;
    const card = cardRef.current;
    const width = card?.offsetWidth ?? CARD_WIDTH;
    const height = card?.offsetHeight ?? 190;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const candidates: Array<{ top: number; left: number }> = [];
    const push = (top: number, left: number) => {
      candidates.push({ top, left });
    };

    const preferred = step.placement ?? "bottom";
    const opposite: Record<string, string> = {
      bottom: "top",
      top: "bottom",
      right: "left",
      left: "right",
    };

    for (const placement of [preferred, opposite[preferred]]) {
      let top: number;
      let left: number;
      switch (placement) {
        case "top":
          top = rect.top - height - GAP;
          left = rect.left;
          break;
        case "right":
          top = rect.top;
          left = rect.right + GAP;
          break;
        case "left":
          top = rect.top;
          left = rect.left - width - GAP;
          break;
        default:
          top = rect.bottom + GAP;
          left = rect.left;
          break;
      }
      push(top, left);
    }

    const fits = (candidate: { top: number; left: number }) =>
      candidate.top >= EDGE &&
      candidate.left >= EDGE &&
      candidate.top + height <= vh - EDGE &&
      candidate.left + width <= vw - EDGE;

    const overlaps = (candidate: { top: number; left: number }) =>
      !(
        candidate.left + width <= rect.left - GAP ||
        candidate.left >= rect.right + GAP ||
        candidate.top + height <= rect.top - GAP ||
        candidate.top >= rect.bottom + GAP
      );

    const chosen =
      candidates.find((c) => fits(c) && !overlaps(c)) ??
      candidates.find((c) => fits(c)) ??
      candidates[0];

    // Clamp the chosen position into the viewport.
    let top = chosen.top;
    let left = chosen.left;
    if (top + height > vh - EDGE) top = Math.max(EDGE, vh - height - EDGE);
    if (top < EDGE) top = EDGE;
    if (left + width > vw - EDGE) left = Math.max(EDGE, vw - width - EDGE);
    if (left < EDGE) left = EDGE;

    // Last resort: a target too wide for any side (a full-width card).
    // Pin the tour card to the bottom of the viewport instead of letting it
    // cover the thing it is pointing at.
    if (overlaps({ top, left })) {
      top = Math.max(EDGE, vh - height - EDGE);
      left = EDGE;
    }

    setPosition({ top, left });
  }, [rect, step.id, step.placement]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEnd();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnd, onNext, onBack]);

  if (!mounted) return null;

  const isLast = index === total - 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[90]"
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
    >
      {/* Click shield — swallows every click outside the tour card. */}
      <div className="absolute inset-0" aria-hidden />

      {/* Spotlight: a hole in the dim, drawn with a huge box-shadow. */}
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-xl ring-2 ring-primary/80"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: "0 0 0 9999px rgba(9, 6, 20, 0.66)",
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(9, 6, 20, 0.66)" }}
        />
      )}

      <motion.div
        ref={cardRef}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="absolute z-[92] w-[22rem] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-border bg-surface p-4 shadow-pop"
        style={{ top: position.top, left: position.left }}
      >
        <div className="flex items-start gap-3">
          <LumiMascot
            size="sm"
            mood="supportive"
            showDialogue={false}
            interactive={false}
            message="Let me show you around."
            className="-mt-1 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-text-muted">
              Step {index + 1} of {total}
            </div>
            <h2 className="mt-0.5 text-sm font-semibold text-text">
              {step.title}
            </h2>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-text-secondary">
          {step.body}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={onEnd}>
            Skip tour
          </Button>
          <div className="flex items-center gap-2">
            {index > 0 ? (
              <Button variant="secondary" size="sm" onClick={onBack}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
            ) : null}
            <Button size="sm" onClick={onNext}>
              {isLast ? "Done" : "Next"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
