// pages/CartPage.js
import { BasePage } from './BasePage.js';
import { logger } from '../utils/logger.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
  }

  async isLoaded() {
    const title = await this.getText(this.pageTitle);
    return title.includes('Your Cart');
  }

  async getCartItemsCount() {
    return this.cartItems.count();
  }

  async getCartItemNames() {
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async removeItem(itemName) {
    logger.info(`Removing from cart: ${itemName}`);
    const item = this.cartItems.filter({ hasText: itemName });
    await item.locator('button:has-text("Remove")').click();
  }

  async proceedToCheckout() {
    logger.info('Proceeding to checkout');
    await this.click(this.checkoutButton);
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }
}
