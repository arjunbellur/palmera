import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../utils/cn';

export interface FormTextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormTextField = React.forwardRef<HTMLInputElement, FormTextFieldProps>(
  ({ className, name, label, error, helperText, ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const fieldError = error || errors[name]?.message;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-midnight-700">
            {label}
          </label>
        )}
        <input
          {...register(name)}
          {...props}
          ref={ref}
          className={cn(
            'block w-full rounded-lg border border-midnight-200 bg-ivory-50 px-3 py-2 text-midnight-900 placeholder-midnight-400 focus:border-palm-500 focus:outline-none focus:ring-2 focus:ring-palm-500/20',
            fieldError && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
        />
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

FormTextField.displayName = 'FormTextField';
