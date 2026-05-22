import React from "react";
import { cn } from "@/lib/cn";

export interface DashboardTemplateProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * DashboardTemplate — header + sidebar + main content area.
 * No business logic; purely structural.
 */
export function DashboardTemplate({
  header,
  sidebar,
  children,
  className,
}: DashboardTemplateProps) {
  return (
    <div className={cn("flex h-screen flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950", className)}>
      {header}

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden shrink-0 md:flex">{sidebar}</div>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-6 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
