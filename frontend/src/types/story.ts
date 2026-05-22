import type { ID } from "./index";

export type StoryStatus = "draft" | "published" | "archived";

export type StoryGenre =
  | "adventure"
  | "fantasy"
  | "romance"
  | "thriller"
  | "mystery"
  | "sci-fi"
  | "horror"
  | "other";

export interface StoryAuthor {
  id: ID;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface Story {
  id: ID;
  title: string;
  excerpt: string;
  coverUrl?: string;
  author: StoryAuthor;
  genre: StoryGenre;
  status: StoryStatus;
  readCount: number;
  likeCount: number;
  commentCount: number;
  estimatedReadTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface StoryChapter {
  id: ID;
  storyId: ID;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  createdAt: string;
}
