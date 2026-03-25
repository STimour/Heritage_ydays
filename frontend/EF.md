Oui. Je te prépare ça comme un vrai support de cadrage front, hiérarchisé, exploitable pour la conception des pages, des composants UI et des appels API.

J’ai aussi intégré tes décisions MVP :

* pas d’inscription Google/Gmail pour le MVP
* pas de commentaires en V1
* la recherche indiquée “côté front” reste locale sur les données déjà chargées
* le modèle **Histoire** doit intégrer `isPublished`
* on remplace la logique de **notes** par le **nombre d’enregistrements**

---

# Tableau des exigences fonctionnelles hiérarchisé — Support création Front MVP

## 1. Vue d’ensemble hiérarchisée

| ID      | Module                   | Sous-module / Page            | Objectif                                                         |
| ------- | ------------------------ | ----------------------------- | ---------------------------------------------------------------- |
| EF-01   | Authentification         | Page inscription              | Permettre à un utilisateur de créer un compte                    |
| EF-01.1 | Authentification         | Page connexion                | Permettre à un utilisateur de se connecter                       |
| EF-02   | Accueil / Découverte     | Page d’accueil                | Afficher le fil de lecture avec filtres et recherche             |
| EF-02.1 | Accueil / Découverte     | Card histoire                 | Standardiser l’affichage d’une histoire dans les listings        |
| EF-03   | Histoires                | Page détail histoire          | Consulter une histoire complète et accéder aux actions associées |
| EF-03.1 | Histoires                | Suggestions d’histoires       | Proposer des récits similaires par tags                          |
| EF-04   | Collections partagées    | Page dossiers partagés        | Gérer les collections partagées de l’utilisateur                 |
| EF-04.1 | Collections partagées    | Détail collection             | Afficher les histoires d’une collection donnée                   |
| EF-05   | Sauvegardes              | Page sauvegardes              | Gérer les contenus enregistrés par l’utilisateur                 |
| EF-06   | Bibliothèque personnelle | Ma bibliothèque               | Afficher les histoires écrites par l’utilisateur                 |
| EF-06.1 | Création / édition       | Page création histoire        | Permettre l’écriture et la publication d’une histoire            |
| EF-07   | Profil                   | Page profil                   | Consulter les informations du profil                             |
| EF-07.1 | Profil                   | Page modification profil      | Modifier les informations du profil                              |
| EF-08   | Réseau                   | Page mon réseau               | Gérer invitations et contacts                                    |
| EF-08.1 | Réseau                   | Résultats de recherche d’amis | Rechercher un utilisateur et l’ajouter                           |
| EF-09   | Groupes                  | Page groupes                  | Afficher et gérer les groupes                                    |
| EF-09.1 | Groupes                  | Création groupe               | Créer un groupe à partir des amis                                |
| EF-10   | Navigation               | Navbar                        | Permettre l’accès rapide aux sections clés                       |

---

## 2. Tableau détaillé orienté front

