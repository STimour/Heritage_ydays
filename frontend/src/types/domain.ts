export type Visibility = "PRIVATE" | "CUSTOM" | "PUBLIC";

export type Theme =
  | "ROMANCE"
  | "THRILLER"
  | "SCI_FI"
  | "FANTASY"
  | "HORROR"
  | "DRAMA"
  | "ADVENTURE"
  | "COMEDY"
  | "MYSTERY"
  | "OTHER";

export interface User {
  id: number;
  displayName: string;
  email?: string;
  pseudo?: string;
  bio?: string;
  photo?: string;
  storyCount?: number;
  folderCount?: number;
  savedCount?: number;
}

export interface StoryFeedItem {
  id: number;
  title: string;
  preview: string;
  tags: string[];
  mainTheme: Theme | null;
  createdAt: string;
  coverImage?: string;
  authorName: string;
  saveCount: number;
}

export interface StoryDetail {
  id: number;
  title: string;
  resume: string;
  content: string;
  mainTheme: Theme | null;
  createdAt: string;
  coverImage?: string;
  authorId: number;
  authorName: string;
  authorPhoto?: string;
  saveCount: number;
  suggestions: StoryFeedItem[];
}

export interface LibraryStory {
  id: number;
  title: string;
  preview: string;
  tags: string[];
  mainTheme: Theme | null;
  createdAt: string;
  coverImage?: string;
  saveCount: number;
  published: boolean;
}

export interface StoryCardModel {
  id: number;
  title: string;
  createdAt: string;
  tags: string[];
  saveCount: number;
  excerpt: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  storyCount: number;
}

export interface Collection {
  id: number;
  name: string;
  storyCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface PendingRequest {
  id: number;
  senderId: number;
  senderName: string;
  senderPhoto?: string;
  createdAt: string;
}

export interface Contact {
  id: number;
  displayName: string;
  pseudo?: string;
  photo?: string;
}

export interface UserSearchResult {
  id: number;
  displayName: string;
  pseudo?: string;
  photo?: string;
  alreadyFriend: boolean;
  pendingRequest: boolean;
}
