/**
 * Home Page - Main landing page of SimplCommerce
 */
export class HomePage {
  constructor(page) {
    this.page = page;
    this.logger = console;

    // Header locators
    this.logo = '.logo a, .site-logo';
    this.searchBox = '.search-box, .search-input';
    this.searchInput = '#Query, input[name="Query"]';
    this.searchButton = '.search-btn, button[type="submit"]';
    this.cartBtn = '.cart-btn, .cart-icon';
    this.cartBadge = '.cart-badge, .badge-open';

    // Category navigation
    this.categoryNav = '#navbarMain, .navbar-nav';
    this.phonesLink = 'a:has-text("Phones")';
    this.tabletsLink = 'a:has-text("Tablets")';
    this.computersLink = 'a:has-text("Computers")';
    this.accessoriesLink = 'a:has-text("Accessories")';

    // Product grid - using multiple selectors
    this.productContainer = '.product-list, .products-container, .product-grid';
    this.productItem = '.product-item, .product-item-inner, .product-box';
    this.productImage = '.product-img, .product-image img';
    this.productTitle = '.product-title, .product-name, h4 a, h3 a';
    this.productPrice = '.product-price, .price, .product-item-price .price-outer .amount';
    this.addToCartBtn = '.add-to-cart, .btn-add-cart, button:has-text("Add to cart")';

    // Sections
    this.heroSection = '.hero, .banner-section';
    this.featuredSection = '.featured-products, .product-tabs';
    this.footer = 'footer';
  }

  async navigate() {
    await this.page.goto('https://demo.simplcommerce.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    // Wait for content to load
    await this.page.waitForTimeout(2000);
  }

  async getTitle() {
    return await this.page.title();
  }

  async isLogoVisible() {
    return await this.page.isVisible(this.logo);
  }

  async clickCategory(category) {
    const categoryMap = {
      'phones': this.phonesLink,
      'tablets': this.tabletsLink,
      'computers': this.computersLink,
      'accessories': this.accessoriesLink
    };
    const selector = categoryMap[category.toLowerCase()];
    if (selector) {
      await this.page.click(selector, { timeout: 5000 }).catch(() => {});
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async getCartBadge() {
    if (await this.page.isVisible(this.cartBadge)) {
      return await this.page.textContent(this.cartBadge);
    }
    return '0';
  }

  async getProducts() {
    const products = [];

    // Try multiple selectors
    const productSelectors = [
      '.product-item',
      '.product-item-inner',
      '.product-box',
      '.product-box-inner',
      '[class*="product"] [class*="item"]'
    ];

    for (const selector of productSelectors) {
      const items = await this.page.locator(selector).all();
      if (items.length > 0) {
        for (const item of items) {
          try {
            const titleEl = item.locator('h4 a, h3 a, .product-title a, .name a').first();
            const title = await titleEl.textContent().catch(() => '');

            const priceEl = item.locator('.price-outer .amount, .price, .product-price').first();
            const price = await priceEl.textContent().catch(() => '');

            const addBtn = item.locator('.add-to-cart, button:has-text("Add")').first();
            const hasAddToCart = await addBtn.isVisible().catch(() => false);

            if (title || price) {
              products.push({
                name: title?.trim() || 'Unknown',
                price: price?.trim() || 'N/A',
                hasAddToCart
              });
            }
          } catch (e) {
            continue;
          }
        }
        break;
      }
    }

    return products;
  }

  async clickProduct(productName) {
    // Try to find product by name in various ways
    const productLink = this.page.locator(`h4:has-text("${productName}") a, h3:has-text("${productName}") a, a:has-text("${productName}")`);
    const count = await productLink.count();
    if (count > 0) {
      await productLink.first().click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async search(keyword) {
    const input = this.page.locator(this.searchInput);
    await input.fill(keyword);
    await this.page.click(this.searchButton).catch(async () => {
      await this.page.keyboard.press('Enter');
    });
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async isPageLoaded() {
    // Check if main elements are visible
    const hasContent = await this.page.locator('.container, main, .main-content').first().isVisible().catch(() => false);
    return hasContent;
  }
}
