import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function getCategories() {
  "use cache";
  cacheTag("categories");
  cacheLife("hours");

  const results = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
    with: {
      cover: true,
      products: {
        where: (products, { eq }) => eq(products.status, "published"),
        columns: {
          id: true,
        },
      },
    },
  });

  return results.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    sortOrder: cat.sortOrder,
    cover: cat.cover,
    productCount: cat.products?.length ?? 0,
  }));
}

export async function getCategoryBySlug(slug: string) {
  "use cache";
  cacheTag("categories", `category-${slug}`);
  cacheLife("hours");

  return db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      cover: true,
    },
  });
}
