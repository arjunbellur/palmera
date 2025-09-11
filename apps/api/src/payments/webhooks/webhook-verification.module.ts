import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookVerificationService } from './webhook-verification.service';

@Module({
  imports: [ConfigModule],
  providers: [WebhookVerificationService],
  exports: [WebhookVerificationService],
})
export class WebhookVerificationModule {}
