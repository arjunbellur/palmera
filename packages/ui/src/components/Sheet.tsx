import React from 'react';
import { cn } from '../utils/cn';

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, open = false, onOpenChange, children, ...props }, ref) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-modal">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-midnight-950/50" 
          onClick={() => onOpenChange?.(false)}
        />
        
        {/* Sheet */}
        <div
          ref={ref}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-modal mx-auto max-h-[85vh] w-full max-w-lg rounded-t-2xl bg-ivory-50 p-6 shadow-xl',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

Sheet.displayName = 'Sheet';
