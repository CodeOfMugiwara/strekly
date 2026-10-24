"use client";

import Link from "next/link";
import { BrandLeaf } from "@/components/ui/HabitIcon";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70 bg-surface/30">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
                <BrandLeaf className="h-5 w-5" />
              </span>
              <span className="text-base font-bold tracking-tight text-text">
                Strekly
              </span>
            </Link>
            <p className="mt-2.5 text-xs leading-relaxed text-text-muted">
              Intentional habit and mood tracking designed for real life. Honest
              data, zero guilt, and streaks that endure.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-text-secondary">
            <a href="#results" className="transition-colors hover:text-text">
              Results
            </a>
            <a href="#comparison" className="transition-colors hover:text-text">
              Why Strekly
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-text">
              How it works
            </a>
            <a href="#faq" className="transition-colors hover:text-text">
              FAQ
            </a>
            <Link href="/login" className="transition-colors hover:text-text">
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="font-semibold text-primary-text transition-colors hover:underline"
            >
              Get started free
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-[11px] text-text-muted sm:flex-row">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Strekly. Built with care.</p>
            <ScriptQuote size="xs" className="text-primary-text">
              {"Small Steps, Brighter Days"}
            </ScriptQuote>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Zero third-party trackers
            </span>
            <span>•</span>
            <span>End-to-end Row-Level Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
