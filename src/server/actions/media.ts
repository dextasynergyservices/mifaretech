"use server";

import { z } from "zod";
import { db } from "@/db";
import { media } from "@/db/schema";
import { logAuditEvent } from "@/lib/audit";
import { requireRole } from "@/lib/session";
import { ALLOWED_UPLOADS, createUploadSignature, getUploadedResource } from "@/lib/storage";

const signatureSchema = z.object({
  folder: z.string().min(1).default("general"),
});

export async function getUploadSignatureAction(input: { folder?: string } = {}) {
  await requireRole(["admin", "editor"]);
  const parsed = signatureSchema.parse({ folder: input.folder || "general" });
  return createUploadSignature(parsed.folder);
}

const confirmUploadSchema = z.object({
  publicId: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  kind: z.enum(["image", "document"]),
  altText: z.string().max(250).optional(),
});

export async function confirmUploadAction(input: z.infer<typeof confirmUploadSchema>) {
  const session = await requireRole(["admin", "editor"]);
  const data = confirmUploadSchema.parse(input);

  // 1. Hardened SVG rejection (XSS vulnerability prevention)
  if (data.mimeType === "image/svg+xml" || data.filename.toLowerCase().endsWith(".svg")) {
    throw new Error("SVG uploads are rejected due to security policies (XSS risk).");
  }

  // 2. MIME type verification
  const allowedConfig = ALLOWED_UPLOADS[data.mimeType as keyof typeof ALLOWED_UPLOADS];
  if (!allowedConfig) {
    throw new Error(`Unsupported MIME type: ${data.mimeType}`);
  }

  if (allowedConfig.kind !== data.kind) {
    throw new Error(`Mismatched file kind '${data.kind}' for MIME type '${data.mimeType}'`);
  }

  // 3. Server-side resource verification via Cloudinary
  const resourceType = data.kind === "document" ? "raw" : "image";
  const verified = await getUploadedResource(data.publicId, resourceType);

  const finalSize = verified?.bytes || data.sizeBytes;
  if (finalSize > allowedConfig.maxBytes) {
    const limitLabel = data.kind === "image" ? "5MB" : "8MB";
    throw new Error(
      `File exceeds upload limit (Max ${limitLabel} for ${data.kind}s). Maximum allowed is ${limitLabel} (received ${(finalSize / (1024 * 1024)).toFixed(1)}MB).`,
    );
  }

  if (verified?.format === "svg") {
    throw new Error("SVG assets are strictly forbidden.");
  }

  const secureUrl =
    verified?.secureUrl ||
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || "mifaretech"}/${resourceType}/upload/${data.publicId}`;
  const finalFormat = verified?.format || (data.kind === "document" ? "pdf" : "jpg");

  const [inserted] = await db
    .insert(media)
    .values({
      kind: data.kind,
      provider: "cloudinary",
      publicId: data.publicId,
      secureUrl,
      format: finalFormat,
      filename: data.filename,
      mimeType: data.mimeType,
      sizeBytes: finalSize,
      width: verified?.width || null,
      height: verified?.height || null,
      altText: data.altText || null,
      uploadedBy: session.user.id,
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to register media asset in database.");
  }

  await logAuditEvent({
    actorId: session.user.id,
    action: "media.upload",
    entityType: "media",
    entityId: inserted.id,
    metadata: {
      publicId: data.publicId,
      kind: data.kind,
      filename: data.filename,
    },
  });

  return inserted;
}
