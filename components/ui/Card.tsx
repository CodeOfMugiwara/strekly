import { cn } from "@/lib/utils";

/**
 * The ONE card surface in the app.
 *
 * Before this, the codebase had three different card languages side by side
 * on the same screen: `rounded-2xl … bg-surface/90 backdrop-blur-md`,
 * `rounded-xl … bg-surface` (no blur), and `.glass-card`. Every card now
 * renders through this component so radius, border, surface, blur, padding
 * and shadow are identical everywhere.
 */
const CARD_SURFACE =
  "rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md p-5 shadow-card";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  /**
   * Opt in to the lift-on-hover treatment.
   *
   * The hover state used to live on the base Card, which meant every
   * non-clickable card in the app (week strip, quick stats, inspiration)
   * advertised interactivity it did not have.
   */
  interactive?: boolean;
};

export function Card({
  className,
  as: Tag = "div",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        CARD_SURFACE,
        "transition-[box-shadow,border-color,transform] duration-200",
        interactive &&
          "hover:-translate-y-0.5 hover:shadow-soft hover:border-primary/35",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 flex items-center justify-between gap-3", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-base font-semibold text-text", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-text-muted", className)} {...props} />
  );
}

export { CARD_SURFACE };
