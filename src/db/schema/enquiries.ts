import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps, tz } from "./_helpers";
import { user } from "./auth";
import { products } from "./catalogue";

export const enquiryStatus = pgEnum("enquiry_status", [
  "new",
  "in_progress",
  "quoted",
  "won",
  "lost",
  "spam",
]);
export const enquirySource = pgEnum("enquiry_source", [
  "contact_form",
  "catalogue",
  "product_page",
  "quiz",
]);
export const emailStatus = pgEnum("email_status", ["pending", "sent", "failed"]);

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(), // e.g. MFT-9F3A21BC, shown to the visitor

    // Contact details
    name: text("name").notNull(),
    company: text("company"),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    businessType: text("business_type"),
    terminalCount: integer("terminal_count"),
    message: text("message").notNull(),
    quizAnswers: jsonb("quiz_answers").$type<Record<string, string | string[]>>(),

    // Workflow
    status: enquiryStatus("status").notNull().default("new"),
    source: enquirySource("source").notNull().default("contact_form"),
    assignedTo: text("assigned_to").references(() => user.id, { onDelete: "set null" }),
    firstResponseAt: timestamp("first_response_at", tz),
    closedAt: timestamp("closed_at", tz),

    // Consent and compliance
    consentGiven: boolean("consent_given").notNull(),
    consentAt: timestamp("consent_at", tz).notNull().defaultNow(),
    privacyPolicyVersion: text("privacy_policy_version"),

    // Anti-abuse and attribution (no raw IPs stored)
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    landingPath: text("landing_path"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    captchaScore: real("captcha_score"),

    // Email delivery tracking
    notifyEmailStatus: emailStatus("notify_email_status").notNull().default("pending"),
    notifyEmailError: text("notify_email_error"),
    autoReplyStatus: emailStatus("auto_reply_status").notNull().default("pending"),

    ...timestamps,
  },
  (t) => [
    index("enquiries_status_created_idx").on(t.status, t.createdAt),
    index("enquiries_created_idx").on(t.createdAt),
    index("enquiries_email_idx").on(t.email),
    index("enquiries_assigned_idx").on(t.assignedTo),
    index("enquiries_iphash_created_idx").on(t.ipHash, t.createdAt), // rate limiting
    check("enquiries_consent_required", sql`${t.consentGiven} = true`),
    check(
      "enquiries_terminal_count_range",
      sql`${t.terminalCount} IS NULL OR (${t.terminalCount} BETWEEN 1 AND 10000)`,
    ),
  ],
);

/** Products attached to an enquiry (the "enquiry basket"). */
export const enquiryItems = pgTable(
  "enquiry_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(), // snapshot
    modelNumber: text("model_number"), // snapshot
    quantity: integer("quantity").notNull().default(1),
    note: text("note"),
  },
  (t) => [
    index("enquiry_items_enquiry_idx").on(t.enquiryId),
    index("enquiry_items_product_idx").on(t.productId),
    check("enquiry_items_quantity_range", sql`${t.quantity} BETWEEN 1 AND 1000`),
  ],
);

/** Internal staff notes. */
export const enquiryNotes = pgTable(
  "enquiry_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", tz).notNull().defaultNow(),
  },
  (t) => [index("enquiry_notes_enquiry_created_idx").on(t.enquiryId, t.createdAt)],
);

/** Every status change, for accountability and response-time reporting. */
export const enquiryStatusHistory = pgTable(
  "enquiry_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    fromStatus: enquiryStatus("from_status"),
    toStatus: enquiryStatus("to_status").notNull(),
    changedBy: text("changed_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", tz).notNull().defaultNow(),
  },
  (t) => [index("enquiry_status_history_enquiry_idx").on(t.enquiryId, t.createdAt)],
);
