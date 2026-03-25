/**
 * Stories API endpoints
 * Backend endpoints to implement:
 * - GET /api/stories (list public/circle)
 * - POST /api/stories (create)
 * - GET /api/stories/{id} (detail)
 * - PUT /api/stories/{id} (update)
 * - DELETE /api/stories/{id} (delete)
 * - POST /api/stories/{id}/save (save/bookmark)
 * - DELETE /api/stories/{id}/save (unsave)
 */

import { apiGet, apiPost, apiPut, apiDelete } from './index';
import { Story, CreateStoryRequest, UpdateStoryRequest, PaginatedResponse } from '@/types';

/**
 * Get public/circle stories (discovery feed)
 * Route: GET /api/stories?visibility=PUBLIC,CIRCLE&page=0&size=20
 */
export async function getStories(
  options?: {
    page?: number;
    size?: number;
    visibility?: string;
    tags?: number[];
  }
): Promise<PaginatedResponse<Story>> {
  const params = new URLSearchParams();
  if (options?.page !== undefined) params.set('page', String(options.page));
  if (options?.size !== undefined) params.set('size', String(options.size));
  if (options?.visibility) params.set('visibility', options.visibility);
  if (options?.tags?.length) params.set('tags', options.tags.join(','));

  return apiGet<PaginatedResponse<Story>>(`/stories?${params}`);
}

/**
 * Get user's stories (library/my stories)
 * Route: GET /api/stories/user/{userId}
 */
export async function getUserStories(
  userId: number,
  options?: { page?: number; size?: number }
): Promise<PaginatedResponse<Story>> {
  const params = new URLSearchParams();
  if (options?.page !== undefined) params.set('page', String(options.page));
  if (options?.size !== undefined) params.set('size', String(options.size));

  return apiGet<PaginatedResponse<Story>>(`/stories/user/${userId}?${params}`);
}

/**
 * Get current user's own stories (with drafts)
 * Route: GET /api/stories/me
 */
export async function getMyStories(
  options?: { page?: number; size?: number }
): Promise<PaginatedResponse<Story>> {
  const params = new URLSearchParams();
  if (options?.page !== undefined) params.set('page', String(options.page));
  if (options?.size !== undefined) params.set('size', String(options.size));

  return apiGet<PaginatedResponse<Story>>(`/stories/me?${params}`);
}

/**
 * Get single story detail
 * Route: GET /api/stories/{id}
 */
export async function getStoryDetail(storyId: number): Promise<Story> {
  return apiGet<Story>(`/stories/${storyId}`);
}

/**
 * Create new story
 * Route: POST /api/stories
 */
export async function createStory(data: CreateStoryRequest): Promise<Story> {
  return apiPost<Story>('/stories', data);
}

/**
 * Update story
 * Route: PUT /api/stories/{id}
 */
export async function updateStory(storyId: number, data: UpdateStoryRequest): Promise<Story> {
  return apiPut<Story>(`/stories/${storyId}`, data);
}

/**
 * Delete story
 * Route: DELETE /api/stories/{id}
 */
export async function deleteStory(storyId: number): Promise<void> {
  return apiDelete<void>(`/stories/${storyId}`);
}

/**
 * Save/bookmark a story
 * Route: POST /api/stories/{id}/save
 */
export async function saveStory(storyId: number, folderId?: number): Promise<void> {
  const body = folderId ? { folderId } : {};
  return apiPost<void>(`/stories/${storyId}/save`, body);
}

/**
 * Unsave/unbookmark a story
 * Route: DELETE /api/stories/{id}/save
 */
export async function unsaveStory(storyId: number): Promise<void> {
  return apiDelete<void>(`/stories/${storyId}/save`);
}

/**
 * Get suggestions (stories with similar tags)
 * Route: GET /api/stories/{id}/suggestions
 */
export async function getStorySuggestions(storyId: number): Promise<Story[]> {
  return apiGet<Story[]>(`/stories/${storyId}/suggestions`);
}

/**
 * Search stories
 * Route: GET /api/stories/search?q=...
 * Note: For MVP, search can be done client-side
 */
export async function searchStories(query: string): Promise<Story[]> {
  const params = new URLSearchParams({ q: query });
  return apiGet<Story[]>(`/stories/search?${params}`);
}

/**
 * Share story to circle/group
 * Route: POST /api/stories/{id}/share
 */
export async function shareStoryToCircle(storyId: number, circleId: number): Promise<void> {
  return apiPost<void>(`/stories/${storyId}/share`, { circleId });
}
