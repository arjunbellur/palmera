import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentAdapter, PaymentIntent, VerifiedEvent } from '../interfaces/payment-adapter.interface';
import axios from 'axios';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

@Injectable()
export class OrangeMoneyAdapter implements PaymentAdapter {
  private readonly baseUrl: string;
  private readonly merchantId: string;
  private readonly apiKey: string;
  private readonly webhookSecret: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('ORANGE_MONEY_BASE_URL') || 'https://api.orange.com/orange-money-webpay/dev/v1';
    this.merchantId = this.configService.get<string>('ORANGE_MONEY_MERCHANT_ID')!;
    this.apiKey = this.configService.get<string>('ORANGE_MONEY_API_KEY')!;
    this.webhookSecret = this.configService.get<string>('ORANGE_MONEY_WEBHOOK_SECRET')!;
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

    // Orange Money expects amount in XOF (West African CFA Franc)
    // Convert other currencies to XOF if needed
    const amountInXOF = await this.convertToXOF(amount, currency);

    const reference = `palmera_om_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Create payment request to Orange Money API
      const paymentRequest = {
        merchant_id: this.merchantId,
        amount: amountInXOF,
        currency: 'XOF',
        order_id: reference,
        return_url: `${this.configService.get('FRONTEND_URL')}/payment/callback?provider=orange_money`,
        cancel_url: `${this.configService.get('FRONTEND_URL')}/payment/cancel?provider=orange_money`,
        notify_url: `${this.configService.get('API_URL')}/payments/webhooks/orange-money`,
        customer: {
          phone: customer?.phone || '',
          email: customer?.email || '',
          name: customer?.name || '',
        },
        metadata: {
          ...meta,
          original_amount: amount,
          original_currency: currency,
          conversion_rate: amountInXOF / amount,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/webpayments`,
        paymentRequest,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 30000,
        }
      );

      if (response.data.status === 'SUCCESS') {
        return {
          checkoutUrl: response.data.pay_token,
          reference,
          amount: amountInXOF,
          currency: 'XOF',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          metadata: {
            ...meta,
            orange_money_token: response.data.pay_token,
            original_amount: amount,
            original_currency: currency,
          },
        };
      } else {
        throw new Error(`Orange Money payment creation failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Orange Money payment creation error:', error);
      throw new Error('Failed to create Orange Money payment intent');
    }
  }

  async refund(reference: string, amountMinor?: number): Promise<{
    refundId: string;
    status: 'success' | 'failed' | 'pending';
  }> {
    try {
      // Orange Money may only support full refunds
      const refundRequest = {
        merchant_id: this.merchantId,
        order_id: reference,
        amount: amountMinor, // If not provided, will be full refund
      };

      const response = await axios.post(
        `${this.baseUrl}/refunds`,
        refundRequest,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        return {
          refundId: response.data.refund_id,
          status: 'success',
        };
      } else {
        return {
          refundId: '',
          status: 'failed',
        };
      }
    } catch (error) {
      console.error('Orange Money refund error:', error);
      return {
        refundId: '',
        status: 'failed',
      };
    }
  }

  verifyWebhook(raw: Buffer, headers: Record<string, string>): VerifiedEvent {
    const signature = headers['x-orange-signature'] || headers['signature'];
    
    if (!signature) {
      throw new Error('Missing Orange Money webhook signature');
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(raw)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid Orange Money webhook signature');
    }

    const payload = JSON.parse(raw.toString());
    
    // Parse Orange Money webhook event
    const eventType = this.mapOrangeMoneyEventType(payload.event_type);
    
    return {
      type: eventType,
      reference: payload.order_id,
      amount: payload.amount,
      currency: payload.currency || 'XOF',
      metadata: payload.metadata,
      timestamp: new Date(payload.timestamp),
      provider: 'orange_money',
    };
  }

  getSupportedMethods(): string[] {
    return ['MOBILE_MONEY', 'USSD', 'APP'];
  }

  getSupportedCurrencies(): string[] {
    return ['XOF'];
  }

  supportsCountry(country: string): boolean {
    // Orange Money is primarily available in West African countries
    const supportedCountries = ['SN', 'CI', 'ML', 'BF', 'NE', 'GN'];
    return supportedCountries.includes(country);
  }

  private async convertToXOF(amount: number, currency: string): Promise<number> {
    if (currency === 'XOF') {
      return amount;
    }

    try {
      // Use a currency conversion service or API
      // For now, we'll use approximate rates (in production, use a real API)
      const rates: Record<string, number> = {
        'USD': 600, // 1 USD ≈ 600 XOF
        'EUR': 650, // 1 EUR ≈ 650 XOF
        'XOF': 1,
      };

      const rate = rates[currency] || 1;
      return Math.round(amount * rate);
    } catch (error) {
      console.error('Currency conversion error:', error);
      // Fallback to 1:1 ratio if conversion fails
      return amount;
    }
  }

  private mapOrangeMoneyEventType(eventType: string): VerifiedEvent['type'] {
    const eventMap: Record<string, VerifiedEvent['type']> = {
      'PAYMENT_SUCCESS': 'payment.success',
      'PAYMENT_FAILED': 'payment.failed',
      'PAYMENT_PENDING': 'payment.pending',
      'REFUND_SUCCESS': 'refund.success',
      'REFUND_FAILED': 'refund.failed',
    };

    return eventMap[eventType] || 'payment.pending';
  }

  /**
   * Get Orange Money specific payment instructions
   */
  getPaymentInstructions(reference: string): {
    ussd: string;
    app: string;
    web: string;
  } {
    return {
      ussd: `*144*1*${reference}#`,
      app: 'Open Orange Money app and enter reference',
      web: 'Complete payment on Orange Money web portal',
    };
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(reference: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    amount?: number;
    currency?: string;
  }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        status: response.data.status === 'SUCCESS' ? 'success' : 
                response.data.status === 'FAILED' ? 'failed' : 'pending',
        amount: response.data.amount,
        currency: response.data.currency,
      };
    } catch (error) {
      console.error('Orange Money status check error:', error);
      return { status: 'pending' };
    }
  }
}
