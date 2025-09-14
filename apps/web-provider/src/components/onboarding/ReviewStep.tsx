'use client';

import { Button } from '@palmera/ui';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ReviewStepProps {
  onComplete: () => void;
  onPrevious: () => void;
}

export function ReviewStep({ onComplete, onPrevious }: ReviewStepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-midnight-950">
          Review & Submit
        </h2>
        <p className="text-midnight-600 mt-2">
          Review your information before submitting your application
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Information */}
        <div className="bg-midnight-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-midnight-900 mb-4">
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-midnight-500">Business Name</p>
              <p className="font-medium text-midnight-900">Dakar Adventures</p>
            </div>
            <div>
              <p className="text-sm text-midnight-500">Website</p>
              <p className="font-medium text-midnight-900">https://dakaradventures.com</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-midnight-500">Description</p>
              <p className="font-medium text-midnight-900">
                Premium experiences in Dakar and Saly, specializing in beach activities and cultural tours.
              </p>
            </div>
          </div>
        </div>

        {/* KYC Documents */}
        <div className="bg-midnight-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-midnight-900 mb-4">
            KYC Documents
          </h3>
          <div className="space-y-2">
            {['Business License', 'Tax Certificate', 'ID Card', 'Bank Statement'].map((doc) => (
              <div key={doc} className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-midnight-900">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-midnight-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-midnight-900 mb-4">
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-midnight-500">Bank Name</p>
              <p className="font-medium text-midnight-900">Banque Internationale pour le Commerce et l'Industrie du Sénégal</p>
            </div>
            <div>
              <p className="text-sm text-midnight-500">Account Number</p>
              <p className="font-medium text-midnight-900">****1234</p>
            </div>
            <div>
              <p className="text-sm text-midnight-500">Account Holder</p>
              <p className="font-medium text-midnight-900">Dakar Adventures SARL</p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-midnight-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-midnight-900 mb-4">
            Terms and Conditions
          </h3>
          <div className="space-y-3 text-sm text-midnight-600">
            <p>
              By submitting this application, you agree to our Terms of Service and Privacy Policy.
              Your application will be reviewed within 2-3 business days.
            </p>
            <p>
              You will receive an email notification once your application is approved or if we need additional information.
            </p>
            <p>
              Once approved, you can start creating listings and accepting bookings immediately.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onPress={onPrevious}>
            Previous
          </Button>
          <Button onPress={onComplete}>
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}
