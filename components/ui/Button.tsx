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
  // every theme in both modes).
  primary:
    "bg-primary text-primary-on hover:brightness-95 active:brightness-90 border border-transparent shadow-subtle inset-shadow-sm",
  secondary:
    "bg-surface text-text border border-border/80 hover:bg-surface-hover shadow-subtle",
  ghost:
    "bg-transparent text-primary-text hover:bg-accent-light border border-transparent",
  danger:
    "bg-danger-button text-danger-button-foreground hover:brightness-110 active:brightness-100 border border-transparent shadow-subtle",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-11 px-5 text-sm rounded-xl gap-2.5",
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
        "inline-flex items-center justify-center font-medium select-none",
        "transition-all duration-140 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
