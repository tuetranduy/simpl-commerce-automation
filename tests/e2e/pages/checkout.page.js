/**
 * Checkout Page - Checkout process functionality
 */
export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.logger = console;

    // Checkout page sections
    this.checkoutSection = '.checkout-page, .checkout-container';
    this.pageTitle = '.checkout-page h1, .checkout-container h1, h1:has-text("Checkout")';

    // Billing address section
    this.billingAddressSection = '.billing-address, .address-section';
    this.firstNameInput = '#BillingNewAddress_FirstName, input[name="FirstName"]';
    this.lastNameInput = '#BillingNewAddress_LastName, input[name="LastName"]';
    this.emailInput = '#BillingNewAddress_Email, input[name="Email"]';
    this.companyInput = '#BillingNewAddress_Company, input[name="Company"]';
    this.countrySelect = '#BillingNewAddress_CountryId, select[name="CountryId"]';
    this.stateSelect = '#BillingNewAddress_StateProvinceId, select[name="StateProvinceId"]';
    this.cityInput = '#BillingNewAddress_City, input[name="City"]';
    this.address1Input = '#BillingNewAddress_Address1, input[name="Address1"]';
    this.address2Input = '#BillingNewAddress_Address2, input[name="Address2"]';
    this.zipCodeInput = '#BillingNewAddress_ZipPostalCode, input[name="ZipPostalCode"]';
    this.phoneInput = '#BillingNewAddress_PhoneNumber, input[name="PhoneNumber"]';
    this.faxInput = '#BillingNewAddress_FaxNumber, input[name="FaxNumber"]';

    // Shipping address
    this.shipToSameAddress = '#ShipToSameAddress';
    this.shipToDifferentAddress = '#ShipToDifferentAddress';

    // Payment method section
    this.paymentMethodSection = '.payment-method, .payment-section';
    this.cashOnDelivery = '#paymentmethod_0, label:has-text("Cash on Delivery")';
    this.checkPayment = '#paymentmethod_1, label:has-text("Check")';
    this.purchaseOrder = '#paymentmethod_2, label:has-text("Purchase Order")';
    this.creditCard = '#paymentmethod_3, label:has-text("Credit Card")';
    this.paypal = '#paymentmethod_4, label:has-text("PayPal")';

    // Payment info section (for credit card)
    this.cardholderName = '#CardholderName, input[name="CardholderName"]';
    this.cardNumber = '#CardNumber, input[name="CardNumber"]';
    this.cardCode = '#CardCode, input[name="CardCode"]';
    this.expireMonth = '#ExpireMonth, select[name="ExpireMonth"]';
    this.expireYear = '#ExpireYear, select[name="ExpireYear"]';

    // Order summary
    this.orderSummary = '.order-summary, .checkout-summary';
    this.orderTotal = '.order-total, .grand-total .amount';
    this.subtotal = '.subtotal .amount';
    this.tax = '.tax .amount';
    this.shipping = '.shipping .amount';

    // Checkout buttons
    this.continueButton = 'button:has-text("Continue"), .btn-continue';
    this.nextStepButton = 'button:has-text("Next"), .btn-next';
    this.confirmOrderButton = 'button:has-text("Confirm order"), .btn-confirm';
    this.placeOrderButton = 'button:has-text("Place order"), .btn-place-order';

    // Validation messages
    this.validationError = '.field-validation-error, .validation-summary-errors li, .alert-danger';
    this.errorMessage = '.error-message, .alert';

    // Order completion
    this.orderSuccess = '.order-completed, .success-page';
    this.orderNumber = '.order-number, .order-id';
    this.thankYouMessage = 'h1:has-text("Thank you"), .thank-you';

    // Progress indicator
    this.checkoutSteps = '.checkout-steps, .steps-indicator';
    this.stepBilling = '.step-billing, .step-1';
    this.stepShipping = '.step-shipping, .step-2';
    this.stepPayment = '.step-payment, .step-3';
    this.stepConfirm = '.step-confirm, .step-4';
  }

  async navigate() {
    await this.page.goto('https://demo.simplcommerce.com/checkout', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await this.page.waitForTimeout(2000);
  }

  async isCheckoutPage() {
    return await this.page.locator(this.checkoutSection).first().isVisible().catch(() => false) ||
           await this.page.locator(this.pageTitle).first().isVisible().catch(() => false);
  }

  // Billing address methods
  async fillBillingAddress(address) {
    if (address.firstName) {
      await this.page.fill(this.firstNameInput, address.firstName).catch(() => {});
    }
    if (address.lastName) {
      await this.page.fill(this.lastNameInput, address.lastName).catch(() => {});
    }
    if (address.email) {
      await this.page.fill(this.emailInput, address.email).catch(() => {});
    }
    if (address.company) {
      await this.page.fill(this.companyInput, address.company).catch(() => {});
    }
    if (address.country) {
      await this.selectOption(this.countrySelect, address.country).catch(() => {});
    }
    if (address.state) {
      await this.selectOption(this.stateSelect, address.state).catch(() => {});
    }
    if (address.city) {
      await this.page.fill(this.cityInput, address.city).catch(() => {});
    }
    if (address.address1) {
      await this.page.fill(this.address1Input, address.address1).catch(() => {});
    }
    if (address.address2) {
      await this.page.fill(this.address2Input, address.address2).catch(() => {});
    }
    if (address.zipCode) {
      await this.page.fill(this.zipCodeInput, address.zipCode).catch(() => {});
    }
    if (address.phone) {
      await this.page.fill(this.phoneInput, address.phone).catch(() => {});
    }
  }

  async selectOption(selector, value) {
    const element = this.page.locator(selector);
    if (await element.isVisible()) {
      await element.selectOption(value);
    }
  }

  async clickContinueBilling() {
    const btn = this.page.locator('button:has-text("Continue"), button[name="save"]').first();
    if (await btn.isVisible()) {
      await btn.click();
      await this.page.waitForTimeout(1000);
    }
  }

  // Payment method methods
  async selectPaymentMethod(method) {
    const methods = {
      'cod': this.cashOnDelivery,
      'check': this.checkPayment,
      'purchaseorder': this.purchaseOrder,
      'creditcard': this.creditCard,
      'paypal': this.paypal
    };
    const selector = methods[method.toLowerCase()];
    if (selector) {
      const radio = this.page.locator(selector);
      if (await radio.isVisible()) {
        await radio.click();
        await this.page.waitForTimeout(500);
      }
    }
  }

  async fillPaymentInfo(paymentInfo) {
    if (paymentInfo.cardholderName) {
      await this.page.fill(this.cardholderName, paymentInfo.cardholderName).catch(() => {});
    }
    if (paymentInfo.cardNumber) {
      await this.page.fill(this.cardNumber, paymentInfo.cardNumber).catch(() => {});
    }
    if (paymentInfo.cardCode) {
      await this.page.fill(this.cardCode, paymentInfo.cardCode).catch(() => {});
    }
    if (paymentInfo.expireMonth) {
      await this.selectOption(this.expireMonth, paymentInfo.expireMonth).catch(() => {});
    }
    if (paymentInfo.expireYear) {
      await this.selectOption(this.expireYear, paymentInfo.expireYear).catch(() => {});
    }
  }

  async clickConfirmOrder() {
    const btn = this.page.locator(this.confirmOrderButton).first();
    if (await btn.isVisible()) {
      await btn.click();
      await this.page.waitForTimeout(2000);
    }
  }

  async clickPlaceOrder() {
    const btn = this.page.locator(this.placeOrderButton).first();
    if (await btn.isVisible()) {
      await btn.click();
      await this.page.waitForTimeout(2000);
    }
  }

  // Order summary methods
  async getOrderTotal() {
    try {
      const totalElement = this.page.locator(this.orderTotal).first();
      if (await totalElement.isVisible()) {
        return await totalElement.textContent();
      }
    } catch {
      // Ignore
    }
    return '';
  }

  async getOrderNumber() {
    try {
      const orderElement = this.page.locator(this.orderNumber).first();
      if (await orderElement.isVisible()) {
        return await orderElement.textContent();
      }
      const thankYou = this.page.locator(this.thankYouMessage).first();
      if (await thankYou.isVisible()) {
        return 'Order placed successfully';
      }
    } catch {
      // Ignore
    }
    return '';
  }

  async isOrderComplete() {
    return await this.page.locator(this.orderSuccess).first().isVisible().catch(() => false) ||
           await this.page.locator(this.thankYouMessage).first().isVisible().catch(() => false);
  }

  // Validation methods
  async getValidationErrors() {
    const errors = [];
    try {
      const errorElements = this.page.locator(this.validationError).all();
      for (const el of errorElements) {
        if (await el.isVisible()) {
          const text = await el.textContent();
          if (text) errors.push(text.trim());
        }
      }
    } catch {
      // Ignore
    }
    return errors;
  }

  async hasValidationError() {
    return await this.page.locator(this.validationError).first().isVisible().catch(() => false);
  }

  // Complete checkout flow helper
  async completeCheckout(address, paymentMethod = 'cod', paymentInfo = {}) {
    // Fill billing address
    await this.fillBillingAddress(address);

    // Continue to next step
    await this.clickContinueBilling();

    // Select payment method
    await this.selectPaymentMethod(paymentMethod);

    // Continue
    await this.clickContinueBilling();

    // Fill payment info if credit card
    if (paymentMethod === 'creditcard') {
      await this.fillPaymentInfo(paymentInfo);
      await this.clickContinueBilling();
    }

    // Confirm order
    await this.clickConfirmOrder();
  }
}
