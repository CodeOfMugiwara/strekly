# Code Standards

Implementation rules for the entire project. Every AI agent must follow these in every session. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

- **Think before implementing** — understand what is being built and why
- **Read context files first** — never assume; verify against architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires
- **Every feature must be testable** — if it cannot be verified immediately, it is incomplete
- **Clean over clever** — readable code a junior developer can follow
- **One thing at a time** — complete one feature fully before the next
- **UI first** — full page UI with mock data, visual check against designs, then wire logic
- **Failures are expected** — try/catch where IO happens; never let one failure crash the app

---

## TypeScript

- Strict mode — no exceptions
- Never use `any` — use `unknown` and narrow
- Avoid type assertions unless unavoidable (comment why)
- Explicit parameter and return types on exported functions
- `type` for object shapes and unions; `interface` only for extendable component props
- `const` by default
- No unhandled floating promises

---

## Next.js 16 Conventions

- App Router only
- React 19 APIs
- Components are Server Components by default
- Add `"use client"` only for: useState/useReducer, useEffect, event handlers, browser APIs, client-only libs
- Never `"use client"` on layouts unless required
- Data fetching in Server Components when possible; mutations via Server Actions
- Server Actions live in `actions/` — never inline in components
- Route handlers live in `app/api/`
- Next.js 16 uses `proxy.ts` (not `middleware.ts`) for request interception
- Caching: treat dynamic user data as uncached/request-time
- Read current Next.js docs via context7/skills before unusual Next-specific work

---

## File and Folder Naming

- Folders: kebab-case (`habit-list`), except Next route groups `(app)`, `(auth)`
- Component files: PascalCase (`HabitRow.tsx`)
- Utility / action / lib files: camelCase (`stats.ts`, `completions.ts`)
- Types: `types/index.ts`
- API routes: `route.ts`
- One component per file — named exports only
- No barrel exports except inside `components/ui/` if needed

---

## Component Structure

```typescript
"use client"; // only if needed

// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { cn } from "@/lib/utils";

// 3. Type definitions
type Props = {
  habitId: string;
  status: HabitStatus;
};

// 4. Component
export function HabitRow({ habitId, status }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

- Props type directly above the component unless shared
- No inline styles — Tailwind classes with tokens only

---

## Server Actions

```typescript
// actions/habits.ts
"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function archiveHabit(habitId: string) {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // validate + write scoped to user.id
    revalidatePath("/habits");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[actions/habits/archiveHabit]", error);
    return { success: false, error: "Failed to archive habit" };
  }
}
```

- Every Server Action: try/catch
- Return `{ success: boolean; error?: string }` — never throw to the client
- `revalidatePath` for every page that shows the mutated data
- Always scope queries to `auth.uid()` / `user.id`

---

## Pure Utilities (`lib/stats.ts`, `lib/insights.ts`, `lib/utils.ts`)

- No React imports
- No InsForge imports
- No `"use server"`
- Deterministic functions that take data in and return data out
- Easy to reason about and reuse from any page

---

## Error Handling

- No empty catch blocks
- Console errors prefixed with context: `[component/function]`
- User-facing errors are human readable
- API route errors: generic message + status 500; log details server-side

---

## InsForge Usage

```typescript
// Browser — Client Components only
import { insforge } from "@/lib/insforge-client";

// Server — Server Components, Server Actions, route handlers
import { createInsforgeServer } from "@/lib/insforge-server";
const insforge = await createInsforgeServer();
const { data: { user } } = await insforge.auth.getCurrentUser();
```

- Never mix client/server instances
- Always `await createInsforgeServer()`
- DB access: `insforge.database.from("table")` — not `insforge.from(...)`
- Auth cookies (SDK-managed): `insforge_access_token`, `insforge_refresh_token`
- OAuth mutations: `createAuthActions()` in Server Actions / route handlers only

---

## Analytics

**This project does not use PostHog, OpenAI, or any analytics/AI SDK.** Do not add them. Key insights are computed in `lib/insights.ts` from user data only.

---

## Environment Variables

| Variable | Used In |
|----------|---------|
| `NEXT_PUBLIC_INSFORGE_URL` | lib/insforge-*.ts, auth routes |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | lib/insforge-*.ts, auth routes |
| `NEXT_PUBLIC_APP_URL` | OAuth redirect base URL |

Never hardcode secrets. `NEXT_PUBLIC_` only for anon/public values.

---

## Import Aliases

Always `@/`:

```typescript
import { Button } from "@/components/ui/button";
import { computeStreak } from "@/lib/stats";
```

Never `../../../components/...`.

---

## Comments

- No comments that restate the code
- Comments only for non-obvious “why”
- No TODO comments in code that is meant to be complete for the feature

---

## Dependencies

Approved for this project:

- `@insforge/sdk`
- `next`, `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/postcss`
- `recharts`
- `lucide-react`
- `zod`
- `@radix-ui/react-dialog` — headless dialog primitive (added F28.1 with developer authorization; the shared `Sheet` it powered was deleted in the UI overhaul — dep kept only while migration settles, remove if nothing re-uses it)
- `@radix-ui/react-popover` — headless popover primitive for the shared `PopoverPanel` (added during the UI overhaul with developer authorization; anchored header panels for Settings profile/notifications; no styling opinions — all UI stays on our tokens)
- `eslint-config-next`

Do not install anything else without updating this list in context files first.

---

## Design Fidelity

- Source of truth images: `public/designs/*.png`
- Attach in chat as `@public/designs/<File>.png` (map in AGENTS.md)
- When the user attaches a design, that image wins — read it before writing UI
- When building UI, compare against the matching PNG (and `trakcer UI.png` for tokens/chrome)
- Status colors, spacing, and sidebar structure must match the Lavender Sky language
- Heatmap is GitHub-style with lavender heat tokens — not a third-party plugin
- Do not reference a root `designs/` folder — only `public/designs/`

---

## Session Workflow (see AGENTS.md)

1. `/remember restore` at start
2. `/architect` before non-trivial features
3. Build UI-first, then logic
4. `/imprint` after UI components
5. `/review` after features
6. `/remember save` at end
7. `/recover` when stuck — diagnose before patching
