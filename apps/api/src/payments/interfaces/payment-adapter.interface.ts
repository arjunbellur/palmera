export interface PaymentIntent {
  checkoutUrl?: string;
  reference: string;
  amount: number;
  currency: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface VerifiedEvent {
  type: 'payment.success' | 'payment.failed' | 'payment.pending' | 'refund.success' | 'refund.failed';
  reference: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  provider: string;
}

export interface PaymentAdapter {
  /**
   * Create a payment intent
   */
  createIntent(input: {
    amount: number;
    currency: string;
    meta?: any;
    customer?: {
      email?: string;
      phone?: string;
      name?: string;
    };
  }): Promise<PaymentIntent>;

  /**
   * Process a refund
   */
  refund(reference: string, amountMinor?: number): Promise<{
    refundId: string;
    status: 'success' | 'failed' | 'pending';
  }>;

  /**
   * Verify webhook signature and parse event
   */
  verifyWebhook(raw: Buffer, headers: Record<string, string>): VerifiedEvent;

  /**
   * Get supported payment methods for this adapter
   */
  getSupportedMethods(): string[];

  /**
   * Get supported currencies for this adapter
   */
  getSupportedCurrencies(): string[];

  /**
   * Check if adapter supports a specific country
   */
  supportsCountry(country: string): boolean;
}
