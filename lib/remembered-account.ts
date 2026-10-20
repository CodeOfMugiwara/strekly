"use client";

/**
 * The account this browser last signed in with.
 *
 * The InsForge SDK has no "list accounts" call, and it should not have
 * one — a list of every account that ever signed in on this device would
 * leak other people's addresses. So the app remembers exactly ONE thing:
 * the account THIS browser used last.
 *
 * It is stored in a cookie rather than localStorage because the OAuth
 * round-trip leaves the app entirely: the callback route handler has to
 * write it, and a cookie is the only store that survives that hop. The
 * cookie is readable by script on purpose — the login page needs to show
 * the account, and it only ever renders it masked.
 *
 * Nothing leaves the device. It exists purely so a returning user can tap
 * once instead of re-picking a provider.
 */

const COOKIE_NAME = "ht_last_account";
/** 180 days. */
const MAX_AGE = 60 * 60 * 24 * 180;

export type RememberedAccount = {
  /** The full address, kept locally and never rendered in full. */
  email: string;
  /** The provider that account signed in with. */
  provider: "google" | "github";
  /** Epoch ms. */
  at: number;
};

/* The parsed value is cached so `getSnapshot` returns a STABLE reference —
   `useSyncExternalStore` requires that, and re-parsing on every call would
   loop forever. The cache is keyed on the raw cookie string, so a changed
   cookie invalidates it. */

let cacheRaw: string | null = null;
let cacheValue: RememberedAccount | null = null;

const listeners = new Set<() => void>();

function readRawCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? match.slice(COOKIE_NAME.length + 1) : null;
}

function parse(raw: string | null): RememberedAccount | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== "object" || parsed === null) return null;
    const v = parsed as Record<string, unknown>;
    if (
      typeof v.email !== "string" ||
      !v.email.includes("@") ||
      (v.provider !== "google" && v.provider !== "github") ||
      typeof v.at !== "number"
    ) {
      return null;
    }
    return { email: v.email, provider: v.provider, at: v.at };
  } catch {
    return null;
  }
}

/** Read the remembered account. Never throws, even with a corrupt value. */
export function readRememberedAccount(): RememberedAccount | null {
  const raw = readRawCookie();
  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  cacheValue = parse(raw);
  return cacheValue;
}

/** Subscribe to changes (used by `useSyncExternalStore`). */
export function subscribeToRememberedAccount(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Forget the remembered account (used by "use a different account"). */
export function clearRememberedAccount(): void {
  if (typeof document !== "undefined") {
    try {
      document.cookie = `${COOKIE_NAME}=; Max-Age=0; path=/; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }
  cacheRaw = null;
  cacheValue = null;
  for (const listener of listeners) listener();
}

/**
 * Mask an email so the owner can recognise it without the full address
 * being on screen: `ada.lovelace@example.com` → `ad••••@example.com`.
 */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at <= 0) return "••••";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const head = local.slice(0, Math.min(2, local.length));
  return `${head}••••@${domain}`;
}

/** The initial-letter avatar for a remembered account. */
export function accountInitial(email: string): string {
  const local = email.split("@")[0] ?? "";
  return (local[0] ?? "?").toUpperCase();
}

/**
 * Build the cookie the OAuth callback sets. Exported so the route handler
 * and the client agree on one format.
 */
export function serializeRememberedAccount(
  account: RememberedAccount,
): string {
  return `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(account))}; Max-Age=${MAX_AGE}; path=/; SameSite=Lax`;
}
