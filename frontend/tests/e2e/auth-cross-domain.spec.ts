import { expect, test, type Page } from "@playwright/test";

const email = process.env.PLAYWRIGHT_TEST_EMAIL;
const password = process.env.PLAYWRIGHT_TEST_PASSWORD;
const signupEmailTemplate = process.env.PLAYWRIGHT_SIGNUP_EMAIL;
const signupPassword = process.env.PLAYWRIGHT_SIGNUP_PASSWORD;
const expectCrossDomain = (process.env.PLAYWRIGHT_EXPECT_CROSS_DOMAIN ?? "true") === "true";
const backendOrigin = process.env.PLAYWRIGHT_BACKEND_ORIGIN;

async function login(page: Page) {
  test.skip(!email || !password, "Set PLAYWRIGHT_TEST_EMAIL and PLAYWRIGHT_TEST_PASSWORD to run auth tests.");
  await page.goto("/login");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Mot de passe").fill(password!);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL(/\/app\/discover/, { timeout: 15000 });
}

test.describe("Auth cross-domain", () => {
  test("PW-01 unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/app/discover");
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  });

  test("PW-02 login allows protected navigation", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: "Découvrir des vies" })).toBeVisible();
  });

  test("PW-03 session persists on refresh", async ({ page }) => {
    await login(page);
    await page.reload();
    await page.waitForURL(/\/app\/discover/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Découvrir des vies" })).toBeVisible();
  });

  test("PW-04 logout blocks protected routes", async ({ page }) => {
    await login(page);
    await page.goto("/app/profile");
    await page.getByRole("button", { name: "Déconnexion" }).click();
    await page.waitForURL(/\/login/, { timeout: 15000 });

    await page.goto("/app/discover");
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  });

  test("PW-05 authenticated save action has no 401 and can be cross-domain", async ({ page, baseURL }) => {
    await login(page);
    await page.goto("/app/discover");

    await page.locator('a[href^="/app/stories/"]').first().click();
    await page.waitForURL(/\/app\/stories\//, { timeout: 15000 });

    const saveResponsePromise = page.waitForResponse((response) => {
      return response.url().includes("/api/stories/") && response.url().includes("/save") && [200, 204].includes(response.status());
    }, { timeout: 15000 });

    const firstPossible401: number[] = [];
    page.on("response", (response) => {
      if (response.url().includes("/api/") && response.status() === 401) {
        firstPossible401.push(401);
      }
    });

    const saveButton = page.getByRole("button", { name: /Sauvegarder|Retirer de mes sauvegardes/ });
    await saveButton.click();

    const saveResponse = await saveResponsePromise;
    expect(firstPossible401.length).toBe(0);

    if (expectCrossDomain && baseURL) {
      const frontendOrigin = new URL(baseURL).origin;
      const saveOrigin = new URL(saveResponse.url()).origin;
      if (backendOrigin) {
        expect(saveOrigin).toBe(backendOrigin);
      } else {
        expect(saveOrigin).not.toBe(frontendOrigin);
      }
    }
  });

  test("PW-06 invalid session cookie eventually redirects to login", async ({ page, context, baseURL }) => {
    await login(page);
    expect(baseURL).toBeDefined();

    const frontendUrl = new URL(baseURL!);
    await context.addCookies([
      {
        name: "heritage_token",
        value: "invalid-token",
        domain: frontendUrl.hostname,
        path: "/",
        httpOnly: true,
        secure: frontendUrl.protocol === "https:",
        sameSite: "Lax"
      }
    ]);

    await page.goto("/app/discover");
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  });

  test("PW-07 optional signup flow", async ({ page }) => {
    test.skip(!signupEmailTemplate || !signupPassword, "Set PLAYWRIGHT_SIGNUP_EMAIL and PLAYWRIGHT_SIGNUP_PASSWORD for signup test.");

    const signupEmail = signupEmailTemplate!.replace("{timestamp}", Date.now().toString());

    await page.goto("/signup");
    await page.getByLabel("Nom complet").fill("Playwright Signup User");
    await page.getByLabel("Email").fill(signupEmail);
    await page.getByLabel("Mot de passe").fill(signupPassword!);
    await page.getByLabel("Confirmer").fill(signupPassword!);
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await page.waitForURL(/\/app\/discover/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Découvrir des vies" })).toBeVisible();
  });
});
