# Library Docs

Project-specific usage patterns for third-party libraries in Strekly. This file covers only how we use each library here — rules, patterns, and constraints.

---

## Before Using Any Library

1. **Check AGENTS.md** at the project root — lists installed skills and session workflow
2. **Check skills** in `.opencode/skills/` for up-to-date patterns
3. **Read this file** for project rules that override general knowledge
4. **Then** general docs (context7 / official docs)

Authority order:

```
Skills / MCP → This file → General training knowledge
```

Never rely on training data alone for fast-moving APIs.

---

## InsForge

**Package:** `@insforge/sdk`  
**SSR helpers:** `@insforge/sdk/ssr`

### Client vs Server

```typescript
// lib/insforge-client.ts — browser only
import { createBrowserClient } from "@insforge/sdk/ssr";

export const insforge = createBrowserClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});
```

```typescript
// lib/insforge-server.ts — server only
import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

export async function createInsforgeServer() {
  const cookieStore = await cookies();

  return createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
}
```

### Rules

- Browser client in Client Components only
- Server client in Server Components, Server Actions, route handlers
- Always await `createInsforgeServer()`
- Always scope by current user id
- DB reads/writes use `insforge.database.from("table")` (SDK 1.5.x) — not `insforge.from(...)`
- Auth user method: `insforge.auth.getCurrentUser()` (async). There is no `auth.getUser()` on this SDK version

### Auth

```typescript
const insforge = await createInsforgeServer();
const {
  data: { user },
  error,
} = await insforge.auth.getCurrentUser();
if (!user) {
  // redirect("/login") in Server Component
  // or return { success: false, error: "Not authenticated" } in Server Action
}
```

OAuth (Google / GitHub) SSR flow (implemented Feature 02):

1. Login page → Server Action `initiateOAuth(provider)` in `actions/auth.ts`
2. `createAuthActions({ cookies }).signInWithOAuth(provider, { redirectTo: /api/auth/callback, skipBrowserRedirect: true })`
3. Store `data.codeVerifier` in httpOnly cookie `insforge_code_verifier`, redirect to `data.url`
4. `/api/auth/callback` route: `exchangeOAuthCode(code, codeVerifier)` writes session cookies
5. Seed `profiles` + `mood_levels` after exchange
6. `middleware.ts` runs `updateSession()` from `@insforge/sdk/ssr/middleware`

### Theme / Appearance (Feature 04)

- Client paints from localStorage (`ht_theme_mode`, `ht_color_theme`) first
- `ProfileThemeSync` (root layout) calls `hydrateFromProfile()` once → loads `profiles.theme_mode` / `color_theme` only when localStorage is empty
- Appearance changes call `saveAppearance` Server Action (`actions/settings.ts`) to upsert `profiles`
- Custom color theme is a disabled swatch until later features

### Cookies (SDK-managed — do not invent custom names)

| Cookie | Visibility | Purpose |
|--------|------------|---------|
| `insforge_access_token` | browser-readable | Short-lived access token |
| `insforge_refresh_token` | httpOnly | Refresh credential |
| `insforge_code_verifier` | httpOnly, 10 min | OAuth PKCE verifier during login |

`NEXT_PUBLIC_APP_URL` is required for OAuth `redirectTo`. Allowed redirect URLs live in `insforge.toml` → InsForge config.

### DB

```typescript
// Read
const { data, error } = await insforge.database
  .from("habits")
  .select("*")
  .eq("user_id", user.id)
  .order("sort_order", { ascending: true });

// Insert
const { data, error } = await insforge.database
  .from("habits")
  .insert([{ user_id: user.id, name, emoji, category_id }])
  .select()
  .single();

// Update
const { error } = await insforge.database
  .from("habit_completions")
  .upsert(
    { user_id: user.id, habit_id, date, status },
    { onConflict: "habit_id,date" },
  );
```

- Prefer explicit `.eq("user_id", user.id)` even with RLS
- Upsert completions/moods/notes on unique keys documented in architecture.md
- After writes in Server Actions: `revalidatePath`

### Gotchas (verified Feature 02)

- Use `.database.from()` — top-level `.from()` is not on `InsForgeClient`
- Use `getCurrentUser()` — not `getUser()` on the Auth class
- User shape: `metadata` + `profile.name` (not Supabase-style `user_metadata`)
- OAuth auth mutations run on the server via `createAuthActions()`; browser SSR client is read-only for auth
- Seed after OAuth uses cookies written onto the callback response, not request cookies

---

## Tailwind CSS v4

