# Postman / Newman smoke tests

This folder contains a backend smoke collection designed for local runs and GitHub Actions.

## Files

- `HeritageYdays.postman_collection.json`: ordered smoke suite
- `HeritageYdays.postman_environment.example.json`: example environment values

## Covered sections (CI smoke)

- Health (`/actuator/health`)
- Auth (`/api/auth/register`, `/api/auth/login`)
- Users (`/api/users/me`, update profile)
- Stories (list, create, detail, save toggle)
- Friends (read-only: list + incoming requests)
- Circles (list + create)
- Folders (list/create/detail/add story)
- Negative cases (unauth access, invalid payload, missing resource)

## Local run

```bash
newman run postman/HeritageYdays.postman_collection.json \
  -e postman/HeritageYdays.postman_environment.example.json \
  --env-var baseUrl=http://localhost:8080 \
  --env-var testUserEmail=ci-user@example.com \
  --env-var testUserPassword='Password123!' \
  --env-var testUserDisplayName='CI User'
```

## Notes on intentionally excluded/limited scenarios

- Friend relationship mutation endpoints (`send/accept/reject/remove`) are not part of default smoke because they require multi-user orchestration and can be flaky in single-user CI context.
- Destructive endpoints (`DELETE` user/content) are excluded from smoke by design.
- Smoke suite is optimized for fast feedback, not full business regression coverage.
