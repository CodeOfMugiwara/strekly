"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { TourOverlay, type TourRect } from "@/components/tour/TourOverlay";
import { TOUR_SEEN_KEY, TOUR_STEPS, type TourStep } from "@/components/tour/tour-steps";

type TourContextValue = {
  /** True while the tour is on screen. */
  active: boolean;
  /** Start the tour from the beginning (also used by the replay button). */
  start: () => void;
  /** End the tour. */
  stop: () => void;
};

const TourContext = createContext<TourContextValue>({
  active: false,
  start: () => {},
  stop: () => {},
});

export function useTour() {
  return useContext(TourContext);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function findTourElement(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-tour="${id}"]`);
}

/** Wait for an element to appear (a route change can take a moment). */
async function waitForElement(
  id: string,
  timeoutMs: number,
): Promise<HTMLElement | null> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const element = findTourElement(id);
    if (element) return element;
    if (Date.now() > deadline) return null;
    await sleep(100);
  }
}

/** Wait until the router has actually moved to `route`. */
async function waitForRoute(route: string, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    if (window.location.pathname === route) return true;
    if (Date.now() > deadline) return false;
    await sleep(100);
  }
}

function measure(element: HTMLElement): TourRect {
  const box = element.getBoundingClientRect();
  return {
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
    right: box.right,
    bottom: box.bottom,
  };
}

/**
 * The product tour.
 *
 * A spotlight that walks the real app: each step names a route and a
 * `data-tour` target, the tour navigates there, waits for the element,
 * scrolls it into view and spots it. Steps whose target never appears are
 * skipped, so a moved element can never strand a new user.
 *
 * It runs once per browser (a `localStorage` flag) and can be replayed
 * from Settings → About.
 */
export function TourProvider({
  children,
  steps = TOUR_STEPS,
  autoStartPath = "/home",
}: {
  children: React.ReactNode;
  /** Override the step list — used by the QA preview route. */
  steps?: TourStep[];
  /** Route the tour auto-starts on. */
  autoStartPath?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<TourRect | null>(null);

  const targetRef = useRef<HTMLElement | null>(null);
  /** The step the tour was on before this one — used to close what it opened. */
  const previousStepRef = useRef<TourStep | null>(null);

  const step = steps[stepIndex];

  /**
   * Close a surface a step opened (the profile popover). Escape closes a
   * Radix popover; if the panel is still open after it (a surface that
   * ignores Escape), click the trigger again to toggle it shut.
   */
  const closeOpenedSurface = useCallback((surface: TourStep | null) => {
    if (!surface?.open) return;
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    window.setTimeout(() => {
      if (!findTourElement(surface.target)) return;
      findTourElement(surface.open!)?.click();
    }, 250);
  }, []);

  const start = useCallback(() => {
    try {
      window.localStorage.setItem(TOUR_SEEN_KEY, "1");
    } catch {
      /* private mode — the tour simply runs again next time */
    }
    setStepIndex(0);
    setRect(null);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    closeOpenedSurface(step);
    setActive(false);
    setRect(null);
    targetRef.current = null;
  }, [closeOpenedSurface, step]);

  /* Auto-run: the first time this browser reaches the Home page. */
  useEffect(() => {
    if (active) return;
    if (pathname !== autoStartPath) return;
    let seen: string | null = null;
    try {
      seen = window.localStorage.getItem(TOUR_SEEN_KEY);
    } catch {
      seen = "1";
    }
    if (seen) return;
    /* Deferred by a tick: the localStorage read happens after mount, and
       calling setState synchronously inside an effect cascades renders. */
    const timer = window.setTimeout(start, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, autoStartPath, active, start]);

  /* Prepare the current step: navigate, open what it needs, find it, spot it. */
  useEffect(() => {
    if (!active || !step) return;
    let cancelled = false;

    // Close a surface the PREVIOUS step opened (the profile popover).
    const previous = previousStepRef.current;
    previousStepRef.current = step;
    if (previous?.open && !step.open) {
      closeOpenedSurface(previous);
    }

    const run = async () => {
      setRect(null);
      targetRef.current = null;

      if (window.location.pathname !== step.route) {
        router.push(step.route);
      }
      const routeReached = await waitForRoute(step.route, 6000);
      if (cancelled) return;
      if (!routeReached) {
        return;
      }

      // A step may need a transient surface open first (the profile
      // popover — its name field does not exist until it is opened).
      if (step.open) {
        const trigger = await waitForElement(step.open, 4000);
        if (cancelled) return;
        if (trigger) {
          trigger.click();
          await sleep(320);
        }
      }

      const target = await waitForElement(step.target, 6000);
      if (cancelled) return;
      if (!target) {
        // The element is not on this page (a feature moved, a section is
        // not rendered). Skip it rather than stalling the tour.
        setStepIndex((index) =>
          index >= steps.length - 1 ? index : index + 1,
        );
        return;
      }

      targetRef.current = target;
      target.scrollIntoView({
        block: "center",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      await sleep(prefersReducedMotion ? 80 : 420);
      if (cancelled) return;
      setRect(measure(target));
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [active, step, stepIndex, router, prefersReducedMotion, steps.length, closeOpenedSurface]);

  /* Keep the spotlight glued to its target while the page moves. */
  useEffect(() => {
    if (!active) return;
    const update = () => {
      const target = targetRef.current;
      if (!target || !target.isConnected) return;
      setRect(measure(target));
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  const next = useCallback(() => {
    if (stepIndex >= steps.length - 1) {
      stop();
      return;
    }
    setStepIndex((index) => index + 1);
  }, [stepIndex, steps.length, stop]);

  const back = useCallback(() => {
    setStepIndex((index) => Math.max(0, index - 1));
  }, []);

  const value = useMemo(
    () => ({ active, start, stop }),
    [active, start, stop],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {active && step ? (
        <TourOverlay
          step={step}
          rect={rect}
          index={stepIndex}
          total={steps.length}
          onNext={next}
          onBack={back}
          onEnd={stop}
        />
      ) : null}
    </TourContext.Provider>
  );
}
