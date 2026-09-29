import { desc } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { requireRole } from "@/lib/session";
import { EnquiriesTable } from "./enquiries-table";

export const instant = false;

export default async function AdminEnquiriesPage() {
  await requireRole(["admin", "editor"]);

  const allEnquiries = await db
    .select({
      id: schema.enquiries.id,
      reference: schema.enquiries.reference,
      name: schema.enquiries.name,
      company: schema.enquiries.company,
      email: schema.enquiries.email,
      phone: schema.enquiries.phone,
      businessType: schema.enquiries.businessType,
      terminalCount: schema.enquiries.terminalCount,
      status: schema.enquiries.status,
      source: schema.enquiries.source,
      notifyEmailStatus: schema.enquiries.notifyEmailStatus,
      createdAt: schema.enquiries.createdAt,
    })
    .from(schema.enquiries)
    .orderBy(desc(schema.enquiries.createdAt));

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="editorial-badge">Operations &amp; CRM</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Commercial Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review incoming quotations, customer specifications, and email delivery dispatch
            records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-foreground">
            Total: {allEnquiries.length} enquiries
          </span>
        </div>
      </div>

      {/* Enquiries Filterable Table with CSV Export */}
      <EnquiriesTable initialEnquiries={allEnquiries} />
    </div>
  );
}
