1. **socle MVP**
2. **tableau hiérarchisé des exigences fonctionnelles**
3. **règles transverses**
4. **impacts à répercuter dans le modèle / diagramme de classes**

---

# 1. Cadre MVP

## Inclus dans le MVP

* inscription classique
* connexion classique
* fil de lecture des histoires
* détail d’une histoire
* sauvegarde d’une histoire
* partage dans un groupe existant
* dossiers partagés
* sauvegardes personnelles
* détail d’une collection
* ma bibliothèque
* profil + modification de profil
* création d’histoire
* groupes + création de groupe
* barre de recherche **côté front uniquement**
* filtres par thème / tag selon les écrans

## Hors MVP

* inscription / connexion avec Google, Apple, etc.
* commentaires
* système de notes
* recherche serveur avancée
* moteur de recommandation complexe
* messagerie temps réel
* permissions fines ultra avancées

---

# 2. Tableau hiérarchisé des exigences fonctionnelles

## EPIC A — Authentification

| ID    | Niveau       | Écran / Module   | Exigence fonctionnelle                                     | Données / champs                                            | Règles / validations                       | Priorité |
| ----- | ------------ | ---------------- | ---------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ | -------- |
| A     | Epic         | Authentification | Permettre à un visiteur de créer un compte et se connecter | -                                                           | Auth classique uniquement                  | MVP      |
| A.1   | Feature      | Page inscription | Afficher un formulaire d’inscription                       | nom complet, email, mot de passe, confirmation mot de passe | Tous les champs obligatoires               | MVP      |
| A.1.1 | Sous-feature | Page inscription | Valider le format de l’email                               | email                                                       | Email valide requis                        | MVP      |
| A.1.2 | Sous-feature | Page inscription | Vérifier la correspondance mot de passe / confirmation     | mot de passe, confirmation mot de passe                     | Les deux champs doivent être identiques    | MVP      |
| A.1.3 | Sous-feature | Page inscription | Empêcher la soumission si le formulaire est invalide       | -                                                           | Bouton désactivé ou erreur visible         | MVP      |
| A.2   | Feature      | Page connexion   | Afficher un formulaire de connexion                        | email, mot de passe                                         | Champs obligatoires                        | MVP      |
| A.2.1 | Sous-feature | Page connexion   | Authentifier l’utilisateur                                 | email, mot de passe                                         | Message d’erreur si identifiants invalides | MVP      |
| A.3   | Feature      | Auth             | Gérer l’état connecté / déconnecté côté front              | token/session utilisateur                                   | Redirection selon état de connexion        | MVP      |
| A.4   | Feature      | Auth             | Exclure la connexion sociale du périmètre                  | Google / Apple / etc.                                       | Non implémenté en MVP                      | MVP      |

---

## EPIC B — Page d’accueil / fil de lecture

