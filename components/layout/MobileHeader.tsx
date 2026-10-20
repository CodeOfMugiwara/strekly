"use client";

import { LogOut } from "lucide-react";
import { BrandLeaf } from "@/components/ui/HabitIcon";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { signOut } from "@/actions/auth";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-sidebar/95 px-4 py-2.5 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-lightest text-primary-text">
          <BrandLeaf className="h-5 w-5" />
        </div>
        <span className="text-sm font-bold tracking-tight text-text">
          Strekly
        </span>
      </div>

      <div className="flex items-center gap-3">
        <DarkModeToggle />
        <button
          type="button"
          onClick={() => void signOut()}
          title="Sign Out"
          aria-label="Sign out"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-error-light/50 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
