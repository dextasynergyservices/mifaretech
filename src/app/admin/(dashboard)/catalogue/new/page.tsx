import { asc } from "drizzle-orm";
import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function NewProductPage() {
  await requireRole(["admin", "editor"]);

  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });

  const categoryOptions = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return <ProductForm categories={categoryOptions} />;
}
