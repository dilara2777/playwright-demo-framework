import { test, expect } from '../src/fixtures/test-fixtures';

test.describe('Inventory', () => {
  test('products are listed and sorting A to Z works', async ({ loggedIn }) => {
    const names = await loggedIn.productNames();

    expect(names.length).toBeGreaterThan(0);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sorting by price low to high orders products ascending', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');

    const prices = await loggedIn.productPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('adding products updates the cart badge', { tag: '@smoke' }, async ({ loggedIn }) => {
    expect(await loggedIn.cartItemCount()).toBe(0);

    await loggedIn.addToCartByName('Sauce Labs Backpack');
    await loggedIn.addToCartByName('Sauce Labs Bike Light');

    expect(await loggedIn.cartItemCount()).toBe(2);
  });

  test('removing a product updates the cart badge back', async ({ loggedIn }) => {
    await loggedIn.addToCartByName('Sauce Labs Backpack');
    expect(await loggedIn.cartItemCount()).toBe(1);

    await loggedIn.removeFromCartByName('Sauce Labs Backpack');
    expect(await loggedIn.cartItemCount()).toBe(0);
  });
});
