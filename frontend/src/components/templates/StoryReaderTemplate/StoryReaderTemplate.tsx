import React from "react";
import { cn } from "@/lib/cn";

export interface StoryReaderTemplateProps {
  header: React.ReactNode;
  coverImage?: React.ReactNode;
  metadata: React.ReactNode;
  content: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * StoryReaderTemplate — full-page story reading layout.
 * No business logic; purely structural.
 */
export function StoryReaderTemplate({
  header,
  coverImage,
  metadata,
  content,
  sidebar,
  footer,
  className,
}: StoryReaderTemplateProps) {
  return (
    <div className={cn("min-h-screen bg-white dark:bg-neutral-950", className)}>
      {header}

      {coverImage && (
        <div className="h-64 w-full overflow-hidden md:h-80 lg:h-96" aria-hidden>
          {coverImage}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">{metadata}</header>

        <div className="flex gap-12">
          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 flex-1 focus:outline-none"
          >
            <article className="prose prose-neutral max-w-none dark:prose-invert">
              {content}
            </article>
          </main>

          {sidebar && (
            <aside
              className="hidden w-72 shrink-0 lg:block"
              aria-label="Story information"
            >
              {sidebar}
            </aside>
          )}
        </div>

        {footer && <footer className="mt-12">{footer}</footer>}
      </div>
    </div>
  );
}
