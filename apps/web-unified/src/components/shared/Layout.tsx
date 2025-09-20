'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from './AdminLayout';
import { ProviderLayout } from './ProviderLayout';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>{children}</div>;
  }

  // Render appropriate layout based on user role
  switch (user.role) {
    case 'ADMIN':
    case 'CONCIERGE':
      return <AdminLayout>{children}</AdminLayout>;
    case 'PROVIDER':
      return <ProviderLayout>{children}</ProviderLayout>;
    default:
      return <div>{children}</div>;
  }
}
