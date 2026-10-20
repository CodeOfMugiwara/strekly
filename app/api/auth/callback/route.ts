import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthActions, createServerClient } from "@insforge/sdk/ssr";
import { serializeRememberedAccount } from "@/lib/remembered-account";
import { MOOD_SCALE } from "@/lib/mood-scale";
import { STARTER_CATEGORIES, STARTER_HABITS } from "@/lib/starter-habits";

/** The 6-level mood scale (see `lib/mood-scale.ts`) — seeded per account. */
const DEFAULT_MOOD_LEVELS = MOOD_SCALE;

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

  await seedStarterHabits(seedClient, userId);
}

/**
 * Give a brand-new account the starter set: 3 categories and 6 universal
 * habits, with no completions and no notes. The user can rename, edit,
 * reorder, archive or delete every one of them.
 *
 * Guarded by an existence check and it fails CLOSED — if the read errors we
 * do not seed, because duplicate habits are worse than no habits. This
 * replaced the old demo seed, which copied the developer's own tracker
 * (his habit names, statuses and journal notes) into every new account.
 */
async function seedStarterHabits(
  seedClient: ReturnType<typeof createServerClient>,
  userId: string,
) {
  try {
    const { data: existing, error: existingError } = await seedClient.database
      .from("habits")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    if (existingError) {
      console.error(
        "[api/auth/callback] starter habits check:",
        existingError.message,
      );
      return;
    }
    if (Array.isArray(existing) && existing.length > 0) return;

    const { data: categoryRows, error: categoryError } = await seedClient.database
      .from("habit_categories")
      .insert(
        STARTER_CATEGORIES.map((category, index) => ({
          user_id: userId,
          name: category.name,
          color: category.color,
          sort_order: index,
        })),
      )
      .select("id, name");

    if (categoryError || !categoryRows) {
      console.error(
        "[api/auth/callback] starter categories insert:",
        categoryError?.message,
      );
      return;
    }

    const categoryIdByName = new Map(
      (categoryRows as Array<{ id: string; name: string }>).map((row) => [
        row.name,
        row.id,
      ]),
    );

    const { error: habitError } = await seedClient.database.from("habits").insert(
      STARTER_HABITS.map((habit, index) => ({
        user_id: userId,
        name: habit.name,
        emoji: habit.emoji,
        description: habit.description,
        category_id: categoryIdByName.get(habit.category) ?? null,
        sort_order: index,
        active: true,
      })),
    );
    if (habitError) {
      console.error(
        "[api/auth/callback] starter habits insert:",
        habitError.message,
      );
    }
  } catch (error) {
    console.error("[api/auth/callback] seedStarterHabits", error);
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
