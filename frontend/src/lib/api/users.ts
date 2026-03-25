/**
 * Users API endpoints
 * Backend endpoints to implement:
 * - GET /api/users/{id} (profile)
 * - PUT /api/users/me (update own profile)
 * - GET /api/users/search?q=...
 */

import { apiGet, apiPut, apiPost, apiDelete } from './index';
import { User, FriendRequest, Friend } from '@/types';

/**
 * Get user profile
 * Route: GET /api/users/{id}
 */
export async function getUserProfile(userId: number): Promise<User> {
  return apiGet<User>(`/users/${userId}`);
}

/**
 * Get current user profile
 * Route: GET /api/users/me
 */
export async function getCurrentUserProfile(): Promise<User> {
  return apiGet<User>('/users/me');
}

/**
 * Update current user profile
 * Route: PUT /api/users/me
 */
export async function updateUserProfile(data: Partial<User>): Promise<User> {
  return apiPut<User>('/users/me', data);
}

/**
 * Search users
 * Route: GET /api/users/search?q=...
 */
export async function searchUsers(query: string): Promise<User[]> {
  const params = new URLSearchParams({ q: query });
  return apiGet<User[]>(`/users/search?${params}`);
}

// ============================================================
// NETWORK / FRIENDS
// ============================================================

/**
 * Get pending friend requests
 * Route: GET /api/friends/requests/pending
 */
export async function getPendingFriendRequests(): Promise<FriendRequest[]> {
  return apiGet<FriendRequest[]>('/friends/requests/pending');
}

/**
 * Get friends list
 * Route: GET /api/friends
 */
export async function getFriends(): Promise<Friend[]> {
  return apiGet<Friend[]>('/friends');
}

/**
 * Send friend request
 * Route: POST /api/friends/requests
 */
export async function sendFriendRequest(toUserId: number): Promise<FriendRequest> {
  return apiPost<FriendRequest>('/friends/requests', { toUserId });
}

/**
 * Accept friend request
 * Route: POST /api/friends/requests/{id}/accept
 */
export async function acceptFriendRequest(requestId: number): Promise<Friend> {
  return apiPost<Friend>(`/friends/requests/${requestId}/accept`);
}

/**
 * Reject friend request
 * Route: POST /api/friends/requests/{id}/reject
 */
export async function rejectFriendRequest(requestId: number): Promise<void> {
  return apiPost<void>(`/friends/requests/${requestId}/reject`);
}

/**
 * Remove friend
 * Route: DELETE /api/friends/{userId}
 */
export async function removeFriend(userId: number): Promise<void> {
  return apiDelete<void>(`/friends/${userId}`);
}
