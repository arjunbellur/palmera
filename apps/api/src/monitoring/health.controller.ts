import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TelemetryService } from './telemetry.service';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
    redis?: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
  };
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private telemetry: TelemetryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async getHealth(): Promise<HealthCheck> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const version = this.configService.get<string>('OTEL_SERVICE_VERSION', '1.0.0');
    const environment = this.configService.get<string>('NODE_ENV', 'development');

    // Check database health
    const dbStartTime = Date.now();
    let dbStatus: 'healthy' | 'unhealthy' = 'unhealthy';
    let dbResponseTime = 0;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'healthy';
      dbResponseTime = Date.now() - dbStartTime;
    } catch (error) {
      dbResponseTime = Date.now() - dbStartTime;
      console.error('Database health check failed:', error);
    }

    // Record health check metrics
    this.telemetry.recordHealthCheck('database', dbStatus, dbResponseTime);

    // Check Redis health (if configured)
    let redisStatus: 'healthy' | 'unhealthy' | undefined;
    let redisResponseTime = 0;

    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl) {
      const redisStartTime = Date.now();
      try {
        // TODO: Implement Redis health check
        // const redis = new Redis(redisUrl);
        // await redis.ping();
        redisStatus = 'healthy';
        redisResponseTime = Date.now() - redisStartTime;
      } catch (error) {
        redisStatus = 'unhealthy';
        redisResponseTime = Date.now() - redisStartTime;
        console.error('Redis health check failed:', error);
      }
      this.telemetry.recordHealthCheck('redis', redisStatus, redisResponseTime);
    }

    const overallStatus = dbStatus === 'healthy' && (redisStatus === 'healthy' || !redisUrl) 
      ? 'healthy' 
      : 'unhealthy';

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp,
      uptime,
      version,
      environment,
      services: {
        database: {
          status: dbStatus,
          responseTime: dbResponseTime,
        },
        ...(redisUrl && {
          redis: {
            status: redisStatus!,
            responseTime: redisResponseTime,
          },
        }),
      },
    };

    // Record overall health check
    this.telemetry.recordHealthCheck('overall', overallStatus, Date.now() - startTime);

    return healthCheck;
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async getReadiness(): Promise<{ status: string; timestamp: string }> {
    const timestamp = new Date().toISOString();

    try {
      // Check if all required services are available
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ready',
        timestamp,
      };
    } catch (error) {
      throw new Error('Service not ready');
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async getLiveness(): Promise<{ status: string; timestamp: string; uptime: number }> {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
