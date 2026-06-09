// utils/screenshotUtil.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { allure } from 'allure-playwright';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotDir = path.join(__dirname, '..', 'screenshots');

export class ScreenshotUtil {
  static ensureDirExists() {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  }

  /**
   * Capture a screenshot of the current page.
   * @param {import('@playwright/test').Page} page
   * @param {string} name - base name (no extension)
   * @returns {Promise<string>} absolute path
   */
  static async capture(page, name) {
    this.ensureDirExists();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(screenshotDir, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    logger.info(`Screenshot saved: ${filepath}`);
    return filepath;
  }

  /**
   * Capture screenshot specifically when a test fails.
   * @param {import('@playwright/test').Page} page
   * @param {string} testName
   */
  static async captureOnFailure(page, testName) {
    const safeName = testName.replace(/[^a-zA-Z0-9]/g, '_');
    return this.capture(page, `FAILED_${safeName}`);
  }

  /**
   * Attach a screenshot to the Allure report by name.
   * @param {import('@playwright/test').Page} page
   * @param {string} name - attachment label shown in Allure
   */
  static async attachToAllure(page, name) {
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await allure.attachment(name, screenshotBuffer, { contentType: 'image/png' });
    logger.info(`Screenshot attached to Allure: ${name}`);
  }

  /**
   * Capture + save to disk + attach to Allure report.
   * @param {import('@playwright/test').Page} page
   * @param {string} name - base name (no extension)
   */
  static async captureAndAttach(page, name) {
    const filepath = await this.capture(page, name);
    const buffer = fs.readFileSync(filepath);
    await allure.attachment(name, buffer, { contentType: 'image/png' });
    logger.info(`Screenshot attached to Allure: ${name}`);
    return filepath;
  }
}