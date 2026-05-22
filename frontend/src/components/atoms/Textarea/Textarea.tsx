import React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const resizeStyles = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ isError = false, resize = "vertical", className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900",
          "placeholder-neutral-400 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500",
          isError
            ? "border-red-500 focus:ring-red-500"
            : "border-neutral-300 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700",
          resizeStyles[resize],
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
