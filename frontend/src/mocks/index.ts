/**
 * Mock data for development
 * All mock functions use mocked data instead of real API calls
 */

import { User, Story, StoryVisibility, Circle, Folder, Tag, FriendRequest } from '@/types';

// ============================================================
// MOCK USERS
// ============================================================

export const mockCurrentUser: User = {
  id: 1,
  email: 'marie.dupont@example.com',
  displayName: 'Marie Dupont',
  pseudo: 'marie_dupont',
  bio: 'Passionnée par les histoires de famille et l\'héritage culturel.',
  photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
  createdAt: '2023-06-15T10:30:00Z',
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 2,
    email: 'jean.martin@example.com',
    displayName: 'Jean Martin',
    pseudo: 'jean_martin',
    bio: 'Amateur de généalogie et conteur passionné.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
    createdAt: '2023-04-20T14:45:00Z',
  },
  {
    id: 3,
    email: 'sophie.leblanc@example.com',
    displayName: 'Sophie Leblanc',
    pseudo: 'sophie_leblanc',
    bio: 'Collectrice d\'histoires familiales.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    createdAt: '2023-08-01T09:15:00Z',
  },
  {
    id: 4,
    email: 'luc.moreau@example.com',
    displayName: 'Luc Moreau',
    pseudo: 'luc_moreau',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luc',
    createdAt: '2023-05-10T11:00:00Z',
  },
  {
    id: 5,
    email: 'claire.rousseau@example.com',
    displayName: 'Claire Rousseau',
    pseudo: 'claire_r',
    bio: 'Documentaliste et archiviste.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claire',
    createdAt: '2023-07-22T16:30:00Z',
  },
];

// ============================================================
// MOCK TAGS
// ============================================================

export const mockTags: Tag[] = [
  { id: 1, name: 'Famille', createdAt: '2023-01-01T00:00:00Z' },
  { id: 2, name: 'Tradition', createdAt: '2023-01-01T00:00:00Z' },
  { id: 3, name: 'Aventure', createdAt: '2023-01-01T00:00:00Z' },
  { id: 4, name: 'Souvenirs', createdAt: '2023-01-01T00:00:00Z' },
  { id: 5, name: 'Généalogie', createdAt: '2023-01-01T00:00:00Z' },
  { id: 6, name: 'Héritage', createdAt: '2023-01-01T00:00:00Z' },
  { id: 7, name: 'Voyage', createdAt: '2023-01-01T00:00:00Z' },
  { id: 8, name: 'Nostalgie', createdAt: '2023-01-01T00:00:00Z' },
];

// ============================================================
// MOCK STORIES
// ============================================================

