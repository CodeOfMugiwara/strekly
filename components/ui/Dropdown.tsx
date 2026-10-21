"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
};

type DropdownProps<T extends string = string> = {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  align?: "left" | "right";
  triggerLabel?: (value: T) => string;
  ariaLabel?: string;
  className?: string;
  triggerClassName?: string;
};

export function Dropdown<T extends string = string>({
  options,
  value,
  onChange,
  align = "left",
  triggerLabel,
  ariaLabel,
  className,
  triggerClassName,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text",
          "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          triggerClassName,
        )}
      >
        {triggerLabel ? triggerLabel(value) : (selected?.label ?? value)}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-text-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div
          className={cn(
            "menu-in absolute z-50 mt-1 min-w-36 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-pop",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-text",
                "hover:bg-surface-hover",
                option.value === value && "font-medium text-primary-text",
              )}
            >
              {option.label}
              {option.value === value && (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
