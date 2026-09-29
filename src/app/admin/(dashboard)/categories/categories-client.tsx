"use client";

import {
  ArrowDown,
  ArrowUp,
  Edit,
  ExternalLink,
  FolderTree,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  bulkDeleteCategoriesAction,
  type CategoryInput,
  createCategoryAction,
  deleteCategoryAction,
  reorderCategoriesAction,
  updateCategoryAction,
} from "@/server/actions/categories";

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverMediaId: string | null;
  coverUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface CategoriesClientProps {
  initialCategories: AdminCategoryItem[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [items, setItems] = useState<AdminCategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isPending, startTransition] = useTransition();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchQuery]);

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formCoverItem, setFormCoverItem] = useState<MediaUploadItem | null>(null);
  const [formCoverId, setFormCoverId] = useState<string | null>(null);
  const [isManualSlug, setIsManualSlug] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormIsActive(true);
    setFormCoverItem(null);
    setFormCoverId(null);
    setIsManualSlug(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: AdminCategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormIsActive(cat.isActive);
    setFormCoverItem(
      cat.coverUrl
        ? {
            id: cat.coverMediaId || "",
            url: cat.coverUrl,
            filename: `${cat.name} Cover`,
          }
        : null,
    );
    setFormCoverId(cat.coverMediaId || null);
    setIsManualSlug(true);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!isManualSlug) {
      setFormSlug(slugify(val));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    const payload: CategoryInput = {
      name: formName.trim(),
      slug: formSlug.trim(),
      description: formDescription.trim() || null,
      coverMediaId: formCoverId,
      isActive: formIsActive,
      sortOrder: editingCategory?.sortOrder || items.length,
    };

    startTransition(async () => {
      try {
        if (editingCategory) {
          const res = await updateCategoryAction(editingCategory.id, payload);
          if (res.success) {
            setItems((prev) =>
              prev.map((c) =>
                c.id === editingCategory.id
                  ? {
                      ...c,
                      ...payload,
                      coverUrl: formCoverItem?.url || null,
                    }
                  : c,
              ),
            );
            toast.success("Category updated successfully");
            setIsModalOpen(false);
          } else {
            toast.error(res.error || "Failed to update category");
          }
        } else {
          const res = await createCategoryAction(payload);
          if (res.success && res.category) {
            setItems((prev) => [
              ...prev,
              {
                id: res.category.id,
                name: res.category.name,
                slug: res.category.slug,
                description: res.category.description,
                coverMediaId: res.category.coverMediaId,
                coverUrl: formCoverItem?.url || null,
                sortOrder: res.category.sortOrder,
                isActive: res.category.isActive,
                productCount: 0,
              },
            ]);
            toast.success("Category created successfully");
            setIsModalOpen(false);
          } else {
            toast.error(res.error || "Failed to create category");
          }
        }
      } catch (_err: unknown) {
        toast.error("Operation failed");
      }
    });
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    const catId = deletingCategory.id;

    startTransition(async () => {
      try {
        const res = await deleteCategoryAction(catId);
        if (res.success) {
          setItems((prev) => prev.filter((c) => c.id !== catId));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(catId);
            return next;
          });
          toast.success("Category deleted");
          setDeletingCategory(null);
        } else {
          toast.error(res.error || "Failed to delete category");
        }
      } catch {
        toast.error("Failed to delete category");
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      const res = await bulkDeleteCategoriesAction(idsArray);
      if (res.success) {
        setItems((prev) => prev.filter((c) => !selectedIds.has(c.id)));
        setSelectedIds(new Set());
        setShowBulkDeleteConfirm(false);
        toast.success(`Successfully deleted ${res.count ?? idsArray.length} categories`);
      } else {
        toast.error(res.error || "Failed to delete selected categories");
      }
    } catch {
      toast.error("Failed to delete selected categories");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleToggleActive = (cat: AdminCategoryItem) => {
    const updatedStatus = !cat.isActive;
    startTransition(async () => {
      try {
        const res = await updateCategoryAction(cat.id, {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          coverMediaId: cat.coverMediaId,
          sortOrder: cat.sortOrder,
          isActive: updatedStatus,
        });
        if (res.success) {
          setItems((prev) =>
            prev.map((c) => (c.id === cat.id ? { ...c, isActive: updatedStatus } : c)),
          );
          toast.success(`Category ${updatedStatus ? "activated" : "deactivated"}`);
        } else {
          toast.error(res.error || "Failed to toggle status");
        }
      } catch {
        toast.error("Failed to toggle status");
      }
    });
  };

  const handleMove = (indexInFiltered: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? indexInFiltered - 1 : indexInFiltered + 1;
    if (targetIdx < 0 || targetIdx >= filtered.length) return;

    const source = filtered[indexInFiltered];
    const target = filtered[targetIdx];
    if (!source || !target) return;

    const copy = [...items];
    const realSourceIdx = copy.findIndex((c) => c.id === source.id);
    const realTargetIdx = copy.findIndex((c) => c.id === target.id);
    if (realSourceIdx === -1 || realTargetIdx === -1) return;

    const sourceOrder = source.sortOrder;
    const targetOrder = target.sortOrder;

    const updatedSource = { ...source, sortOrder: targetOrder };
    const updatedTarget = { ...target, sortOrder: sourceOrder };

    copy[realSourceIdx] = updatedTarget;
    copy[realTargetIdx] = updatedSource;

    setItems(copy);

    startTransition(async () => {
      try {
        await reorderCategoriesAction([
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
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories by name, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>New Category</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="inline-flex size-12 rounded-xl bg-muted items-center justify-center text-muted-foreground">
              <FolderTree className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No categories found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Organize your hardware fleet into POS terminals, printers, barcode scanners, etc.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="size-3.5" />
              <span>Add First Category</span>
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
                      aria-label="Select all categories on page"
                      checked={
                        paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id))
                      }
                      onChange={(e) => {
                        const next = new Set(selectedIds);
                        if (e.target.checked) {
                          for (const c of paginated) next.add(c.id);
                        } else {
                          for (const c of paginated) next.delete(c.id);
                        }
                        setSelectedIds(next);
                      }}
                      className="rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-5">Order</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5">Assigned Products</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((cat, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx;
                  return (
                    <tr
                      key={cat.id}
                      className={`hover:bg-muted/30 transition-colors group ${
                        selectedIds.has(cat.id) ? "bg-primary/5 dark:bg-primary/10" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select ${cat.name}`}
                          checked={selectedIds.has(cat.id)}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) {
                              next.add(cat.id);
                            } else {
                              next.delete(cat.id);
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
                            {cat.coverUrl ? (
                              <Image
                                src={cat.coverUrl}
                                alt={cat.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <FolderTree className="size-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{cat.name}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {cat.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 max-w-xs truncate text-muted-foreground">
                        {cat.description || "-"}
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-mono font-bold text-foreground">
                          {cat.productCount} models
                        </span>
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          disabled={isPending}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                            cat.isActive
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <TableActionMenu
                          ariaLabel={`Actions for ${cat.name}`}
                          items={[
                            {
                              label: "Edit Category",
                              onClick: () => openEditModal(cat),
                              icon: <Edit className="size-3.5" />,
                            },
                            {
                              label: "View in Catalogue",
                              href: `/catalogue?category=${cat.slug}`,
                              target: "_blank",
                              icon: <ExternalLink className="size-3.5" />,
                            },
                            {
                              label: "Delete Category",
                              onClick: () => setDeletingCategory(cat),
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

      {/* Create / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSave} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? `Edit: ${editingCategory.name}` : "Create Product Category"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Product-type categories used for grouping hardware models in the catalogue.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. POS Terminals"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
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
                  placeholder="pos-terminals"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief description of this hardware group..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              {/* Cover Image Upload */}
              <SingleMediaUpload
                folder="categories"
                kind="image"
                label="Category Cover Image"
                initialItem={formCoverItem}
                onChange={(item) => {
                  setFormCoverItem(item);
                  setFormCoverId(item?.id || null);
                }}
              />

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Active &amp; Visible
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Show category on the public catalogue filter
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
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
                <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batch Action Floating Bar */}
      <BatchActionBar
        selectedCount={selectedIds.size}
        totalCount={filtered.length}
        itemLabel="categories"
        isDeleting={isBulkDeleting}
        onClear={() => setSelectedIds(new Set())}
        onDeleteSelected={() => setShowBulkDeleteConfirm(true)}
      />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title={
          deletingCategory && deletingCategory.productCount > 0
            ? "Action Blocked: Hardware Assigned"
            : "Delete Product Category"
        }
        variant={deletingCategory && deletingCategory.productCount > 0 ? "warning" : "destructive"}
        description={
          deletingCategory && deletingCategory.productCount > 0 ? (
            <span className="text-destructive font-medium block">
              This category has {deletingCategory.productCount} hardware product(s) currently
              assigned to it. You must reassign or remove those products before this category can be
              deleted.
            </span>
          ) : (
            <>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{deletingCategory?.name}</strong>? This action
              cannot be undone.
            </>
          )
        }
        cancelLabel={
          deletingCategory && deletingCategory.productCount > 0 ? "Understood" : "Cancel"
        }
        confirmLabel="Confirm Delete"
        showConfirmButton={!deletingCategory || deletingCategory.productCount === 0}
        isPending={isPending}
        onConfirm={handleDelete}
      />

      {/* Bulk Delete Confirmation */}
      {(() => {
        const blockedCategories = items.filter((c) => selectedIds.has(c.id) && c.productCount > 0);
        const hasBlocked = blockedCategories.length > 0;
        return (
          <ConfirmDialog
            open={showBulkDeleteConfirm}
            onOpenChange={setShowBulkDeleteConfirm}
            title={hasBlocked ? "Action Blocked: Hardware Assigned" : "Delete Selected Categories"}
            variant={hasBlocked ? "warning" : "destructive"}
            itemCount={selectedIds.size}
            description={
              hasBlocked ? (
                <span>
                  Cannot delete selection: <strong>{blockedCategories.length}</strong> of the
                  selected categories ({blockedCategories.map((c) => c.name).join(", ")}) currently
                  have hardware products assigned. Please reassign or delete those products before
                  deleting the categories.
                </span>
              ) : (
                <>
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-foreground">{selectedIds.size}</strong> selected
                  categories? This action cannot be undone.
                </>
              )
            }
            cancelLabel={hasBlocked ? "Understood" : "Cancel"}
            confirmLabel={`Delete ${selectedIds.size} ${selectedIds.size === 1 ? "Category" : "Categories"}`}
            showConfirmButton={!hasBlocked}
            isPending={isBulkDeleting}
            onConfirm={handleBulkDelete}
          />
        );
      })()}
    </div>
  );
}
