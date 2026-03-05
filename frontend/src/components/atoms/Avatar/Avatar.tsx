import React from "react";
import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        "bg-neutral-200 dark:bg-neutral-700 shrink-0",
        sizeStyles[size],
        className
      )}
      role="img"
      aria-label={alt ?? name ?? "User avatar"}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? name ?? ""}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-neutral-600 dark:text-neutral-300 select-none">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
