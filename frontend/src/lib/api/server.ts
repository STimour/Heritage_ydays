import { BACKEND_API_BASE_URL } from "@/lib/http/config";
import { getServerSession } from "@/lib/auth/server";
import { Collection, Group, LibraryStory, StoryDetail, StoryFeedItem, User } from "@/types/domain";
import { redirect } from "next/navigation";

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

async function serverFetch<T>(path: string): Promise<T> {
  const session = await getServerSession();
  const response = await fetch(`${BACKEND_API_BASE_URL}${path}`, {
    headers: session ? { Authorization: `Bearer ${session.token}` } : undefined,
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/api/auth/logout?redirect=/login");
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function unwrapPage<T>(data: { content: T[] } | T[]): T[] {
  return Array.isArray(data) ? data : data.content;
}

export const serverAppApi = {
  users: {
    me: async () => serverFetch<User>("/api/users/me"),
  },
  stories: {
    list: async () => unwrapPage(await serverFetch<{ content: StoryFeedItem[] } | StoryFeedItem[]>("/api/stories")),
    byId: async (id: number) => serverFetch<StoryDetail>(`/api/stories/${id}`),
    library: async () => unwrapPage(await serverFetch<{ content: LibraryStory[] } | LibraryStory[]>("/api/stories/library")),
  },
  groups: {
    list: async () => {
      const circles = await serverFetch<CircleDTO[]>("/api/circles");
      return circles.map((circle) => ({
        id: circle.id,
        name: circle.name,
        description: circle.description,
        memberCount: circle.memberCount,
        createdAt: circle.createdAt,
        storyCount: circle.storyCount,
      }));
    },
  },
  collections: {
    list: async () => {
      const folders = await serverFetch<FolderDTO[]>("/api/folders?isPrivate=true");
      return folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
        storyCount: folder.storyCount,
        isPrivate: folder.privateFolder,
        createdAt: folder.createdAt,
      }));
    },
  },
};
