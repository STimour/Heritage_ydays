import React from "react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/atoms/Badge";
import type { StoryCardModel } from "@/types/domain";

export interface StoryCardProps {
  story: StoryCardModel;
  onClick?: (story: StoryCardModel) => void;
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
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {story.title}
          </h3>
          {story.tags[0] && <Badge variant="default" size="sm">{story.tags[0]}</Badge>}
        </div>

        <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
          {story.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{story.createdAt}</span>
            <span aria-hidden>·</span>
            <span>{story.saveCount} saves</span>
          </div>
        </div>
      </div>
    </article>
  );
}
