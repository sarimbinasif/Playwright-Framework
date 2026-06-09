import { BasePage } from './BasePage.js';
import { logger } from '../utils/logger.js';

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async isLoaded() {
    return this.isVisible(this.pageTitle);
  }

  async getItemsCount() {
    return this.inventoryItems.count();
  }

  async addItemToCart(itemName) {
    logger.info(`Adding item to cart: ${itemName}`);
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button:has-text("Add to cart")').click();
  }

  async removeItemFromCart(itemName) {
    logger.info(`Removing item from cart: ${itemName}`);
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button:has-text("Remove")').click();
  }

  async getCartCount() {
    if (!(await this.isVisible(this.cartBadge))) return 0;
    return parseInt(await this.getText(this.cartBadge), 10);
  }

  async openCart() {
    await this.click(this.cartIcon);
  }

  async sortBy(option) {
    logger.info(`Sorting items by: ${option}`);
    await this.sortDropdown.selectOption(option);
  }

  async logout() {
    logger.info('Logging out');
    await this.click(this.menuButton);
    await this.click(this.logoutLink);
  }
}
