"use client";

import { Github, Loader2, Lock, Sparkles, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { initiateOAuth, type OAuthProvider } from "@/actions/auth";
import { BrandLeaf } from "@/components/ui/HabitIcon";
import {
  accountInitial,
  clearRememberedAccount,
  maskEmail,
  readRememberedAccount,
  subscribeToRememberedAccount,
  type RememberedAccount,
} from "@/lib/remembered-account";
import { cn } from "@/lib/utils";

const errorMessages: Record<string, string> = {
  oauth_failed: "Sign-in failed with the provider. Please try again.",
  missing_verifier: "Your sign-in session expired. Please try again.",
  exchange_failed: "Could not complete sign-in. Please try again.",
  oauth_init_failed: "Could not start sign-in. Please try again.",
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type Props = {
  provider: OAuthProvider;
  label: string;
  pendingProvider: OAuthProvider | null;
  onPending: (provider: OAuthProvider | null) => void;
};

function OAuthButton({ provider, label, pendingProvider, onPending }: Props) {
  const isPending = pendingProvider === provider;
  const isDisabled = pendingProvider !== null;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => {
        onPending(provider);
        void initiateOAuth(provider);
      }}
      className={cn(
        "flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3",
        "text-sm font-medium text-text transition-colors hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:pointer-events-none disabled:opacity-60",
      )}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary-text" />
      ) : provider === "google" ? (
        <GoogleIcon className="h-4 w-4" />
      ) : (
        <Github className="h-4 w-4" />
      )}
      {isPending ? "Redirecting…" : label}
    </button>
  );
}

/** The "you used this account last time" card. */
function RememberedCard({
  account,
  pending,
  onPending,
  onForget,
}: {
  account: RememberedAccount;
  pending: OAuthProvider | null;
  onPending: (provider: OAuthProvider | null) => void;
  onForget: () => void;
}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="rounded-xl border border-primary/25 bg-primary-lightest/50 p-4"
    >
      <p className="text-xs font-medium text-text-muted">
        Welcome back — continue as
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-on">
          {accountInitial(account.email)}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-semibold text-text"
            title={account.email}
          >
            {maskEmail(account.email)}
          </p>
          <p className="text-xs capitalize text-text-muted">
            {account.provider} account
          </p>
        </div>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => {
            onPending(account.provider);
            void initiateOAuth(account.provider);
          }}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-on transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            "disabled:pointer-events-none disabled:opacity-60",
          )}
        >
          {pending === account.provider ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            "Continue"
          )}
        </button>
      </div>
      <button
        type="button"
        onClick={onForget}
        className="mt-3 text-xs text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        Use a different account
      </button>
    </motion.div>
  );
}

type Mode = "signin" | "signup";

function LoginContent() {
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error");
  const errorMessage = errorKey
    ? (errorMessages[errorKey] ?? errorMessages.oauth_failed)
    : null;

  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null,
  );
  const reduced = useReducedMotion();

  // The cookie is written by the OAuth callback, so it only exists on the
  // client. `useSyncExternalStore` is the right primitive here: the server
  // snapshot is null (no cookie server-side) and the client snapshot reads
  // the cookie, with no hydration mismatch.
  const account = useSyncExternalStore(
    subscribeToRememberedAccount,
    readRememberedAccount,
    () => null,
  );

  const showRemembered = account !== null && mode === "signin";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46rem 26rem at 50% -6%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 70%)",
        }}
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-lightest text-primary-text">
            <BrandLeaf className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-semibold text-text">Strekly</h1>
          <p className="mt-1 text-sm text-text-muted">
            Your streak, everyday
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="mb-4 rounded-sm border border-error/30 bg-error-light px-3 py-2 text-xs text-error-foreground"
          >
            {errorMessage}
          </div>
        ) : null}

        {/* Sign in / Create account tabs */}
        <div
          role="tablist"
          aria-label="Authentication mode"
          className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface/70 p-1 backdrop-blur-md"
        >
          {(
            [
              { id: "signin", label: "Sign in" },
              { id: "signup", label: "Create account" },
            ] as const
          ).map((tab) => {
            const active = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(tab.id)}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  active
                    ? "text-primary-on"
                    : "text-text-secondary hover:text-text",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                    }}
                  />
                ) : null}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-border bg-surface/90 p-6 shadow-card backdrop-blur-md">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={reduced ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -10 }}
              transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            >
              {mode === "signup" ? (
                <p className="mb-4 flex items-start gap-2 rounded-lg bg-primary-lightest/60 p-3 text-xs leading-relaxed text-text-secondary">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-text" />
                  <span>
                    No forms to fill in — pick a provider and your account is
                    created on the spot. Nothing else to set up.
                  </span>
                </p>
              ) : null}

              {showRemembered ? (
                <div className="mb-4">
                  <RememberedCard
                    account={account}
                    pending={pendingProvider}
                    onPending={setPendingProvider}
                    onForget={clearRememberedAccount}
                  />
                </div>
              ) : null}

              <div className="space-y-3">
                <OAuthButton
                  provider="google"
                  label={
                    mode === "signup"
                      ? "Create account with Google"
                      : "Continue with Google"
                  }
                  pendingProvider={pendingProvider}
                  onPending={setPendingProvider}
                />
                <OAuthButton
                  provider="github"
                  label={
                    mode === "signup"
                      ? "Create account with GitHub"
                      : "Continue with GitHub"
                  }
                  pendingProvider={pendingProvider}
                  onPending={setPendingProvider}
                />
              </div>

              <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-text-muted">
                <Lock className="h-3 w-3" />
                Secure sign-in with Google or GitHub
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-text-muted">
          <UserPlus className="h-3 w-3" />
          New here? Choose{" "}
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="font-medium text-primary-text underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Create an account
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-text-muted">Loading…</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
