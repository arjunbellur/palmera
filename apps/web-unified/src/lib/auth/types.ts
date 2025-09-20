export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'CONCIERGE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  membershipTier?: 'STANDARD' | 'GOLD';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export interface RouteConfig {
  path: string;
  roles?: UserRole[];
  isPublic?: boolean;
}

export const ROUTE_CONFIGS: RouteConfig[] = [
  // Public routes
  { path: '/auth/login', isPublic: true },
  { path: '/auth/register', isPublic: true },
  { path: '/', isPublic: true },
  { path: '/api/auth', isPublic: true },
  
  // Admin routes
  { path: '/admin/dashboard', roles: ['ADMIN'] },
  { path: '/admin/users', roles: ['ADMIN'] },
  { path: '/admin/bookings', roles: ['ADMIN', 'CONCIERGE'] },
  { path: '/admin/payments', roles: ['ADMIN'] },
  { path: '/admin/providers', roles: ['ADMIN'] },
  { path: '/admin/analytics', roles: ['ADMIN'] },
  { path: '/admin/settings', roles: ['ADMIN'] },
  
  // Provider routes
  { path: '/provider/dashboard', roles: ['PROVIDER'] },
  { path: '/provider/listings', roles: ['PROVIDER'] },
  { path: '/provider/bookings', roles: ['PROVIDER'] },
  { path: '/provider/earnings', roles: ['PROVIDER'] },
  { path: '/provider/profile', roles: ['PROVIDER'] },
  { path: '/provider/onboarding', roles: ['PROVIDER'] },
  
  // Shared dashboard (redirects based on role)
  { path: '/dashboard', roles: ['ADMIN', 'PROVIDER', 'CONCIERGE'] },
];
