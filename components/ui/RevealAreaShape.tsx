"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AreaRevealShape, type AreaRevealShapeProps } from "recharts";

/**
 * Custom Area `shape` factory that owns the chart's entrance + data-change
 * animation WITHOUT touching axes/grid (they are separate Recharts layers):
 *
 * - Entrance (mount / period / month switch): the curve, fill AND dots are
 *   revealed by a single slow left-to-right wipe front (default 3s,
 *   easeOutCubic).
 * - Data change (new/removed/changed point): only a LOCAL band around the
 *   changed index animates — the wipe front sweeps across the band, drawing
 *   the new segment in while erasing the old one; the rest of the line never
 *   moves (default 1.8s).
 *
 * Works by wrapping Recharts' public `AreaRevealShape` (plain curves when
 * `isAnimationActive={false}`) in clipPath groups and rendering the dots
 * ourselves INSIDE the same clips, so dots ride the wipe exactly. The shape
 * self-detects the changed index by diffing consecutive `points` arrays —
 * callers need no extra props.
 *
 * IMPORTANT — component identity:
 * `makeRevealAreaShape()` returns a *component*. If callers invoke it during
 * render, every render produces a new function => a new component type =>
 * React unmounts and remounts the shape => the entrance flag resets and the
 * wipe restarts from zero on every parent re-render. Callers MUST therefore
 * either hoist the factory call to module scope or memoise it (see
 * `useRevealAreaShape`).
 *
 * The animation is driven by direct DOM writes on the clip `<rect>` /
 * `<polygon>` inside the requestAnimationFrame loop, so a 3s entrance costs
 * two React renders (start + end) instead of ~180.
 */

type RevealPoint = {
  x?: number;
  y?: number;
  value?: number | null;
  payload?: unknown;
};

export type RevealDotInput = {
  cx: number;
  cy: number;
  index: number;
  payload: unknown;
};

export type RevealAreaOptions = {
  /** Render one dot circle for a point; return null to skip. */
  dot: (input: RevealDotInput) => ReactNode;
  /** Full-entrance wipe duration (mount / period / month switch). */
  entranceDuration?: number;
  /** Local band wipe duration on data change. */
  bandDuration?: number;
  /** Horizontal padding so edge dots aren't clipped by the wipe span. */
  padX?: number;
};

const REDUCED_BRIDGE = 60;

function xSpan(pts: RevealPoint[], padX: number) {
  const xs = pts
    .map((p) => p.x)
    .filter((x): x is number => typeof x === "number" && Number.isFinite(x));
  if (xs.length < 2) return null;
  return { min: Math.min(...xs) - padX, max: Math.max(...xs) + padX };
}

function yBound(pts: RevealPoint[], baseLine: unknown) {
  const ys = pts
    .map((p) => p.y)
    .filter((y): y is number => typeof y === "number" && Number.isFinite(y));
  let max = ys.length ? Math.max(...ys) : 0;
  if (typeof baseLine === "number" && Number.isFinite(baseLine)) {
    max = Math.max(max, baseLine);
  }
  return max + REDUCED_BRIDGE;
}

function firstChangedIndex(prev: RevealPoint[], next: RevealPoint[]) {
  const n = Math.max(prev.length, next.length);
  for (let i = 0; i < n; i++) {
    const a = prev[i];
    const b = next[i];
    if (!a || !b || a.value !== b.value) return i;
  }
  return null;
}

/** Clip polygon covering everything EXCEPT the rectangle [left..right]×[0..y]. */
function excludePolygon(left: number, right: number, x0: number, x1: number, y: number) {
  return [
    `${x0},0`,
    `${left},0`,
    `${left},${-REDUCED_BRIDGE}`,
    `${right},${-REDUCED_BRIDGE}`,
    `${right},0`,
    `${x1},0`,
    `${x1},${y}`,
    `${right},${y}`,
    `${right},${y + REDUCED_BRIDGE}`,
    `${left},${y + REDUCED_BRIDGE}`,
    `${left},${y}`,
    `${x0},${y}`,
  ].join(" ");
}

function renderDots(pts: RevealPoint[], dot: RevealAreaOptions["dot"]) {
  return pts.map((p, i) => {
    if (
      typeof p.x !== "number" ||
      typeof p.y !== "number" ||
      !Number.isFinite(p.x) ||
      !Number.isFinite(p.y)
    ) {
      return null;
    }
    const el = dot({ cx: p.x, cy: p.y, index: i, payload: p.payload });
    if (el === null || el === undefined || el === false) return null;
    return <Fragment key={`dot-${i}`}>{el}</Fragment>;
  });
}

type Band = {
  left: number;
  right: number;
  /** Points as they were before the change — rendered erased by the front. */
  prevPts: RevealPoint[] | null;
};

type AnimGeom = {
  spanMin: number;
  spanMax: number;
  y: number;
};