- Tokens via `@theme` in `app/globals.css`
- Dark mode: `[data-theme="dark"]` attribute selector, not `prefers-color-scheme` media queries alone (system mode maps to attribute in JS)
- Color themes: `[data-color-theme="..."]` overrides primary + heat
- Utilities generated automatically: `bg-surface`, `text-text-muted`, `border-border`, `bg-heat-3`, `rounded-xl`, `shadow-card`
- No `tailwind.config.ts` color configuration
- Never mix raw palette classes (`bg-purple-500`) with token classes

---

## Recharts

Used for: Completion Overview (bar), Streak History (line/area), Mood Graph (line), Mood Distribution (donut).

### Project patterns

- Import only what you need: `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`, `LineChart`, `Line`, `Area`, `AreaChart`, `PieChart`, `Pie`, `Cell`, `ResponsiveContainer`
- Wrap charts in a sized parent: `className="h-64 w-full"`
- `ResponsiveContainer width="100%" height="100%"`
- Colors from tokens or from data (mood colors) — not Recharts defaults
- Custom tooltip component styled like a small card (`bg-surface border border-border rounded-lg px-3 py-2 shadow-card text-xs`)
- Axis: `tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}`
- Grid: `stroke="var(--color-border)"` vertical={false} usually
- Empty data: render muted message instead of empty axes when possible

### Chart → feature map

| Feature | Chart |
|---------|--------|
| Stats Completion Overview | BarChart, values 0–100% |
| Stats Streak History | AreaChart or LineChart |
| Stats Habit Completion Rate | Custom progress bars (not Recharts) |
| Mood Graph | LineChart with mood_value 1–N |
| Mood Distribution | PieChart / donut |

---

## Heatmap (no library)

Custom component only:

```tsx
// Conceptual structure — implement in components/stats/ConsistencyHeatmap.tsx
<div className="grid gap-[3px]" style={{ gridAutoFlow: "column" }}>
  {cells.map((cell) => (
    <div
      key={cell.key}
      className={cn("h-2.5 w-2.5 rounded-[2px]", cell.className)}
      title={cell.tooltip}
    />
  ))}
</div>
```

- className uses `bg-heat-0` … `bg-heat-4`
- Data comes from pure helpers in `lib/stats.ts`
- Do not install github-calendar or similar packages

---

## zod

Use for:

- Import JSON schema (profile, habits, completions, moods, notes, categories, settings)
- Server Action input validation when payloads are complex

```typescript
import { z } from "zod";

export const importPayloadSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  profile: z.object({ /* … */ }).partial().optional(),
  habits: z.array(z.object({ /* … */ })),
  // …
});

export type ImportPayload = z.infer<typeof importPayloadSchema>;
```

- Parse on the client before calling the Server Action when possible
- Server Action should re-validate if it accepts raw JSON strings

---

## lucide-react

- Named imports only: `import { Flame, Plus, Search } from "lucide-react"`
- Size: `className="h-4 w-4"` or `size={16}`
- Color via `className="text-primary"` etc.
- Do not invent custom SVG icons when lucide has an equivalent

---

## next/font

```typescript
import { Inter, Caveat } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-script" });
```

- Both variables on `<html>` in root layout
- `font-script` utility for Caveat
- Never load fonts in components

---

## middleware.ts (edge runtime)

- File name: `middleware.ts` at project root, exporting `middleware`
- **Deliberately the legacy convention, not Next 16's `proxy.ts`**, and
  deliberately `runtime: "experimental-edge"`.
  - Next 16 renamed `middleware.ts` → `proxy.ts` and forces the Node runtime,
    and `runtime` is not a configurable option in proxy files.
  - Netlify's OpenNext adapter cannot package a Node-runtime middleware: it
    copies only `middleware.js` into the edge function, not the runtime chunk
    that file requires, and the build fails with
    `Cannot find module './webpack-runtime.js'` (webpack) or
    `'./chunks/[turbopack]_runtime.js'` (turbopack).
    See opennextjs/opennextjs-netlify#3562 and #3575 — both open.
  - The edge runtime emits a self-contained bundle, which is what the
    adapter's edge bundler expects.
- The file must stay **edge-safe**: no Node built-ins, no unguarded
  `process.env`.
- Protects `/home`, `/habits`, `/mood`, `/stats`, `/calendar`, `/settings`
- Auth routes: `/login`
- Session: `updateSession()` from `@insforge/sdk/ssr/middleware` + cookie presence check (`insforge_access_token` / `insforge_refresh_token`)
- Public routes: `/login`, `/api/auth/*`
- Keep matcher minimal for performance
