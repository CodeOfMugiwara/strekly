"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export type MascotMood = "idle" | "happy" | "celebrate" | "sleepy" | "streak" | "supportive";

export type LumiMascotProps = {
  mood?: MascotMood;
  streakCount?: number;
  progressPercent?: number;
  displayName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDialogue?: boolean;
  /**
   * A specific line for Lumi to say, instead of the rotating encouragement
   * list. The marketing page uses this so each placement has its own
   * message rather than the same random quote everywhere.
   */
  message?: string;
  /** Extra line under the message — a supporting clause. */
  caption?: string;
  /**
   * When false the mascot is purely decorative: it cannot be clicked, it
   * never opens its speech bubble and it is removed from the tab order.
   * Used by the product tour, where Lumi is the guide in the tour card
   * rather than a button the user can press.
   */
  interactive?: boolean;
};

const ENCOURAGING_QUOTES = [
  "Small, honest efforts repeated daily beat occasional bursts of exhaustion.",
  "Consistency is about returning to your rituals, not never missing a day.",
  "Every check-in is a vote for the person you want to become.",
  "Partial progress counts. Showing up matters more than perfection.",
  "Take a breath, drink some water, and focus on your next single habit.",
  "Momentum builds quietly before the results become obvious.",
  "Resting when needed is part of sustainable consistency.",
];