function RevealAreaInner({
  options,
  points,
  baseLine,
  ...rest
}: AreaRevealShapeProps & { options: RevealAreaOptions }) {
  const clipId = useId();
  const { dot, entranceDuration = 3000, bandDuration = 1800, padX = 12 } = options;

  const pts = useMemo(() => (points ?? []) as RevealPoint[], [points]);
  const prevRef = useRef<RevealPoint[] | null>(null);
  const entranceDoneRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const animRef = useRef<{ from: number; to: number; start: number; dur: number } | null>(null);
  const [band, setBand] = useState<Band | null>(null);

  /* Direct DOM handles for the clip geometry, plus a state fallback for the
     (rare) case where the refs are not attached yet on the first frame. */
  const newRectRef = useRef<SVGRectElement | null>(null);
  const oldPolyRef = useRef<SVGPolygonElement | null>(null);
  const [frontFallback, setFrontFallback] = useState<number | null>(null);

  const startAnim = useCallback(
    (
      from: number,
      to: number,
      dur: number,
      prevPts: RevealPoint[] | null,
      geom: AnimGeom,
    ) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      animRef.current = null;
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || to <= from) {
        setBand(null);
        setFrontFallback(null);
        return;
      }
      animRef.current = { from, to, start: performance.now(), dur };
      setBand({ left: from, right: to, prevPts });
      setFrontFallback(null);

      const tick = (now: number) => {
        const a = animRef.current;
        if (!a) return;
        const t = Math.min(1, (now - a.start) / a.dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const front = a.from + (a.to - a.from) * eased;

        const rect = newRectRef.current;
        if (rect) {
          /* Drive the clip straight from the DOM. React never re-renders
             during the animation, so the clip attributes below are ours to
             own — and because the rendered props stay constant, React will
             not overwrite them on an unrelated re-render. */
          rect.setAttribute("width", String(Math.max(0, front - a.from)));
          const poly = oldPolyRef.current;
          if (poly) {
            poly.setAttribute(
              "points",
              excludePolygon(a.from, front, geom.spanMin, geom.spanMax, geom.y),
            );
          }
        } else {
          /* Refs not attached yet (first frame) — fall back to state so the
             wipe still advances instead of freezing at zero width. */
          setFrontFallback(front);
        }

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = null;
          rafRef.current = null;
          setBand(null);
          setFrontFallback(null);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = pts;
    const span = xSpan(pts, padX);
    // Guard max<=min too: ResponsiveContainer's first render can be 0-width
    // (all x equal) — don't burn the entrance on a degenerate span.
    if (!span || span.max <= span.min) return;

    const geom: AnimGeom = {
      spanMin: span.min,
      spanMax: span.max,
      y: Math.max(
        yBound(pts, baseLine),
        prev ? yBound(prev, baseLine) : 0,
      ),
    };

    if (!entranceDoneRef.current) {
      // Mount, or ResponsiveContainer just got its size — full entrance wipe.
      entranceDoneRef.current = true;
      startAnim(span.min, span.max, entranceDuration, null, geom);
      return;
    }

    const changed = prev ? firstChangedIndex(prev, pts) : null;
    if (changed === null) return;
    const left = pts[Math.max(0, changed - 1)]?.x ?? span.min;
    const right = pts[Math.min(pts.length - 1, changed + 1)]?.x ?? span.max;
    startAnim(left - padX * 0.5, right + padX * 0.5, bandDuration, prev, geom);
  }, [pts, padX, entranceDuration, bandDuration, startAnim, baseLine]);

  useEffect(() => {
    return () => {
      // Strict Mode dev double-invokes this before re-running the entrance
      // effect — without a full reset the entrance is skipped and the band
      // stays stuck at its zero-width start frame, hiding the whole graph.
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      animRef.current = null;
      entranceDoneRef.current = false;
      setBand(null);
      setFrontFallback(null);
    };
  }, []);

  const shapeProps = rest as AreaRevealShapeProps;

  if (!band) {
    return (
      <>
        <AreaRevealShape {...shapeProps} points={points} baseLine={baseLine} />
        {renderDots(pts, dot)}
      </>
    );
  }

  const span = xSpan(pts, padX) ?? { min: band.left, max: band.right };
  const y = Math.max(
    yBound(pts, baseLine),
    band.prevPts ? yBound(band.prevPts, baseLine) : 0,
  );
  const newClip = `reveal-new-${clipId}`;
  const oldClip = `reveal-old-${clipId}`;

  /* `front` is the animated wipe edge. When the DOM handles are attached the
     RAF loop owns it; `frontFallback` only carries the very first frame. */
  const front = frontFallback ?? band.left;

  return (
    <>
      <defs>
        <clipPath id={newClip}>
          <rect
            ref={newRectRef}
            x={band.left}
            y={-REDUCED_BRIDGE}
            width={Math.max(0, front - band.left)}
            height={y + REDUCED_BRIDGE * 2}
          />
        </clipPath>
        <clipPath id={oldClip}>
          <polygon
            ref={oldPolyRef}
            points={excludePolygon(band.left, front, span.min, span.max, y)}
          />
        </clipPath>
      </defs>
      {band.prevPts ? (
        <g clipPath={`url(#${oldClip})`}>
          <AreaRevealShape
            {...shapeProps}
            points={band.prevPts as AreaRevealShapeProps["points"]}
            baseLine={baseLine}
          />
          {renderDots(band.prevPts, dot)}
        </g>
      ) : null}
      <g clipPath={`url(#${newClip})`}>
        <AreaRevealShape {...shapeProps} points={points} baseLine={baseLine} />
        {renderDots(pts, dot)}
      </g>
    </>
  );
}

export function makeRevealAreaShape(options: RevealAreaOptions) {
  return function RevealAreaShape(props: AreaRevealShapeProps) {
    return <RevealAreaInner {...props} options={options} />;
  };
}
