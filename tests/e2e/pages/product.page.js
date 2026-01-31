/**
 * Product Page - Individual product details page
 */
export class ProductPage {
  constructor(page) {
    this.page = page;
    this.logger = console;

    // Product details
    this.productName = 'h1, .product-detail-name, .product-name';
    this.productPrice = '.product-detail-price .amount, .product-price, .price';
    this.productDescription = '.product-detail-description, .product-description, .description';
    this.productImage = '.product-image img, .product-detail-image img';

    // Add to cart
    this.addToCartBtn = '.add-to-cart, button:has-text("Add to cart"), .btn-add-cart';
    this.quantityInput = 'input#Quantity, input[name="quantity"], .quantity input';
    this.increaseQty = '.quantity button:has-text("+"), button:has-text("+")';
    this.decreaseQty = '.quantity button:has-text("-"), button:has-text("-")';

    // Breadcrumb
    this.breadcrumb = '.breadcrumb, .breadcrumbs';

    // Stock status
    this.stockStatus = '.stock-status, .in-stock, .availability';

    // Category breadcrumb
    this.categoryLinks = '.breadcrumb a, .breadcrumbs a';
  }

  async getProductName() {
    const nameElement = this.page.locator(this.productName).first();
    if (await nameElement.isVisible()) {
      return await nameElement.textContent();
    }
    return '';
  }

  async getProductPrice() {
    const priceElement = this.page.locator(this.productPrice).first();
    if (await priceElement.isVisible()) {
      return await priceElement.textContent();
    }
    return '';
  }

  async getProductDescription() {
    const descElement = this.page.locator(this.productDescription).first();
    if (await descElement.isVisible()) {
      return await descElement.textContent();
    }
    return '';
  }

  async setQuantity(qty) {
    const qtyInput = this.page.locator(this.quantityInput);
    if (await qtyInput.isVisible()) {
      await qtyInput.fill(String(qty));
    }
  }

  async increaseQuantity() {
    const btn = this.page.locator(this.increaseQty).first();
    if (await btn.isVisible()) {
      await btn.click();
    }
  }

  async decreaseQuantity() {
    const btn = this.page.locator(this.decreaseQty).first();
    if (await btn.isVisible()) {
      await btn.click();
    }
  }

  async clickAddToCart() {
    const btn = this.page.locator(this.addToCartBtn).first();
    if (await btn.isVisible()) {
      await btn.click();
      await this.page.waitForTimeout(500);
    }
  }

  async isAddToCartVisible() {
    return await this.page.locator(this.addToCartBtn).first().isVisible();
  }

  async getStockStatus() {
    const stockElement = this.page.locator(this.stockStatus).first();
    if (await stockElement.isVisible()) {
      return await stockElement.textContent();
    }
    return '';
  }

  async goBack() {
    await this.page.goBack();
  }
}