| ID    | Niveau       | Écran / Module | Exigence fonctionnelle                            | Données affichées                                                                 | Règles / comportement                                   | Priorité |
| ----- | ------------ | -------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- | -------- |
| B     | Epic         | Accueil        | Afficher un fil de lecture des histoires publiées | liste d’histoires                                                                 | Affichage paginé ou scroll selon choix UI               | MVP      |
| B.1   | Feature      | Accueil        | Afficher les histoires sous forme de cards        | titre, extrait 120 caractères, tag, date, image, auteur, nombre d’enregistrements | L’extrait est tronqué à 120 caractères                  | MVP      |
| B.1.1 | Sous-feature | Card histoire  | Afficher le titre                                 | title                                                                             | Obligatoire                                             | MVP      |
| B.1.2 | Sous-feature | Card histoire  | Afficher un aperçu texte                          | texte tronqué                                                                     | 120 premiers caractères max                             | MVP      |
| B.1.3 | Sous-feature | Card histoire  | Afficher le tag                                   | tag principal ou tag mis en avant                                                 | Visible sur la card                                     | MVP      |
| B.1.4 | Sous-feature | Card histoire  | Afficher la date                                  | date de publication ou création                                                   | Format homogène                                         | MVP      |
| B.1.5 | Sous-feature | Card histoire  | Afficher une image                                | image de couverture                                                               | Placeholder si absente                                  | MVP      |
| B.1.6 | Sous-feature | Card histoire  | Afficher l’auteur                                 | nom/pseudo auteur                                                                 | Cliquable optionnel                                     | MVP      |
| B.1.7 | Sous-feature | Card histoire  | Afficher le nombre d’enregistrements              | saveCount                                                                         | Les notes ne sont plus prises en compte                 | MVP      |
| B.2   | Feature      | Accueil        | Permettre de filtrer les histoires par thème      | thème                                                                             | Filtre côté front sur les données chargées ou selon API | MVP      |
| B.3   | Feature      | Accueil        | Afficher une barre de recherche côté front        | texte recherché                                                                   | Filtre local sur liste affichée                         | MVP      |
| B.4   | Feature      | Accueil        | Ouvrir le détail d’une histoire depuis une card   | id histoire                                                                       | Navigation vers page détail                             | MVP      |

---

## EPIC C — Détail d’une histoire

| ID   | Niveau  | Écran / Module           | Exigence fonctionnelle                                   | Données affichées                           | Règles / comportement                                      | Priorité |
| ---- | ------- | ------------------------ | -------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------- | -------- |
| C    | Epic    | Détail histoire          | Permettre la lecture complète d’une histoire             | détail complet                              | Accessible depuis la home, une collection, la bibliothèque | MVP      |
| C.1  | Feature | Header détail            | Afficher un bouton retour                                | -                                           | Retour vers l’écran précédent ou accueil                   | MVP      |
| C.2  | Feature | Détail histoire          | Afficher le thème principal                              | mainTheme / tonalité                        | Champ distinct des tags                                    | MVP      |
| C.3  | Feature | Détail histoire          | Afficher le titre                                        | title                                       | Obligatoire                                                | MVP      |
| C.4  | Feature | Détail histoire          | Afficher l’auteur                                        | pseudo / nom auteur                         | Visible dans l’en-tête                                     | MVP      |
| C.5  | Feature | Détail histoire          | Afficher la photo de profil de l’auteur                  | profilePhotoUrl                             | Placeholder si absente                                     | MVP      |
| C.6  | Feature | Détail histoire          | Afficher la date                                         | date publication / création                 | Format homogène                                            | MVP      |
| C.7  | Feature | Détail histoire          | Afficher le nombre d’enregistrements                     | saveCount                                   | Mis à jour depuis le back                                  | MVP      |
| C.8  | Feature | Détail histoire          | Afficher le résumé                                       | summary                                     | Avant le contenu complet                                   | MVP      |
| C.9  | Feature | Détail histoire          | Afficher l’histoire complète                             | content                                     | Lecture intégrale                                          | MVP      |
| C.10 | Feature | Actions en haut à droite | Permettre d’enregistrer l’histoire                       | storyId                                     | Action réservée utilisateur connecté                       | MVP      |
| C.11 | Feature | Actions en haut à droite | Permettre de partager l’histoire dans un groupe existant | groupe cible                                | Nécessite groupes existants                                | MVP      |
| C.12 | Feature | Suggestions              | Afficher des suggestions d’histoires similaires          | cards d’histoires partageant les mêmes tags | Même structure visuelle que la home                        | MVP      |

---

## EPIC D — Dossiers partagés

