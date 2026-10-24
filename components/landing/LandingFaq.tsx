"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "Is Strekly completely free?",
    answer:
      "Yes. Core tracking — unlimited habits, daily check-ins, mood logs, notes, and your 52-week consistency heatmap — is 100% free forever. No credit card is required to sign up, and there are no surprise trial expirations.",
  },
  {
    question: "How does partial credit work, and why does it matter?",
    answer:
      "Life isn't all-or-nothing. If your target is running 5km and you only managed a 2km jog, traditional apps penalize you with an unbroken streak reset. Strekly lets you log a partial completion (~). It records honest effort, preserves your psychological momentum, and keeps you from abandoning the habit altogether.",
  },
  {
    question: "How is my personal data and habit history protected?",
    answer:
      "Your data is isolated in a secure Postgres database with strict Row-Level Security (RLS) policies. Only your authenticated session can ever access or modify your records. We don't embed ad trackers, third-party analytics pixels, or sell data to brokers.",
  },
  {
    question: "Can I export my data anytime?",
    answer:
      "Yes. You own everything you log. At any time in Settings, you can download a clean, uncompressed JSON export containing all your habits, check-in logs, and mood history in a single click.",
  },
  {
    question: "Can I use Strekly on my phone as an app?",
    answer:
      "Yes! Strekly is fully responsive and designed mobile-first. You can install it directly to your iOS or Android home screen as a Progressive Web App (PWA) for full-screen, tactile check-ins with no App Store downloads required.",
  },
  {
    question: "Who is Lumi, and will it nag me?",
    answer:
      "Lumi is your quiet habit companion. Lumi never sends spammy push notifications, guilt-trips you for taking a rest day, or clutters your screen with artificial gamification popups. Lumi simply greets you with a calm, supportive nudge when you open the app.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <Reveal className="mx-auto mb-12 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-text">
          Questions & answers
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          Everything you need to know about Strekly, our philosophy, and your data.
        </p>
      </Reveal>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <Reveal key={faq.question} delay={idx * 0.04}>
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border transition-[border-color,background-color] duration-200",
                  isOpen
                    ? "border-primary/40 bg-surface/95 shadow-sm"
                    : "border-border/80 bg-surface/70 hover:border-border hover:bg-surface/90",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  <span className="text-base font-semibold text-text">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-text-secondary"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/50 px-5 pt-3 pb-5 text-sm leading-relaxed text-text-secondary">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
