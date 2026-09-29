"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { solutions } from "@/db/schema";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize";
import { requireRole } from "@/lib/session";

export const solutionSchema = z.object({
  kind: z.enum(["industry", "service"]),
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
  summary: z.string().trim().max(300).nullable().optional(),
  body: z.record(z.string(), z.unknown()).nullable().optional(),
  bodyHtml: z.string().nullable().optional(),
  mediaId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export type SolutionInput = z.infer<typeof solutionSchema>;

export async function createSolutionAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = solutionSchema.parse(rawInput);

  const existing = await db.query.solutions.findFirst({
    where: eq(solutions.slug, data.slug),
  });
  if (existing) {
    return { success: false, error: "A solution with this URL slug already exists." };
  }

  const sanitisedHtml = data.bodyHtml ? sanitizeRichText(data.bodyHtml) : null;

  const [inserted] = await db
    .insert(solutions)
    .values({
      kind: data.kind,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      body: data.body || null,
      bodyHtml: sanitisedHtml,
      mediaId: data.mediaId || null,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
    })
    .returning();

  if (!inserted) {
    return { success: false, error: "Failed to create solution." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "solution.create",
    entityType: "solution",
    entityId: inserted.id,
    metadata: { title: data.title, slug: data.slug, kind: data.kind },
  });

  updateTag("solutions");
  revalidatePath("/solutions");
  revalidatePath("/admin/solutions");

  return { success: true, solution: inserted };
}

export async function updateSolutionAction(id: string, rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = solutionSchema.parse(rawInput);

  const existing = await db.query.solutions.findFirst({
    where: eq(solutions.id, id),
  });
  if (!existing) {
    return { success: false, error: "Solution not found." };
  }

  if (data.slug !== existing.slug) {
    const slugClash = await db.query.solutions.findFirst({
      where: eq(solutions.slug, data.slug),
    });
    if (slugClash && slugClash.id !== id) {
      return { success: false, error: "A solution with this URL slug already exists." };
    }
  }

  const sanitisedHtml = data.bodyHtml ? sanitizeRichText(data.bodyHtml) : null;

  await db
    .update(solutions)
    .set({
      kind: data.kind,
      title: data.title,
      slug: data.slug,
      summary: data.summary || null,
      body: data.body || null,
      bodyHtml: sanitisedHtml,
      mediaId: data.mediaId || null,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(solutions.id, id));

  await logAuditEvent({
    actorId: session.user.id,
    action: "solution.update",
    entityType: "solution",
    entityId: id,
    metadata: { title: data.title, slug: data.slug, kind: data.kind },
  });

  updateTag("solutions");
  revalidatePath("/solutions");
  revalidatePath("/admin/solutions");

  return { success: true };
}

export async function deleteSolutionAction(id: string) {
  const session = await requireRole(["admin", "editor"]);

  const [deleted] = await db
    .delete(solutions)
    .where(eq(solutions.id, id))
    .returning({ id: solutions.id, title: solutions.title });

  if (!deleted) {
    return { success: false, error: "Solution not found." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "solution.delete",
    entityType: "solution",
    entityId: id,
    metadata: { title: deleted.title },
  });

  updateTag("solutions");
  revalidatePath("/solutions");
  revalidatePath("/admin/solutions");

  return { success: true };
}

export async function bulkDeleteSolutionsAction(ids: string[]) {
  const session = await requireRole(["admin", "editor"]);

  if (!ids || ids.length === 0) {
    return { success: false, error: "No solutions selected for deletion." };
  }

  const deleted = await db
    .delete(solutions)
    .where(inArray(solutions.id, ids))
    .returning({ id: solutions.id, title: solutions.title });

  if (deleted.length === 0) {
    return { success: false, error: "No matching solutions found to delete." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "solution.bulk_delete",
    entityType: "solution",
    metadata: { count: deleted.length, ids: deleted.map((s) => s.id) },
  });

  updateTag("solutions");
  revalidatePath("/solutions");
  revalidatePath("/admin/solutions");

  return { success: true, count: deleted.length };
}

export async function reorderSolutionsAction(items: { id: string; sortOrder: number }[]) {
  const _session = await requireRole(["admin", "editor"]);

  for (const item of items) {
    await db.update(solutions).set({ sortOrder: item.sortOrder }).where(eq(solutions.id, item.id));
  }

  updateTag("solutions");
  revalidatePath("/solutions");
  revalidatePath("/admin/solutions");

  return { success: true };
}
