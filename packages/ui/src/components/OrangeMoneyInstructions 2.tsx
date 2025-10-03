import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

interface OrangeMoneyInstructionsProps {
  reference: string;
  amount: number;
  currency: string;
  instructions: {
    ussd: string;
    app: string;
    web: string;
  };
  onCopyReference: () => void;
  onCheckStatus: () => void;
  className?: string;
}

export function OrangeMoneyInstructions({
  reference,
  amount,
  currency,
  instructions,
  onCopyReference,
  onCheckStatus,
  className,
}: OrangeMoneyInstructionsProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Complete Your Payment
          </h3>
          <p className="text-gray-600">
            Amount: <span className="font-semibold">{amount.toLocaleString()} {currency}</span>
          </p>
        </div>

        {/* Reference Number */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {reference}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyReference}
              className="ml-4"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Choose your payment method:</h4>
          
          {/* USSD Method */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">*</span>
                </div>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">USSD Code</h5>
                <p className="text-sm text-gray-600 mb-2">
                  Dial the code below on your phone
                </p>
                <div className="bg-gray-100 rounded px-3 py-2 font-mono text-sm">
                  {instructions.ussd}
                </div>
              </div>
            </div>
          </div>

          {/* App Method */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Orange Money App</h5>
                <p className="text-sm text-gray-600 mb-2">
                  Open the Orange Money app and enter the reference number
                </p>
                <Badge variant="secondary" className="text-xs">
                  {instructions.app}
                </Badge>
              </div>
            </div>
          </div>

          {/* Web Method */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Web Portal</h5>
                <p className="text-sm text-gray-600 mb-2">
                  Complete payment on the Orange Money web portal
                </p>
                <Badge variant="secondary" className="text-xs">
                  {instructions.web}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Status Check */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onCheckStatus}
            className="w-full"
          >
            Check Payment Status
          </Button>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Important Note
              </p>
              <p className="text-sm text-blue-700">
                Your booking will be confirmed automatically once payment is received. 
                You can check the status anytime using the button above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
