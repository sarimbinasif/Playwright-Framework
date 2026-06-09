import { logger } from '../utils/logger.js';
import { WaitUtils } from '../utils/waitUtils.js';
import { ScreenshotUtil } from '../utils/screenshotUtil.js';

/**
 * BasePage - parent class for all Page Objects.
 * Houses common methods so individual pages stay focused on their unique elements.
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await WaitUtils.waitForPageLoad(this.page);
  }

  async getTitle() {
    const title = await this.page.title();
    logger.info(`Page title: ${title}`);
    return title;
  }

  async getCurrentURL() {
    return this.page.url();
  }

  async click(locator) {
    await WaitUtils.waitForVisible(locator);
    await locator.click();
  }

  async type(locator, text) {
    await WaitUtils.waitForVisible(locator);
    await locator.fill(text);
  }

  async getText(locator) {
    await WaitUtils.waitForVisible(locator);
    return locator.textContent();
  }

  async isVisible(locator) {
    try {
      await WaitUtils.waitForVisible(locator, 5000);
      return true;
    } catch {
      return false;
    }
  }

  async takeScreenshot(name) {
    return ScreenshotUtil.capture(this.page, name);
  }

  /**
   * Handle native browser alerts/dialogs.
   * @param {'accept'|'dismiss'} action
   * @param {string} [promptText] - text to enter for prompt dialogs
   */
  async handleAlert(action = 'accept', promptText = '') {
    this.page.once('dialog', async (dialog) => {
      logger.info(`Dialog appeared: "${dialog.message()}" — ${action}ing`);
      if (action === 'accept') await dialog.accept(promptText);
      else await dialog.dismiss();
    });
  }

  async reload() {
    logger.info('Reloading page');
    await this.page.reload();
    await WaitUtils.waitForPageLoad(this.page);
  }
}
