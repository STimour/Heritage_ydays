import { Story, User, Visibility } from "./domain";

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

export interface StoryPayload {
  title: string;
  content: string;
  resume: string;
  visibility: Visibility;
  coverImage?: string;
  tonalite: string;
  tags: string[];
  isPublished: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type StoryResponse = Story;
