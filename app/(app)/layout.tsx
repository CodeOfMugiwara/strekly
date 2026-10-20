"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { AuroraBackdrop } from "@/components/layout/AuroraBackdrop";
import { PageTransition } from "@/components/layout/PageTransition";
import { ProfileThemeSync } from "@/components/settings/ProfileThemeSync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
      `isolate` makes this wrapper its own stacking context. Without it the
      wrapper is `position: relative; z-index: auto` (no stacking context), so
      the orbs below — even at `z-0` — and the wrapper's own `bg-background`
      both resolve against the ROOT stacking context, where a positioned
      `z-index: auto` background paints at step 6 while the orbs would paint
      at step 2. The opaque background would then cover them and the aurora
      would be invisible. Isolating + explicit z-order makes the paint order
      deterministic: wrapper background (step 1) → orbs (step 6) → content
      (step 7).
    */
    <div className="relative isolate min-h-screen bg-background">
      <AuroraBackdrop />

      <ProfileThemeSync />
      <Sidebar />
      {/*
        No z-index here on purpose. The wrapper above is `isolate`, so this
        subtree shares ONE stacking context with the sidebar (z-40) and the
        aurora (z-0). Giving this div its own z-index would create a nested
        stacking context, which would trap in-page modals (z-50) below the
        sidebar — the modal backdrop would let the sidebar show through.
        Left at `z-index: auto`, the modal still resolves against the shared
        context and paints above the sidebar.
      */}
      <div className="relative flex min-h-screen flex-col md:pl-[var(--sidebar-width)]">
        <MobileHeader />
        <main className="flex-1 p-4 pb-24 md:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
