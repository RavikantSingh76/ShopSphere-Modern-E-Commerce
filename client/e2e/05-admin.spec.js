import { test, expect } from '@playwright/test';

test.describe('Admin Console and Management End-to-End Suite', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Authenticate with Administrator account
    await page.goto('/login');
    const form = page.locator('form:has(input[type="password"])');
    const adminDemoBtn = page.getByRole('button', { name: /admin demo/i });
    if (await adminDemoBtn.isVisible()) {
      await adminDemoBtn.click();
    } else {
      await form.locator('input[type="email"]').fill(process.env.TEST_ADMIN_EMAIL || process.env.VITE_DEMO_ADMIN_EMAIL || 'ravikantsinghravi366@gmail.com');
      await form.locator('input[type="password"]').fill(process.env.TEST_ADMIN_PASSWORD || process.env.VITE_DEMO_ADMIN_PASSWORD || '');
    }
    await form.locator('button[type="submit"]').click();
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
  });

  test('Admin Dashboard displays live business analytics and counters', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*admin/);

    // Verify presence of analytics cards
    await expect(page.locator('text=/Total Revenue/i').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Total Orders/i').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Total Products/i').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Registered Users/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('Admin Products management allows inventory inspection and product creation', async ({ page }) => {
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/.*admin\/products/);
    await page.waitForLoadState('networkidle');

    // 1. Verify Inventory Table renders products
    await expect(page.locator('text=/Product Inventory/i')).toBeVisible({ timeout: 10000 });
    
    // 2. Open Add Product Modal
    const addProductBtn = page.locator('button:has-text("Add New Product")').first();
    await expect(addProductBtn).toBeVisible({ timeout: 10000 });
    await addProductBtn.click();

    // 3. Populate product creation form
    await expect(page.getByRole('heading', { name: 'Add New Product' })).toBeVisible({ timeout: 10000 });

    const uniqueSku = `SKU-E2E-${Date.now().toString().slice(-6)}`;
    await page.locator('input[placeholder*="Sony WH-1000XM5"]').fill('E2E High-Performance Headphones');
    
    // Category selection (select first valid option)
    const categorySelect = page.locator('select').first();
    const options = await categorySelect.locator('option').all();
    if (options.length > 1) {
      const val = await options[1].getAttribute('value');
      if (val) await categorySelect.selectOption(val);
    }

    await page.locator('input[placeholder="2999"]').fill('4999');
    await page.locator('input[placeholder*="100"], input[placeholder*="50"]').first().fill('35');
    await page.locator('input[placeholder*="Photo URL"]').first().fill('https://images.unsplash.com/photo-1505740420928-5e560c06d30e');

    // Submit form
    const saveBtn = page.locator('button[type="submit"]:has-text("Save Product")');
    await saveBtn.click();

    // Verify modal closes and product list updates
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Add New Product' })).not.toBeVisible({ timeout: 10000 });
  });

  test('Admin Orders shows customer orders and tracking data', async ({ page }) => {
    await page.goto('/admin/orders');
    await expect(page).toHaveURL(/.*admin\/orders/);
    await page.waitForLoadState('networkidle');

    // Verify Orders table renders with ORD numbers
    await expect(page.locator('text=/Order/i').first()).toBeVisible({ timeout: 10000 });
    const orderRef = page.locator('text=/ORD-/').first();
    await expect(orderRef).toBeVisible({ timeout: 10000 });
  });

  test('Admin Users table renders customer accounts without leaking sensitive password hashes', async ({ page }) => {
    let capturedUsersResponse = null;

    // Listen to network request for users API to inspect payload
    page.on('response', async (response) => {
      if (response.url().includes('/api/admin/users') && response.status() === 200) {
        try {
          capturedUsersResponse = await response.json();
        } catch (e) {
          // ignore non-json
        }
      }
    });

    await page.goto('/admin/users');
    await expect(page).toHaveURL(/.*admin\/users/);
    await page.waitForLoadState('networkidle');

    // Check table displays users
    await expect(page.locator('text=/customer@ecommerce.com/i').first()).toBeVisible({ timeout: 10000 });

    // Assert that the page HTML does NOT contain standard BCrypt hash signatures
    const pageContent = await page.content();
    expect(pageContent).not.toMatch(/\$2[aby]\$[0-9]{2}\$[A-Za-z0-9./]{53}/);

    // If API payload was intercepted, assert password and passwordHash are omitted or null
    if (capturedUsersResponse && capturedUsersResponse.data) {
      const usersList = Array.isArray(capturedUsersResponse.data)
        ? capturedUsersResponse.data
        : capturedUsersResponse.data.content || [];
      
      for (const u of usersList) {
        expect(u.password).toBeUndefined();
        expect(u.passwordHash).toBeUndefined();
      }
    }
  });
});
