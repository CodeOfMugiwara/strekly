"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLeaf } from "@/components/ui/HabitIcon";
import { SlidingIndicator } from "@/components/ui/SlidingIndicator";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { NAV_ITEMS, isActivePath } from "@/components/layout/nav-items";
import { ThemeBotanicalFlora } from "@/components/ui/ThemeBotanicalFlora";
import { ScriptQuote } from "@/components/ui/ScriptQuote";
import { signOut } from "@/actions/auth";

function quoteForPath(pathname: string): string {
  if (pathname.startsWith("/habits")) return "Good Habits\nBrighter Days";
  if (pathname.startsWith("/mood")) return "A Calmer You\nBrighter Days";
  if (pathname.startsWith("/stats")) return "Small Steps\nBig Changes";
  if (pathname.startsWith("/calendar")) return "Good Days\nBuild Great Lives";
  if (pathname.startsWith("/settings")) return "Better Habits\nHappier You";
  return "Small Steps\nBrighter Days";
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-width)] flex-col border-r border-border bg-sidebar md:flex">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-2 px-4 py-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
          <BrandLeaf className="h-7 w-7" />
        </div>
        <div className="text-center">
          <div className="text-[15px] font-bold tracking-tight text-text">
            Strekly
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-text-muted">
            Your streak
            <br />
            Everyday
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-[color,transform] duration-140 active:scale-[0.98]",
                active
                  ? "text-primary-text font-semibold"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text",
              )}
              aria-current={active ? "page" : undefined}
            >
              {active ? (
                <SlidingIndicator
                  layoutId="sidebar-nav-pill"
                  className="rounded-xl bg-primary-lightest [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.25)] dark:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                />
              ) : null}
              <span className="relative z-10 flex items-center gap-3">
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Signature Botanical Flora & Dynamic Route Quote */}
      <div className="relative mt-auto h-[210px] w-full overflow-hidden select-none">
        {/* Botanical Flower rising from bottom-left corner */}
        <div className="pointer-events-none absolute bottom-0 left-0 select-none z-0">
          <ThemeBotanicalFlora className="h-56 w-40 text-primary/70 dark:text-primary/55" />
        </div>

        {/* Cursive quote anchored at exact same place & size on every page — shifted right for clear separation from flowers */}
        <div className="absolute bottom-3.5 left-[70px] z-10 max-w-[160px]">
          <ScriptQuote
            size="sm"
            align="left"
            slant
            underline
            className="text-primary-text font-bold select-none drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
          >
            {quoteForPath(pathname)}
          </ScriptQuote>
        </div>
      </div>

      {/* Footer controls */}
      <div className="space-y-2 border-t border-border px-3.5 py-3.5">
        <DarkModeToggle showLabel className="justify-between" />
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-error-light/50 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
