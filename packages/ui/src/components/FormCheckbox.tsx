import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../utils/cn';

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ className, name, label, error, helperText, ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const fieldError = error || errors[name]?.message;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <input
            {...register(name)}
            {...props}
            ref={ref}
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-midnight-300 text-palm-600 focus:ring-palm-500 focus:ring-2',
              fieldError && 'border-error focus:ring-error',
              className
            )}
          />
          {label && (
            <label htmlFor={name} className="text-sm font-medium text-midnight-700">
              {label}
            </label>
          )}
        </div>
        {fieldError && (
          <p className="text-sm text-error">
            {String(typeof fieldError === 'string' ? fieldError : fieldError.message)}
          </p>
        )}
        {helperText && !fieldError && (
          <p className="text-sm text-midnight-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';
