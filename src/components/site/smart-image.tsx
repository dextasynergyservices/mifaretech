import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface SmartImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  blurDataUrl?: string | null;
  className?: string;
  aspectRatio?: string;
}

/**
 * SmartImage primitive wrapper over next/image:
 * - Guarantees the `sizes` prop is passed to eliminate Next.js layout shift warnings
 * - Automatically utilizes blur placeholder when blurDataUrl is supplied
 * - Controls priority/loading cleanly
 */
export function SmartImage({
  alt,
  src,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  loading,
  blurDataUrl,
  className,
  aspectRatio,
  fill,
  ...props
}: SmartImageProps) {
  const hasBlur = Boolean(blurDataUrl);

  const imgElement = (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : loading || "lazy"}
      placeholder={hasBlur ? "blur" : "empty"}
      blurDataURL={blurDataUrl || undefined}
      fill={fill}
      className={cn("object-contain", className)}
      {...props}
    />
  );

  if (aspectRatio && !fill) {
    return <div className={cn("relative overflow-hidden w-full", aspectRatio)}>{imgElement}</div>;
  }

  return imgElement;
}
