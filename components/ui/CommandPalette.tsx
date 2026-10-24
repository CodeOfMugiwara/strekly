"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  Home,
  CheckSquare,
  Smile,
  BarChart3,
  Calendar,
  Settings,
  Plus,
  SunMoon,
  Download,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTour } from "@/components/tour/TourProvider";

type CommandItem = {
  id: string;
  category: "Navigation" | "Quick Actions";
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  shortcut?: string;
  perform: () => void;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const tour = useTour();
  const inputRef = useRef<HTMLInputElement>(null);

  // Command palette item definitions
  const items: CommandItem[] = useMemo(() => {
    return [
      {
        id: "nav-home",
        category: "Navigation",
        label: "Home Dashboard",
        sublabel: "Today's check-ins and overview",
        icon: Home,
        shortcut: "G H",
        perform: () => router.push("/home"),
      },
      {
        id: "nav-habits",
        category: "Navigation",
        label: "Habits Grid",
        sublabel: "Monthly habit tracker and editor",
        icon: CheckSquare,
        shortcut: "G B",
        perform: () => router.push("/habits"),
      },
      {
        id: "nav-mood",
        category: "Navigation",
        label: "Mood Journal",
        sublabel: "Emotions, notes and distribution",
        icon: Smile,
        shortcut: "G M",
        perform: () => router.push("/mood"),
      },
      {
        id: "nav-stats",
        category: "Navigation",
        label: "Analytics & Stats",
        sublabel: "Consistency heatmap and KPIs",
        icon: BarChart3,
        shortcut: "G S",
        perform: () => router.push("/stats"),
      },
      {
        id: "nav-calendar",
        category: "Navigation",
        label: "Calendar View",
        sublabel: "Monthly matrix and day reflection",
        icon: Calendar,
        shortcut: "G C",
        perform: () => router.push("/calendar"),
      },
      {
        id: "nav-settings",
        category: "Navigation",
        label: "Settings & Vault",
        sublabel: "Themes, data export, and profile",
        icon: Settings,
        shortcut: "G ,",
        perform: () => router.push("/settings"),
      },
      {
        id: "act-new-habit",
        category: "Quick Actions",
        label: "Create New Habit",
        sublabel: "Add ritual to your daily list",
        icon: Plus,
        shortcut: "N",
        perform: () => router.push("/habits"),
      },
      {
        id: "act-log-mood",
        category: "Quick Actions",
        label: "Log Mood",
        sublabel: "Record your feeling today",
        icon: Smile,
        perform: () => router.push("/mood"),
      },
      {
        id: "act-toggle-theme",
        category: "Quick Actions",
        label: "Toggle Dark / Light Theme",
        sublabel: "Switch ambient appearance",
        icon: SunMoon,
        perform: () => {
          const isDark = document.documentElement.classList.toggle("dark");
          localStorage.setItem("strekly-theme", isDark ? "dark" : "light");
        },
      },
      {
        id: "act-export",
        category: "Quick Actions",
        label: "Export Complete History (JSON)",
        sublabel: "Download uncompressed backup",
        icon: Download,
        perform: () => {
          window.location.href = "/api/data/export";
        },
      },
      {
        id: "act-tour",
        category: "Quick Actions",
        label: "Start Interactive Product Tour",
        sublabel: "Explore all Strekly features",
        icon: HelpCircle,
        perform: () => {
          tour.start();
        },
      },
    ];
  }, [router, tour]);

  // Filter items
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [items, query]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom event listener so other components can trigger the palette via `window.dispatchEvent(new CustomEvent('open-command-palette'))`
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Arrow key navigation inside palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filtered[selectedIndex];
      if (current) {
        setIsOpen(false);
        current.perform();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    item.perform();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-md dark:bg-black/65"
            aria-hidden="true"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command Menu"
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-surface/95 shadow-pop backdrop-blur-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.2)] dark:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm font-medium text-text placeholder:text-text-muted focus:outline-none"
              />
              <span className="flex items-center gap-1 rounded-md border border-border/80 bg-surface-alt px-1.5 py-0.5 font-mono text-[10px] font-semibold text-text-muted">
                ESC
              </span>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-text-muted">
                  No commands matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-primary-lightest text-primary-text [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.2)] dark:bg-primary/20"
                            : "text-text hover:bg-surface-hover/70",
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                              isSelected
                                ? "border-primary/40 bg-surface text-primary-text shadow-xs"
                                : "border-border/60 bg-surface-alt text-text-muted",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-text">{item.label}</p>
                            {item.sublabel && (
                              <p className="truncate text-[11px] text-text-muted">
                                {item.sublabel}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-text-muted/70 font-semibold">
                            {item.category}
                          </span>
                          {item.shortcut && (
                            <span className="rounded border border-border/80 bg-surface-alt px-1.5 py-0.5 font-mono text-[10px] font-semibold text-text-muted">
                              {item.shortcut}
                            </span>
                          )}
                          {isSelected && (
                            <ArrowRight className="h-3.5 w-3.5 text-primary-text" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer keyboard helpers */}
            <div className="flex items-center justify-between border-t border-border/60 bg-surface-alt/40 px-4 py-2.5 text-[11px] text-text-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border/80 bg-surface px-1 py-0.5 font-mono text-[10px]">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border/80 bg-surface px-1 py-0.5 font-mono text-[10px]">
                    ↵
                  </kbd>
                  select
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-primary-text font-medium">
                <Sparkles className="h-3 w-3" />
                Strekly Quick Palette
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
