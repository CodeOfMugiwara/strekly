"use client";

import { Check, X, Sparkles, Zap, Shield, HeartHandshake } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

type ComparisonRow = {
  feature: string;
  others: string;
  strekly: string;
};

const COMPARISONS: ComparisonRow[] = [
  {
    feature: "Streak Philosophy",
    others: "Rigid all-or-nothing. Miss a day by 10 minutes and your entire 90-day streak is wiped.",
    strekly: "Ternary state (done, partial, missed). Partial credit keeps your momentum alive on hectic days.",
  },
  {
    feature: "Daily Interaction",
    others: "Cluttered with XP bars, avatar dress-up, coin shops, and paywalled reminder alarms.",
    strekly: "Calm Lavender Sky interface. One tap to check in, zero ad interruptions or gamified bloat.",
  },
  {
    feature: "Holistic Health",
    others: "Habits tracked in isolation from your sleep, energy, or mental wellbeing.",
    strekly: "Unified daily journal: habits, mood scores, and reflection notes correlated together.",
  },
  {
    feature: "Visual Analytics",
    others: "Basic bar charts or confusing ring graphs that look pretty but don't show real trends.",
    strekly: "Full GitHub-style contribution heatmap and deterministic rhythm insights across 52 weeks.",
  },
  {
    feature: "Privacy & Data",
    others: "Your habits and mental health logs sold to advertisers or locked in proprietary silos.",
    strekly: "End-to-end Row-Level Security (RLS) on Postgres. One-click instant JSON export anytime.",
  },
];

export function LandingComparison() {
  return (
    <section id="comparison" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-text">
          The difference
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Built for real consistency, not guilt
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          Most habit trackers treat you like a robot that never gets sick, travels, or works late.
          Strekly is designed for actual humans.
        </p>
      </Reveal>

      {/* Comparison Table / Bento Matrix */}
      <Reveal delay={0.08}>
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface/90 shadow-card backdrop-blur-md">
          {/* Header Row */}
          <div className="grid grid-cols-1 border-b border-border/70 bg-surface-hover/50 sm:grid-cols-[1.2fr_1.4fr_1.6fr]">
            <div className="hidden p-4 text-xs font-bold uppercase tracking-wider text-text-muted sm:block">
              Dimension
            </div>
            <div className="border-b border-border/50 p-4 text-xs font-bold uppercase tracking-wider text-text-muted sm:border-b-0 sm:border-l">
              Traditional Habit Apps & Spreadsheets
            </div>
            <div className="flex items-center gap-2 border-l border-primary/20 bg-primary-lightest/40 p-4 text-xs font-bold uppercase tracking-wider text-primary-text">
              <Sparkles className="h-4 w-4" />
              The Strekly Way
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/60">
            {COMPARISONS.map((row, idx) => (
              <div
                key={row.feature}
                className="grid grid-cols-1 transition-colors hover:bg-surface-hover/30 sm:grid-cols-[1.2fr_1.4fr_1.6fr]"
              >
                {/* Feature Name */}
                <div className="flex items-center gap-2 bg-surface/40 p-4 font-semibold text-text sm:bg-transparent">
                  <span className="text-sm">{row.feature}</span>
                </div>

                {/* Other apps */}
                <div className="flex items-start gap-2.5 p-4 text-sm leading-relaxed text-text-muted sm:border-l sm:border-border/60">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-error/15 text-error">
                    <X className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>{row.others}</span>
                </div>

                {/* Strekly */}
                <div className="flex items-start gap-2.5 border-l border-primary/20 bg-primary-lightest/20 p-4 text-sm font-medium leading-relaxed text-text sm:bg-primary-lightest/15">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>{row.strekly}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
