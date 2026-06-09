import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { logger } from '../utils/logger.js';
import { ScreenshotUtil } from '../utils/screenshotUtil.js';

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

  //runs around every test, attaches screenshot 
  autoScreenshot: [async ({ page }, use, testInfo) => {

    await use();

    // After test completes, attach screenshot
    try {
      const safeName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '_');

      if (testInfo.status !== testInfo.expectedStatus) {
        logger.error(`FAILED: ${testInfo.title} (${testInfo.status})`);
        const screenshotPath = await ScreenshotUtil.captureOnFailure(
          page,
          testInfo.title
        );
        await testInfo.attach(`FAILED_${safeName}`, {
          path: screenshotPath,
          contentType: 'image/png',
        });
      } else {
        const screenshotBuffer = await page.screenshot({ fullPage: true });
        await testInfo.attach(safeName, {
          body: screenshotBuffer,
          contentType: 'image/png',
        });
      }
    } catch (err) {
      logger.error(`Screenshot attach failed: ${err.message}`);
    }
  }, { auto: true }], //means it runs for every test automatically
});

test.beforeEach(async ({}, testInfo) => {
  logger.info(`=== START: ${testInfo.title} ===`);
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    logger.error(`FAILED: ${testInfo.title} (${testInfo.status})`);
  } else {
    logger.info(`PASSED: ${testInfo.title}`);
  }
  logger.info(`=== END: ${testInfo.title} ===\n`);
});

export { expect };