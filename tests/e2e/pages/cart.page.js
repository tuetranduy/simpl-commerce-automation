/**
 * Cart Page - Shopping cart functionality
 */
export class CartPage {
  constructor(page) {
    this.page = page;
    this.logger = console;

    // Cart page
    this.pageTitle = '.cart-page h1, .shopping-cart h1, h1:has-text("Cart")';
    this.cartItems = '.cart-item, .cart-line, .shopping-cart-item';
    this.cartItemName = '.cart-item-name, .product-name, .name';
    this.cartItemPrice = '.cart-item-price, .unit-price, .price';
    this.cartItemQty = '.cart-item-qty input, .quantity input, input[name*="quantity"]';
    this.cartItemTotal = '.cart-item-total, .line-total, .total';

    // Cart totals
    this.subtotal = '.cart-subtotal, .subtotal-outer .amount, .subtotal';
    this.tax = '.cart-tax, .tax-outer .amount';
    this.shipping = '.cart-shipping, .shipping-outer .amount';
    this.total = '.cart-total, .total-outer .amount, .grand-total';
    this.itemCount = '.cart-item-count, .cart-count';

    // Actions
    this.checkoutBtn = 'a:has-text("Checkout"), button:has-text("Checkout"), .checkout-link';
    this.continueShoppingBtn = 'a:has-text("Continue Shopping"), .continue-shopping';
    this.updateCartBtn = 'button:has-text("Update Cart"), .update-cart';
    this.removeItemBtn = '.remove-item, .btn-remove, .remove, a[title*="Remove"]';

    // Empty cart
    this.emptyCartMessage = '.empty-cart, .cart-empty, .no-items';
  }

  async navigate() {
    await this.page.goto('https://demo.simplcommerce.com/cart', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    await this.page.waitForTimeout(1000);
  }

  async getItemCount() {
    try {
      // Try to get count from header badge
      const headerBadge = this.page.locator('.badge-sea, .cart-badge .badge, .badge-open .badge').first();
      const badgeVisible = await headerBadge.isVisible({ timeout: 2000 }).catch(() => false);
      if (badgeVisible) {
        const text = await headerBadge.textContent();
        const match = text?.match(/\d+/);
        if (match) return parseInt(match[0]);
      }

      // Try to count cart rows
      const cartRows = this.page.locator('tbody tr:has-text("$")').all();
      if ((await cartRows.length) > 0) {
        return await cartRows.length;
      }

      // Check for empty cart message
      const emptyMsg = await this.page.locator('text=There are no items in this cart').isVisible().catch(() => false);
      if (emptyMsg) return 0;
    } catch {
      // Ignore errors
    }
    return 0;
  }

  async getCartItems() {
    const items = [];
    try {
      // Check for empty cart message first
      const emptyMsg = await this.page.locator('text=There are no items in this cart').isVisible().catch(() => false);
      if (emptyMsg) return items;

      // Get item rows from table
      const itemRows = await this.page.locator('tbody tr:has-text("$")').all();
      if (itemRows.length === 0) return items;

      for (const row of itemRows) {
        try {
          // Get product name from heading
          const nameEl = row.locator('h6, .product-name, .name').first();
          const name = await nameEl.textContent().catch(() => '');

          // Get price
          const priceEl = row.locator('td:has-text("$")').first();
          const price = await priceEl.textContent().catch(() => '');

          // Get quantity from input
          const qtyEl = row.locator('input[type="number"]').first();
          const qty = await qtyEl.inputValue().catch(() => '1');

          if (name || price) {
            items.push({
              name: name?.trim() || 'Unknown',
              price: price?.trim() || 'N/A',
              quantity: qty,
              total: price?.trim() || 'N/A'
            });
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      // Ignore errors
    }
    return items;
  }

  async getSubtotal() {
    try {
      // Try order summary table for subtotal
      const subtotalRow = this.page.locator('table:has-text("Order summary") td:has-text("Subtotal")').locator('xpath=..');
      if (await subtotalRow.isVisible().catch(() => false)) {
        const cells = await subtotalRow.locator('td').all();
        if (cells.length >= 2) {
          return await cells[1].textContent();
        }
      }

      // Fallback to original selectors
      const subtotalElement = this.page.locator(this.subtotal).first();
      const isVisible = await subtotalElement.isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        return await subtotalElement.textContent();
      }
    } catch {
      // Ignore errors
    }
    return '';
  }

  async getTotal() {
    try {
      const totalElement = this.page.locator(this.total).first();
      const isVisible = await totalElement.isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        return await totalElement.textContent();
      }
    } catch {
      // Ignore errors
    }
    return '';
  }

  async updateQuantity(productName, quantity) {
    const row = this.page.locator(`.cart-item:has-text("${productName}")`);
    const qtyInput = row.locator('input[type="number"]');
    if (await qtyInput.isVisible()) {
      await qtyInput.fill(String(quantity));
    }
  }

  async removeItem(productName) {
    const row = this.page.locator(`.cart-item:has-text("${productName}")`);
    const removeBtn = row.locator('.remove, .btn-remove, button').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  async clickCheckout() {
    const btn = this.page.locator(this.checkoutBtn).first();
    if (await btn.isVisible()) {
      await btn.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async clickContinueShopping() {
    const btn = this.page.locator(this.continueShoppingBtn).first();
    if (await btn.isVisible()) {
      await btn.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  async isEmpty() {
    return await this.page.locator(this.emptyCartMessage).first().isVisible().catch(() => false);
  }

  async getEmptyMessage() {
    const emptyElement = this.page.locator(this.emptyCartMessage).first();
    if (await emptyElement.isVisible()) {
      return await emptyElement.textContent();
    }
    return '';
  }
}
