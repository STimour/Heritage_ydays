import { api } from './client';

export interface UserProfile {
  id: number;
  displayName: string;
  pseudo: string | null;
  photo: string | null;
  storyCount: number;
  folderCount: number;
  savedCount: number;
}

export interface LibraryStory {
  id: number;
  title: string;
  preview: string;
  tags: string[];
  mainTheme: string | null;
  createdAt: string;
  coverImage: string | null;
  saveCount: number;
  published: boolean;
}

export interface UpdateProfileRequest {
  displayName?: string;
  pseudo?: string;
  bio?: string;
  photo?: string;
}

export interface Contact {
  id: number;
  displayName: string;
  pseudo: string | null;
  photo: string | null;
}

export interface UserSearchResult {
  id: number;
  displayName: string;
  pseudo: string | null;
  photo: string | null;
  alreadyFriend: boolean;
  pendingRequest: boolean;
}

export const usersApi = {
  getMe: () => api.get<UserProfile>('/users/me'),
  updateMe: (body: UpdateProfileRequest) => api.put<UserProfile>('/users/me', body),
  getContacts: () => api.get<Contact[]>('/friends'),
  search: (q: string) => api.get<UserSearchResult[]>(`/users/search?q=${encodeURIComponent(q)}`),
  sendRequest: (userId: number) => api.post<void>(`/friends/requests/${userId}`, {}),
};
