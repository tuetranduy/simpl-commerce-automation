/**
 * Header Component - Common header elements across all pages
 */
export class Header {
  constructor(page) {
    this.page = page;
    this.logger = console;

    // Logo & Branding
    this.logo = '.logo a, .site-logo a, .header-logo a';
    this.siteName = '.site-name, .header-logo';

    // User account
    this.accountLink = 'a[href="/login"], a:has-text("Log in")';
    this.registerLink = 'a[href="/register"], a:has-text("Register")';
    this.userAccount = '.user-account, .account-menu';

    // Navigation
    this.mainNav = '.navbar, .main-nav';
    this.categoryLinks = '.nav-link, .category-link';

    // Search
    this.searchInput = '#Query, input[name="Query"], .search-input';
    this.searchButton = '.search-btn, button[type="submit"]';

    // Cart
    this.cartBtn = '.cart-btn, .cart-icon, .shopping-cart';
    this.cartLink = 'a[href*="cart"], .cart-btn';
  }

  async clickLogo() {
    await this.page.click(this.logo).catch(() => {});
  }

  async clickLogin() {
    await this.page.click(this.accountLink).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async clickRegister() {
    await this.page.click(this.registerLink).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async clickCart() {
    await this.page.click(this.cartLink).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async search(keyword) {
    const input = this.page.locator(this.searchInput).first();
    if (await input.isVisible()) {
      await input.fill(keyword);
      await this.page.click(this.searchButton).catch(async () => {
        await this.page.keyboard.press('Enter');
      });
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async getCartCount() {
    const countElement = this.page.locator('.badge-open, .cart-badge, .badge').first();
    if (await countElement.isVisible()) {
      const text = await countElement.textContent();
      const match = text?.match(/\d+/);
      return match ? match[0] : '0';
    }
    return '0';
  }

  async isLoggedIn() {
    const userMenu = this.page.locator('.user-menu, .logged-in');
    return await userMenu.isVisible().catch(() => false);
  }

  async isCartVisible() {
    return await this.page.locator(this.cartBtn).isVisible().catch(() => false);
  }

  async getPageUrl() {
    return this.page.url();
  }
}
