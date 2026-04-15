import { http } from "@/lib/http/client";
import { ApiError } from "@/lib/http/client";
import { LoginRequest, SignupRequest, SpringPage, StoryPayload } from "@/types/api";
import {
  Collection,
  Contact,
  Group,
  LibraryStory,
  PendingRequest,
  StoryDetail,
  StoryFeedItem,
  Theme,
  User,
  UserSearchResult,
  Visibility,
} from "@/types/domain";

const THEME_VALUES: Theme[] = [
  "ROMANCE",
  "THRILLER",
  "SCI_FI",
  "FANTASY",
  "HORROR",
  "DRAMA",
  "ADVENTURE",
  "COMEDY",
  "MYSTERY",
  "OTHER",
];

export const THEME_LABELS: Record<Theme, string> = {
  ROMANCE: "Romance",
  THRILLER: "Thriller",
  SCI_FI: "Science-fiction",
  FANTASY: "Fantaisie",
  HORROR: "Horreur",
  DRAMA: "Drame",
  ADVENTURE: "Aventure",
  COMEDY: "Comédie",
  MYSTERY: "Mystère",
  OTHER: "Autre",
};

export const STORY_VISIBILITY_OPTIONS: Array<{ value: Visibility; label: string }> = [
  { value: "PRIVATE", label: "Privé" },
  { value: "CUSTOM", label: "Cercle familial" },
  { value: "PUBLIC", label: "Public" },
];

export const STORY_THEME_OPTIONS = THEME_VALUES.map((value) => ({
  value,
  label: THEME_LABELS[value],
}));

function unwrapPage<T>(data: SpringPage<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.content;
}

async function callNextAuth<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Une erreur est survenue";
    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // no-op
    }
    throw new ApiError({ status: response.status, message });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

type CircleDTO = {
  id: number;
  name: string;
  description?: string;
  memberCount: number;
  storyCount: number;
  createdAt: string;
};

type FolderDTO = {
  id: number;
  name: string;
  privateFolder: boolean;
  storyCount: number;
  createdAt: string;
};

export const authApi = {
  login: async (payload: LoginRequest) => {
    await callNextAuth<{ success: boolean }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true };
  },
  signup: async (payload: SignupRequest) => {
    await callNextAuth<{ success: boolean }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
      }),
    });
    return { success: true };
  },
  logout: async () => {
    await callNextAuth<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });
    return { success: true };
  },
  session: async () => {
    return callNextAuth<{ authenticated: boolean }>("/api/auth/session", {
      method: "GET",
    });
  },
};

export const usersApi = {
  me: async () => http<User>("/api/users/me", { auth: true }),
  updateMe: async (payload: Pick<User, "displayName" | "pseudo" | "photo">) =>
    http<User>("/api/users/me", { method: "PUT", auth: true, body: JSON.stringify(payload) }),
  deleteMe: async () => http<void>("/api/users/me", { method: "DELETE", auth: true }),
  byId: async (id: number) => http<User>(`/api/users/${id}`, { auth: true }),
  search: async (query: string) => http<UserSearchResult[]>(`/api/users/search?q=${encodeURIComponent(query)}`, { auth: true }),
};

