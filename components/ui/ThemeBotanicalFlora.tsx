"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import type { ColorTheme } from "@/types";
import { cn } from "@/lib/utils";

type ThemeBotanicalFloraProps = {
  theme?: ColorTheme;
  className?: string;
};

/**
 * ThemeBotanicalFlora
 *
 * Renders an authentic, lush botanical bouquet / bunch tailored specifically
 * to the active Strekly color theme:
 * - lavender: 4-stem tiered lavender flower bunch with lanceolate leaves
 * - mint: 3-stem dense herbal mint sprig bunch with serrated paired leaves & florets
 * - peach: 3-branch flowering peach blossom bough bunch with 5-petal blossoms & buds
 * - ocean / lagoon: 3-stem aquatic lotus & water lily bouquet with curling lily pads
 * - rose: 3-stem wild rose bouquet with blooming head, bud, thorns & serrated foliage
 * - sage: 3-stem velvety sage stalk bouquet with layered oblong leaves & crown florets
 * - clay: Terracotta dahlia & wildflower bouquet with layered concentric petals
 * - berry: Multi-branch botanical berry bough bunch with hanging berry clusters
 * - orchid: Elegant double arching orchid cane bouquet with cascading exotic blooms & buds
 *
 * Designed with a viewBox of 0 0 180 240, rising gracefully from bottom-left.
 * Rendered directly on surfaces with NO enclosing box or card frame.
 */
