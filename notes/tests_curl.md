# Script de test — Heritage Backend
# Prérequis : make up-dev, jq installé

BASE="http://localhost:8083/api"

## ─── 1. AUTH ───────────────────────────────────────────────────

# Inscription Alice
curl -s -X POST $BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Alice Martin","email":"alice@test.com","password":"password123"}' | jq .

# Inscription Bob
curl -s -X POST $BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Bob Dupont","email":"bob@test.com","password":"password123"}' | jq .

# Login → tokens
TOKEN_ALICE=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}' | jq -r .token)

TOKEN_BOB=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com","password":"password123"}' | jq -r .token)

echo "Alice token: $TOKEN_ALICE"
echo "Bob token:   $TOKEN_BOB"

## ─── 2. STORIES ────────────────────────────────────────────────

# Créer une histoire
STORY=$(curl -s -X POST $BASE/stories \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon enfance","content":"Il était une fois dans un petit village...","visibility":"PUBLIC","mainTheme":"DRAMA","tags":["famille","enfance"]}' | jq .)
echo $STORY | jq .
STORY_ID=$(echo $STORY | jq -r .id)

# Fil de lecture
curl -s "$BASE/stories" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Fil filtré par thème
curl -s "$BASE/stories?theme=DRAMA" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Détail + suggestions
curl -s "$BASE/stories/$STORY_ID" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Ma bibliothèque
curl -s "$BASE/stories/library" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Toggle sauvegarde (Bob sauvegarde)
curl -s -X POST "$BASE/stories/$STORY_ID/save" \
  -H "Authorization: Bearer $TOKEN_BOB" | jq .

# Re-toggle → désauvegarde
curl -s -X POST "$BASE/stories/$STORY_ID/save" \
  -H "Authorization: Bearer $TOKEN_BOB" | jq .

## ─── 3. DOSSIERS ───────────────────────────────────────────────

# Créer un dossier partagé
FOLDER=$(curl -s -X POST $BASE/folders \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mes souvenirs","privateFolder":false}' | jq .)
FOLDER_ID=$(echo $FOLDER | jq -r .id)
echo $FOLDER | jq .

# Créer une sauvegarde (privé)
curl -s -X POST $BASE/folders \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"name":"A lire plus tard","privateFolder":true}' | jq .

# Lister dossiers partagés
curl -s "$BASE/folders?privateFolder=false" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Lister sauvegardes
curl -s "$BASE/folders?privateFolder=true" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Ajouter une histoire au dossier
curl -s -X POST "$BASE/folders/$FOLDER_ID/stories/$STORY_ID" \
  -H "Authorization: Bearer $TOKEN_ALICE" -w "\nHTTP %{http_code}\n"

# Détail du dossier
curl -s "$BASE/folders/$FOLDER_ID" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Retirer l'histoire
curl -s -X DELETE "$BASE/folders/$FOLDER_ID/stories/$STORY_ID" \
  -H "Authorization: Bearer $TOKEN_ALICE" -w "\nHTTP %{http_code}\n"

## ─── 4. PROFIL ─────────────────────────────────────────────────

# Mon profil
curl -s "$BASE/users/me" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Modifier mon profil
curl -s -X PUT "$BASE/users/me" \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"pseudo":"alice_m"}' | jq .

# Profil public de Bob
BOB_ID=$(curl -s "$BASE/users/me" -H "Authorization: Bearer $TOKEN_BOB" | jq -r .id)
curl -s "$BASE/users/$BOB_ID" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

## ─── 5. AMIS ───────────────────────────────────────────────────

# Alice envoie une demande à Bob
curl -s -X POST "$BASE/friends/requests/$BOB_ID" \
  -H "Authorization: Bearer $TOKEN_ALICE" -w "\nHTTP %{http_code}\n"

# Bob voit ses demandes reçues
REQUESTS=$(curl -s "$BASE/friends/requests" -H "Authorization: Bearer $TOKEN_BOB" | jq .)
echo $REQUESTS | jq .
REQUEST_ID=$(echo $REQUESTS | jq -r '.[0].id')

# Bob accepte
curl -s -X POST "$BASE/friends/requests/$REQUEST_ID/accept" \
  -H "Authorization: Bearer $TOKEN_BOB" -w "\nHTTP %{http_code}\n"

# Contacts d'Alice
curl -s "$BASE/friends" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Recherche
curl -s "$BASE/users/search?q=bob" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Supprimer l'amitié
curl -s -X DELETE "$BASE/friends/$BOB_ID" \
  -H "Authorization: Bearer $TOKEN_ALICE" -w "\nHTTP %{http_code}\n"

## ─── 6. CERCLES ────────────────────────────────────────────────

# Créer un cercle avec Bob
CIRCLE=$(curl -s -X POST $BASE/circles \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Famille\",\"memberIds\":[$BOB_ID]}" | jq .)
CIRCLE_ID=$(echo $CIRCLE | jq -r .id)
echo $CIRCLE | jq .

# Mes cercles
curl -s "$BASE/circles" -H "Authorization: Bearer $TOKEN_ALICE" | jq .

# Retirer Bob
curl -s -X DELETE "$BASE/circles/$CIRCLE_ID/members/$BOB_ID" \
  -H "Authorization: Bearer $TOKEN_ALICE" -w "\nHTTP %{http_code}\n"

# Supprimer le cercle
curl -s -X DELETE "$BASE/circles/$CIRCLE_ID" \
  -H "Authorization: Bearer $TOKEN_ALICE" -w "\nHTTP %{http_code}\n"
