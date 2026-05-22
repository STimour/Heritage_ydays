import React from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  primary:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  danger:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  outline:
    "border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
};

export function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
