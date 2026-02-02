import { BasePage } from "./base.page";

/**
 * Login Page - Example page object
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.baseUrl = process.env.BASE_URL;

    // Selectors
    this.usernameInput = '#Email, input[name="Email"]';
    this.passwordInput = '#Password, input[name="Password"]';
    this.loginButton = 'button:has-text("Log in"), input[type="submit"]';
    this.errorMessage = ".text-danger, .validation-summary-errors";
    this.forgotPasswordLink = 'a:has-text("Forgot your password?")';
  }

  async navigate() {
    await this.page.goto("https://demo.simplcommerce.com/login");
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
