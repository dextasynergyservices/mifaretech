import Image from "next/image";
import { cn } from "@/lib/utils";

interface HoverSwapImageProps {
  primarySrc: string;
  secondarySrc?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  aspectRatio?: string;
  className?: string;
  imageClassName?: string;
}

export function HoverSwapImage({
  primarySrc,
  secondarySrc,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  aspectRatio = "aspect-square",
  className,
  imageClassName,
}: HoverSwapImageProps) {
  const hasSecondary = Boolean(secondarySrc && secondarySrc !== primarySrc);

  return (
    <figure className={cn("group relative overflow-hidden w-full m-0 p-0", aspectRatio, className)}>
      {/* Primary Image */}
      <Image
        src={primarySrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-contain transition-all duration-500",
          hasSecondary && "group-hover:opacity-0 group-hover:scale-95 group-focus-within:opacity-0",
          imageClassName,
        )}
      />

      {/* Secondary Hover Image */}
      {hasSecondary && secondarySrc && (
        <Image
          src={secondarySrc}
          alt={`${alt} (alternate angle)`}
          fill
          sizes={sizes}
          className={cn(
            "object-contain transition-all duration-500 absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 group-focus-within:opacity-100 pointer-events-none",
            imageClassName,
          )}
        />
      )}
    </figure>
  );
}
