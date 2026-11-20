import { test, expect } from '../src/fixtures/test-fixtures';
import { users, DEMO_PASSWORD } from '../src/data/users';

test.describe('Login', () => {
  test(
    'valid credentials open the inventory page',
    { tag: '@smoke' },
    async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(users.standard);

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('.title')).toHaveText('Products');
    },
  );

  test('locked-out user sees an error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut);

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.errorText()).toContain('Sorry, this user has been locked out.');
  });

  test('invalid password shows an error and stays on the login page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.loginAs(users.standard.username, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.errorText()).toContain(
      'Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('empty credentials show the username-required error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs('', DEMO_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.errorText()).toContain('Username is required');
  });
});
