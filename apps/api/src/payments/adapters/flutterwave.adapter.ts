import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { 
  PaymentProvider, 
  PaymentRequest, 
  PaymentResponse, 
  PaymentVerification,
  PaymentMethod 
} from '../interfaces/payment-provider.interface';

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
export class FlutterwaveAdapter implements PaymentProvider {
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

  get name(): string {
    return 'FLUTTERWAVE';
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const flutterwaveRequest: FlutterwavePaymentRequest = {
        tx_ref: request.reference,
        amount: request.amount,
        currency: request.currency,
        redirect_url: `${this.configService.get<string>('APP_URL')}/payments/callback`,
        payment_options: this.getPaymentOptions(request.metadata?.method),
        customer: {
          email: request.customer.email,
          phone_number: request.customer.phone,
          name: request.customer.name,
        },
        customizations: {
          title: 'Palmera Experience Booking',
          description: 'Payment for your Palmera experience',
        },
        meta: request.metadata,
      };

      this.logger.log(`Initiating Flutterwave payment for reference: ${request.reference}`);

      const response = await this.httpClient.post<FlutterwavePaymentResponse>(
        '/payments',
        flutterwaveRequest
      );

      if (response.data.status === 'success' && response.data.data?.link) {
        return {
          success: true,
          reference: request.reference,
          providerReference: response.data.data.reference,
          redirectUrl: response.data.data.link,
        };
      }

      return {
        success: false,
        reference: request.reference,
        error: response.data.message || 'Failed to initiate payment',
      };
    } catch (error) {
      this.logger.error(`Flutterwave payment initiation failed: ${error.message}`, error.stack);
      return {
        success: false,
        reference: request.reference,
        error: 'Payment initiation failed',
      };
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerification> {
    try {
      this.logger.log(`Verifying Flutterwave payment for reference: ${reference}`);

      const response = await this.httpClient.get<FlutterwaveVerificationResponse>(
        `/transactions/${reference}/verify`
      );

      if (response.data.status === 'success' && response.data.data) {
        const payment = response.data.data;
        return {
          success: true,
          status: this.mapFlutterwaveStatus(payment.status),
          amount: payment.amount,
          currency: payment.currency,
          providerReference: payment.flw_ref,
        };
      }

      return {
        success: false,
        status: 'FAILED',
        error: response.data.message || 'Payment verification failed',
      };
    } catch (error) {
      this.logger.error(`Flutterwave payment verification failed: ${error.message}`, error.stack);
      return {
        success: false,
        status: 'FAILED',
        error: 'Payment verification failed',
      };
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
      this.logger.log(`Processing Flutterwave refund for payment: ${paymentId}`);

      const response = await this.httpClient.post('/refunds', {
        id: paymentId,
        amount: amount,
      });

      if (response.data.status === 'success') {
        return {
          success: true,
          refundId: response.data.data.id?.toString(),
        };
      }

      return {
        success: false,
        error: response.data.message || 'Refund failed',
      };
    } catch (error) {
      this.logger.error(`Flutterwave refund failed: ${error.message}`, error.stack);
      return {
        success: false,
        error: 'Refund failed',
      };
    }
  }

  private getPaymentOptions(method?: string): string {
    switch (method) {
      case PaymentMethod.CARD:
        return 'card';
      case PaymentMethod.ORANGE_MONEY_SN:
        return 'mobilemoney';
      case PaymentMethod.WAVE_SN:
        return 'mobilemoney';
      case PaymentMethod.FREE_MONEY_SN:
        return 'mobilemoney';
      default:
        return 'card,mobilemoney';
    }
  }

  private mapFlutterwaveStatus(status: string): 'INITIATED' | 'PENDING' | 'CONFIRMED' | 'FAILED' {
    switch (status.toLowerCase()) {
      case 'successful':
        return 'CONFIRMED';
      case 'pending':
        return 'PENDING';
      case 'failed':
      case 'cancelled':
        return 'FAILED';
      default:
        return 'INITIATED';
    }
  }
}