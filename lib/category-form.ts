import { z } from "zod";

export const CATEGORY_SWATCHES = [
  { name: "Green", value: "#34D399" },
  { name: "Purple", value: "#A78BFA" },
  { name: "Pink", value: "#F472B6" },
  { name: "Blue", value: "#60A5FA" },
  { name: "Orange", value: "#FB923C" },
] as const;

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(40),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Pick a color")
    .refine(
      (v) => CATEGORY_SWATCHES.some((s) => s.value === v),
      "Pick a swatch color",
    ),
});

export type CategoryFormInput = z.input<typeof categoryFormSchema>;
