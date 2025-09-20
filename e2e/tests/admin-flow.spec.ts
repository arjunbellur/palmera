import { test, expect } from '@playwright/test';

test.describe('Admin Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('/login');
  });

  test('admin login and dashboard access', async ({ page }) => {
    await test.step('Login as admin', async () => {
      await page.fill('[data-testid="email-input"]', 'admin@palmera.app');
      await page.fill('[data-testid="password-input"]', 'Admin123!');
      await page.click('[data-testid="login-button"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard');
    });

    await test.step('Verify dashboard elements', async () => {
      await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
    });
  });

  test('provider verification flow', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@palmera.app');
    await page.fill('[data-testid="password-input"]', 'Admin123!');
    await page.click('[data-testid="login-button"]');
    
    await test.step('Navigate to providers page', async () => {
      await page.click('[data-testid="nav-providers"]');
      await expect(page).toHaveURL('/providers');
      await expect(page.locator('[data-testid="providers-list"]')).toBeVisible();
    });

    await test.step('Review pending provider', async () => {
      // Find a pending provider
      const pendingProvider = page.locator('[data-testid="provider-item"]').filter({ hasText: 'Pending' }).first();
      await expect(pendingProvider).toBeVisible();
      
      // Click to view details
      await pendingProvider.click();
      await expect(page.locator('[data-testid="provider-details"]')).toBeVisible();
    });

    await test.step('Approve provider', async () => {
      await page.click('[data-testid="approve-provider"]');
      
      // Confirm approval
      await page.click('[data-testid="confirm-approval"]');
      
      // Verify success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Provider approved successfully');
    });
  });

  test('listing management flow', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@palmera.app');
    await page.fill('[data-testid="password-input"]', 'Admin123!');
    await page.click('[data-testid="login-button"]');
    
    await test.step('Navigate to listings page', async () => {
      await page.click('[data-testid="nav-listings"]');
      await expect(page).toHaveURL('/listings');
      await expect(page.locator('[data-testid="listings-list"]')).toBeVisible();
    });

    await test.step('Feature a listing', async () => {
      // Find a listing that's not featured
      const listing = page.locator('[data-testid="listing-item"]').first();
      await expect(listing).toBeVisible();
      
      // Click feature button
      await listing.locator('[data-testid="feature-listing"]').click();
      
      // Verify listing is now featured
      await expect(listing.locator('[data-testid="featured-badge"]')).toBeVisible();
    });

    await test.step('Search and filter listings', async () => {
      // Search for listings
      await page.fill('[data-testid="search-listings"]', 'Dakar');
      await page.click('[data-testid="search-submit"]');
      
      // Verify filtered results
      await expect(page.locator('[data-testid="listing-item"]')).toHaveCount.greaterThan(0);
      
      // Filter by category
      await page.selectOption('[data-testid="category-filter"]', 'ACCOMMODATION');
      
      // Verify category filter applied
      await expect(page.locator('[data-testid="listing-item"]')).toHaveCount.greaterThan(0);
    });
  });

  test('user management flow', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@palmera.app');
    await page.fill('[data-testid="password-input"]', 'Admin123!');
    await page.click('[data-testid="login-button"]');
    
    await test.step('Navigate to users page', async () => {
      await page.click('[data-testid="nav-users"]');
      await expect(page).toHaveURL('/users');
      await expect(page.locator('[data-testid="users-list"]')).toBeVisible();
    });

    await test.step('Search and filter users', async () => {
      // Search for users
      await page.fill('[data-testid="search-users"]', 'test@example.com');
      await page.click('[data-testid="search-submit"]');
      
      // Filter by role
      await page.selectOption('[data-testid="role-filter"]', 'CUSTOMER');
      
      // Verify filtered results
      await expect(page.locator('[data-testid="user-item"]')).toHaveCount.greaterThan(0);
    });

    await test.step('View user details', async () => {
      const user = page.locator('[data-testid="user-item"]').first();
      await user.click();
      
      // Verify user details modal
      await expect(page.locator('[data-testid="user-details-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-role"]')).toBeVisible();
    });
  });

  test('refund processing flow', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@palmera.app');
    await page.fill('[data-testid="password-input"]', 'Admin123!');
    await page.click('[data-testid="login-button"]');
    
    await test.step('Navigate to bookings page', async () => {
      await page.click('[data-testid="nav-bookings"]');
      await expect(page).toHaveURL('/bookings');
      await expect(page.locator('[data-testid="bookings-list"]')).toBeVisible();
    });

    await test.step('Process refund for cancelled booking', async () => {
      // Find a cancelled booking
      const cancelledBooking = page.locator('[data-testid="booking-item"]').filter({ hasText: 'Cancelled' }).first();
      await expect(cancelledBooking).toBeVisible();
      
      // Click refund button
      await cancelledBooking.locator('[data-testid="refund-booking"]').click();
      
      // Fill refund form
      await page.fill('[data-testid="refund-reason"]', 'Customer requested cancellation');
      await page.fill('[data-testid="refund-amount"]', '150000');
      
      // Submit refund
      await page.click('[data-testid="submit-refund"]');
      
      // Verify refund success
      await expect(page.locator('[data-testid="refund-success"]')).toBeVisible();
    });
  });

  test('analytics and reporting', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@palmera.app');
    await page.fill('[data-testid="password-input"]', 'Admin123!');
    await page.click('[data-testid="login-button"]');
    
    await test.step('View dashboard analytics', async () => {
      // Verify dashboard stats are displayed
      await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-providers"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-bookings"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();
      
      // Verify revenue chart
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
      
      // Verify recent activity
      await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
    });

    await test.step('Export reports', async () => {
      // Click export button
      await page.click('[data-testid="export-reports"]');
      
      // Select report type
      await page.selectOption('[data-testid="report-type"]', 'monthly');
      
      // Download report
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="download-report"]');
      const download = await downloadPromise;
      
      // Verify download
      expect(download.suggestedFilename()).toContain('monthly-report');
    });
  });

  test('admin logout', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@palmera.app');
    await page.fill('[data-testid="password-input"]', 'Admin123!');
    await page.click('[data-testid="login-button"]');
    
    await test.step('Logout from admin panel', async () => {
      // Click logout button
      await page.click('[data-testid="logout-button"]');
      
      // Confirm logout
      await page.click('[data-testid="confirm-logout"]');
      
      // Should redirect to login page
      await expect(page).toHaveURL('/login');
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    });
  });
});
