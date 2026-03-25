# Frontend Héritage - Guide complet

## 🚀 Démarrage rapide

### Installation des dépendances
```bash
cd frontend
npm install
# ou
yarn install
```

### Lancer en développement
```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible sur `http://localhost:3000`.

### Build pour la production
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

---

## 📱 PWA (Progressive Web App)

L'application Héritage est une **véritable PWA installable**.

### Installation sur le navigateur

#### Desktop (Chrome, Edge, Firefox)
1. Visitez `http://localhost:3000`
2. Cliquez sur l'icône **"Installer"** dans la barre d'adresse
3. Confirmez l'installation
4. L'app s'ouvrira en mode **standalone** (sans barre d'adresse)

#### iPhone/Safari
1. Visitez `http://localhost:3000`
2. Tapez le bouton "**Partage**" en bas
3. Sélectionnez "**Sur l'écran d'accueil**"
4. Confirmez

La banneau d'installation PWA s'affiche automatiquement sur la landing page (`/`).

### Configuration PWA
- **Manifest**: `/public/manifest.json`
- **Service Worker**: Géré par `@ducanh2912/next-pwa`
- **Icônes**: `/public/icons/` (SVG)
- **Theme Color**: Bleu (`#3b82f6`)
- **Start URL**: `/app/discover`

---

## 🏗️ Architecture

### Structure des dossiers
```
frontend/
├── public/
│   ├── icons/                  # Icônes SVG pour PWA
│   ├── manifest.json           # Web App Manifest
│   └── sw.js                   # Service Worker
├── src/
│   ├── app/                    # Pages et layouts (NextJS App Router)
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Authentification
│   │   ├── signup/
│   │   └── app/                # App protégée
│   │       ├── discover/       # Découverte
│   │       ├── library/        # Ma bibliothèque
│   │       ├── saved/          # Sauvegardes
│   │       ├── stories/        # Détail histoire, création
│   │       ├── groups/         # Groupes
│   │       ├── network/        # Mon réseau
│   │       └── profile/        # Profil utilisateur
│   ├── components/
│   │   ├── atoms/              # Composants de base (Button, Input, etc.)
│   │   ├── molecules/          # Composants composés (StoryCard, etc.)
│   │   ├── organisms/          # Sections complètes (Header, Sidebar, etc.)
│   │   └── layouts/            # Layouts (BaseLayout, etc.)
│   ├── hooks/
│   │   ├── useAuth.tsx         # Contexte d'authentification
│   │   └── useInstallPrompt.ts # Hook PWA installation
│   ├── lib/
│   │   ├── api/                # Couche API
│   │   │   ├── index.ts        # HTTP client
│   │   │   ├── auth.ts         # Auth endpoints
│   │   │   ├── stories.ts      # Story endpoints
│   │   │   ├── users.ts        # User endpoints
│   │   │   ├── circles.ts      # Circle/Group endpoints
│   │   │   └── folders.ts      # Folder endpoints
│   │   ├── cn.ts               # Utility pour classNames
│   │   └── api.ts              # Config API
│   ├── mocks/
│   │   └── index.ts            # Mock data (development)
│   ├── types/
│   │   └── index.ts            # Types TypeScript
│   ├── styles/
│   │   └── tokens.ts           # Design tokens
│   ├── providers/
│   │   └── ThemeProvider.tsx   # Theme context
│   └── app.css / globals.css   # Styles globaux
└── package.json
```

---

## 🔌 Couche API

L'intégration backend est **prête et structurée** pour se brancher au serveur Java.

### Configuration
Dans `/src/lib/api/index.ts`, la base URL est configurable:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

### Token d'authentification
Les tokens JWT sont stockés dans `localStorage`:
```typescript
// Login → Token saved
localStorage.setItem('authToken', token);

// Automatic header injection
headers['Authorization'] = `Bearer ${token}`;
```

### Endpoints implémentés

#### Authentification
```typescript
import { loginUser, registerUser } from '@/lib/api/auth';

// POST /api/auth/login
await loginUser({ email, password });

// POST /api/auth/register
await registerUser({ email, password, displayName });
```

#### Stories
```typescript
import { getStories, getStoryDetail, createStory, saveStory } from '@/lib/api/stories';

// GET /api/stories?visibility=PUBLIC,CIRCLE
await getStories({ visibility: 'PUBLIC,CIRCLE', page: 0, size: 20 });

// GET /api/stories/{id}
await getStoryDetail(storyId);

// POST /api/stories
await createStory({ title, content, visibility, tags });

// POST /api/stories/{id}/save
await saveStory(storyId, folderId);
```

#### Users
```typescript
import { getUserProfile, getFriends, searchUsers } from '@/lib/api/users';

// GET /api/users/{id}
await getUserProfile(userId);

// GET /api/friends
await getFriends();

// GET /api/users/search?q=...
await searchUsers(query);
```

#### Circles/Groups
```typescript
import { getCircles, createCircle } from '@/lib/api/circles';

// GET /api/circles
await getCircles();

// POST /api/circles
await createCircle({ name, description, memberIds });
```

#### Folders/Collections
```typescript
import { getFolders, createFolder } from '@/lib/api/folders';

// GET /api/folders
await getFolders();

// POST /api/folders
await createFolder({ name, privateFolder });
```

---

## 🎭 Authentification

### Contexte d'authentification
L'authentification utilise **React Context** avec `useAuth()`:

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Bienvenue, {user?.displayName}</p>
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <p>Non connecté</p>
      )}
    </div>
  );
}
```

### Mock authentication (Développement)
Pour le MVP, l'authentification utilise des **mocks** dans `localStorage`.
- Tout email/mot de passe est accepté en validation locale
- Le utilisateurs est sauvegardé dans `localStorage`

**Pour passer au vrai backend**:
1. Remplacez les fonctions de `useAuth.ts` pour appeler les vrais endpoints d'API
2. Implémentez le refresh token si le backend l'utilise
3. Gérez les erreurs d'authentification (401, 403)

---

## 📊 Données mockées

Pour le développement sans serveur backend, les données mockées se trouvent dans:
```
/src/mocks/index.ts
```

### Données mockées disponibles
- `mockCurrentUser` - Utilisateur actuellement connecté
- `mockUsers` - Liste d'utilisateurs
- `mockStories` - 6 stories pré-créées avec contenu réaliste
- `mockTags` - Tags pré-définis
- `mockCircles` - 3 groupes d'exemple
- `mockFolders` - Collections de sauvegarde
- `mockFriendRequests` - Demandes d'amis en attente

### Utiliser les mocks
```typescript
import { mockStories, mockCurrentUser } from '@/mocks';

