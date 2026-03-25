/**
 * Circles/Groups API endpoints
 * Backend endpoints to implement:
 * - GET /api/circles (list user's circles)
 * - POST /api/circles (create)
 * - GET /api/circles/{id} (detail)
 * - PUT /api/circles/{id} (update)
 * - DELETE /api/circles/{id}
 * - POST /api/circles/{id}/members (add member)
 */

import { apiGet, apiPost, apiPut, apiDelete } from './index';
import { Circle, CreateCircleRequest } from '@/types';

/**
 * Get user's circles/groups
 * Route: GET /api/circles
 */
export async function getCircles(): Promise<Circle[]> {
  return apiGet<Circle[]>('/circles');
}

/**
 * Get single circle detail
 * Route: GET /api/circles/{id}
 */
export async function getCircleDetail(circleId: number): Promise<Circle> {
  return apiGet<Circle>(`/circles/${circleId}`);
}

/**
 * Create new circle/group
 * Route: POST /api/circles
 */
export async function createCircle(data: CreateCircleRequest): Promise<Circle> {
  return apiPost<Circle>('/circles', data);
}

/**
 * Update circle
 * Route: PUT /api/circles/{id}
 */
export async function updateCircle(circleId: number, data: Partial<Circle>): Promise<Circle> {
  return apiPut<Circle>(`/circles/${circleId}`, data);
}

/**
 * Delete circle
 * Route: DELETE /api/circles/{id}
 */
export async function deleteCircle(circleId: number): Promise<void> {
  return apiDelete<void>(`/circles/${circleId}`);
}

/**
 * Add member to circle
 * Route: POST /api/circles/{id}/members
 */
export async function addCircleMember(circleId: number, userId: number): Promise<Circle> {
  return apiPost<Circle>(`/circles/${circleId}/members`, { userId });
}

/**
 * Remove member from circle
 * Route: DELETE /api/circles/{id}/members/{userId}
 */
export async function removeCircleMember(circleId: number, userId: number): Promise<void> {
  return apiDelete<void>(`/circles/${circleId}/members/${userId}`);
}
