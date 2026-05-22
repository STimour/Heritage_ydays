import { test, expect } from '@playwright/test';
import { register, uniqueEmail } from './helpers';

test.describe('Flux 3 — Bibliothèque', () => {

  test('page /library charge et affiche le titre', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/library');
    await expect(page.locator('h1')).toContainText('Ma bibliothèque');
  });

  test('les onglets sont tous visibles', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/library');
    for (const tab of ['Toutes', 'Favoris', 'À lire plus tard', 'Lu', 'Collections']) {
      await expect(page.locator(`button:has-text("${tab}")`).first()).toBeVisible();
    }
  });

  test('cliquer sur un onglet → il devient actif', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/library');
    await page.click('button:has-text("Favoris")');
    // L'onglet "Favoris" doit avoir le style actif (fond sombre)
    const favBtn = page.locator('button:has-text("Favoris")').first();
    await expect(favBtn).toHaveCSS('background-color', 'rgb(34, 34, 31)');
  });

  test('récit créé → apparaît dans la bibliothèque', async ({ page }) => {
    await register(page, uniqueEmail());

    // Créer un récit
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Récit dans ma bibliothèque');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu bibliothèque.');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    // Aller en bibliothèque — utiliser h3 (carte) pour éviter la strict mode violation avec le banner
    await page.goto('/library');
    await expect(page.locator('h3').filter({ hasText: 'Récit dans ma bibliothèque' })).toBeVisible({ timeout: 10000 });
  });

  test('cliquer sur une carte → redirige vers /stories/[id]', async ({ page }) => {
    await register(page, uniqueEmail());

    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Carte bibliothèque cliquable');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu cliquable.');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    await page.goto('/library');
    await page.locator('h3').filter({ hasText: 'Carte bibliothèque cliquable' }).waitFor({ timeout: 10000 });
    await page.locator('a').filter({ hasText: 'Carte bibliothèque cliquable' }).first().click();
    await page.waitForURL(/\/stories\/\d+/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/stories\/\d+/);
  });

  test('barre de recherche filtre les cartes', async ({ page }) => {
    await register(page, uniqueEmail());

    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Histoire unique XYZ123');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu filtre.');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    await page.goto('/library');
    await page.fill('input[placeholder="Rechercher"]', 'XYZ123');
    await expect(page.locator('h3').filter({ hasText: 'Histoire unique XYZ123' })).toBeVisible({ timeout: 5000 });
  });

  test('onglet Favoris → affiche les récits sauvegardés ou état vide', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/library');
    await page.click('button:has-text("Favoris")');
    // Nouvel utilisateur → état vide attendu
    await expect(page.locator('p:has-text("Aucun récit sauvegardé")')).toBeVisible({ timeout: 10000 });
  });

  test('onglet Favoris → récit sauvegardé y apparaît', async ({ page }) => {
    await register(page, uniqueEmail());

    // Créer un dossier
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await page.fill('input[placeholder="Ex : Souvenirs d\'enfance"]', 'Favoris Test');
    await page.click('button[type="submit"]:has-text("Créer")');
    await page.waitForSelector('text=Favoris Test', { timeout: 10000 });

    // Créer un récit public
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Récit favori E2E');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu favori.');
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    // Ouvrir la modal de sauvegarde, sélectionner le dossier, sauvegarder
    await page.locator('div.fixed button').nth(1).click();
    await expect(page.locator('text=Sauvegarder dans…')).toBeVisible();
    await page.click('text=Favoris Test');
    await page.click('button:has-text("Sauvegarder")');
    await expect(page.locator('text=Récit sauvegardé dans le dossier')).toBeVisible({ timeout: 5000 });

    // Aller en bibliothèque, onglet Favoris
    await page.goto('/library');
    await page.click('button:has-text("Favoris")');
    await expect(page.locator('text=Récit favori E2E').first()).toBeVisible({ timeout: 10000 });
  });

});
