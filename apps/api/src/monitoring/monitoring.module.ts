import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SentryService } from './sentry.service';
import { TelemetryService } from './telemetry.service';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule],
  controllers: [HealthController],
  providers: [SentryService, TelemetryService],
  exports: [SentryService, TelemetryService],
})
export class MonitoringModule {}
