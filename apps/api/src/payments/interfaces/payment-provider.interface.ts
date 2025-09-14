export interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  customer: {
    email: string;
    phone?: string;
    name?: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  reference: string;
  providerReference?: string;
  redirectUrl?: string;
  qrCode?: string;
  instructions?: string;
  error?: string;
}

export interface PaymentVerification {
  success: boolean;
  status: 'INITIATED' | 'PENDING' | 'CONFIRMED' | 'FAILED';
  amount?: number;
  currency?: string;
  providerReference?: string;
  error?: string;
}

export interface PaymentProvider {
  readonly name: string;
  
  initiatePayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(reference: string): Promise<PaymentVerification>;
  refundPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string; error?: string }>;
}

export enum PaymentMethod {
  CARD = 'CARD',
  ORANGE_MONEY_SN = 'ORANGE_MONEY_SN',
  WAVE_SN = 'WAVE_SN',
  FREE_MONEY_SN = 'FREE_MONEY_SN',
}

export enum PaymentProviderType {
  FLUTTERWAVE = 'FLUTTERWAVE',
  CINETPAY = 'CINETPAY',
  PAYDUNYA = 'PAYDUNYA',
  ORANGE_WEBPAY = 'ORANGE_WEBPAY',
}
