'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../lib/auth/auth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const authService = AuthService.getInstance();

  useEffect(() => {
    if (isAuthenticated() && user) {
      // Redirect to appropriate dashboard based on user role
      const dashboardPath = authService.getDashboardPath();
      router.push(dashboardPath);
    } else {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
