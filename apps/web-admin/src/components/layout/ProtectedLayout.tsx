import React from 'react';
import { AuthGate } from '@palmera/ui';

export interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  // In a real app, you'd get this from your auth context/state
  const userRole = 'admin'; // This would come from your auth system
  const isLoading = false; // This would come from your auth loading state

  return (
    <AuthGate
      requireAuth={requireAuth}
      allowedRoles={allowedRoles}
      userRole={userRole}
      isLoading={isLoading}
      redirectTo="/auth/login"
    >
      {children}
    </AuthGate>
  );
};
