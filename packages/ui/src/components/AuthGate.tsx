import React from 'react';
import { QueryBoundary } from './QueryBoundary';

export interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  userRole?: string;
  isLoading?: boolean;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  children,
  fallback,
  redirectTo = '/auth/login',
  requireAuth = true,
  allowedRoles = [],
  userRole,
  isLoading = false,
}) => {
  // Note: Router implementation should be provided by the consuming app
  const router = { push: (path: string) => console.log('Navigate to:', path) };

  // Show loading state
  if (isLoading) {
    return (
      <QueryBoundary loading={true}>
        <div />
      </QueryBoundary>
    );
  }

  // Check authentication
  if (requireAuth && !userRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Redirect to login
    React.useEffect(() => {
      router.push(redirectTo);
    }, [router, redirectTo]);

    return (
      <QueryBoundary
        empty={true}
        emptyTitle="Authentication Required"
        emptyDescription="Please log in to access this page."
      >
        <div />
      </QueryBoundary>
    );
  }

  // Check role authorization
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return (
      <QueryBoundary
        error={new Error('Insufficient permissions')}
        emptyTitle="Access Denied"
        emptyDescription="You don't have permission to access this page."
      >
        <div />
      </QueryBoundary>
    );
  }

  return <>{children}</>;
};
