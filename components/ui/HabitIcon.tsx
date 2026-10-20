import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * HabitIcon — shared custom-SVG habit glyphs: no background circle, a vivid
 * per-glyph color and a soft glow (drop-shadow) instead. System emoji only
 * as fallback when no glyph matches.
 * One implementation everywhere habit tiles appear (Habits grid, Home list,
 * Calendar Day Details, Settings habit management).
 */

export type HabitGlyph =
  | "sunrise"
  | "alarm"
  | "dumbbell"
  | "eye"
  | "growth"
  | "toothbrush"
  | "shower"
  | "journal"
  | "water"
  | "moon"
  | "book"
  | "apple"
  | "lotus"
  | "walk"
  | "phone-off"
  | "leaf"
  | "flame"
  | "crown";

/* ---------------------------------------------------------------- glyphs */

const GLYPHS: Record<HabitGlyph, ReactNode> = {
  water: (
    <path
      d="M12 3.5c0 0-6.5 7-6.5 10.6a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3.5 12 3.5z"
      fill="currentColor"
      stroke="none"
    />
  ),
  moon: (
    <path
      d="M20 14.2A8.2 8.2 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z"
      fill="currentColor"
      stroke="none"
    />
  ),
  sunrise: (
    <>
      <path d="M4 18.5h16" />
      <path d="M8 14.5a4 4 0 0 1 8 0" />
      <path d="M12 4.5v2.5M5.5 7.5l1.6 1.6M18.5 7.5l-1.6 1.6M4.5 14.5H6M18 14.5h1.5" />
    </>
  ),
  alarm: (
    <>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9.5V13l2.5 1.5" />
      <path d="M5 4.5 3.5 6M19 4.5 20.5 6" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M8.5 12h7" />
      <rect x="3.5" y="8.5" width="3.5" height="7" rx="1.2" />
      <rect x="17" y="8.5" width="3.5" height="7" rx="1.2" />
      <path d="M6.5 10.5v3M17.5 10.5v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2.8 12S6.5 6.5 12 6.5 21.2 12 21.2 12 17.5 17.5 12 17.5 2.8 12 2.8 12z" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </>
  ),
  growth: (
    <>
      <path d="M12 21v-7.5" />
      <path d="M12 13.5C12 10 9 7.5 5.5 7.5c0 3.5 3 6 6.5 6z" fill="currentColor" stroke="none" />
      <path d="M12 11c0-3 2.5-5.5 5.5-5.5 0 3-2.5 5.5-5.5 5.5z" fill="currentColor" stroke="none" />
    </>
  ),
  toothbrush: (
    <>
      <rect x="4.5" y="3.5" width="6" height="5" rx="1.2" transform="rotate(45 7.5 6)" />
      <path d="M9.8 8.7 18.5 17.5" />
      <path d="M16.8 19.2 19 17" />
    </>
  ),
  shower: (
    <>
      <path d="M4.5 11.5a7.5 7.5 0 0 1 15 0" />
      <path d="M4.5 11.5h15" />
      <path d="M8 14.5v1.5M12 15v2M16 14.5v1.5M10 18v1M14 18v1" />
    </>
  ),
  journal: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="1.8" />
      <path d="M8.5 3.5v17" />
      <path d="M12 8h4M12 11.5h4" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10.5 5 8 4.5 4.5 4.5v13c3.5 0 6 .5 7.5 2 1.5-1.5 4-2 7.5-2v-13c-3.5 0-6 .5-7.5 2z" />
      <path d="M12 6.5v14" />
    </>
  ),
  apple: (
    <>
      <path
        d="M12 7.5c-3.5-2.5-8-.5-8 3.8 0 3.8 2.8 8.4 5.2 8.4 1 0 1.6-.5 2.8-.5s1.8.5 2.8.5c2.4 0 5.2-4.6 5.2-8.4 0-4.3-4.5-6.3-8-3.8z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M12 7.5V5c1.5-1.5 3.5-2 5-1.5-.5 2-2 3.5-5 4z" fill="currentColor" stroke="none" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 5.5c1.8 2 2.7 4 2.7 6.2 0 2.6-1.2 4.8-2.7 6.3-1.5-1.5-2.7-3.7-2.7-6.3 0-2.2.9-4.2 2.7-6.2z" fill="currentColor" stroke="none" />
      <path d="M6 9.5c2.3.3 4 1.3 5.2 3 1.3 1.9 1.6 4 1.3 6-2.5-.7-4.5-2.2-5.7-4.3C5.7 12.3 5.5 10.8 6 9.5z" fill="currentColor" stroke="none" opacity="0.75" />
      <path d="M18 9.5c-2.3.3-4 1.3-5.2 3-1.3 1.9-1.6 4-1.3 6 2.5-.7 4.5-2.2 5.7-4.3 1.1-1.9 1.3-3.4.8-4.7z" fill="currentColor" stroke="none" opacity="0.75" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.8" r="1.8" fill="currentColor" stroke="none" />
      <path d="M12.2 8.2 10 12l2.5 2 1 6.5" />
      <path d="M12.2 8.2l3 1.8 1.5 3" />
      <path d="M10 12l-2.5 3.5" />
      <path d="M13.5 14l-2.5 6.5" />
    </>
  ),
  "phone-off": (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M10.5 17.5h3" />
      <path d="M4 4l16 16" strokeWidth="2.2" />
    </>
  ),
  leaf: (
    <>
      <path d="M12 21c0-6 2-11 9-13-1 8-4 11-9 13z" fill="currentColor" stroke="none" />
      <path d="M12 21c0-4-1.5-7.5-6.5-9.5C6 17 8.5 19.8 12 21z" fill="currentColor" stroke="none" opacity="0.8" />
    </>
  ),
  flame: (
    <path
      d="M12 3c.5 3-1.5 4.5-2.8 6.2C7.6 11.2 7 12.7 7 14.5a5 5 0 0 0 10 0c0-2.3-1-4.2-2.3-5.8-.4 1-1.1 1.8-2 2.3.5-3-.4-6-1.7-8z"
      fill="currentColor"
      stroke="none"
    />
  ),
  crown: (
    <path
      d="M4.5 17.5 3 7.5l5 3.5 4-6 4 6 5-3.5-1.5 10z"
      fill="currentColor"
      stroke="none"
    />
  ),
};

