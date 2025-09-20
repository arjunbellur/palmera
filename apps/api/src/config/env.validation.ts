import { z } from 'zod';

// Simplified to 8 essential environment variables as per v0.2 spec
const envSchema = z.object({
  // Core Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database (Required)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Authentication (Required)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  
  // Payment (Required for MVP)
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  
  // Email (Required)
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email'),
  
  // File Storage (Required)
  S3_BUCKET_NAME: z.string().min(1, 'S3_BUCKET_NAME is required'),
  S3_ACCESS_KEY_ID: z.string().min(1, 'S3_ACCESS_KEY_ID is required'),
  S3_SECRET_ACCESS_KEY: z.string().min(1, 'S3_SECRET_ACCESS_KEY is required'),

  // Optional with defaults
  PORT: z.string().transform(Number).default('3002'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  S3_REGION: z.string().default('us-east-1'),
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

// Simplified validation - all required vars are validated by schema
export function validateProviderConfig(config: EnvConfig) {
  console.log('✅ Environment configuration validated successfully');
  console.log(`📊 Using ${Object.keys(config).length} environment variables`);
}
