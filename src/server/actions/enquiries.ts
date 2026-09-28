"use server";

import { createHmac, randomBytes } from "node:crypto";
import { and, count, eq, gt, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";
import { verifyCaptcha } from "@/lib/captcha";
import {
  sendEnquiryAutoReply,
  sendEnquiryNotification,
  sendProductEnquiryNotification,
} from "@/lib/email/send";
import { requireRole } from "@/lib/session";
import { enquirySchema } from "@/server/validators/enquiry";

export type EnquirySubmitResult =
  | { ok: true; reference: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

/**
 * Normalizes input from either a JSON payload or a native FormData instance.
 */
function extractEnquiryInput(raw: unknown): unknown {
  if (typeof FormData !== "undefined" && raw instanceof FormData) {
    const rawItems = raw.get("items");
    let items: unknown[] = [];
    if (typeof rawItems === "string" && rawItems.trim()) {
      try {
        items = JSON.parse(rawItems);
      } catch {
        items = [];
      }
    }

    const rawQuizAnswers = raw.get("quizAnswers");
    let quizAnswers: Record<string, unknown> | undefined;
    if (typeof rawQuizAnswers === "string" && rawQuizAnswers.trim()) {
      try {
        quizAnswers = JSON.parse(rawQuizAnswers);
      } catch {
        quizAnswers = undefined;
      }
    }

    const consentVal = raw.get("consent");
    const consent = consentVal === "true" || consentVal === "on" || consentVal === "1";

    return {
      name: raw.get("name"),
      company: raw.get("company") || undefined,
      email: raw.get("email"),
      phone: raw.get("phone"),
      businessType: raw.get("businessType") || undefined,
      terminalCount: raw.get("terminalCount") || undefined,
      message: raw.get("message"),
      items,
      quizAnswers,
      source: raw.get("source") || "contact_form",
      consent,
      captchaToken: raw.get("captchaToken") || "dev-token",
      website: raw.get("website") || undefined,
    };
  }
  return raw;
}

/**
 * Main enquiry submission action according to Specification §7.8.
 * Handles rate-limiting (5/hr/IP), honeypot, reCAPTCHA, DB batch insert, and async email dispatch.
 * Supports progressive enhancement (native form action when JS is disabled).
 */
export async function submitEnquiry(rawInput: unknown): Promise<EnquirySubmitResult> {
  const isNativeForm = typeof FormData !== "undefined" && rawInput instanceof FormData;
  const input = extractEnquiryInput(rawInput);

  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      error: "Please check the highlighted fields and ensure consent is agreed.",
      fieldErrors: errorMap,
    };
  }

  const data = parsed.data;

  // 1. Honeypot check: If the hidden 'website' field was filled, silently pretend success without saving
  if (data.website && data.website.trim().length > 0) {
    if (isNativeForm) {
      redirect("/contact?ref=MFT-00000000");
    }
    return { ok: true, reference: "MFT-00000000" };
  }

  // 2. IP Hash computation & Database Rate Limiting (5 requests per hour)
  const h = await headers();
  const rawIp =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "127.0.0.1";
  const ipHash = createHmac("sha256", env.IP_HASH_SALT).update(rawIp).digest("hex");

  const [recentCount] = await db
    .select({ n: count() })
    .from(schema.enquiries)
    .where(
      and(
        eq(schema.enquiries.ipHash, ipHash),
        gt(schema.enquiries.createdAt, sql`now() - interval '1 hour'`),
      ),
    );

  if ((recentCount?.n ?? 0) >= 5) {
    return {
      ok: false,
      error:
        "Too many enquiries submitted from this network. Please try again in an hour or message us directly on WhatsApp.",
    };
  }

  // 3. Invisible reCAPTCHA verification
  const captcha = await verifyCaptcha(data.captchaToken, "enquiry");
  if (!captcha.ok) {
    return {
      ok: false,
      error: "We could not verify that you are human. Please refresh and try again.",
    };
  }

  // 4. Snapshot only published products the visitor selected
  const productIds = data.items.map((i) => i.productId);
  const foundProducts = productIds.length
    ? await db
        .select({
          id: schema.products.id,
          name: schema.products.name,
          modelNumber: schema.products.modelNumber,
        })
        .from(schema.products)
        .where(
          and(inArray(schema.products.id, productIds), eq(schema.products.status, "published")),
        )
    : [];

  const productMap = new Map(foundProducts.map((p) => [p.id, p]));

  const enquiryId = crypto.randomUUID();
  const reference = `MFT-${randomBytes(4).toString("hex").toUpperCase()}`;

  const insertEnquiryQuery = db.insert(schema.enquiries).values({
    id: enquiryId,
    reference,
    name: data.name,
    company: data.company || null,
    email: data.email,
    phone: data.phone,
    businessType: data.businessType || null,
    terminalCount: data.terminalCount || null,
    message: data.message,
    quizAnswers: data.quizAnswers as Record<string, string | string[]> | undefined,
    source: data.source,
    consentGiven: true,
    privacyPolicyVersion: "2026-09",
    ipHash,
    userAgent: h.get("user-agent")?.slice(0, 300) || null,
    referrer: h.get("referer")?.slice(0, 300) || null,
    captchaScore: captcha.score,
    notifyEmailStatus: "pending",
    autoReplyStatus: "pending",
  });

  const itemRows = data.items.flatMap((i) => {
    const product = productMap.get(i.productId);
    return product
      ? [
          {
            enquiryId,
            productId: product.id,
            productName: product.name,
            modelNumber: product.modelNumber,
            quantity: i.quantity,
          },
        ]
      : [];
  });

  // 5. Save FIRST for transaction atomicity. Neon HTTP doesn't have interactive transactions, so db.batch is used.
  if (itemRows.length > 0) {
    await db.batch([insertEnquiryQuery, db.insert(schema.enquiryItems).values(itemRows)]);
  } else {
    await insertEnquiryQuery;
  }

  // 6. Asynchronous email notifications using after() so responses return promptly.
  // Resend errors are caught and recorded as 'failed' in the database without failing the submission.
  after(async () => {
    const [notifyResult, autoReplyResult] = await Promise.allSettled([
      sendEnquiryNotification({
        reference,
        enquiryId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        businessType: data.businessType,
        terminalCount: data.terminalCount,
        message: data.message,
        items: itemRows,
        quizAnswers: data.quizAnswers as Record<string, string | string[]> | undefined,
        source: data.source,
      }),
      sendEnquiryAutoReply({
        reference,
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
        items: itemRows,
      }),
    ]);

    const notifyStatus = notifyResult.status === "fulfilled" ? "sent" : "failed";
    const notifyError =
      notifyResult.status === "rejected"
        ? String(notifyResult.reason?.message || notifyResult.reason).slice(0, 500)
        : null;

    const autoReplyStatus = autoReplyResult.status === "fulfilled" ? "sent" : "failed";

    await db
      .update(schema.enquiries)
      .set({
        notifyEmailStatus: notifyStatus,
        notifyEmailError: notifyError,
        autoReplyStatus,
      })
      .where(eq(schema.enquiries.id, enquiryId));
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  // Progressive enhancement fallback: redirect if JavaScript was disabled
  if (isNativeForm) {
    redirect(`/contact?ref=${reference}`);
  }

  return { ok: true, reference };
}

/**
 * Native server action wrapper that returns void to satisfy React 19 / Next.js <form action={...}> typing.
 */
export async function submitEnquiryNativeAction(formData: FormData): Promise<void> {
  await submitEnquiry(formData);
}

/**
 * Retries sending an enquiry notification email from the admin console.
 */
export async function resendEnquiryNotificationAction(enquiryId: string) {
  await requireRole(["admin", "editor"]);

  const [enquiry] = await db
    .select()
    .from(schema.enquiries)
    .where(eq(schema.enquiries.id, enquiryId));

  if (!enquiry) {
    return { success: false, error: "Enquiry not found" };
  }

  const items = await db
    .select()
    .from(schema.enquiryItems)
    .where(eq(schema.enquiryItems.enquiryId, enquiryId));

  try {
    await sendEnquiryNotification({
      reference: enquiry.reference,
      enquiryId: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      company: enquiry.company,
      businessType: enquiry.businessType,
      terminalCount: enquiry.terminalCount,
      message: enquiry.message,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        modelNumber: i.modelNumber,
        quantity: i.quantity,
      })),
      quizAnswers: enquiry.quizAnswers || undefined,
      source: enquiry.source,
    });

    await db
      .update(schema.enquiries)
      .set({
        notifyEmailStatus: "sent",
        notifyEmailError: null,
      })
      .where(eq(schema.enquiries.id, enquiryId));

    revalidatePath(`/admin/enquiries/${enquiryId}`);
    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    await db
      .update(schema.enquiries)
      .set({
        notifyEmailStatus: "failed",
        notifyEmailError: errorMsg.slice(0, 500),
      })
      .where(eq(schema.enquiries.id, enquiryId));

    revalidatePath(`/admin/enquiries/${enquiryId}`);
    revalidatePath("/admin/enquiries");
    return { success: false, error: errorMsg };
  }
}

