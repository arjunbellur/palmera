import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PaymentAdapter, PaymentIntent, VerifiedEvent } from '../interfaces/payment-adapter.interface';

interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
  baseUrl: string;
}

interface FlutterwavePaymentRequest {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url?: string;
  payment_options?: string;
  customer: {
    email: string;
    phone_number?: string;
    name?: string;
  };
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  meta?: Record<string, any>;
}

interface FlutterwavePaymentResponse {
  status: string;
  message: string;
  data?: {
    link?: string;
    reference?: string;
  };
}

interface FlutterwaveVerificationResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    card: any;
    created_at: string;
    status: string;
  };
}

@Injectable()
export class FlutterwaveAdapter implements PaymentAdapter {
  private readonly logger = new Logger(FlutterwaveAdapter.name);
  private readonly httpClient: AxiosInstance;
  private readonly config: FlutterwaveConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      publicKey: this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY'),
      secretKey: this.configService.get<string>('FLUTTERWAVE_SECRET_KEY'),
      baseUrl: this.configService.get<string>('FLUTTERWAVE_BASE_URL', 'https://api.flutterwave.com/v3'),
    };

    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/json',
      },
    });
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
    try {
      const reference = `palmera_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const flutterwaveRequest: FlutterwavePaymentRequest = {
        tx_ref: reference,
        amount: input.amount,
        currency: input.currency,
        redirect_url: `${this.configService.get<string>('APP_URL')}/payments/callback`,
        payment_options: 'card,mobilemoney',
        customer: {
          email: input.customer?.email || '',
          phone_number: input.customer?.phone,
          name: input.customer?.name,
        },
        customizations: {
          title: 'Palmera Experience Booking',
          description: 'Payment for your Palmera experience',
        },
        meta: input.meta,
      };

      this.logger.log(`Creating Flutterwave payment intent for reference: ${reference}`);

      const response = await this.httpClient.post<FlutterwavePaymentResponse>(
        '/payments',
        flutterwaveRequest
      );

      if (response.data.status === 'success' && response.data.data?.link) {
        return {
          checkoutUrl: response.data.data.link,
          reference: reference,
          amount: input.amount,
          currency: input.currency,
          metadata: input.meta,
        };
      }

      throw new Error(response.data.message || 'Failed to create payment intent');
    } catch (error) {
      this.logger.error(`Flutterwave payment intent creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async refund(reference: string, amountMinor?: number): Promise<{
    refundId: string;
    status: 'success' | 'failed' | 'pending';
  }> {
    try {
      this.logger.log(`Processing Flutterwave refund for reference: ${reference}`);

      const response = await this.httpClient.post('/refunds', {
        tx_ref: reference,
        amount: amountMinor,
      });

      if (response.data.status === 'success') {
        return {
          refundId: response.data.data.id?.toString() || reference,
          status: 'success',
        };
      }

      return {
        refundId: reference,
        status: 'failed',
      };
    } catch (error) {
      this.logger.error(`Flutterwave refund failed: ${error.message}`, error.stack);
      return {
        refundId: reference,
        status: 'failed',
      };
    }
  }

  verifyWebhook(raw: Buffer, headers: Record<string, string>): VerifiedEvent {
    const signature = headers['verif-hash'];
    if (!signature) {
      throw new Error('Missing Flutterwave signature');
    }

    const body = JSON.parse(raw.toString());
    
    return {
      type: this.mapFlutterwaveEventType(body.event),
      reference: body.data?.tx_ref || '',
      amount: body.data?.amount || 0,
      currency: body.data?.currency || 'XOF',
      metadata: body.data,
      timestamp: new Date(),
      provider: 'flutterwave',
    };
  }

  getSupportedMethods(): string[] {
    return ['card', 'mobilemoney'];
  }

  getSupportedCurrencies(): string[] {
    return ['XOF', 'NGN', 'GHS', 'KES', 'USD', 'EUR'];
  }

  supportsCountry(country: string): boolean {
    const supportedCountries = ['SN', 'NG', 'GH', 'KE', 'CI', 'ML', 'BF', 'NE', 'GN'];
    return supportedCountries.includes(country);
  }

  private mapFlutterwaveEventType(event: string): 'payment.success' | 'payment.failed' | 'payment.pending' | 'refund.success' | 'refund.failed' {
    switch (event) {
      case 'charge.completed':
        return 'payment.success';
      case 'charge.failed':
        return 'payment.failed';
      case 'charge.pending':
        return 'payment.pending';
      case 'refund.completed':
        return 'refund.success';
      case 'refund.failed':
        return 'refund.failed';
      default:
        return 'payment.pending';
    }
  }
}