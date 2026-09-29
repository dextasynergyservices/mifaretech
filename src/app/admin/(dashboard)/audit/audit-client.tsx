"use client";

import { ChevronDown, ChevronRight, Search, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TablePagination } from "@/components/admin/table-pagination";

export interface AuditLogItem {
  id: string;
  actorId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipHash: string | null;
  createdAt: Date | string;
}

export interface ActorOption {
  id: string;
  name: string;
  email: string;
}

interface AuditClientProps {
  initialLogs: AuditLogItem[];
  actors: ActorOption[];
}

export function AuditClient({ initialLogs, actors }: AuditClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, entityFilter, actorFilter, dateFilter]);

  const filtered = useMemo(() => {
    return initialLogs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q) ||
        log.entityId?.toLowerCase().includes(q) ||
        log.actorName?.toLowerCase().includes(q) ||
        log.actorEmail?.toLowerCase().includes(q);

      const matchesEntity = entityFilter === "all" || log.entityType === entityFilter;
      const matchesActor = actorFilter === "all" || log.actorId === actorFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const itemDate = new Date(log.createdAt).getTime();
        const now = Date.now();
        if (dateFilter === "today") {
          matchesDate = now - itemDate <= 24 * 60 * 60 * 1000;
        } else if (dateFilter === "7d") {
          matchesDate = now - itemDate <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === "30d") {
          matchesDate = now - itemDate <= 30 * 24 * 60 * 60 * 1000;
        }
      }

      return matchesSearch && matchesEntity && matchesActor && matchesDate;
    });
  }, [initialLogs, searchQuery, entityFilter, actorFilter, dateFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search action, actor, entity ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Entity Type Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          >
            <option value="all">All Entities</option>
            <option value="product">Product</option>
            <option value="category">Category</option>
            <option value="enquiry">Enquiry</option>
            <option value="solution">Solution</option>
            <option value="content_block">Content Block</option>
            <option value="faq">FAQ</option>
            <option value="testimonial">Testimonial</option>
            <option value="partner">Partner</option>
            <option value="site_settings">Settings</option>
            <option value="user">User</option>
            <option value="media">Media</option>
          </select>

          {/* Actor Filter */}
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          >
            <option value="all">All Actors</option>
            {actors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          >
            <option value="all">All Time</option>
            <option value="today">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="inline-flex size-12 rounded-xl bg-muted items-center justify-center text-muted-foreground">
              <ShieldAlert className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No audit events found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No administrative mutations match your selected filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5 w-8"></th>
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-5">Actor</th>
                  <th className="py-3 px-5">Action</th>
                  <th className="py-3 px-5">Entity</th>
                  <th className="py-3 px-5">Target ID</th>
                  <th className="py-3 px-5">IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedLogs.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const hasMeta = log.metadata && Object.keys(log.metadata).length > 0;

                  return (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td colSpan={7} className="p-0">
                        <div
                          onClick={() => hasMeta && toggleExpand(log.id)}
                          className={`py-3.5 px-5 flex items-center justify-between gap-4 ${
                            hasMeta ? "cursor-pointer" : ""
                          }`}
                        >
                          <div className="w-6 shrink-0 text-muted-foreground">
                            {hasMeta && (
                              <button
                                type="button"
                                className="p-1 hover:text-foreground transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-3.5" />
                                )}
                              </button>
                            )}
                          </div>

                          <div className="w-40 shrink-0 text-[11px] text-muted-foreground font-mono">
                            {new Date(log.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>

                          <div className="w-44 shrink-0 truncate">
                            <span className="font-bold text-foreground block truncate">
                              {log.actorName || "System / Automated"}
                            </span>
                            {log.actorEmail && (
                              <span className="text-[10px] text-muted-foreground block truncate">
                                {log.actorEmail}
                              </span>
                            )}
                          </div>

                          <div className="w-44 shrink-0">
                            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                              {log.action}
                            </span>
                          </div>

                          <div className="w-32 shrink-0">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground">
                              {log.entityType}
                            </span>
                          </div>

                          <div className="w-36 shrink-0 font-mono text-[10px] text-muted-foreground truncate">
                            {log.entityId || "-"}
                          </div>

                          <div className="flex-1 font-mono text-[10px] text-muted-foreground truncate">
                            {log.ipHash ? `${log.ipHash.slice(0, 12)}…` : "local"}
                          </div>
                        </div>

                        {/* Expanded Metadata Preview */}
                        {isExpanded && hasMeta && (
                          <div className="px-12 py-3 bg-muted/40 border-t border-border/60">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                              Action Metadata Payload:
                            </span>
                            <pre className="p-3 rounded-xl bg-background border border-border text-[11px] font-mono text-foreground overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
            pageSizeOptions={[10, 20, 50, 100]}
          />
        )}
      </div>
    </div>
  );
}
