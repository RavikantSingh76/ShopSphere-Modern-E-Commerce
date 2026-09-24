import { test, expect } from '@playwright/test';

test.describe('Responsive Viewports and Cross-Device Layout Verification', () => {
  test('Desktop Viewport (1920x1080) renders high-density layout cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Storefront header & search bar visible
    await expect(page.locator('input[placeholder*="Search"]').first()).toBeVisible({ timeout: 10000 });
    // Product grid rendered with multiple columns
    await expect(page.locator('.grid').first()).toBeVisible({ timeout: 10000 });
  });

  test('Tablet Viewport (1024x768) renders adaptive multi-column grid', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Verify catalog header and products exist
    await expect(page.locator('.group.relative').first()).toBeVisible({ timeout: 10000 });

    // Verify no unexpected horizontal page overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test('Mobile Viewport (390x844) renders responsive mobile interface', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Storefront logo or brand title remains visible
    await expect(page.locator('text=/ShopSphere/i').first()).toBeVisible({ timeout: 10000 });

    // Navigate to product detail on mobile
    await page.goto('/products');
    const firstProduct = page.locator('.group.relative').first();
    await expect(firstProduct).toBeVisible({ timeout: 10000 });

    // Verify mobile layout fits viewport width without horizontal break
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});
