import { test, expect } from '@playwright/test';

test.describe('Security, Authentication, and RBAC Verification Suite', () => {
  test('Customer cannot access Admin Console and receives access blocked banner', async ({ page }) => {
    // 1. Log in as Customer
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

    // 2. Attempt to navigate directly to /admin
    await page.goto('/admin');
    
    // 3. Verify access denied banner
    await expect(page.locator('text=/Admin Access Required/i')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/Product Inventory/i')).not.toBeVisible();
  });

  test('Unauthenticated user is prompted to sign in when accessing checkout', async ({ page }) => {
    // 1. Visit /checkout without logging in
    await page.goto('/checkout');

    // 2. Verify redirect or Sign In to Complete Order prompt
    await expect(
      page.locator('text=/Sign In to Complete Order|Sign in to your account|Login/i').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('Backend API enforces RBAC and returns HTTP 403 for Customer calling Admin endpoints', async ({ request }) => {
    // 1. Authenticate customer to obtain JWT token
    const loginRes = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: 'customer@ecommerce.com',
        password: 'Customer@123',
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    const token = loginBody.data?.token || loginBody.data?.accessToken;
    expect(token).toBeTruthy();

    // 2. Call admin-protected endpoint with customer token
    const adminRes = await request.get('http://localhost:8080/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Spring Security should return 403 Forbidden
    expect(adminRes.status()).toBe(403);
  });

  test('Backend API enforces authentication and returns HTTP 401 for requests without token', async ({ request }) => {
    // Call protected endpoint without Authorization header
    const ordersRes = await request.get('http://localhost:8080/api/orders');
    expect([401, 403]).toContain(ordersRes.status());
  });

  test('User authentication endpoint does NOT expose raw password or hash in response', async ({ request }) => {
    const loginRes = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: 'customer@ecommerce.com',
        password: 'Customer@123',
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    
    // User object in response
    const user = loginBody.data?.user || loginBody.data;
    expect(user.password).toBeUndefined();
    expect(user.passwordHash).toBeUndefined();

    // Verify token can call /api/users/profile or /api/auth/me without leaking password
    const token = loginBody.data?.token || loginBody.data?.accessToken;
    const profileRes = await request.get('http://localhost:8080/api/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (profileRes.status() === 200) {
      const profileBody = await profileRes.json();
      const profileUser = profileBody.data || profileBody;
      expect(profileUser.password).toBeUndefined();
      expect(profileUser.passwordHash).toBeUndefined();
    }
  });
});
