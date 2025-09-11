import { test, expect } from '@playwright/test';

test.describe('Booking Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the mobile app (simulated web version)
    await page.goto('/');
  });

  test('complete booking flow from search to payment', async ({ page }) => {
    // Step 1: Search for experiences
    await test.step('Search for experiences', async () => {
      await page.click('[data-testid="search-button"]');
      await page.fill('[data-testid="search-input"]', 'Dakar');
      await page.click('[data-testid="search-submit"]');
      
      // Wait for search results
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      await expect(page.locator('[data-testid="listing-card"]')).toHaveCount.greaterThan(0);
    });

    // Step 2: Select a listing
    await test.step('Select a listing', async () => {
      await page.click('[data-testid="listing-card"]:first-child');
      await expect(page.locator('[data-testid="listing-detail"]')).toBeVisible();
      await expect(page.locator('[data-testid="book-now-button"]')).toBeVisible();
    });

    // Step 3: Start booking process
    await test.step('Start booking process', async () => {
      await page.click('[data-testid="book-now-button"]');
      await expect(page.locator('[data-testid="booking-start"]')).toBeVisible();
    });

    // Step 4: Fill booking details
    await test.step('Fill booking details', async () => {
      // Select dates
      await page.click('[data-testid="start-date-picker"]');
      await page.click('[data-testid="date-tomorrow"]');
      
      await page.click('[data-testid="end-date-picker"]');
      await page.click('[data-testid="date-day-after-tomorrow"]');
      
      // Select number of guests
      await page.click('[data-testid="guests-increase"]');
      await page.click('[data-testid="guests-increase"]');
      
      // Add special requests
      await page.fill('[data-testid="special-requests"]', 'Please provide extra towels');
      
      // Continue to review
      await page.click('[data-testid="continue-to-review"]');
    });

    // Step 5: Review booking
    await test.step('Review booking details', async () => {
      await expect(page.locator('[data-testid="booking-review"]')).toBeVisible();
      
      // Verify booking details are displayed
      await expect(page.locator('[data-testid="booking-dates"]')).toBeVisible();
      await expect(page.locator('[data-testid="booking-guests"]')).toBeVisible();
      await expect(page.locator('[data-testid="booking-total"]')).toBeVisible();
      
      // Continue to payment
      await page.click('[data-testid="continue-to-payment"]');
    });

    // Step 6: Payment process
    await test.step('Complete payment', async () => {
      await expect(page.locator('[data-testid="payment-screen"]')).toBeVisible();
      
      // Select payment method
      await page.click('[data-testid="payment-method-card"]');
      
      // Fill card details (using test card)
      await page.fill('[data-testid="card-number"]', '4242424242424242');
      await page.fill('[data-testid="card-expiry"]', '12/25');
      await page.fill('[data-testid="card-cvc"]', '123');
      await page.fill('[data-testid="card-name"]', 'Test User');
      
      // Submit payment
      await page.click('[data-testid="submit-payment"]');
    });

    // Step 7: Verify booking confirmation
    await test.step('Verify booking confirmation', async () => {
      await expect(page.locator('[data-testid="booking-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="booking-reference"]')).toBeVisible();
      
      // Verify booking details in confirmation
      await expect(page.locator('[data-testid="confirmation-dates"]')).toBeVisible();
      await expect(page.locator('[data-testid="confirmation-total"]')).toBeVisible();
    });
  });

  test('booking flow with Orange Money payment', async ({ page }) => {
    // Navigate through booking flow until payment
    await page.goto('/');
    await page.click('[data-testid="search-button"]');
    await page.fill('[data-testid="search-input"]', 'Dakar');
    await page.click('[data-testid="search-submit"]');
    await page.click('[data-testid="listing-card"]:first-child');
    await page.click('[data-testid="book-now-button"]');
    
    // Fill booking details quickly
    await page.click('[data-testid="start-date-picker"]');
    await page.click('[data-testid="date-tomorrow"]');
    await page.click('[data-testid="end-date-picker"]');
    await page.click('[data-testid="date-day-after-tomorrow"]');
    await page.click('[data-testid="continue-to-review"]');
    await page.click('[data-testid="continue-to-payment"]');

    // Select Orange Money payment
    await test.step('Complete Orange Money payment', async () => {
      await page.click('[data-testid="payment-method-orange-money"]');
      
      // Fill Orange Money details
      await page.fill('[data-testid="orange-money-phone"]', '+221701234567');
      await page.fill('[data-testid="orange-money-pin"]', '1234');
      
      // Submit payment
      await page.click('[data-testid="submit-orange-money"]');
    });

    // Verify booking confirmation
    await expect(page.locator('[data-testid="booking-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-method-confirmation"]')).toContainText('Orange Money');
  });

  test('booking cancellation flow', async ({ page }) => {
    // Create a booking first (simplified)
    await page.goto('/my-bookings');
    
    // Find an existing booking
    await expect(page.locator('[data-testid="booking-item"]')).toBeVisible();
    
    // Click on a booking to view details
    await page.click('[data-testid="booking-item"]:first-child');
    
    // Cancel the booking
    await test.step('Cancel booking', async () => {
      await page.click('[data-testid="cancel-booking-button"]');
      
      // Confirm cancellation
      await page.click('[data-testid="confirm-cancellation"]');
      
      // Verify cancellation success
      await expect(page.locator('[data-testid="cancellation-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="refund-amount"]')).toBeVisible();
    });
  });

  test('booking flow error handling', async ({ page }) => {
    // Test payment failure scenario
    await page.goto('/');
    await page.click('[data-testid="search-button"]');
    await page.fill('[data-testid="search-input"]', 'Dakar');
    await page.click('[data-testid="search-submit"]');
    await page.click('[data-testid="listing-card"]:first-child');
    await page.click('[data-testid="book-now-button"]');
    
    // Fill booking details
    await page.click('[data-testid="start-date-picker"]');
    await page.click('[data-testid="date-tomorrow"]');
    await page.click('[data-testid="end-date-picker"]');
    await page.click('[data-testid="date-day-after-tomorrow"]');
    await page.click('[data-testid="continue-to-review"]');
    await page.click('[data-testid="continue-to-payment"]');

    // Use declined card
    await test.step('Handle payment failure', async () => {
      await page.click('[data-testid="payment-method-card"]');
      await page.fill('[data-testid="card-number"]', '4000000000000002'); // Declined card
      await page.fill('[data-testid="card-expiry"]', '12/25');
      await page.fill('[data-testid="card-cvc"]', '123');
      await page.fill('[data-testid="card-name"]', 'Test User');
      
      await page.click('[data-testid="submit-payment"]');
      
      // Verify error handling
      await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="retry-payment"]')).toBeVisible();
    });
  });
});
