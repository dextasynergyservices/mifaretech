import { z } from "zod";

export const BUSINESS_TYPES = [
  "retail",
  "restaurant",
  "pharmacy",
  "supermarket",
  "hospitality",
  "other",
] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  company: z.string().trim().max(160, "Company name is too long").optional().nullable(),
  email: z
    .string()
    .trim()
    .email("Please enter a valid work email address")
    .max(254, "Email is too long"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(25, "Phone number is too long")
    .regex(/^[+\d\s()./-]+$/, "Enter a valid phone number"),
  businessType: z.enum(BUSINESS_TYPES).optional().nullable(),
  terminalCount: z.coerce
    .number()
    .int()
    .min(1, "Terminal count must be at least 1")
    .max(10000, "Maximum 10,000 terminals per quotation")
    .optional()
    .nullable(),
  message: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters describing your requirement")
    .max(2000, "Message is too long (maximum 2,000 characters)"),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.number().int().min(1).max(1000),
      }),
    )
    .max(30)
    .default([]),
  quizAnswers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  source: z.enum(["contact_form", "catalogue", "product_page", "quiz"]).default("contact_form"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Consent to the privacy policy is required",
  }),
  captchaToken: z.string().optional().default(""),
  website: z.string().max(0, "Honeypot field must be empty").optional(), // honeypot
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
