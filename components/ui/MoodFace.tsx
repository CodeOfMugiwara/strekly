import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom mood faces from MoodPage.png — drawn as SVG, not system emoji.
 * 6-level scale (F26, high = happier):
 *   6 very-happy (closed happy eyes + open smile), 5 happy (dots + gentle
 *   smile), 4 okay (dots + line), 3 tired (half-lidded eyes + small yawn),
 *   2 sad (dots + frown), 1 fucked-up (mind blown — orange/yellow fire
 *   cloud bursting over the top of the head + dot eyes + hollow O mouth).
 */

const FEATURE = "#2D2947";
// Mind-blown fire cloud (Fu*ked Up face only) — matches the 🤯 explosion.
const FIRE = "#FB923C";
const FIRE_CORE = "#FCD34D";

function MindBlownCloud() {
  return (
    <g>
      <circle cx="10" cy="9.5" r="5.5" fill={FIRE} />
      <circle cx="26" cy="9.5" r="5.5" fill={FIRE} />
      <circle cx="18" cy="6.5" r="7" fill={FIRE} />
      <circle cx="13.5" cy="12.5" r="4.6" fill={FIRE} />
      <circle cx="22.5" cy="12.5" r="4.6" fill={FIRE} />
      <circle cx="18" cy="13" r="4" fill={FIRE} />
      <circle cx="16.2" cy="7.5" r="3.2" fill={FIRE_CORE} />
      <circle cx="20.8" cy="9.5" r="2.2" fill={FIRE_CORE} />
      <circle cx="6" cy="5.5" r="1.2" fill={FIRE} />
      <circle cx="30.2" cy="6" r="1.2" fill={FIRE} />
      <circle cx="18" cy="1.2" r="1" fill={FIRE_CORE} />
    </g>
  );
}

function Eyes({ value }: { value: number }) {
  // closed happy (very happy)
  if (value === 6) {
    return (
      <>
        <path
          d="M10.5 14.5 Q13 11.5 15.5 14.5"
          fill="none"
          stroke={FEATURE}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M20.5 14.5 Q23 11.5 25.5 14.5"
          fill="none"
          stroke={FEATURE}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    );
  }
  // half-lidded (tired) — droop lid with a small pupil peeking below
  if (value === 3) {
    return (
      <>
        <path
          d="M10.5 13.5 Q13 15.5 15.5 13.5"
          fill="none"
          stroke={FEATURE}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="13" cy="16" r="1.1" fill={FEATURE} />
        <path
          d="M20.5 13.5 Q23 15.5 25.5 13.5"
          fill="none"
          stroke={FEATURE}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="23" cy="16" r="1.1" fill={FEATURE} />
      </>
    );
  }
  // mind blown (fucked up) — small shocked eyes low on the face; the fire
  // cloud (rendered separately in MoodFace) covers the top of the head
  if (value === 1) {
    return (
      <>
        <circle cx="13" cy="21" r="2" fill={FEATURE} />
        <circle cx="23" cy="21" r="2" fill={FEATURE} />
      </>
    );
  }
  return (
    <>
      <circle cx="13" cy="14" r="1.9" fill={FEATURE} />
      <circle cx="23" cy="14" r="1.9" fill={FEATURE} />
    </>
  );
}

function Mouth({ value }: { value: number }) {
  if (value === 6) {
    // big open smile
    return (
      <path
        d="M11.5 21.5 Q18 30 24.5 21.5 Z"
        fill={FEATURE}
      />
    );
  }
  if (value === 5) {
    // gentle smile
    return (
      <path
        d="M13 23 Q18 27.5 23 23"
        fill="none"
        stroke={FEATURE}
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  }
  if (value === 4) {
    // straight line
    return (
      <path
        d="M14 24 H22"
        fill="none"
        stroke={FEATURE}
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  }
  if (value === 3) {
    // small yawn oval (tired)
    return <ellipse cx="18" cy="24" rx="2.2" ry="2.8" fill={FEATURE} />;
  }
  if (value === 2) {
    // frown
    return (
      <path
        d="M13 25.5 Q18 21 23 25.5"
        fill="none"
        stroke={FEATURE}
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  }
  // 1 — agape O mouth (mind blown)
  return (
    <ellipse
      cx="18"
      cy="26.8"
      rx="3.1"
      ry="2.5"
      fill="none"
      stroke={FEATURE}
      strokeWidth="1.8"
    />
  );
}

type MoodFaceProps = {
  /** Mood value 1 (Fu*ked Up) – 6 (Very Happy) */
  value: number;
  /** Circle fill color */
  color: string;
  /** Diameter in px */
  size?: number;
  className?: string;
};

export function MoodFace({
  value,
  color,
  size = 36,
  className,
}: MoodFaceProps) {
  const v = Math.min(6, Math.max(1, Math.round(value)));
  const gradId = useId();
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full leading-none", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id={gradId} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill={color} />
      <circle cx="18" cy="18" r="18" fill={`url(#${gradId})`} />
      {v === 1 ? <MindBlownCloud /> : null}
      <Eyes value={v} />
      <Mouth value={v} />
    </svg>
  );
}