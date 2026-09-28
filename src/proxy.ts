import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicAuthRoute =
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password");

  const isAdminArea = pathname.startsWith("/admin") && !isPublicAuthRoute;

  if (isAdminArea && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
