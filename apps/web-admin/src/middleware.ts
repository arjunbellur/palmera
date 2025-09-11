import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('palmera_token')?.value;
  const userCookie = request.cookies.get('palmera_user')?.value;
  
  // Parse user data
  let user = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch (error) {
    // Invalid user data, clear cookies
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('palmera_token');
    response.cookies.delete('palmera_user');
    return response;
  }

  // Check if user is trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/users') ||
      request.nextUrl.pathname.startsWith('/providers') ||
      request.nextUrl.pathname.startsWith('/listings') ||
      request.nextUrl.pathname.startsWith('/bookings') ||
      request.nextUrl.pathname.startsWith('/payments')) {
    
    // Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is admin
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated admin users away from login page
  if (request.nextUrl.pathname === '/login' && token && user?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
