import { test, expect } from '@playwright/test';
import { register, uniqueEmail } from './helpers';

test.describe('Flux 5 — Sauvegardes', () => {

  test('page /saves charge et affiche le titre', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/saves');
    await expect(page.locator('h1')).toContainText('Mes sauvegardes');
  });

  test('état vide → message "Aucun dossier"', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/saves');
    await page.waitForSelector('text=Aucun dossier pour l\'instant', { timeout: 10000 });
    await expect(page.locator('text=Aucun dossier pour l\'instant')).toBeVisible();
  });

  test('bouton "Nouveau dossier" → ouvre la modal', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await expect(page.locator('text=Nouveau dossier').last()).toBeVisible();
    await expect(page.locator('input[placeholder="Ex : Souvenirs d\'enfance"]')).toBeVisible();
  });

  test('créer un dossier → apparaît dans la liste', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await page.fill('input[placeholder="Ex : Souvenirs d\'enfance"]', 'Dossier Test E2E');
    await page.click('button[type="submit"]:has-text("Créer")');
    await expect(page.locator('text=Dossier Test E2E')).toBeVisible({ timeout: 10000 });
  });

  test('créer dossier sans nom → bouton désactivé', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    const submitBtn = page.locator('button[type="submit"]:has-text("Créer")');
    await expect(submitBtn).toBeDisabled();
  });

  test('"Ouvrir le dossier" → redirige vers /saves/[id]', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await page.fill('input[placeholder="Ex : Souvenirs d\'enfance"]', 'Dossier Navigable');
    await page.click('button[type="submit"]:has-text("Créer")');
    await page.waitForSelector('text=Dossier Navigable', { timeout: 10000 });
    await page.click('button:has-text("Ouvrir le dossier")');
    await page.waitForURL(/\/saves\/\d+/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/saves\/\d+/);
  });

  test('sauvegarder un récit dans un dossier → toast de confirmation', async ({ page }) => {
    await register(page, uniqueEmail());

    // Créer un dossier
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await page.fill('input[placeholder="Ex : Souvenirs d\'enfance"]', 'Dossier Pour Récit');
    await page.click('button[type="submit"]:has-text("Créer")');
    await page.waitForSelector('text=Dossier Pour Récit', { timeout: 10000 });

    // Créer un récit
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Récit à mettre en dossier');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu dossier.');
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    // Le bouton signet est le 2ème bouton dans la zone fixée en haut à droite (Share + Save)
    await page.locator('div.fixed button').nth(1).click();
    await expect(page.locator('text=Sauvegarder dans…')).toBeVisible();

    // Sélectionner le dossier
    await page.click('text=Dossier Pour Récit');
    await page.click('button:has-text("Sauvegarder")');

    // Toast de confirmation
    await expect(page.locator('text=Récit sauvegardé dans le dossier')).toBeVisible({ timeout: 5000 });
  });

  test('supprimer un dossier → disparaît de la liste', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await page.fill('input[placeholder="Ex : Souvenirs d\'enfance"]', 'Dossier Suppression');
    await page.click('button[type="submit"]:has-text("Créer")');
    await page.waitForSelector('text=Dossier Suppression', { timeout: 10000 });

    // Accepter le confirm() natif AVANT de cliquer
    page.on('dialog', d => d.accept());
    await page.getByTitle('Supprimer le dossier').first().click();

    await expect(page.locator('text=Dossier Suppression')).not.toBeVisible({ timeout: 8000 });
  });

  test('page dossier → bouton de tri change l\'ordre', async ({ page }) => {
    await register(page, uniqueEmail());

    // Créer un dossier
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await page.fill('input[placeholder="Ex : Souvenirs d\'enfance"]', 'Dossier Tri');
    await page.click('button[type="submit"]:has-text("Créer")');
    await page.waitForSelector('text=Dossier Tri', { timeout: 10000 });

    // Ouvrir le dossier
    await page.click('button:has-text("Ouvrir le dossier")');
    await page.waitForURL(/\/saves\/\d+/, { timeout: 10000 });

    // Le bouton de tri "Les plus récents" doit être visible
    await expect(page.locator('button:has-text("Les plus récents")')).toBeVisible({ timeout: 5000 });

    // Cliquer → le texte doit changer vers "Les plus anciens"
    await page.locator('button:has-text("Les plus récents")').click();
    await expect(page.locator('button:has-text("Les plus anciens")')).toBeVisible({ timeout: 3000 });
  });

  test('récit sauvegardé → apparaît dans le dossier', async ({ page }) => {
    await register(page, uniqueEmail());

    // Créer un dossier
    await page.goto('/saves');
    await page.click('button:has-text("Nouveau dossier")');
    await page.fill('input[placeholder="Ex : Souvenirs d\'enfance"]', 'Dossier Vérification');
    await page.click('button[type="submit"]:has-text("Créer")');
    await page.waitForSelector('text=Dossier Vérification', { timeout: 10000 });

    // Créer un récit public
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Récit vérifié dans dossier');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu vérifié.');
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    // Sauvegarder dans le dossier
    await page.locator('div.fixed button').nth(1).click();
    await expect(page.locator('text=Sauvegarder dans…')).toBeVisible();
    await page.click('text=Dossier Vérification');
    await page.click('button:has-text("Sauvegarder")');
    await expect(page.locator('text=Récit sauvegardé dans le dossier')).toBeVisible({ timeout: 5000 });

    // Naviguer vers le dossier et vérifier que le récit y apparaît
    await page.goto('/saves');
    await page.waitForSelector('text=Dossier Vérification', { timeout: 10000 });
    await page.click('button:has-text("Ouvrir le dossier")');
    await page.waitForURL(/\/saves\/\d+/, { timeout: 10000 });
    await expect(page.locator('text=Récit vérifié dans dossier').first()).toBeVisible({ timeout: 10000 });
  });

});
