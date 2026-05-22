import { test, expect } from '@playwright/test';
import { register, login, uniqueEmail, TEST_PASSWORD } from './helpers';

test.describe('Flux 1 — Authentification', () => {

  test('inscription → redirige vers /feed', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    await expect(page).toHaveURL(/\/feed/);
    // La sidebar doit être visible
    await expect(page.locator('aside')).toBeVisible();
  });

  test('connexion avec compte existant → redirige vers /feed', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    // Se déconnecter
    await page.click('button:has-text("Se déconnecter")');
    await page.waitForURL('**/login');
    // Se reconnecter
    await login(page, email);
    await expect(page).toHaveURL(/\/feed/);
  });

  test('mauvais mot de passe → message d\'erreur', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    await page.click('button:has-text("Se déconnecter")');
    await page.waitForURL('**/login');

    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'MauvaisMotDePasse!');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Email ou mot de passe incorrect')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('accès /feed sans token → redirige vers /login', async ({ page }) => {
    await page.goto('/feed');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('accès /profile sans token → redirige vers /login', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('accès /stories/new sans token → redirige vers /login', async ({ page }) => {
    await page.goto('/stories/new');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('déconnexion → redirige vers /login', async ({ page }) => {
    const email = uniqueEmail();
    await register(page, email);
    await page.click('button:has-text("Se déconnecter")');
    await expect(page).toHaveURL(/\/login/);
  });

});
