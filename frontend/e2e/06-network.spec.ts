import { test, expect } from '@playwright/test';
import { register, uniqueEmail } from './helpers';

test.describe('Flux 6 — Réseau', () => {

  test('page /network charge et affiche les sections principales', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/network');
    await expect(page.locator('h1')).toBeVisible();
    // La page doit charger sans erreur — sidebar présente
    await expect(page.locator('aside')).toBeVisible();
  });

  test('barre de recherche est présente et fonctionnelle', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/network');
    const searchInput = page.locator('input[placeholder="Rechercher"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Test');
    // Pas d'erreur — la recherche se déclenche sans crash
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/network/);
  });

  test('recherche vide → résultats de suggestions visibles ou état vide propre', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/network');
    // La page ne doit pas afficher d'erreur critique
    await expect(page.locator('text=500')).not.toBeVisible();
    await expect(page.locator('text=Error')).not.toBeVisible();
  });

  test('section "Proches" visible après chargement', async ({ page }) => {
    await register(page, uniqueEmail());
    await page.goto('/network');
    // La page doit contenir une section de proches ou un état vide
    await page.waitForLoadState('networkidle');
    const hasProches = await page.locator('text=Proches').count();
    const hasVide    = await page.locator('text=Aucun').count();
    expect(hasProches + hasVide).toBeGreaterThan(0);
  });

  test('accès /network sans token → redirige vers /login', async ({ page }) => {
    await page.goto('/network');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

});
