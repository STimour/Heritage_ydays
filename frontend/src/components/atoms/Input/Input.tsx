import React from "react";
import { cn } from "@/lib/cn";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  isError?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2.5 text-base",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = "md",
      isError = false,
      leftAddon,
      rightAddon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex items-center">
        {leftAddon && (
          <span className="absolute left-3 flex items-center text-neutral-400 dark:text-neutral-500">
            {leftAddon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full rounded-md border bg-white text-neutral-900 placeholder-neutral-400",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500",
            isError
              ? "border-red-500 focus:ring-red-500"
              : "border-neutral-300 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700",
            sizeStyles[inputSize],
            leftAddon && "pl-9",
            rightAddon && "pr-9",
            className
          )}
          {...props}
        />
        {rightAddon && (
          <span className="absolute right-3 flex items-center text-neutral-400 dark:text-neutral-500">
            {rightAddon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
