import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { type RichTextJson, timestamps, tz } from "./_helpers";
import { user } from "./auth";
import { media } from "./media";

export const productStatus = pgEnum("product_status", ["draft", "published", "archived"]);

/** Product-type categories (POS terminals, printers, scanners...). NOT brands. */
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ...timestamps,
  },
  (t) => [
    index("categories_active_sort_idx").on(t.isActive, t.sortOrder),
    check("categories_slug_format", sql`${t.slug} ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'`),
  ],
);

/** Catalogue products. Intentionally has no price and no brand column. */
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    modelNumber: text("model_number"),
    shortDescription: text("short_description"),
    description: jsonb("description").$type<RichTextJson>(), // Tiptap JSON
    descriptionHtml: text("description_html"), // sanitised HTML rendered on the site
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    status: productStatus("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at", tz),
    createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
    updatedBy: text("updated_by").references(() => user.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [
    index("products_status_sort_idx").on(t.status, t.sortOrder),
    index("products_category_status_idx").on(t.categoryId, t.status),
    index("products_featured_idx").on(t.isFeatured).where(sql`${t.status} = 'published'`),
    check("products_slug_format", sql`${t.slug} ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'`),
    check(
      "products_published_has_date",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`,
    ),
  ],
);

/** Ordered gallery images. */
export const productImages = pgTable(
  "product_images",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.mediaId] }),
    index("product_images_product_sort_idx").on(t.productId, t.sortOrder),
  ],
);

/** Specification rows, optionally grouped (e.g. "Display", "Connectivity"). */
export const productSpecs = pgTable(
  "product_specs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    groupName: text("group_name"),
    label: text("label").notNull(),
    value: text("value").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("product_specs_product_sort_idx").on(t.productId, t.sortOrder)],
);

/** Downloadable datasheets / brochures (PDF). */
export const productDocuments = pgTable(
  "product_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    uniqueIndex("product_documents_product_media_uq").on(t.productId, t.mediaId),
    index("product_documents_product_sort_idx").on(t.productId, t.sortOrder),
  ],
);
