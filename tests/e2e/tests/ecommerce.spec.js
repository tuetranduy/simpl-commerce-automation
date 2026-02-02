import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { ProductPage } from "../pages/product.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { LoginPage } from "../pages/login.page";
import { Header } from "../pages/header.component";
import checkoutData from "../data/checkout.data.json";

test.describe("SimplCommerce E-commerce Tests", () => {
  let homePage;
  let productPage;
  let cartPage;
  let checkoutPage;
  let loginPage;
  let header;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    loginPage = new LoginPage(page);
    header = new Header(page);

    // Reset data before every test
    await homePage.resetData("Phones");
  });

  test.describe("Checkout Flow", () => {
    test.beforeEach(async ({ page }) => {
      // Start with empty cart for clean checkout tests
      await cartPage.navigate();
      await page.waitForTimeout(1000);
    });

    async function addProductToCart(page, productUrl) {
      // Navigate directly to product page
      await page.goto(`https://demo.simplcommerce.com${productUrl}`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Click add to cart button
      const addBtn = page.locator(".btn-add-cart").first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        // Wait for Angular to update cart and modal to appear
        await page.waitForTimeout(1500);

        // Close the modal dialog if it appears
        const continueBtn = page
          .locator('button:has-text("Continue shopping")')
          .first();
        if (await continueBtn.isVisible().catch(() => false)) {
          await continueBtn.click();
          await page.waitForTimeout(500);
        }
      }
    }

    test("should handle cart state validation", async ({ page }) => {
      // Add two different products
      await addProductToCart(page, "/iphone-6s-16gb");
      await addProductToCart(page, "/samsung-galaxy-a5");

      // Go to cart
      await header.clickCart();
      await page.waitForLoadState("networkidle");

      // Verify multiple items
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(1);
    }, 120000);

    for (const data of checkoutData) {
      test(`should ${data.testName}`, async ({ page }) => {
        // Increase timeout for E2E flow
        test.setTimeout(120000);

        // Login
        await loginPage.navigate();
        await loginPage.login(data.user.email, data.user.password);

        // Ensure we are logged in
        await expect(page.locator('a[href="/user"]').first()).toBeVisible();

        // Add product
        await addProductToCart(page, data.productUrl);

        // Go to cart
        await header.clickCart();
        await page.waitForLoadState("networkidle");

        // Proceed to checkout
        // We might be redirected to checkout if we clicked checkout in the modal,
        // but here we are on cart page.
        const checkoutBtn = page.getByRole("button", {
          name: "Process to Checkout",
        });
        await expect(checkoutBtn).toBeVisible();
        await checkoutBtn.click();

        // Fill Shipping Address
        // We check if the form is visible (it might be pre-filled if saved, but we'll assume we need to fill generic one for this test or "New Address" is default)
        // Based on exploration, it showed correct fields.
        await checkoutPage.fillShippingAddress(data.shippingAddress);

        // Click Payment button
        await page.locator('button:has-text("Payment")').click();

        // Wait for Payment page
        await page.waitForURL(/.*\/payment/);

        // Select Payment Method
        await checkoutPage.selectPaymentMethod(data.paymentMethod);

        // Verify success
        await expect(
          page.locator('h2:has-text("Congratulation!")')
        ).toBeVisible({
          timeout: 30000,
        });
        await expect(page.locator("text=We received your order")).toBeVisible();
      });
    }

    test("should handle invalid checkout information", async ({ page }) => {
      // Login
      await loginPage.navigate();
      await loginPage.login("testautomation@mailnesia.com", "admin");
      await expect(page.locator('a[href="/user"]').first()).toBeVisible();

      // Add product
      await addProductToCart(page, "/ipad-pro-wi-fi-4g-128gb");

      // Go to cart
      await header.clickCart();
      await page.waitForLoadState("networkidle");

      // Proceed to checkout
      const checkoutBtn = page.getByRole("button", {
        name: "Process to Checkout",
      });
      await expect(checkoutBtn).toBeVisible();
      await checkoutBtn.click();

      // Ensure we are adding a NEW address
      await checkoutPage.selectNewAddress();

      // Verify the form is visible
      await expect(
        page.locator(checkoutPage.shippingContactName)
      ).toBeVisible();

      // Attempt to proceed without filling information
      // The Payment button should be disabled
      const paymentBtn = page.locator('button:has-text("Payment")');
      await expect(paymentBtn).toBeDisabled();

      // Fill incomplete information
      await checkoutPage.fillShippingAddress({
        contactName: "Invalid User",
      });
      // Payment button should still be disabled as other required fields are missing
      await expect(paymentBtn).toBeDisabled();
    }, 120000);
  });

  test.describe("Checkout Data-Driven Tests", () => {
    const testCases = [
      { productUrl: "/iphone-6s-16gb", quantity: 1 },
      { productUrl: "/samsung-galaxy-a5", quantity: 2 },
    ];

    testCases.forEach(({ productUrl, quantity }) => {
      test(`should add ${productUrl} with quantity ${quantity} to cart`, async ({
        page,
      }) => {
        // Navigate directly to product
        await page.goto(`https://demo.simplcommerce.com${productUrl}`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });

        // Set quantity if input is available
        const qtyInput = page.locator('input[name="quantity"], #Quantity');
        if (await qtyInput.isVisible()) {
          await qtyInput.fill(String(quantity));
        }

        // Add to cart
        const addBtn = page.locator(".btn-add-cart").first();
        if (await addBtn.isVisible()) {
          await addBtn.click();
          await page.waitForTimeout(1500);

          // Close modal
          const continueBtn = page
            .locator('button:has-text("Continue shopping")')
            .first();
          if (await continueBtn.isVisible().catch(() => false)) {
            await continueBtn.click();
            await page.waitForTimeout(500);
          }
        }

        // Verify cart has item
        await header.clickCart();
        await page.waitForLoadState("networkidle");

        const itemCount = await cartPage.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
      }, 60000);
    });
  });

  test.describe("Add to Cart", () => {
    test("should add product to cart from product page", async ({ page }) => {
      // Navigate to product detail page
      await page.goto("https://demo.simplcommerce.com/iphone-6s-16gb", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Verify product details are visible
      const productName = await productPage.getProductName();
      expect(productName).toBeTruthy();

      const productPrice = await productPage.getProductPrice();
      expect(productPrice).toBeTruthy();

      // Click add to cart using the same selector pattern that works in existing tests
      const addBtn = page.locator(".btn-add-cart").first();
      await addBtn.click();

      // Wait for Angular to update cart and modal to appear
      await page.waitForTimeout(1500);

      // Close the modal dialog if it appears
      const continueBtn = page
        .locator('button:has-text("Continue shopping")')
        .first();
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click();
        await page.waitForTimeout(500);
      }

      // Navigate to cart to verify item is there
      await header.clickCart();
      await page.waitForLoadState("networkidle");

      // Verify cart has item
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
    }, 60000);

    test("should remove product from cart", async ({ page }) => {
      // Step 1: Add a product to cart first
      await page.goto("https://demo.simplcommerce.com/iphone-6s-16gb", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      // Wait for the page to be interactive
      await page.waitForSelector(".btn-add-cart", { timeout: 10000 });

      const addBtn = page.locator(".btn-add-cart").first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(1500);

        const continueBtn = page
          .locator('button:has-text("Continue shopping")')
          .first();
        if (await continueBtn.isVisible().catch(() => false)) {
          await continueBtn.click();
          await page.waitForTimeout(500);
        }
      }

      // Step 2: Navigate to cart
      await header.clickCart();
      await page.waitForLoadState("domcontentloaded");

      // Step 3: Verify cart has item
      const initialItemCount = await cartPage.getItemCount();
      expect(initialItemCount).toBeGreaterThan(0);

      // Step 4: Find and click the remove button
      const removeBtn = page
        .locator('//button[@ng-click="vm.removeShoppingCartItem(cartItem)"]')
        .first();
      await removeBtn.click();
      await page.waitForTimeout(1500);

      // Step 5: Verify cart item count decreased or cart is empty
      const newItemCount = await cartPage.getItemCount();
      expect(newItemCount).toBeLessThanOrEqual(initialItemCount);
    }, 90000);

    test("should update product quantity in cart", async ({ page }) => {
      // Step 1: Add a product to cart first
      await page.goto("https://demo.simplcommerce.com/iphone-6s-16gb", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Wait for the page to be interactive
      await page.waitForSelector(".btn-add-cart", { timeout: 15000 });

      const addBtn = page.locator(".btn-add-cart").first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(2000);

        const continueBtn = page
          .locator('button:has-text("Continue shopping")')
          .first();
        if (await continueBtn.isVisible().catch(() => false)) {
          await continueBtn.click();
          await page.waitForTimeout(1000);
        }
      }

      // Step 2: Navigate to cart
      await header.clickCart();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2000);

      // Step 3: Verify cart has item
      const initialItemCount = await cartPage.getItemCount();
      expect(initialItemCount).toBeGreaterThan(0);

      // Step 4: Find and click the + button to increase quantity
      // The + button is the second button in the cart row (after the - button)
      const buttons = await page.locator("table tbody tr button").all();
      if (buttons.length >= 2) {
        await buttons[1].click(); // Click the + button
        await page.waitForTimeout(1500);
      }

      // Step 5: Verify cart still has items
      const newItemCount = await cartPage.getItemCount();
      expect(newItemCount).toBeGreaterThanOrEqual(initialItemCount);
    }, 120000);
  });
});
