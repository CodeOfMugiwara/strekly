import { cn } from "@/lib/utils";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

/**
 * 1. HomeInspirationScenicCard
 * Matches HomePage.png horizontal banner:
 * Misty undulating mountain ridges, cypress/pine silhouettes, open lavender sky.
 */
export function HomeInspirationScenicCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-card min-h-[175px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 600 240"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="homeSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-lightest)" stopOpacity="0.85" />
            <stop offset="60%" stopColor="var(--color-surface-muted)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="homeRidge1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-light)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="homeRidge2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-primary-dark)" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <rect width="600" height="240" fill="url(#homeSky)" />

        {/* Soft morning ambient sun orb */}
        <circle cx="500" cy="80" r="45" fill="var(--color-primary-light)" fillOpacity="0.35" />
        <circle cx="500" cy="80" r="22" fill="#ffffff" fillOpacity="0.8" />

        {/* Distant rolling ridge */}
        <path d="M0 120 C 140 90, 260 140, 420 100 C 510 80, 560 95, 600 85 L 600 240 L 0 240 Z" fill="url(#homeRidge1)" />

        {/* Mid-ground ridge with pines */}
        <path d="M0 160 C 120 135, 230 180, 370 145 C 480 120, 540 150, 600 135 L 600 240 L 0 240 Z" fill="url(#homeRidge2)" />

        {/* Cypress & Pine Tree Silhouettes */}
        <g fill="var(--color-primary-dark)" className="opacity-70 dark:opacity-90">
          <path d="M42 155 L 48 128 L 54 155 Z" />
          <path d="M51 157 L 57 122 L 63 157 Z" />
          <path d="M60 158 L 65 132 L 70 158 Z" />
          <path d="M525 140 L 532 108 L 539 140 Z" />
          <path d="M536 142 L 544 100 L 552 142 Z" />
          <path d="M549 143 L 555 112 L 561 143 Z" />
        </g>
      </svg>

      {/* Floating Quote Direct on Landscape (No Box) */}
      <div className="relative z-10 flex h-full min-h-[175px] items-center justify-center p-6 text-center">
        <ScriptQuote
          size="base"
          align="center"
          underline
          className="text-primary-text font-bold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] max-w-lg"
        >
          {"A calmer mind, A brighter you"}
        </ScriptQuote>
      </div>
    </div>
  );
}

/**
 * 2. MoodSunriseScenicCard
 * Matches MoodPage.png bottom-right vertical card:
 * Rising sun disc, radiating sunbeams, layered mountain slopes, and blooming lavender fields at the base.
 */
export function MoodSunriseScenicCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-card min-h-[185px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 320 220"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="moodSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-lightest)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="var(--color-surface-muted)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="moodSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="var(--color-warning-light)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-primary-light)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="320" height="220" fill="url(#moodSky)" />

        {/* Morning Sun Disc */}
        <circle cx="160" cy="85" r="40" fill="url(#moodSun)" />
        <circle cx="160" cy="85" r="18" fill="#ffffff" fillOpacity="0.9" />

        {/* Mountain slopes */}
        <path d="M0 125 C 60 105, 120 130, 180 110 C 240 95, 280 115, 320 105 L 320 220 L 0 220 Z" fill="var(--color-primary-light)" fillOpacity="0.4" />
        <path d="M0 150 C 70 135, 150 160, 220 140 C 270 128, 300 142, 320 138 L 320 220 L 0 220 Z" fill="var(--color-primary)" fillOpacity="0.5" />

        {/* Foreground Lavender Field row */}
        <g fill="var(--color-primary-dark)" className="opacity-60 dark:opacity-85">
          <path d="M15 175 Q 18 150 20 142" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="142" r="2.5" />
          <path d="M35 180 Q 38 152 40 145" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="40" cy="145" r="2.5" />
          <path d="M280 178 Q 282 155 285 146" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="285" cy="146" r="2.5" />
          <path d="M300 180 Q 303 150 305 140" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="305" cy="140" r="2.5" />
        </g>
      </svg>

      {/* Floating Quote Direct on Landscape (No Box) */}
      <div className="relative z-10 flex h-full min-h-[185px] items-center justify-center p-6 text-center">
        <ScriptQuote
          size="base"
          align="center"
          underline
          className="text-primary-text font-bold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] max-w-xs"
        >
          {"Progress looks different every day\nand that's okay."}
        </ScriptQuote>
      </div>
    </div>
  );
}

/**
 * 3. StatsPathwayScenicCard
 * Matches StatsPage.png bottom-right card:
 * Open rolling hills with a winding hillside pathway, gentle sunlight, and wildflowers.
 */
