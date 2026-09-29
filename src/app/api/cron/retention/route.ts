import { and, eq, lt } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs, enquiries } from "@/db/schema";
import { env } from "@/env";
import { logAuditEvent } from "@/lib/audit";
import { calculateRetentionCutoffs } from "@/lib/retention";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  // Enforce CRON_SECRET Bearer Token authorization
  if (authHeader !== `Bearer ${env.CRON_SECRET}` && !isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    const { spamCutoff, auditCutoff, enquiryCutoff } = calculateRetentionCutoffs();

    // 1. Purge spam enquiries older than 30 days
    const deletedSpam = await db
      .delete(enquiries)
      .where(and(eq(enquiries.status, "spam"), lt(enquiries.createdAt, spamCutoff)))
      .returning({ id: enquiries.id });

    // 2. Anonymise enquiries older than 24 months (GDPR storage limitation)
    const anonymisedEnquiries = await db
      .update(enquiries)
      .set({
        name: "Anonymised Client",
        company: null,
        email: "redacted@mifaretech.internal",
        phone: "[REDACTED]",
      })
      .where(lt(enquiries.createdAt, enquiryCutoff))
      .returning({ id: enquiries.id });

    // 3. Prune audit logs past 12 months retention window
    const prunedLogs = await db
      .delete(auditLogs)
      .where(lt(auditLogs.createdAt, auditCutoff))
      .returning({ id: auditLogs.id });

    const durationMs = Date.now() - startTime;

    // Record internal audit event for compliance tracking
    await logAuditEvent({
      action: "retention.cron_run",
      entityType: "system",
      metadata: {
        deletedSpamCount: deletedSpam.length,
        anonymisedEnquiriesCount: anonymisedEnquiries.length,
        prunedLogsCount: prunedLogs.length,
        durationMs,
      },
    });

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      durationMs,
      retention: {
        spamDeleted: deletedSpam.length,
        enquiriesAnonymised: anonymisedEnquiries.length,
        auditLogsPruned: prunedLogs.length,
      },
    });
  } catch (error) {
    console.error("Retention cron error:", error);
    return NextResponse.json(
      {
        error: "Retention execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
