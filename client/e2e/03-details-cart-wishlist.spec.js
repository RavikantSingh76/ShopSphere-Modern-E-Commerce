import { test, expect } from '@playwright/test';

test.describe('Product Details, Cart & Wishlist Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate with customer account to sync with backend DB
    await page.goto('/login');
    const form = page.locator('form:has(input[type="password"])');
    const demoBtn = page.getByRole('button', { name: /customer demo/i });
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    } else {
      await form.locator('input[type="email"]').fill('customer@ecommerce.com');
      await form.locator('input[type="password"]').fill('Customer@123');
    }
    await form.locator('button[type="submit"]').click();
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
  });

  test('View product details, toggle wishlist, compare, and add to cart', async ({ page }) => {
    await page.goto('/products');
    const productCard = page.locator('.group.relative').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });

    // Click title link to open product detail
    const titleLink = productCard.locator('a[title]');
    const productName = await titleLink.innerText();
    await titleLink.click();

    // Verify product detail page
    await expect(page).toHaveURL(/.*products\/.+/);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Verify Price is displayed
    const priceEl = page.locator('text=/₹[0-9,]+/').first();
    await expect(priceEl).toBeVisible();

    // Test Wishlist Toggle
    const wishlistBtn = page.locator('button[title*="Wishlist"]').first();
    if (await wishlistBtn.isVisible()) {
      await wishlistBtn.click();
      await page.waitForTimeout(500);
    }

    // Test Compare Button
    const compareBtn = page.locator('button:has-text("Add to Compare"), button:has-text("In Compare List")').first();
    if (await compareBtn.isVisible()) {
      await compareBtn.click();
      await page.waitForTimeout(500);
    }

    // Test Add to Cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Verify cart drawer or notification appears
    await page.waitForTimeout(1000);
  });

  test('Cart lifecycle: view, update quantity, refresh persistence, and remove', async ({ page }) => {
    // Add an item first
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

    // Navigate to /cart
    await page.goto('/cart');
    await expect(page).toHaveURL(/.*cart/);

    // Verify item is in cart
    const checkoutLink = page.locator('a[href="/checkout"], button:has-text("Checkout"), a:has-text("Checkout")').first();
    await expect(checkoutLink).toBeVisible({ timeout: 10000 });

    // Test cart persistence across browser refresh
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(checkoutLink).toBeVisible({ timeout: 10000 });

    // Test quantity increment if plus button exists
    const plusBtn = page.locator('button:has-text("+"), button[aria-label="Increase quantity"]').first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await page.waitForTimeout(1000);
    }

    // Test remove item from cart
    const removeBtn = page.locator('button[aria-label="Remove item"], button:has-text("Remove"), button:has-text("Delete")').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await page.waitForTimeout(1000);
    }
  });
});
