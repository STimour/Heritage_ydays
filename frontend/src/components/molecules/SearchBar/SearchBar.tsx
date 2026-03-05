import React, { useId } from "react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/atoms/Input";
import { IconButton } from "@/components/atoms/IconButton";

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchBar({
  value = "",
  placeholder = "Search…",
  onChange,
  onSearch,
  onClear,
  isLoading = false,
  className,
}: SearchBarProps) {
  const inputId = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch?.(value);
    if (e.key === "Escape") onClear?.();
  };

  return (
    <div role="search" className={cn("flex items-center gap-2", className)}>
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <Input
        id={inputId}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        rightAddon={
          value ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={onClear}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          ) : undefined
        }
      />
      <IconButton
        aria-label="Submit search"
        variant="primary"
        isLoading={isLoading}
        onClick={() => onSearch?.(value)}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </IconButton>
    </div>
  );
}
