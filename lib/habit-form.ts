import { z } from "zod";

export const habitFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  emoji: z
    .string()
    .trim()
    .max(8, "Emoji is too long")
    .optional()
    .transform((v) => v || "📝"),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => v || null),
  categoryId: z.string().uuid().nullable().optional(),
  /** Planned time of day, "HH:MM" (24h). null = no reminder. */
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Reminder time must be HH:MM")
    .nullable()
    .optional()
    .transform((v) => v || null),
});

export type HabitFormInput = z.input<typeof habitFormSchema>;
