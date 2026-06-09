// fixtures/baseFixture.js
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { logger } from '../utils/logger.js';
import { ScreenshotUtil } from '../utils/screenshotUtil.js';

/**
 * Extends Playwright's `test` so every spec automatically gets fresh
 * page-object instances and hook-based logging + screenshot-on-failure.
 */
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

// beforeEach: log test start
test.beforeEach(async ({}, testInfo) => {
  logger.info(`=== START: ${testInfo.title} ===`);
});

// afterEach: capture screenshot on failure + log result
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    logger.error(`FAILED: ${testInfo.title} (${testInfo.status})`);
    try {
      const screenshotPath = await ScreenshotUtil.captureOnFailure(
        page,
        testInfo.title
      );
      await testInfo.attach('failure-screenshot', {
        path: screenshotPath,
        contentType: 'image/png',
      });
    } catch (err) {
      logger.error(`Screenshot capture failed: ${err.message}`);
    }
  } else {
    logger.info(`PASSED: ${testInfo.title}`);
  }
  logger.info(`=== END: ${testInfo.title} ===\n`);
});

export { expect };
