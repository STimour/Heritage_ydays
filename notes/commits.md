# Liste des commits — Heritage Backend

## Auth & Sécurité
```
feat(security): add Spring Security + JWT stateless authentication
feat(auth): add register and login endpoints
```

## Migrations DB
```
feat(db): V2 - remove rating column from story_ratings
feat(db): V3 - add is_published, main_theme to stories and create friend_requests table
```

## Modèle
```
feat(model): add Theme and FriendRequestStatus enums
feat(model): add FriendRequest entity
feat(model): update Story entity with published, mainTheme and storyTags
```

## Repositories
```
feat(repository): add repositories for folders, friends, circles and tags
feat(repository): update StoryRepository, StoryTagRepository and StoryInterestRepository
feat(repository): update UserRepository with search query
```

## DTOs
```
feat(dto): add story DTOs (StoryDetailDTO, LibraryStoryDTO, CreateStoryRequest)
feat(dto): add folder DTOs (FolderDTO, FolderDetailDTO, CreateFolderRequest)
feat(dto): add user and social DTOs (UserProfileDTO, FriendRequestDTO, ContactDTO, UserSearchResultDTO, CircleDTO, CreateCircleRequest)
```

## Features
```
feat(stories): add story feed endpoint with pagination and tag filter
feat(stories): add story detail, creation, library and save toggle
feat(folders): add folder management (shared folders and saves)
feat(users): add user profile endpoints (get and update)
feat(friends): add friend request system, contacts and user search
feat(circles): add circle management
```

## Fix
```
fix(model): add @Getter to StoryTagId and @Builder.Default to Story.storyTags
fix(dto): rename isPrivate to privateFolder in folder DTOs to avoid Jackson issues
```

---

## Version condensée (5-6 commits)
```
feat(security): Spring Security + JWT auth
feat(db): V2 + V3 migrations
feat(model): entities, enums and repositories for all features
feat(dto): all DTOs for stories, folders, users, friends and circles
feat(api): all services and controllers (stories, folders, users, friends, circles)
fix(model): StoryTagId @Getter, Story @Builder.Default, FolderDTO naming
```
