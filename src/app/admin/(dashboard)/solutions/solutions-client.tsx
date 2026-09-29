"use client";

import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Edit,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { BatchActionBar } from "@/components/admin/batch-action-bar";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { type MediaUploadItem, SingleMediaUpload } from "@/components/admin/media-upload";
import { TableActionMenu } from "@/components/admin/table-action-menu";
import { TablePagination } from "@/components/admin/table-pagination";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  bulkDeleteSolutionsAction,
  createSolutionAction,
  deleteSolutionAction,
  reorderSolutionsAction,
  type SolutionInput,
  updateSolutionAction,
} from "@/server/actions/solutions";

export interface AdminSolutionItem {
  id: string;
  kind: "industry" | "service";
  title: string;
  slug: string;
  summary: string | null;
  bodyHtml: string | null;
  mediaId: string | null;
  mediaUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
}

interface SolutionsClientProps {
  initialSolutions: AdminSolutionItem[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function SolutionsClient({ initialSolutions }: SolutionsClientProps) {
  const [items, setItems] = useState<AdminSolutionItem[]>(initialSolutions);
  const [activeTab, setActiveTab] = useState<"industry" | "service">("industry");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset pagination when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [activeTab, searchQuery]);

  // Create / Edit Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<AdminSolutionItem | null>(null);
  const [formKind, setFormKind] = useState<"industry" | "service">("industry");
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formBodyHtml, setFormBodyHtml] = useState("");
  const [formMediaItem, setFormMediaItem] = useState<MediaUploadItem | null>(null);
  const [formMediaId, setFormMediaId] = useState<string | null>(null);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [isManualSlug, setIsManualSlug] = useState(false);

  // Delete Dialog
  const [deletingSolution, setDeletingSolution] = useState<AdminSolutionItem | null>(null);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const matchesTab = s.kind === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.summary?.toLowerCase().includes(q);