| ID        | Page / écran                    | Exigence fonctionnelle                                         | Données / champs à afficher                                                                                      | Actions utilisateur                                     | Règles / contraintes MVP                                                                 |
| --------- | ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| EF-01     | Page inscription                | L’utilisateur peut créer un compte via un formulaire classique | Nom complet, email, mot de passe, confirmation mot de passe                                                      | Saisir les champs, valider le formulaire                | Inscription Google/Gmail/social login hors MVP                                           |
| EF-01.1   | Page inscription                | Le front doit valider les champs avant envoi                   | Nom complet requis, email valide, mot de passe requis, confirmation identique                                    | Afficher erreurs inline, bloquer soumission si invalide | Validation front obligatoire avant appel API                                             |
| EF-01.2   | Page connexion                  | L’utilisateur peut se connecter                                | Email, mot de passe                                                                                              | Saisir email + mot de passe, cliquer sur connexion      | Pas de connexion sociale dans le MVP                                                     |
| EF-01.3   | Page connexion                  | Le front doit gérer l’état d’erreur de connexion               | Message d’erreur global ou inline                                                                                | Réessayer la connexion                                  | Gestion simple des erreurs pour MVP                                                      |
| EF-02     | Page d’accueil                  | Afficher un fil de lecture de récits                           | Liste d’histoires                                                                                                | Scroller, filtrer, rechercher, ouvrir une histoire      | Écran principal de découverte                                                            |
| EF-02.1   | Page d’accueil                  | Permettre un filtre par thème                                  | Thèmes disponibles                                                                                               | Sélectionner un thème                                   | Filtrage côté front si données déjà chargées, sinon via API selon volume                 |
| EF-02.2   | Page d’accueil                  | Afficher une barre de recherche                                | Input recherche                                                                                                  | Rechercher par texte saisi                              | Recherche côté front pour MVP                                                            |
| EF-02.3   | Card histoire                   | Chaque histoire doit être affichée dans une card standard      | Titre, 120 premiers caractères du texte, tag, date, image, auteur, nombre d’enregistrements                      | Ouvrir le détail de l’histoire                          | Le diagramme de classe ne doit plus utiliser les notes, mais le nombre d’enregistrements |
| EF-02.4   | Card histoire                   | La card doit être réutilisable dans plusieurs pages            | Même structure visuelle                                                                                          | Cliquer sur la card                                     | Composant réutilisable front recommandé                                                  |
| EF-03     | Page détail histoire            | Afficher le détail complet d’une histoire                      | Thème principal, titre, auteur, photo de profil auteur, date, nombre d’enregistrements, résumé, contenu intégral | Lire l’histoire                                         | Le thème principal correspond à la tonalité choisie à la création                        |
| EF-03.1   | Page détail histoire            | Afficher un bouton retour                                      | Bouton retour en haut à gauche                                                                                   | Revenir à l’accueil                                     | Navigation simple demandée                                                               |
| EF-03.2   | Page détail histoire            | Permettre d’enregistrer l’histoire                             | État enregistré / non enregistré                                                                                 | Enregistrer l’histoire                                  | Action disponible en haut à droite                                                       |
| EF-03.3   | Page détail histoire            | Permettre de partager l’histoire dans un groupe                | Liste de groupes disponibles                                                                                     | Ouvrir l’action de partage, choisir un groupe           | Action disponible en haut à droite                                                       |
| EF-03.4   | Page détail histoire            | Afficher des suggestions d’histoires similaires                | Cards d’histoires partageant les mêmes tags                                                                      | Ouvrir une suggestion                                   | Présentation identique à la Home                                                         |
| EF-04     | Page dossiers partagés          | Afficher les collections partagées de l’utilisateur            | Nom de collection, nombre d’éléments                                                                             | Ouvrir une collection                                   | Affichage sous forme de cards                                                            |
| EF-04.1   | Page dossiers partagés          | Afficher une barre de recherche                                | Input recherche                                                                                                  | Rechercher une collection                               | Recherche côté front                                                                     |
| EF-04.2   | Page dossiers partagés          | Afficher une card “ajouter une collection”                     | Card de création                                                                                                 | Cliquer pour créer                                      | Élément visuel dédié                                                                     |
| EF-04.3   | Page dossiers partagés          | Afficher un bouton créer                                       | Bouton CTA                                                                                                       | Créer une collection                                    | Peut ouvrir une modale ou une page                                                       |
| EF-04.4   | Création collection partagée    | Permettre la création d’une collection                         | Nom de collection                                                                                                | Saisir le nom, valider                                  | MVP simple, sans logique complexe supplémentaire                                         |
| EF-04.5   | Page détail collection          | Afficher les histoires d’une collection donnée                 | Liste d’histoires au format cards                                                                                | Ouvrir une histoire                                     | Le front envoie l’ID de collection, le back retourne les histoires avec champs utiles    |
| EF-04.6   | Page détail collection          | Le back doit renvoyer les données nécessaires au rendu front   | ID histoire, titre, extrait, image, date, auteur, tags, clés étrangères utiles                                   | Consommer et afficher la réponse                        | Le nom de l’auteur doit être disponible                                                  |
| EF-05     | Page sauvegardes                | Afficher les contenus enregistrés par l’utilisateur            | Collections / dossiers de sauvegarde sous forme de cards                                                         | Ouvrir un dossier, créer un dossier                     | Accessible uniquement par l’utilisateur connecté                                         |
| EF-05.1   | Page sauvegardes                | Reprendre la logique visuelle des dossiers partagés            | Nom, nombre d’éléments, recherche, création                                                                      | Naviguer dans les dossiers                              | Clone fonctionnel des dossiers partagés, avec périmètre privé                            |
| EF-05.2   | Page sauvegardes                | Permettre d’ajouter des récits sauvegardés dans des dossiers   | Liste des dossiers disponibles                                                                                   | Ajouter à un dossier                                    | Ex. classement par thème                                                                 |
| EF-05.3   | Page sauvegardes                | Permettre de créer un dossier de sauvegarde                    | Nom du dossier                                                                                                   | Créer un dossier                                        | Usage personnel uniquement                                                               |
| EF-06     | Page ma bibliothèque            | Afficher les histoires écrites par l’utilisateur               | Cards d’histoires sans nom d’auteur                                                                              | Ouvrir une histoire, écrire une nouvelle histoire       | Liste personnelle de l’utilisateur                                                       |
| EF-06.1   | Page ma bibliothèque            | Afficher une card “Écrire une nouvelle histoire”               | Card dédiée à la création                                                                                        | Cliquer pour créer                                      | CTA principal de la zone auteur                                                          |
| EF-06.2   | Modèle histoire                 | Le modèle doit gérer le statut de publication                  | Champ booléen `isPublished`                                                                                      | Publier / garder brouillon                              | Nécessaire pour distinguer brouillon et publication                                      |
| EF-06.3   | Page ma bibliothèque            | Les cards doivent reprendre la logique de la Home              | Titre, extrait, date, image, tags, enregistrements éventuels                                                     | Ouvrir / modifier selon statut                          | Pas d’affichage du nom d’auteur sur cette page                                           |
| EF-07     | Page profil                     | Afficher le profil utilisateur                                 | Nom, photo, nombre de récits écrits, nombre de collections, nombre de récits enregistrés                         | Consulter le profil                                     | Vue de synthèse du compte                                                                |
| EF-07.1   | Page profil                     | Afficher un bouton modifier profil                             | Bouton CTA                                                                                                       | Accéder à la modification                               | Accès direct                                                                             |
| EF-07.2   | Page profil                     | Afficher les paramètres de compte                              | Sécurité et confidentialité, suppression du compte                                                               | Ouvrir une rubrique, supprimer le compte                | La suppression doit être prévue côté interface                                           |
| EF-07.3   | Page modification profil        | Permettre la modification des informations utilisateur         | Pseudo, bio, photo                                                                                               | Modifier puis enregistrer                               | MVP centré sur édition simple                                                            |
| EF-08     | Page mon réseau                 | Afficher les demandes d’amis en attente                        | Nom complet du demandeur                                                                                         | Accepter ou refuser l’invitation                        | Pas besoin d’informations supplémentaires pour MVP                                       |
| EF-08.1   | Page mon réseau                 | Afficher la liste des amis                                     | Photo de profil, nom                                                                                             | Supprimer un ami                                        | Liste simple                                                                             |
| EF-08.2   | Page recherche amis / résultats | Afficher les résultats de recherche utilisateur                | Nom, photo de profil                                                                                             | Ajouter comme ami                                       | Utilisé pour créer du réseau ou alimenter des groupes                                    |
| EF-09     | Page groupes                    | Afficher les groupes de l’utilisateur                          | Liste de groupes sous forme de cards                                                                             | Ouvrir un groupe, ajouter un groupe                     | Affichage simple                                                                         |
| EF-09.1   | Création groupe                 | Permettre la création d’un groupe                              | Nom, description                                                                                                 | Remplir le formulaire, valider                          | Groupe basé sur la liste d’amis                                                          |
| EF-09.2   | Création groupe                 | Afficher la liste complète des amis sélectionnables            | Cards ou liste d’amis avec état sélectionné / non sélectionné                                                    | Sélectionner les amis à ajouter                         | La source de données vient du réseau utilisateur                                         |
| EF-09.3   | Création groupe                 | Créer le groupe avec ses membres                               | Nom, description, membres sélectionnés                                                                           | Cliquer sur créer                                       | Action finale de création                                                                |
| EF-10     | Navbar                          | Afficher un bouton “Écrire une histoire”                       | CTA visible                                                                                                      | Accéder à la page de création d’histoire                | Élément de navigation global                                                             |
| EF-06.1.1 | Page création histoire          | Permettre la saisie complète d’une nouvelle histoire           | Titre, contenu, image, visibilité, tags prédéfinis, thème principal                                              | Rédiger et enregistrer                                  | Pas de commentaires en V1                                                                |
| EF-06.1.2 | Page création histoire          | Gérer la visibilité de l’histoire                              | Privé, public, personnalisé                                                                                      | Choisir une visibilité                                  | La visibilité personnalisée implique une logique de partage ciblé                        |
| EF-06.1.3 | Page création histoire          | Permettre la sélection de tags prédéfinis                      | Liste de tags                                                                                                    | Sélectionner un ou plusieurs tags                       | Tags contrôlés côté front/back                                                           |
| EF-06.1.4 | Page création histoire          | Permettre la sélection du thème principal                      | Thème / tonalité                                                                                                 | Choisir le thème principal                              | Ce champ est affiché sur la page détail                                                  |
| EF-06.1.5 | Page création histoire          | Permettre l’ajout à un dossier ou à un groupe                  | Dossiers disponibles, groupes disponibles                                                                        | Ajouter à un dossier, sélectionner un groupe            | À clarifier côté modèle selon distinction dossier/groupe                                 |
| EF-06.1.6 | Page création histoire          | Permettre l’upload d’une image                                 | Image de couverture                                                                                              | Ajouter / modifier l’image                              | Image affichée ensuite dans les cards et détails                                         |

