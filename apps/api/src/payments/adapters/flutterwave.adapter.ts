import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentAdapter, PaymentIntent, VerifiedEvent } from '../interfaces/payment-adapter.interface';
import axios from 'axios';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

@Injectable()
export class FlutterwaveAdapter implements PaymentAdapter {
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  private readonly secretKey: string;
  private readonly publicKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY')!;
    this.publicKey = this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY')!;
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

    const reference = `palmera_fw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await axios.post(
      `${this.baseUrl}/payments`,
      {
        tx_ref: reference,
        amount,
        currency,
        redirect_url: `${this.configService.get('FRONTEND_URL')}/payment/callback?provider=flutterwave`,
        customer: {
          email: customer?.email || 'customer@palmera.com',
          name: customer?.name || 'Palmera Customer',
          phone_number: customer?.phone || '',
        },
        customizations: {
          title: 'Palmera Premium Experiences',
          description: 'Payment for premium experience booking',
          logo: 'https://palmera.com/logo.png',
        },
        meta: meta,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      checkoutUrl: response.data.data.link,
      reference,
      amount: response.data.data.amount,
      currency: response.data.data.currency,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      metadata: {
        ...meta,
        flutterwave_tx_ref: response.data.data.tx_ref,
      },
    };
  }

  async refund(reference: string, amountMinor?: number): Promise<{
    refundId: string;
    status: 'success' | 'failed' | 'pending';
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transactions/${reference}/refund`,
        {
          amount: amountMinor,
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        refundId: response.data.data.id,
        status: response.data.status === 'success' ? 'success' : 'failed',
      };
    } catch (error) {
      return {
        refundId: '',
        status: 'failed',
      };
    }
  }

  verifyWebhook(raw: Buffer, headers: Record<string, string>): VerifiedEvent {
    const signature = headers['verif-hash'];
    const webhookSecret = this.configService.get<string>('FLUTTERWAVE_WEBHOOK_SECRET');

    if (!webhookSecret || signature !== webhookSecret) {
      throw new Error('Invalid Flutterwave webhook signature');
    }

    const payload = JSON.parse(raw.toString());
    const { event, data } = payload;

    let eventType: VerifiedEvent['type'] = 'payment.pending';
    let amount = 0;
    let currency = 'XOF';

    switch (event) {
      case 'charge.completed':
        eventType = 'payment.success';
        amount = data.amount;
        currency = data.currency;
        break;
      case 'charge.failed':
        eventType = 'payment.failed';
        amount = data.amount;
        currency = data.currency;
        break;
      case 'transfer.completed':
        eventType = 'refund.success';
        amount = data.amount;
        currency = data.currency;
        break;
    }

    return {
      type: eventType,
      reference: data.tx_ref || data.id,
      amount,
      currency,
      metadata: data,
      timestamp: new Date(),
      provider: 'flutterwave',
    };
  }

  getSupportedMethods(): string[] {
    return ['CARD', 'MOBILE_MONEY', 'BANK_TRANSFER'];
  }

  getSupportedCurrencies(): string[] {
    return ['XOF', 'NGN', 'GHS', 'KES', 'ZAR'];
  }

  supportsCountry(country: string): boolean {
    const supportedCountries = ['SN', 'NG', 'GH', 'KE', 'ZA', 'CI', 'ML', 'BF', 'NE', 'GN'];
    return supportedCountries.includes(country);
  }
}
