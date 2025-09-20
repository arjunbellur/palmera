import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          api: 'running',
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
          api: 'running',
        },
        error: error.message,
      };
    }
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check for deployment' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  async readinessCheck() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Service not ready: ' + error.message);
    }
  }
}