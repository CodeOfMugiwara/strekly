import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantClasses: Record<Variant, string> = {
  // A soft pastel primary cannot carry white text (2.7:1 on #a78bfa), so
  // solid primary surfaces use `--color-primary-on` (deep ink, >= 4.8:1 on
  // every theme in both modes). Hover darkens rather than fading the whole
  // button, which used to drop the text contrast on hover.
  primary:
    "bg-primary text-primary-on hover:brightness-95 active:brightness-90 border border-transparent",
  secondary:
    "bg-surface text-text border border-border hover:bg-surface-hover",
  ghost:
    "bg-transparent text-primary-text hover:bg-accent-light border border-transparent",
  danger:
    "bg-danger-button text-danger-button-foreground hover:brightness-110 active:brightness-100 border border-transparent",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-sm",
  md: "h-10 px-4 text-sm rounded-sm",
  lg: "h-11 px-5 text-sm rounded-md",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
