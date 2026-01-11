// @ts-check
import { test, expect } from '@playwright/test';

test('app renders login page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('textbox', {name: 'username'})).toBeVisible();
  await expect(page.getByRole('textbox', {name: 'password'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Sign in'})).toBeVisible();
});


