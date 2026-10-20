"use client";

/**
 * Ambient aurora backdrop.
 *
 * MUST live inside a stacking context that also contains the page content,
 * and the content must paint above it. The app shell provides that with
 * `isolate` on the wrapper; the orbs sit at `z-0` and the content is left
 * at `z-index: auto` so in-page overlays (modals at z-50) still resolve
 * against the same shared context and paint above the sidebar.
 */
export function AuroraBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="aurora-orb aurora-orb-1 absolute -top-[15%] left-[20%] h-[500px] w-[500px] rounded-full bg-primary/12 blur-[120px] dark:bg-primary/15" />
      <div className="aurora-orb aurora-orb-2 absolute top-[40%] -right-[10%] h-[450px] w-[450px] rounded-full bg-success/10 blur-[130px] dark:bg-success/10" />
      <div className="aurora-orb aurora-orb-3 absolute -bottom-[10%] left-[30%] h-[450px] w-[450px] rounded-full bg-warning/10 blur-[140px] dark:bg-warning/10" />
    </div>
  );
}
