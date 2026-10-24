"use client";

/**
 * Modern Ambient Backdrop — Strekly
 *
 * Clean, subtle top-edge vignette with a whisper-light micro-grid.
 * Replaces chaotic multi-color drifting blurry blobs with a crisp,
 * Linear-grade tactile surface that respects performance and typography.
 */
export function AuroraBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Top subtle radial vignette */}
      <div className="absolute -top-[140px] inset-x-0 h-[460px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(167,139,250,0.09),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(167,139,250,0.13),transparent)]" />

      {/* Subtle fine grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
    </div>
  );
}