| ID  | Niveau  | Écran / Module    | Exigence fonctionnelle                                      | Données affichées      | Règles / comportement                  | Priorité |
| --- | ------- | ----------------- | ----------------------------------------------------------- | ---------------------- | -------------------------------------- | -------- |
| D   | Epic    | Dossiers partagés | Permettre à l’utilisateur de voir ses collections partagées | liste collections      | Affichage en cards                     | MVP      |
| D.1 | Feature | Liste collections | Afficher les collections sous forme de cards                | nom, nombre d’éléments | Search bar front                       | MVP      |
| D.2 | Feature | Liste collections | Afficher une barre de recherche locale                      | nom collection         | Filtre côté front                      | MVP      |
| D.3 | Feature | Liste collections | Afficher une card / CTA “ajouter une collection”            | -                      | Ouvre page ou modal de création        | MVP      |
| D.4 | Feature | Liste collections | Afficher un bouton créer                                    | nom collection         | Création manuelle                      | MVP      |
| D.5 | Feature | Navigation        | Ouvrir le détail d’une collection                           | collectionId           | Navigation vers page détail collection | MVP      |

---

## EPIC E — Sauvegardes personnelles

| ID  | Niveau  | Écran / Module | Exigence fonctionnelle                                        | Données affichées                            | Règles / comportement                              | Priorité |
| --- | ------- | -------------- | ------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------- | -------- |
| E   | Epic    | Sauvegardes    | Permettre à l’utilisateur de gérer ses histoires enregistrées | collections privées / dossiers de sauvegarde | Accessible uniquement à l’utilisateur propriétaire | MVP      |
| E.1 | Feature | Sauvegardes    | Reprendre la logique visuelle des dossiers partagés           | cards collections                            | UX cohérente                                       | MVP      |
| E.2 | Feature | Sauvegardes    | Afficher les collections personnelles de sauvegarde           | nom, nombre d’histoires                      | Privé uniquement                                   | MVP      |
| E.3 | Feature | Sauvegardes    | Permettre de créer un dossier de sauvegarde                   | nom dossier                                  | Création utilisateur                               | MVP      |
| E.4 | Feature | Sauvegardes    | Permettre d’ajouter une histoire enregistrée dans un dossier  | storyId, folderId                            | Accessible depuis détail histoire ou sauvegardes   | MVP      |
| E.5 | Feature | Sauvegardes    | Afficher une recherche front                                  | nom dossier / histoire                       | Filtre local                                       | MVP      |

---

## EPIC F — Détail d’une collection

| ID  | Niveau  | Écran / Module    | Exigence fonctionnelle                               | Données affichées                                   | Règles / comportement                        | Priorité |
| --- | ------- | ----------------- | ---------------------------------------------------- | --------------------------------------------------- | -------------------------------------------- | -------- |
| F   | Epic    | Détail collection | Afficher le contenu d’une collection                 | liste d’histoires                                   | Chargement via collectionId                  | MVP      |
| F.1 | Feature | Détail collection | Le front envoie l’id de la collection au back        | collectionId                                        | Le back retourne les histoires liées         | MVP      |
| F.2 | Feature | Détail collection | Afficher les histoires sous forme de cards type home | titre, extrait, tag, date, image, auteur, saveCount | Même pattern visuel que l’accueil            | MVP      |
| F.3 | Feature | Détail collection | Exploiter les données enrichies du back              | storyId, authorName, clés étrangères utiles         | Le front ne reconstruit pas la donnée métier | MVP      |

---

## EPIC G — Ma bibliothèque

| ID  | Niveau  | Écran / Module      | Exigence fonctionnelle                                  | Données affichées               | Règles / comportement                   | Priorité  |
| --- | ------- | ------------------- | ------------------------------------------------------- | ------------------------------- | --------------------------------------- | --------- |
| G   | Epic    | Ma bibliothèque     | Permettre à l’utilisateur de voir ses propres histoires | liste histoires utilisateur     | Vue auteur                              | MVP       |
| G.1 | Feature | Bibliothèque auteur | Afficher les histoires écrites par l’utilisateur        | cards type home sans nom auteur | L’auteur n’est pas répété car implicite | MVP       |
| G.2 | Feature | Bibliothèque auteur | Ajouter une card “Écrire une nouvelle histoire”         | CTA création                    | Visible en tête ou dans la grille       | MVP       |
| G.3 | Feature | Modèle histoire     | Ajouter un booléen de publication                       | isPublished                     | Permet de distinguer brouillon / publié | MVP       |
| G.4 | Feature | Bibliothèque auteur | Différencier les histoires publiées et non publiées     | isPublished                     | Filtre optionnel recommandé             | MVP utile |

