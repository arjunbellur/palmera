import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Run migrations if DATABASE_URL is available and we're in production
    if (process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
      try {
        this.logger.log('Running database migrations...');
        execSync('npx prisma migrate deploy', { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
        this.logger.log('✅ Database migrations completed successfully');
      } catch (error) {
        this.logger.error('❌ Database migration failed:', error);
        // Don't throw error to prevent app startup failure
        // The app can still run and handle the error gracefully
      }
    }
    
    await this.$connect();
    this.logger.log('✅ Connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
