import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { ALLOWED_UPLOADS } from "@/lib/storage";
import { proxy } from "@/proxy";

describe("Phase 8 Security Hardening", () => {
  describe("Upload Hardening", () => {
    it("strictly disallows SVG MIME types to prevent stored XSS", () => {
      // @ts-expect-error verifying that SVG is not in allowed uploads
      expect(ALLOWED_UPLOADS["image/svg+xml"]).toBeUndefined();
    });

    it("restricts max upload size for standard images to 5MB and PDFs to 8MB", () => {
      expect(ALLOWED_UPLOADS["image/jpeg"].maxBytes).toBe(5 * 1024 * 1024);
      expect(ALLOWED_UPLOADS["image/png"].maxBytes).toBe(5 * 1024 * 1024);
      expect(ALLOWED_UPLOADS["image/webp"].maxBytes).toBe(5 * 1024 * 1024);
      expect(ALLOWED_UPLOADS["application/pdf"].maxBytes).toBe(8 * 1024 * 1024);
    });
  });

  describe("Proxy Security Headers & CSP Nonce", () => {
    it("generates dynamic CSP with per-request nonce and security headers", () => {
      const request = new NextRequest("http://localhost:3000/");
      const response = proxy(request);

      const csp = response.headers.get("content-security-policy");
      const nonce = response.headers.get("x-nonce");
      const hsts = response.headers.get("strict-transport-security");
      const xContentType = response.headers.get("x-content-type-options");
      const xFrame = response.headers.get("x-frame-options");
      const referrerPolicy = response.headers.get("referrer-policy");
      const permissionsPolicy = response.headers.get("permissions-policy");

      // Verify CSP with nonce
      expect(nonce).toBeDefined();
      expect(nonce?.length).toBeGreaterThan(10);
      expect(csp).toContain(`'nonce-${nonce}'`);
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");

      // Verify HTTP security headers
      expect(hsts).toContain("max-age=63072000");
      expect(xContentType).toBe("nosniff");
      expect(xFrame).toBe("DENY");
      expect(referrerPolicy).toBe("strict-origin-when-cross-origin");
      expect(permissionsPolicy).toContain("camera=()");
    });

    it("enforces edge rate limiting on sensitive contact endpoint", () => {
      const uniqueIp = "192.168.10.99";
      let rateLimited = false;

      // Send 20 requests rapidly to /contact
      for (let i = 0; i < 20; i++) {
        const req = new NextRequest("http://localhost:3000/contact", {
          headers: { "x-forwarded-for": uniqueIp },
        });
        const res = proxy(req);
        if (res.status === 429) {
          rateLimited = true;
          break;
        }
      }

      expect(rateLimited).toBe(true);
    });

    it("enforces edge rate limiting on sensitive auth endpoints", () => {
      const uniqueIp = "192.168.20.88";
      let rateLimited = false;

      // Send 35 requests rapidly to /api/auth/sign-in
      for (let i = 0; i < 35; i++) {
        const req = new NextRequest("http://localhost:3000/api/auth/sign-in/email", {
          headers: { "x-forwarded-for": uniqueIp },
        });
        const res = proxy(req);
        if (res.status === 429) {
          rateLimited = true;
          break;
        }
      }

      expect(rateLimited).toBe(true);
    });
  });

  describe("Retention Endpoint Security", () => {
    it("rejects unauthorized requests without valid bearer token", async () => {
      const { GET } = await import("@/app/api/cron/retention/route");
      const req = new NextRequest("http://localhost:3000/api/cron/retention");
      const res = await GET(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("accepts authorized requests with valid Bearer token", async () => {
      const { GET } = await import("@/app/api/cron/retention/route");
      const req = new NextRequest("http://localhost:3000/api/cron/retention", {
        headers: {
          authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.retention).toBeDefined();
      expect(typeof json.retention.spamDeleted).toBe("number");
      expect(typeof json.retention.enquiriesAnonymised).toBe("number");
      expect(typeof json.retention.auditLogsPruned).toBe("number");
    });
  });
});
