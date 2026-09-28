import "server-only";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories, products } from "@/db/schema";

export async function getPublishedProducts(options?: { categorySlug?: string; query?: string }) {
  "use cache";
  cacheTag("products", "catalogue");
  cacheLife("hours");

  try {
    const { categorySlug, query } = options || {};

    let categoryId: string | undefined;
    if (categorySlug && categorySlug !== "all") {
      const cat = await db.query.categories.findFirst({
        where: and(eq(categories.slug, categorySlug), eq(categories.isActive, true)),
      });
      if (cat) {
        categoryId = cat.id;
      } else {
        // Specified category doesn't exist
        return [];
      }
    }

    const conditions = [eq(products.status, "published")];
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }
    if (query?.trim()) {
      const search = `%${query.trim()}%`;
      const searchCondition = or(
        ilike(products.name, search),
        ilike(products.modelNumber, search),
        ilike(products.shortDescription, search),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    return await db.query.products.findMany({
      where: and(...conditions),
      orderBy: [asc(products.sortOrder), asc(products.name)],
      with: {
        category: true,
        cover: true,
        specs: true,
        images: {
          with: {
            media: true,
          },
          orderBy: (images, { asc }) => [asc(images.sortOrder)],
        },
      },
    });
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheTag("products", `product-${slug}`);
  cacheLife("hours");

  try {
    return await db.query.products.findFirst({
      where: and(eq(products.slug, slug), eq(products.status, "published")),
      with: {
        category: true,
        cover: true,
        specs: {
          orderBy: (specs, { asc }) => [asc(specs.sortOrder)],
        },
        documents: {
          with: {
            media: true,
          },
        },
        images: {
          with: {
            media: true,
          },
          orderBy: (images, { asc }) => [asc(images.sortOrder)],
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(limit = 4) {
  "use cache";
  cacheTag("products", "products-featured");
  cacheLife("hours");

  try {
    return await db.query.products.findMany({
      where: and(eq(products.status, "published"), eq(products.isFeatured, true)),
      orderBy: [asc(products.sortOrder)],
      limit,
      with: {
        category: true,
        cover: true,
        specs: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 3) {
  "use cache";
  cacheTag("products", `products-related-${categoryId}`);
  cacheLife("hours");

  try {
    const list = await db.query.products.findMany({
      where: and(eq(products.status, "published"), eq(products.categoryId, categoryId)),
      orderBy: [asc(products.sortOrder)],
      limit: limit + 1,
      with: {
        category: true,
        cover: true,
      },
    });

    return list.filter((p) => p.id !== excludeProductId).slice(0, limit);
  } catch {
    return [];
  }
}
