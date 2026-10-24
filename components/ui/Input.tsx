import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-sm text-text shadow-subtle transition-all duration-140",
        "placeholder:text-text-muted/70",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2.5 text-sm text-text shadow-subtle transition-all duration-140",
        "placeholder:text-text-muted/70",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
