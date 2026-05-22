import { test, expect } from '@playwright/test';
import { register, uniqueEmail } from './helpers';

test.describe('Flux 7 — Paramètres', () => {

  test('page /settings charge la section profil', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/settings');
    // Le h2 identifie la section active (évite strict mode avec les autres "Mon profil" du menu)
    await expect(page.locator('h2').filter({ hasText: 'Mon profil' })).toBeVisible();
    await expect(page.locator('input[placeholder="Votre nom complet"]')).toBeVisible();
  });

  test('les trois sections de navigation sont présentes', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/settings');
    // Les boutons du menu latéral gauche des paramètres
    await expect(page.locator('button').filter({ hasText: 'Mon profil' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Sécurité' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Confidentialité' })).toBeVisible();
  });

  test('modifier le nom → toast de confirmation', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/settings');

    const nameInput = page.locator('input[placeholder="Votre nom complet"]');
    await nameInput.fill('Test Modifié');
    await page.click('button:has-text("Enregistrer les modifications")');

    await expect(page.locator('text=Profil mis à jour')).toBeVisible({ timeout: 10000 });
  });

  test('nom vide → message d\'erreur, pas de toast', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/settings');

    const nameInput = page.locator('input[placeholder="Votre nom complet"]');
    await nameInput.fill('');
    await page.click('button:has-text("Enregistrer les modifications")');

    await expect(page.locator('text=Le nom affiché est obligatoire')).toBeVisible();
    await expect(page.locator('text=Profil mis à jour')).not.toBeVisible();
  });

  test('modifier le pseudo → valeur persistée après rechargement', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/settings');

    const pseudoInput = page.locator('input[placeholder="mon_pseudo"]');
    await pseudoInput.fill('testpseudo_e2e');
    await page.click('button:has-text("Enregistrer les modifications")');
    await expect(page.locator('text=Profil mis à jour')).toBeVisible({ timeout: 10000 });

    // Recharger et vérifier
    await page.reload();
    await expect(page.locator('input[placeholder="mon_pseudo"]')).toHaveValue('testpseudo_e2e');
  });

  test('accès /settings sans token → redirige vers /login', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('navigation vers section Sécurité', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/settings');
    await page.locator('button').filter({ hasText: 'Sécurité' }).click();
    // Le h2 de la section Sécurité doit s'afficher
    await expect(page.locator('h2').filter({ hasText: 'Sécurité' })).toBeVisible();
  });

});