---

## 3. Exigences transverses utiles pour le front

| ID    | Sujet transverse   | Exigence                                                                                                                                                                                                          |
| ----- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ET-01 | Réutilisabilité UI | Les cards d’histoires doivent être conçues comme un composant réutilisable pour Home, suggestions, détail collection, bibliothèque et éventuellement sauvegardes                                                  |
| ET-02 | Recherche          | Les search bars mentionnées “côté front” doivent filtrer localement les données déjà chargées                                                                                                                     |
| ET-03 | États UI           | Chaque page doit prévoir au minimum les états : chargement, vide, erreur, succès                                                                                                                                  |
| ET-04 | Authentification   | Les pages sauvegardes, dossiers partagés personnels, bibliothèque, profil, groupes et réseau nécessitent un utilisateur connecté                                                                                  |
| ET-05 | Modèle Histoire    | Le front doit exploiter un modèle Histoire contenant au minimum : id, titre, contenu, résumé/extrait, image, date, tags, thème principal, auteur, photo auteur, nombre d’enregistrements, visibilité, isPublished |
| ET-06 | Modèle Collection  | Une collection doit contenir au minimum : id, nom, nombre d’éléments                                                                                                                                              |
| ET-07 | Modèle Groupe      | Un groupe doit contenir au minimum : id, nom, description, liste de membres                                                                                                                                       |
| ET-08 | MVP                | Pas de commentaires, pas de login social, pas de notation                                                                                                                                                         |
| ET-09 | Navigation         | La navigation doit permettre un accès rapide à l’accueil, au profil, à la bibliothèque, aux sauvegardes, aux groupes, au réseau et à l’écriture                                                                   |
| ET-10 | Cohérence métier   | Le compteur affiché pour une histoire est le nombre d’enregistrements et non une note                                                                                                                             |

