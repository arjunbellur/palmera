import React, { createContext, useContext, ReactNode } from 'react';
import { PalmeraSDK } from '@palmera/sdk';

const SDKContext = createContext<PalmeraSDK | null>(null);

interface SDKProviderProps {
  children: ReactNode;
}

export function SDKProvider({ children }: SDKProviderProps) {
  const sdk = new PalmeraSDK({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  });

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
