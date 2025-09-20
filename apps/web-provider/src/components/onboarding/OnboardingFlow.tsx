'use client';

import { useState } from 'react';
import { Button } from '@palmera/ui';
import { BusinessInfoStep } from './BusinessInfoStep';
import { KycDocumentsStep } from './KycDocumentsStep';
import { BankDetailsStep } from './BankDetailsStep';
import { ReviewStep } from './ReviewStep';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const steps = [
  { id: 'business', name: 'Business Information', description: 'Tell us about your business' },
  { id: 'kyc', name: 'KYC Documents', description: 'Upload verification documents' },
  { id: 'banking', name: 'Bank Details', description: 'Set up payment information' },
  { id: 'review', name: 'Review & Submit', description: 'Review your application' },
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    // Handle completion
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BusinessInfoStep onNext={handleNext} />;
      case 1:
        return <KycDocumentsStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 2:
        return <BankDetailsStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <ReviewStep onComplete={handleComplete} onPrevious={handlePrevious} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                completedSteps.includes(index)
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentStep
                  ? 'bg-midnight-950 border-midnight-950 text-white'
                  : 'bg-white border-midnight-300 text-midnight-500'
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-midnight-900' : 'text-midnight-500'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-midnight-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                completedSteps.includes(index) ? 'bg-green-500' : 'bg-midnight-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="onboarding-step">
        {renderStep()}
      </div>
    </div>
  );
}
