import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentAdapter, PaymentIntent, VerifiedEvent } from '../interfaces/payment-adapter.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeAdapter implements PaymentAdapter {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2023-08-16',
      },
    );
  }

  async createIntent(input: {
    amount: number;
    currency: string;
    meta?: any;
    customer?: {
      email?: string;
      phone?: string;
      name?: string;
    };
  }): Promise<PaymentIntent> {
    const { amount, currency, meta, customer } = input;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        ...meta,
        customer_email: customer?.email,
        customer_name: customer?.name,
        customer_phone: customer?.phone,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      reference: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      metadata: {
        ...meta,
        client_secret: paymentIntent.client_secret,
      },
    };
  }

  async refund(reference: string, amountMinor?: number): Promise<{
    refundId: string;
    status: 'success' | 'failed' | 'pending';
  }> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: reference,
        amount: amountMinor,
      });

      return {
        refundId: refund.id,
        status: refund.status === 'succeeded' ? 'success' : 'pending',
      };
    } catch (error) {
      return {
        refundId: '',
        status: 'failed',
      };
    }
  }

  verifyWebhook(raw: Buffer, headers: Record<string, string>): VerifiedEvent {
    const signature = headers['stripe-signature'];
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    const event = this.stripe.webhooks.constructEvent(raw, signature, webhookSecret);

    let eventType: VerifiedEvent['type'] = 'payment.pending';
    let amount = 0;
    let currency = 'USD';

    switch (event.type) {
      case 'payment_intent.succeeded':
        eventType = 'payment.success';
        amount = (event.data.object as Stripe.PaymentIntent).amount / 100;
        currency = (event.data.object as Stripe.PaymentIntent).currency.toUpperCase();
        break;
      case 'payment_intent.payment_failed':
        eventType = 'payment.failed';
        amount = (event.data.object as Stripe.PaymentIntent).amount / 100;
        currency = (event.data.object as Stripe.PaymentIntent).currency.toUpperCase();
        break;
      case 'charge.dispute.created':
        eventType = 'payment.failed';
        break;
    }

    return {
      type: eventType,
      reference: (event.data.object as any).id,
      amount,
      currency,
      metadata: event.data.object,
      timestamp: new Date(event.created * 1000),
      provider: 'stripe',
    };
  }

  getSupportedMethods(): string[] {
    return ['CARD', 'APPLE_PAY', 'GOOGLE_PAY'];
  }

  getSupportedCurrencies(): string[] {
    return ['USD', 'EUR', 'XOF'];
  }

  supportsCountry(country: string): boolean {
    // Stripe supports most countries
    return true;
  }
}
