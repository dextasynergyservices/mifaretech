import { timestamp } from "drizzle-orm/pg-core";

export const tz = { withTimezone: true } as const;

/** Reusable created/updated columns. */
export const timestamps = {
  createdAt: timestamp("created_at", tz).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", tz)
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Tiptap / ProseMirror JSON document. */
export type RichTextJson = Record<string, unknown>;