---

## 4. Priorisation MVP pour la création du front

| Priorité                   | Modules                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| P1 — indispensable         | Inscription, connexion, accueil, card histoire, détail histoire, création histoire, navbar |
| P2 — cœur d’usage connecté | profil, modification profil, ma bibliothèque, sauvegardes                                  |
| P3 — social / partage      | groupes, mon réseau, résultats de recherche amis, dossiers partagés, détail collection     |
| Hors MVP                   | Connexion Google/Gmail, commentaires                                                       |

---

## 5. Structure de pages front conseillée

| Page                     | Composants principaux à prévoir                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| Inscription              | FormulaireAuth, Input, ValidationMessage, BoutonSubmit                                                   |
| Connexion                | FormulaireAuth, Input, BoutonSubmit, MessageErreur                                                       |
| Accueil                  | Header, SearchBar, FilterBar, StoryGrid, StoryCard                                                       |
| Détail histoire          | BackButton, StoryHeader, StoryMeta, StoryContent, SaveButton, ShareButton, SuggestionsList               |
| Dossiers partagés        | SearchBar, CollectionGrid, CollectionCard, AddCollectionCard, CreateButton                               |
| Sauvegardes              | SearchBar, SavedFoldersGrid, FolderCard, CreateFolderButton                                              |
| Détail collection        | StoryGrid, StoryCard                                                                                     |
| Ma bibliothèque          | StoryGrid, StoryCard, NewStoryCard                                                                       |
| Profil                   | ProfileHeader, StatsCards, AccountSettings, EditProfileButton                                            |
| Modification profil      | EditProfileForm, AvatarUploader                                                                          |
| Création histoire        | StoryForm, ImageUploader, VisibilitySelector, TagsSelector, ThemeSelector, FolderSelector, GroupSelector |
| Groupes                  | GroupGrid, GroupCard, AddGroupButton                                                                     |
| Création groupe          | GroupForm, FriendsSelector, FriendCard                                                                   |
| Mon réseau               | PendingInvitationsList, InvitationCard, FriendsList, FriendCard                                          |
| Résultats recherche amis | SearchResultsList, UserCard, AddFriendButton                                                             |

---

## 6. Points de modélisation à répercuter dans le diagramme de classe

| Élément         | Modification demandée                                                   |
| --------------- | ----------------------------------------------------------------------- |
| Histoire        | Ajouter `isPublished: boolean`                                          |
| Histoire        | Remplacer la logique de note par `saveCount` / nombre d’enregistrements |
| Histoire        | Prévoir visibilité : `private`, `public`, `custom`                      |
| Histoire        | Prévoir thème principal / tonalité                                      |
| Histoire        | Prévoir liste de tags prédéfinis                                        |
| Utilisateur     | Prévoir photo de profil, pseudo, bio                                    |
| Collection      | Prévoir nom, propriétaire, liste d’histoires                            |
| Groupe          | Prévoir nom, description, membres                                       |
| Réseau / amitié | Prévoir demandes d’amis + contacts validés                              |

---
