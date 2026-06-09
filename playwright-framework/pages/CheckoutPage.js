// pages/CheckoutPage.js
import { BasePage } from './BasePage.js';
import { logger } from '../utils/logger.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    // Step 1: customer info
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2: overview
    this.finishButton = page.locator('#finish');
    this.summaryTotal = page.locator('.summary_total_label');

    // Step 3: confirmation
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('#back-to-products');
  }

  async fillCustomerInfo(firstName, lastName, postalCode) {
    logger.info(`Filling checkout info: ${firstName} ${lastName}, ${postalCode}`);
    await this.type(this.firstNameInput, firstName);
    await this.type(this.lastNameInput, lastName);
    await this.type(this.postalCodeInput, postalCode);
  }

  async continueToOverview() {
    await this.click(this.continueButton);
  }

  async finishOrder() {
    logger.info('Finishing order');
    await this.click(this.finishButton);
  }

  async getErrorMessage() {
    return this.getText(this.errorMessage);
  }

  async getConfirmationMessage() {
    return this.getText(this.completeHeader);
  }

  async isOrderComplete() {
    return this.isVisible(this.completeHeader);
  }

  async backToProducts() {
    await this.click(this.backHomeButton);
  }
}
