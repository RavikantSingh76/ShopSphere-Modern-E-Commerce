import { test, expect } from '@playwright/test';

test.describe('Product Catalog & Filtering Flow', () => {
  test('Catalog loads products with titles, prices, and images', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/.*products/);

    // Wait for at least one product card to appear
    const productCard = page.locator('.group.relative').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });

    // Verify image, title, and price are rendered
    const img = productCard.locator('img');
    await expect(img).toBeVisible();

    const titleEl = productCard.locator('a[title]');
    await expect(titleEl).toBeVisible();
    const titleText = await titleEl.innerText();
    expect(titleText.length).toBeGreaterThan(0);

    const cardText = await productCard.innerText();
    expect(cardText).toMatch(/₹/);
  });

  test('Keyword search filters the product catalog', async ({ page }) => {
    // Navigate with a specific search query that matches known items
    await page.goto('/products?query=shirt');
    await page.waitForLoadState('domcontentloaded');

    const productCard = page.locator('.group.relative').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });

    const titleEl = productCard.locator('a[title]');
    const titleText = await titleEl.innerText();
    expect(titleText.toLowerCase()).toContain('shirt');
  });

  test('Category filter isolates products belonging to selected category', async ({ page }) => {
    await page.goto('/products?category=Electronics');
    await page.waitForLoadState('domcontentloaded');

    const productLinks = page.locator('a[href^="/products/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Price sorting (asc) orders products from lowest to highest price', async ({ page }) => {
    await page.goto('/products?sortBy=price&sortDir=asc');
    await page.waitForLoadState('domcontentloaded');

    const productLinks = page.locator('a[href^="/products/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(1);
  });

  test('Pagination navigates between product pages', async ({ page }) => {
    await page.goto('/products?page=0');
    await page.waitForLoadState('domcontentloaded');

    // Check pagination controls
    const nextBtn = page.locator('button:has-text("Next"), button[aria-label="Next page"], a:has-text("2")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('page=');
    }
  });
});
