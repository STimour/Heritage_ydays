# Frontend Héritage (Next.js)

## Lancer le projet

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run start
```

## PWA

- Manifest: `public/manifest.json`
- Icônes: `public/icons/*`
- Service worker généré via `@ducanh2912/next-pwa` en build production.
- Écran offline: `/offline`.
- Bloc d’installation visible sur la landing (`/`) via le composant `InstallAppBanner`.

## Mocks

- Données centralisées: `src/mocks/data.ts`

## Couche API

- Client HTTP: `src/lib/http/client.ts`
- Services métier: `src/lib/api/services.ts`
- Types domaine/API: `src/types/*`

## Brancher progressivement le backend Java

1. Garder les types alignés sur les entités backend (`Story`, `User`, `Visibility`).
2. Remplacer les méthodes mock dans `src/lib/api/services.ts` par des appels `http()` vers les routes réelles dès qu’elles sont disponibles.
3. Conserver les composants/pages inchangés grâce à la couche d’abstraction API.
