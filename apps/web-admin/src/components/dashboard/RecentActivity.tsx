'use client';

import React from 'react';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock data - replace with real API calls
const mockActivities = [
  {
    id: 1,
    type: 'booking',
    action: 'New booking created',
    user: 'John Doe',
    details: 'Luxury Beach Villa in Saly',
    timestamp: '2 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'provider',
    action: 'Provider verification',
    user: 'Mariama Diallo',
    details: 'KYC documents submitted',
    timestamp: '15 minutes ago',
    status: 'pending',
  },
  {
    id: 3,
    type: 'payment',
    action: 'Payment processed',
    user: 'Ahmed Traore',
    details: '25,000 XOF via Orange Money',
    timestamp: '1 hour ago',
    status: 'success',
  },
  {
    id: 4,
    type: 'user',
    action: 'New user registered',
    user: 'Fatou Sarr',
    details: 'Standard membership',
    timestamp: '2 hours ago',
    status: 'success',
  },
  {
    id: 5,
    type: 'booking',
    action: 'Booking cancelled',
    user: 'Ibrahim Ndiaye',
    details: 'Jet Ski Adventure in Dakar',
    timestamp: '3 hours ago',
    status: 'warning',
  },
  {
    id: 6,
    type: 'provider',
    action: 'Provider approved',
    user: 'Aminata Ba',
    details: 'Business verification completed',
    timestamp: '4 hours ago',
    status: 'success',
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user':
      return UserIcon;
    case 'provider':
      return BuildingOfficeIcon;
    case 'booking':
      return CalendarDaysIcon;
    case 'payment':
      return CreditCardIcon;
    default:
      return ClockIcon;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'pending':
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case 'warning':
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    default:
      return <ClockIcon className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'text-green-600';
    case 'pending':
      return 'text-yellow-600';
    case 'warning':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export function RecentActivity() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-midnight-900 mb-4">
          Recent Activity
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {mockActivities.map((activity, activityIdx) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== mockActivities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-midnight-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-midnight-100 flex items-center justify-center ring-8 ring-white">
                          <ActivityIcon className="h-5 w-5 text-midnight-600" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-midnight-500">
                            <span className="font-medium text-midnight-900">
                              {activity.user}
                            </span>{' '}
                            {activity.action}
                          </p>
                          <p className="text-sm text-midnight-600">
                            {activity.details}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-midnight-500">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(activity.status)}
                            <span>{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-6">
          <button className="w-full flex justify-center items-center px-4 py-2 border border-midnight-300 shadow-sm text-sm font-medium rounded-md text-midnight-700 bg-white hover:bg-midnight-50">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}