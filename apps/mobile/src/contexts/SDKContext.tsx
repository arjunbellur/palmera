import React, { createContext, useContext, ReactNode } from 'react';
import { PalmeraSDK } from '../lib/PalmeraSDK';

const SDKContext = createContext<PalmeraSDK | null>(null);

interface SDKProviderProps {
  children: ReactNode;
}

export function SDKProvider({ children }: SDKProviderProps) {
  const sdk = new PalmeraSDK({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  });

  // Mock authentication for development
  sdk.auth.requestMagicLink = async (email: string) => {
    console.log('Mock: Magic link requested for', email);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve();
  };

  sdk.auth.verifyMagicLink = async (token: string) => {
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
  };

  sdk.auth.getProfile = async () => {
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
  };

  return (
    <SDKContext.Provider value={sdk}>
      {children}
    </SDKContext.Provider>
  );
}

export function useSDK(): PalmeraSDK {
  const sdk = useContext(SDKContext);
  if (!sdk) {
    throw new Error('useSDK must be used within an SDKProvider');
  }
  return sdk;
}