/**
 * Direct product enquiry submission from modal.
 */
const productEnquirySchema = z.object({
  productId: z.string().optional().nullable(),
  productName: z.string().min(1, "Product name is required"),
  modelNumber: z.string().optional().nullable(),
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.string().email("Please enter a valid business email address"),
  phone: z.string().min(6, "Please enter a valid telephone contact number"),
  company: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(1).max(1000).default(1),
  message: z.string().min(5, "Please provide brief details regarding your enquiry"),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "Consent is required to submit an enquiry",
  }),
});

export async function submitProductEnquiryAction(rawInput: unknown) {
  try {
    const input = productEnquirySchema.parse(rawInput);
    const reference = `MFT-${randomBytes(4).toString("hex").toUpperCase()}`;

    const [insertedEnquiry] = await db
      .insert(schema.enquiries)
      .values({
        reference,
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company || null,
        terminalCount: input.quantity,
        message: input.message,
        source: "product_page",
        status: "new",
        consentGiven: true,
      })
      .returning({ id: schema.enquiries.id, reference: schema.enquiries.reference });

    if (!insertedEnquiry) {
      return { success: false, error: "Failed to create enquiry record." };
    }

    await db.insert(schema.enquiryItems).values({
      enquiryId: insertedEnquiry.id,
      productId: input.productId && input.productId.length > 10 ? input.productId : null,
      productName: input.productName,
      modelNumber: input.modelNumber || null,
      quantity: input.quantity,
      note: "Requested via Direct Product Modal",
    });

    try {
      await sendProductEnquiryNotification({
        reference: insertedEnquiry.reference,
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        productName: input.productName,
        modelNumber: input.modelNumber,
        quantity: input.quantity,
        message: input.message,
      });
    } catch (emailErr) {
      console.error("Enquiry notification email failed:", emailErr);
    }

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return {
      success: true,
      reference: insertedEnquiry.reference,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid input data provided.",
      };
    }
    console.error("submitProductEnquiryAction error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while submitting your enquiry. Please try again.",
    };
  }
}
