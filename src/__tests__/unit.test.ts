import { describe, expect, it } from "vitest";
import { generateReference, isValidReference } from "@/lib/reference";
import { calculateRetentionCutoffs } from "@/lib/retention";
import { sanitizeRichText } from "@/lib/sanitize";
import { slugify } from "@/lib/slugify";
import { categorySchema } from "@/server/actions/categories";
import { productInputSchema } from "@/server/actions/products";
import { solutionSchema } from "@/server/actions/solutions";
import { enquirySchema } from "@/server/validators/enquiry";

describe("Phase 9 Unit Tests", () => {
  describe("Zod Validation Schemas", () => {
    it("validates a compliant commercial enquiry payload", () => {
      const valid = {
        name: "James Thornton",
        company: "Apex Retail Group",
        email: "james.t@apexretail.co.uk",
        phone: "+44 7911 123456",
        businessType: "retail",
        terminalCount: 5,
        message: "Requesting pricing for 5 POS terminals and receipt printers.",
        consent: true,
        source: "contact_form",
        captchaToken: "valid-test-token",
        items: [{ productId: "c1a938c2-3e74-4b5b-80a5-296434407ab1", quantity: 2 }],
      };

      const result = enquirySchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects an enquiry when mandatory consent is missing or false", () => {
      const invalid = {
        name: "Sarah Jenkins",
        email: "sarah@example.com",
        phone: "+44 7000 000000",
        businessType: "hospitality",
        terminalCount: 2,
        message: "Need terminals.",
        consent: false,
        source: "contact_form",
        captchaToken: "token",
        items: [],
      };

      const result = enquirySchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("Consent");
      }
    });

    it("rejects an enquiry with invalid email format", () => {
      const invalid = {
        name: "Test User",
        email: "invalid-email-string",
        phone: "07123456789",
        businessType: "retail",
        terminalCount: 1,
        message: "Hello world",
        consent: true,
        source: "contact_form",
        captchaToken: "token",
        items: [],
      };

      const result = enquirySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("validates product schema and requires strict kebab-case slugs", () => {
      const validProduct = {
        name: "Mifaretech T500 All-in-One POS",
        slug: "mifaretech-t500-all-in-one-pos",
        categoryId: "8f76378e-6c61-48e0-bb15-081829e1f579",
        modelNumber: "MFT-T500",
        shortDescription: "Ultra-fast POS terminal with high-resolution touchscreen.",
        descriptionHtml: "<p>Industrial grade reliability.</p>",
        featured: true,
        status: "published" as const,
        specifications: [{ key: "Processor", value: "Octa-core 2.0GHz" }],
        highlights: ["IP54 water resistance", "Built-in 80mm printer"],
        images: [],
      };

      const result = productInputSchema.safeParse(validProduct);
      expect(result.success).toBe(true);

      const invalidSlugProduct = {
        ...validProduct,
        slug: "Mifaretech_T500 POS!", // uppercase, underscore, exclamation not allowed
      };
      const invalidResult = productInputSchema.safeParse(invalidSlugProduct);
      expect(invalidResult.success).toBe(false);
    });

    it("validates category schema", () => {
      const validCategory = {
        name: "Mobile Terminals",
        slug: "mobile-terminals",
        description: "Rugged and handheld terminals for mobile checkout.",
        isActive: true,
        sortOrder: 1,
      };

      expect(categorySchema.safeParse(validCategory).success).toBe(true);

      const invalidCategory = {
        ...validCategory,
        slug: "INVALID SLUG WITH SPACES",
      };
      expect(categorySchema.safeParse(invalidCategory).success).toBe(false);
    });

    it("validates solution schema and kind enumeration", () => {
      const validSolution = {
        title: "Enterprise Retail Management",
        slug: "enterprise-retail-management",
        kind: "industry" as const,
        summary: "Omnichannel inventory and hardware sync",
        bodyHtml: "<p>Comprehensive store setup.</p>",
        isPublished: true,
        sortOrder: 0,
      };

      expect(solutionSchema.safeParse(validSolution).success).toBe(true);

      const invalidSolution = {
        ...validSolution,
        kind: "invalid-sector",
      };
      expect(solutionSchema.safeParse(invalidSolution).success).toBe(false);
    });
  });

  describe("Slug Generator (slugify)", () => {
    it("converts product titles with symbols, spaces, and punctuation into clean kebab-case", () => {
      expect(slugify("Mifaretech T-500: Industrial POS Terminal (2026 Edition!)")).toBe(
        "mifaretech-t-500-industrial-pos-terminal-2026-edition",
      );
    });

    it("trims excess whitespace and collapses multiple hyphens", () => {
      expect(slugify("   Mobile   Printer --- 80mm thermal   ")).toBe(
        "mobile-printer-80mm-thermal",
      );
    });

    it("handles accented and unicode characters gracefully", () => {
      expect(slugify("Café & Bistro Touchscreen £1000")).toBe("caf-bistro-touchscreen-1000");
    });
  });

  describe("Reference Code Generator", () => {
    it("generates an uppercase MFT- prefixed 8-character hex reference", () => {
      const ref = generateReference();
      expect(ref).toMatch(/^MFT-[0-9A-F]{8}$/);
      expect(isValidReference(ref)).toBe(true);
    });

    it("generates unique references across consecutive calls", () => {
      const refs = new Set(Array.from({ length: 50 }, () => generateReference()));
      expect(refs.size).toBe(50);
    });

    it("accurately identifies invalid reference patterns", () => {
      expect(isValidReference("")).toBe(false);
      expect(isValidReference("MFT-1234")).toBe(false);
      expect(isValidReference("MFT-zzzzzzzz")).toBe(false);
      expect(isValidReference("MFT-123456789")).toBe(false);
      expect(isValidReference("XYZ-ABCDEF12")).toBe(false);
    });
  });

  describe("Retention Window Calculation", () => {
    it("calculates exact cutoff timestamps according to statutory policy", () => {
      const fixedBase = new Date("2026-06-01T00:00:00.000Z");
      const { spamCutoff, auditCutoff, enquiryCutoff } = calculateRetentionCutoffs(fixedBase);

      // 30 days prior
      const expectedSpam = new Date("2026-05-02T00:00:00.000Z");
      expect(spamCutoff.toISOString()).toBe(expectedSpam.toISOString());

      // 365 days prior (12 months)
      const expectedAudit = new Date("2025-06-01T00:00:00.000Z");
      expect(auditCutoff.toISOString()).toBe(expectedAudit.toISOString());

      // 730 days prior (24 months)
      const expectedEnquiry = new Date("2024-06-01T00:00:00.000Z");
      expect(enquiryCutoff.toISOString()).toBe(expectedEnquiry.toISOString());
    });
  });

  describe("HTML Sanitiser (sanitizeRichText)", () => {
    it("strips executable scripts, event handlers, and malicious iframes", () => {
      const dirty = `
        <div>
          <h2>Industrial POS Terminal</h2>
          <script>alert('XSS attack')</script>
          <img src="x" onerror="stealCookies()" />
          <iframe src="https://evil.com"></iframe>
          <p onclick="alert('malicious')">Clean description paragraph.</p>
        </div>
      `;

      const clean = sanitizeRichText(dirty);
      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("alert");
      expect(clean).not.toContain("onerror");
      expect(clean).not.toContain("<iframe");
      expect(clean).not.toContain("onclick");
      expect(clean).toContain("<h2>Industrial POS Terminal</h2>");
      expect(clean).toContain("<p>Clean description paragraph.</p>");
    });

    it("automatically transforms external links to include safe rel and target attributes", () => {
      const html = '<p>Check out our <a href="https://fametech.com.tw">partner site</a>.</p>';
      const sanitized = sanitizeRichText(html);

      expect(sanitized).toContain('target="_blank"');
      expect(sanitized).toContain('rel="noopener noreferrer nofollow"');
      expect(sanitized).toContain('href="https://fametech.com.tw"');
    });

    it("handles empty or falsy inputs gracefully", () => {
      expect(sanitizeRichText("")).toBe("");
    });
  });
});
