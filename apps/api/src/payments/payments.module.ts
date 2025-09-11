import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './services/stripe.service';
import { FlutterwaveService } from './services/flutterwave.service';
import { PaystackService } from './services/paystack.service';
import { StripeAdapter } from './adapters/stripe.adapter';
import { FlutterwaveAdapter } from './adapters/flutterwave.adapter';
import { OrangeMoneyAdapter } from './adapters/orange-money.adapter';
import { PaystackAdapter } from './adapters/paystack.adapter';
import { PaymentRegistryImpl } from './registry';
import { WebhookVerificationModule } from './webhooks/webhook-verification.module';

@Module({
  imports: [ConfigModule, WebhookVerificationModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripeService,
    FlutterwaveService,
    PaystackService,
    StripeAdapter,
    FlutterwaveAdapter,
    OrangeMoneyAdapter,
    PaystackAdapter,
    {
      provide: 'PaymentRegistry',
      useFactory: (
        stripeAdapter: StripeAdapter,
        flutterwaveAdapter: FlutterwaveAdapter,
        orangeMoneyAdapter: OrangeMoneyAdapter,
        paystackAdapter: PaystackAdapter,
      ) => new PaymentRegistryImpl(stripeAdapter, flutterwaveAdapter, orangeMoneyAdapter, paystackAdapter),
      inject: [StripeAdapter, FlutterwaveAdapter, OrangeMoneyAdapter, PaystackAdapter],
    },
  ],
  exports: [PaymentsService, 'PaymentRegistry'],
})
export class PaymentsModule {}
