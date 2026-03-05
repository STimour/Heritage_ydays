# Héritage — Environnement de développement Docker

Ce projet utilise une approche **Docker-first**.

Toute l’infrastructure de développement (backend, frontend, base de données) est gérée par **Docker Compose**, et contrôlée via un **Makefile** qui agit comme une CLI du projet.

L’objectif est simple :

> un développeur doit pouvoir cloner le projet et travailler dessus avec uniquement **Docker et Make**.

Les outils suivants **ne sont pas nécessaires localement** :

* Java
* Maven
* Node
* PostgreSQL

Docker exécute tout.

---

# Pré-requis

Installer uniquement :

* Docker
* Docker Compose
* Make

---

# Initialisation du projet

## Création du fichier `.env`

Avant tout lancement, il faut générer le fichier `.env`.

Commande :

```bash
make env
```

Cette commande :

* vérifie si `.env` existe
* sinon copie `.env.template`

---

# Commandes principales (workflow quotidien)

Les commandes principales suivent une logique **npm-like** :

```bash
make up-dev
make down-dev
make logs-dev
make reset-dev
```

Elles sont celles que vous utiliserez **90 % du temps**.

---

# Démarrer l’environnement

## Lancer l’environnement de développement

```bash
make up-dev
```

Cette commande démarre :

* PostgreSQL
* le backend Spring Boot
* le frontend

Tout est exécuté dans Docker.

---

## Voir les logs

```bash
make logs-dev
```

Affiche les logs de tous les services.

---

## Voir les logs d’un service spécifique

Backend :

```bash
make logs-backend-dev
```

Frontend :

```bash
make logs-frontend-dev
```

Base de données :

```bash
make logs-db-dev
```

---

## Voir les conteneurs actifs

```bash
make ps-dev
```

---

# Accéder aux conteneurs

Il est possible d’ouvrir un shell dans chaque service.

Backend :

```bash
make backend-shell-dev
```

Frontend :

```bash
make frontend-shell-dev
```

Base de données :

```bash
make db-shell-dev
```

---

# Arrêter l’environnement

```bash
make down-dev
```

Arrête les conteneurs Docker.

Les volumes sont conservés.

---

# Reset de l’environnement

## Reset complet

```bash
make reset-dev
```

Supprime :

* conteneurs
* volumes
* conteneurs orphelins

Puis reconstruit tout.

---

## Reset uniquement de la base de données

```bash
make reset-db-dev
```

Supprime uniquement le volume PostgreSQL.

Les caches restent intacts :

* cache Maven
* node_modules

---

# Tests backend

Les tests backend peuvent être lancés via Docker :

```bash
make test
```

Cette commande lance :

```bash
mvn -Dspring.profiles.active=test test
```

dans le conteneur backend.

---

# Commandes avancées

Ces commandes sont utilisées en interne par les commandes `*-dev`.

---

## Lancer l’environnement

```bash
make up
```

---

## Build des images Docker

```bash
make build
```

---

## Rebuild complet

```bash
make rebuild
```

---

## Arrêter les services

```bash
make down
```

---

## Arrêter et supprimer les volumes

```bash
make down-volumes
```

---

# Environnement production

Le projet peut aussi être lancé avec le profil `prod`.

Démarrage :

```bash
make up-prod
```

Arrêt :

```bash
make down-prod
```

Logs :

```bash
make logs-prod
```

---

# Architecture de l’environnement

L’environnement Docker comprend trois services principaux :

* **backend** — API Spring Boot
* **frontend** — application web
* **db** — PostgreSQL

Volumes persistants :

* `pgdata` → données PostgreSQL
* `maven-cache` → dépendances Maven
* `node-modules` → dépendances Node

---

# Workflow recommandé

Initialisation :

```bash
make env
```

Démarrage :

```bash
make up-dev
```

Suivre les logs :

```bash
make logs-dev
```

Arrêt :

```bash
make down-dev
```

Reset base de données si nécessaire :

```bash
make reset-db-dev
```

---

# Philosophie du projet

Le projet adopte une approche **Docker-first** :

* aucune dépendance locale
* environnement reproductible
* même stack pour tous les développeurs

Le `Makefile` agit comme une **interface simple au-dessus de Docker Compose**, permettant d’utiliser des commandes lisibles :

```bash
make up-dev
make logs-dev
make backend-shell-dev
make reset-db-dev
```

Cette approche garantit que **tout développeur peut démarrer le projet avec une seule commande**.

---

Si tu veux, je peux aussi te faire une **version encore plus professionnelle du README** avec :

* diagramme d’architecture Docker
* structure du repo
* workflow backend (Flyway + Hibernate validate)
* description du stack technique

ce qui donne un **README digne d’un projet SaaS open-source sérieux**.
