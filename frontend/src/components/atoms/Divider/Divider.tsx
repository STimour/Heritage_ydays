import React from "react";
import { cn } from "@/lib/cn";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}

export function Divider({ orientation = "horizontal", label, className }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "inline-block w-px self-stretch bg-neutral-200 dark:bg-neutral-700",
          className
        )}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center gap-3", className)}
      >
        <span className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
        <span className="text-xs text-neutral-400 dark:text-neutral-500">{label}</span>
        <span className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={cn("border-t border-neutral-200 dark:border-neutral-700", className)}
    />
  );
}
