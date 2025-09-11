import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FlutterwaveService {
  private baseUrl = 'https://api.flutterwave.com/v3';
  private secretKey: string;
  private publicKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY')!;
    this.publicKey = this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY')!;
  }

  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  }): Promise<any> {
    const { amount, currency, metadata } = data;

    const response = await axios.post(
      `${this.baseUrl}/payments`,
      {
        tx_ref: `palmera_${Date.now()}`,
        amount,
        currency,
        redirect_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
        customer: {
          email: metadata?.email || 'customer@palmera.com',
          name: metadata?.name || 'Palmera Customer',
        },
        customizations: {
          title: 'Palmera Premium Experiences',
          description: 'Payment for premium experience booking',
          logo: 'https://palmera.com/logo.png',
        },
        meta: metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      id: response.data.data.tx_ref,
      amount: response.data.data.amount,
      currency: response.data.data.currency,
      method: 'MOBILE_MONEY',
      provider: 'flutterwave',
      paymentUrl: response.data.data.link,
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
      `${this.baseUrl}/payments`,
      {
        tx_ref: `palmera_mobile_${Date.now()}`,
        amount,
        currency,
        phone_number: phone,
        network: network || 'MTN',
        redirect_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
        customer: {
          phone_number: phone,
        },
        customizations: {
          title: 'Palmera Premium Experiences',
          description: 'Mobile money payment for booking',
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
      id: response.data.data.tx_ref,
      amount: response.data.data.amount,
      currency: response.data.data.currency,
      method: 'MOBILE_MONEY',
      provider: 'flutterwave',
      paymentUrl: response.data.data.link,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      return response.data.status === 'success' && 
             response.data.data.status === 'successful';
    } catch (error) {
      return false;
    }
  }

  async createRefund(transactionId: string, amount: number): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/transactions/${transactionId}/refund`,
      {
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data.id;
  }

  async handleWebhook(body: any, headers: any): Promise<void> {
    const signature = headers['verif-hash'];
    const webhookSecret = this.configService.get<string>('FLUTTERWAVE_WEBHOOK_SECRET');

    if (!webhookSecret || signature !== webhookSecret) {
      throw new Error('Invalid Flutterwave webhook signature');
    }

    const { event, data } = body;

    switch (event) {
      case 'charge.completed':
        await this.handlePaymentCompleted(data);
        break;
      case 'charge.failed':
        await this.handlePaymentFailed(data);
        break;
      case 'transfer.completed':
        await this.handleTransferCompleted(data);
        break;
      default:
        console.log(`Unhandled Flutterwave event: ${event}`);
    }
  }

  private async handlePaymentCompleted(data: any): Promise<void> {
    console.log('Flutterwave payment completed:', data.tx_ref);
    // Implementation would update the payment record in the database
  }

  private async handlePaymentFailed(data: any): Promise<void> {
    console.log('Flutterwave payment failed:', data.tx_ref);
    // Implementation would update the payment record in the database
  }

  private async handleTransferCompleted(data: any): Promise<void> {
    console.log('Flutterwave transfer completed:', data.id);
    // Implementation would handle successful transfers to providers
  }

  // Get supported mobile money networks for Senegal
  async getSupportedNetworks(): Promise<string[]> {
    return ['MTN', 'ORANGE', 'FREE', 'EXPRESSO'];
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
