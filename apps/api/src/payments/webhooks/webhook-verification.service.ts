import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebhookVerificationService {
  private readonly logger = new Logger(WebhookVerificationService.name);

  constructor(private configService: ConfigService) {}

  verifyStripeWebhook(payload: string, signature: string): boolean {
    try {
      const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        this.logger.warn('Stripe webhook secret not configured');
        return false;
      }

      const elements = signature.split(',');
      const signatureHash = elements.find(el => el.startsWith('v1='))?.split('=')[1];
      const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1];

      if (!signatureHash || !timestamp) {
        this.logger.warn('Invalid Stripe webhook signature format');
        return false;
      }

      // Check timestamp (prevent replay attacks)
      const currentTime = Math.floor(Date.now() / 1000);
      const webhookTime = parseInt(timestamp);
      if (Math.abs(currentTime - webhookTime) > 300) { // 5 minutes tolerance
        this.logger.warn('Stripe webhook timestamp too old');
        return false;
      }

      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(timestamp + '.' + payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signatureHash, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      this.logger.error('Stripe webhook verification failed:', error);
      return false;
    }
  }

  verifyFlutterwaveWebhook(payload: any, signature: string): boolean {
    try {
      const webhookSecret = this.configService.get<string>('FLUTTERWAVE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        this.logger.warn('Flutterwave webhook secret not configured');
        return false;
      }

      // Flutterwave uses HMAC SHA256 with the webhook secret
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      this.logger.error('Flutterwave webhook verification failed:', error);
      return false;
    }
  }

  verifyPaystackWebhook(payload: any, signature: string): boolean {
    try {
      const webhookSecret = this.configService.get<string>('PAYSTACK_WEBHOOK_SECRET');
      if (!webhookSecret) {
        this.logger.warn('Paystack webhook secret not configured');
        return false;
      }

      // Paystack uses HMAC SHA512 with the webhook secret
      const expectedSignature = crypto
        .createHmac('sha512', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      this.logger.error('Paystack webhook verification failed:', error);
      return false;
    }
  }

  verifyOrangeMoneyWebhook(payload: any, signature: string): boolean {
    try {
      const webhookSecret = this.configService.get<string>('ORANGE_MONEY_WEBHOOK_SECRET');
      if (!webhookSecret) {
        this.logger.warn('Orange Money webhook secret not configured');
        return false;
      }

      // Orange Money uses HMAC SHA256 with the webhook secret
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      this.logger.error('Orange Money webhook verification failed:', error);
      return false;
    }
  }

  verifyWebhook(provider: string, payload: string | any, signature: string): boolean {
    switch (provider.toLowerCase()) {
      case 'stripe':
        return this.verifyStripeWebhook(
          typeof payload === 'string' ? payload : JSON.stringify(payload),
          signature
        );
      case 'flutterwave':
        return this.verifyFlutterwaveWebhook(payload, signature);
      case 'paystack':
        return this.verifyPaystackWebhook(payload, signature);
      case 'orange_money':
        return this.verifyOrangeMoneyWebhook(payload, signature);
      default:
        this.logger.warn(`Unknown payment provider: ${provider}`);
        return false;
    }
  }
}
