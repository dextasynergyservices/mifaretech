import type React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "full";
  className?: string;
}

export function Container({ children, size = "default", className, ...props }: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-4xl",
    default: "max-w-7xl",
    lg: "max-w-[90rem]",
    full: "max-w-full",
  }[size];

  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClasses, className)} {...props}>
      {children}
    </div>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: "default" | "sm" | "lg" | "none";
  className?: string;
  as?: "section" | "div" | "article";
}

export function Section({
  children,
  spacing = "default",
  className,
  as: Component = "section",
  ...props
}: SectionProps) {
  const spacingClasses = {
    none: "",
    sm: "py-8 sm:py-12",
    default: "py-12 sm:py-16 lg:py-24",
    lg: "py-16 sm:py-24 lg:py-32",
  }[spacing];

  return (
    <Component className={cn("w-full relative", spacingClasses, className)} {...props}>
      {children}
    </Component>
  );
}

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  serif?: boolean;
}

export function Heading({ level = 1, children, className, serif = false, ...props }: HeadingProps) {
  const Component = `h${level}` as const;

  const fluidStyles = {
    1: "text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight",
    2: "text-[clamp(1.65rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-tight",
    3: "text-[clamp(1.3rem,2.2vw,1.85rem)] font-bold leading-[1.25] tracking-tight",
    4: "text-[clamp(1.1rem,1.6vw,1.4rem)] font-semibold leading-[1.3]",
    5: "text-base sm:text-lg font-semibold leading-snug",
    6: "text-xs sm:text-sm font-semibold uppercase tracking-wider",
  }[level];

  return (
    <Component
      className={cn(
        "text-foreground",
        serif ? "font-serif" : "font-heading",
        fluidStyles,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
