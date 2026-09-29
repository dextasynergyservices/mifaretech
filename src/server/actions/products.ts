"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { productDocuments, productImages, productSpecs, products } from "@/db/schema";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize";
import { requireRole } from "@/lib/session";

const specRowSchema = z.object({
  groupName: z.string().optional().nullable(),
  label: z.string().min(1, "Spec label is required"),
  value: z.string().min(1, "Spec value is required"),
  sortOrder: z.number().int().default(0),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
  categoryId: z.string().uuid("Please select a valid category").nullable().optional(),
  modelNumber: z.string().trim().max(80).nullable().optional(),
  shortDescription: z.string().trim().max(300).nullable().optional(),
  description: z.record(z.string(), z.unknown()).nullable().optional(),
  descriptionHtml: z.string().nullable().optional(),
  highlights: z.array(z.string().trim()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  coverMediaId: z.string().uuid().nullable().optional(),
  seoTitle: z.string().trim().max(100).nullable().optional(),
  seoDescription: z.string().trim().max(200).nullable().optional(),
  specs: z.array(specRowSchema).default([]),
  galleryMediaIds: z.array(z.string().uuid()).default([]),
  datasheetMediaId: z.string().uuid().nullable().optional(),
  datasheetTitle: z.string().trim().max(120).nullable().optional(),
});

export type ProductFormValues = z.infer<typeof productInputSchema>;

export async function createProductAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = productInputSchema.parse(rawInput);

  // Check unique slug
  const existing = await db.query.products.findFirst({
    where: eq(products.slug, data.slug),
  });
  if (existing) {
    return { success: false, error: "A product with this URL slug already exists." };
  }

  const sanitisedHtml = data.descriptionHtml ? sanitizeRichText(data.descriptionHtml) : null;
  const isPublished = data.status === "published";

  const [inserted] = await db
    .insert(products)
    .values({
      name: data.name,
      slug: data.slug,
      categoryId: data.categoryId || null,
      modelNumber: data.modelNumber || null,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      descriptionHtml: sanitisedHtml,
      highlights: data.highlights.filter(Boolean),
      status: data.status,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      coverMediaId: data.coverMediaId || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      publishedAt: isPublished ? new Date() : null,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    })
    .returning();

  if (!inserted) {
    return { success: false, error: "Failed to create product" };
  }

  const productId = inserted.id;

  // Insert specs
  if (data.specs.length > 0) {
    await db.insert(productSpecs).values(
      data.specs.map((s, idx) => ({
        productId,
        groupName: s.groupName || null,
        label: s.label,
        value: s.value,
        sortOrder: s.sortOrder ?? idx,
      })),
    );
  }

  // Insert gallery images
  if (data.galleryMediaIds.length > 0) {
    await db.insert(productImages).values(
      data.galleryMediaIds.map((mediaId, idx) => ({
        productId,
        mediaId,
        sortOrder: idx,
      })),
    );
  }

  // Insert datasheet document
  if (data.datasheetMediaId) {
    await db.insert(productDocuments).values({
      productId,
      mediaId: data.datasheetMediaId,
      title: data.datasheetTitle || `${data.name} Datasheet`,
      sortOrder: 0,
    });
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "product.create",
    entityType: "product",
    entityId: productId,
    metadata: { name: data.name, slug: data.slug, status: data.status },
  });

  updateTag("products");
  updateTag("catalogue");
  revalidatePath("/catalogue");
  revalidatePath(`/catalogue/${data.slug}`);
  revalidatePath("/admin/catalogue");
  revalidatePath("/admin");

  return { success: true, productId, slug: data.slug };
}

