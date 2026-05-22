import { test, expect } from '@playwright/test';
import { register, uniqueEmail } from './helpers';

test.describe('Flux 4 — Groupes', () => {

  test('page /groups charge et affiche le titre', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups');
    await expect(page.locator('h1')).toContainText('Mes groupes');
  });

  test('bouton "Nouveau groupe" → redirige vers /groups/new', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups');
    // Le bouton est un <Link>, pas un <button>
    await page.locator('a').filter({ hasText: 'Nouveau groupe' }).first().click();
    await expect(page).toHaveURL(/\/groups\/new/);
  });

  test('créer un groupe → redirige vers /groups/[id]', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups/new');
    await page.fill('input[placeholder="Famille Achard"]', 'Groupe Test E2E');
    await page.click('button:has-text("Créer le groupe")');
    await page.waitForURL(/\/groups\/\d+/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/groups\/\d+/);
  });

  test('groupe créé → apparaît dans /groups', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups/new');
    await page.fill('input[placeholder="Famille Achard"]', 'Groupe Liste E2E');
    await page.click('button:has-text("Créer le groupe")');
    await page.waitForURL(/\/groups\/\d+/, { timeout: 15000 });

    await page.goto('/groups');
    await expect(page.locator('text=Groupe Liste E2E')).toBeVisible({ timeout: 10000 });
  });

  test('page détail groupe → nom visible dans le h1', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups/new');
    await page.fill('input[placeholder="Famille Achard"]', 'Groupe Détail E2E');
    await page.click('button:has-text("Créer le groupe")');
    await page.waitForURL(/\/groups\/\d+/, { timeout: 15000 });

    // Le nom apparaît dans le h1 ET dans le breadcrumb — utiliser le heading pour éviter strict mode
    await expect(page.locator('h1').filter({ hasText: 'Groupe Détail E2E' })).toBeVisible();
  });

  test('créer groupe sans nom → message d\'erreur', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups/new');
    await page.click('button:has-text("Créer le groupe")');
    await expect(page.locator('text=Le nom du groupe est obligatoire')).toBeVisible();
    await expect(page).toHaveURL(/\/groups\/new/);
  });

  test('cliquer sur une carte groupe → ouvre /groups/[id]', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups/new');
    await page.fill('input[placeholder="Famille Achard"]', 'Groupe Carte Cliquable');
    await page.click('button:has-text("Créer le groupe")');
    await page.waitForURL(/\/groups\/\d+/, { timeout: 15000 });

    await page.goto('/groups');
    await page.locator('h3').filter({ hasText: 'Groupe Carte Cliquable' }).waitFor({ timeout: 10000 });
    await page.locator('a').filter({ hasText: 'Groupe Carte Cliquable' }).first().click();
    await page.waitForURL(/\/groups\/\d+/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/groups\/\d+/);
  });

  test('onglet "Fil de récits" → récits du cercle (vide si aucun)', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/groups/new');
    await page.fill('input[placeholder="Famille Achard"]', 'Groupe Récits API');
    await page.click('button:has-text("Créer le groupe")');
    await page.waitForURL(/\/groups\/\d+/, { timeout: 15000 });

    // L'onglet "Fil de récits" est actif par défaut
    await page.waitForSelector('button:has-text("Fil de récits")', { timeout: 10000 });
    await expect(page.locator('button:has-text("Fil de récits")').first()).toBeVisible();

    // Nouveau groupe sans récits → état vide (l'API renvoie le fil du cercle, pas le fil global)
    await expect(page.locator('text=Aucun récit partagé dans ce groupe')).toBeVisible({ timeout: 10000 });
  });

});
