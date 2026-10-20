"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BrandLeaf } from "@/components/ui/HabitIcon";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#results", label: "Results" },
  { href: "#how-it-works", label: "How it works" },
];

/**
 * Landing header.
 *
 * Transparent over the hero, then a frosted surface once the page
 * scrolls — the pattern every polished marketing site uses, and it keeps
 * the CTA reachable the whole way down.
 */
export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduced ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-border/70 bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5 sm:px-8">
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

        <nav className="ml-auto hidden items-center gap-6 sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="rounded-lg border border-border bg-surface/70 px-4 py-2 text-sm font-semibold text-text backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Sign in
          </Link>
          <Link
            href="/login?mode=signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-on transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Get started
          </Link>
        </nav>

        {/* Compact actions for small screens. */}
        <div className="ml-auto flex items-center gap-2 sm:hidden">
          <Link
            href="/login"
            className="rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-xs font-semibold text-text"
          >
            Sign in
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
