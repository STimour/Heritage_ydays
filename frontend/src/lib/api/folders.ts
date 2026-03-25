/**
 * Folders (SavedCollections) API endpoints
 * Backend endpoints to implement:
 * - GET /api/folders (list user's folders)
 * - POST /api/folders (create)
 * - GET /api/folders/{id} (detail + stories)
 * - PUT /api/folders/{id} (update)
 * - DELETE /api/folders/{id}
 * - POST /api/folders/{id}/stories (add story to folder)
 * - DELETE /api/folders/{id}/stories/{storyId} (remove story)
 */

import { apiGet, apiPost, apiPut, apiDelete } from './index';
import { Folder, CreateFolderRequest, Story } from '@/types';

/**
 * Get user's folders (saved collections)
 * Route: GET /api/folders?private=true
 */
export async function getFolders(options?: { private?: boolean }): Promise<Folder[]> {
  const params = new URLSearchParams();
  if (options?.private !== undefined) params.set('private', String(options.private));
  return apiGet<Folder[]>(`/folders?${params}`);
}

/**
 * Get folder detail with stories
 * Route: GET /api/folders/{id}
 */
export async function getFolderDetail(folderId: number): Promise<Folder> {
  return apiGet<Folder>(`/folders/${folderId}`);
}

/**
 * Get stories in folder
 * Route: GET /api/folders/{id}/stories
 */
export async function getFolderStories(folderId: number): Promise<Story[]> {
  return apiGet<Story[]>(`/folders/${folderId}/stories`);
}

/**
 * Create new folder
 * Route: POST /api/folders
 */
export async function createFolder(data: CreateFolderRequest): Promise<Folder> {
  return apiPost<Folder>('/folders', data);
}

/**
 * Update folder
 * Route: PUT /api/folders/{id}
 */
export async function updateFolder(folderId: number, data: Partial<Folder>): Promise<Folder> {
  return apiPut<Folder>(`/folders/${folderId}`, data);
}

/**
 * Delete folder
 * Route: DELETE /api/folders/{id}
 */
export async function deleteFolder(folderId: number): Promise<void> {
  return apiDelete<void>(`/folders/${folderId}`);
}

/**
 * Add story to folder
 * Route: POST /api/folders/{id}/stories
 */
export async function addStoryToFolder(folderId: number, storyId: number): Promise<void> {
  return apiPost<void>(`/folders/${folderId}/stories`, { storyId });
}

/**
 * Remove story from folder
 * Route: DELETE /api/folders/{id}/stories/{storyId}
 */
export async function removeStoryFromFolder(folderId: number, storyId: number): Promise<void> {
  return apiDelete<void>(`/folders/${folderId}/stories/${storyId}`);
}
