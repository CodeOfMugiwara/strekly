import { cn } from "@/lib/utils";

type BotanicalLavenderProps = {
  className?: string;
  variant?: "corner" | "sprig" | "accent";
};

/**
 * Botanical Lavender Sprig Illustration
 *
 * Vector botanical artwork inspired directly by public/designs/ (HomePage.png, trakcer UI.png).
 * Renders layered stems, slender lanceolate leaves, and blooming lavender florets.
 * Adapts dynamically to light/dark themes and active color themes using currentColor.
 */
export function BotanicalLavender({
  className,
  variant = "corner",
}: BotanicalLavenderProps) {
  if (variant === "sprig") {
    return (
      <svg
        viewBox="0 0 100 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-16 h-28 text-primary select-none pointer-events-none", className)}
        aria-hidden="true"
      >
        {/* Main central stem */}
        <path
          d="M48 155 C 47 115, 50 75, 52 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-70"
        />
        {/* Side branching stems */}
        <path
          d="M48 120 C 40 105, 32 90, 26 75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-60"
        />
        <path
          d="M50 105 C 58 92, 68 80, 76 68"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-60"
        />

        {/* Leaves */}
        <path
          d="M47 130 C 35 125, 25 110, 24 95 C 32 105, 42 118, 48 128 Z"
          fill="currentColor"
          className="opacity-45"
        />
        <path
          d="M49 118 C 62 114, 72 100, 75 88 C 66 98, 56 109, 50 116 Z"
          fill="currentColor"
          className="opacity-45"
        />
        <path
          d="M49 85 C 40 76, 32 64, 30 52 C 38 62, 45 72, 50 82 Z"
          fill="currentColor"
          className="opacity-40"
        />

        {/* Center Lavender Blossom Tiers */}
        {/* Top spike */}
        <ellipse cx="52" cy="18" rx="3.5" ry="5.5" fill="currentColor" className="opacity-80" />
        <ellipse cx="49" cy="24" rx="4" ry="6" fill="currentColor" className="opacity-75" />
        <ellipse cx="55" cy="25" rx="4" ry="6" fill="currentColor" className="opacity-85" />
        
        {/* Tier 2 */}
        <ellipse cx="47" cy="33" rx="4.5" ry="6.5" fill="currentColor" className="opacity-80" />
        <ellipse cx="56" cy="34" rx="4.5" ry="6.5" fill="currentColor" className="opacity-90" />
        <ellipse cx="51.5" cy="31" rx="4" ry="5.5" fill="currentColor" className="opacity-70" />

        {/* Tier 3 */}
        <ellipse cx="45" cy="44" rx="5" ry="7" fill="currentColor" className="opacity-85" />
        <ellipse cx="58" cy="45" rx="5" ry="7" fill="currentColor" className="opacity-90" />
        <ellipse cx="51" cy="42" rx="4.5" ry="6" fill="currentColor" className="opacity-75" />

        {/* Tier 4 */}
        <ellipse cx="44" cy="56" rx="5.5" ry="7.5" fill="currentColor" className="opacity-90" />
        <ellipse cx="59" cy="57" rx="5.5" ry="7.5" fill="currentColor" className="opacity-95" />
        <ellipse cx="51.5" cy="54" rx="4.5" ry="6.5" fill="currentColor" className="opacity-70" />

        {/* Left branch blossom spike */}
        <ellipse cx="26" cy="74" rx="3" ry="5" fill="currentColor" className="opacity-75" />
        <ellipse cx="23" cy="80" rx="3.5" ry="5.5" fill="currentColor" className="opacity-70" />
        <ellipse cx="29" cy="81" rx="3.5" ry="5.5" fill="currentColor" className="opacity-80" />
        <ellipse cx="21" cy="88" rx="4" ry="6" fill="currentColor" className="opacity-75" />
        <ellipse cx="31" cy="89" rx="4" ry="6" fill="currentColor" className="opacity-85" />

        {/* Right branch blossom spike */}
        <ellipse cx="76" cy="67" rx="3" ry="5" fill="currentColor" className="opacity-75" />
        <ellipse cx="72" cy="73" rx="3.5" ry="5.5" fill="currentColor" className="opacity-70" />
        <ellipse cx="80" cy="74" rx="3.5" ry="5.5" fill="currentColor" className="opacity-85" />
        <ellipse cx="70" cy="81" rx="4" ry="6" fill="currentColor" className="opacity-75" />
        <ellipse cx="82" cy="82" rx="4" ry="6" fill="currentColor" className="opacity-85" />
      </svg>
    );
  }

  // Full corner illustration matching sidebar bottom in HomePage.png and trakcer UI.png
  return (
    <svg
      viewBox="0 0 180 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-36 h-52 text-primary select-none pointer-events-none", className)}
      aria-hidden="true"
    >
      {/* Background soft botanical glow / gradient wash */}
      <defs>
        <radialGradient id="lavenderGlow" cx="30%" cy="80%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="200" r="100" fill="url(#lavenderGlow)" />

      {/* Main tall stem rising from bottom left */}
      <path
        d="M10 260 C 25 210, 60 140, 85 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="opacity-70"
      />
      {/* Secondary outer stem */}
      <path
        d="M5 260 C 15 190, 30 130, 40 70"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-60"
      />
      {/* Rightward leaning stem */}
      <path
        d="M20 260 C 45 220, 95 180, 130 90"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-65"
      />
      {/* Far right stem */}
      <path
        d="M25 260 C 65 240, 120 210, 155 140"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="opacity-55"
      />

      {/* Slender curved leaves */}
      <path
        d="M12 240 C 0 215, 2 175, 18 150 C 18 180, 22 215, 14 240 Z"
        fill="currentColor"
        className="opacity-40"
      />
      <path
        d="M22 230 C 48 220, 68 190, 72 160 C 60 185, 42 210, 24 228 Z"
        fill="currentColor"
        className="opacity-45"
      />
      <path
        d="M38 180 C 68 170, 88 140, 95 110 C 80 135, 60 160, 40 178 Z"
        fill="currentColor"
        className="opacity-45"
      />
      <path
        d="M28 140 C 12 120, 8 95, 15 75 C 22 95, 30 120, 32 138 Z"
        fill="currentColor"
        className="opacity-40"
      />

      {/* Flower Spikes — Main Stem (Tallest) */}
      {/* Terminal bud */}
      <ellipse cx="85" cy="38" rx="4" ry="6" fill="currentColor" className="opacity-80" />
      <ellipse cx="81" cy="46" rx="4.5" ry="6.5" fill="currentColor" className="opacity-75" />
      <ellipse cx="89" cy="47" rx="4.5" ry="6.5" fill="currentColor" className="opacity-85" />
      {/* Tier 2 */}
      <ellipse cx="78" cy="56" rx="5" ry="7" fill="currentColor" className="opacity-80" />
      <ellipse cx="91" cy="57" rx="5" ry="7" fill="currentColor" className="opacity-90" />
      <ellipse cx="84.5" cy="53" rx="4.5" ry="6" fill="currentColor" className="opacity-70" />
      {/* Tier 3 */}
      <ellipse cx="76" cy="68" rx="5.5" ry="7.5" fill="currentColor" className="opacity-85" />
      <ellipse cx="93" cy="69" rx="5.5" ry="7.5" fill="currentColor" className="opacity-95" />
      <ellipse cx="84" cy="65" rx="5" ry="7" fill="currentColor" className="opacity-75" />
      {/* Tier 4 */}
      <ellipse cx="73" cy="81" rx="6" ry="8" fill="currentColor" className="opacity-90" />
      <ellipse cx="94" cy="82" rx="6" ry="8" fill="currentColor" className="opacity-95" />
      <ellipse cx="83.5" cy="78" rx="5" ry="7" fill="currentColor" className="opacity-80" />
      {/* Tier 5 */}
      <ellipse cx="71" cy="95" rx="6" ry="8" fill="currentColor" className="opacity-90" />
      <ellipse cx="94" cy="96" rx="6" ry="8" fill="currentColor" className="opacity-95" />
      <ellipse cx="82" cy="92" rx="5.5" ry="7.5" fill="currentColor" className="opacity-80" />

      {/* Secondary Left Stem Flower Spike */}
      <ellipse cx="40" cy="68" rx="3.5" ry="5.5" fill="currentColor" className="opacity-75" />
      <ellipse cx="36" cy="75" rx="4" ry="6" fill="currentColor" className="opacity-70" />
      <ellipse cx="44" cy="76" rx="4" ry="6" fill="currentColor" className="opacity-80" />
      <ellipse cx="33" cy="85" rx="4.5" ry="6.5" fill="currentColor" className="opacity-75" />
      <ellipse cx="46" cy="86" rx="4.5" ry="6.5" fill="currentColor" className="opacity-85" />
      <ellipse cx="31" cy="96" rx="5" ry="7" fill="currentColor" className="opacity-80" />
      <ellipse cx="47" cy="97" rx="5" ry="7" fill="currentColor" className="opacity-90" />

      {/* Right Leaning Stem Flower Spike */}
      <ellipse cx="130" cy="88" rx="3.5" ry="5.5" fill="currentColor" className="opacity-75" />
      <ellipse cx="125" cy="96" rx="4.5" ry="6.5" fill="currentColor" className="opacity-75" />
      <ellipse cx="135" cy="97" rx="4.5" ry="6.5" fill="currentColor" className="opacity-85" />
      <ellipse cx="121" cy="107" rx="5" ry="7" fill="currentColor" className="opacity-80" />
      <ellipse cx="138" cy="108" rx="5" ry="7" fill="currentColor" className="opacity-90" />
      <ellipse cx="118" cy="120" rx="5.5" ry="7.5" fill="currentColor" className="opacity-85" />
      <ellipse cx="140" cy="121" rx="5.5" ry="7.5" fill="currentColor" className="opacity-95" />

      {/* Far Right Lower Spike */}
      <ellipse cx="155" cy="138" rx="3.5" ry="5" fill="currentColor" className="opacity-70" />
      <ellipse cx="150" cy="146" rx="4" ry="6" fill="currentColor" className="opacity-70" />
      <ellipse cx="160" cy="147" rx="4" ry="6" fill="currentColor" className="opacity-80" />
      <ellipse cx="146" cy="157" rx="4.5" ry="6.5" fill="currentColor" className="opacity-75" />
      <ellipse cx="162" cy="158" rx="4.5" ry="6.5" fill="currentColor" className="opacity-85" />
    </svg>
  );
}
