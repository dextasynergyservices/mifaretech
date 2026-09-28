import { desc } from "drizzle-orm";
import { AlertCircle, CheckCircle2, ChevronRight, Clock, Inbox } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { requireRole } from "@/lib/session";

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

      {/* Enquiries List */}
      <div className="rounded-3xl bg-card border border-border shadow-xs overflow-hidden">
        {allEnquiries.length === 0 ? (
          <div className="text-center py-20 px-4 space-y-4">
            <div className="inline-flex size-14 rounded-2xl bg-muted items-center justify-center text-muted-foreground">
              <Inbox className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No enquiries received yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Enquiries submitted via the contact form or product catalogue will appear here
                instantly.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Reference</th>
                  <th className="py-3.5 px-6">Client &amp; Company</th>
                  <th className="py-3.5 px-6">Sector &amp; Scope</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6">Email Delivery</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="hover:bg-muted/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-foreground whitespace-nowrap">
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {enquiry.reference}
                      </Link>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-foreground">{enquiry.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {enquiry.company || enquiry.email}
                      </p>
                    </td>

                    <td className="py-4 px-6 capitalize text-muted-foreground">
                      <span>{enquiry.businessType || "General"}</span>
                      {enquiry.terminalCount && (
                        <span className="block text-[11px] text-foreground font-mono">
                          {enquiry.terminalCount} units
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border">
                        {enquiry.source}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {enquiry.notifyEmailStatus === "sent" ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle2 className="size-3.5" />
                          Sent
                        </span>
                      ) : enquiry.notifyEmailStatus === "failed" ? (
                        <span className="inline-flex items-center gap-1.5 text-destructive font-bold text-[11px]">
                          <AlertCircle className="size-3.5" />
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px]">
                          <Clock className="size-3.5" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          enquiry.status === "new"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            : enquiry.status === "quoted"
                              ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-muted-foreground whitespace-nowrap">
                      {new Date(enquiry.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground text-xs font-bold transition-colors border border-border"
                      >
                        <span>View</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
