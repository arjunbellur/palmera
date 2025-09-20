/**
 * Simple Palmera SDK for mobile app
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  phone: string;
  location: string;
  preferences: {
    language: string;
    notifications: boolean;
    currency: string;
  };
  createdAt: string;
}

export interface AuthResponse {
  user: {
    id: string;
    role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'CONCIERGE';
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    membershipTier?: 'STANDARD' | 'GOLD';
  };
  accessToken: string;
  refreshToken: string;
}

export class PalmeraSDK {
  private baseURL: string;

  constructor(config: { baseURL: string }) {
    this.baseURL = config.baseURL;
  }

  auth = {
    requestMagicLink: async (email: string): Promise<void> => {
      console.log('Mock: Magic link requested for', email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    },

    verifyMagicLink: async (token: string): Promise<AuthResponse> => {
      console.log('Mock: Magic link verified with token', token);
      // Return mock user data matching SDK interface
      return Promise.resolve({
        user: {
          id: 'test-user-123',
          role: 'CUSTOMER' as const,
          email: 'test@palmera.com',
          firstName: 'Test',
          lastName: 'User',
          avatar: undefined,
          membershipTier: 'STANDARD' as const,
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
    },

    getProfile: async (): Promise<User> => {
      return Promise.resolve({
        id: 'test-user-123',
        email: 'test@palmera.com',
        name: 'Test User',
        avatar: null,
        phone: '+221 77 123 4567',
        location: 'Dakar, Senegal',
        preferences: {
          language: 'en',
          notifications: true,
          currency: 'XOF',
        },
        createdAt: new Date().toISOString(),
      });
    },
  };
}
