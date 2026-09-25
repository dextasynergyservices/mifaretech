import { sql } from "drizzle-orm";
import { check, index, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./_helpers";
import { user } from "./auth";

export const mediaKind = pgEnum("media_kind", ["image", "document"]);

export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: mediaKind("kind").notNull(),
    provider: text("provider").notNull().default("cloudinary"),
    publicId: text("public_id").notNull().unique(), // Cloudinary public_id, e.g. "products/abc123"
    secureUrl: text("secure_url").notNull(), // Cloudinary's https delivery URL, stored so we never rebuild it
    format: text("format").notNull(), // "jpg", "webp", "pdf"...
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text"),
    blurDataUrl: text("blur_data_url"), // tiny base64 placeholder for next/image
    uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [
    index("media_kind_created_idx").on(t.kind, t.createdAt),
    check("media_size_positive", sql`${t.sizeBytes} > 0`),
  ],
);
