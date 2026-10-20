"use client";

import Link from "next/link";
import { BrandLeaf } from "@/components/ui/HabitIcon";
import { ScriptQuote } from "@/components/ui/ScriptQuote";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-12 text-center sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
            <BrandLeaf className="h-5 w-5" />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-text">
            Habit Tracker
          </span>
        </Link>

        <ScriptQuote size="sm" className="text-[20px] leading-tight">
          {"Small Steps\nBrighter Days 💜"}
        </ScriptQuote>

        <p className="text-xs text-text-muted">
          A better you, everyday.
        </p>
      </div>
    </footer>
  );
}
