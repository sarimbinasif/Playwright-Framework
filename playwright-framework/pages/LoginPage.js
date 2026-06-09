// pages/LoginPage.js
import { BasePage } from './BasePage.js';
import { logger } from '../utils/logger.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.navigate('/');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible() {
    return this.isVisible(this.errorMessage);
  }
}
