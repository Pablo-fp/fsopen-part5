const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('login');
    await expect(locator).toBeVisible();
  });
});

//await page.getByRole('button', { name: 'login' }).click();
