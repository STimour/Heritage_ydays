export type Visibility = "PRIVATE" | "CIRCLE" | "PUBLIC";

export interface User {
  id: number;
  email: string;
  displayName: string;
  pseudo?: string;
  bio?: string;
  photo?: string;
}

export interface Story {
  id: number;
  authorId: number;
  title: string;
  content: string;
  resume: string;
  visibility: Visibility;
  coverImage?: string;
  commentable: boolean;
  tempsLectureCalcul?: number;
  createdAt: string;
  tags: string[];
  tonalite: string;
  saveCount: number;
  isPublished: boolean;
}

export interface Group {
  id: number;
  name: string;
  ownerId: number;
  description: string;
  memberIds: number[];
  storyCount: number;
}

export interface Collection {
  id: number;
  name: string;
  ownerId: number;
  storyCount: number;
  isPrivate: boolean;
}

export interface PendingRequest {
  id: number;
  fromUser: User;
}