export const mockStories: Story[] = [
  {
    id: 1,
    title: 'Le voyage en train de mon grand-père',
    content: `En 1952, mon grand-père Henri a entrepris un voyage épique en train à travers la France. 
    Parti de Marseille avec pour tout bagage une petite valise en cuir, il s'est arrêté dans chaque petite gare 
    pour rencontrer les habitants et écouter leurs histoires.
    
    Ce voyage a changé sa vie. Il a rencontré ma grand-mère dans un petit café à Lyon, 
    et c'est de cette rencontre que toute notre histoire familiale est née.
    
    Il gardait précieusement les tickets de train, les photos noir et blanc, et ses carnets de voyage remplis 
    de notes manuscrites et de croquis. Ces documents, je les découvre aujourd'hui avec émerveillement, 
    comme des trésors cachés depuis des décennies.`,
    resume: 'L\'histoire d\'un voyage en train en 1952 qui a changé le cours d\'une vie.',
    coverImage: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400&h=250&fit=crop',
    visibility: StoryVisibility.PUBLIC,
    author: mockUsers[1],
    createdAt: '2023-06-10T10:00:00Z',
    tempsLectureCalcul: 5,
    commentable: true,
    saveCount: 42,
    isPublished: true,
    tags: [mockTags[0], mockTags[1], mockTags[7]],
  },
  {
    id: 2,
    title: 'Les recettes secrètes de ma mère',
    content: `Depuis que ma mère a quitté ce monde, ses recettes sont devenues des rituels sacrés. 
    Chaque dimanche, je prépare l\'une de ses spécialités et je me retrouve dans ma cuisine entourée de ses souvenirs.
    
    La tarte aux pommes avec sa pâte feuilletée ultra-fine, les biscuits "madeleine" faits avec du beurre de Normandie, 
    et bien sûr, son fameux clafoutis aux cerises...
    
    Elle me disait toujours : "Les recettes, ce n\'est pas juste des ingrédients. C\'est de l\'amour, 
    de la patience et des souvenirs qui se transmettent." Je comprends maintenant exactement ce qu\'elle voulait dire.`,
    resume: 'Découvrez les recettes familiales qui font partie de notre héritage.',
    coverImage: 'https://images.unsplash.com/photo-1495507592647-7a0ac8ce9da6?w=400&h=250&fit=crop',
    visibility: StoryVisibility.CIRCLE,
    author: mockUsers[2],
    createdAt: '2023-08-15T14:30:00Z',
    tempsLectureCalcul: 4,
    commentable: true,
    saveCount: 28,
    isPublished: true,
    tags: [mockTags[0], mockTags[3], mockTags[4]],
  },
  {
    id: 3,
    title: 'Une photo retrouvée après 30 ans',
    content: `En vidant la maison familiale, j\'ai découvert une boîte en carton remplie de photos jaunies. 
    Parmi elles, une photo noir et blanc de ma grand-mère en 1960, souriante sur les marches d\'une mairie.
    
    Cette photo, je ne l\'avais jamais vue. Personne n\'en parlait. C\'était comme si cette époque n\'avait jamais existé. 
    Mais la photo était là, preuve irréfutable d\'une histoire oubliée.
    
    J\'ai commencé à poser des questions. Ma tante s\'est souvenue. Puis un oncle lointain... Progressivement, 
    les pièces du puzzle se sont assemblées. Cette photo n\'était pas qu\'une simple image, c\'était une clé qui ouvrait 
    des portes sur un passé que je ne connaissais pas.`,
    resume: 'Une découverte qui a révélé un chapitre caché de l\'histoire familiale.',
    coverImage: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=400&h=250&fit=crop',
    visibility: StoryVisibility.PUBLIC,
    author: mockUsers[0],
    createdAt: '2023-07-01T11:20:00Z',
    tempsLectureCalcul: 3,
    commentable: true,
    saveCount: 89,
    isPublished: true,
    tags: [mockTags[3], mockTags[5], mockTags[7]],
  },
  {
    id: 4,
    title: 'La maison de mon enfance',
    content: `Cette maison blanche sur le port de Bretagne, je l\'ai revisitée en imagination mille fois. 
    C\'est là que j\'ai grandi, que j\'ai appris à rêver, que j\'ai rencontré mes premiers amis.
    
    Ses murs qui craquaient, son escalier grinçant, cette fenêtre de la chambre d\'où j\'observais les bateaux... 
    Tout cela fait maintenant partie de moi, gravé dans ma mémoire comme un héritage immatériel.
    
    Aujourd\'hui, cette maison a un nouvel propriétaire. Mais pour moi, elle restera toujours "la maison" – 
    celle des vacances sans fin, des courses sur la plage, et des histoires familiales qui ont façonné qui je suis.`,
    resume: 'Les souvenirs attachés aux murs d\'une maison qui n\'est plus nôtre.',
    coverImage: 'https://images.unsplash.com/photo-1570129477492-45f003313e2b?w=400&h=250&fit=crop',
    visibility: StoryVisibility.PUBLIC,
    author: mockUsers[3],
    createdAt: '2023-09-05T09:45:00Z',
    tempsLectureCalcul: 6,
    commentable: true,
    saveCount: 55,
    isPublished: true,
    tags: [mockTags[0], mockTags[3], mockTags[6]],
  },
  {
    id: 5,
    title: 'Lettre à mon arrière-grand-mère',
    content: `Chère Mémère,

    Bien que tu sois partie bien avant ma naissance, ton image persiste dans les photos jaunies et 
    dans les histoires que tes enfants racontent.
    
    J\'ai remarqué que tes gènes se sont perpétués en moi – la même couleur de cheveux, la même passion 
    pour la poésie, et cette tendance à rêvasser en regardant par la fenêtre.
    
    Je voulais te dire que je sois fière de provenir de toi. Que ta vie, tes choix difficiles, tes joies simples... 
    tout cela a contribué à faire que j\'existe maintenant.
    
    Grâce à ton héritage invisible, je suis qui je suis.`,
    resume: 'Une lettre fictive pour honorer une ancêtre que l\'on n\'a jamais connue.',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=250&fit=crop',
    visibility: StoryVisibility.PRIVATE,
    author: mockUsers[4],
    createdAt: '2023-08-20T15:00:00Z',
    tempsLectureCalcul: 3,
    commentable: false,
    saveCount: 12,
    isPublished: true,
    tags: [mockTags[0], mockTags[5]],
  },
  // More stories...
  {
    id: 6,
    title: 'Brouillon : Mon histoire de famille',
    content: `Ceci est un brouillon que je suis en train d\'écrire...
    
    Je veux raconter comment ma famille s\'est formée, à travers les générations et les continents...`,
    resume: 'Brouillon en cours de rédaction.',
    visibility: StoryVisibility.PRIVATE,
    author: mockUsers[0],
    createdAt: '2023-09-20T13:00:00Z',
    tempsLectureCalcul: 1,
    commentable: true,
    saveCount: 0,
    isPublished: false,
    tags: [],
  },
];

