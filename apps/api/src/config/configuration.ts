import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.validation';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  mobileAppUrl: string;
  corsOrigins: string[];
}

export interface DatabaseConfig {
  url: string;
  directUrl: string;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
}

export interface EmailConfig {
  provider: 'resend' | 'postmark' | 'ses';
  from: string;
  fromName: string;
  resendApiKey?: string;
  postmarkApiKey?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion: string;
}

export interface PaymentConfig {
  stripe: {
    publishableKey?: string;
    secretKey?: string;
    webhookSecret?: string;
  };
  flutterwave: {
    publicKey?: string;
    secretKey?: string;
    webhookSecret?: string;
  };
  paystack: {
    publicKey?: string;
    secretKey?: string;
    webhookSecret?: string;
  };
  orangeMoney: {
    merchantId?: string;
    clientId?: string;
    clientSecret?: string;
    webhookSecret?: string;
    baseUrl?: string;
  };
}

export interface StorageConfig {
  provider: 's3' | 'r2';
  s3: {
    bucketName?: string;
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: string;
  };
  r2: {
    accountId?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucketName?: string;
    publicUrl?: string;
  };
}

export interface MonitoringConfig {
  sentry: {
    dsn?: string;
    org?: string;
    project?: string;
  };
  otel: {
    endpoint?: string;
    headers?: string;
    serviceName: string;
    serviceVersion: string;
  };
}

export interface FeatureFlags {
  enableAnalytics: boolean;
  enableDebugLogs: boolean;
  enableWebhookLogging: boolean;
}

export class ConfigurationService {
  constructor(private configService: ConfigService<EnvConfig>) {}

  get app(): AppConfig {
    return {
      port: this.configService.get('PORT', { infer: true }),
      nodeEnv: this.configService.get('NODE_ENV', { infer: true }),
      frontendUrl: this.configService.get('FRONTEND_URL', { infer: true }),
      mobileAppUrl: this.configService.get('MOBILE_APP_URL', { infer: true }),
      corsOrigins: this.configService.get('CORS_ORIGINS', { infer: true })?.split(',') || [],
    };
  }

  get database(): DatabaseConfig {
    return {
      url: this.configService.get('DATABASE_URL', { infer: true }),
      directUrl: this.configService.get('DIRECT_URL', { infer: true }),
    };
  }

  get auth(): AuthConfig {
    return {
      jwtSecret: this.configService.get('JWT_SECRET', { infer: true }),
      jwtExpiresIn: this.configService.get('JWT_EXPIRES_IN', { infer: true }),
      jwtRefreshSecret: this.configService.get('JWT_REFRESH_SECRET', { infer: true }),
      jwtRefreshExpiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', { infer: true }),
    };
  }

  get email(): EmailConfig {
    return {
      provider: this.configService.get('EMAIL_PROVIDER', { infer: true }),
      from: this.configService.get('EMAIL_FROM', { infer: true }),
      fromName: this.configService.get('EMAIL_FROM_NAME', { infer: true }),
      resendApiKey: this.configService.get('RESEND_API_KEY', { infer: true }),
      postmarkApiKey: this.configService.get('POSTMARK_API_KEY', { infer: true }),
      awsAccessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', { infer: true }),
      awsSecretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', { infer: true }),
      awsRegion: this.configService.get('AWS_REGION', { infer: true }),
    };
  }

  get payments(): PaymentConfig {
    return {
      stripe: {
        publishableKey: this.configService.get('STRIPE_PUBLISHABLE_KEY', { infer: true }),
        secretKey: this.configService.get('STRIPE_SECRET_KEY', { infer: true }),
        webhookSecret: this.configService.get('STRIPE_WEBHOOK_SECRET', { infer: true }),
      },
      flutterwave: {
        publicKey: this.configService.get('FLUTTERWAVE_PUBLIC_KEY', { infer: true }),
        secretKey: this.configService.get('FLUTTERWAVE_SECRET_KEY', { infer: true }),
        webhookSecret: this.configService.get('FLUTTERWAVE_WEBHOOK_SECRET', { infer: true }),
      },
      paystack: {
        publicKey: this.configService.get('PAYSTACK_PUBLIC_KEY', { infer: true }),
        secretKey: this.configService.get('PAYSTACK_SECRET_KEY', { infer: true }),
        webhookSecret: this.configService.get('PAYSTACK_WEBHOOK_SECRET', { infer: true }),
      },
      orangeMoney: {
        merchantId: this.configService.get('ORANGE_MONEY_MERCHANT_ID', { infer: true }),
        clientId: this.configService.get('ORANGE_MONEY_CLIENT_ID', { infer: true }),
        clientSecret: this.configService.get('ORANGE_MONEY_CLIENT_SECRET', { infer: true }),
        webhookSecret: this.configService.get('ORANGE_MONEY_WEBHOOK_SECRET', { infer: true }),
        baseUrl: this.configService.get('ORANGE_MONEY_BASE_URL', { infer: true }),
      },
    };
  }

  get storage(): StorageConfig {
    return {
      provider: this.configService.get('STORAGE_PROVIDER', { infer: true }),
      s3: {
        bucketName: this.configService.get('S3_BUCKET_NAME', { infer: true }),
        region: this.configService.get('S3_REGION', { infer: true }),
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY', { infer: true }),
        endpoint: this.configService.get('S3_ENDPOINT', { infer: true }),
      },
      r2: {
        accountId: this.configService.get('R2_ACCOUNT_ID', { infer: true }),
        accessKeyId: this.configService.get('R2_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY', { infer: true }),
        bucketName: this.configService.get('R2_BUCKET_NAME', { infer: true }),
        publicUrl: this.configService.get('R2_PUBLIC_URL', { infer: true }),
      },
    };
  }

  get monitoring(): MonitoringConfig {
    return {
      sentry: {
        dsn: this.configService.get('SENTRY_DSN', { infer: true }),
        org: this.configService.get('SENTRY_ORG', { infer: true }),
        project: this.configService.get('SENTRY_PROJECT', { infer: true }),
      },
      otel: {
        endpoint: this.configService.get('OTEL_EXPORTER_OTLP_ENDPOINT', { infer: true }),
        headers: this.configService.get('OTEL_EXPORTER_OTLP_HEADERS', { infer: true }),
        serviceName: this.configService.get('OTEL_SERVICE_NAME', { infer: true }),
        serviceVersion: this.configService.get('OTEL_SERVICE_VERSION', { infer: true }),
      },
    };
  }

  get features(): FeatureFlags {
    return {
      enableAnalytics: this.configService.get('ENABLE_ANALYTICS', { infer: true }),
      enableDebugLogs: this.configService.get('ENABLE_DEBUG_LOGS', { infer: true }),
      enableWebhookLogging: this.configService.get('ENABLE_WEBHOOK_LOGGING', { infer: true }),
    };
  }
}
