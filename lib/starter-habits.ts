/**
 * The starter set every new account begins with.
 *
 * These are deliberately **generic and empty of history**: a habit with no
 * completions, no notes and no streaks. The user can rename, edit, reorder,
 * archive or delete any of them, and the app shows honest empty charts
 * until they check something in.
 *
 * The previous seed copied the developer's own September 2026 tracker into
 * every new account — his habit names, his statuses and his first-person
 * journal notes. That data is personal, and a new user should start from
 * their own blank page, not from someone else's diary.
 *
 * The emojis are chosen so `glyphForHabit` maps each one to a real Strekly
 * glyph (water / walk / book / journal / moon / phone-off) instead of
 * falling back to a system emoji.
 */

export type StarterCategory = {
  name: string;
  /** One of the preset swatches in `lib/category-form.ts`. */
  color: string;
};

export type StarterHabit = {
  name: string;
  emoji: string;
  description: string;
  /** The name of a `STARTER_CATEGORIES` entry. */
  category: string;
};

export const STARTER_CATEGORIES: StarterCategory[] = [
  { name: "Health", color: "#34D399" },
  { name: "Mind", color: "#A78BFA" },
  { name: "Evening", color: "#60A5FA" },
];

export const STARTER_HABITS: StarterHabit[] = [
  {
    name: "Drink water",
    emoji: "💧",
    description: "About 2 litres through the day",
    category: "Health",
  },
  {
    name: "Move your body",
    emoji: "🏃",
    description: "20 minutes of movement",
    category: "Health",
  },
  {
    name: "Read 20 minutes",
    emoji: "📖",
    description: "Any book counts",
    category: "Mind",
  },
  {
    name: "Journal",
    emoji: "📓",
    description: "A line about your day",
    category: "Mind",
  },
  {
    name: "Sleep by 11 PM",
    emoji: "🌙",
    description: "Lights out, phone down",
    category: "Evening",
  },
  {
    name: "No phone in bed",
    emoji: "📵",
    description: "Charge it across the room",
    category: "Evening",
  },
];