// ============================================================
// MOCK CIRCLES (GROUPS)
// ============================================================

export const mockCircles: Circle[] = [
  {
    id: 1,
    name: 'Famille Dupont',
    owner: mockUsers[0],
    createdAt: '2023-06-20T10:00:00Z',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    id: 2,
    name: 'Club des histoires',
    owner: mockUsers[2],
    createdAt: '2023-07-15T14:30:00Z',
    members: [mockUsers[2], mockUsers[3], mockUsers[4]],
  },
  {
    id: 3,
    name: 'Généalogistes amateurs',
    owner: mockUsers[1],
    createdAt: '2023-05-10T11:00:00Z',
    members: [mockUsers[1], mockUsers[0], mockUsers[3]],
  },
];

// ============================================================
// MOCK FOLDERS (SAVED COLLECTIONS)
// ============================================================

export const mockFolders: Folder[] = [
  {
    id: 1,
    name: 'À lire plus tard',
    owner: mockUsers[0],
    privateFolder: true,
    createdAt: '2023-06-25T10:00:00Z',
    storyCount: 3,
    stories: [mockStories[0], mockStories[2], mockStories[3]],
  },
  {
    id: 2,
    name: 'Récits émouvants',
    owner: mockUsers[0],
    privateFolder: true,
    createdAt: '2023-07-10T14:15:00Z',
    storyCount: 2,
    stories: [mockStories[1], mockStories[4]],
  },
  {
    id: 3,
    name: 'Mes favoris',
    owner: mockUsers[0],
    privateFolder: true,
    createdAt: '2023-08-01T09:30:00Z',
    storyCount: 5,
    stories: mockStories.slice(0, 5),
  },
];

// ============================================================
// MOCK FRIEND REQUESTS
// ============================================================

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 1,
    fromUser: mockUsers[1],
    toUser: mockUsers[0],
    status: 'pending',
    createdAt: '2023-09-15T10:00:00Z',
  },
  {
    id: 2,
    fromUser: mockUsers[4],
    toUser: mockUsers[0],
    status: 'pending',
    createdAt: '2023-09-18T14:30:00Z',
  },
];

// ============================================================
// SEARCH & FILTER UTILITIES
// ============================================================

export function searchStoriesByTitle(query: string): Story[] {
  const lowerQuery = query.toLowerCase();
  return mockStories.filter(
    (story) =>
      story.title.toLowerCase().includes(lowerQuery) ||
      story.resume?.toLowerCase().includes(lowerQuery)
  );
}

export function filterStoriesByVisibility(visibility: StoryVisibility): Story[] {
  return mockStories.filter((story) => story.visibility === visibility);
}

export function filterStoriesByTag(tagId: number): Story[] {
  return mockStories.filter((story) => story.tags?.some((t) => t.id === tagId));
}

export function searchUsersByName(query: string): User[] {
  const lowerQuery = query.toLowerCase();
  return mockUsers.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(lowerQuery) ||
      user.pseudo?.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
  );
}
