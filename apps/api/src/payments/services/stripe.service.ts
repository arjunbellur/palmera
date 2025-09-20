import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2023-08-16',
      },
    );
  }

  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
    saveCard?: boolean;
  }): Promise<any> {
    const { amount, currency, metadata, saveCard } = data;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      metadata,
      setup_future_usage: saveCard ? 'off_session' : undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency.toUpperCase(),
      method: 'CARD',
      provider: 'stripe',
      clientSecret: paymentIntent.client_secret,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
  }

  async verifyPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      return false;
    }
  }

  async createRefund(paymentIntentId: string, amount: number): Promise<string> {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });

    return refund.id;
  }

  async handleWebhook(body: any, headers: any): Promise<void> {
    const signature = headers['stripe-signature'];
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'charge.dispute.created':
          await this.handleDisputeCreated(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update payment status in database
    console.log('Payment succeeded:', paymentIntent.id);
    // Implementation would update the payment record in the database
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update payment status in database
    console.log('Payment failed:', paymentIntent.id);
    // Implementation would update the payment record in the database
  }

  private async handleDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
    // Handle dispute creation
    console.log('Dispute created:', dispute.id);
    // Implementation would create a dispute record and notify relevant parties
  }

  // Apple Pay and Google Pay setup
  async createApplePaySession(domain: string): Promise<any> {
    return this.stripe.applePayDomains.create({
      domain_name: domain,
    });
  }

  async createGooglePaySession(domain: string): Promise<any> {
    // Google Pay doesn't require domain registration like Apple Pay
    return { domain };
  }
}
