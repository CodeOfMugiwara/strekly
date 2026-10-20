"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The ONE modal in the app.
 *
 * The three hand-rolled modals (Habit form, Day note, Mood note) each
 * rendered `role="dialog" aria-modal="true"` on a backdrop div with their
 * own Escape listener. None of them trapped focus, none returned focus to
 * the trigger on close, and the page behind stayed tabbable.
 *
 * Radix Dialog gives all of that for free — focus trap, focus restore,
 * Escape, outside-click dismiss, scroll lock, `aria-modal`, and a portal so
 * the modal is never trapped inside a card's stacking context.
 *
 * The `open` prop on `Dialog.Root` is deliberately hard-coded to `true`:
 * `AnimatePresence` owns the open/close lifecycle so it can play the exit
 * animation. Radix's `onOpenChange` (Escape / outside click) still fires and
 * the parent closes the modal, which removes the Root from the tree and
 * triggers the exit.
 */
type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  /** Action row rendered under the body, right-aligned. */
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
} as const;

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <Dialog.Root open onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="fixed inset-0 z-50 bg-text/40"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={
                  reduced ? false : { opacity: 0, y: 12, scale: 0.97 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduced
                    ? undefined
                    : { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }
                }
                transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.8 }}
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
                  "rounded-xl border border-border bg-surface p-6 shadow-pop focus:outline-none",
                  SIZES[size],
                  className,
                )}
              >
                <Dialog.Title className="pr-8 text-base font-semibold text-text">
                  {title}
                </Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-1 text-xs text-text-muted">
                    {description}
                  </Dialog.Description>
                ) : (
                  /* Radix warns when a dialog has no description. Keep one
                     present but out of the way. */
                  <Dialog.Description className="sr-only">{title}</Dialog.Description>
                )}

                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close dialog"
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>

                {children ? <div className="mt-4">{children}</div> : null}
                {footer ? (
                  <div className="mt-5 flex items-center justify-end gap-2">
                    {footer}
                  </div>
                ) : null}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ) : null}
    </AnimatePresence>
  );
}
