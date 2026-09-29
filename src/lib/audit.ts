import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { env } from "@/env";

export interface LogAuditParams {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent({
  actorId,
  action,
  entityType,
  entityId,
  metadata = {},
}: LogAuditParams) {
  try {
    let ipHash: string | null = null;
    try {
      const h = await headers();
      const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
      if (ip && env.IP_HASH_SALT) {
        ipHash = createHmac("sha256", env.IP_HASH_SALT).update(ip).digest("hex");
      }
    } catch {
      // Non-request context fallback
    }

    await db.insert(auditLogs).values({
      actorId: actorId ?? null,
      action,
      entityType,
      entityId: entityId ?? null,
      metadata,
      ipHash,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
