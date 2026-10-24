"use client";

import { CheckCircle2 } from "lucide-react";
import { LumiMascot } from "@/components/mascot/LumiMascot";
import { Reveal } from "@/components/landing/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Define your daily rituals",
    body: "Create habits you genuinely care about. Organize with custom categories, pick expressive emojis, and set weekly consistency targets.",
  },
  {
    n: "02",
    title: "Log with a single tap",
    body: "Done (✓), partial (~), or missed (✗). Partial completion records honest effort and protects your momentum on hectic days.",
  },
  {
    n: "03",
    title: "Uncover your natural rhythm",
    body: "GitHub-style consistency heatmaps, streak analysis, and mood correlations reveal exactly which habits lift your energy.",
  },
];

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-border/70 bg-surface/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-text">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Three steps, then it runs itself
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border/80 bg-surface/80 p-6 backdrop-blur-md transition-colors hover:border-primary/35">
                <span className="text-xs font-bold tracking-widest text-primary-text">
                  {step.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-text">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-text-secondary">
            {[
              "Free forever",
              "No credit card",
              "Your data stays yours",
              "Works on any screen",
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary-text" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.16} className="mt-10 flex justify-center">
          <LumiMascot
            mood="streak"
            size="md"
            message="Three steps. Then the only thing left is showing up."
            caption="Tap Lumi any time."
          />
        </Reveal>
      </div>
    </section>
  );
}
