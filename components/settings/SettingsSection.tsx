import type { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
  /** Optional header-right control (e.g. Add button). */
  action?: ReactNode;
};

/**
 * Unboxed settings section for the section-pane layout (UI overhaul):
 * plain heading + one-liner, then the section body — no card, no icon
 * bubble, no nested borders. Sections are separated by the shell's grid.
 */
export function SettingsSection({
  title,
  description,
  children,
  action,
}: SettingsSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-text">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-text-muted">{description}</p>
        </div>
        {action ? <div className="shrink-0 pt-1">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
