"use client";

import {
  ArrowDown,
  ArrowUp,
  Edit,
  ExternalLink,
  Monitor,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { BatchActionBar } from "@/components/admin/batch-action-bar";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { TableActionMenu } from "@/components/admin/table-action-menu";
import { TablePagination } from "@/components/admin/table-pagination";
import {
  bulkDeleteProductsAction,
  deleteProductAction,
  reorderProductsAction,
  updateProductStatusAction,
} from "@/server/actions/products";

export interface AdminProductListItem {
  id: string;
  name: string;
  slug: string;
  modelNumber: string | null;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  sortOrder: number;
  categoryName: string | null;
  categorySlug: string | null;
  coverUrl: string | null;
  specsCount: number;
  imagesCount: number;
  hasDatasheet: boolean;
  updatedAt: Date | string;
}

export interface AdminCategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductsTableProps {
  initialProducts: AdminProductListItem[];
  categories: AdminCategoryOption[];
}

export function ProductsTable({ initialProducts, categories }: ProductsTableProps) {
  const [items, setItems] = useState<AdminProductListItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingProduct, setDeletingProduct] = useState<AdminProductListItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchQuery, categoryFilter, statusFilter]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.modelNumber?.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === "all" || p.categorySlug === categoryFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleStatusChange = (id: string, newStatus: "draft" | "published" | "archived") => {
    startTransition(async () => {
      try {
        const res = await updateProductStatusAction(id, newStatus);
        if (res.success) {
          setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
          );
          toast.success(`Product status updated to ${newStatus}`);
        } else {
          toast.error(res.error || "Failed to update product status");
        }
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    const prodId = deletingProduct.id;

    startTransition(async () => {
      try {
        const res = await deleteProductAction(prodId);
        if (res.success) {
          setItems((prev) => prev.filter((p) => p.id !== prodId));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(prodId);
            return next;
          });
          toast.success("Product deleted successfully");
          setDeletingProduct(null);
        } else {
          toast.error(res.error || "Failed to delete product");
        }
      } catch {
        toast.error("Failed to delete product");
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      const res = await bulkDeleteProductsAction(idsArray);
      if (res.success) {
        setItems((prev) => prev.filter((p) => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
        setShowBulkDeleteConfirm(false);
        toast.success(`Successfully deleted ${res.count ?? idsArray.length} products`);
      } else {
        toast.error(res.error || "Failed to delete selected products");
      }
    } catch {
      toast.error("Failed to delete selected products");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleMove = (indexInFiltered: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? indexInFiltered - 1 : indexInFiltered + 1;
    if (targetIdx < 0 || targetIdx >= filtered.length) return;

    const sourceItem = filtered[indexInFiltered];
    const targetItem = filtered[targetIdx];
    if (!sourceItem || !targetItem) return;

    const newItems = [...items];
    const sourceRealIdx = newItems.findIndex((p) => p.id === sourceItem.id);
    const targetRealIdx = newItems.findIndex((p) => p.id === targetItem.id);
    if (sourceRealIdx === -1 || targetRealIdx === -1) return;

    // Swap sortOrders
    const sourceOrder = sourceItem.sortOrder;
    const targetOrder = targetItem.sortOrder;

    const updatedSource = { ...sourceItem, sortOrder: targetOrder };
    const updatedTarget = { ...targetItem, sortOrder: sourceOrder };

    newItems[sourceRealIdx] = updatedTarget;
    newItems[targetRealIdx] = updatedSource;

    setItems(newItems);

    startTransition(async () => {
      try {
        await reorderProductsAction([
          { id: updatedSource.id, sortOrder: updatedSource.sortOrder },
          { id: updatedTarget.id, sortOrder: updatedTarget.sortOrder },
        ]);
        toast.success("Order updated");
      } catch {
        toast.error("Failed to persist order");
      }
    });
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
            placeholder="Search by hardware name, model, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          />
        </div>

        {/* Filter Dropdowns & Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <Link
            href="/admin/catalogue/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>New Hardware</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="inline-flex size-12 rounded-xl bg-muted items-center justify-center text-muted-foreground">
              <Monitor className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No hardware models found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No products match the selected criteria. Try resetting filters or adding a new
                hardware unit.
              </p>
            </div>
            <Link
              href="/admin/catalogue/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="size-3.5" />
              <span>Create Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all products on page"
                      checked={
                        paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id))
                      }
                      onChange={(e) => {
                        const next = new Set(selectedIds);
                        if (e.target.checked) {
                          for (const p of paginated) next.add(p.id);
                        } else {
                          for (const p of paginated) next.delete(p.id);
                        }
                        setSelectedIds(next);
                      }}
                      className="rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-5">Reorder</th>
                  <th className="py-3 px-5">Hardware Model</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Assets</th>
                  <th className="py-3 px-5">Featured</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((product, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx;
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-muted/30 transition-colors group ${
                        selectedIds.has(product.id) ? "bg-primary/5 dark:bg-primary/10" : ""
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select ${product.name}`}
                          checked={selectedIds.has(product.id)}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) {
                              next.add(product.id);
                            } else {
                              next.delete(product.id);
                            }
                            setSelectedIds(next);
                          }}
                          className="rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>

                      {/* Reorder Buttons */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={globalIdx === 0 || isPending}
                            onClick={() => handleMove(globalIdx, "up")}
                            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors cursor-pointer"
                            title="Move up"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={globalIdx === filtered.length - 1 || isPending}
                            onClick={() => handleMove(globalIdx, "down")}
                            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Hardware Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 rounded-xl bg-muted overflow-hidden shrink-0 border border-border">
                            {product.coverUrl ? (
                              <Image
                                src={product.coverUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Monitor className="size-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/catalogue/${product.id}`}
                              className="font-bold text-foreground hover:text-brand-600 dark:hover:text-brand-400 block truncate"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                              {product.modelNumber && (
                                <span className="font-mono">{product.modelNumber}</span>
                              )}
                              <span className="text-[10px]">&bull;</span>
                              <span className="font-mono text-[10px]">{product.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border">
                          {product.categoryName || "Uncategorized"}
                        </span>
                      </td>

                      {/* Assets: specs, gallery, datasheet */}
                      <td className="py-3.5 px-5 whitespace-nowrap text-muted-foreground text-[11px]">
                        <div className="space-y-0.5">
                          <span>{product.specsCount} specs</span>
                          <span className="mx-1">&bull;</span>
                          <span>{product.imagesCount} images</span>
                          {product.hasDatasheet && (
                            <span className="block text-[10px] font-bold text-brand-600 dark:text-brand-400">
                              PDF Datasheet attached
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Featured (Clean, spark-free) */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {product.isFeatured ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            Featured
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">-</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <select
                          value={product.status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleStatusChange(
                              product.id,
                              e.target.value as "draft" | "published" | "archived",
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                            product.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : product.status === "draft"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Action Menu (Ellipsis "...") */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <TableActionMenu
                          ariaLabel={`Actions for ${product.name}`}
                          items={[
                            {
                              label: "Live Preview",
                              href: `/catalogue/${product.slug}`,
                              target: "_blank",
                              icon: <ExternalLink className="size-3.5" />,
                            },
                            {
                              label: "Edit Hardware",
                              href: `/admin/catalogue/${product.id}`,
                              icon: <Edit className="size-3.5" />,
                            },
                            {
                              label: "Delete Hardware",
                              onClick: () => setDeletingProduct(product),
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

      {/* Batch Action Floating Bar */}
      <BatchActionBar
        selectedCount={selectedIds.size}
        totalCount={filtered.length}
        itemLabel="products"
        isDeleting={isBulkDeleting}
        onClear={() => setSelectedIds(new Set())}
        onDeleteSelected={() => setShowBulkDeleteConfirm(true)}
      />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Delete Hardware Model"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{deletingProduct?.name}</strong>? This action will
            permanently remove the product, specification rows, gallery associations, and
            datasheets.
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
        title="Delete Selected Products"
        itemCount={selectedIds.size}
        description={
          <>
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">{selectedIds.size}</strong> selected products? This
            action will remove their specifications, datasheets, and gallery images and cannot be
            undone.
          </>
        }
        confirmLabel={`Delete ${selectedIds.size} ${selectedIds.size === 1 ? "Product" : "Products"}`}
        isPending={isBulkDeleting}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
