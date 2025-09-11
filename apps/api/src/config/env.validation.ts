import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3002'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  MOBILE_APP_URL: z.string().url().default('http://localhost:8081'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),

  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Email
  EMAIL_PROVIDER: z.enum(['resend', 'postmark', 'ses']).default('resend'),
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email'),
  EMAIL_FROM_NAME: z.string().default('Palmera'),

  // Resend
  RESEND_API_KEY: z.string().optional(),

  // Postmark
  POSTMARK_API_KEY: z.string().optional(),

  // AWS SES
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),

  // Stripe
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Flutterwave
  FLUTTERWAVE_PUBLIC_KEY: z.string().optional(),
  FLUTTERWAVE_SECRET_KEY: z.string().optional(),
  FLUTTERWAVE_WEBHOOK_SECRET: z.string().optional(),

  // Paystack
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),

  // Orange Money
  ORANGE_MONEY_MERCHANT_ID: z.string().optional(),
  ORANGE_MONEY_CLIENT_ID: z.string().optional(),
  ORANGE_MONEY_CLIENT_SECRET: z.string().optional(),
  ORANGE_MONEY_WEBHOOK_SECRET: z.string().optional(),
  ORANGE_MONEY_BASE_URL: z.string().url().optional(),

  // File Storage
  STORAGE_PROVIDER: z.enum(['s3', 'r2']).default('s3'),
  S3_BUCKET_NAME: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional(),

  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),

  // Push Notifications
  EXPO_ACCESS_TOKEN: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),

  // OpenTelemetry
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  OTEL_EXPORTER_OTLP_HEADERS: z.string().optional(),
  OTEL_SERVICE_NAME: z.string().default('palmera-api'),
  OTEL_SERVICE_VERSION: z.string().default('1.0.0'),

  // Redis
  REDIS_URL: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_TTL: z.string().transform(Number).default('60'),
  RATE_LIMIT_LIMIT: z.string().transform(Number).default('100'),

  // CORS
  CORS_ORIGINS: z.string().optional(),

  // Feature Flags
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  ENABLE_DEBUG_LOGS: z.string().transform(val => val === 'true').default('false'),
  ENABLE_WEBHOOK_LOGGING: z.string().transform(val => val === 'true').default('true'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
        .map(err => err.path.join('.'));
      
      const invalidVars = error.errors
        .filter(err => err.code !== 'invalid_type')
        .map(err => `${err.path.join('.')}: ${err.message}`);

      console.error('❌ Environment validation failed:');
      
      if (missingVars.length > 0) {
        console.error('Missing required variables:', missingVars.join(', '));
      }
      
      if (invalidVars.length > 0) {
        console.error('Invalid variables:', invalidVars.join(', '));
      }
      
      console.error('\n📋 Please check your environment configuration.');
      console.error('💡 Use env.production.template as a reference.');
      
      process.exit(1);
    }
    throw error;
  }
}

// Provider-specific validation
export function validateProviderConfig(config: EnvConfig) {
  const errors: string[] = [];

  // Email provider validation
  switch (config.EMAIL_PROVIDER) {
    case 'resend':
      if (!config.RESEND_API_KEY) {
        errors.push('RESEND_API_KEY is required when EMAIL_PROVIDER=resend');
      }
      break;
    case 'postmark':
      if (!config.POSTMARK_API_KEY) {
        errors.push('POSTMARK_API_KEY is required when EMAIL_PROVIDER=postmark');
      }
      break;
    case 'ses':
      if (!config.AWS_ACCESS_KEY_ID || !config.AWS_SECRET_ACCESS_KEY) {
        errors.push('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required when EMAIL_PROVIDER=ses');
      }
      break;
  }

  // Storage provider validation
  switch (config.STORAGE_PROVIDER) {
    case 's3':
      if (!config.S3_BUCKET_NAME || !config.S3_ACCESS_KEY_ID || !config.S3_SECRET_ACCESS_KEY) {
        errors.push('S3_BUCKET_NAME, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY are required when STORAGE_PROVIDER=s3');
      }
      break;
    case 'r2':
      if (!config.R2_ACCOUNT_ID || !config.R2_ACCESS_KEY_ID || !config.R2_SECRET_ACCESS_KEY || !config.R2_BUCKET_NAME) {
        errors.push('R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME are required when STORAGE_PROVIDER=r2');
      }
      break;
  }

  if (errors.length > 0) {
    console.error('❌ Provider configuration validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
}
