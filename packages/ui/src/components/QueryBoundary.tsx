import React from 'react';
import { cn } from '../utils/cn';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export interface QueryBoundaryProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  loadingSkeleton?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

export const QueryBoundary: React.FC<QueryBoundaryProps> = ({
  children,
  loading = false,
  error = null,
  empty = false,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no items to display at this time.',
  emptyAction,
  loadingSkeleton,
  onRetry,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {loadingSkeleton || <DefaultSkeleton />}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
        <div className="mb-4 text-error">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-midnight-900">
          Something went wrong
        </h3>
        <p className="mb-6 max-w-sm text-midnight-500">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-palm-600 hover:bg-palm-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-palm-500"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  return <>{children}</>;
};

const DefaultSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
