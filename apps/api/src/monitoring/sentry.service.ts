import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryService {
  private readonly logger = new Logger(SentryService.name);

  constructor(private configService: ConfigService) {
    this.initializeSentry();
  }

  private initializeSentry() {
    const dsn = this.configService.get<string>('SENTRY_DSN');
    const environment = this.configService.get<string>('NODE_ENV', 'development');
    const release = this.configService.get<string>('SENTRY_RELEASE', '1.0.0');

    if (!dsn) {
      this.logger.warn('Sentry DSN not configured, skipping Sentry initialization');
      return;
    }

    Sentry.init({
      dsn,
      environment,
      release,
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
      profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
      integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js tracing
        new Sentry.Integrations.Express({ app: undefined }),
        // Enable Prisma tracing
        new Sentry.Integrations.Prisma({ client: undefined }),
      ],
      beforeSend(event) {
        // Filter out health check requests
        if (event.request?.url?.includes('/health')) {
          return null;
        }
        return event;
      },
    });

    this.logger.log('Sentry initialized successfully');
  }

  captureException(exception: any, context?: any) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context);
      }
      Sentry.captureException(exception);
    });
  }

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: any) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context);
      }
      scope.setLevel(level);
      Sentry.captureMessage(message);
    });
  }

  addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }

  setUser(user: { id: string; email?: string; role?: string }) {
    Sentry.setUser(user);
  }

  setTag(key: string, value: string) {
    Sentry.setTag(key, value);
  }

  setContext(key: string, context: any) {
    Sentry.setContext(key, context);
  }

  startTransaction(name: string, op: string) {
    return Sentry.startTransaction({ name, op });
  }

  async flush(timeout = 2000) {
    return Sentry.flush(timeout);
  }
}
