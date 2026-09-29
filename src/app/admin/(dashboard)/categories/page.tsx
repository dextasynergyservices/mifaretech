import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { CategoriesClient } from "./categories-client";

export const instant = false;

export default async function AdminCategoriesPage() {
  await requireRole(["admin", "editor"]);

  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
    with: {
      cover: true,
      products: {
        columns: { id: true },
      },
    },
  });

  const items = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    coverMediaId: c.coverMediaId,
    coverUrl: c.cover?.secureUrl || null,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
    productCount: c.products?.length || 0,
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription,
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="editorial-badge">Hardware Fleet</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Product Categories
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Organize POS terminals, barcode scanners, printers, and accessories by product type.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-foreground">
            Total: {items.length} categories
          </span>
        </div>
      </div>

      <CategoriesClient initialCategories={items} />
    </div>
  );
}
