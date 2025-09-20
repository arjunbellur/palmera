'use client';

import { Button, Input } from '@palmera/ui';
import { useForm } from 'react-hook-form';

interface BankDetailsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  routingNumber?: string;
  swiftCode?: string;
}

export function BankDetailsStep({ onNext, onPrevious }: BankDetailsStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BankDetails>();

  const onSubmit = (data: BankDetails) => {
    console.log('Bank details:', data);
    onNext();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-midnight-950">
          Bank Details
        </h2>
        <p className="text-midnight-600 mt-2">
          Set up your bank account to receive payments
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Bank Name"
            placeholder="Enter bank name"
            {...register('bankName', { required: 'Bank name is required' })}
            error={errors.bankName?.message}
          />
          
          <Input
            label="Account Number"
            placeholder="Enter account number"
            {...register('accountNumber', { required: 'Account number is required' })}
            error={errors.accountNumber?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Account Holder Name"
            placeholder="Enter account holder name"
            {...register('accountHolderName', { required: 'Account holder name is required' })}
            error={errors.accountHolderName?.message}
          />
          
          <Input
            label="Routing Number (Optional)"
            placeholder="Enter routing number"
            {...register('routingNumber')}
            error={errors.routingNumber?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SWIFT Code (Optional)"
            placeholder="Enter SWIFT code"
            {...register('swiftCode')}
            error={errors.swiftCode?.message}
          />
        </div>

        <div className="bg-midnight-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-midnight-900 mb-2">
            Payment Information
          </h3>
          <ul className="text-sm text-midnight-600 space-y-1">
            <li>• Payments are processed weekly on Fridays</li>
            <li>• Commission rate: 15-25% depending on category</li>
            <li>• Minimum payout: 50,000 XOF</li>
            <li>• Processing time: 2-3 business days</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onPress={onPrevious}>
            Previous
          </Button>
          <Button onPress={() => handleSubmit(onSubmit)()}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
