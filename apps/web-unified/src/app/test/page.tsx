'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/lib/auth/auth';

export default function TestPage() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const authService = AuthService.getInstance();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Palmera Unified App Test
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Authenticated:</p>
                <p className="text-lg font-medium text-gray-900">
                  {isAuthenticated ? 'Yes' : 'No'}
                </p>
              </div>
              
              {user && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">User Role:</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.role}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Role Permissions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Is Admin:</p>
                <p className="text-lg font-medium text-gray-900">
                  {hasRole('ADMIN') ? 'Yes' : 'No'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Is Provider:</p>
                <p className="text-lg font-medium text-gray-900">
                  {hasRole('PROVIDER') ? 'Yes' : 'No'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Is Concierge:</p>
                <p className="text-lg font-medium text-gray-900">
                  {hasRole('CONCIERGE') ? 'Yes' : 'No'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Dashboard Path:</p>
                <p className="text-lg font-medium text-gray-900">
                  {authService.getDashboardPath()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Go to Login
              </a>
              
              {isAuthenticated && (
                <>
                  <a
                    href="/admin/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Admin Dashboard
                  </a>
                  
                  <a
                    href="/provider/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Provider Dashboard
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
