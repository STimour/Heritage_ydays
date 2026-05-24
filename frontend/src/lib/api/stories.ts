import { api } from './client';

export interface StoryFeedItem {
  id: number;
  title: string;
  preview: string;
  tags: string[];
  mainTheme: string | null;
  createdAt: string;
  coverImage: string | null;
  authorName: string;
  saveCount: number;
}

export interface StoryDetail {
  id: number;
  title: string;
  resume: string | null;
  content: string;
  mainTheme: string | null;
  createdAt: string;
  coverImage: string | null;
  authorId: number;
  authorName: string;
  authorPhoto: string | null;
  saveCount: number;
  suggestions: StoryFeedItem[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const storiesApi = {
  getFeed: (page = 0, size = 12, theme?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (theme) params.set('theme', theme);
    return api.get<Page<StoryFeedItem>>(`/stories?${params}`);
  },
  getDetail: (id: number) =>
    api.get<StoryDetail>(`/stories/${id}`),
  getLibrary: (page = 0, size = 4) =>
    api.get<{ content: import('./users').LibraryStory[]; totalElements: number }>(`/stories/library?page=${page}&size=${size}`),
  create: (body: {
    title: string;
    content: string;
    visibility: 'PRIVATE' | 'CUSTOM' | 'PUBLIC';
    mainTheme?: string | null;
    tags?: string[];
    coverImage?: string | null;
    folderId?: number | null;
    circleId?: number | null;
  }) => api.post<StoryDetail>('/stories', body),
  toggleSave: (id: number) =>
    api.post<{ saved: boolean }>(`/stories/${id}/save`, {}),
  update: (id: number, body: {
    title?: string;
    content?: string;
    visibility?: 'PRIVATE' | 'CUSTOM' | 'PUBLIC';
    mainTheme?: string | null;
    tags?: string[];
  }) => api.patch<StoryDetail>(`/stories/${id}`, body),
  getSaved: (page = 0, size = 12) =>
    api.get<Page<StoryFeedItem>>(`/stories/saved?page=${page}&size=${size}`),
};
