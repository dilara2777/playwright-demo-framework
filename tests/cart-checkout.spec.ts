import { test, expect } from '../src/fixtures/test-fixtures';
import { checkoutInfo } from '../src/data/users';

test.describe('Cart and checkout', () => {
  test('full checkout flow completes an order', async ({
    loggedIn,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await loggedIn.addToCartByName('Sauce Labs Backpack');
    await loggedIn.addToCartByName('Sauce Labs Bolt T-Shirt');
    await loggedIn.openCart();

    // Web-first assertion: toHaveText auto-waits for the cart to render.
    await expect(cartPage.cartItems).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bolt T-Shirt',
    ]);
    await expect(page).toHaveURL(/cart\.html/);

    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation(checkoutInfo.valid);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await expect(checkoutPage.itemTotal).toContainText('Item total: $');
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout without a first name shows a validation error', async ({
    loggedIn,
    cartPage,
    checkoutPage,
  }) => {
    await loggedIn.addToCartByName('Sauce Labs Onesie');
    await loggedIn.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(checkoutInfo.missingFirstName);

    await expect(checkoutPage.errorMessage).toBeVisible();
    expect(await checkoutPage.errorText()).toContain('Error: First Name is required');
  });

  test('removing an item from the cart leaves it empty', async ({
    loggedIn,
    cartPage,
  }) => {
    await loggedIn.addToCartByName('Sauce Labs Fleece Jacket');
    await loggedIn.openCart();
    // Web-first assertion: toHaveCount auto-waits instead of reading the
    // count at whatever instant the page happens to be in.
    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.removeItemByName('Sauce Labs Fleece Jacket');
    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
