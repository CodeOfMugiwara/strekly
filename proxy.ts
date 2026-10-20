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

export async function proxy(request: NextRequest) {
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

  return response;
}

export const config = {
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
