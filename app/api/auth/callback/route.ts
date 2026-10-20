import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthActions, createServerClient } from "@insforge/sdk/ssr";
import { serializeRememberedAccount } from "@/lib/remembered-account";

/** Exact faces/colors from MoodPage.png / trakcer UI.png (see context/ui-tokens.md).
 *  6-level scale since F26 (high = happier). */
const DEFAULT_MOOD_LEVELS = [
  { value: 6, label: "Very Happy", emoji: "😊", color: "#86D6BF" },
  { value: 5, label: "Happy", emoji: "🙂", color: "#FCD34D" },
  { value: 4, label: "Okay", emoji: "😐", color: "#7DD3FC" },
  { value: 3, label: "Tired", emoji: "😴", color: "#A8A29E" },
  { value: 2, label: "Sad", emoji: "☹️", color: "#FC8FA5" },
  { value: 1, label: "Fu*ked Up", emoji: "🤯", color: "#A78BFA" },
];

type CookieReader = { get(name: string): string | undefined };

async function seedUserData(
  userId: string,
  displayName: string | null,
  readCookie: CookieReader,
) {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
  if (!baseUrl || !anonKey) {
    throw new Error("Missing InsForge env vars");
  }

  const seedClient = createServerClient({
    baseUrl,
    anonKey,
    cookies: {
      get(name: string) {
        return readCookie.get(name);
      },
    },
  });

  const { data: profileRows, error: profileError } = await seedClient.database
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .limit(1);

  if (profileError) {
    console.error("[api/auth/callback] profile read", profileError.message);
  }

  if (!profileRows || profileRows.length === 0) {
    const { error: insertProfileError } = await seedClient.database.from("profiles").insert([
      {
        id: userId,
        display_name: displayName,
      },
    ]);
    if (insertProfileError) {
      console.error("[api/auth/callback] profile insert", insertProfileError.message);
    }
  }

  const { data: levelRows, error: levelError } = await seedClient.database
    .from("mood_levels")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (levelError) {
    console.error("[api/auth/callback] mood_levels read", levelError.message);
  }

  if (!levelRows || levelRows.length === 0) {
    const { error: insertLevelsError } = await seedClient.database.from("mood_levels").insert(
      DEFAULT_MOOD_LEVELS.map((level, index) => ({
        user_id: userId,
        label: level.label,
        emoji: level.emoji,
        color: level.color,
        value: level.value,
        sort_order: index,
      })),
    );
    if (insertLevelsError) {
      console.error("[api/auth/callback] mood_levels insert", insertLevelsError.message);
    }
  }
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("insforge_code");
  const oauthError = request.nextUrl.searchParams.get("error");
  const errorDescription = request.nextUrl.searchParams.get("error_description");

  if (oauthError || !code) {
    console.warn("[api/auth/callback] OAuth failed", {
      error: oauthError,
      errorDescription,
    });
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("insforge_code_verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/login?error=missing_verifier", request.url));
  }

  const response = NextResponse.redirect(new URL("/home", request.url));
  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier);
  if (error || !data?.user) {
    console.error("[api/auth/callback] exchange failed", error?.message ?? "no user");
    return NextResponse.redirect(new URL("/login?error=exchange_failed", request.url));
  }

  response.cookies.delete("insforge_code_verifier");

  // Remember the account that just signed in, so the sign-in page can
  // offer it next time. Only the provider is read back from the
  // short-lived cookie set when the visitor picked it.
  const providerCookie = request.cookies.get("ht_oauth_provider")?.value;
  response.cookies.delete("ht_oauth_provider");

  try {
    const metadata = data.user.metadata as Record<string, unknown> | null;
    const profile = data.user.profile as { name?: string } | null;
    const displayName =
      profile?.name ??
      (typeof metadata?.full_name === "string"
        ? metadata.full_name
        : typeof metadata?.name === "string"
          ? metadata.name
          : null) ??
      data.user.email ??
      null;

    if (data.user.email && (providerCookie === "google" || providerCookie === "github")) {
      // The serialised form is a full Set-Cookie header value, so it is
      // appended to the response's raw header rather than going through
      // `cookies.set` (which takes an options object, not a header string).
      response.headers.append(
        "Set-Cookie",
        serializeRememberedAccount({
          email: data.user.email,
          provider: providerCookie,
          at: Date.now(),
        }),
      );
    }

    await seedUserData(data.user.id, displayName, {
      get(name: string) {
        return response.cookies.get(name)?.value;
      },
    });
  } catch (seedError) {
    console.error("[api/auth/callback] seed failed", seedError);
  }

  return response;
}
