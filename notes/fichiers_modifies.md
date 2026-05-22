# Fichiers modifiés / créés — Heritage Backend

## Configuration
| Fichier | Action | Description |
|---|---|---|
| `backend/pom.xml` | Modifié | Ajout Spring Security + JJWT 0.12.6 |
| `backend/src/main/resources/application.yaml` | Modifié | Ajout config JWT (secret, expiration) |
| `docker/docker-compose.dev.yml` | Modifié | Ajout JWT_SECRET dans env backend |

## Migrations Flyway
| Fichier | Action | Description |
|---|---|---|
| `db/migration/V2__remove_rating_column.sql` | Créé | Suppression colonne rating dans story_ratings |
| `db/migration/V3__story_fields_and_friends.sql` | Créé | is_published, main_theme, table friend_requests |

## Sécurité (JWT)
| Fichier | Action | Description |
|---|---|---|
| `security/JwtService.java` | Créé | Génération et validation du token JWT |
| `security/JwtAuthFilter.java` | Créé | Filtre HTTP qui lit le Bearer token |
| `security/SecurityConfig.java` | Créé | Config Spring Security (STATELESS, routes publiques) |

## Modèle — Entités
| Fichier | Action | Description |
|---|---|---|
| `model/entity/Story.java` | Modifié | Ajout published, mainTheme, storyTags (@Builder.Default) |
| `model/entity/StoryRating.java` | Modifié | Suppression du champ rating |
| `model/entity/FriendRequest.java` | Créé | Entité demande d'amitié (sender, receiver, status) |
| `model/key/StoryTagId.java` | Modifié | Ajout @Getter (manquait) |

## Modèle — Enums
| Fichier | Action | Description |
|---|---|---|
| `model/enums/Theme.java` | Créé | ROMANCE, THRILLER, SCI_FI, FANTASY, HORROR, DRAMA, ADVENTURE, COMEDY, MYSTERY, OTHER |
| `model/enums/FriendRequestStatus.java` | Créé | PENDING, ACCEPTED |
| `model/enums/Visibility.java` | Existant | PUBLIC, PRIVATE, CIRCLE |

## Repositories
| Fichier | Action | Description |
|---|---|---|
| `repository/UserRepository.java` | Modifié | Ajout search() par displayName/pseudo |
| `repository/StoryRepository.java` | Modifié | Ajout findByIdAndVisibility, findSuggestions, findByFolderId, countByAuthor_Email |
| `repository/StoryTagRepository.java` | Créé | findWithTagByStoryIdIn() — batch fetch tags |
| `repository/StoryInterestRepository.java` | Créé | countByStoryIds(), countById_UserId() |
| `repository/FolderRepository.java` | Créé | findByOwner_EmailAndPrivateFolder, findByIdAndOwner_Email |
| `repository/FolderStoryRepository.java` | Créé | countByFolderIds() — batch count stories par dossier |
| `repository/FolderShareRepository.java` | Créé | (base, pour évolution future) |
| `repository/FriendRequestRepository.java` | Créé | findAllFriends, findBySender/Receiver, findFriendship |
| `repository/CircleRepository.java` | Créé | findByOwner_Email, findByIdAndOwner_Email |
| `repository/CircleMemberRepository.java` | Créé | findWithUserByCircle, countByCircleIds() |
| `repository/TagRepository.java` | Créé | findByName() |

