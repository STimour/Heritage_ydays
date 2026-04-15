# Playwright e2e (auth/cross-domain)

## Setup

```bash
cd frontend
npm install
npm run playwright:install
cp .env.e2e.example .env.e2e
```

## Run

```bash
npm run e2e:auth
```

or full e2e folder:

```bash
npm run e2e
```

## Covered scenarios

- unauthenticated access to protected routes redirects to `/login`
- login succeeds and protected route is reachable
- session persists after page reload
- logout clears session and blocks protected routes
- authenticated save action does not return `401` and can be observed cross-domain
- invalid session cookie eventually redirects to `/login`
- signup flow (optional if signup env vars are configured)