export function LumiMascot({
  mood: initialMood,
  streakCount = 0,
  progressPercent = 0,
  displayName,
  size = "md",
  className,
  showDialogue = true,
  message,
  caption,
  interactive = true,
}: LumiMascotProps) {
  const gradientId = useId();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(showDialogue && interactive);
  const prefersReducedMotion = useReducedMotion();

  // Auto-determine mood based on progress & streak if not manually specified
  const internalMood: MascotMood = useMemo(() => {
    if (initialMood) return initialMood;
    if (progressPercent >= 100) return "celebrate";
    if (streakCount >= 3) return "streak";
    if (progressPercent > 0) return "happy";
    const hour = new Date().getHours();
    if (hour < 7 || hour >= 23) return "sleepy";
    return "idle";
  }, [initialMood, progressPercent, streakCount]);

  // Trigger confetti when hitting 100% celebration.
  // Only on the TRANSITION into 100%
  const prevProgressRef = useRef(progressPercent);
  useEffect(() => {
    const previous = prevProgressRef.current;
    prevProgressRef.current = progressPercent;
    if (progressPercent < 100) return;
    if (previous >= 100) return;
    if (prefersReducedMotion) return;
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#86d6bf", "#fcd34d", "#fbcfe8", "#c4b5fd"],
      });
    } catch {
      // Safe fallback in non-browser env
    }
  }, [progressPercent, internalMood, prefersReducedMotion]);

  const interactTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (interactTimerRef.current !== null) clearTimeout(interactTimerRef.current);
    };
  }, []);

  const handleMascotClick = () => {
    setIsInteracting(true);
    setBubbleOpen(true);
    // A fixed message (the marketing page) is not rotated on click.
    if (!message) {
      setQuoteIndex((prev) => (prev + 1) % ENCOURAGING_QUOTES.length);
    }

    // Pop tiny celebratory star burst
    if (!prefersReducedMotion) {
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.7 },
          colors: ["#a78bfa", "#86d6bf", "#fcd34d"],
          scalar: 0.8,
        });
      } catch {
        // Ignore
      }
    }

    if (interactTimerRef.current !== null) clearTimeout(interactTimerRef.current);
    interactTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
      interactTimerRef.current = null;
    }, 800);
  };

  const sizePixels = {
    sm: 64,
    md: 88,
    lg: 112,
  }[size];

  const currentQuote = useMemo(() => {
    if (message) return message;
    if (progressPercent >= 100) {
      return `All habits done today! Outstanding consistency, ${displayName || "friend"}.`;
    }
    if (streakCount >= 7) {
      return `Solid momentum: ${streakCount}-day streak! Keep showing up.`;
    }
    if (progressPercent >= 50) {
      return `Over halfway through today (${Math.round(progressPercent)}% completed).`;
    }
    if (progressPercent > 0) {
      return `First check-in logged for today. Keep the rhythm going.`;
    }
    const hour = new Date().getHours();
    if (hour >= 21) {
      return "Evening wind-down. Reflect on today's small wins and rest well.";
    }
    return ENCOURAGING_QUOTES[quoteIndex];
  }, [message, progressPercent, streakCount, displayName, quoteIndex]);

  return (
    <div className={cn("relative flex items-center gap-3 select-none", className)}>
      {/* Speech Dialogue Bubble */}
      <AnimatePresence initial={false}>
        {bubbleOpen && (
          <motion.div
            key="lumi-bubble"
            role="status"
            aria-live="polite"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.7 }}
            className="relative max-w-xs rounded-2xl border border-primary/25 bg-surface/90 px-3.5 py-2 text-xs font-medium text-text shadow-soft backdrop-blur-md"
          >
            <div className="flex items-center gap-1.5 text-primary-text font-semibold text-[11px] mb-0.5">
              <Sparkles className="h-3 w-3 animate-spin text-primary-text" style={{ animationDuration: "6s" }} />
              <span>Lumi says</span>
              {internalMood === "streak" && (
                <span className="flex items-center gap-0.5 text-warning-strong text-[10px]">
                  <Flame className="h-2.5 w-2.5 fill-current" /> {streakCount}d
                </span>
              )}
            </div>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={currentQuote}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="leading-snug text-text-secondary"
                >
                  {currentQuote}
                  {caption ? (
                    <span className="mt-1 block text-[11px] text-text-muted">
                      {caption}
                    </span>
                  ) : null}
                </motion.p>
              </AnimatePresence>
            </div>
            {/* Bubble tail */}
            <div
              className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-primary/25 bg-surface/90"
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Mascot SVG Character */}
      <button
        type="button"
        onClick={interactive ? handleMascotClick : undefined}
        aria-label={interactive ? "Interact with Lumi, your habit companion" : undefined}
        aria-hidden={interactive ? undefined : true}
        tabIndex={interactive ? undefined : -1}
        title={interactive ? "Tap Lumi for inspiration!" : undefined}
        className={cn(
          "group relative flex shrink-0 items-center justify-center rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          interactive
            ? "cursor-pointer active:scale-90"
            : "pointer-events-none select-none",
          isInteracting ? "scale-110" : interactive && "hover:scale-105",
        )}
        style={{ width: sizePixels, height: sizePixels }}
      >
        {/* Soft glowing ambient aura behind Lumi */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-xl transition-opacity",
            internalMood === "celebrate"
              ? "bg-primary/40 animate-pulse-glow"
              : internalMood === "streak"
              ? "bg-warning/40 animate-pulse-glow"
              : "bg-primary/20 group-hover:bg-primary/35"
          )}
        />

        <svg
          viewBox="0 0 100 100"
          className={cn(
            "relative h-full w-full drop-shadow-md",
            isInteracting ? "animate-bounce" : "animate-float"
          )}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Body gradient */}
            <linearGradient id={`lumiBody-${gradientId}`} x1="20" y1="15" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#dcc3f3" />
              <stop offset="50%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>

            {/* Glossy highlight */}
            <radialGradient id={`lumiGloss-${gradientId}`} cx="35" cy="30" r="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Sprout Leaf gradient */}
            <linearGradient id={`lumiLeaf-${gradientId}`} x1="45" y1="5" x2="65" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Sprout Stem */}
          <path
            d="M50 26 C50 18, 52 14, 55 12"
            stroke="#34d399"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Sprout Leaves */}
          <path
            d="M55 12 C52 7, 43 8, 44 14 C45 18, 53 15, 55 12 Z"
            fill={`url(#lumiLeaf-${gradientId})`}
          />
          <path
            d="M55 12 C60 6, 68 8, 66 14 C64 18, 57 15, 55 12 Z"
            fill={`url(#lumiLeaf-${gradientId})`}
          />

          {/* Tiny Blossom on sprout when celebrate / streak */}
          {(internalMood === "celebrate" || internalMood === "streak") && (
            <circle cx="55" cy="11" r="3" fill="#fed7aa" stroke="#f43f5e" strokeWidth="0.8" />
          )}

          {/* Main Lumi Body: Cute teardrop cloud puff */}
          <path
            d="M50 24 C28 24, 18 42, 20 62 C22 78, 34 88, 50 88 C66 88, 78 78, 80 62 C82 42, 72 24, 50 24 Z"
            fill={`url(#lumiBody-${gradientId})`}
          />

          {/* Glossy 3D Highlight Layer */}
          <path
            d="M50 24 C28 24, 18 42, 20 62 C22 78, 34 88, 50 88 C66 88, 78 78, 80 62 C82 42, 72 24, 50 24 Z"
            fill={`url(#lumiGloss-${gradientId})`}
          />

          {/* Little Hands/Nubs */}
          <ellipse
            cx="22"
            cy="60"
            rx="5"
            ry="7"
            transform="rotate(-25 22 60)"
            fill="#bda2f7"
          />
          <ellipse
            cx="78"
            cy={internalMood === "celebrate" ? "52" : "60"}
            rx="5"
            ry="7"
            transform={internalMood === "celebrate" ? "rotate(-45 78 52)" : "rotate(25 78 60)"}
            fill="#bda2f7"
          />

          {/* Cheerful Rosy Cheeks */}
          <ellipse cx="32" cy="58" rx="4.5" ry="3" fill="#fda4af" opacity="0.8" />
          <ellipse cx="68" cy="58" rx="4.5" ry="3" fill="#fda4af" opacity="0.8" />

          {/* Eyes & Expression by Mood State */}
          {internalMood === "sleepy" ? (
            /* Sleepy curved resting eyes */
            <>
              <path d="M34 52 Q40 56 44 52" stroke="#2d2947" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M56 52 Q60 56 66 52" stroke="#2d2947" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="50" cy="62" rx="2" ry="3" fill="#4c1d95" opacity="0.7" />
            </>
          ) : internalMood === "streak" ? (
            /* Determined fire-lit eyes + a confident grin */
            <>
              <path d="M33 49 L45 52" stroke="#1e1b4b" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M55 52 L67 49" stroke="#1e1b4b" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="39" cy="47.5" r="1.4" fill="#ffffff" />
              <circle cx="61" cy="47.5" r="1.4" fill="#ffffff" />
              {/* Confident closed smile */}
              <path
                d="M44 60 Q50 65 56 60"
                stroke="#2d2947"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              {/* Warm cheek blush — the fire-lit glow */}
              <ellipse cx="32" cy="58" rx="5" ry="3.2" fill="#fb923c" opacity="0.45" />
              <ellipse cx="68" cy="58" rx="5" ry="3.2" fill="#fb923c" opacity="0.45" />
            </>
          ) : internalMood === "supportive" ? (
            /* Warm, caring eyes — soft upward lids and a small kind smile */
            <>
              <path d="M33 48 Q39 44 45 48" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
              <path d="M55 48 Q61 44 67 48" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="39" cy="45" r="1.4" fill="#ffffff" />
              <circle cx="61" cy="45" r="1.4" fill="#ffffff" />
              {/* Small, gentle smile */}
              <path
                d="M45 61 Q50 65 55 61"
                stroke="#2d2947"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </>
          ) : internalMood === "celebrate" || internalMood === "happy" ? (
            /* Sparkling joyful crescent eyes with sparkles */
            <>
              <path d="M33 53 Q39 46 45 53" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
              <path d="M55 53 Q61 46 67 53" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
              {/* Star twinkle highlight */}
              <circle cx="39" cy="46" r="1.5" fill="#ffffff" />
              <circle cx="61" cy="46" r="1.5" fill="#ffffff" />
              {/* Big open smile */}
              <path d="M43 60 Q50 70 57 60 Z" fill="#701a75" />
              <path d="M46 63 Q50 67 54 63" fill="#f43f5e" />
            </>
          ) : (
            /* Standard attentive big anime eyes with twinkle */
            <>
              {/* Left Eye */}
              <circle cx="39" cy="50" r="5" fill="#1e1b4b" />
              <circle cx="37.5" cy="48" r="2" fill="#ffffff" />
              <circle cx="41" cy="52" r="1" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="61" cy="50" r="5" fill="#1e1b4b" />
              <circle cx="59.5" cy="48" r="2" fill="#ffffff" />
              <circle cx="63" cy="52" r="1" fill="#ffffff" />

              {/* Gentle Happy Mouth */}
              <path
                d="M45 61 Q50 66 55 61"
                stroke="#2d2947"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Little Floating Star Accents */}
          <path
            d="M78 28 L79.5 32 L83.5 33.5 L79.5 35 L78 39 L76.5 35 L72.5 33.5 L76.5 32 Z"
            fill="#fcd34d"
            className="animate-pulse"
          />
          <path
            d="M20 38 L21 40.5 L23.5 41.5 L21 42.5 L20 45 L19 42.5 L16.5 41.5 L19 40.5 Z"
            fill="#86d6bf"
            className="animate-pulse"
          />
        </svg>
      </button>
    </div>
  );
}
