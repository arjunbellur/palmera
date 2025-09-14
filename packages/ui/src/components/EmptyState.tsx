import React from 'react';
import { cn } from '../utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-midnight-400">
            {icon}
          </div>
        )}
        <h3 className="mb-2 text-lg font-medium text-midnight-900">
          {title}
        </h3>
        {description && (
          <p className="mb-6 max-w-sm text-midnight-500">
            {description}
          </p>
        )}
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
