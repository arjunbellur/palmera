import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth/auth';
import { User, UserRole, AuthContextType } from '@/lib/auth/types';
import { AuthResponse } from '@palmera/shared';

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

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      
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
    isAuthenticated: authService.isAuthenticated(),
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
