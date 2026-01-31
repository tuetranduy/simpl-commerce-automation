import { Logger } from '../utils/logger.util';

/**
 * Base Page - Common functionality for all page objects
 */
export class BasePage {
  constructor(page) {
    this.page = page;
    this.logger = Logger;
  }

  async navigate(path = '/') {
    const url = `${this.baseUrl}${path}`;
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async getUrl() {
    return this.page.url();
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async click(selector, options = {}) {
    this.logger.info(`Clicking element: ${selector}`);
    await this.page.click(selector, options);
  }

  async fill(selector, value, options = {}) {
    this.logger.info(`Filling input: ${selector} = ${value}`);
    await this.page.fill(selector, value, options);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  async waitForSelector(selector, options = {}) {
    await this.page.waitForSelector(selector, options);
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