// Accès direct
const story = mockStories[0];
const user = mockCurrentUser;

// Fonctions de recherche
import { searchStoriesByTitle, searchUsersByName } from '@/mocks';

const results = searchStoriesByTitle('voyage');
```

---

## 🎨 Composants et styles

### Tailwind CSS 4
L'application utilise **Tailwind CSS 4** avec une palette personnalisée:
- **Primaire**: Bleu (`#3b82f6`)
- **Secondaire**: Violet (`#a855f7`)
- **Background**: Très clair (`#f8fafc`)
- **Cartes**: Gris très clair (`#f1f5f9`)

### Composants réutilisables

#### Atoms (Éléments de base)
```typescript
// Button
<Button variant="primary" size="lg" fullWidth>
  Mon bouton
</Button>

// Input
<Input type="email" label="Email" error="Email invalide" />

// Card
<Card variant="featured" interactive>
  Contenu
</Card>

// Avatar
<Avatar src={photoUrl} size="lg" />

// Badge
<Badge variant="primary">En cours</Badge>

// Typography
<H1>Titre</H1>
<H2>Sous-titre</H2>
<P>Paragraph</P>
```

#### Molecules (Composants composés)
```typescript
// StoryCard - Affiche une histoire dans une grille
<StoryCard story={story} showAuthor={true} />
```

