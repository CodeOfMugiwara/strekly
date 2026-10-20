"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import { Reveal } from "@/components/landing/Reveal";

/**
 * Closing CTA.
 *
 * The research is consistent that the ask should be repeated at logical
 * scroll intervals, with one primary action and no competing buttons.
 */
export function LandingCta() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52rem 26rem at 50% 120%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Start showing up
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
            Two minutes to set up. One glance a day to know if it is
            working.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href="/login?mode=signup"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-on shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Create your free account
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex justify-center">
            <motion.div
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <LumiMascot
                mood="celebrate"
                size="md"
                message="I'll be here. Let's make the next week a good one."
                caption="Lumi, your habit companion"
              />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
