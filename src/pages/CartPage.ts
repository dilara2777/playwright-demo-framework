import { type Locator, type Page } from '@playwright/test';

/** Shopping cart page. */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async itemNames(): Promise<string[]> {
    // allTextContents() does NOT auto-wait: wait for the list to render first.
    await this.cartItems.first().waitFor({ state: 'visible' });
    return this.cartItems.allTextContents();
  }

  async itemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItemByName(productName: string): Promise<void> {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
