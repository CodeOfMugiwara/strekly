import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  Home,
  Settings,
  Smile,
} from "lucide-react";

/**
 * The ONE navigation definition.
 *
 * The desktop sidebar and the mobile bottom bar each declared the same six
 * items and the same active-path predicate.
 *
 * The app's Home is `/home`; the marketing landing page owns `/`.
 */
export const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/mood", label: "Mood", icon: Smile },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

/** Root is only active on an exact match; every other route matches a prefix. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
