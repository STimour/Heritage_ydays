import { Collection, Group, PendingRequest, StoryFeedItem, User } from "@/types/domain";

export const mockUsers: User[] = [
  { id: 1, email: "jules@heritage.fr", displayName: "Jules Parto", pseudo: "jules", photo: "" },
  { id: 2, email: "arthur@heritage.fr", displayName: "Arthur Rey" },
  { id: 3, email: "beatrice@heritage.fr", displayName: "Béatrice N." },
  { id: 4, email: "diana@heritage.fr", displayName: "Diana M." },
];

export const mockStories: StoryFeedItem[] = [
  {
    id: 101,
    title: "Le jardin de mes étés d'enfant",
    preview: "Souvenirs de vacances, confitures et longues soirées en famille.",
    tags: ["Famille", "Enfance"],
    mainTheme: "DRAMA",
    createdAt: "2026-03-25",
    authorName: "Arthur Rey",
    saveCount: 143,
  },
  {
    id: 102,
    title: "Le vieux chêne de mon grand-père",
    preview: "Un récit intergénérationnel sur la mémoire familiale.",
    tags: ["Souvenir", "Enfance"],
    mainTheme: "MYSTERY",
    createdAt: "2026-03-24",
    authorName: "Jules Parto",
    saveCount: 98,
  },
  {
    id: 103,
    title: "Brouillon : histoire de tante Jeanne",
    preview: "Brouillon privé.",
    tags: ["Famille"],
    mainTheme: "OTHER",
    createdAt: "2026-03-21",
    authorName: "Jules Parto",
    saveCount: 0,
  },
];

export const mockCollections: Collection[] = [
  { id: 1, name: "À lire plus tard", storyCount: 12, isPrivate: true, createdAt: "2026-03-20" },
  { id: 2, name: "J'ai aimé", storyCount: 45, isPrivate: true, createdAt: "2026-03-19" },
  { id: 3, name: "Déjà lu", storyCount: 12, isPrivate: true, createdAt: "2026-03-18" },
  { id: 4, name: "Famille", storyCount: 12, isPrivate: true, createdAt: "2026-03-17" },
];

export const mockGroups: Group[] = [
  { id: 1, name: "Famille", description: "Notre cercle familial", memberCount: 3, createdAt: "2026-03-20", storyCount: 12 },
  { id: 2, name: "Proches", description: "Amis de confiance", memberCount: 2, createdAt: "2026-03-19", storyCount: 45 },
];

export const mockPendingRequests: PendingRequest[] = [
  { id: 1, senderId: 3, senderName: mockUsers[2].displayName, senderPhoto: mockUsers[2].photo, createdAt: "2026-03-25" },
  { id: 2, senderId: 4, senderName: mockUsers[3].displayName, senderPhoto: mockUsers[3].photo, createdAt: "2026-03-26" },
];

export const tonalites = ["Transmission", "Nostalgie", "Fierté", "Joie", "Apaisement"];
export const tags = ["Famille", "Enfance", "Transmission", "Patrimoine", "Souvenir"];
