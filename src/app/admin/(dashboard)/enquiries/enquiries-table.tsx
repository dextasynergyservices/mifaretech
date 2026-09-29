"use client";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  Inbox,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { BatchActionBar } from "@/components/admin/batch-action-bar";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { TableActionMenu } from "@/components/admin/table-action-menu";
import { TablePagination } from "@/components/admin/table-pagination";
import { bulkDeleteEnquiriesAction, deleteEnquiryAction } from "@/server/actions/enquiries";

export interface EnquiryListItem {
  id: string;
  reference: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  businessType: string | null;
  terminalCount: number | null;
  status: string;
  source: string;
  notifyEmailStatus: string;
  createdAt: Date | string;
}

interface EnquiriesTableProps {
  initialEnquiries: EnquiryListItem[];
}

export function EnquiriesTable({ initialEnquiries }: EnquiriesTableProps) {
  const [items, setItems] = useState<EnquiryListItem[]>(initialEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [deletingEnquiry, setDeletingEnquiry] = useState<EnquiryListItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchQuery, statusFilter, sourceFilter, dateFilter]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.company?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSource = sourceFilter === "all" || item.source === sourceFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const itemDate = new Date(item.createdAt).getTime();
        const now = Date.now();
        if (dateFilter === "today") {
          matchesDate = now - itemDate <= 24 * 60 * 60 * 1000;
        } else if (dateFilter === "7d") {
          matchesDate = now - itemDate <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === "30d") {
          matchesDate = now - itemDate <= 30 * 24 * 60 * 60 * 1000;
        }
      }

      return matchesSearch && matchesStatus && matchesSource && matchesDate;
    });
  }, [items, searchQuery, statusFilter, sourceFilter, dateFilter]);

  const handleDelete = () => {
    if (!deletingEnquiry) return;
    const enqId = deletingEnquiry.id;

    startTransition(async () => {
      try {
        const res = await deleteEnquiryAction(enqId);
        if (res.success) {
          setItems((prev) => prev.filter((e) => e.id !== enqId));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(enqId);
            return next;
          });
          toast.success("Enquiry deleted successfully");
          setDeletingEnquiry(null);
        } else {
          toast.error(res.error || "Failed to delete enquiry");
        }
      } catch {
        toast.error("Failed to delete enquiry");
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      const res = await bulkDeleteEnquiriesAction(idsArray);
      if (res.success) {
        setItems((prev) => prev.filter((e) => !selectedIds.has(e.id)));
        setSelectedIds(new Set());
        setShowBulkDeleteConfirm(false);
        toast.success(`Successfully deleted ${res.count ?? idsArray.length} enquiries`);
      } else {
        toast.error(res.error || "Failed to delete selected enquiries");
      }
    } catch {
      toast.error("Failed to delete selected enquiries");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const exportCSV = () => {
    if (!filtered.length) {
      toast.error("No enquiries to export");
      return;
    }

    const headers = [
      "Reference",
      "Date",
      "Client Name",
      "Company",
      "Email",
      "Phone",
      "Sector",
      "Terminal Count",
      "Status",
      "Source",
      "Email Delivery",
    ];

    const rows = filtered.map((e) => [
      `"${e.reference}"`,
      `"${new Date(e.createdAt).toISOString()}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${(e.company || "").replace(/"/g, '""')}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.businessType || ""}"`,
      e.terminalCount ?? "",
      `"${e.status}"`,
      `"${e.source}"`,
      `"${e.notifyEmailStatus}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `mifaretech-enquiries-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filtered.length} enquiries to CSV`);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, company, email, reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Filter dropdowns & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="quoted">Quoted</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="spam">Spam</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Sources</option>
            <option value="contact_form">Contact Form</option>
            <option value="catalogue">Catalogue Basket</option>
            <option value="product_page">Product Page</option>
            <option value="quiz">Quiz Advisor</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Time</option>
            <option value="today">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>

          {/* CSV Export Button */}
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold transition-colors"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="inline-flex size-12 rounded-xl bg-muted items-center justify-center text-muted-foreground">
              <Inbox className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No matching enquiries found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search query, status filters, or date range.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all enquiries on page"
                      checked={
                        paginated.length > 0 && paginated.every((e) => selectedIds.has(e.id))
                      }
                      onChange={(e) => {
                        const next = new Set(selectedIds);
                        if (e.target.checked) {
                          for (const item of paginated) next.add(item.id);
                        } else {
                          for (const item of paginated) next.delete(item.id);
                        }
                        setSelectedIds(next);
                      }}
                      className="rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-5">Reference</th>
                  <th className="py-3 px-5">Client &amp; Company</th>
                  <th className="py-3 px-5">Sector &amp; Scope</th>
                  <th className="py-3 px-5">Source</th>
                  <th className="py-3 px-5">Delivery</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className={`hover:bg-muted/30 transition-colors group cursor-pointer ${
                      selectedIds.has(enquiry.id) ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Select enquiry ${enquiry.reference}`}
                        checked={selectedIds.has(enquiry.id)}
                        onChange={(e) => {
                          const next = new Set(selectedIds);
                          if (e.target.checked) {
                            next.add(enquiry.id);
                          } else {
                            next.delete(enquiry.id);
                          }
                          setSelectedIds(next);
                        }}
                        className="rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-foreground whitespace-nowrap">
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {enquiry.reference}
                      </Link>
                    </td>

                    <td className="py-3.5 px-5">
                      <p className="font-bold text-foreground">{enquiry.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {enquiry.company || enquiry.email}
                      </p>
                    </td>

                    <td className="py-3.5 px-5">
                      <p className="font-medium text-foreground capitalize">
                        {enquiry.businessType || "General Commercial"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {enquiry.terminalCount
                          ? `${enquiry.terminalCount} terminals`
                          : "Scale unstated"}
                      </p>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border">
                        {enquiry.source.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {enquiry.notifyEmailStatus === "sent" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="size-3.5" />
                          <span>Sent</span>
                        </span>
                      ) : enquiry.notifyEmailStatus === "failed" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive">
                          <AlertCircle className="size-3.5" />
                          <span>Failed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <Clock className="size-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          enquiry.status === "new"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            : enquiry.status === "in_progress"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : enquiry.status === "quoted"
                                ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                : enquiry.status === "won"
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : enquiry.status === "lost"
                                    ? "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                                    : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}
                      >
                        {enquiry.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap text-[11px]">
                      {new Date(enquiry.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <TableActionMenu
                        ariaLabel={`Actions for enquiry ${enquiry.reference}`}
                        items={[
                          {
                            label: "View Enquiry Details",
                            href: `/admin/enquiries/${enquiry.id}`,
                            icon: <Eye className="size-3.5" />,
                          },
                          {
                            label: "Copy Reference",
                            onClick: () => {
                              navigator.clipboard.writeText(enquiry.reference);
                              toast.success(`Reference ${enquiry.reference} copied to clipboard`);
                            },
                            icon: <Copy className="size-3.5" />,
                          },
                          {
                            label: "Delete Enquiry",
                            onClick: () => setDeletingEnquiry(enquiry),
                            icon: <Trash2 className="size-3.5" />,
                            variant: "destructive",
                            separatorBefore: true,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Batch Action Floating Bar */}
      <BatchActionBar
        selectedCount={selectedIds.size}
        totalCount={filtered.length}
        itemLabel="enquiries"
        isDeleting={isBulkDeleting}
        onClear={() => setSelectedIds(new Set())}
        onDeleteSelected={() => setShowBulkDeleteConfirm(true)}
      />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingEnquiry)}
        onOpenChange={(open) => !open && setDeletingEnquiry(null)}
        title="Delete Customer Enquiry"
        description={
          <>
            Are you sure you want to delete enquiry{" "}
            <strong className="text-foreground">{deletingEnquiry?.reference}</strong> (
            {deletingEnquiry?.name})? This will permanently remove the submission, note records, and
            status logs.
          </>
        }
        confirmLabel="Confirm Delete"
        isPending={isPending}
        onConfirm={handleDelete}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        open={showBulkDeleteConfirm}
        onOpenChange={setShowBulkDeleteConfirm}
        title="Delete Selected Enquiries"
        itemCount={selectedIds.size}
        description={
          <>
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">{selectedIds.size}</strong> selected customer
            enquiries? This action cannot be undone.
          </>
        }
        confirmLabel={`Delete ${selectedIds.size} ${selectedIds.size === 1 ? "Enquiry" : "Enquiries"}`}
        isPending={isBulkDeleting}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
