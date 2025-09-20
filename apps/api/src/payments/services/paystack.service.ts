import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private baseUrl = 'https://api.paystack.co';
  private secretKey: string;
  private publicKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY')!;
    this.publicKey = this.configService.get<string>('PAYSTACK_PUBLIC_KEY')!;
  }

  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  }): Promise<any> {
    const { amount, currency, metadata } = data;

    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
        currency: currency.toLowerCase(),
        reference: `palmera_${Date.now()}`,
        callback_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      id: response.data.data.reference,
      amount: response.data.data.amount / 100, // Convert back from kobo
      currency: response.data.data.currency.toUpperCase(),
      method: 'CARD',
      provider: 'paystack',
      paymentUrl: response.data.data.authorization_url,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }

  async processMobileMoney(data: {
    phone: string;
    amount: number;
    currency: string;
    network?: string;
  }): Promise<any> {
    const { phone, amount, currency, network } = data;

    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        amount: amount * 100, // Paystack expects amount in kobo
        currency: currency.toLowerCase(),
        reference: `palmera_mobile_${Date.now()}`,
        callback_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
        channels: ['mobile_money'],
        metadata: {
          phone,
          network: network || 'MTN',
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
      id: response.data.data.reference,
      amount: response.data.data.amount / 100,
      currency: response.data.data.currency.toUpperCase(),
      method: 'MOBILE_MONEY',
      provider: 'paystack',
      paymentUrl: response.data.data.authorization_url,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }

  async verifyPayment(reference: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      return response.data.status === true && 
             response.data.data.status === 'success';
    } catch (error) {
      return false;
    }
  }

  async createRefund(reference: string, amount: number): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/refund`,
      {
        transaction: reference,
        amount: amount * 100, // Convert to kobo
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data.reference;
  }

  async handleWebhook(body: any, headers: any): Promise<void> {
    const signature = headers['x-paystack-signature'];
    const webhookSecret = this.configService.get<string>('PAYSTACK_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Paystack webhook secret not configured');
    }

    // Verify webhook signature
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (hash !== signature) {
      throw new Error('Invalid Paystack webhook signature');
    }

    const { event, data } = body;

    switch (event) {
      case 'charge.success':
        await this.handlePaymentSuccess(data);
        break;
      case 'charge.failed':
        await this.handlePaymentFailed(data);
        break;
      case 'transfer.success':
        await this.handleTransferSuccess(data);
        break;
      case 'transfer.failed':
        await this.handleTransferFailed(data);
        break;
      default:
        console.log(`Unhandled Paystack event: ${event}`);
    }
  }

  private async handlePaymentSuccess(data: any): Promise<void> {
    console.log('Paystack payment successful:', data.reference);
    // Implementation would update the payment record in the database
  }

  private async handlePaymentFailed(data: any): Promise<void> {
    console.log('Paystack payment failed:', data.reference);
    // Implementation would update the payment record in the database
  }

  private async handleTransferSuccess(data: any): Promise<void> {
    console.log('Paystack transfer successful:', data.reference);
    // Implementation would handle successful transfers to providers
  }

  private async handleTransferFailed(data: any): Promise<void> {
    console.log('Paystack transfer failed:', data.reference);
    // Implementation would handle failed transfers and notify providers
  }

  // Create transfer to provider
  async createTransfer(data: {
    amount: number;
    recipient: string;
    reason: string;
    reference: string;
  }): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/transfer`,
      {
        source: 'balance',
        amount: data.amount * 100, // Convert to kobo
        recipient: data.recipient,
        reason: data.reason,
        reference: data.reference,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data;
  }

  // Get supported banks for Nigeria
  async getSupportedBanks(): Promise<any[]> {
    const response = await axios.get(
      `${this.baseUrl}/bank`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }

  // Get exchange rates
  async getExchangeRates(): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/rates`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }
}
