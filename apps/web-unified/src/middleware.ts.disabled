import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route configurations inline to avoid import issues in middleware
const ROUTE_CONFIGS = [
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

type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'CONCIERGE';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Find matching route config
  const routeConfig = ROUTE_CONFIGS.find(config => {
    if (config.path === pathname) return true;
    if (config.path.endsWith('/*') && pathname.startsWith(config.path.slice(0, -2))) return true;
    return false;
  });

  // If no route config found, allow access (public by default)
  if (!routeConfig) {
    return NextResponse.next();
  }

  // Allow public routes
  if (routeConfig.isPublic) {
    return NextResponse.next();
  }

  // Check authentication
  const authToken = request.cookies.get('auth-token')?.value;
  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check role authorization
  const userRole = request.cookies.get('user-role')?.value as UserRole;
  if (!userRole || (routeConfig.roles && !routeConfig.roles.includes(userRole))) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = getDashboardPathForRole(userRole);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

function getDashboardPathForRole(role: UserRole | undefined): string {
  switch (role) {
    case 'ADMIN':
    case 'CONCIERGE':
      return '/admin/dashboard';
    case 'PROVIDER':
      return '/provider/dashboard';
    default:
      return '/auth/login';
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
