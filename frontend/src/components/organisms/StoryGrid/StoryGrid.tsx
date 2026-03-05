import React from "react";
import { cn } from "@/lib/cn";
import { StoryCard } from "@/components/molecules/StoryCard";
import { Spinner } from "@/components/atoms/Spinner";
import type { Story } from "@/types/story";

export type GridColumns = 1 | 2 | 3 | 4;

export interface StoryGridProps {
  stories: Story[];
  columns?: GridColumns;
  isLoading?: boolean;
  emptyMessage?: string;
  onStoryClick?: (story: Story) => void;
  className?: string;
}

const columnsStyles: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function StoryGrid({
  stories,
  columns = 3,
  isLoading = false,
  emptyMessage = "No stories found.",
  onStoryClick,
  className,
}: StoryGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul
      className={cn("grid gap-4", columnsStyles[columns], className)}
      role="list"
    >
      {stories.map((story) => (
        <li key={story.id}>
          <StoryCard story={story} onClick={onStoryClick} className="h-full" />
        </li>
      ))}
    </ul>
  );
}
