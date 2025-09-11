import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelemetryService implements OnModuleInit {
  private readonly logger = new Logger(TelemetryService.name);

  // Metrics storage (in-memory for now)
  private metrics: Map<string, any> = new Map();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const otlpEndpoint = this.configService.get<string>('OTLP_ENDPOINT');
    
    if (otlpEndpoint) {
      this.logger.log('Telemetry service initialized (OpenTelemetry disabled for now)');
    } else {
      this.logger.warn('OTLP_ENDPOINT not configured, telemetry disabled');
    }
  }

  // Tracing methods (placeholder)
  startSpan(name: string, options?: any) {
    this.logger.debug(`Starting span: ${name}`, options);
    return { name, options, startTime: Date.now() };
  }

  withSpan<T>(name: string, fn: () => T, options?: any): T {
    const span = this.startSpan(name, options);
    try {
      const result = fn();
      this.logger.debug(`Span completed: ${name}`, { duration: Date.now() - span.startTime });
      return result;
    } catch (error) {
      this.logger.error(`Span error: ${name}`, error);
      throw error;
    }
  }

  async withSpanAsync<T>(name: string, fn: () => Promise<T>, options?: any): Promise<T> {
    const span = this.startSpan(name, options);
    try {
      const result = await fn();
      this.logger.debug(`Span completed: ${name}`, { duration: Date.now() - span.startTime });
      return result;
    } catch (error) {
      this.logger.error(`Span error: ${name}`, error);
      throw error;
    }
  }

  // Metrics methods (in-memory storage)
  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    const key = `http_requests_${method}_${route}`;
    const current = this.metrics.get(key) || { count: 0, totalDuration: 0, errors: 0 };
    current.count++;
    current.totalDuration += duration;
    if (statusCode >= 400) current.errors++;
    this.metrics.set(key, current);
    
    this.logger.debug('Request recorded', { method, route, statusCode, duration });
  }

  recordBooking(bookingType: string, status: string) {
    const key = `bookings_${bookingType}_${status}`;
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
    
    this.logger.debug('Booking recorded', { bookingType, status });
  }

  recordPayment(provider: string, status: string, amount?: number) {
    const key = `payments_${provider}_${status}`;
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
    
    this.logger.debug('Payment recorded', { provider, status, amount });
  }

  recordCustomMetric(name: string, value: number, labels?: Record<string, string>) {
    const key = `custom_${name}_${JSON.stringify(labels || {})}`;
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + value);
    
    this.logger.debug('Custom metric recorded', { name, value, labels });
  }

  recordHealthCheck(service: string, status: 'healthy' | 'unhealthy', responseTime: number) {
    const key = `health_${service}_${status}`;
    const current = this.metrics.get(key) || { count: 0, totalTime: 0 };
    current.count++;
    current.totalTime += responseTime;
    this.metrics.set(key, current);
    
    this.logger.debug('Health check recorded', { service, status, responseTime });
  }

  recordDatabaseQuery(operation: string, table: string, duration: number, success: boolean) {
    const key = `db_${operation}_${table}_${success}`;
    const current = this.metrics.get(key) || { count: 0, totalDuration: 0 };
    current.count++;
    current.totalDuration += duration;
    this.metrics.set(key, current);
    
    this.logger.debug('Database query recorded', { operation, table, duration, success });
  }

  recordEmailSent(provider: string, type: string, success: boolean) {
    const key = `email_${provider}_${type}_${success}`;
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + 1);
    
    this.logger.debug('Email sent recorded', { provider, type, success });
  }

  recordFileUpload(purpose: string, size: number, success: boolean) {
    const key = `file_upload_${purpose}_${success}`;
    const current = this.metrics.get(key) || { count: 0, totalSize: 0 };
    current.count++;
    current.totalSize += size;
    this.metrics.set(key, current);
    
    this.logger.debug('File upload recorded', { purpose, size, success });
  }

  // Get metrics for health check
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}