export function StatsPathwayScenicCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-card min-h-[175px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 340 200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="statsSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-surface-muted)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="var(--color-primary-lightest)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <rect width="340" height="200" fill="url(#statsSky)" />

        {/* Ambient Sun in top corner */}
        <circle cx="280" cy="50" r="32" fill="var(--color-primary-light)" fillOpacity="0.4" />
        <circle cx="280" cy="50" r="14" fill="#ffffff" fillOpacity="0.8" />

        {/* Broad rolling hill slope */}
        <path d="M0 100 C 90 75, 180 115, 340 85 L 340 200 L 0 200 Z" fill="var(--color-primary-light)" fillOpacity="0.35" />
        <path d="M0 135 C 110 115, 210 150, 340 120 L 340 200 L 0 200 Z" fill="var(--color-primary)" fillOpacity="0.45" />

        {/* Winding hillside pathway */}
        <path
          d="M200 135 C 180 155, 150 170, 110 200"
          stroke="var(--color-surface)"
          strokeWidth="10"
          strokeLinecap="round"
          className="opacity-70 dark:opacity-40"
        />
        <path
          d="M200 135 C 180 155, 150 170, 110 200"
          stroke="var(--color-primary-light)"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-60"
        />

        {/* Flower clusters beside pathway */}
        <circle cx="165" cy="155" r="2.5" fill="var(--color-primary-dark)" className="opacity-80" />
        <circle cx="172" cy="158" r="2" fill="var(--color-primary-dark)" className="opacity-70" />
        <circle cx="135" cy="178" r="3" fill="var(--color-primary-dark)" className="opacity-80" />
        <circle cx="142" cy="182" r="2.5" fill="var(--color-primary-dark)" className="opacity-70" />
      </svg>

      {/* Floating Quote Direct on Landscape (No Box) */}
      <div className="relative z-10 flex h-full min-h-[175px] items-center justify-center p-6 text-center">
        <ScriptQuote
          size="base"
          align="center"
          underline
          className="text-primary-text font-bold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] max-w-xs"
        >
          {"Discipline today creates the freedom"}
        </ScriptQuote>
      </div>
    </div>
  );
}

/**
 * 4. CalendarTwilightScenicCard
 * Matches CalenderPage.png middle-right card:
 * Calm twilight indigo-lavender sky with delicate crescent moon and quiet stars over dark tree ridge.
 */
export function CalendarTwilightScenicCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-card min-h-[170px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 340 190"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="calTwilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-light)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--color-primary-lightest)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <rect width="340" height="190" fill="url(#calTwilightSky)" />

        {/* Slender Crescent Moon */}
        <g transform="translate(280, 42)">
          <path
            d="M14 0 C 6 2, 0 10, 0 18 C 0 28, 8 36, 18 36 C 22 36, 26 34, 28 32 C 18 32, 12 24, 12 16 C 12 10, 15 4, 18 0 Z"
            fill="var(--color-primary-dark)"
            className="opacity-75 dark:opacity-90"
          />
        </g>

        {/* Delicate Twinkling Star Dots */}
        <circle cx="50" cy="35" r="1.5" fill="var(--color-primary-dark)" className="opacity-70" />
        <circle cx="110" cy="55" r="1.2" fill="var(--color-primary-dark)" className="opacity-60" />
        <circle cx="210" cy="30" r="1.5" fill="var(--color-primary-dark)" className="opacity-75" />
        <circle cx="160" cy="65" r="1" fill="var(--color-primary-dark)" className="opacity-50" />

        {/* Quiet tree ridge line */}
        <path d="M0 120 C 80 100, 180 135, 340 105 L 340 190 L 0 190 Z" fill="var(--color-primary)" fillOpacity="0.35" />
        <path d="M0 145 C 90 130, 210 160, 340 135 L 340 190 L 0 190 Z" fill="var(--color-primary-dark)" fillOpacity="0.55" />

        {/* Pine Silhouettes */}
        <g fill="var(--color-primary-dark)" className="opacity-75 dark:opacity-95">
          <path d="M35 142 L 40 120 L 45 142 Z" />
          <path d="M43 144 L 48 115 L 53 144 Z" />
          <path d="M300 132 L 306 108 L 312 132 Z" />
          <path d="M310 134 L 316 114 L 322 134 Z" />
        </g>
      </svg>

      {/* Floating Quote Direct on Landscape (No Box) */}
      <div className="relative z-10 flex h-full min-h-[170px] items-center justify-center p-6 text-center">
        <ScriptQuote
          size="base"
          align="center"
          underline
          className="text-primary-text font-bold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] max-w-xs"
        >
          {"Consistency today creates a brighter tomorrow."}
        </ScriptQuote>
      </div>
    </div>
  );
}

/**
 * 5. SettingsZenScenicCard
 * Matches SettingsPage.png bottom-right card:
 * Minimalist concentric zen arches, soft radiant glow, and footer badge.
 */
export function SettingsZenScenicCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-card min-h-[185px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="zenSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-lightest)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <rect width="320" height="200" fill="url(#zenSky)" />

        {/* Concentric Zen Arches */}
        <g stroke="var(--color-primary)" strokeWidth="1.5" className="opacity-40 dark:opacity-30">
          <path d="M80 200 C 80 130, 240 130, 240 200" />
          <path d="M105 200 C 105 150, 215 150, 215 200" />
          <path d="M130 200 C 130 170, 190 170, 190 200" />
        </g>

        {/* Glowing Center Disc */}
        <circle cx="160" cy="115" r="28" fill="#ffffff" fillOpacity="0.8" />
        <circle cx="160" cy="115" r="20" fill="var(--color-primary-lightest)" fillOpacity="0.6" />
      </svg>

      {/* Floating Quote Direct on Landscape (No Box) and Footer Badge */}
      <div className="relative z-10 flex h-full min-h-[185px] flex-col items-center justify-center p-6 text-center">
        <ScriptQuote
          size="base"
          align="center"
          underline
          className="text-primary-text font-bold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] max-w-xs"
        >
          {"Small changes make a big difference"}
        </ScriptQuote>

        <div className="mt-4 rounded-full border border-border/80 bg-surface/90 px-3.5 py-1 text-[10px] font-semibold tracking-widest uppercase text-text-muted backdrop-blur-xs">
          PROGRESS • CONSISTENCY • A HAPPIER YOU
        </div>
      </div>
    </div>
  );
}
