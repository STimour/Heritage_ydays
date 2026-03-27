import { Collection, Group, PendingRequest, Story, User } from "@/types/domain";

export const mockUsers: User[] = [
  { id: 1, email: "jules@heritage.fr", displayName: "Jules Parto", pseudo: "jules", photo: "" },
  { id: 2, email: "arthur@heritage.fr", displayName: "Arthur Rey" },
  { id: 3, email: "beatrice@heritage.fr", displayName: "Béatrice N." },
  { id: 4, email: "diana@heritage.fr", displayName: "Diana M." },
];

export const mockStories: Story[] = [
  {
    id: 101,
    authorId: 2,
    title: "Le jardin de mes étés d'enfant",
    content: "Une histoire sur les étés passés chez mes grands-parents...",
    resume: "Souvenirs de vacances, confitures et longues soirées en famille.",
    visibility: "PUBLIC",
    commentable: false,
    createdAt: "2026-03-25",
    tags: ["Famille", "Enfance"],
    tonalite: "Transmission",
    saveCount: 143,
    isPublished: true,
  },
  {
    id: 102,
    authorId: 1,
    title: "Le vieux chêne de mon grand-père",
    content: "Au fond du jardin, un vieux chêne marquait les saisons...",
    resume: "Un récit intergénérationnel sur la mémoire familiale.",
    visibility: "CIRCLE",
    commentable: false,
    createdAt: "2026-03-24",
    tags: ["Souvenir", "Enfance"],
    tonalite: "Nostalgie",
    saveCount: 98,
    isPublished: true,
  },
  {
    id: 103,
    authorId: 1,
    title: "Brouillon : histoire de tante Jeanne",
    content: "Brouillon en cours...",
    resume: "Brouillon privé.",
    visibility: "PRIVATE",
    commentable: false,
    createdAt: "2026-03-21",
    tags: ["Famille"],
    tonalite: "Transmission",
    saveCount: 0,
    isPublished: false,
  },
];

export const mockCollections: Collection[] = [
  { id: 1, name: "À lire plus tard", ownerId: 1, storyCount: 12, isPrivate: true },
  { id: 2, name: "J'ai aimé", ownerId: 1, storyCount: 45, isPrivate: true },
  { id: 3, name: "Déjà lu", ownerId: 1, storyCount: 12, isPrivate: true },
  { id: 4, name: "Famille", ownerId: 1, storyCount: 12, isPrivate: true },
];

export const mockGroups: Group[] = [
  { id: 1, name: "Famille", ownerId: 1, description: "Notre cercle familial", memberIds: [1, 2, 3], storyCount: 12 },
  { id: 2, name: "Proches", ownerId: 1, description: "Amis de confiance", memberIds: [1, 4], storyCount: 45 },
];

export const mockPendingRequests: PendingRequest[] = [
  { id: 1, fromUser: mockUsers[2] },
  { id: 2, fromUser: mockUsers[3] },
];

export const tonalites = ["Transmission", "Nostalgie", "Fierté", "Joie", "Apaisement"];
export const tags = ["Famille", "Enfance", "Transmission", "Patrimoine", "Souvenir"];
