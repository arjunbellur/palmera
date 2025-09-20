import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { palmeraTheme } from '../../theme/palmeraTheme';

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
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Check authentication
  if (requireAuth && !userRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Redirect to login
    React.useEffect(() => {
      router.push(redirectTo as any);
    }, [router, redirectTo]);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Authentication Required</Text>
        <Text style={styles.description}>Please log in to access this page.</Text>
      </View>
    );
  }

  // Check role authorization
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.description}>You don't have permission to access this page.</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: palmeraTheme.spacing[6],
    backgroundColor: palmeraTheme.colors.background,
  },
  title: {
    fontSize: palmeraTheme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: palmeraTheme.colors.text,
    marginBottom: palmeraTheme.spacing[4],
    textAlign: 'center',
  },
  description: {
    fontSize: palmeraTheme.typography.fontSize.base,
    color: palmeraTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: palmeraTheme.typography.lineHeight.normal * palmeraTheme.typography.fontSize.base,
  },
  loadingText: {
    fontSize: palmeraTheme.typography.fontSize.lg,
    color: palmeraTheme.colors.textSecondary,
  },
});
