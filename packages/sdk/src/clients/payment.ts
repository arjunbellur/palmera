import { AxiosInstance } from 'axios';
import {
  Payment,
  PaymentIntent,
  CreatePaymentIntentRequest,
  PaymentConfirmation,
  CreateRefundRequest,
  Refund,
  MobileMoneyPayment,
  CardPayment,
  OrangeMoneyInstructions,
  OrangeMoneyStatus,
  PaymentProviders,
  PaymentMethods,
} from '@palmera/schemas';
import { createApiError } from '../utils/errors';

export class PaymentClient {
  constructor(private http: AxiosInstance) {}

  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    try {
      const response = await this.http.post('/payments/intent', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async confirmPayment(data: PaymentConfirmation): Promise<Payment> {
    try {
      const response = await this.http.post('/payments/confirm', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getPayment(id: string): Promise<Payment> {
    try {
      const response = await this.http.get(`/payments/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getPayments(bookingId?: string): Promise<Payment[]> {
    try {
      const response = await this.http.get('/payments', {
        params: bookingId ? { bookingId } : undefined,
      });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async processMobileMoneyPayment(data: MobileMoneyPayment): Promise<PaymentIntent> {
    try {
      const response = await this.http.post('/payments/mobile-money', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async processCardPayment(data: CardPayment): Promise<PaymentIntent> {
    try {
      const response = await this.http.post('/payments/card', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async createRefund(data: CreateRefundRequest): Promise<Refund> {
    try {
      const response = await this.http.post('/payments/refund', data);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getRefunds(paymentId?: string): Promise<Refund[]> {
    try {
      const response = await this.http.get('/payments/refunds', {
        params: paymentId ? { paymentId } : undefined,
      });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getPaymentMethods(): Promise<string[]> {
    try {
      const response = await this.http.get('/payments/methods');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const response = await this.http.get('/payments/currencies');
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  // Orange Money specific methods
  async getOrangeMoneyInstructions(reference: string): Promise<OrangeMoneyInstructions> {
    try {
      const response = await this.http.post('/payments/orange-money/instructions', { reference });
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async checkOrangeMoneyStatus(reference: string): Promise<OrangeMoneyStatus> {
    try {
      const response = await this.http.get(`/payments/orange-money/status/${reference}`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  // Payment provider methods
  async getPaymentProviders(country: string): Promise<PaymentProviders> {
    try {
      const response = await this.http.get(`/payments/providers/${country}`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }

  async getPaymentMethodsForProvider(provider: string): Promise<PaymentMethods> {
    try {
      const response = await this.http.get(`/payments/methods/${provider}`);
      return response.data.data;
    } catch (error: any) {
      throw createApiError(error);
    }
  }
}
