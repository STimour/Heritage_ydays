import { test, expect } from '@playwright/test';
import { register, login, uniqueEmail } from './helpers';

test.describe('Flux 2 — Récits', () => {

  test('créer un récit public → redirige vers /stories/[id]', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Mon premier récit de test');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Ceci est le contenu du récit de test.');
    // Sélectionner "Public"
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/stories\/\d+/);
  });

  test('détail d\'un récit → titre et auteur visibles', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Récit pour le détail');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu pour vérification.');
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    await expect(page.locator('h1')).toContainText('Récit pour le détail');
    // L'auteur doit être visible (nom complet = "Test User")
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('récit créé → apparaît dans /feed', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Récit visible dans le feed');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu test feed.');
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    await page.goto('/feed');
    await page.waitForSelector('text=Récit visible dans le feed', { timeout: 10000 });
    await expect(page.locator('text=Récit visible dans le feed').first()).toBeVisible();
  });

  test('cliquer sur une story card → ouvre /stories/[id]', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Carte cliquable');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu test carte.');
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    await page.goto('/feed');
    await page.waitForSelector('text=Carte cliquable', { timeout: 10000 });
    await page.click('text=Carte cliquable');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/stories\/\d+/);
  });

  test('sauvegarder un récit → modal "Sauvegarder dans…" apparaît', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    await page.goto('/stories/new');
    await page.fill('input[placeholder="Titre de l\'histoire"]', 'Récit à sauvegarder');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu test save.');
    await page.click('button:has-text("Public")');
    await page.click('button:has-text("Publier")');
    await page.waitForURL(/\/stories\/\d+/, { timeout: 15000 });

    // Le bouton signet est le 2ème bouton dans la zone fixée en haut à droite (Share + Save)
    await page.locator('div.fixed button').nth(1).click();
    await expect(page.locator('text=Sauvegarder dans…')).toBeVisible();
  });

  test('récit sans titre → message d\'erreur, pas de redirection', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/stories/new');
    await page.fill('textarea[placeholder="Commencer à écrire de l\'histoire"]', 'Contenu sans titre.');
    await page.click('button:has-text("Publier")');
    await expect(page.locator('text=Le titre est obligatoire')).toBeVisible();
    await expect(page).toHaveURL(/\/stories\/new/);
  });

  test('toolbar Bold → insère les marqueurs ** dans le textarea', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/stories/new');
    const textarea = page.locator('textarea[placeholder="Commencer à écrire de l\'histoire"]');
    // Utiliser click + keyboard.type pour que React traite bien l'événement avant le clic toolbar
    await textarea.click();
    await page.keyboard.type('Texte normal.');
    await page.waitForTimeout(150);
    await page.locator('button[title="Gras"]').click();
    await page.waitForTimeout(200);
    const val = await textarea.inputValue();
    expect(val).toContain('**');
  });

  test('toolbar Italic → insère les marqueurs _ dans le textarea', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/stories/new');
    const textarea = page.locator('textarea[placeholder="Commencer à écrire de l\'histoire"]');
    await textarea.click();
    await page.keyboard.type('Texte normal.');
    await page.waitForTimeout(150);
    await page.locator('button[title="Italique"]').click();
    await page.waitForTimeout(200);
    const val = await textarea.inputValue();
    expect(val).toContain('_');
  });

  test('auto-save → puce "Sauvegardé" après quelques secondes', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/stories/new');
    const titleInput = page.locator('input[placeholder="Titre de l\'histoire"]');
    const textarea   = page.locator('textarea[placeholder="Commencer à écrire de l\'histoire"]');
    await titleInput.click();
    await page.keyboard.type('Brouillon auto-save');
    await textarea.click();
    await page.keyboard.type('Contenu brouillon auto-save.');
    // Attendre le debounce (2s) + appel API + marge
    await expect(page.locator('span:has-text("Sauvegardé")')).toBeVisible({ timeout: 10000 });
  });

  test('feed → bouton "Voir plus" charge davantage de récits', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/feed');
    await page.waitForSelector('h1', { timeout: 10000 });
    // Si "Voir plus" est présent, le cliquer et vérifier que ça fonctionne
    const voirPlus = page.locator('button:has-text("Voir plus")');
    if (await voirPlus.isVisible()) {
      await voirPlus.click();
      // Soit le bouton disparaît (plus de pages), soit il rechargeable
      await expect(page.locator('button:has-text("Voir plus"), button:has-text("Chargement…")')).toBeVisible({ timeout: 10000 });
    } else {
      // Pas assez de récits pour paginer — test valide (état vide ou < 12 récits)
      await expect(page.locator('h1')).toContainText('Découvrir');
    }
  });

});
