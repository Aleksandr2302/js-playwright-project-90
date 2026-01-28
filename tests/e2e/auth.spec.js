// @ts-check
import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import LogoutPage from '../../pages/logoutPage';
import {loginData} from '../../fixtures/tasks';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginData.username, loginData.password);
})

test.describe('Authentication', () => {

test('user can login', async ({ page }) => {
  await expect(page.getByRole('heading', {name: 'Welcome to the administration', level:6} )).toBeVisible();
});

test('user can logout', async ({ page }) => {
  const logoutPage = new LogoutPage(page);
  await logoutPage.goOut();
  await expect(page.getByRole('button', {name:'Sign in'})).toBeVisible();
});

});
