import { BasePage } from './base.page';

/**
 * Home Page - Example page object
 */
export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://example.com';

    // Selectors
    this.logo = '[data-testid="logo"]';
    this.searchInput = '[data-testid="search-input"]';
    this.searchButton = '[data-testid="search-button"]';
    this.navigationMenu = '[data-testid="nav-menu"]';
    this.heroSection = '[data-testid="hero-section"]';
  }

  async navigate() {
    await super.navigate('/');
  }

  async isLogoVisible() {
    return await this.isVisible(this.logo);
  }

  async search(keyword) {
    this.logger.step(`Searching for: ${keyword}`);
    await this.fill(this.searchInput, keyword);
    await this.click(this.searchButton);
    await this.waitForLoad();
  }

  async getHeroText() {
    return await this.getText(this.heroSection);
  }
}
