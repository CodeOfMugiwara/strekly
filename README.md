# Strekly — Habit & Mood Tracker

Personal habit and mood tracking web app. Next.js 16 + InsForge + Tailwind v4.

**Live:** https://strekly.netlify.app

## Quick start

```bash
npm install
npm run dev
```

Set InsForge credentials in `.env.local`:

```
NEXT_PUBLIC_INSFORGE_URL=
NEXT_PUBLIC_INSFORGE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deploy (Netlify)

The app is deployed with the Next.js runtime (OpenNext adapter) via
`netlify.toml` — build `npm run build`, publish `.next`.

Environment variables (Netlify site settings, scope **All scopes**):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_INSFORGE_URL` | `https://j7jw85z6.us-east.insforge.app` |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | InsForge anon key (public by design) |
| `NEXT_PUBLIC_APP_URL` | `https://strekly.netlify.app` |

Env vars are injected at build time — changing one requires a redeploy.

The OAuth round-trip needs the app origin on the InsForge project:
`npx -y @insforge/cli config apply --file insforge.toml`
(`allowed_redirect_urls`).

## Where things live

| Path | Purpose |
|------|---------|
| `context/` | Project context files (overview, architecture, UI, build plan) |
| `memory.md` | Append-only session memory |
| `AGENTS.md` | Agent workflow + hard rules |
| `.opencode/skills/` | architect, imprint, recover, remember, review |
| `public/designs/` | Design PNGs — source of truth; attach as `@public/designs/<File>.png` |
| `app/` | Next.js routes |
| `actions/` | Server Actions |
| `lib/` | InsForge clients + pure stats/insights helpers |

## Session workflow

1. `/remember restore`
2. `/architect` before non-trivial features
3. Build UI-first vs `@public/designs/...`, then wire logic
4. `/imprint` after UI components
5. `/review` after features
6. `/remember save`

## Stack

- Next.js 16 (App Router, `proxy.ts`)
- TypeScript strict
- Tailwind CSS v4 (`@theme` tokens in `app/globals.css`)
- InsForge (auth + Postgres + RLS)
- Recharts, lucide-react, zod
- Lavender Sky design system with light/dark + color themes
- GitHub-style contribution heatmap (custom, lavender ramp)

## Status

See `context/progress-tracker.md` and `memory.md`.
