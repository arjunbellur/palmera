import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WebhookVerificationService } from '../webhook-verification.service';
import * as crypto from 'crypto';

describe('WebhookVerificationService', () => {
  let service: WebhookVerificationService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookVerificationService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<WebhookVerificationService>(WebhookVerificationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyStripeWebhook', () => {
    it('should verify valid Stripe webhook signature', () => {
      // Arrange
      const webhookSecret = 'whsec_test_secret';
      const payload = '{"type":"payment_intent.succeeded","data":{"object":{"id":"pi_test"}}}';
      const timestamp = Math.floor(Date.now() / 1000).toString();
      
      // Generate valid signature
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(timestamp + '.' + payload)
        .digest('hex');

      const stripeSignature = `t=${timestamp},v1=${signature}`;

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyStripeWebhook(payload, stripeSignature);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject invalid Stripe webhook signature', () => {
      // Arrange
      const webhookSecret = 'whsec_test_secret';
      const payload = '{"type":"payment_intent.succeeded","data":{"object":{"id":"pi_test"}}}';
      const invalidSignature = 't=1234567890,v1=invalid_signature';

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyStripeWebhook(payload, invalidSignature);

      // Assert
      expect(result).toBe(false);
    });

    it('should reject old Stripe webhook timestamp', () => {
      // Arrange
      const webhookSecret = 'whsec_test_secret';
      const payload = '{"type":"payment_intent.succeeded","data":{"object":{"id":"pi_test"}}}';
      const oldTimestamp = Math.floor((Date.now() - 400 * 1000) / 1000).toString(); // 400 seconds ago
      
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(oldTimestamp + '.' + payload)
        .digest('hex');

      const stripeSignature = `t=${oldTimestamp},v1=${signature}`;

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyStripeWebhook(payload, stripeSignature);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when webhook secret is not configured', () => {
      // Arrange
      const payload = '{"type":"payment_intent.succeeded"}';
      const signature = 't=1234567890,v1=test_signature';

      mockConfigService.get.mockReturnValue(undefined);

      // Act
      const result = service.verifyStripeWebhook(payload, signature);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('verifyFlutterwaveWebhook', () => {
    it('should verify valid Flutterwave webhook signature', () => {
      // Arrange
      const webhookSecret = 'flw_test_secret';
      const payload = { event: 'charge.completed', data: { id: '123' } };
      
      // Generate valid signature
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyFlutterwaveWebhook(payload, signature);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject invalid Flutterwave webhook signature', () => {
      // Arrange
      const webhookSecret = 'flw_test_secret';
      const payload = { event: 'charge.completed', data: { id: '123' } };
      const invalidSignature = 'invalid_signature';

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyFlutterwaveWebhook(payload, invalidSignature);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('verifyPaystackWebhook', () => {
    it('should verify valid Paystack webhook signature', () => {
      // Arrange
      const webhookSecret = 'paystack_test_secret';
      const payload = { event: 'charge.success', data: { id: '123' } };
      
      // Generate valid signature (Paystack uses SHA512)
      const signature = crypto
        .createHmac('sha512', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyPaystackWebhook(payload, signature);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject invalid Paystack webhook signature', () => {
      // Arrange
      const webhookSecret = 'paystack_test_secret';
      const payload = { event: 'charge.success', data: { id: '123' } };
      const invalidSignature = 'invalid_signature';

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyPaystackWebhook(payload, invalidSignature);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('verifyOrangeMoneyWebhook', () => {
    it('should verify valid Orange Money webhook signature', () => {
      // Arrange
      const webhookSecret = 'orange_test_secret';
      const payload = { event: 'payment.completed', data: { id: '123' } };
      
      // Generate valid signature
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyOrangeMoneyWebhook(payload, signature);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject invalid Orange Money webhook signature', () => {
      // Arrange
      const webhookSecret = 'orange_test_secret';
      const payload = { event: 'payment.completed', data: { id: '123' } };
      const invalidSignature = 'invalid_signature';

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyOrangeMoneyWebhook(payload, invalidSignature);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('verifyWebhook', () => {
    it('should route to correct provider verification method', () => {
      // Arrange
      const webhookSecret = 'test_secret';
      const payload = { event: 'test' };
      const signature = 'test_signature';

      mockConfigService.get.mockReturnValue(webhookSecret);

      const stripeSpy = jest.spyOn(service, 'verifyStripeWebhook').mockReturnValue(true);
      const flutterwaveSpy = jest.spyOn(service, 'verifyFlutterwaveWebhook').mockReturnValue(true);
      const paystackSpy = jest.spyOn(service, 'verifyPaystackWebhook').mockReturnValue(true);
      const orangeSpy = jest.spyOn(service, 'verifyOrangeMoneyWebhook').mockReturnValue(true);

      // Act & Assert
      service.verifyWebhook('stripe', payload, signature);
      expect(stripeSpy).toHaveBeenCalledWith(JSON.stringify(payload), signature);

      service.verifyWebhook('flutterwave', payload, signature);
      expect(flutterwaveSpy).toHaveBeenCalledWith(payload, signature);

      service.verifyWebhook('paystack', payload, signature);
      expect(paystackSpy).toHaveBeenCalledWith(payload, signature);

      service.verifyWebhook('orange_money', payload, signature);
      expect(orangeSpy).toHaveBeenCalledWith(payload, signature);

      // Cleanup
      stripeSpy.mockRestore();
      flutterwaveSpy.mockRestore();
      paystackSpy.mockRestore();
      orangeSpy.mockRestore();
    });

    it('should return false for unknown provider', () => {
      // Arrange
      const payload = { event: 'test' };
      const signature = 'test_signature';

      // Act
      const result = service.verifyWebhook('unknown_provider', payload, signature);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle crypto errors gracefully', () => {
      // Arrange
      const webhookSecret = 'whsec_test_secret';
      const payload = 'invalid json';
      const signature = 't=1234567890,v1=test_signature';

      mockConfigService.get.mockReturnValue(webhookSecret);

      // Act
      const result = service.verifyStripeWebhook(payload, signature);

      // Assert
      expect(result).toBe(false);
    });
  });
});
