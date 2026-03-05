import React from "react";
import { cn } from "@/lib/cn";

export interface HeaderProps {
  logo?: React.ReactNode;
  nav?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ logo, nav, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center border-b border-neutral-200",
        "bg-white/90 px-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/90",
        className
      )}
    >
      <div className="flex w-full items-center gap-4">
        {logo && (
          <div className="shrink-0" aria-label="Logo">
            {logo}
          </div>
        )}
        {nav && (
          <nav
            aria-label="Main navigation"
            className="hidden flex-1 items-center gap-1 md:flex"
          >
            {nav}
          </nav>
        )}
        {actions && (
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