export const friendsApi = {
  list: async () => http<Contact[]>("/api/friends", { auth: true }),
  pendingRequests: async () => http<PendingRequest[]>("/api/friends/requests", { auth: true }),
  sendRequest: async (userId: number) =>
    http<void>(`/api/friends/requests/${userId}`, {
      method: "POST",
      auth: true,
    }),
  acceptRequest: async (requestId: number) =>
    http<void>(`/api/friends/requests/${requestId}/accept`, {
      method: "POST",
      auth: true,
    }),
  rejectRequest: async (requestId: number) =>
    http<void>(`/api/friends/requests/${requestId}`, {
      method: "DELETE",
      auth: true,
    }),
  remove: async (userId: number) =>
    http<void>(`/api/friends/${userId}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const storiesApi = {
  list: async (params?: { theme?: Theme }) => {
    const query = params?.theme ? `?theme=${params.theme}` : "";
    return http<SpringPage<StoryFeedItem>>(`/api/stories${query}`, { auth: true }).then(unwrapPage);
  },
  byId: async (id: number) => http<StoryDetail>(`/api/stories/${id}`, { auth: true }),
  library: async () => http<SpringPage<LibraryStory>>("/api/stories/library", { auth: true }).then(unwrapPage),
  create: async (payload: StoryPayload) =>
    http<StoryDetail>("/api/stories", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        title: payload.title,
        content: payload.content,
        resume: payload.resume,
        visibility: payload.visibility,
        coverImage: payload.coverImage,
        mainTheme: payload.mainTheme,
        tags: payload.tags,
        folderId: payload.folderId,
        circleId: payload.circleId,
        isPublished: payload.isPublished,
      }),
    }),
  toggleSave: async (storyId: number) =>
    http<{ saved: boolean }>(`/api/stories/${storyId}/save`, {
      method: "POST",
      auth: true,
    }),
};

export const circlesApi = {
  list: async (): Promise<Group[]> => {
    const circles = await http<CircleDTO[]>("/api/circles", { auth: true });

    return circles.map((circle) => ({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      memberCount: circle.memberCount,
      createdAt: circle.createdAt,
      storyCount: circle.storyCount,
    }));
  },
  create: async (group: Pick<Group, "name" | "description"> & { memberIds: number[] }) => {
    const circle = await http<CircleDTO>("/api/circles", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        name: group.name,
        description: group.description,
        memberIds: group.memberIds,
      }),
    });

    return {
      id: circle.id,
      name: circle.name,
      description: circle.description,
      memberCount: circle.memberCount,
      createdAt: circle.createdAt,
      storyCount: circle.storyCount,
    } satisfies Group;
  },
  addMember: async (groupId: number, userId: number) =>
    http<void>(`/api/circles/${groupId}/members/${userId}`, {
      method: "POST",
      auth: true,
    }),
  removeMember: async (groupId: number, userId: number) =>
    http<void>(`/api/circles/${groupId}/members/${userId}`, {
      method: "DELETE",
      auth: true,
    }),
  delete: async (groupId: number) =>
    http<void>(`/api/circles/${groupId}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const foldersApi = {
  list: async (isPrivate = true): Promise<Collection[]> => {
    const folders = await http<FolderDTO[]>(`/api/folders?isPrivate=${String(isPrivate)}`, { auth: true });
    return folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      storyCount: folder.storyCount,
      isPrivate: folder.privateFolder,
      createdAt: folder.createdAt,
    }));
  },
  create: async (name: string, isPrivate = true): Promise<Collection> => {
    const folder = await http<FolderDTO>("/api/folders", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ name, privateFolder: isPrivate }),
    });

    return {
      id: folder.id,
      name: folder.name,
      storyCount: folder.storyCount,
      isPrivate: folder.privateFolder,
      createdAt: folder.createdAt,
    };
  },
  byId: async (folderId: number) => {
    const folder = await http<FolderDTO>(`/api/folders/${folderId}`, { auth: true });
    return {
      id: folder.id,
      name: folder.name,
      storyCount: folder.storyCount,
      isPrivate: folder.privateFolder,
      createdAt: folder.createdAt,
    } satisfies Collection;
  },
  delete: async (folderId: number) =>
    http<void>(`/api/folders/${folderId}`, {
      method: "DELETE",
      auth: true,
    }),
  addStory: async (folderId: number, storyId: number) =>
    http<void>(`/api/folders/${folderId}/stories/${storyId}`, {
      method: "POST",
      auth: true,
    }),
  removeStory: async (folderId: number, storyId: number) =>
    http<void>(`/api/folders/${folderId}/stories/${storyId}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const userApi = {
  ...usersApi,
  contacts: friendsApi.list,
  pendingRequests: friendsApi.pendingRequests,
  sendFriendRequest: friendsApi.sendRequest,
  acceptRequest: friendsApi.acceptRequest,
  rejectRequest: friendsApi.rejectRequest,
  removeFriend: friendsApi.remove,
};

export const groupsApi = circlesApi;

export const collectionsApi = foldersApi;

export type AppApi = {
  users: {
    me: () => Promise<User>;
    contacts: () => Promise<Contact[]>;
    pendingRequests: () => Promise<PendingRequest[]>;
  };
  stories: {
    list: () => Promise<StoryFeedItem[]>;
    byId: (id: number) => Promise<StoryDetail>;
    create: (payload: StoryPayload) => Promise<StoryDetail>;
    library: () => Promise<LibraryStory[]>;
  };
  groups: {
    list: () => Promise<Group[]>;
  };
  collections: {
    list: () => Promise<Collection[]>;
  };
};

export const appApi: AppApi = {
  users: {
    me: usersApi.me,
    contacts: friendsApi.list,
    pendingRequests: friendsApi.pendingRequests,
  },
  stories: {
    list: () => storiesApi.list(),
    byId: storiesApi.byId,
    create: storiesApi.create,
    library: storiesApi.library,
  },
  groups: { list: circlesApi.list },
  collections: { list: () => foldersApi.list(true) },
};
