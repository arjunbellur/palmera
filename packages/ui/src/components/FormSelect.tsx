import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../utils/cn';

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, name, label, error, helperText, options, placeholder, ...props }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const fieldError = error || errors[name]?.message;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-midnight-700">
            {label}
          </label>
        )}
        <select
          {...register(name)}
          {...props}
          ref={ref}
          className={cn(
            'block w-full rounded-lg border border-midnight-200 bg-ivory-50 px-3 py-2 text-midnight-900 focus:border-palm-500 focus:outline-none focus:ring-2 focus:ring-palm-500/20',
            fieldError && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

FormSelect.displayName = 'FormSelect';
