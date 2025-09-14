// Analytics utilities for tracking user events
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface AnalyticsProvider {
  identify: (userId: string, traits?: Record<string, any>) => void;
  track: (event: AnalyticsEvent) => void;
  page: (name: string, properties?: Record<string, any>) => void;
  reset: () => void;
}

// PostHog implementation
export class PostHogAnalytics implements AnalyticsProvider {
  private posthog: any;

  constructor(posthog: any) {
    this.posthog = posthog;
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.posthog?.identify(userId, traits);
  }

  track(event: AnalyticsEvent) {
    this.posthog?.capture(event.name, {
      ...event.properties,
      timestamp: event.timestamp || Date.now(),
    });
  }

  page(name: string, properties?: Record<string, any>) {
    this.posthog?.capture('$pageview', {
      page: name,
      ...properties,
    });
  }

  reset() {
    this.posthog?.reset();
  }
}

// Sentry implementation
export class SentryAnalytics implements AnalyticsProvider {
  private sentry: any;

  constructor(sentry: any) {
    this.sentry = sentry;
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.sentry?.setUser({ id: userId, ...traits });
  }

  track(event: AnalyticsEvent) {
    this.sentry?.addBreadcrumb({
      message: event.name,
      category: 'analytics',
      data: event.properties,
      timestamp: event.timestamp || Date.now(),
    });
  }

  page(name: string, properties?: Record<string, any>) {
    this.sentry?.setContext('page', { name, ...properties });
  }

  reset() {
    this.sentry?.setUser(null);
  }
}

// Key events for Palmera
export const PALMERA_EVENTS = {
  // Auth events
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  
  // Booking events
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
  
  // Experience events
  EXPERIENCE_VIEWED: 'experience_viewed',
  EXPERIENCE_CREATED: 'experience_created',
  EXPERIENCE_UPDATED: 'experience_updated',
  
  // Payment events
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  
  // Navigation events
  PAGE_VIEWED: 'page_viewed',
  SEARCH_PERFORMED: 'search_performed',
} as const;

export type PalmeraEvent = typeof PALMERA_EVENTS[keyof typeof PALMERA_EVENTS];
