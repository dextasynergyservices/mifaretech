"use server";

import { count, eq, inArray } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { logAuditEvent } from "@/lib/audit";
import { requireRole } from "@/lib/session";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
  description: z.string().trim().max(500).nullable().optional(),
  coverMediaId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().trim().max(100).nullable().optional(),
  seoDescription: z.string().trim().max(200).nullable().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export async function createCategoryAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = categorySchema.parse(rawInput);

  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, data.slug),
  });
  if (existing) {
    return { success: false, error: "A category with this URL slug already exists." };
  }

  const [inserted] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      coverMediaId: data.coverMediaId || null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    })
    .returning();

  if (!inserted) {
    return { success: false, error: "Failed to create category" };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "category.create",
    entityType: "category",
    entityId: inserted.id,
    metadata: { name: data.name, slug: data.slug },
  });

  updateTag("categories");
  revalidatePath("/catalogue");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/catalogue");

  return { success: true, category: inserted };
}

export async function updateCategoryAction(id: string, rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const data = categorySchema.parse(rawInput);

  const existing = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
  if (!existing) {
    return { success: false, error: "Category not found." };
  }

  if (data.slug !== existing.slug) {
    const slugClash = await db.query.categories.findFirst({
      where: eq(categories.slug, data.slug),
    });
    if (slugClash && slugClash.id !== id) {
      return { success: false, error: "A category with this URL slug already exists." };
    }
  }

  await db
    .update(categories)
    .set({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      coverMediaId: data.coverMediaId || null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id));

  await logAuditEvent({
    actorId: session.user.id,
    action: "category.update",
    entityType: "category",
    entityId: id,
    metadata: { name: data.name, slug: data.slug },
  });

  updateTag("categories");
  revalidatePath("/catalogue");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/catalogue");

  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  const session = await requireRole(["admin", "editor"]);

  // Safety check: Count products currently assigned to this category
  const res = await db.select({ count: count() }).from(products).where(eq(products.categoryId, id));

  const assignedCount = res[0]?.count ?? 0;

  if (assignedCount > 0) {
    return {
      success: false,
      error: `Cannot delete this category because ${assignedCount} hardware product(s) are assigned to it. Please reassign or delete those products first.`,
    };
  }

  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning({ id: categories.id, name: categories.name });

  if (!deleted) {
    return { success: false, error: "Category not found or already deleted." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "category.delete",
    entityType: "category",
    entityId: id,
    metadata: { name: deleted.name },
  });

  updateTag("categories");
  revalidatePath("/catalogue");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/catalogue");

  return { success: true };
}

export async function bulkDeleteCategoriesAction(ids: string[]) {
  const session = await requireRole(["admin", "editor"]);

  if (!ids || ids.length === 0) {
    return { success: false, error: "No categories selected for deletion." };
  }

  // Safety check: Check if any selected category has products
  const assigned = await db
    .select({
      categoryId: products.categoryId,
      count: count(),
    })
    .from(products)
    .where(inArray(products.categoryId, ids))
    .groupBy(products.categoryId);

  if (assigned.length > 0) {
    const totalBlockedProducts = assigned.reduce((acc, curr) => acc + curr.count, 0);
    return {
      success: false,
      error: `Cannot delete selected categories: ${assigned.length} of them currently contain ${totalBlockedProducts} hardware product(s). Please reassign or delete those products first.`,
    };
  }

  const deleted = await db
    .delete(categories)
    .where(inArray(categories.id, ids))
    .returning({ id: categories.id, name: categories.name });

  if (deleted.length === 0) {
    return { success: false, error: "No matching categories found to delete." };
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "category.bulk_delete",
    entityType: "category",
    metadata: { count: deleted.length, ids: deleted.map((c) => c.id) },
  });

  updateTag("categories");
  revalidatePath("/catalogue");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/catalogue");

  return { success: true, count: deleted.length };
}

export async function reorderCategoriesAction(items: { id: string; sortOrder: number }[]) {
  const _session = await requireRole(["admin", "editor"]);

  for (const item of items) {
    await db
      .update(categories)
      .set({ sortOrder: item.sortOrder })
      .where(eq(categories.id, item.id));
  }

  updateTag("categories");
  revalidatePath("/catalogue");
  revalidatePath("/admin/categories");

  return { success: true };
}
