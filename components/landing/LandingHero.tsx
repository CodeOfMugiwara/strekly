"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import { ThemeSwatches } from "@/components/ui/ThemeSwatches";
import { LandingHabitGrid } from "@/components/landing/LandingHabitGrid";
import { Reveal } from "@/components/landing/Reveal";

/**
 * Hero.
 *
 * The headline sells the OUTCOME ("build the version of you that shows
 * up"), not the feature list. The product visual sits beside it — a
 * research-backed pattern: visitors convert on seeing the real product,
 * and the mascot carries the emotional half of the pitch.
 */
export function LandingHero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Ambient wash — the aurora idea, but static so it never fights
          the scroll reveals. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 32rem at 78% -8%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 70%), radial-gradient(48rem 30rem at 6% 8%, color-mix(in srgb, var(--color-info) 12%, transparent), transparent 68%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-lightest/70 px-3.5 py-1.5 text-xs font-medium text-primary-text">
              <Sparkles className="h-3.5 w-3.5" />
              Habits, mood and streaks in one calm place
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-6xl">
              Build the version of you that{" "}
              <span className="relative inline-block">
                <span className="relative z-10">shows up.</span>
                <motion.span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-primary/35"
                  initial={reduced ? false : { scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.35,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Track habits and mood together, spot what fuels your momentum, and
              build streaks that endure. With partial credit for messy days and
              zero shame, consistency becomes second nature.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login?mode=signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-on shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start tracking free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-6 py-3 text-sm font-semibold text-text-secondary backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                See how it works
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
              <span>Free forever</span>
              <span>•</span>
              <span>No credit card required</span>
              <span>•</span>
              <span>End-to-end private</span>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8">
              <LumiMascot
                mood="happy"
                size="sm"
                message="Small steps, every day. I'll keep count of the good ones."
                caption="Lumi is your habit companion — tap for a nudge."
              />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className="relative">
            <div className="mb-3 flex justify-end">
              <ThemeSwatches />
            </div>
            <LandingHabitGrid />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
