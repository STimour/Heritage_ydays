import React from "react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/atoms/Badge";
import type { Story } from "@/types/story";

export interface StoryCardProps {
  story: Story;
  onClick?: (story: Story) => void;
  className?: string;
}

export function StoryCard({ story, onClick, className }: StoryCardProps) {
  return (
    <article
      onClick={() => onClick?.(story)}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white",
        "dark:border-neutral-800 dark:bg-neutral-900",
        onClick && "cursor-pointer transition-shadow hover:shadow-md",
        className
      )}
    >
      {story.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.coverUrl}
          alt={`Cover for ${story.title}`}
          className="h-40 w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {story.title}
          </h3>
          <Badge variant="default" size="sm">
            {story.genre}
          </Badge>
        </div>

        <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
          {story.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            by{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {story.author.name}
            </span>
          </span>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{story.readCount} reads</span>
            <span aria-hidden>·</span>
            <span>{story.estimatedReadTimeMinutes} min</span>
          </div>
        </div>
      </div>
    </article>
  );
}
