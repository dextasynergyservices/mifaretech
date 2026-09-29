import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// In-memory edge rate limiting buckets
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateLimitMap.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

// Clean up stale rate limit entries periodically (every 5 mins)
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, bucket] of rateLimitMap.entries()) {
        if (now > bucket.resetAt) {
          rateLimitMap.delete(key);
        }
      }
    },
    5 * 60 * 1000,
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Edge Rate Limiting: stricter on Auth, controlled on Contact & Enquiry endpoints
  const isDev = process.env.NODE_ENV === "development";
  const authLimit = isDev ? 120 : 30;
  const contactLimit = isDev ? 120 : 15;

  if (pathname.startsWith("/api/auth")) {
    const allowed = checkRateLimit(`auth:${ip}`, authLimit, 60 * 1000);
    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60", "Content-Type": "text/plain" },
      });
    }
  } else if (pathname === "/contact" || pathname.startsWith("/api/enquiries")) {
    const allowed = checkRateLimit(`contact:${ip}`, contactLimit, 5 * 60 * 1000);
    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "120", "Content-Type": "text/plain" },
      });
    }
  }

  // 2. Admin Authentication Guards
  const isPublicAuthRoute =
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password");

  const isAdminArea = pathname.startsWith("/admin") && !isPublicAuthRoute;

  if (isAdminArea && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 3. Per-request Nonce & Content Security Policy (CSP)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`
    : `'self' 'nonce-${nonce}' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`;

  const connectSrc = isDev
    ? `'self' https://www.google.com https://vitals.vercel-insights.com https://api.cloudinary.com ws: wss:`
    : `'self' https://www.google.com https://vitals.vercel-insights.com https://api.cloudinary.com`;

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
    `connect-src ${connectSrc}`,
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Attach dynamic CSP with nonce and robust HTTP security headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static JS/CSS files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static image/asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