## DTOs
| Fichier | Action | Description |
|---|---|---|
| `dto/RegisterRequest.java` | Créé | fullName, email, password |
| `dto/LoginRequest.java` | Créé | email, password |
| `dto/AuthResponse.java` | Créé | token |
| `dto/StoryFeedItemDTO.java` | Créé | id, title, preview, tags, coverImage, authorName, saveCount |
| `dto/StoryDetailDTO.java` | Créé | + content, mainTheme, authorId, authorPhoto, suggestions |
| `dto/LibraryStoryDTO.java` | Créé | + published (sans authorName) |
| `dto/CreateStoryRequest.java` | Créé | title, content, visibility, mainTheme, tags, folderId |
| `dto/FolderDTO.java` | Créé | id, name, privateFolder, storyCount, createdAt |
| `dto/FolderDetailDTO.java` | Créé | + stories List<StoryFeedItemDTO> |
| `dto/CreateFolderRequest.java` | Créé | name, privateFolder |
| `dto/UserProfileDTO.java` | Créé | id, displayName, pseudo, bio, photo, storyCount, folderCount, savedCount |
| `dto/UpdateProfileRequest.java` | Créé | displayName, pseudo, bio, photo (tous optionnels) |
| `dto/FriendRequestDTO.java` | Créé | id, senderId, senderName, senderPhoto, createdAt |
| `dto/ContactDTO.java` | Créé | id, displayName, pseudo, photo |
| `dto/UserSearchResultDTO.java` | Créé | + alreadyFriend, pendingRequest |
| `dto/CircleDTO.java` | Créé | id, name, memberCount, createdAt |
| `dto/CreateCircleRequest.java` | Créé | name, memberIds |

## Services
| Fichier | Action | Description |
|---|---|---|
| `service/AuthService.java` | Créé | register() + login() avec BCrypt |
| `service/StoryService.java` | Créé/Modifié | getFeed, getDetail, create, getMyLibrary, toggleSave |
| `service/FolderService.java` | Créé | CRUD dossiers + gestion des histoires dans dossiers |
| `service/UserService.java` | Créé | getMyProfile, updateProfile, getPublicProfile |
| `service/FriendService.java` | Créé | sendRequest, accept/reject, getContacts, removeFriend, searchUsers |
| `service/CircleService.java` | Créé | getMyCircles, createCircle, addMember, removeMember, deleteCircle |

## Controllers
| Fichier | Action | Description |
|---|---|---|
| `controller/AuthController.java` | Créé | POST /api/auth/register, POST /api/auth/login |
| `controller/StoryController.java` | Créé/Modifié | GET /api/stories, /library, /{id}, POST /, /{id}/save |
| `controller/FolderController.java` | Créé | CRUD /api/folders + /api/folders/{id}/stories/{storyId} |
| `controller/UserController.java` | Créé | GET/PUT /api/users/me, GET /api/users/{id}, /search |
| `controller/FriendController.java` | Créé | /api/friends/** (contacts, requests, accept, reject) |
| `controller/CircleController.java` | Créé | /api/circles/** (CRUD + membres) |

---

## Résumé des endpoints

| Méthode | URL | Description |
|---|---|---|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/stories | Fil de lecture |
| GET | /api/stories/library | Ma bibliothèque |
| GET | /api/stories/{id} | Détail histoire |
| POST | /api/stories | Créer histoire |
| POST | /api/stories/{id}/save | Toggle sauvegarde |
| GET | /api/folders | Mes dossiers |
| POST | /api/folders | Créer dossier |
| GET | /api/folders/{id} | Détail dossier |
| DELETE | /api/folders/{id} | Supprimer dossier |
| POST | /api/folders/{id}/stories/{storyId} | Ajouter histoire |
| DELETE | /api/folders/{id}/stories/{storyId} | Retirer histoire |
| GET | /api/users/me | Mon profil |
| PUT | /api/users/me | Modifier profil |
| GET | /api/users/{id} | Profil public |
| GET | /api/users/search?q= | Recherche utilisateurs |
| GET | /api/friends | Mes contacts |
| DELETE | /api/friends/{userId} | Supprimer ami |
| POST | /api/friends/requests/{userId} | Envoyer demande |
| GET | /api/friends/requests | Demandes reçues |
| POST | /api/friends/requests/{id}/accept | Accepter |
| DELETE | /api/friends/requests/{id} | Refuser |
| GET | /api/circles | Mes cercles |
| POST | /api/circles | Créer cercle |
| POST | /api/circles/{id}/members/{userId} | Ajouter membre |
| DELETE | /api/circles/{id}/members/{userId} | Retirer membre |
| DELETE | /api/circles/{id} | Supprimer cercle |
