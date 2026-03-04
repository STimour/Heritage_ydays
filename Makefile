ENV_FILE= .env
ENV_TEMPLATE= .env.template
COMPOSE_FILE=docker/docker-compose.dev.yml

# Permet de contrôler le préfixe des volumes/containers créés par Compose
COMPOSE_PROJECT_NAME ?= heritage

SPRING_PROFILE ?= dev

# Compose command (profil Spring injecté)
DC = SPRING_PROFILES_ACTIVE=$(SPRING_PROFILE) docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE)

.PHONY: env up build rebuild down down-volumes reset reset-db ps logs logs-backend logs-frontend logs-db \
        backend-shell frontend-shell db-shell test test-it \
        up-dev up-prod \
        down-dev down-prod down-volumes-dev down-volumes-prod \
        reset-dev reset-prod reset-db-dev reset-db-prod \
        ps-dev ps-prod \
        logs-dev logs-prod logs-backend-dev logs-backend-prod logs-frontend-dev logs-frontend-prod logs-db-dev logs-db-prod \
        backend-shell-dev backend-shell-prod frontend-shell-dev frontend-shell-prod db-shell-dev db-shell-prod

# ---- npm-like ----	
up-dev:
	$(MAKE) up SPRING_PROFILE=dev COMPOSE_PROJECT_NAME=heritage-dev

up-prod:
	$(MAKE) up SPRING_PROFILE=prod COMPOSE_PROJECT_NAME=heritage-prod
	
test:
	$(MAKE) test-it

# ---- Création .env à partir de template ----
env:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Création du fichier .env depuis .env.template"; \
		cp $(ENV_TEMPLATE) $(ENV_FILE); \
	else \
		echo ".env déjà présent"; \
	fi

# ---- Lancement ----
up:
	$(DC) up -d

build:
	$(DC) build

rebuild:
	$(DC) up -d --build

# ---- Arrêt ----
down:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) down

down-volumes:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) down -v


# Reset complet (containers + volumes + orphelins)
reset:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) down -v --remove-orphans
	$(DC) up -d --build

# Reset DB uniquement (supprime seulement pgdata, garde maven-cache et node-modules)
reset-db:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) down
	@docker volume rm -f $(COMPOSE_PROJECT_NAME)_pgdata
	$(DC) up -d


# ---- npm-like ---- 

down-dev:
	$(MAKE) down COMPOSE_PROJECT_NAME=heritage-dev

down-prod:
	$(MAKE) down COMPOSE_PROJECT_NAME=heritage-prod

down-volumes-dev:
	$(MAKE) down-volumes COMPOSE_PROJECT_NAME=heritage-dev

down-volumes-prod:
	$(MAKE) down-volumes COMPOSE_PROJECT_NAME=heritage-prod

reset-dev:
	$(MAKE) reset SPRING_PROFILE=dev COMPOSE_PROJECT_NAME=heritage-dev

reset-prod:
	$(MAKE) reset SPRING_PROFILE=prod COMPOSE_PROJECT_NAME=heritage-prod

reset-db-dev:
	$(MAKE) reset-db SPRING_PROFILE=dev COMPOSE_PROJECT_NAME=heritage-dev

reset-db-prod:
	$(MAKE) reset-db SPRING_PROFILE=prod COMPOSE_PROJECT_NAME=heritage-prod

# ---- Monitoring ----
ps:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) ps

logs:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) logs -f

logs-backend:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) logs -f backend

logs-frontend:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) logs -f frontend

logs-db:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) logs -f db

# ---- npm-like ----
logs-dev:
	$(MAKE) logs COMPOSE_PROJECT_NAME=heritage-dev

logs-prod:
	$(MAKE) logs COMPOSE_PROJECT_NAME=heritage-prod

logs-backend-dev:
	$(MAKE) logs-backend COMPOSE_PROJECT_NAME=heritage-dev

logs-backend-prod:
	$(MAKE) logs-backend COMPOSE_PROJECT_NAME=heritage-prod

logs-frontend-dev:
	$(MAKE) logs-frontend COMPOSE_PROJECT_NAME=heritage-dev

logs-frontend-prod:
	$(MAKE) logs-frontend COMPOSE_PROJECT_NAME=heritage-prod

logs-db-dev:
	$(MAKE) logs-db COMPOSE_PROJECT_NAME=heritage-dev

logs-db-prod:
	$(MAKE) logs-db COMPOSE_PROJECT_NAME=heritage-prod

# ---- Shell accès ----
backend-shell:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec backend sh

frontend-shell:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec frontend sh

db-shell:
	docker compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) -f $(COMPOSE_FILE) exec db sh

backend-shell-dev:
	$(MAKE) backend-shell COMPOSE_PROJECT_NAME=heritage-dev

backend-shell-prod:
	$(MAKE) backend-shell COMPOSE_PROJECT_NAME=heritage-prod

frontend-shell-dev:
	$(MAKE) frontend-shell COMPOSE_PROJECT_NAME=heritage-dev

frontend-shell-prod:
	$(MAKE) frontend-shell COMPOSE_PROJECT_NAME=heritage-prod

db-shell-dev:
	$(MAKE) db-shell COMPOSE_PROJECT_NAME=heritage-dev

db-shell-prod:
	$(MAKE) db-shell COMPOSE_PROJECT_NAME=heritage-prod

# ---- Tests backend ----
test-it:
	cd backend && mvn -Dspring.profiles.active=test test