---

## EPIC H — Profil utilisateur

| ID  | Niveau  | Écran / Module      | Exigence fonctionnelle                            | Données affichées                                                            | Règles / comportement                     | Priorité |
| --- | ------- | ------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------- | -------- |
| H   | Epic    | Profil              | Permettre à l’utilisateur de consulter son profil | infos profil + stats                                                         | Page personnelle                          | MVP      |
| H.1 | Feature | Profil              | Afficher un bouton modifier profil                | -                                                                            | Redirige vers page édition                | MVP      |
| H.2 | Feature | Profil              | Afficher les informations principales             | nom, photo                                                                   | Données utilisateur                       | MVP      |
| H.3 | Feature | Profil              | Afficher les statistiques utilisateur             | nombre de récits écrits, nombre de collections, nombre de récits enregistrés | Compteurs fournis par le back ou calculés | MVP      |
| H.4 | Feature | Profil              | Afficher les paramètres du compte                 | sécurité et confidentialité, suppression du compte                           | Accès dédié                               | MVP      |
| H.5 | Feature | Modification profil | Permettre l’édition du profil                     | pseudo, bio, photo                                                           | Sauvegarde des modifications              | MVP      |

---

## EPIC I — Navigation globale

| ID  | Niveau  | Écran / Module | Exigence fonctionnelle                  | Données affichées                                                         | Règles / comportement                | Priorité |
| --- | ------- | -------------- | --------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------ | -------- |
| I   | Epic    | NavBar         | Fournir une navigation persistante      | liens principaux                                                          | Visible sur les écrans connectés     | MVP      |
| I.1 | Feature | NavBar         | Ajouter un bouton “Écrire une histoire” | -                                                                         | Redirige vers page création histoire | MVP      |
| I.2 | Feature | Navigation     | Accéder aux pages principales           | accueil, dossiers partagés, sauvegardes, ma bibliothèque, groupes, profil | Selon design retenu                  | MVP      |

---

## EPIC J — Création d’histoire

| ID  | Niveau  | Écran / Module      | Exigence fonctionnelle                                     | Données / champs        | Règles / comportement                         | Priorité  |
| --- | ------- | ------------------- | ---------------------------------------------------------- | ----------------------- | --------------------------------------------- | --------- |
| J   | Epic    | Création histoire   | Permettre à l’utilisateur d’écrire et publier une histoire | formulaire complet      | Pas de commentaires en V1                     | MVP       |
| J.1 | Feature | Formulaire histoire | Saisir le titre                                            | title                   | Obligatoire                                   | MVP       |
| J.2 | Feature | Formulaire histoire | Saisir le contenu                                          | content                 | Obligatoire                                   | MVP       |
| J.3 | Feature | Formulaire histoire | Ajouter une image                                          | coverImage              | Optionnelle ou obligatoire selon produit      | MVP       |
| J.4 | Feature | Formulaire histoire | Choisir une visibilité                                     | private, public, custom | Enum obligatoire                              | MVP       |
| J.5 | Feature | Formulaire histoire | Sélectionner des tags prédéfinis                           | tags[]                  | Multi-sélection                               | MVP       |
| J.6 | Feature | Formulaire histoire | Sélectionner un thème principal / tonalité                 | mainTheme               | Champ distinct des tags                       | MVP       |
| J.7 | Feature | Formulaire histoire | Ajouter l’histoire à un dossier                            | folderId                | Optionnel selon contexte                      | MVP       |
| J.8 | Feature | Formulaire histoire | Sélectionner un groupe si partage ciblé                    | groupId                 | Utilisé surtout avec visibilité personnalisée | MVP       |
| J.9 | Feature | Publication         | Enregistrer en brouillon ou publier                        | isPublished             | Brouillon recommandé même en MVP              | MVP utile |

