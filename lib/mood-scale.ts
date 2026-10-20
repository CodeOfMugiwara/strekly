/**
 * The 6-level mood scale.
 *
 * One source of truth for the faces: the sign-up seed writes these rows
 * into `mood_levels`, and `lib/mood-view.ts` falls back to them if the
 * user's own rows are unreadable. The values and colours are the design
 * spec from `context/ui-tokens.md` (Mood Faces).
 */

export type MoodScaleLevel = {
  value: number;
  label: string;
  emoji: string;
  color: string;
};

/** High = happier. 6 = Very Happy … 1 = Fu*ked Up. */
export const MOOD_SCALE: MoodScaleLevel[] = [
  { value: 6, label: "Very Happy", emoji: "😊", color: "#86D6BF" },
  { value: 5, label: "Happy", emoji: "🙂", color: "#FCD34D" },
  { value: 4, label: "Okay", emoji: "😐", color: "#7DD3FC" },
  { value: 3, label: "Tired", emoji: "😴", color: "#A8A29E" },
  { value: 2, label: "Sad", emoji: "☹️", color: "#FC8FA5" },
  { value: 1, label: "Fu*ked Up", emoji: "🤯", color: "#A78BFA" },
];
