"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { contentBlocks, faqs, pageSeo, partners, testimonials } from "@/db/schema";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize";
import { requireRole } from "@/lib/session";

// 1. Content Blocks
const contentBlockSchema = z.object({
  page: z.enum(["global", "home", "about", "catalogue", "solutions", "contact"]),
  blockKey: z.string().trim().min(1).max(80),
  title: z.string().trim().max(150).nullable().optional(),
  bodyHtml: z.string().nullable().optional(),
  data: z.record(z.string(), z.unknown()).nullable().optional(),
  mediaId: z.string().uuid().nullable().optional(),
  isPublished: z.boolean().default(true),
});

export async function saveContentBlockAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = contentBlockSchema.parse(rawInput);

  const sanitisedHtml = data.bodyHtml ? sanitizeRichText(data.bodyHtml) : null;

  const [upserted] = await db
    .insert(contentBlocks)
    .values({
      page: data.page,
      blockKey: data.blockKey,
      title: data.title || null,
      bodyHtml: sanitisedHtml,
      data: data.data || null,
      mediaId: data.mediaId || null,
      isPublished: data.isPublished,
      updatedBy: session.user.id,
    })
    .onConflictDoUpdate({
      target: [contentBlocks.page, contentBlocks.blockKey],
      set: {
        title: data.title || null,
        bodyHtml: sanitisedHtml,
        data: data.data || null,
        mediaId: data.mediaId || null,
        isPublished: data.isPublished,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!upserted) {
    return { success: false, error: "Failed to save content block." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "content_block.save",
    entityType: "content_block",
    entityId: upserted.id,
    metadata: { page: data.page, blockKey: data.blockKey },
  });

  updateTag("content-blocks");
  updateTag(`content-blocks-${data.page}`);
  revalidatePath("/");
  revalidatePath(`/${data.page === "home" ? "" : data.page}`);
  revalidatePath("/admin/content");

  return { success: true, block: upserted };
}

// 2. FAQs
const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(3).max(300),
  answerHtml: z.string().trim().min(3),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function saveFaqAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = faqSchema.parse(rawInput);

  const sanitisedAnswer = sanitizeRichText(data.answerHtml);

  if (data.id) {
    await db
      .update(faqs)
      .set({
        question: data.question,
        answerHtml: sanitisedAnswer,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(faqs.id, data.id));

    await logAuditEvent({
      actorId: session.user.id,
      action: "faq.update",
      entityType: "faq",
      entityId: data.id,
      metadata: { question: data.question },
    });
  } else {
    const [inserted] = await db
      .insert(faqs)
      .values({
        question: data.question,
        answerHtml: sanitisedAnswer,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      })
      .returning();

    if (!inserted) {
      return { success: false, error: "Failed to create FAQ." };
    }

    await logAuditEvent({
      actorId: session.user.id,
      action: "faq.create",
      entityType: "faq",
      entityId: inserted.id,
      metadata: { question: data.question },
    });
  }

  updateTag("faqs");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/content");

  return { success: true };
}

export async function deleteFaqAction(id: string) {
  const session = await requireRole(["admin", "editor"]);

  await db.delete(faqs).where(eq(faqs.id, id));

  await logAuditEvent({
    actorId: session.user.id,
    action: "faq.delete",
    entityType: "faq",
    entityId: id,
  });

  updateTag("faqs");
  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true };
}

export async function reorderFaqsAction(items: { id: string; sortOrder: number }[]) {
  const _session = await requireRole(["admin", "editor"]);

  for (const item of items) {
    await db.update(faqs).set({ sortOrder: item.sortOrder }).where(eq(faqs.id, item.id));
  }

  updateTag("faqs");
  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true };
}

// 3. Testimonials
const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  quote: z.string().trim().min(5).max(600),
  authorName: z.string().trim().min(2).max(100),
  authorRole: z.string().trim().max(100).nullable().optional(),
  company: z.string().trim().max(100).nullable().optional(),
  avatarMediaId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function saveTestimonialAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = testimonialSchema.parse(rawInput);

  if (data.id) {
    await db
      .update(testimonials)
      .set({
        quote: data.quote,
        authorName: data.authorName,
        authorRole: data.authorRole || null,
        company: data.company || null,
        avatarMediaId: data.avatarMediaId || null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, data.id));

    await logAuditEvent({
      actorId: session.user.id,
      action: "testimonial.update",
      entityType: "testimonial",
      entityId: data.id,
      metadata: { authorName: data.authorName, company: data.company },
    });
  } else {
    const [inserted] = await db
      .insert(testimonials)
      .values({
        quote: data.quote,
        authorName: data.authorName,
        authorRole: data.authorRole || null,
        company: data.company || null,
        avatarMediaId: data.avatarMediaId || null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      })
      .returning();

    if (!inserted) {
      return { success: false, error: "Failed to create testimonial." };
    }

    await logAuditEvent({
      actorId: session.user.id,
      action: "testimonial.create",
      entityType: "testimonial",
      entityId: inserted.id,
      metadata: { authorName: data.authorName },
    });
  }

  updateTag("testimonials");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/content");

  return { success: true };
}

