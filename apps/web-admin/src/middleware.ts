import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard': ['admin', 'support'],
  '/users': ['admin'],
  '/bookings': ['admin', 'support'],
  '/payments': ['admin'],
  '/analytics': ['admin'],
  '/settings': ['admin'],
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/',
  '/api/auth',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route is protected
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    // Get user role from session/token
    const userRole = request.cookies.get('user-role')?.value;
    const isAuthenticated = request.cookies.get('auth-token')?.value;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check role authorization
    const requiredRoles = protectedRoutes[protectedRoute as keyof typeof protectedRoutes];
    if (userRole && !requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
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