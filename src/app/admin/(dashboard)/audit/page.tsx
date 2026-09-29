import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, user } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { AuditClient } from "./audit-client";

export const instant = false;

export default async function AdminAuditPage() {
  await requireRole(["admin"]);

  const [rawLogs, staffUsers] = await Promise.all([
    db
      .select({
        id: auditLogs.id,
        actorId: auditLogs.actorId,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        metadata: auditLogs.metadata,
        ipHash: auditLogs.ipHash,
        createdAt: auditLogs.createdAt,
        actorName: user.name,
        actorEmail: user.email,
      })
      .from(auditLogs)
      .leftJoin(user, eq(auditLogs.actorId, user.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(300),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user),
  ]);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="editorial-badge">Access &amp; System</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            System Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Append-only chronological record of all administrative modifications, staff logins, and
            status mutations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-foreground">
            Total Logged: {rawLogs.length} events
          </span>
        </div>
      </div>

      <AuditClient initialLogs={rawLogs} actors={staffUsers} />
    </div>
  );
}
