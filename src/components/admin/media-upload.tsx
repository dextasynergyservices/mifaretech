"use client";

import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { confirmUploadAction, getUploadSignatureAction } from "@/server/actions/media";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_PDF_BYTES = 8 * 1024 * 1024; // 8MB

export interface MediaUploadItem {
  id: string;
  url: string;
  filename: string;
  altText?: string;
}

interface MediaUploadProps {
  value?: string | null;
  initialItem?: MediaUploadItem | null;
  kind?: "image" | "document";
  folder?: string;
  label?: string;
  description?: string;
  onChange?: (item: MediaUploadItem | null) => void;
  className?: string;
}

export function SingleMediaUpload({
  value: _value,
  initialItem,
  kind = "image",
  folder = "products",
  label = "Upload File",
  description,
  onChange,
  className = "",
}: MediaUploadProps) {
  const [current, setCurrent] = useState<MediaUploadItem | null>(initialItem || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFilename, setUploadFilename] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;

      // 1. Validation for Images
      if (kind === "image") {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload a valid image file (PNG, JPG, WebP, AVIF).");
          return;
        }
        if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
          toast.error(
            "SVG uploads are rejected due to security policies. Please use PNG, JPG, or WebP.",
          );
          return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          toast.error(
            `File exceeds upload limit (Max 5MB for images). Current file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
          );
          return;
        }
      }

      // 2. Validation for PDFs
      if (kind === "document") {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          toast.error("Please upload a PDF document.");
          return;
        }
        if (file.size > MAX_PDF_BYTES) {
          toast.error(
            `File exceeds upload limit (Max 8MB for PDFs). Current file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
          );
          return;
        }
      }

      setIsUploading(true);
      setUploadProgress(0);
      setUploadFilename(file.name);

      try {
        const sig = await getUploadSignatureAction({ folder });
        const resourceType = kind === "document" ? "raw" : "image";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sig.apiKey);
        formData.append("timestamp", String(sig.timestamp));
        formData.append("signature", sig.signature);
        formData.append("folder", sig.folder);

        const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

        // Upload with real-time XMLHttpRequest progress
        const uploadResult = await new Promise<{ public_id: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", endpoint);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch {
                reject(new Error("Invalid server response from storage service"));
              }
            } else {
              try {
                const err = JSON.parse(xhr.responseText);
                reject(new Error(err.error?.message || `Upload failed with status ${xhr.status}`));
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          };

          xhr.onerror = () => reject(new Error("Network connection error during upload"));
          xhr.send(formData);
        });

        const confirmed = await confirmUploadAction({
          publicId: uploadResult.public_id,
          filename: file.name,
          mimeType: file.type || (kind === "document" ? "application/pdf" : "image/jpeg"),
          sizeBytes: file.size,
          kind,
          altText: file.name.replace(/\.[^/.]+$/, ""),
        });

        if (!confirmed) {
          throw new Error("Failed to register upload in database");
        }

        const newItem: MediaUploadItem = {
          id: confirmed.id,
          url: confirmed.secureUrl,
          filename: confirmed.filename,
          altText: confirmed.altText || "",
        };

        setCurrent(newItem);
        onChange?.(newItem);
        toast.success(`${file.name} uploaded successfully!`);
      } catch (err: unknown) {
        console.error("Upload error:", err);
        const message = err instanceof Error ? err.message : "Failed to upload file";
        toast.error(message);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadFilename("");
      }
    },
    [folder, kind, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile],
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-xs font-bold text-foreground block">{label}</label>}

      {current ? (
        <div className="relative group rounded-2xl border border-border bg-card p-3 flex items-center justify-between gap-4 overflow-hidden">
          <div className="flex items-center gap-3 min-w-0">
            {kind === "image" ? (
              <div className="relative size-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                <Image
                  src={current.url}
                  alt={current.altText || "Uploaded preview"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <FileText className="size-6" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{current.filename}</p>
              <a
                href={current.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline truncate block"
              >
                View uploaded asset &rarr;
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg bg-secondary hover:bg-destructive hover:text-white text-muted-foreground transition-colors shrink-0"
            title="Remove media"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!isUploading) {
              fileInputRef.current?.click();
            }
          }}
          className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-6 text-center flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? "border-brand-500 bg-brand-500/5"
              : "border-border hover:border-brand-500/50 hover:bg-muted/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={
              kind === "image" ? "image/jpeg,image/png,image/webp,image/avif" : "application/pdf"
            }
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-2.5 py-2">
              <div className="flex items-center justify-between w-full text-xs font-medium text-foreground">
                <span className="truncate max-w-[180px] font-medium">{uploadFilename}</span>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/40">
                <div
                  className="bg-brand-500 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="size-3 animate-spin text-brand-500" />
                {uploadProgress >= 100
                  ? "Verifying and processing asset..."
                  : "Uploading to cloud storage..."}
              </p>
            </div>
          ) : (
            <>
              <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <UploadCloud className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {description ||
                    (kind === "image"
                      ? "PNG, JPG, WebP or AVIF (max 5MB)"
                      : "PDF document (max 8MB)")}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  items: MediaUploadItem[];
  folder?: string;
  label?: string;
  description?: string;
  maxItems?: number;
  onChange: (items: MediaUploadItem[]) => void;
}

export function MultiImageUpload({
  items,
  folder = "products/gallery",
  label = "Gallery Images",
  description,
  maxItems,
  onChange,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    let files = Array.from(fileList);
    if (!files.length) return;

    if (maxItems && items.length >= maxItems) {
      toast.error(`You have reached the limit of ${maxItems} supporting images.`);
      return;
    }

    if (maxItems && items.length + files.length > maxItems) {
      const remainingSlots = maxItems - items.length;
      toast.info(
        `Uploading first ${remainingSlots} image${remainingSlots > 1 ? "s" : ""} to stay within the ${maxItems} image limit.`,
      );
      files = files.slice(0, remainingSlots);
    }

    // Validate all files first
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not a supported image file.`);
        return;
      }
      if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
        toast.error(
          `"${file.name}" is an SVG file. SVG uploads are rejected due to security policies.`,
        );
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(
          `File "${file.name}" exceeds upload limit (Max 5MB for images). Current size is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
        );
        return;
      }
    }

    setIsUploading(true);
    setTotalUploadCount(files.length);
    const newItems: MediaUploadItem[] = [...items];

    try {
      const sig = await getUploadSignatureAction({ folder });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        setCurrentUploadIndex(i + 1);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sig.apiKey);
        formData.append("timestamp", String(sig.timestamp));
        formData.append("signature", sig.signature);
        formData.append("folder", sig.folder);

        const uploadResult = await new Promise<{ public_id: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch {
                reject(new Error("Invalid response from cloud storage"));
              }
            } else {
              try {
                const err = JSON.parse(xhr.responseText);
                reject(new Error(err.error?.message || `Upload failed with status ${xhr.status}`));
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          };

          xhr.onerror = () => reject(new Error("Network connection error during gallery upload"));
          xhr.send(formData);
        });

        const confirmed = await confirmUploadAction({
          publicId: uploadResult.public_id,
          filename: file.name,
          mimeType: file.type || "image/jpeg",
          sizeBytes: file.size,
          kind: "image",
          altText: file.name.replace(/\.[^/.]+$/, ""),
        });

        if (confirmed) {
          newItems.push({
            id: confirmed.id,
            url: confirmed.secureUrl,
            filename: confirmed.filename,
            altText: confirmed.altText || "",
          });
        }
      }

      onChange(newItems);
      toast.success(`${files.length} images added to gallery successfully!`);
    } catch (err) {
      console.error("Multi upload error:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload gallery images";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentUploadIndex(0);
      setTotalUploadCount(0);
    }
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    if (!moved) return;
    copy.splice(to, 0, moved);
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-foreground block">{label}</label>
          {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {items.length}
          {maxItems ? ` / ${maxItems}` : ""} images
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden aspect-square flex flex-col justify-between"
          >
            <Image
              src={item.url}
              alt={item.altText || `Supporting image ${idx + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => moveItem(idx, idx - 1)}
                  className="p-1 rounded-md bg-white/90 text-black hover:bg-white text-[10px] font-bold"
                  title="Move left"
                >
                  &larr;
                </button>
              )}
              {idx < items.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveItem(idx, idx + 1)}
                  className="p-1 rounded-md bg-white/90 text-black hover:bg-white text-[10px] font-bold"
                  title="Move right"
                >
                  &rarr;
                </button>
              )}
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-[10px]"
                title="Remove"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] font-bold tracking-wider uppercase">
              Supporting #{idx + 1}
            </div>
          </div>
        ))}

        {!maxItems || items.length < maxItems ? (
          <div
            onClick={() => {
              if (!isUploading) {
                fileInputRef.current?.click();
              }
            }}
            className={`cursor-pointer aspect-square rounded-2xl border-2 border-dashed border-border hover:border-brand-500/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center p-3 text-center gap-1.5 ${
              isUploading ? "bg-muted/40 cursor-wait" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              disabled={isUploading}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleFiles(e.target.files);
                }
              }}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 w-full px-2">
                <span className="text-[10px] font-medium text-foreground">
                  Image {currentUploadIndex} of {totalUploadCount}
                </span>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-500 h-full transition-all duration-150 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                  {uploadProgress}%
                </span>
              </div>
            ) : (
              <>
                <UploadCloud className="size-5 text-muted-foreground" />
                <span className="text-[11px] font-bold text-foreground">Add Supporting Image</span>
                <span className="text-[9px] text-muted-foreground">
                  {maxItems ? `Max ${maxItems} images (5MB each)` : "PNG, JPG, WebP (max 5MB)"}
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="aspect-square rounded-2xl border border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center p-3 text-center gap-1">
            <span className="text-[11px] font-bold text-foreground">Max Limit Reached</span>
            <span className="text-[9px] text-muted-foreground leading-tight">
              {maxItems} supporting images uploaded. Delete one above to replace.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
