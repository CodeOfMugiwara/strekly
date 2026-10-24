import { cn } from "@/lib/utils";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

type ScenicLavenderCardProps = {
  quote: string;
  underline?: boolean;
  footerBadge?: string;
  className?: string;
  size?: "sm" | "base" | "md" | "lg";
};

/**
 * Scenic Lavender Landscape Card
 *
 * Direct match to public/designs/ (HomePage.png, MoodPage.png, StatsPage.png, SettingsPage.png).
 * Renders atmospheric rolling lavender hills, misty mountains, pine silhouettes,
 * a soft glowing sun orb, and handwritten cursive script in signature Lavender Sky colors.
 */
export function ScenicLavenderCard({
  quote,
  underline = true,
  footerBadge,
  className,
  size = "base",
}: ScenicLavenderCardProps) {
  const minHeightClass = {
    sm: "min-h-[140px]",
    base: "min-h-[175px]",
    md: "min-h-[180px]",
    lg: "min-h-[220px]",
  }[size];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-card transition-all duration-200 hover:shadow-soft",
        minHeightClass,
        className,
      )}
    >
      {/* Background Scenic Landscape SVG */}
      <svg
        viewBox="0 0 600 300"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="scenicSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-lightest)" stopOpacity="0.75" />
            <stop offset="60%" stopColor="var(--color-surface-muted)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0.95" />
          </linearGradient>

          {/* Distant Hills Gradient */}
          <linearGradient id="distantHills" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-light)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.25" />
          </linearGradient>

          {/* Mid Ridge Gradient */}
          <linearGradient id="midRidge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-primary-dark)" stopOpacity="0.4" />
          </linearGradient>

          {/* Foreground Hills Gradient */}
          <linearGradient id="foreHills" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-dark)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--color-text)" stopOpacity="0.85" />
          </linearGradient>

          {/* Radiant Sun Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="var(--color-primary-light)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-primary-lightest)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Base */}
        <rect width="600" height="300" fill="url(#scenicSky)" />

        {/* Rising Sun Orb in the distance */}
        <circle cx="480" cy="110" r="65" fill="url(#sunGlow)" />
        <circle cx="480" cy="110" r="28" fill="#ffffff" fillOpacity="0.85" />

        {/* Layer 1: Distant Misty Mountains */}
        <path
          d="M0 160 C 120 130, 220 170, 360 140 C 470 115, 540 135, 600 120 L 600 300 L 0 300 Z"
          fill="url(#distantHills)"
        />

        {/* Layer 2: Mid-ground Rolling Lavender Ridges */}
        <path
          d="M0 200 C 90 175, 190 220, 310 185 C 430 155, 510 190, 600 165 L 600 300 L 0 300 Z"
          fill="url(#midRidge)"
        />

        {/* Distant Tree Silhouettes (Mid Ridge) */}
        {/* Left trees */}
        <path d="M45 190 L 52 165 L 59 190 Z" fill="var(--color-primary-dark)" fillOpacity="0.6" />
        <path d="M55 192 L 63 160 L 71 192 Z" fill="var(--color-primary-dark)" fillOpacity="0.7" />
        <path d="M68 194 L 74 170 L 80 194 Z" fill="var(--color-primary-dark)" fillOpacity="0.6" />
        {/* Right trees */}
        <path d="M510 170 L 518 135 L 526 170 Z" fill="var(--color-primary-dark)" fillOpacity="0.65" />
        <path d="M524 172 L 533 130 L 542 172 Z" fill="var(--color-primary-dark)" fillOpacity="0.75" />
        <path d="M539 174 L 546 142 L 553 174 Z" fill="var(--color-primary-dark)" fillOpacity="0.6" />
        <path d="M560 168 L 568 138 L 576 168 Z" fill="var(--color-primary-dark)" fillOpacity="0.7" />

        {/* Layer 3: Foreground Slope with Lavender Florals */}
        <path
          d="M0 250 C 130 220, 260 270, 420 230 C 510 210, 560 230, 600 220 L 600 300 L 0 300 Z"
          fill="url(#foreHills)"
          className="opacity-70 dark:opacity-90"
        />

        {/* Foreground Pine & Lavender Silhouettes */}
        <g fill="var(--color-text)" className="opacity-45 dark:opacity-80">
          {/* Left foreground trees */}
          <path d="M15 260 L 25 210 L 35 260 Z" />
          <path d="M30 262 L 42 200 L 54 262 Z" />
          <path d="M48 265 L 58 218 L 68 265 Z" />
          {/* Right foreground pines & lavender sprigs */}
          <path d="M535 235 L 545 175 L 555 235 Z" />
          <path d="M550 238 L 562 165 L 574 238 Z" />
          <path d="M570 240 L 580 182 L 590 240 Z" />
          {/* Lavender sprig stalks */}
          <path d="M520 250 Q 525 220 530 205" stroke="var(--color-text)" strokeWidth="1.5" />
          <circle cx="530" cy="205" r="2.5" />
          <circle cx="528" cy="212" r="2.5" />
          <path d="M585 245 Q 588 225 592 210" stroke="var(--color-text)" strokeWidth="1.5" />
          <circle cx="592" cy="210" r="2.5" />
          <circle cx="590" cy="218" r="2.5" />
        </g>
      </svg>

      {/* Floating Handwritten Script Quote Content */}
      <div className="relative z-10 flex h-full min-h-[160px] flex-col items-center justify-center p-6 text-center">
        <ScriptQuote
          size={size}
          align="center"
          underline={underline}
          className="max-w-md font-bold text-primary-text drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
        >
          {quote}
        </ScriptQuote>

        {footerBadge && (
          <div className="mt-4 rounded-full border border-border/60 bg-surface/80 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-text-muted backdrop-blur-xs">
            {footerBadge}
          </div>
        )}
      </div>
    </div>
  );
}
