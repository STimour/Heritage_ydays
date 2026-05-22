import { Page } from '@playwright/test';

// Unique email per test run to avoid conflicts
export function uniqueEmail(): string {
  return `test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@heritage.test`;
}

export const TEST_PASSWORD = 'Test1234!';

export async function register(page: Page, email: string): Promise<void> {
  await page.goto('/signup');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[id="firstName"]', 'Test');
  await page.fill('input[id="lastName"]', 'User');
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', TEST_PASSWORD);
  // Click the checkbox span directly to avoid navigating to /terms or /privacy links inside the button
  await page.locator('button[type="button"]:has-text("J\'accepte") > span').first().click();
  await page.click('button[type="submit"]');
  await page.waitForURL('**/feed', { timeout: 15000 });
}

export async function login(page: Page, email: string): Promise<void> {
  await page.goto('/login');
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/feed', { timeout: 15000 });
}
