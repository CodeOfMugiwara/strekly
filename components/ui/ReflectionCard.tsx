import { cn } from "@/lib/utils";
import { ThemeBotanicalFlora } from "@/components/ui/ThemeBotanicalFlora";

type ReflectionCardProps = {
  quote?: string;
  authorOrTag?: string;
  className?: string;
};

/**
 * Reflection Quote Card with Botanical Flora Accent
 *
 * Direct match to bottom-right quote card in public/designs/HomePage.png.
 * Features an elegant quotation mark, compact handwritten script,
 * subtle dividing rule, and botanical flora sprig artwork.
 */
export function ReflectionCard({
  quote = "“Discipline today creates the freedom tomorrow.”",
  authorOrTag,
  className,
}: ReflectionCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-surface/90 p-5 shadow-card transition-all duration-200 hover:shadow-soft",
        className,
      )}
    >
      {/* Decorative Botanical Flora anchored at bottom right without box */}
      <div className="pointer-events-none absolute -bottom-2 -right-1 text-primary/35 select-none">
        <ThemeBotanicalFlora className="h-24 w-16" />
      </div>

      {/* Primary Quotation Mark */}
      <div className="font-serif text-2xl font-bold leading-none text-primary opacity-80" aria-hidden="true">
        “
      </div>

      {/* Expressive Handwritten Script Quote */}
      <p className="relative z-10 mt-1.5 font-script text-2xl sm:text-3xl font-medium leading-snug text-primary-text drop-shadow-xs max-w-[85%]">
        {quote}
      </p>

      {/* Subtle organic divider rule */}
      <div className="mt-3 h-0.5 w-12 rounded-full bg-primary/35" />

      {authorOrTag && (
        <p className="mt-2 text-[10px] font-medium tracking-wide text-text-muted">
          {authorOrTag}
        </p>
      )}
    </div>
  );
}
