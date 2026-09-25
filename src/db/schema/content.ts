import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { type RichTextJson, timestamps, tz } from "./_helpers";
import { user } from "./auth";
import { media } from "./media";

export const sitePage = pgEnum("site_page", [
  "global",
  "home",
  "about",
  "catalogue",
  "solutions",
  "contact",
]);
export const solutionKind = pgEnum("solution_kind", ["industry", "service"]);

/**
 * Key/value settings. Suggested keys:
 *  "company"  { legalName, tagline, foundedYear }
 *  "contact"  { emails[], phones[], whatsapp, address, mapUrl, hours }
 *  "social"   { facebook, instagram, linkedin, x, youtube }
 *  "seo"      { siteName, defaultTitle, defaultDescription, ogMediaId }
 */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedBy: text("updated_by").references(() => user.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", tz)
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Per-page SEO metadata editable from the dashboard. */
export const pageSeo = pgTable("page_seo", {
  page: sitePage("page").primaryKey(),
  title: text("title"),
  description: text("description"),
  ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", tz)
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Editable page sections (hero copy, stats, about story...). One row per (page, blockKey). */
export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    page: sitePage("page").notNull(),
    blockKey: text("block_key").notNull(), // e.g. "hero", "why-us", "stats"
    title: text("title"),
    body: jsonb("body").$type<RichTextJson>(),
    bodyHtml: text("body_html"), // sanitised
    data: jsonb("data").$type<Record<string, unknown>>(), // structured extras (stats, CTA labels...)
    mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    updatedBy: text("updated_by").references(() => user.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("content_blocks_page_key_uq").on(t.page, t.blockKey),
    index("content_blocks_page_sort_idx").on(t.page, t.sortOrder),
  ],
);

/** Solutions page items: industries served and services offered. */
export const solutions = pgTable(
  "solutions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: solutionKind("kind").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary"),
    body: jsonb("body").$type<RichTextJson>(),
    bodyHtml: text("body_html"),
    mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("solutions_kind_sort_idx").on(t.kind, t.sortOrder)],
);

export const faqs = pgTable(
  "faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    question: text("question").notNull(),
    answer: jsonb("answer").$type<RichTextJson>(),
    answerHtml: text("answer_html").notNull(), // sanitised
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("faqs_published_sort_idx").on(t.isPublished, t.sortOrder)],
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quote: text("quote").notNull(),
    authorName: text("author_name").notNull(),
    authorRole: text("author_role"),
    company: text("company"),
    avatarMediaId: uuid("avatar_media_id").references(() => media.id, { onDelete: "set null" }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("testimonials_published_sort_idx").on(t.isPublished, t.sortOrder)],
);

/** Partner / accreditation logos shown on Home and About (not used for catalogue filtering). */
export const partners = pgTable(
  "partners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    websiteUrl: text("website_url"),
    logoMediaId: uuid("logo_media_id").references(() => media.id, { onDelete: "set null" }),
    accreditationNote: text("accreditation_note"), // e.g. "Accredited distributor"
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("partners_published_sort_idx").on(t.isPublished, t.sortOrder)],
);
