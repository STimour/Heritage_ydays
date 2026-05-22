import React from "react";
import { cn } from "@/lib/cn";

export interface FeedTemplateProps {
  header: React.ReactNode;
  sidebar?: React.ReactNode;
  feed: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

/**
 * FeedTemplate — classic two/three-column feed layout.
 * No business logic; purely structural.
 */
export function FeedTemplate({
  header,
  sidebar,
  feed,
  aside,
  className,
}: FeedTemplateProps) {
  return (
    <div className={cn("min-h-screen bg-neutral-50 dark:bg-neutral-950", className)}>
      {header}

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {sidebar && (
          <aside className="hidden w-64 shrink-0 lg:block" aria-label="Feed sidebar">
            {sidebar}
          </aside>
        )}

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 focus:outline-none"
        >
          {feed}
        </main>

        {aside && (
          <aside className="hidden w-80 shrink-0 xl:block" aria-label="Secondary sidebar">
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}
