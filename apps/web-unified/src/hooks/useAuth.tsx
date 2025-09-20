'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Mock auth service for now
class AuthService {
  private static instance: AuthService;
  private currentUser: any = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string) {
    // Mock login - in real app this would call your API
    const mockUser = {
      id: '1',
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: email.includes('admin') ? 'ADMIN' : 'PROVIDER',
      avatar: undefined,
    };

    this.currentUser = mockUser;
    return {
      user: mockUser,
      accessToken: 'mock-token',
    };
  }

  async logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  hasRole(role: string | string[]) {
    if (!this.currentUser) return false;
    if (Array.isArray(role)) {
      return role.includes(this.currentUser.role);
    }
    return this.currentUser.role === role;
  }

  getDashboardPath() {
    if (!this.currentUser) return '/auth/login';
    switch (this.currentUser.role) {
      case 'ADMIN':
      case 'CONCIERGE':
        return '/admin/dashboard';
      case 'PROVIDER':
        return '/provider/dashboard';
      default:
        return '/auth/login';
    }
  }
}

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'CONCIERGE';
  avatar?: string;
};

type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'CONCIERGE';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Initialize auth state
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser({
        ...response.user,
        role: response.user.role as UserRole
      });
      
      // Set cookies for middleware
      document.cookie = `auth-token=${response.accessToken}; path=/; secure; samesite=strict`;
      document.cookie = `user-role=${response.user.role}; path=/; secure; samesite=strict`;
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      
      // Clear cookies
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    return authService.hasRole(role);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}