export function ThemeBotanicalFlora({
  theme,
  className,
}: ThemeBotanicalFloraProps) {
  const { colorTheme: contextTheme } = useTheme();
  const active = theme ?? contextTheme ?? "lavender";

  const baseClass = cn(
    "w-32 h-44 text-primary select-none pointer-events-none",
    className,
  );

  switch (active) {
    case "mint":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Main Central Mint Stem */}
          <path d="M20 240 C 35 180, 65 110, 82 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-75" />
          {/* Secondary Left Stem */}
          <path d="M15 240 C 25 185, 35 130, 42 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-65" />
          {/* Right Leaning Stem */}
          <path d="M25 240 C 50 190, 95 150, 130 85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
          {/* Far Right Lower Branch */}
          <path d="M30 240 C 65 215, 115 190, 150 145" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="opacity-60" />

          {/* Basal & Low Leaf Pairs */}
          <path d="M22 225 C 2 210, 2 185, 16 170 C 22 188, 28 208, 24 225 Z" fill="currentColor" className="opacity-50" />
          <path d="M26 215 C 48 205, 62 185, 60 165 C 48 180, 36 200, 26 215 Z" fill="currentColor" className="opacity-55" />
          <path d="M32 185 C 14 175, 12 150, 24 135 C 30 152, 36 170, 32 185 Z" fill="currentColor" className="opacity-55" />

          {/* Main Stem Leaf Nodes */}
          {/* Node 1 */}
          <path d="M52 145 C 32 138, 26 120, 36 105 C 46 115, 52 130, 54 145 Z" fill="currentColor" className="opacity-65" />
          <path d="M54 142 C 72 132, 85 115, 80 98 C 68 110, 58 128, 54 142 Z" fill="currentColor" className="opacity-70" />
          {/* Node 2 */}
          <path d="M66 100 C 50 92, 46 78, 54 65 C 62 74, 66 88, 68 100 Z" fill="currentColor" className="opacity-75" />
          <path d="M68 98 C 84 88, 95 72, 90 58 C 80 68, 72 85, 68 98 Z" fill="currentColor" className="opacity-80" />
          {/* Node 3 */}
          <path d="M76 60 C 64 54, 60 42, 68 32 C 74 38, 77 50, 78 60 Z" fill="currentColor" className="opacity-85" />
          <path d="M78 58 C 90 50, 98 38, 94 28 C 86 35, 80 48, 78 58 Z" fill="currentColor" className="opacity-90" />
          {/* Terminal Mint Flower Plume */}
          <ellipse cx="82" cy="22" rx="4.5" ry="7" fill="currentColor" className="opacity-95" />
          <circle cx="82" cy="14" r="3.5" fill="currentColor" className="opacity-90" />

          {/* Left Stem Leaves & Florets */}
          <path d="M36 105 C 22 100, 18 85, 26 72 C 34 80, 38 95, 38 105 Z" fill="currentColor" className="opacity-60" />
          <path d="M38 102 C 50 94, 58 80, 54 68 C 46 76, 40 90, 38 102 Z" fill="currentColor" className="opacity-65" />
          <ellipse cx="42" cy="62" rx="4" ry="6" fill="currentColor" className="opacity-85" />

          {/* Right Stem Leaves & Florets */}
          <path d="M75 145 C 92 135, 105 118, 98 102 C 88 114, 78 132, 75 145 Z" fill="currentColor" className="opacity-65" />
          <path d="M102 115 C 120 105, 130 88, 124 75 C 114 86, 105 102, 102 115 Z" fill="currentColor" className="opacity-70" />
          <ellipse cx="130" cy="82" rx="4.5" ry="6.5" fill="currentColor" className="opacity-90" />
          <circle cx="132" cy="74" r="3.5" fill="currentColor" className="opacity-85" />

          {/* Lower Right Branch Tip */}
          <ellipse cx="150" cy="142" rx="4" ry="5.5" fill="currentColor" className="opacity-80" />
        </svg>
      );

    case "peach":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Main Gnarled Branch */}
          <path d="M18 240 C 35 180, 60 120, 85 35" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="opacity-75" />
          {/* Left Arching Branch */}
          <path d="M15 240 C 22 190, 30 135, 38 75" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-65" />
          {/* Right Spreading Branch */}
          <path d="M48 160 Q 80 135 125 80" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-70" />
          {/* Far Right Lower Twig */}
          <path d="M65 190 Q 105 180 145 135" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="opacity-60" />

          {/* Delicate Foliage Leaves */}
          <path d="M38 180 Q 20 170 24 155 Q 32 165 38 178 Z" fill="currentColor" className="opacity-50" />
          <path d="M52 135 Q 40 120 48 110 Q 52 122 52 135 Z" fill="currentColor" className="opacity-55" />
          <path d="M72 90 Q 62 75 70 65 Q 74 78 72 90 Z" fill="currentColor" className="opacity-60" />

          {/* Blossom 1 (Main Center Peak) */}
          <g transform="translate(85, 38)" fill="currentColor">
            <circle cx="-8" cy="-3" r="6" className="opacity-75" />
            <circle cx="0" cy="-9" r="6" className="opacity-80" />
            <circle cx="8" cy="-3" r="6" className="opacity-75" />
            <circle cx="5" cy="6" r="6" className="opacity-80" />
            <circle cx="-5" cy="6" r="6" className="opacity-85" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" fillOpacity="0.85" />
          </g>
          {/* Top Bud */}
          <ellipse cx="88" cy="22" rx="4.5" ry="6.5" fill="currentColor" className="opacity-90" />

          {/* Blossom 2 (Left Branch Peak) */}
          <g transform="translate(38, 75)" fill="currentColor">
            <circle cx="-6.5" cy="-2.5" r="5" className="opacity-70" />
            <circle cx="0" cy="-7.5" r="5" className="opacity-75" />
            <circle cx="6.5" cy="-2.5" r="5" className="opacity-70" />
            <circle cx="4" cy="5" r="5" className="opacity-75" />
            <circle cx="-4" cy="5" r="5" className="opacity-80" />
            <circle cx="0" cy="0" r="2.5" fill="#ffffff" fillOpacity="0.85" />
          </g>

          {/* Blossom 3 (Mid-Right Main Branch) */}
          <g transform="translate(68, 105)" fill="currentColor">
            <circle cx="-7" cy="-3" r="5.5" className="opacity-75" />
            <circle cx="0" cy="-8" r="5.5" className="opacity-80" />
            <circle cx="7" cy="-3" r="5.5" className="opacity-75" />
            <circle cx="4.5" cy="5.5" r="5.5" className="opacity-80" />
            <circle cx="-4.5" cy="5.5" r="5.5" className="opacity-85" />
            <circle cx="0" cy="0" r="2.8" fill="#ffffff" fillOpacity="0.85" />
          </g>

          {/* Blossom 4 (Far Right Upper) */}
          <g transform="translate(125, 80)" fill="currentColor">
            <circle cx="-6.5" cy="-2.5" r="5.2" className="opacity-80" />
            <circle cx="0" cy="-7.5" r="5.2" className="opacity-85" />
            <circle cx="6.5" cy="-2.5" r="5.2" className="opacity-80" />
            <circle cx="4" cy="5" r="5.2" className="opacity-85" />
            <circle cx="-4" cy="5" r="5.2" className="opacity-90" />
            <circle cx="0" cy="0" r="2.5" fill="#ffffff" fillOpacity="0.85" />
          </g>

          {/* Blossom 5 (Far Right Lower Branch) */}
          <g transform="translate(145, 135)" fill="currentColor">
            <circle cx="-6" cy="-2" r="4.8" className="opacity-75" />
            <circle cx="0" cy="-6.5" r="4.8" className="opacity-80" />
            <circle cx="6" cy="-2" r="4.8" className="opacity-75" />
            <circle cx="3.8" cy="4.8" r="4.8" className="opacity-80" />
            <circle cx="-3.8" cy="4.8" r="4.8" className="opacity-85" />
            <circle cx="0" cy="0" r="2.2" fill="#ffffff" fillOpacity="0.8" />
          </g>

          {/* Accent Buds */}
          <ellipse cx="28" cy="62" rx="3.5" ry="5.5" fill="currentColor" className="opacity-85" />
          <ellipse cx="138" cy="68" rx="3.8" ry="5.8" fill="currentColor" className="opacity-90" />
        </svg>
      );

    case "ocean":
    case "lagoon":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Curving Aquatic Water Lily Stems */}
          <path d="M18 240 C 35 180, 65 110, 85 45" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="opacity-75" />
          <path d="M12 240 C 22 185, 32 135, 42 85" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-65" />
          <path d="M25 240 C 50 195, 90 155, 125 95" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-70" />
          <path d="M28 240 C 60 215, 110 190, 145 150" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="opacity-60" />

          {/* Curled Aquatic Water Lily Pads at the Base */}
          <ellipse cx="28" cy="205" rx="20" ry="8" transform="rotate(-15 28 205)" fill="currentColor" className="opacity-45" />
          <ellipse cx="58" cy="185" rx="22" ry="9" transform="rotate(18 58 185)" fill="currentColor" className="opacity-50" />
          <ellipse cx="98" cy="165" rx="18" ry="7" transform="rotate(22 98 165)" fill="currentColor" className="opacity-45" />

          {/* Master Blooming Lotus (Main Stem) */}
          <g transform="translate(85, 48)" fill="currentColor">
            {/* Outer Flanking Petals */}
            <path d="M0 0 C -22 -14, -14 -22, 0 0 Z" className="opacity-70" />
            <path d="M0 0 C 22 -14, 14 -22, 0 0 Z" className="opacity-70" />
            {/* Mid Petals */}
            <path d="M0 0 C -15 -20, -6 -26, 0 0 Z" className="opacity-85" />
            <path d="M0 0 C 15 -20, 6 -26, 0 0 Z" className="opacity-85" />
            {/* Center Core Petal */}
            <path d="M0 0 C -6 -24, 6 -24, 0 0 Z" className="opacity-95" />
            {/* Base Receptacle */}
            <ellipse cx="0" cy="2" rx="6" ry="3.5" fill="#ffffff" fillOpacity="0.8" />
          </g>

          {/* Secondary Semi-Open Lotus (Left Stem) */}
          <g transform="translate(42, 85)" fill="currentColor">
            <path d="M0 0 C -14 -12, -8 -18, 0 0 Z" className="opacity-75" />
            <path d="M0 0 C 14 -12, 8 -18, 0 0 Z" className="opacity-75" />
            <path d="M0 0 C -5 -18, 5 -18, 0 0 Z" className="opacity-90" />
          </g>

          {/* Third Lotus Bloom (Right Stem) */}
          <g transform="translate(125, 95)" fill="currentColor">
            <path d="M0 0 C -16 -12, -10 -18, 0 0 Z" className="opacity-70" />
            <path d="M0 0 C 16 -12, 10 -18, 0 0 Z" className="opacity-70" />
            <path d="M0 0 C -10 -18, -4 -22, 0 0 Z" className="opacity-85" />
            <path d="M0 0 C 10 -18, 4 -22, 0 0 Z" className="opacity-85" />
            <path d="M0 0 C -5 -20, 5 -20, 0 0 Z" className="opacity-95" />
          </g>

          {/* Accent Reeds & Aquatic Blooms */}
          <ellipse cx="145" cy="148" rx="4.5" ry="8" fill="currentColor" className="opacity-80" />
          <path d="M72 65 C 65 45, 60 30, 68 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />
        </svg>
      );

    case "rose":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Main Thorney Rose Cane */}
          <path d="M20 240 C 35 180, 60 120, 85 45" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="opacity-75" />
          {/* Left Cane */}
          <path d="M15 240 C 22 185, 30 135, 38 85" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-65" />
          {/* Right Cane */}
          <path d="M25 240 C 50 190, 90 150, 125 90" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-70" />
          {/* Lower Right Branch */}
          <path d="M30 240 C 65 215, 115 190, 150 145" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="opacity-60" />

          {/* Thorns */}
          <path d="M38 175 L 30 172 L 40 168 Z" fill="currentColor" className="opacity-70" />
          <path d="M56 125 L 64 122 L 55 118 Z" fill="currentColor" className="opacity-70" />
          <path d="M75 145 L 83 142 L 74 138 Z" fill="currentColor" className="opacity-70" />

          {/* Serrated Leaf Clusters */}
          {/* Node 1 */}
          <path d="M35 195 C 15 188, 10 168, 22 152 C 32 165, 38 182, 36 195 Z" fill="currentColor" className="opacity-50" />
          <path d="M42 165 C 62 155, 75 138, 70 122 C 58 135, 48 152, 42 165 Z" fill="currentColor" className="opacity-55" />
          {/* Node 2 */}
          <path d="M52 135 C 35 125, 30 108, 42 95 C 50 106, 54 122, 52 135 Z" fill="currentColor" className="opacity-60" />
          <path d="M68 115 C 88 105, 98 88, 92 75 C 82 85, 74 102, 68 115 Z" fill="currentColor" className="opacity-65" />

          {/* Master Blooming Rose Head (Main Cane) */}
          <g transform="translate(85, 45)" fill="currentColor">
            {/* Outer Petals */}
            <circle cx="0" cy="0" r="18" className="opacity-60" />
            <circle cx="-5" cy="-3" r="14" className="opacity-75" />
            <circle cx="5" cy="3" r="13" className="opacity-80" />
            {/* Mid Cupped Petals */}
            <circle cx="0" cy="0" r="9" className="opacity-90" />
            {/* Inner Spiral */}
            <circle cx="-1.5" cy="-1.5" r="4.5" fill="#ffffff" fillOpacity="0.6" />
          </g>

          {/* Opening Rosebud (Left Cane) */}
          <g transform="translate(38, 85)" fill="currentColor">
            <ellipse cx="0" cy="0" rx="9" ry="13" className="opacity-75" />
            <ellipse cx="-2" cy="-2" rx="6.5" ry="10" className="opacity-85" />
            <ellipse cx="2" cy="1" rx="5" ry="8" className="opacity-95" />
            {/* Sepal Calyx */}
            <path d="M-6 8 L 0 16 L 6 8 Z" fill="currentColor" className="opacity-90" />
          </g>

          {/* Secondary Rose Bloom (Right Cane) */}
          <g transform="translate(125, 90)" fill="currentColor">
            <circle cx="0" cy="0" r="14" className="opacity-65" />
            <circle cx="-4" cy="-2" r="11" className="opacity-75" />
            <circle cx="4" cy="2" r="10" className="opacity-85" />
            <circle cx="0" cy="0" r="6" className="opacity-95" />
            <circle cx="-1" cy="-1" r="2.8" fill="#ffffff" fillOpacity="0.6" />
          </g>

          {/* Lower Right Branch Bud */}
          <ellipse cx="150" cy="145" rx="5" ry="8" fill="currentColor" className="opacity-80" />
        </svg>
      );

    case "sage":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Main Sage Stalk */}
          <path d="M20 240 C 35 180, 65 110, 85 25" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="opacity-75" />
          {/* Secondary Left Stalk */}
          <path d="M15 240 C 22 185, 30 135, 40 65" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-65" />
          {/* Right Leaning Stalk */}
          <path d="M25 240 C 50 190, 90 150, 128 75" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-70" />
          {/* Far Right Lower Stalk */}
          <path d="M30 240 C 65 215, 115 190, 150 135" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="opacity-60" />

          {/* Velvety Layered Oblong Leaves */}
          {/* Base */}
          <ellipse cx="28" cy="215" rx="10" ry="18" transform="rotate(-35 28 215)" fill="currentColor" className="opacity-50" />
          <ellipse cx="48" cy="205" rx="10" ry="18" transform="rotate(35 48 205)" fill="currentColor" className="opacity-55" />
          {/* Main Stem Node 1 */}
          <ellipse cx="45" cy="165" rx="9" ry="16" transform="rotate(-30 45 165)" fill="currentColor" className="opacity-60" />
          <ellipse cx="68" cy="155" rx="9" ry="16" transform="rotate(35 68 155)" fill="currentColor" className="opacity-65" />
          {/* Main Stem Node 2 */}
          <ellipse cx="58" cy="120" rx="8" ry="15" transform="rotate(-28 58 120)" fill="currentColor" className="opacity-70" />
          <ellipse cx="78" cy="110" rx="8" ry="15" transform="rotate(32 78 110)" fill="currentColor" className="opacity-75" />
          {/* Main Stem Node 3 */}
          <ellipse cx="68" cy="75" rx="7.5" ry="14" transform="rotate(-25 68 75)" fill="currentColor" className="opacity-80" />
          <ellipse cx="88" cy="68" rx="7.5" ry="14" transform="rotate(30 88 68)" fill="currentColor" className="opacity-85" />
          {/* Main Stem Crown Sage Florets */}
          <ellipse cx="84" cy="28" rx="6" ry="12" fill="currentColor" className="opacity-95" />
          <circle cx="85" cy="16" r="4" fill="currentColor" className="opacity-90" />

          {/* Left Stalk Leaves & Flower */}
          <ellipse cx="32" cy="115" rx="7.5" ry="14" transform="rotate(-30 32 115)" fill="currentColor" className="opacity-60" />
          <ellipse cx="48" cy="105" rx="7.5" ry="14" transform="rotate(30 48 105)" fill="currentColor" className="opacity-65" />
          <ellipse cx="40" cy="65" rx="5.5" ry="10" fill="currentColor" className="opacity-90" />

          {/* Right Stalk Leaves & Flower */}
          <ellipse cx="102" cy="125" rx="8" ry="15" transform="rotate(-25 102 125)" fill="currentColor" className="opacity-65" />
          <ellipse cx="124" cy="115" rx="8" ry="15" transform="rotate(35 124 115)" fill="currentColor" className="opacity-70" />
          <ellipse cx="128" cy="75" rx="6" ry="11" fill="currentColor" className="opacity-90" />

          {/* Lower Right Stalk Flower */}
          <ellipse cx="150" cy="135" rx="5" ry="9" fill="currentColor" className="opacity-85" />
        </svg>
      );

    case "clay":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Main Dahlia / Terracotta Stem */}
          <path d="M20 240 C 35 180, 60 120, 85 45" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="opacity-75" />
          {/* Left Stem */}
          <path d="M15 240 C 22 185, 30 135, 38 85" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-65" />
          {/* Right Stem */}
          <path d="M25 240 C 50 190, 90 150, 125 90" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-70" />
          {/* Lower Right Branch */}
          <path d="M30 240 C 65 215, 115 190, 150 145" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="opacity-60" />

          {/* Broad Botanical Leaves */}
          <path d="M38 190 C 18 182, 12 160, 24 145 C 34 160, 40 178, 38 190 Z" fill="currentColor" className="opacity-50" />
          <path d="M48 160 C 70 150, 84 130, 78 112 C 65 128, 54 148, 48 160 Z" fill="currentColor" className="opacity-55" />
          <path d="M58 125 C 40 115, 35 95, 48 82 C 58 95, 62 112, 58 125 Z" fill="currentColor" className="opacity-60" />

          {/* Master Layered Dahlia Blossom (Main Stem) */}
          <g transform="translate(85, 45)" fill="currentColor">
            {/* Outer Petal Ring */}
            <circle cx="-13" cy="-6" r="7" className="opacity-65" />
            <circle cx="0" cy="-14" r="7" className="opacity-70" />
            <circle cx="13" cy="-6" r="7" className="opacity-65" />
            <circle cx="10" cy="10" r="7" className="opacity-75" />
            <circle cx="-10" cy="10" r="7" className="opacity-75" />
            {/* Mid Ring */}
            <circle cx="-7" cy="-3" r="6" className="opacity-80" />
            <circle cx="7" cy="-3" r="6" className="opacity-80" />
            <circle cx="0" cy="6" r="6" className="opacity-85" />
            {/* Center Core */}
            <circle cx="0" cy="1" r="4.5" fill="#ffffff" fillOpacity="0.75" />
          </g>

          {/* Secondary Dahlia (Left Stem) */}
          <g transform="translate(38, 85)" fill="currentColor">
            <circle cx="-9" cy="-4" r="5.5" className="opacity-70" />
            <circle cx="0" cy="-10" r="5.5" className="opacity-75" />
            <circle cx="9" cy="-4" r="5.5" className="opacity-70" />
            <circle cx="7" cy="7" r="5.5" className="opacity-80" />
            <circle cx="-7" cy="7" r="5.5" className="opacity-80" />
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" fillOpacity="0.7" />
          </g>

          {/* Third Wildflower Head (Right Stem) */}
          <g transform="translate(125, 90)" fill="currentColor">
            <circle cx="-10" cy="-5" r="6" className="opacity-70" />
            <circle cx="0" cy="-11" r="6" className="opacity-75" />
            <circle cx="10" cy="-5" r="6" className="opacity-70" />
            <circle cx="8" cy="8" r="6" className="opacity-80" />
            <circle cx="-8" cy="8" r="6" className="opacity-80" />
            <circle cx="0" cy="1" r="4" fill="#ffffff" fillOpacity="0.75" />
          </g>

          {/* Lower Right Blossom Bud */}
          <ellipse cx="150" cy="145" rx="5" ry="8" fill="currentColor" className="opacity-85" />
        </svg>
      );

    case "berry":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Main Arching Berry Branch */}
          <path d="M20 240 C 35 180, 60 110, 85 30" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className="opacity-75" />
          {/* Left Branch */}
          <path d="M15 240 C 22 185, 30 135, 38 75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-65" />
          {/* Right Branch */}
          <path d="M25 240 C 50 190, 95 150, 130 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
          {/* Lower Right Branch */}
          <path d="M30 240 C 65 215, 115 190, 150 140" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="opacity-60" />

          {/* Foliage Leaves */}
          <path d="M38 185 Q 18 175 22 160 Q 32 170 38 185 Z" fill="currentColor" className="opacity-50" />
          <path d="M52 145 Q 35 130 46 118 Q 52 132 52 145 Z" fill="currentColor" className="opacity-55" />
          <path d="M68 95 Q 52 80 62 68 Q 68 82 68 95 Z" fill="currentColor" className="opacity-60" />

          {/* Top Berry Cluster (Main Stem) */}
          <circle cx="85" cy="28" r="6" fill="currentColor" className="opacity-95" />
          <circle cx="93" cy="33" r="5.2" fill="currentColor" className="opacity-90" />
          <circle cx="78" cy="34" r="5" fill="currentColor" className="opacity-85" />
          <circle cx="86" cy="40" r="4.8" fill="currentColor" className="opacity-90" />
          {/* Berry Highlights */}
          <circle cx="83" cy="26" r="1.5" fill="#ffffff" fillOpacity="0.8" />
          <circle cx="91" cy="31" r="1.3" fill="#ffffff" fillOpacity="0.8" />

          {/* Mid Berry Cluster (Main Stem) */}
          <circle cx="72" cy="75" r="5.5" fill="currentColor" className="opacity-90" />
          <circle cx="80" cy="80" r="5" fill="currentColor" className="opacity-85" />
          <circle cx="68" cy="83" r="4.5" fill="currentColor" className="opacity-80" />

          {/* Left Branch Berry Cluster */}
          <circle cx="38" cy="72" r="5.5" fill="currentColor" className="opacity-90" />
          <circle cx="45" cy="78" r="5" fill="currentColor" className="opacity-85" />
          <circle cx="32" cy="79" r="4.8" fill="currentColor" className="opacity-80" />
          <circle cx="39" cy="85" r="4.2" fill="currentColor" className="opacity-85" />

          {/* Right Branch Berry Cluster */}
          <circle cx="130" cy="78" r="6" fill="currentColor" className="opacity-90" />
          <circle cx="138" cy="84" r="5.2" fill="currentColor" className="opacity-85" />
          <circle cx="123" cy="85" r="5" fill="currentColor" className="opacity-80" />
          <circle cx="132" cy="92" r="4.8" fill="currentColor" className="opacity-85" />
          {/* Berry Highlight */}
          <circle cx="128" cy="76" r="1.5" fill="#ffffff" fillOpacity="0.8" />

          {/* Lower Right Branch Berry Cluster */}
          <circle cx="150" cy="138" r="5.2" fill="currentColor" className="opacity-85" />
          <circle cx="157" cy="144" r="4.8" fill="currentColor" className="opacity-80" />
          <circle cx="144" cy="145" r="4.5" fill="currentColor" className="opacity-80" />
        </svg>
      );

    case "orchid":
      return (
        <svg viewBox="0 0 180 240" fill="none" className={baseClass} aria-hidden="true">
          {/* Main Sweeping Orchid Cane */}
          <path d="M15 240 C 35 180, 55 120, 85 40" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" className="opacity-75" />
          {/* Secondary Arching Cane */}
          <path d="M12 240 C 20 185, 30 140, 42 80" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-65" />
          {/* Right Arching Cane */}
          <path d="M22 240 C 45 190, 85 155, 128 85" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="opacity-70" />

          {/* Thick Basal Orchid Leaves */}
          <path d="M18 230 C -2 210, -2 180, 14 150 C 22 175, 26 210, 22 230 Z" fill="currentColor" className="opacity-45" />
          <path d="M25 220 C 50 205, 68 180, 65 150 C 50 170, 35 200, 25 220 Z" fill="currentColor" className="opacity-50" />

          {/* Master Orchid Bloom (Main Cane - Highest) */}
          <g transform="translate(85, 45)" fill="currentColor">
            {/* Dorsal Sepal */}
            <ellipse cx="0" cy="-12" rx="6" ry="9" className="opacity-80" />
            {/* Lateral Sepals */}
            <ellipse cx="-11" cy="-7" rx="5.5" ry="8.5" transform="rotate(-30 -11 -7)" className="opacity-75" />
            <ellipse cx="11" cy="-7" rx="5.5" ry="8.5" transform="rotate(30 11 -7)" className="opacity-75" />
            {/* Broad Lateral Wings / Petals */}
            <circle cx="-10" cy="3" r="7.5" className="opacity-85" />
            <circle cx="10" cy="3" r="7.5" className="opacity-85" />
            {/* Distinct Labellum Lip */}
            <path d="M0 0 C -6 11, 6 11, 0 0 Z" className="opacity-95" />
            <circle cx="0" cy="2" r="2.5" fill="#ffffff" fillOpacity="0.85" />
          </g>

          {/* Mid Orchid Bloom (Main Cane) */}
          <g transform="translate(68, 95)" fill="currentColor">
            <ellipse cx="0" cy="-10" rx="5.5" ry="8" className="opacity-80" />
            <ellipse cx="-9" cy="-6" rx="5" ry="7.5" transform="rotate(-30 -9 -6)" className="opacity-75" />
            <ellipse cx="9" cy="-6" rx="5" ry="7.5" transform="rotate(30 9 -6)" className="opacity-75" />
            <circle cx="-8" cy="2.5" r="6.5" className="opacity-85" />
            <circle cx="8" cy="2.5" r="6.5" className="opacity-85" />
            <path d="M0 0 C -5 9, 5 9, 0 0 Z" className="opacity-95" />
            <circle cx="0" cy="1.8" r="2.2" fill="#ffffff" fillOpacity="0.8" />
          </g>

          {/* Left Cane Orchid Bloom */}
          <g transform="translate(42, 85)" fill="currentColor">
            <ellipse cx="0" cy="-9" rx="5" ry="7.5" className="opacity-75" />
            <ellipse cx="-8" cy="-5" rx="4.5" ry="7" transform="rotate(-30 -8 -5)" className="opacity-70" />
            <ellipse cx="8" cy="-5" rx="4.5" ry="7" transform="rotate(30 8 -5)" className="opacity-70" />
            <circle cx="-7" cy="2" r="6" className="opacity-80" />
            <circle cx="7" cy="2" r="6" className="opacity-80" />
            <path d="M0 0 C -4.5 8, 4.5 8, 0 0 Z" className="opacity-95" />
          </g>

          {/* Right Cane Orchid Bloom */}
          <g transform="translate(128, 90)" fill="currentColor">
            <ellipse cx="0" cy="-10" rx="5.5" ry="8" className="opacity-80" />
            <ellipse cx="-9" cy="-6" rx="5" ry="7.5" transform="rotate(-30 -9 -6)" className="opacity-75" />
            <ellipse cx="9" cy="-6" rx="5" ry="7.5" transform="rotate(30 9 -6)" className="opacity-75" />
            <circle cx="-8" cy="2.5" r="6.5" className="opacity-85" />
            <circle cx="8" cy="2.5" r="6.5" className="opacity-85" />
            <path d="M0 0 C -5 9, 5 9, 0 0 Z" className="opacity-95" />
            <circle cx="0" cy="1.8" r="2.2" fill="#ffffff" fillOpacity="0.8" />
          </g>

          {/* Cascading Round Buds at Cane Tips */}
          <circle cx="95" cy="25" r="4.5" fill="currentColor" className="opacity-90" />
          <circle cx="102" cy="18" r="3.5" fill="currentColor" className="opacity-85" />
          <circle cx="138" cy="74" r="4" fill="currentColor" className="opacity-90" />
          <circle cx="145" cy="68" r="3.2" fill="currentColor" className="opacity-85" />
        </svg>
      );

    case "lavender":
    default:
      return (
        <svg viewBox="0 0 160 250" fill="none" className={baseClass} aria-hidden="true">
          {/* Base Flowing Ribbons & Botanical Grounding Wash (matching user screenshot) */}
          <path
            d="M 0 236 C 30 224, 70 227, 120 240 C 80 232, 40 232, 0 242 Z"
            fill="currentColor"
            className="opacity-35"
          />
          <path
            d="M 0 242 C 40 230, 90 234, 150 246 C 95 240, 45 240, 0 248 Z"
            fill="currentColor"
            className="opacity-25"
          />
          <path
            d="M 0 246 C 30 238, 70 240, 115 250"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* 5 Layered Stalks Rising from Bottom-Left */}
          {/* 1. Far-left low accent stem */}
          <path d="M 14 246 C 15 208, 17 175, 20 142" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="opacity-60" />
          {/* 2. Left arching stem */}
          <path d="M 20 246 C 23 185, 28 125, 34 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
          {/* 3. Main tall center-left stem */}
          <path d="M 26 246 C 36 175, 52 105, 68 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="opacity-75" />
          {/* 4. Center-right arching stem */}
          <path d="M 30 246 C 46 185, 78 140, 106 82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
          {/* 5. Far-right lower stem */}
          <path d="M 34 246 C 56 210, 92 180, 126 128" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="opacity-60" />

          {/* Slender Curved Foliage Leaves */}
          <path d="M 16 226 C 2 205, 4 170, 16 145 C 19 170, 24 205, 18 226 Z" fill="currentColor" className="opacity-45" />
          <path d="M 26 218 C 50 208, 68 185, 70 155 C 58 178, 42 200, 28 215 Z" fill="currentColor" className="opacity-50" />
          <path d="M 40 165 C 66 155, 84 130, 88 105 C 76 128, 60 150, 42 162 Z" fill="currentColor" className="opacity-45" />
          <path d="M 28 130 C 14 112, 10 90, 16 72 C 22 90, 30 112, 32 128 Z" fill="currentColor" className="opacity-40" />

          {/* 1. Main Center-Left Tall Lavender Spike (Tiered Angled Florets) */}
          <ellipse cx="68" cy="24" rx="3.5" ry="5.5" fill="currentColor" className="opacity-85" />
          <ellipse cx="63" cy="33" rx="4.5" ry="7" transform="rotate(-25 63 33)" fill="currentColor" className="opacity-80" />
          <ellipse cx="73" cy="34" rx="4.5" ry="7" transform="rotate(25 73 34)" fill="currentColor" className="opacity-85" />
          <ellipse cx="68" cy="31" rx="4" ry="6" fill="currentColor" className="opacity-70" />
          {/* Tier 2 */}
          <ellipse cx="60" cy="45" rx="5" ry="7.5" transform="rotate(-28 60 45)" fill="currentColor" className="opacity-80" />
          <ellipse cx="73" cy="46" rx="5" ry="7.5" transform="rotate(28 73 46)" fill="currentColor" className="opacity-90" />
          <ellipse cx="66" cy="43" rx="4.5" ry="6.5" fill="currentColor" className="opacity-75" />
          {/* Tier 3 */}
          <ellipse cx="57" cy="58" rx="5.5" ry="8" transform="rotate(-30 57 58)" fill="currentColor" className="opacity-85" />
          <ellipse cx="72" cy="60" rx="5.5" ry="8" transform="rotate(30 72 60)" fill="currentColor" className="opacity-90" />
          <ellipse cx="64" cy="56" rx="4.8" ry="7" fill="currentColor" className="opacity-70" />
          {/* Tier 4 */}
          <ellipse cx="54" cy="73" rx="5.5" ry="8" transform="rotate(-32 54 73)" fill="currentColor" className="opacity-85" />
          <ellipse cx="70" cy="75" rx="5.5" ry="8" transform="rotate(32 70 75)" fill="currentColor" className="opacity-95" />
          <ellipse cx="62" cy="71" rx="5" ry="7" fill="currentColor" className="opacity-75" />
          {/* Tier 5 */}
          <ellipse cx="51" cy="89" rx="6" ry="8.5" transform="rotate(-34 51 89)" fill="currentColor" className="opacity-90" />
          <ellipse cx="68" cy="91" rx="6" ry="8.5" transform="rotate(34 68 91)" fill="currentColor" className="opacity-95" />
          <ellipse cx="59" cy="87" rx="5.2" ry="7.5" fill="currentColor" className="opacity-75" />
          {/* Tier 6 */}
          <ellipse cx="48" cy="107" rx="6" ry="8.5" transform="rotate(-35 48 107)" fill="currentColor" className="opacity-85" />
          <ellipse cx="66" cy="109" rx="6" ry="8.5" transform="rotate(35 66 109)" fill="currentColor" className="opacity-90" />
          <ellipse cx="57" cy="105" rx="5.2" ry="7.5" fill="currentColor" className="opacity-70" />
          {/* Tier 7 */}
          <ellipse cx="44" cy="126" rx="6" ry="8.5" transform="rotate(-35 44 126)" fill="currentColor" className="opacity-85" />
          <ellipse cx="63" cy="128" rx="6" ry="8.5" transform="rotate(35 63 128)" fill="currentColor" className="opacity-90" />
          {/* Tier 8 */}
          <ellipse cx="40" cy="146" rx="5.8" ry="8" transform="rotate(-35 40 146)" fill="currentColor" className="opacity-80" />
          <ellipse cx="59" cy="148" rx="5.8" ry="8" transform="rotate(35 59 148)" fill="currentColor" className="opacity-85" />
          {/* Tier 9 */}
          <ellipse cx="36" cy="167" rx="5.5" ry="8" transform="rotate(-35 36 167)" fill="currentColor" className="opacity-75" />
          <ellipse cx="55" cy="169" rx="5.5" ry="8" transform="rotate(35 55 169)" fill="currentColor" className="opacity-80" />
          {/* Tier 10 */}
          <ellipse cx="32" cy="188" rx="5" ry="7.5" transform="rotate(-35 32 188)" fill="currentColor" className="opacity-70" />
          <ellipse cx="51" cy="190" rx="5" ry="7.5" transform="rotate(35 51 190)" fill="currentColor" className="opacity-75" />

          {/* 2. Left Arching Stem Flower Spike */}
          <ellipse cx="34" cy="68" rx="3.5" ry="5.5" fill="currentColor" className="opacity-80" />
          <ellipse cx="28" cy="77" rx="4" ry="6.5" transform="rotate(-25 28 77)" fill="currentColor" className="opacity-75" />
          <ellipse cx="39" cy="78" rx="4" ry="6.5" transform="rotate(25 39 78)" fill="currentColor" className="opacity-80" />
          {/* Tier 2 */}
          <ellipse cx="25" cy="89" rx="4.5" ry="7" transform="rotate(-28 25 89)" fill="currentColor" className="opacity-80" />
          <ellipse cx="38" cy="90" rx="4.5" ry="7" transform="rotate(28 38 90)" fill="currentColor" className="opacity-85" />
          {/* Tier 3 */}
          <ellipse cx="22" cy="103" rx="5" ry="7.5" transform="rotate(-30 22 103)" fill="currentColor" className="opacity-80" />
          <ellipse cx="36" cy="104" rx="5" ry="7.5" transform="rotate(30 36 104)" fill="currentColor" className="opacity-85" />
          {/* Tier 4 */}
          <ellipse cx="20" cy="119" rx="5" ry="7.5" transform="rotate(-32 20 119)" fill="currentColor" className="opacity-75" />
          <ellipse cx="34" cy="120" rx="5" ry="7.5" transform="rotate(32 34 120)" fill="currentColor" className="opacity-80" />
          {/* Tier 5 */}
          <ellipse cx="18" cy="136" rx="5.2" ry="7.8" transform="rotate(-32 18 136)" fill="currentColor" className="opacity-75" />
          <ellipse cx="32" cy="137" rx="5.2" ry="7.8" transform="rotate(32 32 137)" fill="currentColor" className="opacity-80" />
          {/* Tier 6 */}
          <ellipse cx="16" cy="154" rx="5" ry="7.5" transform="rotate(-32 16 154)" fill="currentColor" className="opacity-70" />
          <ellipse cx="30" cy="155" rx="5" ry="7.5" transform="rotate(32 30 155)" fill="currentColor" className="opacity-75" />
          {/* Tier 7 */}
          <ellipse cx="15" cy="173" rx="4.8" ry="7" transform="rotate(-30 15 173)" fill="currentColor" className="opacity-65" />
          <ellipse cx="28" cy="174" rx="4.8" ry="7" transform="rotate(30 28 174)" fill="currentColor" className="opacity-70" />

          {/* 3. Center-Right Arching Stem Flower Spike */}
          <ellipse cx="106" cy="82" rx="3.5" ry="5.5" fill="currentColor" className="opacity-80" />
          <ellipse cx="100" cy="91" rx="4.2" ry="6.5" transform="rotate(-25 100 91)" fill="currentColor" className="opacity-75" />
          <ellipse cx="111" cy="92" rx="4.2" ry="6.5" transform="rotate(25 111 92)" fill="currentColor" className="opacity-85" />
          {/* Tier 2 */}
          <ellipse cx="94" cy="103" rx="4.8" ry="7" transform="rotate(-28 94 103)" fill="currentColor" className="opacity-80" />
          <ellipse cx="107" cy="105" rx="4.8" ry="7" transform="rotate(28 107 105)" fill="currentColor" className="opacity-90" />
          {/* Tier 3 */}
          <ellipse cx="88" cy="117" rx="5" ry="7.5" transform="rotate(-30 88 117)" fill="currentColor" className="opacity-80" />
          <ellipse cx="102" cy="119" rx="5" ry="7.5" transform="rotate(30 102 119)" fill="currentColor" className="opacity-85" />
          {/* Tier 4 */}
          <ellipse cx="81" cy="133" rx="5.2" ry="7.8" transform="rotate(-32 81 133)" fill="currentColor" className="opacity-80" />
          <ellipse cx="96" cy="135" rx="5.2" ry="7.8" transform="rotate(32 96 135)" fill="currentColor" className="opacity-85" />
          {/* Tier 5 */}
          <ellipse cx="73" cy="150" rx="5.2" ry="7.8" transform="rotate(-32 73 150)" fill="currentColor" className="opacity-75" />
          <ellipse cx="89" cy="152" rx="5.2" ry="7.8" transform="rotate(32 89 152)" fill="currentColor" className="opacity-80" />
          {/* Tier 6 */}
          <ellipse cx="66" cy="168" rx="5" ry="7.5" transform="rotate(-32 66 168)" fill="currentColor" className="opacity-70" />
          <ellipse cx="82" cy="170" rx="5" ry="7.5" transform="rotate(32 82 170)" fill="currentColor" className="opacity-75" />

          {/* 4. Far-Right Lower Stem Spike */}
          <ellipse cx="126" cy="128" rx="3.5" ry="5.5" fill="currentColor" className="opacity-75" />
          <ellipse cx="120" cy="137" rx="4" ry="6.2" transform="rotate(-25 120 137)" fill="currentColor" className="opacity-70" />
          <ellipse cx="131" cy="139" rx="4" ry="6.2" transform="rotate(25 131 139)" fill="currentColor" className="opacity-80" />
          {/* Tier 2 */}
          <ellipse cx="113" cy="150" rx="4.5" ry="6.8" transform="rotate(-28 113 150)" fill="currentColor" className="opacity-75" />
          <ellipse cx="126" cy="152" rx="4.5" ry="6.8" transform="rotate(28 126 152)" fill="currentColor" className="opacity-85" />
          {/* Tier 3 */}
          <ellipse cx="105" cy="165" rx="4.8" ry="7" transform="rotate(-30 105 165)" fill="currentColor" className="opacity-75" />
          <ellipse cx="119" cy="167" rx="4.8" ry="7" transform="rotate(30 119 167)" fill="currentColor" className="opacity-80" />
          {/* Tier 4 */}
          <ellipse cx="96" cy="181" rx="5" ry="7.2" transform="rotate(-30 96 181)" fill="currentColor" className="opacity-70" />
          <ellipse cx="111" cy="183" rx="5" ry="7.2" transform="rotate(30 111 183)" fill="currentColor" className="opacity-75" />

          {/* 5. Far-Left Accent Stem Spike */}
          <ellipse cx="20" cy="142" rx="3.2" ry="5" fill="currentColor" className="opacity-75" />
          <ellipse cx="15" cy="153" rx="3.8" ry="6" transform="rotate(-25 15 153)" fill="currentColor" className="opacity-70" />
          <ellipse cx="25" cy="154" rx="3.8" ry="6" transform="rotate(25 25 154)" fill="currentColor" className="opacity-75" />
          {/* Tier 2 */}
          <ellipse cx="13" cy="168" rx="4.2" ry="6.5" transform="rotate(-28 13 168)" fill="currentColor" className="opacity-70" />
          <ellipse cx="24" cy="170" rx="4.2" ry="6.5" transform="rotate(28 24 170)" fill="currentColor" className="opacity-75" />
          {/* Tier 3 */}
          <ellipse cx="12" cy="184" rx="4.5" ry="6.8" transform="rotate(-30 12 184)" fill="currentColor" className="opacity-65" />
          <ellipse cx="23" cy="186" rx="4.5" ry="6.8" transform="rotate(30 23 186)" fill="currentColor" className="opacity-70" />
        </svg>
      );
  }
}
