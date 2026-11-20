import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../data/users';

type DemoUserKey = keyof typeof users;

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /**
   * Which demo user the `loggedIn` fixture signs in as.
   * Override per file with `test.use({ currentUser: 'problem' })`.
   * Only users who can log in work here (not `lockedOut`).
   */
  currentUser: DemoUserKey;
  /** Logs in as `currentUser` and lands on the inventory page. */
  loggedIn: InventoryPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  currentUser: ['standard', { option: true }],
  loggedIn: async ({ page, currentUser }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users[currentUser]);
    // Wait for the inventory page to actually render before handing the
    // page over: reads like allTextContents() do NOT auto-wait in Playwright.
    await page.waitForURL('**/inventory.html');
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
