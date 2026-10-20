"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLeaf } from "@/components/ui/HabitIcon";
import { ScriptQuote } from "@/components/ui/ScriptQuote";
import { SlidingIndicator } from "@/components/ui/SlidingIndicator";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { NAV_ITEMS, isActivePath } from "@/components/layout/nav-items";
import { signOut } from "@/actions/auth";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-width)] flex-col border-r border-border bg-sidebar md:flex">
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

      <nav className="flex-1 space-y-1.5 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-primary-text"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text",
              )}
              aria-current={active ? "page" : undefined}
            >
              {/* One shared pill that SLIDES between nav items instead of a
                  background that jumps — same pattern as the Settings
                  section nav. */}
              {active ? (
                <SlidingIndicator
                  layoutId="sidebar-nav-pill"
                  className="rounded-md bg-primary-lightest"
                />
              ) : null}
              <span className="relative z-10 flex items-center gap-3">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-3 pt-4">
        <ScriptQuote size="sm" className="text-[20px] leading-tight">
          {"Small Steps\nBrighter Days 💜"}
        </ScriptQuote>
      </div>

      <div className="space-y-2.5 border-t border-border px-4 py-4">
        <DarkModeToggle showLabel className="justify-between" />
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-error-light/50 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
