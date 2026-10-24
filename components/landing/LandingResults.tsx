"use client";

import { motion, useReducedMotion } from "motion/react";
import { CalendarDays, Heart, LineChart, Sparkles } from "lucide-react";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import { LandingHeatmap } from "@/components/landing/LandingHeatmap";
import { StatusGlyph } from "@/components/ui/StatusGlyph";
import { Reveal } from "@/components/landing/Reveal";
import { cn } from "@/lib/utils";
import type { HabitStatus } from "@/types";

/**
 * Results — a bento grid of OUTCOMES.
 *
 * Every tile is what the user GETS: honest data, consistency heatmaps,
 * mood correlations, and a quiet companion.
 */
export function LandingResults() {
  const reduced = useReducedMotion();

  const previewStatuses: HabitStatus[] = [
    "done",
    "done",
    "partial",
    "done",
    "missed",
    "done",
    "done",
  ];

  return (
    <section id="results" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-text">
          What you get
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          See what is actually working
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          Most habit apps show you an artificial gamified checklist. Strekly gives
          you an honest picture of your consistency and well-being.
        </p>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Flagship — a year of consistency */}
        <Reveal className="sm:col-span-2 lg:row-span-2" delay={0.04}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="group h-full rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-card backdrop-blur-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
              <LineChart className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-text">
              A year of consistency, in one glance
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Every day you showed up, mapped out with GitHub-style contribution
              clarity. Celebrate steady momentum and spot the quiet gaps before
              they become habits.
            </p>

            <LandingHeatmap weeks={16} className="mt-6" />
          </motion.div>
        </Reveal>

        {/* Mood correlation */}
        <Reveal delay={0.1}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="group h-full rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-card backdrop-blur-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-text">
              Spot your natural rhythms
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Correlate daily energy with completed habits. Discover which routines
              lift your spirits and when you need lighter targets.
            </p>
            <div className="mt-5 flex items-end gap-1.5" aria-hidden>
              {[38, 62, 30, 74, 45, 88, 52, 70, 34, 92, 58, 80].map(
                (h, i) => (
                  <motion.span
                    key={i}
                    className="w-full rounded-sm bg-primary/45"
                    style={{ height: `${h * 0.5}px` }}
                    initial={reduced ? false : { scaleY: 0.2, originY: 1 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.45,
                      delay: reduced ? 0 : i * 0.05,
                    }}
                  />
                ),
              )}
            </div>
          </motion.div>
        </Reveal>

        {/* Missed days are data */}
        <Reveal delay={0.16}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="group h-full rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-card backdrop-blur-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
              <Heart className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-text">
              Honest data over perfection
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Partial days acknowledge real effort without breaking stride. Missed
              days are treated as feedback, not moral failure.
            </p>
            <div className="mt-5 flex gap-1.5" aria-hidden>
              {previewStatuses.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-7 flex-1 items-center justify-center rounded-lg border text-xs font-bold shadow-xs",
                    s === "done" && "border-transparent bg-success text-success-foreground",
                    s === "partial" && "border-transparent bg-warning text-warning-foreground",
                    s === "missed" && "border-transparent bg-error text-error-foreground",
                  )}
                >
                  <StatusGlyph status={s} size={13} />
                </div>
              ))}
            </div>
          </motion.div>
        </Reveal>

        {/* One place for the whole day */}
        <Reveal delay={0.22}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="group h-full rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-card backdrop-blur-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
              <CalendarDays className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-text">
              Habits, mood and notes in one view
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Open the day and see your habits, mood score, and reflection notes
              side-by-side. No juggling disconnected tools.
            </p>
          </motion.div>
        </Reveal>

        {/* Mascot — the emotional closer on the grid */}
        <Reveal delay={0.28} className="sm:col-span-2">
          <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-primary/20 bg-primary-lightest/50 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-text">
                A companion, not a nag
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
                Lumi keeps the tone encouraging. No fake alarms, no guilt trips,
                no pop-up spam — just calm support when you show up.
              </p>
            </div>
            <LumiMascot
              mood="supportive"
              size="md"
              message="You showed up 5 days this week. That's real progress."
              caption="Tap Lumi for an encouraging nudge."
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
