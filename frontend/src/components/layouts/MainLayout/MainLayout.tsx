import React from "react";
import { cn } from "@/lib/cn";

export interface MainLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * MainLayout — root shell with header, optional sidebar, main content, and footer.
 * No business logic; purely structural.
 */
export function MainLayout({
  header,
  sidebar,
  children,
  footer,
  className,
}: MainLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950", className)}>
      {header}

      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <div className="hidden shrink-0 md:flex">
            {sidebar}
          </div>
        )}

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto focus:outline-none"
        >
          {children}
        </main>
      </div>

      {footer && (
        <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          {footer}
        </footer>
      )}
    </div>
  );
}