/* --------------------------------------------------------------- mapping */

const EMOJI_MAP: Record<string, HabitGlyph> = {
  "💧": "water",
  "🚰": "water",
  "🌙": "moon",
  "🌜": "moon",
  "🌛": "moon",
  "😴": "moon",
  "🌅": "sunrise",
  "🌄": "sunrise",
  "⏰": "alarm",
  "⏲️": "alarm",
  "🔔": "alarm",
  "💪": "dumbbell",
  "🏋️": "dumbbell",
  "🏋️‍♂️": "dumbbell",
  "🤸": "dumbbell",
  "👀": "eye",
  "👁️": "eye",
  "🌱": "growth",
  "📏": "growth",
  "🪥": "toothbrush",
  "🦷": "toothbrush",
  "🚿": "shower",
  "🛁": "shower",
  "📓": "journal",
  "📔": "journal",
  "📒": "journal",
  "✍️": "journal",
  "🖊️": "journal",
  "✏️": "journal",
  "📖": "book",
  "📚": "book",
  "📕": "book",
  "📗": "book",
  "🍎": "apple",
  "🥗": "apple",
  "🥦": "apple",
  "🍊": "apple",
  "🧘": "lotus",
  "🧘‍♀️": "lotus",
  "🚶": "walk",
  "🚶‍♂️": "walk",
  "🏃": "walk",
  "🏃‍♂️": "walk",
  "📵": "phone-off",
  "📱": "phone-off",
  "🌿": "leaf",
  "🍃": "leaf",
  "🔥": "flame",
  "👑": "crown",
};

const NAME_KEYWORDS: Array<[RegExp, HabitGlyph]> = [
  [/water|drink|hydrat/i, "water"],
  [/sleep|night|insomnia/i, "moon"],
  [/wake|morning|sunrise/i, "sunrise"],
  [/alarm|remind/i, "alarm"],
  [/exercise|gym|workout|fitness|push|plank|sit.?up/i, "dumbbell"],
  [/eye/i, "eye"],
  [/height|growth|grow|posture/i, "growth"],
  [/brush|teeth|dental|floss/i, "toothbrush"],
  [/bath|shower/i, "shower"],
  [/journal|write|diary|reflect|gratitud/i, "journal"],
  [/read|book/i, "book"],
  [/eat|fruit|healthy|food|diet|salad|vegetable/i, "apple"],
  [/meditat|mindful|breath|yoga|calm/i, "lotus"],
  [/walk|run|step/i, "walk"],
  [/phone|social|screen|media|doomscroll/i, "phone-off"],
];

export function glyphForHabit(emoji?: string, name?: string): HabitGlyph | null {
  if (emoji && EMOJI_MAP[emoji]) return EMOJI_MAP[emoji];
  if (name) {
    for (const [re, glyph] of NAME_KEYWORDS) {
      if (re.test(name)) return glyph;
    }
  }
  return null;
}

/* ---------------------------------------------------------------- colors */

const GLYPH_COLORS: Record<HabitGlyph, string> = {
  water: "text-info-strong",
  moon: "text-primary-text",
  sunrise: "text-warning-strong",
  alarm: "text-error",
  dumbbell: "text-error-strong",
  eye: "text-success-strong",
  growth: "text-success-strong",
  toothbrush: "text-info",
  shower: "text-info-strong",
  journal: "text-secondary",
  book: "text-warning-strong",
  apple: "text-success-strong",
  lotus: "text-error",
  walk: "text-warning-strong",
  "phone-off": "text-error-strong",
  leaf: "text-success-strong",
  flame: "text-error",
  crown: "text-warning-strong",
};

/* -------------------------------------------------------------- component */

type HabitIconProps = {
  emoji?: string;
  name?: string;
  /** Box size in px. 32 default; habit tiles use 30–44. */
  size?: number;
  className?: string;
};

export function HabitIcon({ emoji, name, size = 32, className }: HabitIconProps) {
  const glyph = glyphForHabit(emoji, name);

  if (!glyph) {
    // Fallback: the user's own emoji, no chrome.
    return (
      <span
        className={cn("flex shrink-0 items-center justify-center", className)}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.55) }}
        role="img"
        aria-hidden
      >
        {emoji || "📝"}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        GLYPH_COLORS[glyph],
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter:
            "drop-shadow(0 0 2px color-mix(in srgb, currentColor 40%, transparent))",
        }}
      >
        {GLYPHS[glyph]}
      </svg>
    </span>
  );
}

/** Brand sprig mark for the sidebar logo (currentColor — set by parent). */
export function BrandLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21c0-6 2-11 9-13-1 8-4 11-9 13z" fill="currentColor" stroke="none" />
      <path d="M12 21c0-4-1.5-7.5-6.5-9.5C6 17 8.5 19.8 12 21z" fill="currentColor" stroke="none" opacity="0.75" />
    </svg>
  );
}
