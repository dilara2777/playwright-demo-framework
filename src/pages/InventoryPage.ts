import { type Locator, type Page } from '@playwright/test';

/** Product inventory page (shown after a successful login). */
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCartByName(productName: string): Promise<void> {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }

  async removeFromCartByName(productName: string): Promise<void> {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async productNames(): Promise<string[]> {
    // allTextContents() does NOT auto-wait: wait for the list to render first.
    await this.itemNames.first().waitFor({ state: 'visible' });
    return this.itemNames.allTextContents();
  }

  async productPrices(): Promise<number[]> {
    await this.itemPrices.first().waitFor({ state: 'visible' });
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async cartItemCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
    // Make sure navigation finished: the cart page reuses the same
    // item-name test ids as the inventory page, so reading too early
    // would return the inventory products instead of the cart contents.
    await this.page.waitForURL('**/cart.html');
  }
}
