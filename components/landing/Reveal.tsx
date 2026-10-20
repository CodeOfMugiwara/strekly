"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll-reveal wrapper.
 *
 * Sections fade and rise as they enter the viewport. The whole page reads
 * as one continuous scroll rather than a stack of blocks that appeared at
 * once, and the reveal timing is staggered per element so a row of tiles
 * arrives in sequence instead of all at the same instant.
 *
 * `once: true` — a section that re-animates every time it scrolls back into
 * view is distracting; it should reveal once and stay put.
 */
type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before revealing. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        ease: [0.32, 0.72, 0, 1],
        delay,
      }}
    >
      {children}
    </Tag>
  );
}
