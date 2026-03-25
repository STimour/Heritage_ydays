/** Generic ID type */
export type ID = string | number;

/** Generic paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Generic async state */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Icon component props */
export interface IconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

/** Children prop helper */
export interface WithChildren {
  children: React.ReactNode;
}

/** ClassName prop helper */
export interface WithClassName {
  className?: string;
}

// ============================================================
// DOMAIN MODELS (aligned with backend Java entities)
// ============================================================

/**
 * User entity
 * From: backend User.java
 */
export interface User {
  id: number;
  email: string;
  displayName?: string;
  pseudo?: string;
  bio?: string;
  photo?: string;
  createdAt: string;
}

/**
 * Story Visibility Enum
 * Values: PRIVATE, CIRCLE, PUBLIC
 */
export enum StoryVisibility {
  PRIVATE = 'PRIVATE',
  CIRCLE = 'CIRCLE',
  PUBLIC = 'PUBLIC',
}

/**
 * Story entity
 * From: backend Story.java
 * MVP fields: no comments, no ratings in V1
 */
export interface Story {
  id: number;
  title: string;
  content: string;
  resume?: string;
  coverImage?: string;
  visibility: StoryVisibility;
  author: User;
  createdAt: string;
  tempsLectureCalcul?: number;
  commentable?: boolean;
  // MVP addition (not yet in backend)
  saveCount?: number;
  isPublished?: boolean;
  tags?: Tag[];
}

/**
 * Create Story Request DTO
 */
export interface CreateStoryRequest {
  title: string;
  content: string;
  resume?: string;
  coverImage?: string;
  visibility: StoryVisibility;
  commentable?: boolean;
  tags?: number[];
}

/**
 * Update Story Request DTO
 */
export interface UpdateStoryRequest {
  title?: string;
  content?: string;
  resume?: string;
  coverImage?: string;
  visibility?: StoryVisibility;
  commentable?: boolean;
  tags?: number[];
}

/**
 * Tag entity
 * From: backend Tag.java
 */
export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}

/**
 * Circle (Group) entity
 * From: backend Circle.java
 */
export interface Circle {
  id: number;
  name: string;
  owner: User;
  createdAt: string;
  members?: User[];
}

/**
 * Create Circle Request DTO
 */
export interface CreateCircleRequest {
  name: string;
  description?: string;
  memberIds?: number[];
}

/**
 * Folder (SavedCollection) entity
 * From: backend Folder.java
 */
export interface Folder {
  id: number;
  name: string;
  owner: User;
  privateFolder: boolean;
  createdAt: string;
  stories?: Story[];
  storyCount?: number;
}

/**
 * Create Folder Request DTO
 */
export interface CreateFolderRequest {
  name: string;
  privateFolder?: boolean;
}

/**
 * StoryInterest (Saved/Bookmarked story)
 * From: backend StoryInterest entity
 */
export interface SavedStory {
  id: number;
  storyId: number;
  userId: number;
  createdAt: string;
  story?: Story;
}

/**
 * Network/Friendship model
 * Not yet in backend but required for EF
 */
export interface FriendRequest {
  id: number;
  fromUser: User;
  toUser: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Friend {
  id: number;
  userOne: User;
  userTwo: User;
  createdAt: string;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}
