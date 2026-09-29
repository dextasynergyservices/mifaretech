import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const ALLOWED_UPLOADS = {
  "image/jpeg": { kind: "image", ext: "jpg", maxBytes: 5 * 1024 * 1024 },
  "image/png": { kind: "image", ext: "png", maxBytes: 5 * 1024 * 1024 },
  "image/webp": { kind: "image", ext: "webp", maxBytes: 5 * 1024 * 1024 },
  "image/avif": { kind: "image", ext: "avif", maxBytes: 5 * 1024 * 1024 },
  "application/pdf": { kind: "document", ext: "pdf", maxBytes: 8 * 1024 * 1024 },
} as const;

export type AllowedMimeType = keyof typeof ALLOWED_UPLOADS;

export function createUploadSignature(folder: string) {
  const timestamp = Math.round(Date.now() / 1000);
  const targetFolder = `${env.CLOUDINARY_UPLOAD_FOLDER}/${folder}`;
  const paramsToSign = { timestamp, folder: targetFolder };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET);
  return {
    timestamp,
    folder: targetFolder,
    signature,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
  };
}

export async function getUploadedResource(
  publicId: string,
  resourceType: "image" | "raw" = "image",
) {
  try {
    const r = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
      image_metadata: false,
    });
    return {
      secureUrl: r.secure_url as string,
      bytes: r.bytes as number,
      format: (r.format as string) || (resourceType === "raw" ? "pdf" : "jpg"),
      width: (r.width as number) ?? null,
      height: (r.height as number) ?? null,
    };
  } catch (err) {
    console.error("Cloudinary resource fetch failed:", err);
    return null;
  }
}

export const deleteAsset = (publicId: string, resourceType: "image" | "raw" = "image") =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

export function transformedUrl(publicId: string, opts: { width?: number; quality?: "auto" } = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: "auto",
    quality: opts.quality ?? "auto",
    width: opts.width,
    crop: opts.width ? "limit" : undefined,
    flags: "strip_profile", // Strips sensitive EXIF, geolocation, and camera metadata
  });
}
