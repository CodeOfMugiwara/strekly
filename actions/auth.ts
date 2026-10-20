"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

export type OAuthProvider = "google" | "github";

/**
 * Remembers WHICH provider the visitor picked, so the OAuth callback can
 * pair the signed-in email with the right provider. It is deleted once the
 * callback has consumed it.
 */
const PROVIDER_COOKIE = "ht_oauth_provider";

export async function initiateOAuth(provider: OAuthProvider) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error("NEXT_PUBLIC_APP_URL is not set");
    }

    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });
    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo: new URL("/api/auth/callback", appUrl).toString(),
      skipBrowserRedirect: true,
    });

    if (error || !data?.url || !data?.codeVerifier) {
      console.error("[actions/auth/initiateOAuth]", error?.message ?? "missing oauth payload");
      redirect("/login?error=oauth_init_failed");
    }

    cookieStore.set("insforge_code_verifier", data.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    cookieStore.set(PROVIDER_COOKIE, provider, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    redirect(data.url);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[actions/auth/initiateOAuth]", error);
    redirect("/login?error=oauth_init_failed");
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });
    const { error } = await auth.signOut();
    if (error) {
      console.error("[actions/auth/signOut]", error.message);
    }
  } catch (error) {
    console.error("[actions/auth/signOut]", error);
  }
  redirect("/login");
}