#### Organisms (Sections complètes)
```typescript
// Header public
<Header />

// Sidebar app
<AppShell>{children}</AppShell>

// Banneau installation PWA
<InstallAppBanner />
```

---

## 🛣️ Routing

### Routes publiques
```
/                           Landing page
/login                      Connexion
/signup                     Inscription
```

### Routes protégées (nécessitent authentification)
```
/app/discover               Fil de découverte
/app/stories/[id]           Détail d'une histoire
/app/stories/new            Création/édition d'histoire
/app/library                Ma bibliothèque
/app/saved                  Mes sauvegardes
/app/groups                 Mes groupes
/app/network                Mon réseau
/app/profile                Profil utilisateur
```

---

## 🌐 Responsive Design

L'application est **100% responsive**:

- **Mobile-first** design
- **Sidebar dynamique**: Cachée sur mobile, visible sur desktop
- **Navigation mobile**: Bottom navigation (icons) sur petit écran
- **Grilles adaptatives**: 1 colonne mobile, 2-3 colonnes desktop

---

## 🔒 Type Safety avec TypeScript

Tous les modèles de données sont typés:

```typescript
// Types définis dans /src/types/index.ts
export interface User {
  id: number;
  email: string;
  displayName?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  author: User;
  visibility: StoryVisibility;
  createdAt: string;
}

// Strictement vérifié à la compilation
const user: User = { ... };
```

---

## 📝 Intégration Backend en 5 étapes

Quand le backend Java sera prêt:

### 1. Variables d'environnement
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Vérifier les DTOs Java
Assurez-vous que:
- Les noms de champ correspondent (/src/types)
- Les enums `StoryVisibility` sont identiques
- Les formats de réponse matchent

### 3. Activer l'API réelle
Décommenter le code API réel dans `/src/lib/api/*.ts`:
```typescript
// Remplacer les mocks par les appels API
// export async function getStories() {
//   return apiGet<PaginatedResponse<Story>>('/stories');
// }
```

### 4. Implémenter l'authentification backend
```typescript
// Dans useAuth.ts, appeler les vrais endpoints
const response = await loginUser(email, password);
```

### 5. Tester l'intégration
```bash
npm run dev
# Vérifier les appels réseau dans DevTools (F12 → Network)
```

---

## 🚀 Build et déploiement

### Build local
```bash
npm run build
npm start
```

### Variables d'environnement pour production
```bash
NEXT_PUBLIC_API_URL=https://api.heritage.fr
```

### Déploiement recommandé
- **Vercel** (Gratuit pour les démos)
- **Netlify**
- **Docker** pour serveur perso

---

## 🐛 Dépannage

### La PWA ne s'installe pas
- Vérifier que le site est en HTTPS (ou localhost)
- Vérifier `/public/manifest.json`
- Vérifier que `service worker` est enregistré (DevTools → Applications)

### API 404
- Vérifier `NEXT_PUBLIC_API_URL` dans `.env.local`
- Vérifier que le backend Java écoute sur le bon port
- Vérifier les routes dans le backend

### Types TypeScript errors
- `npm run lint` pour vérifier les erreurs
- Assurez-vous que les imports sont corrects
- Vérifiez `/src/types/index.ts` pour la définition des types

---

## 📚 Documentation supplémentaire

- **Wireframes**: `/frontend/wireframe/`
- **Exigences fonctionnelles**: `/frontend/EF.md`
- **Diagramme de classe**: `/diagrammeClasse.md`
- **Backend Java**: `/backend/`

---

## 📞 Support et contact

Pour des questions ou des améliorations, consultez:
- Les issues GitHub
- La documentation du projet
- Les wireframes dans le dossier `frontend/wireframe`

---

**Bonne chance avec votre héritage numérique ! 🎉**
