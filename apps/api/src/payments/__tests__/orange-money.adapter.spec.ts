import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OrangeMoneyAdapter } from '../adapters/orange-money.adapter';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OrangeMoneyAdapter', () => {
  let adapter: OrangeMoneyAdapter;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrangeMoneyAdapter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                ORANGE_MONEY_BASE_URL: 'https://api.orange.com/orange-money-webpay/dev/v1',
                ORANGE_MONEY_MERCHANT_ID: 'test-merchant-id',
                ORANGE_MONEY_API_KEY: 'test-api-key',
                ORANGE_MONEY_WEBHOOK_SECRET: 'test-webhook-secret',
                FRONTEND_URL: 'http://localhost:3000',
                API_URL: 'http://localhost:3001',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    adapter = module.get<OrangeMoneyAdapter>(OrangeMoneyAdapter);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createIntent', () => {
    it('should create a payment intent successfully', async () => {
      const mockResponse = {
        data: {
          status: 'SUCCESS',
          pay_token: 'https://payment.orange.com/pay/abc123',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await adapter.createIntent({
        amount: 50000,
        currency: 'XOF',
        meta: { bookingId: 'booking-123' },
        customer: {
          email: 'test@example.com',
          phone: '+221771234567',
          name: 'John Doe',
        },
      });

      expect(result).toEqual({
        checkoutUrl: 'https://payment.orange.com/pay/abc123',
        reference: expect.stringMatching(/^palmera_om_\d+_[a-z0-9]+$/),
        amount: 50000,
        currency: 'XOF',
        expiresAt: expect.any(Date),
        metadata: expect.objectContaining({
          orange_money_token: 'https://payment.orange.com/pay/abc123',
          original_amount: 50000,
          original_currency: 'XOF',
        }),
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.orange.com/orange-money-webpay/dev/v1/webpayments',
        expect.objectContaining({
          merchant_id: 'test-merchant-id',
          amount: 50000,
          currency: 'XOF',
          order_id: expect.stringMatching(/^palmera_om_\d+_[a-z0-9]+$/),
          return_url: 'http://localhost:3000/payment/callback?provider=orange_money',
          cancel_url: 'http://localhost:3000/payment/cancel?provider=orange_money',
          notify_url: 'http://localhost:3001/payments/webhooks/orange-money',
          customer: {
            phone: '+221771234567',
            email: 'test@example.com',
            name: 'John Doe',
          },
          metadata: expect.objectContaining({
            bookingId: 'booking-123',
            original_amount: 50000,
            original_currency: 'XOF',
          }),
        }),
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 30000,
        })
      );
    });

    it('should convert USD to XOF', async () => {
      const mockResponse = {
        data: {
          status: 'SUCCESS',
          pay_token: 'https://payment.orange.com/pay/abc123',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await adapter.createIntent({
        amount: 100,
        currency: 'USD',
        meta: { bookingId: 'booking-123' },
      });

      expect(result.amount).toBe(60000); // 100 USD * 600 XOF/USD
      expect(result.currency).toBe('XOF');
      expect(result.metadata?.conversion_rate).toBe(600);
    });

    it('should throw error when API call fails', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        adapter.createIntent({
          amount: 50000,
          currency: 'XOF',
        })
      ).rejects.toThrow('Failed to create Orange Money payment intent');
    });

    it('should throw error when API returns failure status', async () => {
      const mockResponse = {
        data: {
          status: 'FAILED',
          message: 'Invalid merchant ID',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await expect(
        adapter.createIntent({
          amount: 50000,
          currency: 'XOF',
        })
      ).rejects.toThrow('Orange Money payment creation failed: Invalid merchant ID');
    });
  });

  describe('refund', () => {
    it('should process refund successfully', async () => {
      const mockResponse = {
        data: {
          status: 'SUCCESS',
          refund_id: 'refund-123',
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await adapter.refund('payment-123', 25000);

      expect(result).toEqual({
        refundId: 'refund-123',
        status: 'success',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.orange.com/orange-money-webpay/dev/v1/refunds',
        {
          merchant_id: 'test-merchant-id',
          order_id: 'payment-123',
          amount: 25000,
        },
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle refund failure', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Refund failed'));

      const result = await adapter.refund('payment-123', 25000);

      expect(result).toEqual({
        refundId: '',
        status: 'failed',
      });
    });
  });

  describe('verifyWebhook', () => {
    it('should verify webhook signature and parse event', () => {
      const payload = {
        event_type: 'PAYMENT_SUCCESS',
        order_id: 'palmera_om_1234567890_abc123',
        amount: 50000,
        currency: 'XOF',
        timestamp: '2024-01-01T12:00:00Z',
        metadata: { bookingId: 'booking-123' },
      };

      const raw = Buffer.from(JSON.stringify(payload));
      const signature = require('crypto')
        .createHmac('sha256', 'test-webhook-secret')
        .update(raw)
        .digest('hex');

      const headers = {
        'x-orange-signature': signature,
      };

      const result = adapter.verifyWebhook(raw, headers);

      expect(result).toEqual({
        type: 'payment.success',
        reference: 'palmera_om_1234567890_abc123',
        amount: 50000,
        currency: 'XOF',
        metadata: { bookingId: 'booking-123' },
        timestamp: new Date('2024-01-01T12:00:00Z'),
        provider: 'orange_money',
      });
    });

    it('should throw error for invalid signature', () => {
      const payload = { event_type: 'PAYMENT_SUCCESS' };
      const raw = Buffer.from(JSON.stringify(payload));
      const headers = { 'x-orange-signature': 'invalid-signature' };

      expect(() => adapter.verifyWebhook(raw, headers)).toThrow(
        'Invalid Orange Money webhook signature'
      );
    });

    it('should throw error for missing signature', () => {
      const payload = { event_type: 'PAYMENT_SUCCESS' };
      const raw = Buffer.from(JSON.stringify(payload));
      const headers = {};

      expect(() => adapter.verifyWebhook(raw, headers)).toThrow(
        'Missing Orange Money webhook signature'
      );
    });

    it('should map different event types correctly', () => {
      const eventTypes = [
        { input: 'PAYMENT_SUCCESS', expected: 'payment.success' },
        { input: 'PAYMENT_FAILED', expected: 'payment.failed' },
        { input: 'PAYMENT_PENDING', expected: 'payment.pending' },
        { input: 'REFUND_SUCCESS', expected: 'refund.success' },
        { input: 'REFUND_FAILED', expected: 'refund.failed' },
        { input: 'UNKNOWN_EVENT', expected: 'payment.pending' },
      ];

      eventTypes.forEach(({ input, expected }) => {
        const payload = {
          event_type: input,
          order_id: 'test-123',
          amount: 1000,
          currency: 'XOF',
          timestamp: new Date().toISOString(),
        };

        const raw = Buffer.from(JSON.stringify(payload));
        const signature = require('crypto')
          .createHmac('sha256', 'test-webhook-secret')
          .update(raw)
          .digest('hex');

        const headers = { 'x-orange-signature': signature };

        const result = adapter.verifyWebhook(raw, headers);
        expect(result.type).toBe(expected);
      });
    });
  });

  describe('getSupportedMethods', () => {
    it('should return supported payment methods', () => {
      const methods = adapter.getSupportedMethods();
      expect(methods).toEqual(['MOBILE_MONEY', 'USSD', 'APP']);
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return supported currencies', () => {
      const currencies = adapter.getSupportedCurrencies();
      expect(currencies).toEqual(['XOF']);
    });
  });

  describe('supportsCountry', () => {
    it('should support West African countries', () => {
      const supportedCountries = ['SN', 'CI', 'ML', 'BF', 'NE', 'GN'];
      
      supportedCountries.forEach(country => {
        expect(adapter.supportsCountry(country)).toBe(true);
      });
    });

    it('should not support other countries', () => {
      const unsupportedCountries = ['US', 'GB', 'FR', 'DE', 'NG'];
      
      unsupportedCountries.forEach(country => {
        expect(adapter.supportsCountry(country)).toBe(false);
      });
    });
  });

  describe('getPaymentInstructions', () => {
    it('should return payment instructions', () => {
      const instructions = adapter.getPaymentInstructions('test-reference');
      
      expect(instructions).toEqual({
        ussd: '*144*1*test-reference#',
        app: 'Open Orange Money app and enter reference',
        web: 'Complete payment on Orange Money web portal',
      });
    });
  });

  describe('checkPaymentStatus', () => {
    it('should return payment status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'SUCCESS',
          amount: 50000,
          currency: 'XOF',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await adapter.checkPaymentStatus('test-reference');

      expect(result).toEqual({
        status: 'success',
        amount: 50000,
        currency: 'XOF',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.orange.com/orange-money-webpay/dev/v1/payments/test-reference',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-api-key',
          },
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

      const result = await adapter.checkPaymentStatus('test-reference');

      expect(result).toEqual({ status: 'pending' });
    });
  });
});
