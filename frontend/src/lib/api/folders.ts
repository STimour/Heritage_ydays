import { api } from './client';
import type { StoryFeedItem } from './stories';

export interface FolderDTO {
  id: number;
  name: string;
  privateFolder: boolean;
  tone: string | null;
  description: string | null;
  storyCount: number;
  createdAt: string;
}

export interface FolderDetailDTO {
  id: number;
  name: string;
  privateFolder: boolean;
  tone: string | null;
  description: string | null;
  stories: StoryFeedItem[];
}

export interface CreateFolderBody {
  name: string;
  privateFolder: boolean;
  tone?: string;
  description?: string;
}

export const foldersApi = {
  getAll:      ()                                  => api.get<FolderDTO[]>('/folders'),
  getDetail:   (id: number)                        => api.get<FolderDetailDTO>(`/folders/${id}`),
  create:      (body: CreateFolderBody)            => api.post<FolderDTO>('/folders', body),
  remove:      (id: number)                        => api.delete<void>(`/folders/${id}`),
  addStory:    (folderId: number, storyId: number) => api.post<void>(`/folders/${folderId}/stories/${storyId}`, {}),
  removeStory: (folderId: number, storyId: number) => api.delete<void>(`/folders/${folderId}/stories/${storyId}`),
};