---

## EPIC K — Groupes

| ID  | Niveau  | Écran / Module  | Exigence fonctionnelle                                    | Données affichées                         | Règles / comportement                       | Priorité |
| --- | ------- | --------------- | --------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- | -------- |
| K   | Epic    | Groupes         | Permettre à l’utilisateur de gérer ses groupes de partage | liste groupes                             | Base simple pour le MVP                     | MVP      |
| K.1 | Feature | Liste groupes   | Afficher les groupes sous forme de cards                  | nom du groupe, nombre de membres éventuel | Vue liste                                   | MVP      |
| K.2 | Feature | Liste groupes   | Permettre d’ajouter un groupe                             | CTA ajouter                               | Ouvre page création                         | MVP      |
| K.3 | Feature | Création groupe | Permettre de créer un groupe                              | nom du groupe                             | Champ obligatoire                           | MVP      |
| K.4 | Feature | Partage         | Utiliser un groupe comme cible de partage d’histoire      | groupId                                   | Depuis détail histoire ou création histoire | MVP      |

---

# 3. Exigences transverses front

## Règles UX/UI transverses

| ID   | Domaine           | Exigence                                                           | Détail                                                                           | Priorité |
| ---- | ----------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------- |
| T.1  | Recherche         | Les search bars sont front-side                                    | Filtrage local sur les données déjà chargées                                     | MVP      |
| T.2  | Cohérence UI      | Les cards d’histoires doivent avoir une structure homogène         | Même design entre home, suggestions, détail collection, bibliothèque si possible | MVP      |
| T.3  | États d’interface | Prévoir état vide, chargement, erreur                              | Exemple : aucune histoire, aucune collection, aucun groupe                       | MVP      |
| T.4  | Navigation        | Les retours arrière doivent être simples                           | Bouton retour sur détail histoire et éventuellement autres écrans de détail      | MVP      |
| T.5  | Permissions       | Certaines pages sont réservées aux utilisateurs connectés          | sauvegardes, ma bibliothèque, profil, création, groupes                          | MVP      |
| T.6  | Médias            | Prévoir image par défaut si absente                                | Profil auteur, couverture histoire                                               | MVP      |
| T.7  | Compteurs         | Les compteurs affichés doivent venir du back dès que possible      | saveCount, nombre de récits, nombre de collections, etc.                         | MVP      |
| T.8  | Visibilité        | Les histoires privées ne doivent pas apparaître dans le fil public | Dépend du champ visibility + isPublished                                         | MVP      |
| T.9  | Publication       | Une histoire non publiée ne doit pas sortir dans l’accueil public  | isPublished = false => masquée du feed public                                    | MVP      |
| T.10 | Partage           | Le partage ciblé dépend d’un groupe existant                       | Pas de partage “libre” sans structure                                            | MVP      |

---

# 4. Impacts à répercuter dans le modèle / diagramme de classes

Là, il y a plusieurs changements à intégrer. Je te les mets clairement.

## A. Ce qu’il faut retirer

* **supprimer complètement le système de notes**
* enlever toute logique de `rating`, `note`, `score`, `review`

## B. Ce qu’il faut ajouter sur `Story`

| Champ           | Type suggéré              | Pourquoi                           |
| --------------- | ------------------------- | ---------------------------------- |
| `title`         | string                    | titre de l’histoire                |
| `content`       | text                      | contenu complet                    |
| `summary`       | text                      | résumé affiché sur détail          |
| `coverImageUrl` | string                    | image de couverture                |
| `mainTheme`     | string / enum             | thème principal affiché sur détail |
| `visibility`    | enum                      | `PRIVATE`, `PUBLIC`, `CUSTOM`      |
| `isPublished`   | boolean                   | brouillon ou publié                |
| `publishedAt`   | datetime                  | date d’affichage public            |
| `authorId`      | FK                        | lien vers utilisateur              |
| `saveCount`     | integer dérivé ou calculé | nombre d’enregistrements           |
| `createdAt`     | datetime                  | date création                      |
| `updatedAt`     | datetime                  | date modification                  |

