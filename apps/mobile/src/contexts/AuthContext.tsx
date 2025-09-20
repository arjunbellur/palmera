import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSDK } from './SDKContext';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string;
  location?: string;
  preferences?: {
    language: string;
    notifications: boolean;
    currency: string;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sdk = useSDK();

  const isAuthenticated = !!user;

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      // For development, automatically "verify" the magic link
      const authResponse = await sdk.auth.verifyMagicLink('mock-token');
      // Transform SDK user to our User interface
      const user: User = {
        id: authResponse.user.id,
        email: authResponse.user.email,
        name: `${authResponse.user.firstName} ${authResponse.user.lastName}`,
        avatar: authResponse.user.avatar,
        phone: '+221 77 123 4567',
        location: 'Dakar, Senegal',
        preferences: {
          language: 'en',
          notifications: true,
          currency: 'XOF',
        },
        createdAt: new Date().toISOString(),
      };
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await sdk.auth.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  // Auto-login for development
  useEffect(() => {
    const autoLogin = async () => {
      setIsLoading(true);
      try {
        const authResponse = await sdk.auth.verifyMagicLink('mock-token');
        // Transform SDK user to our User interface
        const user: User = {
          id: authResponse.user.id,
          email: authResponse.user.email,
          name: `${authResponse.user.firstName} ${authResponse.user.lastName}`,
          avatar: authResponse.user.avatar,
          phone: '+221 77 123 4567',
          location: 'Dakar, Senegal',
          preferences: {
            language: 'en',
            notifications: true,
            currency: 'XOF',
          },
          createdAt: new Date().toISOString(),
        };
        setUser(user);
      } catch (error) {
        console.log('Auto-login failed, user needs to sign in');
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, [sdk]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
