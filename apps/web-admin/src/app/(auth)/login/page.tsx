'use client';

import React, { useState } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { Button } from '@palmera/ui';
// import { PalmeraSDK } from '@palmera/sdk';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError('');

      // Simple auth client for now
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      const authResponse = result.data;
      
      // Check if user is admin
      if (authResponse.user.role !== 'ADMIN') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      // Store auth token
      localStorage.setItem('palmera_token', authResponse.accessToken);
      localStorage.setItem('palmera_user', JSON.stringify(authResponse.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-midnight-950">
            <span className="text-2xl">🌴</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold text-midnight-950">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-midnight-600">
            Sign in to access the Palmera admin console
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-midnight-700">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-midnight-200 rounded-lg shadow-sm placeholder-midnight-400 focus:outline-none focus:ring-2 focus:ring-midnight-500 focus:border-midnight-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-midnight-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="block w-full px-3 py-2 pr-10 border border-midnight-200 rounded-lg shadow-sm placeholder-midnight-400 focus:outline-none focus:ring-2 focus:ring-midnight-500 focus:border-midnight-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-midnight-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-midnight-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-midnight-950 hover:bg-midnight-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-midnight-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-midnight-600">
              Forgot your password?{' '}
              <button
                type="button"
                className="font-medium text-midnight-900 hover:text-midnight-700"
                onClick={() => {
                  // TODO: Implement password reset
                  alert('Password reset functionality coming soon');
                }}
              >
                Reset it here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
