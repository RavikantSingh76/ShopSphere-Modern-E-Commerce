import { test, expect } from '@playwright/test';

test.describe('Checkout, Payment, and Order Lifecycle Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate with customer demo account
    await page.goto('/login');
    const form = page.locator('form:has(input[type="password"])');
    const demoBtn = page.getByRole('button', { name: /customer demo/i });
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    } else {
      await form.locator('input[type="email"]').fill(process.env.TEST_CUSTOMER_EMAIL || process.env.VITE_DEMO_CUSTOMER_EMAIL || 'customer@ecommerce.com');
      await form.locator('input[type="password"]').fill(process.env.TEST_CUSTOMER_PASSWORD || process.env.VITE_DEMO_CUSTOMER_PASSWORD || '');
    }
    await form.locator('button[type="submit"]').click();
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
  });

  test('Complete checkout flow via Demo Payment and verify order tracking', async ({ page }) => {
    // 1. Ensure item is added to cart
    await page.goto('/products');
    const productCard = page.locator('.group.relative').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });
    
    const titleLink = productCard.locator('a[title]');
    await titleLink.click();
    await expect(page).toHaveURL(/.*products\/.+/);

    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();
    await page.waitForTimeout(1000);

    // 2. Open /checkout
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*checkout/);
    await page.waitForLoadState('networkidle');

    // 3. Step 2: Fill address if address form is active or displayed
    const streetInput = page.locator('input[placeholder="Flat / House No., Colony / Street"]');
    if (await streetInput.isVisible()) {
      await page.locator('input[placeholder="Full Name"]').fill('Rahul Sharma');
      await page.locator('input[placeholder="Mobile Number"]').fill('9876543210');
      await streetInput.fill('123 Brigade Road');
      await page.locator('input[placeholder="City"]').fill('Bengaluru');
      await page.locator('input[placeholder="State"]').fill('Karnataka');
      await page.locator('input[placeholder="6-digit Pincode"]').fill('560001');

      const saveAndDeliverBtn = page.locator('button:has-text("SAVE AND DELIVER HERE")');
      await saveAndDeliverBtn.click();
      await page.waitForTimeout(500);
    } else {
      const deliverHereBtn = page.locator('button:has-text("DELIVER HERE")').first();
      if (await deliverHereBtn.isVisible()) {
        await deliverHereBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // 4. Step 3: Order Summary -> Continue to Payment (if Step 3 is active)
    const continueBtn = page.locator('button:has-text("CONTINUE TO PAYMENT")');
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(500);
    }

    // 5. Step 4: In payment options, click PAY VIA UPI
    const payUpiBtn = page.locator('button:has-text("PAY")').first();
    await expect(payUpiBtn).toBeVisible({ timeout: 10000 });
    await payUpiBtn.click();

    // 6. Verify redirection to /order-success
    await page.waitForURL(/.*order-success/, { timeout: 15000 });
    await expect(page.locator('text=/ORD-/').first()).toBeVisible({ timeout: 10000 });

    // Extract Order Number from confirmation page
    const orderNumberEl = page.locator('text=/ORD-[0-9-]+/').first();
    const orderNumber = (await orderNumberEl.innerText()).trim();
    expect(orderNumber).toMatch(/ORD-/);

    // 7. Test Order Tracking page
    await page.goto('/track-order');
    await expect(page).toHaveURL(/.*track-order/);

    const trackInput = page.locator('input[placeholder*="Order ID"]').first();
    await trackInput.fill(orderNumber);

    const trackBtn = page.locator('button:has-text("Track")').first();
    await trackBtn.click();

    // Verify order timeline appears
    await expect(page.locator(`text=${orderNumber}`).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Order Reference|Order Placed|CONFIRMED|PENDING/i').first()).toBeVisible({ timeout: 10000 });
  });
});
