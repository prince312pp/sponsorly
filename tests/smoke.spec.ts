import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Sponsorly/);
});

test('login page has inputs', async ({ page }) => {
    await page.goto('/login.html');

    // Expect login form to be visible
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
});