## C. Ce qu’il faut ajouter autour des tags

* `Tag`
* table de liaison `StoryTag`

Car une histoire peut avoir plusieurs tags prédéfinis.

## D. Ce qu’il faut ajouter pour les sauvegardes

### Sauvegarde simple

* `SavedStory`

  * `id`
  * `userId`
  * `storyId`
  * `savedAt`

Ça permet :

* de savoir si un utilisateur a enregistré une histoire
* de calculer `saveCount`

## E. Ce qu’il faut ajouter pour les dossiers / collections

Il faut distinguer deux notions sinon ça va devenir flou :

### Option la plus propre

1. **Collection**

   * dossier contenant des histoires
   * peut être privée ou partagée
2. **CollectionStory**

   * table de liaison entre collection et histoire

Champs utiles :

* `Collection.id`
* `Collection.name`
* `Collection.ownerId`
* `Collection.type` : `PRIVATE`, `SHARED`
* `Collection.createdAt`

## F. Ce qu’il faut ajouter pour les groupes

* `Group`
* `GroupMember`
* éventuellement `StoryShare` si tu veux tracer les partages

### Minimum viable

**Group**

* `id`
* `name`
* `ownerId`
* `createdAt`

**GroupMember**

* `id`
* `groupId`
* `userId`

## G. Ce qu’il faut ajouter pour le profil utilisateur

Sur `User` ou `UserProfile` :

* `fullName`
* `pseudo`
* `email`
* `passwordHash`
* `bio`
* `profilePhotoUrl`

## H. Relations minimales à prévoir

* `User` 1—N `Story`
* `User` 1—N `Collection`
* `User` N—N `Story` via `SavedStory`
* `Story` N—N `Tag` via `StoryTag`
* `Collection` N—N `Story` via `CollectionStory`
* `User` 1—N `Group`
* `Group` N—N `User` via `GroupMember`

---

# 5. Version ultra exploitable pour découpage front

## Ordre de réalisation conseillé

| Ordre | Bloc front                 | Pourquoi                               |
| ----- | -------------------------- | -------------------------------------- |
| 1     | Authentification           | nécessaire pour sécuriser le reste     |
| 2     | Home + card histoire       | composant central réutilisable partout |
| 3     | Détail histoire            | deuxième écran clé                     |
| 4     | Sauvegarde histoire        | première vraie interaction utilisateur |
| 5     | Collections / dossiers     | structuration des contenus             |
| 6     | Ma bibliothèque            | espace auteur                          |
| 7     | Création histoire          | production de contenu                  |
| 8     | Profil                     | finalisation expérience utilisateur    |
| 9     | Groupes                    | partage ciblé MVP                      |
| 10    | Suggestions / raffinements | amélioration UX                        |

---

# 6. Points flous à trancher rapidement

Il y a quand même quelques zones où il faut décider vite pour éviter de casser le front plus tard :

| Sujet                             | Problème                                                           | Décision recommandée                                                            |
| --------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Résumé vs extrait                 | tu parles d’un résumé sur détail, mais home affiche 120 caractères | garder `summary` + `content`; home utilise soit `summary`, soit extrait calculé |
| Collections vs dossiers           | tu mélanges un peu les mots                                        | utiliser un seul terme métier côté produit                                      |
| Groupe + visibilité personnalisée | pas encore totalement défini                                       | `CUSTOM = partagé à un ou plusieurs groupes`                                    |
| Date affichée                     | création ou publication ?                                          | afficher `publishedAt` si publié, sinon `createdAt`                             |
| Auteur                            | nom complet ou pseudo ?                                            | utiliser `pseudo` partout côté public                                           |

---

