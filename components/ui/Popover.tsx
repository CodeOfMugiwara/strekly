"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PopoverPanelProps = {
  /** Accessible label for the trigger button. */
  triggerLabel: string;
  /** Icon inside the circular trigger button. */
  triggerIcon: ReactNode;
  /** Panel title — also used for aria. */
  title: string;
  /** Optional subtitle under the title. */
  description?: string;
  /**
   * `data-tour` value for the trigger, so the product tour can point at it.
   * The tour finds its targets by that attribute.
   */
  triggerTourId?: string;
  children: ReactNode;
};

/**
 * Small anchored panel that appears next to its trigger (Linear/Notion-style
 * header popover — not a slide-over, not a center modal). Radix Popover
 * primitive styled with our tokens: focus management, outside-click, Esc and
 * collision-aware placement handled by Radix.
 */
export function PopoverPanel({
  triggerLabel,
  triggerIcon,
  title,
  description,
  triggerTourId,
  children,
}: PopoverPanelProps) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger
        aria-label={triggerLabel}
        data-tour={triggerTourId}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text",
          "transition-colors hover:bg-surface-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          "data-[state=open]:border-primary data-[state=open]:bg-primary data-[state=open]:text-primary-on",
        )}
      >
        {triggerIcon}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          sideOffset={10}
          align="end"
          collisionPadding={12}
          className={cn(
            "modal-in z-[70] w-[22rem] max-w-[calc(100vw-1.5rem)] rounded-xl border border-border bg-surface shadow-pop",
            "focus:outline-none",
          )}
        >
          <div className="flex items-start gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0 flex-1 pt-0.5">
              <RadixPopover.Title className="text-sm font-semibold text-text">
                {title}
              </RadixPopover.Title>
              {description ? (
                <RadixPopover.Description className="mt-0.5 text-xs text-text-muted">
                  {description}
                </RadixPopover.Description>
              ) : (
                <RadixPopover.Description className="sr-only">
                  {title}
                </RadixPopover.Description>
              )}
            </div>
            <RadixPopover.Close
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-muted",
                "transition-colors hover:bg-surface-hover hover:text-text",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              )}
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </RadixPopover.Close>
          </div>

          <div className="max-h-[min(70vh,32rem)] overflow-y-auto px-4 py-3">
            {children}
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
