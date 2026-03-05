import type { ID } from "./index";

export type UserRole = "reader" | "author" | "admin";

export interface User {
  id: ID;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  followersCount: number;
  followingCount: number;
  storiesCount: number;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
  username: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}
