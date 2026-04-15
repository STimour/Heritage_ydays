# Auth/session (Next minimal layer)

Cette couche Next ne duplique pas le backend métier Java.
Elle gère uniquement la session d'authentification:

- `POST /api/auth/login` → relaye vers backend Java `/api/auth/login`, pose cookie HttpOnly.
- `POST /api/auth/signup` → relaye vers backend Java `/api/auth/register`, pose cookie HttpOnly.
- `POST /api/auth/logout` → supprime le cookie HttpOnly.
- `GET /api/auth/session` → expose un état `authenticated` basé sur la présence de session.

## Stockage session

Le token backend est stocké dans un cookie `heritage_token` avec:

- `HttpOnly`
- `Secure` en production
- `SameSite=Lax`
- `Path=/`
- `Max-Age` explicite

## Source de vérité

La validité réelle du token est vérifiée par le backend Java.
Le middleware Next est un guard UX de présence de session, pas un validateur cryptographique.

## Gestion des 401

- Côté client: si un appel authentifié retourne `401`, la session Next est purgée via `/api/auth/logout`, puis redirection vers `/login`.
- Côté Server Components: un `401` backend redirige vers `/api/auth/logout?redirect=/login` pour purger la session puis revenir au login.

## Révocation

Le logout supprime la session locale (cookie HttpOnly).
La révocation serveur immédiate (blacklist/refresh tokens) n'est pas implémentée dans ce sprint.
Recommandation: conserver un access token de durée courte côté backend.
