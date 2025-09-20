import { AuthResponse, User, UserRole } from './types';

interface LoginRequest {
  email: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token');
      this.user = this.getUserFromStorage();
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user-data');
    return userStr ? JSON.parse(userStr) : null;
  }

  private setUserData(user: User, token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user-data', JSON.stringify(user));
    localStorage.setItem('auth-token', token);
    this.user = user;
    this.token = token;
  }

  private clearUserData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user-data');
    localStorage.removeItem('auth-token');
    this.user = null;
    this.token = null;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password } as LoginRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      const authResponse = result.data as AuthResponse;
      
      this.setUserData(authResponse.user, authResponse.accessToken);
      
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearUserData();
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.user && !!this.token;
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    if (!this.user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(this.user.role);
    }
    
    return this.user.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isProvider(): boolean {
    return this.hasRole('PROVIDER');
  }

  isConcierge(): boolean {
    return this.hasRole('CONCIERGE');
  }

  // Get the appropriate dashboard path for the user's role
  getDashboardPath(): string {
    if (!this.user) return '/auth/login';
    
    switch (this.user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'PROVIDER':
        return '/provider/dashboard';
      case 'CONCIERGE':
        return '/admin/dashboard'; // Concierge uses admin dashboard
      default:
        return '/auth/login';
    }
  }
}
