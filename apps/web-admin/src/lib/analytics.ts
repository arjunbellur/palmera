// import { PostHogAnalytics, SentryAnalytics, PALMERA_EVENTS } from '@palmera/ui';

// Temporary placeholder analytics implementation
export class PostHogAnalytics {
  constructor(private client?: any) {}
  
  track(event: string, properties?: any) {
    console.log('Analytics track:', event, properties);
  }
}

export class SentryAnalytics {
  constructor(private client?: any) {}
  
  captureException(error: Error) {
    console.error('Sentry error:', error);
  }
}

export const PALMERA_EVENTS = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  LOGIN: 'login',
  LOGOUT: 'logout',
  EXPERIENCE_VIEWED: 'experience_viewed',
  BOOKING_CREATED: 'booking_created',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
};

// Initialize analytics providers
let posthog: any = null;
let sentry: any = null;

// PostHog setup
if (typeof window !== 'undefined') {
  import('posthog-js').then(({ default: posthogJS }) => {
    posthogJS.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    });
    posthog = posthogJS;
  });
}

// Sentry setup
if (typeof window !== 'undefined') {
  import('@sentry/nextjs').then(({ init }) => {
    init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION,
    });
    sentry = require('@sentry/nextjs');
  });
}

export const analytics = {
  posthog: new PostHogAnalytics(posthog),
  sentry: new SentryAnalytics(sentry),
};

// Convenience functions for common events
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  analytics.posthog.track(event, properties);
  analytics.sentry.captureException(new Error(`Event: ${event}`));
};

export const trackBookingStarted = (experienceId: string, userId: string) => {
  trackEvent(PALMERA_EVENTS.BOOKING_STARTED, {
    experience_id: experienceId,
    user_id: userId,
  });
};

export const trackBookingCompleted = (bookingId: string, amount: number) => {
  trackEvent(PALMERA_EVENTS.BOOKING_COMPLETED, {
    booking_id: bookingId,
    amount,
  });
};

export const trackLogin = (userId: string, method: string) => {
  trackEvent(PALMERA_EVENTS.LOGIN, {
    user_id: userId,
    method,
  });
};

export const trackLogout = (userId: string) => {
  trackEvent(PALMERA_EVENTS.LOGOUT, {
    user_id: userId,
  });
};
