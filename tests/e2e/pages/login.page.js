import { BasePage } from './base.page';

/**
 * Login Page - Example page object
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://example.com';

    // Selectors
    this.usernameInput = '[data-testid="username"]';
    this.passwordInput = '[data-testid="password"]';
    this.loginButton = '[data-testid="login-button"]';
    this.errorMessage = '[data-testid="error-message"]';
    this.forgotPasswordLink = '[data-testid="forgot-password"]';
  }

  async navigate() {
    await super.navigate('/login');
  }

  async login(username, password) {
    this.logger.step(`Logging in with user: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForLoad();
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  async isErrorVisible() {
    return await this.isVisible(this.errorMessage);
  }
}
