import { test, expect } from '@playwright/test';

test.describe('Auth login', () => {
  test('successful login and redirect to home', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/имя пользователя/i).fill('admin');
    await page.getByLabel(/пароль/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();

    await expect(page).toHaveURL('/posts');
  });

  test('redirect to from path after login when coming from protected route', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel(/имя пользователя/i).fill('admin');
    await page.getByLabel(/пароль/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();

    await expect(page).toHaveURL('/profile');
  });
});

test.describe('Session hydration', () => {
  test('with valid token, app loads without redirect to login', async ({ page, context }) => {
    await page.goto('/login');
    await page.getByLabel(/имя пользователя/i).fill('admin');
    await page.getByLabel(/пароль/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();
    await expect(page).toHaveURL('/posts');

    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();

    await context.addCookies([]);
    await page.goto('/');
    await expect(page).toHaveURL('/posts');
  });

  test('with valid token, protected page loads directly', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/имя пользователя/i).fill('user');
    await page.getByLabel(/пароль/i).fill('user123');
    await page.getByRole('button', { name: /войти/i }).click();
    await expect(page).toHaveURL('/posts');

    await page.goto('/profile');
    await expect(page).toHaveURL('/profile');
  });

  test('without token, protected page redirects to login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Header and user dropdown', () => {
  test('when not authenticated, header shows Войти button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /войти/i })).toBeVisible();
  });

  test('when authenticated, avatar is visible and dropdown shows logout', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/имя пользователя/i).fill('admin');
    await page.getByLabel(/пароль/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();
    await expect(page).toHaveURL('/posts');

    await expect(page.getByRole('button', { name: /войти/i })).not.toBeVisible();
    const avatar = page.locator('.ant-avatar').first();
    await expect(avatar).toBeVisible();
    await avatar.click();
    await expect(page.getByText(/выйти из аккаунта/i)).toBeVisible();
    await expect(page).toHaveURL('/posts');
  });

  test('logout clears session and redirects to home', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/имя пользователя/i).fill('admin');
    await page.getByLabel(/пароль/i).fill('admin123');
    await page.getByRole('button', { name: /войти/i }).click();
    await expect(page).toHaveURL('/posts');

    const avatar = page.locator('.ant-avatar').first();
    await avatar.click();
    await page.getByText(/выйти из аккаунта/i).click();

    await expect(page).toHaveURL('/posts');
    await page.waitForFunction(() => !localStorage.getItem('access_token'));

    await page.waitForFunction(() => !localStorage.getItem('access_token'));

    await expect(page.getByRole('button', { name: /войти/i })).toBeVisible();
  });
});
