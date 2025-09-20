import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentAdapter, PaymentIntent, VerifiedEvent } from '../interfaces/payment-adapter.interface';
import axios from 'axios';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

@Injectable()
export class PaystackAdapter implements PaymentAdapter {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;
  private readonly publicKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY')!;
    this.publicKey = this.configService.get<string>('PAYSTACK_PUBLIC_KEY')!;
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

    const reference = `palmera_ps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        amount: amount * 100, // Paystack expects amount in kobo
        currency: currency.toLowerCase(),
        reference,
        callback_url: `${this.configService.get('FRONTEND_URL')}/payment/callback?provider=paystack`,
        metadata: meta,
        customer: {
          email: customer?.email || 'customer@palmera.com',
          name: customer?.name || 'Palmera Customer',
          phone: customer?.phone || '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      checkoutUrl: response.data.data.authorization_url,
      reference,
      amount: response.data.data.amount / 100, // Convert back from kobo
      currency: response.data.data.currency.toUpperCase(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      metadata: {
        ...meta,
        paystack_reference: response.data.data.reference,
      },
    };
  }

  async refund(reference: string, amountMinor?: number): Promise<{
    refundId: string;
    status: 'success' | 'failed' | 'pending';
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/refund`,
        {
          transaction: reference,
          amount: amountMinor ? amountMinor * 100 : undefined, // Convert to kobo
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        refundId: response.data.data.reference,
        status: response.data.status === true ? 'success' : 'failed',
      };
    } catch (error) {
      return {
        refundId: '',
        status: 'failed',
      };
    }
  }

  verifyWebhook(raw: Buffer, headers: Record<string, string>): VerifiedEvent {
    const signature = headers['x-paystack-signature'];
    const webhookSecret = this.configService.get<string>('PAYSTACK_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Paystack webhook secret not configured');
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(raw)
      .digest('hex');

    if (hash !== signature) {
      throw new Error('Invalid Paystack webhook signature');
    }

    const payload = JSON.parse(raw.toString());
    const { event, data } = payload;

    let eventType: VerifiedEvent['type'] = 'payment.pending';
    let amount = 0;
    let currency = 'NGN';

    switch (event) {
      case 'charge.success':
        eventType = 'payment.success';
        amount = data.amount / 100; // Convert from kobo
        currency = data.currency.toUpperCase();
        break;
      case 'charge.failed':
        eventType = 'payment.failed';
        amount = data.amount / 100;
        currency = data.currency.toUpperCase();
        break;
      case 'transfer.success':
        eventType = 'refund.success';
        amount = data.amount / 100;
        currency = data.currency.toUpperCase();
        break;
      case 'transfer.failed':
        eventType = 'refund.failed';
        amount = data.amount / 100;
        currency = data.currency.toUpperCase();
        break;
    }

    return {
      type: eventType,
      reference: data.reference || data.id,
      amount,
      currency,
      metadata: data,
      timestamp: new Date(),
      provider: 'paystack',
    };
  }

  getSupportedMethods(): string[] {
    return ['CARD', 'MOBILE_MONEY', 'BANK_TRANSFER'];
  }

  getSupportedCurrencies(): string[] {
    return ['NGN', 'USD', 'GHS', 'ZAR'];
  }

  supportsCountry(country: string): boolean {
    const supportedCountries = ['NG', 'GH', 'ZA', 'KE'];
    return supportedCountries.includes(country);
  }
}
