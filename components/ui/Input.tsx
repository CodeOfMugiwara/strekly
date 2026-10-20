import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text",
        "placeholder:text-text-muted",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40",
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
        "w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text",
        "placeholder:text-text-muted",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
