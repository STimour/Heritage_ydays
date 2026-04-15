import React from "react";
import { cn } from "@/lib/cn";
import { StoryCard } from "@/components/molecules/StoryCard";
import { Spinner } from "@/components/atoms/Spinner";
import type { StoryCardModel } from "@/types/domain";

export interface StoryListProps {
  stories: StoryCardModel[];
  isLoading?: boolean;
  emptyMessage?: string;
  onStoryClick?: (story: StoryCardModel) => void;
  className?: string;
}

export function StoryList({
  stories,
  isLoading = false,
  emptyMessage = "No stories found.",
  onStoryClick,
  className,
}: StoryListProps) {
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
    <ul className={cn("flex flex-col gap-4", className)} role="list">
      {stories.map((story) => (
        <li key={story.id}>
          <StoryCard story={story} onClick={onStoryClick} />
        </li>
      ))}
    </ul>
  );
}
