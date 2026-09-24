import { test, expect } from '@playwright/test';

test.describe('Customer Authentication Flow', () => {
  const timestamp = Date.now();
  const testEmail = `cust_e2e_${timestamp}@test.com`;
  const testPassword = 'Password@123';

  test('Registration page loads, validates input, and registers new user', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/.*register/);
    
    // Check heading
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();

    // Target auth form uniquely
    const form = page.locator('form:has(input[type="password"])');
    const nameInput = form.locator('input[type="text"]');
    const emailInput = form.locator('input[type="email"]');
    const phoneInput = form.locator('input[type="tel"]');
    const passwordInput = form.locator('input[type="password"]');
    const submitBtn = form.locator('button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Fill registration form
    await nameInput.fill('E2E Test Customer');
    await emailInput.fill(testEmail);
    await phoneInput.fill('+91 9876543210');
    await passwordInput.fill(testPassword);

    await submitBtn.click();

    // Should redirect away from /register after successful registration
    await page.waitForURL((url) => !url.pathname.includes('/register'), { timeout: 10000 });
    
    // User token should be stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('Invalid login shows error feedback without crashing', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);

    const form = page.locator('form:has(input[type="password"])');
    await form.locator('input[type="email"]').fill('wrong_user@example.com');
    await form.locator('input[type="password"]').fill('WrongPassword999!');
    await form.locator('button[type="submit"]').click();

    // Wait a brief moment for toast or error message
    await page.waitForTimeout(1000);
    
    // Should still be on /login page
    expect(page.url()).toContain('/login');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeFalsy();
  });

  test('Valid login with Customer demo account succeeds and persists across refresh', async ({ page }) => {
    await page.goto('/login');
    
    const form = page.locator('form:has(input[type="password"])');
    // Click Customer Demo button
    const demoBtn = page.getByRole('button', { name: /customer demo/i });
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    } else {
      await form.locator('input[type="email"]').fill('customer@ecommerce.com');
      await form.locator('input[type="password"]').fill('Customer@123');
    }

    await form.locator('button[type="submit"]').click();

    // Wait for redirect to home
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Test session persistence: Refresh the browser
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Token must remain in localStorage
    const refreshedToken = await page.evaluate(() => localStorage.getItem('token'));
    expect(refreshedToken).toBe(token);
  });
});
