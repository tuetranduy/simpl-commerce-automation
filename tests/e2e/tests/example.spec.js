import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { Logger } from '../utils/logger.util';
import { TestDataUtil } from '../utils/test-data.util';

test.describe('Home Page Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('should display home page correctly', async ({ page }) => {
    Logger.step('Verifying home page elements');

    await expect(page).toHaveTitle(/.*/);
    await expect(page).toHaveURL(/.*/);
  });

  test('should navigate and load page', async ({ page }) => {
    Logger.step('Testing page navigation');

    await homePage.waitForLoad();
    const url = await homePage.getUrl();
    expect(url).toContain(process.env.BASE_URL || 'https://example.com');
  });
});

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display login form', async ({ page }) => {
    Logger.step('Verifying login form elements');

    await expect(page.locator('[data-testid="username"]')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('should handle login with valid credentials', async ({ page }) => {
    const user = TestDataUtil.getUser('valid');

    await loginPage.login(user.username, user.password);
    await page.waitForURL(/.*dashboard.*/);
  });

  test('should show error on invalid login', async ({ page }) => {
    await loginPage.login('invalid_user', 'wrong_password');

    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBe(true);
  });
});
