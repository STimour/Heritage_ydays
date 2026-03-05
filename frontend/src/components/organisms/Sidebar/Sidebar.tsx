import React from "react";
import { cn } from "@/lib/cn";

export interface SidebarProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({
  header,
  children,
  footer,
  collapsed = false,
  className,
}: SidebarProps) {
  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        "flex h-full flex-col border-r border-neutral-200 bg-white",
        "dark:border-neutral-800 dark:bg-neutral-950",
        "transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {header && (
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-neutral-200 dark:border-neutral-800",
            collapsed ? "justify-center px-2" : "px-4"
          )}
        >
          {header}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {children}
      </nav>

      {footer && (
        <div
          className={cn(
            "shrink-0 border-t border-neutral-200 p-2 dark:border-neutral-800",
            collapsed ? "flex justify-center" : ""
          )}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}
