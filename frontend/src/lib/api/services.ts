import { mockCollections, mockGroups, mockPendingRequests, mockStories, mockUsers } from "@/mocks/data";
import { LoginRequest, SignupRequest, StoryPayload } from "@/types/api";
import { Collection, Group, PendingRequest, Story, User } from "@/types/domain";

const withLatency = <T,>(data: T) => new Promise<T>((resolve) => setTimeout(() => resolve(data), 120));

export const authApi = {
  login: async (payload: LoginRequest) =>
    withLatency({ token: "mock-token", user: mockUsers.find((u) => u.email === payload.email) ?? mockUsers[0] }),
  signup: async (payload: SignupRequest) => withLatency({ token: "mock-token", user: { ...mockUsers[0], displayName: payload.fullName, email: payload.email } }),
};

export const storiesApi = {
  list: async () => withLatency(mockStories),
  byId: async (id: number) => withLatency(mockStories.find((s) => s.id === id) ?? mockStories[0]),
  create: async (payload: StoryPayload) =>
    withLatency({
      ...mockStories[0],
      id: Math.floor(Math.random() * 10000),
      ...payload,
      authorId: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      saveCount: 0,
      commentable: false,
    } as Story),
};

export const userApi = {
  me: async () => withLatency(mockUsers[0]),
  contacts: async () => withLatency(mockUsers.slice(1)),
  pendingRequests: async () => withLatency(mockPendingRequests),
};

export const groupsApi = {
  list: async () => withLatency(mockGroups),
  create: async (group: Pick<Group, "name" | "description" | "memberIds">) =>
    withLatency({ id: Date.now(), ownerId: 1, storyCount: 0, ...group }),
};

export const collectionsApi = {
  list: async () => withLatency(mockCollections),
  create: async (name: string) => withLatency({ id: Date.now(), name, ownerId: 1, storyCount: 0, isPrivate: true } as Collection),
};

export type AppApi = {
  users: { me: () => Promise<User>; contacts: () => Promise<User[]>; pendingRequests: () => Promise<PendingRequest[]> };
  stories: { list: () => Promise<Story[]>; byId: (id: number) => Promise<Story>; create: (payload: StoryPayload) => Promise<Story> };
  groups: { list: () => Promise<Group[]> };
  collections: { list: () => Promise<Collection[]> };
};

export const appApi: AppApi = {
  users: userApi,
  stories: storiesApi,
  groups: { list: groupsApi.list },
  collections: { list: collectionsApi.list },
};
