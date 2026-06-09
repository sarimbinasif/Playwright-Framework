import { logger } from './logger.js';

export class WaitUtils {
  /**
   * Wait for a locator to be visible.
   * @param {import('@playwright/test').Locator} locator
   * @param {number} timeout
   */
  static async waitForVisible(locator, timeout = 10000) {
    logger.info(`Waiting for element to be visible (timeout: ${timeout}ms)`);
    await locator.waitFor({ state: 'visible', timeout });
  }


   // Wait for a locator to be hidden.  
  static async waitForHidden(locator, timeout = 10000) {
    logger.info(`Waiting for element to be hidden (timeout: ${timeout}ms)`);
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * // Wait until the page reaches a load state.
   * @param {import('@playwright/test').Page} page
   * @param {'load'|'domcontentloaded'|'networkidle'} state
   */
  static async waitForPageLoad(page, state = 'networkidle') {
    logger.info(`Waiting for page load state: ${state}`);
    await page.waitForLoadState(state);
  }

  
   // A static, predictable pause. Use sparingly — prefer explicit waits.
   
  static async sleep(ms) {
    logger.warn(`Static sleep used: ${ms}ms (avoid in production tests)`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait until a URL matches a pattern.
   */
  static async waitForURL(page, urlPattern, timeout = 10000) {
    logger.info(`Waiting for URL to match: ${urlPattern}`);
    await page.waitForURL(urlPattern, { timeout });
  }
}
