import { Theme, Visibility } from "./domain";

export interface ApiErrorShape {
  message: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface StoryPayload {
  title: string;
  content: string;
  resume?: string;
  visibility: Visibility;
  coverImage?: string;
  mainTheme: Theme | null;
  tags: string[];
  isPublished: boolean;
  folderId?: number;
  circleId?: number;
}

export interface AuthResponse {
  token: string;
}
