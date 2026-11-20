import { type Locator, type Page } from '@playwright/test';

export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Checkout flow: information form -> overview -> confirmation. */
export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;
  readonly itemTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.errorMessage = page.getByTestId('error');
    this.completeHeader = page.getByTestId('complete-header');
    this.itemTotal = page.getByTestId('subtotal-label');
  }

  async fillInformation(details: CheckoutDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.postalCodeInput.fill(details.postalCode);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async errorText(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
