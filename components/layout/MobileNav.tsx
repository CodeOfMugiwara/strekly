"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SlidingIndicator } from "@/components/ui/SlidingIndicator";
import { NAV_ITEMS, isActivePath } from "@/components/layout/nav-items";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-sidebar/95 px-2 py-2 backdrop-blur-md md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
              active
                ? "text-primary-text"
                : "text-text-secondary hover:text-text",
            )}
            aria-current={active ? "page" : undefined}
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              {/* The icon bubble slides between items rather than jumping —
                  the mobile counterpart of the sidebar's sliding pill. */}
              {active ? (
                <SlidingIndicator
                  layoutId="mobile-nav-pill"
                  className="rounded-full bg-primary-lightest"
                />
              ) : null}
              <Icon
                className="relative z-10 h-4 w-4"
                strokeWidth={active ? 2.5 : 2}
              />
            </span>
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
