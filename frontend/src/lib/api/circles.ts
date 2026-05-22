import { api } from './client';
import type { StoryFeedItem, Page } from './stories';

export interface Circle {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  createdAt: string;
}

export const circlesApi = {
  getMyCircles: () => api.get<Circle[]>('/circles'),
  create: (body: { name: string; description?: string; memberIds?: number[] }) =>
    api.post<Circle>('/circles', body),
  addMember: (circleId: number, userId: number) =>
    api.post<void>(`/circles/${circleId}/members/${userId}`, {}),
  delete: (circleId: number) => api.delete<void>(`/circles/${circleId}`),
  getCircleStories: (circleId: number, page = 0, size = 12) =>
    api.get<Page<StoryFeedItem>>(`/circles/${circleId}/stories?page=${page}&size=${size}`),
};