export async function updateProductAction(id: string, rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = productInputSchema.parse(rawInput);

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  if (!existing) {
    return { success: false, error: "Product not found." };
  }

  // Check unique slug if changed
  if (data.slug !== existing.slug) {
    const slugClash = await db.query.products.findFirst({
      where: eq(products.slug, data.slug),
    });
    if (slugClash && slugClash.id !== id) {
      return { success: false, error: "A product with this URL slug already exists." };
    }
  }

  const sanitisedHtml = data.descriptionHtml ? sanitizeRichText(data.descriptionHtml) : null;
  const isPublishingNow = data.status === "published" && existing.status !== "published";
  const publishedAt = isPublishingNow ? new Date() : existing.publishedAt;

  await db
    .update(products)
    .set({
      name: data.name,
      slug: data.slug,
      categoryId: data.categoryId || null,
      modelNumber: data.modelNumber || null,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      descriptionHtml: sanitisedHtml,
      highlights: data.highlights.filter(Boolean),
      status: data.status,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      coverMediaId: data.coverMediaId || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      publishedAt: data.status === "published" ? publishedAt : null,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  // Sync Specs: Delete existing and reinsert
  await db.delete(productSpecs).where(eq(productSpecs.productId, id));
  if (data.specs.length > 0) {
    await db.insert(productSpecs).values(
      data.specs.map((s, idx) => ({
        productId: id,
        groupName: s.groupName || null,
        label: s.label,
        value: s.value,
        sortOrder: s.sortOrder ?? idx,
      })),
    );
  }

  // Sync Images: Delete existing and reinsert
  await db.delete(productImages).where(eq(productImages.productId, id));
  if (data.galleryMediaIds.length > 0) {
    await db.insert(productImages).values(
      data.galleryMediaIds.map((mediaId, idx) => ({
        productId: id,
        mediaId,
        sortOrder: idx,
      })),
    );
  }

  // Sync Documents: Delete existing and reinsert
  await db.delete(productDocuments).where(eq(productDocuments.productId, id));
  if (data.datasheetMediaId) {
    await db.insert(productDocuments).values({
      productId: id,
      mediaId: data.datasheetMediaId,
      title: data.datasheetTitle || `${data.name} Datasheet`,
      sortOrder: 0,
    });
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "product.update",
    entityType: "product",
    entityId: id,
    metadata: { name: data.name, slug: data.slug, status: data.status },
  });

  updateTag("products");
  updateTag("catalogue");
  revalidatePath("/catalogue");
  revalidatePath(`/catalogue/${existing.slug}`);
  revalidatePath(`/catalogue/${data.slug}`);
  revalidatePath("/admin/catalogue");
  revalidatePath(`/admin/catalogue/${id}`);
  revalidatePath("/admin");

  return { success: true, productId: id, slug: data.slug };
}

export async function deleteProductAction(id: string) {
  const session = await requireRole(["admin", "editor"]);

  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ id: products.id, name: products.name, slug: products.slug });

  if (!deleted) {
    return { success: false, error: "Product not found or already deleted." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "product.delete",
    entityType: "product",
    entityId: id,
    metadata: { name: deleted.name, slug: deleted.slug },
  });

  updateTag("products");
  updateTag("catalogue");
  revalidatePath("/catalogue");
  revalidatePath("/admin/catalogue");
  revalidatePath("/admin");

  return { success: true };
}

export async function bulkDeleteProductsAction(ids: string[]) {
  const session = await requireRole(["admin", "editor"]);

  if (!ids || ids.length === 0) {
    return { success: false, error: "No products selected for deletion." };
  }

  const deleted = await db
    .delete(products)
    .where(inArray(products.id, ids))
    .returning({ id: products.id, name: products.name });

  if (deleted.length === 0) {
    return { success: false, error: "No matching products found to delete." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "product.bulk_delete",
    entityType: "product",
    metadata: { count: deleted.length, ids: deleted.map((p) => p.id) },
  });

  updateTag("products");
  updateTag("catalogue");
  revalidatePath("/catalogue");
  revalidatePath("/admin/catalogue");
  revalidatePath("/admin");

  return { success: true, count: deleted.length };
}

export async function updateProductStatusAction(
  id: string,
  newStatus: "draft" | "published" | "archived",
) {
  const session = await requireRole(["admin", "editor"]);

  const [existing] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      status: products.status,
      publishedAt: products.publishedAt,
    })
    .from(products)
    .where(eq(products.id, id));

  if (!existing) {
    return { success: false, error: "Product not found." };
  }

  const isPublishingNow = newStatus === "published" && existing.status !== "published";
  const publishedAt = isPublishingNow ? new Date() : existing.publishedAt;

  await db
    .update(products)
    .set({
      status: newStatus,
      publishedAt: newStatus === "published" ? publishedAt : null,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  await logAuditEvent({
    actorId: session.user.id,
    action: "product.status_change",
    entityType: "product",
    entityId: id,
    metadata: {
      fromStatus: existing.status,
      toStatus: newStatus,
      name: existing.name,
    },
  });

  updateTag("products");
  updateTag("catalogue");
  revalidatePath("/catalogue");
  revalidatePath(`/catalogue/${existing.slug}`);
  revalidatePath("/admin/catalogue");
  revalidatePath("/admin");

  return { success: true };
}

export async function reorderProductsAction(items: { id: string; sortOrder: number }[]) {
  const session = await requireRole(["admin", "editor"]);

  for (const item of items) {
    await db
      .update(products)
      .set({ sortOrder: item.sortOrder, updatedBy: session.user.id })
      .where(eq(products.id, item.id));
  }

  updateTag("products");
  updateTag("catalogue");
  revalidatePath("/catalogue");
  revalidatePath("/admin/catalogue");

  return { success: true };
}
