import React from "react";
import { cn } from "@/lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", label = "Loading…", className }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center justify-center">
      <span
        className={cn(
          "animate-spin rounded-full border-current border-t-transparent",
          sizeStyles[size],
          className
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
