import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";

const protectedRoutes = [
  "/home",
  "/habits",
  "/mood",
  "/stats",
  "/calendar",
  "/settings",
];
const authRoutes = ["/login", "/callback"];

function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get("insforge_access_token") ||
      request.cookies.get("insforge_refresh_token"),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionBefore = hasSessionCookie(request);

  // Refresh first. updateSession writes any new tokens to the response
  // cookie jar — but the handler for THIS request (Server Components and
  // Server Actions) authenticates with the REQUEST cookies. Mirroring the
  // refreshed tokens onto the request prevents the one-shot "Not
  // authenticated" failure on the first mutation after the access token
  // expires (response cookies only reach the browser after this request).
  const donor = new NextResponse();
  await updateSession({
    requestCookies: request.cookies,
    responseCookies: donor.cookies,
  });
  for (const name of ["insforge_access_token", "insforge_refresh_token"]) {
    const refreshed = donor.cookies.get(name);
    if (refreshed) {
      request.cookies.set(name, refreshed.value);
    }
  }

  const response = NextResponse.next({ request });
  for (const cookie of donor.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  const sessionAfter =
    sessionBefore ||
    Boolean(
      response.cookies.get("insforge_access_token") ||
        response.cookies.get("insforge_refresh_token"),
    );

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !sessionAfter) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/home") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionAfter && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  /*
    Auth-dependent routes must never be cached.

    Every page under these paths reads the signed-in user's data via
    `cookies()`. But Netlify's Durable Cache keys on URL + a fixed vary
    list that does NOT include the auth cookies, so a response rendered
    for one request state (or an anonymous prerender) gets replayed to
    every visitor — the layout shell arrives but the per-user content
    does not, which reads as a blank page behind the sidebar. The same
    applies to Next's own full-route / prerender cache (`s-maxage`,
    `x-nextjs-prerender`), which can serve a stale shell.

    `no-store` on the standard, CDN, and Netlify-specific directives
    keeps every one of these responses request-scoped end to end.
  */
  if (isProtectedRoute) {
    response.headers.set(
      "Cache-Control",
      "private, no-store, max-age=0, must-revalidate",
    );
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set("Netlify-CDN-Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  /**
   * Edge runtime, deliberately.
   *
   * Next 16 renamed `middleware.ts` to `proxy.ts` and forces the Node
   * runtime, and Netlify's OpenNext adapter cannot package a Node-runtime
   * middleware: it copies only `middleware.js` into the edge function and
   * not the runtime chunk it requires, so the build dies with
   * "Cannot find module './webpack-runtime.js'" (webpack) or
   * "'./chunks/[turbopack]_runtime.js'" (turbopack). See
   * opennextjs/opennextjs-netlify#3562 and #3575 — both open.
   *
   * The edge runtime emits a self-contained bundle, which is what the
   * adapter's edge bundler expects. This file must therefore stay
   * edge-safe: no Node built-ins, no `process.env` without a guard.
   */
  runtime: "experimental-edge",
  matcher: [
    "/",
    "/home",
    "/habits/:path*",
    "/mood/:path*",
    "/stats/:path*",
    "/calendar/:path*",
    "/settings/:path*",
    "/login",
    "/callback",
  ],
};