export async function deleteTestimonialAction(id: string) {
  const session = await requireRole(["admin", "editor"]);

  await db.delete(testimonials).where(eq(testimonials.id, id));

  await logAuditEvent({
    actorId: session.user.id,
    action: "testimonial.delete",
    entityType: "testimonial",
    entityId: id,
  });

  updateTag("testimonials");
  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true };
}

export async function reorderTestimonialsAction(items: { id: string; sortOrder: number }[]) {
  const _session = await requireRole(["admin", "editor"]);

  for (const item of items) {
    await db
      .update(testimonials)
      .set({ sortOrder: item.sortOrder })
      .where(eq(testimonials.id, item.id));
  }

  updateTag("testimonials");
  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true };
}

// 4. Partners & Accreditations
const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  websiteUrl: z.string().trim().url().nullable().optional().or(z.literal("")),
  logoMediaId: z.string().uuid().nullable().optional(),
  accreditationNote: z.string().trim().max(120).nullable().optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function savePartnerAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = partnerSchema.parse(rawInput);

  if (data.id) {
    await db
      .update(partners)
      .set({
        name: data.name,
        websiteUrl: data.websiteUrl || null,
        logoMediaId: data.logoMediaId || null,
        accreditationNote: data.accreditationNote || null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(partners.id, data.id));

    await logAuditEvent({
      actorId: session.user.id,
      action: "partner.update",
      entityType: "partner",
      entityId: data.id,
      metadata: { name: data.name },
    });
  } else {
    const [inserted] = await db
      .insert(partners)
      .values({
        name: data.name,
        websiteUrl: data.websiteUrl || null,
        logoMediaId: data.logoMediaId || null,
        accreditationNote: data.accreditationNote || null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      })
      .returning();

    if (!inserted) {
      return { success: false, error: "Failed to create partner." };
    }

    await logAuditEvent({
      actorId: session.user.id,
      action: "partner.create",
      entityType: "partner",
      entityId: inserted.id,
      metadata: { name: data.name },
    });
  }

  updateTag("partners");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/content");

  return { success: true };
}

export async function deletePartnerAction(id: string) {
  const session = await requireRole(["admin", "editor"]);

  await db.delete(partners).where(eq(partners.id, id));

  await logAuditEvent({
    actorId: session.user.id,
    action: "partner.delete",
    entityType: "partner",
    entityId: id,
  });

  updateTag("partners");
  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true };
}

export async function reorderPartnersAction(items: { id: string; sortOrder: number }[]) {
  const _session = await requireRole(["admin", "editor"]);

  for (const item of items) {
    await db.update(partners).set({ sortOrder: item.sortOrder }).where(eq(partners.id, item.id));
  }

  updateTag("partners");
  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true };
}

// 5. Page SEO Metadata
const pageSeoSchema = z.object({
  page: z.enum(["global", "home", "about", "catalogue", "solutions", "contact"]),
  title: z.string().trim().max(100).nullable().optional(),
  description: z.string().trim().max(250).nullable().optional(),
  ogMediaId: z.string().uuid().nullable().optional(),
});

export async function savePageSeoAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = pageSeoSchema.parse(rawInput);

  await db
    .insert(pageSeo)
    .values({
      page: data.page,
      title: data.title || null,
      description: data.description || null,
      ogMediaId: data.ogMediaId || null,
    })
    .onConflictDoUpdate({
      target: [pageSeo.page],
      set: {
        title: data.title || null,
        description: data.description || null,
        ogMediaId: data.ogMediaId || null,
        updatedAt: new Date(),
      },
    });

  await logAuditEvent({
    actorId: session.user.id,
    action: "page_seo.save",
    entityType: "page_seo",
    entityId: data.page,
    metadata: { page: data.page, title: data.title },
  });

  updateTag("page-seo");
  updateTag(`page-seo-${data.page}`);
  revalidatePath("/");
  revalidatePath(`/${data.page === "home" ? "" : data.page}`);
  revalidatePath("/admin/content");

  return { success: true };
}