      return matchesTab && matchesQuery;
    });
  }, [items, activeTab, searchQuery]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const openCreateModal = () => {
    setEditingSolution(null);
    setFormKind(activeTab);
    setFormTitle("");
    setFormSlug("");
    setFormSummary("");
    setFormBodyHtml("");
    setFormMediaItem(null);
    setFormMediaId(null);
    setFormIsPublished(true);
    setIsManualSlug(false);
    setIsModalOpen(true);
  };

  const openEditModal = (sol: AdminSolutionItem) => {
    setEditingSolution(sol);
    setFormKind(sol.kind);
    setFormTitle(sol.title);
    setFormSlug(sol.slug);
    setFormSummary(sol.summary || "");
    setFormBodyHtml(sol.bodyHtml || "");
    setFormMediaItem(
      sol.mediaUrl
        ? {
            id: sol.mediaId || "",
            url: sol.mediaUrl,
            filename: `${sol.title} Media`,
          }
        : null,
    );
    setFormMediaId(sol.mediaId || null);
    setFormIsPublished(sol.isPublished);
    setIsManualSlug(true);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!isManualSlug) {
      setFormSlug(slugify(val));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSlug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    const payload: SolutionInput = {
      kind: formKind,
      title: formTitle.trim(),
      slug: formSlug.trim(),
      summary: formSummary.trim() || null,
      bodyHtml: formBodyHtml || null,
      mediaId: formMediaId,
      sortOrder: editingSolution?.sortOrder || items.length,
      isPublished: formIsPublished,
    };

    startTransition(async () => {
      try {
        if (editingSolution) {
          const res = await updateSolutionAction(editingSolution.id, payload);
          if (res.success) {
            setItems((prev) =>
              prev.map((s) =>
                s.id === editingSolution.id
                  ? {
                      ...s,
                      ...payload,
                      mediaUrl: formMediaItem?.url || null,
                    }
                  : s,
              ),
            );
            toast.success("Solution item updated");
            setIsModalOpen(false);
          } else {
            toast.error(res.error || "Failed to update solution");
          }
        } else {
          const res = await createSolutionAction(payload);
          if (res.success && res.solution) {
            const created = res.solution;
            setItems((prev) => [
              ...prev,
              {
                id: created.id,
                kind: created.kind,
                title: created.title,
                slug: created.slug,
                summary: created.summary,
                bodyHtml: created.bodyHtml,
                mediaId: created.mediaId,
                mediaUrl: formMediaItem?.url || null,
                sortOrder: created.sortOrder,
                isPublished: created.isPublished,
              },
            ]);
            toast.success("Solution item created");
            setIsModalOpen(false);
          } else {
            toast.error(res.error || "Failed to create solution");
          }
        }
      } catch {
        toast.error("Operation failed");
      }
    });
  };

  const handleDelete = () => {
    if (!deletingSolution) return;
    const solId = deletingSolution.id;

    startTransition(async () => {
      try {
        const res = await deleteSolutionAction(solId);
        if (res.success) {
          setItems((prev) => prev.filter((s) => s.id !== solId));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(solId);
            return next;
          });
          toast.success("Solution item deleted");
          setDeletingSolution(null);
        } else {
          toast.error(res.error || "Failed to delete");
        }
      } catch {
        toast.error("Failed to delete solution");
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      const res = await bulkDeleteSolutionsAction(idsArray);
      if (res.success) {
        setItems((prev) => prev.filter((s) => !selectedIds.has(s.id)));
        setSelectedIds(new Set());
        setShowBulkDeleteConfirm(false);
        toast.success(`Successfully deleted ${res.count ?? idsArray.length} solutions`);
      } else {
        toast.error(res.error || "Failed to delete selected solutions");
      }
    } catch {
      toast.error("Failed to delete selected solutions");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleMove = (indexInFiltered: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? indexInFiltered - 1 : indexInFiltered + 1;
    if (targetIdx < 0 || targetIdx >= filtered.length) return;

    const source = filtered[indexInFiltered];
    const target = filtered[targetIdx];
    if (!source || !target) return;

    const copy = [...items];
    const realSourceIdx = copy.findIndex((s) => s.id === source.id);
    const realTargetIdx = copy.findIndex((s) => s.id === target.id);
    if (realSourceIdx === -1 || realTargetIdx === -1) return;

    const sourceSort = source.sortOrder;
    const targetSort = target.sortOrder;

    const updatedSource = { ...source, sortOrder: targetSort };
    const updatedTarget = { ...target, sortOrder: sourceSort };

    copy[realSourceIdx] = updatedTarget;
    copy[realTargetIdx] = updatedSource;

    setItems(copy);

    startTransition(async () => {
      try {
        await reorderSolutionsAction([
          { id: updatedSource.id, sortOrder: updatedSource.sortOrder },
          { id: updatedTarget.id, sortOrder: updatedTarget.sortOrder },
        ]);
        toast.success("Order updated");
      } catch {
        toast.error("Failed to update order");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border self-start">
          <button
            type="button"
            onClick={() => setActiveTab("industry")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "industry"
                ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Industries Served (Retail, Food, etc.)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("service")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "service"
                ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Services Offered (Install, Support, etc.)
          </button>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>Add {activeTab === "industry" ? "Industry" : "Service"}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={`Search ${activeTab === "industry" ? "industries" : "services"}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
        />
      </div>

      {/* Solutions Table */}
      <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="inline-flex size-12 rounded-xl bg-muted items-center justify-center text-muted-foreground">
              <Briefcase className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                No {activeTab === "industry" ? "industries" : "services"} found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Showcase target business sectors and enterprise hardware service offerings.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="size-3.5" />
              <span>Create Item</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all solutions on page"
                      checked={
                        paginated.length > 0 && paginated.every((s) => selectedIds.has(s.id))
                      }
                      onChange={(e) => {
                        const next = new Set(selectedIds);
                        if (e.target.checked) {
                          for (const s of paginated) next.add(s.id);
                        } else {
                          for (const s of paginated) next.delete(s.id);
                        }
                        setSelectedIds(next);
                      }}
                      className="rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-5">Order</th>
                  <th className="py-3 px-5">Title</th>
                  <th className="py-3 px-5">Summary</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((sol, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx;
                  return (
                    <tr
                      key={sol.id}
                      className={`hover:bg-muted/30 transition-colors group ${
                        selectedIds.has(sol.id) ? "bg-primary/5 dark:bg-primary/10" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select ${sol.title}`}
                          checked={selectedIds.has(sol.id)}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) {
                              next.add(sol.id);
                            } else {
                              next.delete(sol.id);
                            }
                            setSelectedIds(next);
                          }}
                          className="rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={globalIdx === 0 || isPending}
                            onClick={() => handleMove(globalIdx, "up")}
                            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={globalIdx === filtered.length - 1 || isPending}
                            onClick={() => handleMove(globalIdx, "down")}
                            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 rounded-xl bg-muted overflow-hidden shrink-0 border border-border">
                            {sol.mediaUrl ? (
                              <Image
                                src={sol.mediaUrl}
                                alt={sol.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Briefcase className="size-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{sol.title}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {sol.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 max-w-sm truncate text-muted-foreground">
                        {sol.summary || "-"}
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sol.isPublished
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {sol.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <TableActionMenu
                          ariaLabel={`Actions for ${sol.title}`}
                          items={[
                            {
                              label: "Edit Solution",
                              onClick: () => openEditModal(sol),
                              icon: <Edit className="size-3.5" />,
                            },
                            {
                              label: "View on Site",
                              href: `/solutions#${sol.slug}`,
                              target: "_blank",
                              icon: <ExternalLink className="size-3.5" />,
                            },
                            {
                              label: "Delete Solution",
                              onClick: () => setDeletingSolution(sol),
                              icon: <Trash2 className="size-3.5" />,
                              variant: "destructive",
                              separatorBefore: true,
                            },
                          ]}
                        />
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
          />
        )}
      </div>

      {/* Add / Edit Solution Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingSolution ? `Edit: ${editingSolution.title}` : "Create Solution Offering"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Provide comprehensive industry application or hardware service information.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Offering Type *
                  </label>
                  <select
                    value={formKind}
                    onChange={(e) => setFormKind(e.target.value as "industry" | "service")}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                  >
                    <option value="industry">Industry Served (Retail, Food, etc.)</option>
                    <option value="service">Technical Service (Install, Training, etc.)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Retail & Supermarket POS Systems"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground">URL Slug *</label>
                  <button
                    type="button"
                    onClick={() => setIsManualSlug(!isManualSlug)}
                    className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {isManualSlug ? "Auto-sync" : "Edit manually"}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formSlug}
                  readOnly={!isManualSlug}
                  onChange={(e) => setFormSlug(slugify(e.target.value))}
                  placeholder="retail-supermarket-pos"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Executive Summary
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="One or two sentences highlighting this offering..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Cover Media Upload */}
              <SingleMediaUpload
                folder="solutions"
                kind="image"
                label="Cover Image"
                initialItem={formMediaItem}
                onChange={(item) => {
                  setFormMediaItem(item);
                  setFormMediaId(item?.id || null);
                }}
              />

              {/* Body Tiptap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Detailed Case Study &amp; Capability Copy
                </label>
                <TiptapEditor value={formBodyHtml} onChange={(html) => setFormBodyHtml(html)} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-xs font-bold text-foreground block">Published Status</span>
                  <span className="text-[11px] text-muted-foreground">
                    Display on the public /solutions page
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  className="size-4 accent-brand-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>{editingSolution ? "Save Changes" : "Create Offering"}</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batch Action Floating Bar */}
      <BatchActionBar
        selectedCount={selectedIds.size}
        totalCount={filtered.length}
        itemLabel="solutions"
        isDeleting={isBulkDeleting}
        onClear={() => setSelectedIds(new Set())}
        onDeleteSelected={() => setShowBulkDeleteConfirm(true)}
      />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingSolution)}
        onOpenChange={(open) => !open && setDeletingSolution(null)}
        title="Delete Offering"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{deletingSolution?.title}</strong>? This action
            cannot be undone.
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
        title="Delete Selected Offerings"
        itemCount={selectedIds.size}
        description={
          <>
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">{selectedIds.size}</strong> selected items? This
            action cannot be undone.
          </>
        }
        confirmLabel={`Delete ${selectedIds.size} ${selectedIds.size === 1 ? "Item" : "Items"}`}
        isPending={isBulkDeleting}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
