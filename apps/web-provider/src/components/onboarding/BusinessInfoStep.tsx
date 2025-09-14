'use client';

import { useState } from 'react';
import { Button, Input } from '@palmera/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProviderRequest } from '@palmera/schemas';

interface BusinessInfoStepProps {
  onNext: () => void;
}

export function BusinessInfoStep({ onNext }: BusinessInfoStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProviderRequest>({
    resolver: zodResolver(require('@palmera/schemas').CreateProviderRequestSchema),
  });

  const onSubmit = (data: CreateProviderRequest) => {
    console.log('Business info:', data);
    onNext();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-midnight-950">
          Business Information
        </h2>
        <p className="text-midnight-600 mt-2">
          Tell us about your business to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Business Name"
            placeholder="Enter your business name"
            {...register('businessName')}
            error={errors.businessName?.message}
          />
          
          <Input
            label="Website (Optional)"
            placeholder="https://yourwebsite.com"
            {...register('website')}
            error={errors.website?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight-900 mb-2">
            Business Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-midnight-200 rounded-lg focus:ring-2 focus:ring-midnight-500 focus:border-midnight-500"
            rows={4}
            placeholder="Describe your business and the experiences you offer..."
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onPress={() => handleSubmit(onSubmit)()}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
