"use client";

import { ArrowLeft, ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  type MediaUploadItem,
  MultiImageUpload,
  SingleMediaUpload,
} from "@/components/admin/media-upload";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import {
  createProductAction,
  type ProductFormValues,
  updateProductAction,
} from "@/server/actions/products";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface InitialProductData extends Partial<ProductFormValues> {
  id?: string;
  coverMedia?: { id: string; url: string; filename: string } | null;
  galleryImages?: { id: string; url: string; filename: string }[];
  datasheetMedia?: { id: string; url: string; filename: string } | null;
}

interface ProductFormProps {
  initialData?: InitialProductData;
  categories: CategoryOption[];
}

import { slugify } from "@/lib/slugify";

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(initialData?.id);
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isManualSlug, setIsManualSlug] = useState(Boolean(initialData?.slug));
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [modelNumber, setModelNumber] = useState(initialData?.modelNumber || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [descriptionHtml, setDescriptionHtml] = useState(initialData?.descriptionHtml || "");
  const [descriptionJson, setDescriptionJson] = useState<Record<string, unknown> | null>(
    (initialData?.description as Record<string, unknown>) || null,
  );
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights && initialData.highlights.length > 0 ? initialData.highlights : [""],
  );
  const [specs, setSpecs] = useState<
    { groupName?: string | null; label: string; value: string; sortOrder: number }[]
  >(
    initialData?.specs && initialData.specs.length > 0
      ? initialData.specs
      : [{ groupName: "", label: "", value: "", sortOrder: 0 }],
  );
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    initialData?.status || "draft",
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(
    initialData?.coverMediaId || null,
  );
  const [coverItem, setCoverItem] = useState<MediaUploadItem | null>(
    initialData?.coverMedia || null,
  );
  const [galleryItems, setGalleryItems] = useState<MediaUploadItem[]>(
    initialData?.galleryImages || [],
  );
  const [datasheetMediaId, setDatasheetMediaId] = useState<string | null>(
    initialData?.datasheetMediaId || null,
  );
  const [datasheetItem, setDatasheetItem] = useState<MediaUploadItem | null>(
    initialData?.datasheetMedia || null,
  );
  const [datasheetTitle, setDatasheetTitle] = useState(initialData?.datasheetTitle || "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isManualSlug) {
      setSlug(slugify(val));
    }
  };

  const handleAddHighlight = () => {
    setHighlights((prev) => [...prev, ""]);
  };

  const handleUpdateHighlight = (index: number, val: string) => {
    setHighlights((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { groupName: "", label: "", value: "", sortOrder: prev.length }]);
  };

  const handleUpdateSpec = (index: number, field: "groupName" | "label" | "value", val: string) => {
    setSpecs((prev) => {
      const copy = [...prev];
      const target = copy[index];
      if (!target) return prev;
      copy[index] = { ...target, [field]: val };
      return copy;
    });
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    if (!slug.trim()) {
      toast.error("Please provide a valid slug");
      return;
    }

    const payload: ProductFormValues = {
      name: name.trim(),
      slug: slug.trim(),
      categoryId: categoryId || null,
      modelNumber: modelNumber.trim() || null,
      shortDescription: shortDescription.trim() || null,
      description: descriptionJson,
      descriptionHtml,
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      specs: specs
        .filter((s) => s.label.trim() && s.value.trim())
        .map((s, idx) => ({
          groupName: s.groupName?.trim() || null,
          label: s.label.trim(),
          value: s.value.trim(),
          sortOrder: idx,
        })),
      status,
      isFeatured,
      sortOrder: initialData?.sortOrder || 0,
      coverMediaId,
      galleryMediaIds: galleryItems.map((g) => g.id),
      datasheetMediaId,
      datasheetTitle: datasheetTitle.trim() || null,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
    };

    startTransition(async () => {
      try {
        if (isEditing && initialData?.id) {
          const res = await updateProductAction(initialData.id, payload);
          if (res.success) {
            toast.success("Product updated successfully");
            router.push("/admin/catalogue");
            router.refresh();
          } else {
            toast.error(res.error || "Failed to update product");
          }
        } else {
          const res = await createProductAction(payload);
          if (res.success) {
            toast.success("Product published to catalogue");
            router.push("/admin/catalogue");
            router.refresh();
          } else {
            toast.error(res.error || "Failed to create product");
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Submission failed";
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/catalogue"
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {isEditing ? `Edit: ${initialData?.name}` : "Create New Hardware Model"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enterprise POS specification, gallery, highlights, and datasheet attachments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && slug && (
            <Link
              href={`/catalogue/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold transition-colors"
            >
              <ExternalLink className="size-3.5 text-muted-foreground" />
              <span>Live Preview</span>
            </Link>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-all shadow-xs"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span>{isEditing ? "Save Changes" : "Publish Hardware"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Main Product Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Basic Information */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Basic Identification
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Fametech Z-9000 All-in-One Touch POS Terminal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-foreground">URL Slug *</label>
                    <button
                      type="button"
                      onClick={() => setIsManualSlug(!isManualSlug)}
                      className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {isManualSlug ? "Auto-sync from name" : "Edit manually"}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={slug}
                    readOnly={!isManualSlug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="fametech-z-9000-pos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Model Number
                  </label>
                  <input
                    type="text"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    placeholder="e.g. Z-9000-PRO"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Hardware Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                >
                  <option value="">Select a hardware classification...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Short One-Line Summary
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Compact overview shown on catalogue cards and search snippets..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 2. Rich Text Detailed Description */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Commercial &amp; Technical Description (Tiptap)
            </h3>
            <p className="text-xs text-muted-foreground">
              Provide thorough specifications, architecture details, and enterprise application
              benefits.
            </p>
            <TiptapEditor
              value={descriptionHtml}
              onChange={(html, json) => {
                setDescriptionHtml(html);
                setDescriptionJson(json);
              }}
            />
          </div>

          {/* 3. Product Highlights Repeater */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Key Selling Highlights
                </h3>
                <p className="text-xs text-muted-foreground">
                  Bullet points highlighted beside the product image on the detail page.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-xs font-bold text-foreground transition-colors"
              >
                <Plus className="size-3" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground shrink-0 w-5">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                    placeholder="e.g. IP65 water & dust resistant front bezel with sealed edges"
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    disabled={highlights.length === 1 && !item}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0 disabled:opacity-30"
                    title="Remove highlight"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Technical Specifications Table Repeater */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Technical Specifications Table
                </h3>
                <p className="text-xs text-muted-foreground">
                  Structured specs rendered in the specifications drawer/tab on the public site.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-xs font-bold text-foreground transition-colors"
              >
                <Plus className="size-3" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-3">
              {specs.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-muted/30 border border-border/70 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={row.groupName || ""}
                      onChange={(e) => handleUpdateSpec(idx, "groupName", e.target.value)}
                      placeholder="Group (e.g. Display)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                      placeholder="Label (e.g. Resolution)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-bold text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                      placeholder="Value (e.g. 1920 x 1080 FHD)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete row"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Media, Datasheets, SEO & Status */}
        <div className="space-y-6">
          {/* Status & Visibility Card */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Publishing &amp; Fleet Status
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                >
                  <option value="draft">Draft (Hidden from public)</option>
                  <option value="published">Published (Visible in catalogue)</option>
                  <option value="archived">Archived (Delisted)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">Featured Hardware</span>
                  <span className="text-[11px] text-muted-foreground">
                    Promote on home page fleet carousel
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="size-4 accent-brand-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Primary Cover Image */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Primary Cover Image
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Displayed as the catalogue thumbnail and first hero visual.
            </p>
            <SingleMediaUpload
              folder="products/covers"
              kind="image"
              initialItem={coverItem}
              onChange={(item) => {
                setCoverItem(item);
                setCoverMediaId(item?.id || null);
              }}
            />
          </div>

          {/* Supporting Gallery Images */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Supporting Gallery Images (Up to 4)
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Upload up to 4 supporting images (side views, ports/connectors, wall mount,
                accessories). These appear in the interactive thumbnail gallery on the product
                description page.
              </p>
            </div>
            <MultiImageUpload
              folder="products/gallery"
              label="Supporting Gallery Views"
              maxItems={4}
              items={galleryItems}
              onChange={(items) => setGalleryItems(items)}
            />
          </div>

          {/* Downloadable Datasheet PDF */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Product Brochure / Datasheet
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Official PDF document downloadable by verified prospective buyers.
            </p>

            <SingleMediaUpload
              folder="products/datasheets"
              kind="document"
              label=""
              initialItem={datasheetItem}
              onChange={(item) => {
                setDatasheetItem(item);
                setDatasheetMediaId(item?.id || null);
                if (item && !datasheetTitle) {
                  setDatasheetTitle(`${name || "Product"} Datasheet`);
                }
              }}
            />

            {datasheetMediaId && (
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">
                  Datasheet Download Title
                </label>
                <input
                  type="text"
                  value={datasheetTitle}
                  onChange={(e) => setDatasheetTitle(e.target.value)}
                  placeholder="e.g. Fametech Z-9000 Specification Sheet (PDF)"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* SEO Metadata */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Search Engine Optimization
            </h3>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">
                Custom SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Defaults to product name | Mifaretech"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Google search results snippet..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
