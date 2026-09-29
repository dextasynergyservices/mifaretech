import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { ProductsTable } from "./products-table";

export const instant = false;

export default async function AdminCataloguePage() {
  await requireRole(["admin", "editor"]);

  const [allProducts, allCategories] = await Promise.all([
    db.query.products.findMany({
      orderBy: [asc(products.sortOrder), asc(products.name)],
      with: {
        category: true,
        cover: true,
        specs: true,
        images: true,
        documents: true,
      },
    }),
    db.query.categories.findMany({
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    }),
  ]);

  const tableItems = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    modelNumber: p.modelNumber,
    status: p.status,
    isFeatured: p.isFeatured,
    sortOrder: p.sortOrder,
    categoryName: p.category?.name || null,
    categorySlug: p.category?.slug || null,
    coverUrl: p.cover?.secureUrl || null,
    specsCount: p.specs?.length || 0,
    imagesCount: p.images?.length || 0,
    hasDatasheet: Boolean(p.documents?.length),
    updatedAt: p.updatedAt,
  }));

  const categoryOptions = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="editorial-badge">Hardware Fleet</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Catalogue Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your POS terminals, barcode scanners, receipt printers, and cash drawers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/catalogue/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>New Hardware</span>
          </Link>
        </div>
      </div>

      {/* Interactive Products Table */}
      <ProductsTable initialProducts={tableItems} categories={categoryOptions} />
    </div>
  );
}
