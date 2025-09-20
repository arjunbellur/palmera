import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './services/stripe.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripeService,
    PrismaService,
  ],
  exports: [PaymentsService, StripeService],
})
export class PaymentsModule {}
