'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

// Mock data - replace with real API calls
const mockStats = {
  totalUsers: 1247,
  totalProviders: 89,
  totalBookings: 3421,
  totalRevenue: 12500000, // in XOF
  userGrowth: 12.5,
  bookingGrowth: 8.3,
  revenueGrowth: 15.2,
  providerGrowth: 5.7,
};

const stats = [
  {
    name: 'Total Users',
    value: mockStats.totalUsers.toLocaleString(),
    change: mockStats.userGrowth,
    changeType: 'increase',
    icon: UsersIcon,
  },
  {
    name: 'Active Providers',
    value: mockStats.totalProviders.toLocaleString(),
    change: mockStats.providerGrowth,
    changeType: 'increase',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Total Bookings',
    value: mockStats.totalBookings.toLocaleString(),
    change: mockStats.bookingGrowth,
    changeType: 'increase',
    icon: CalendarDaysIcon,
  },
  {
    name: 'Total Revenue',
    value: `${(mockStats.totalRevenue / 1000).toLocaleString()}K XOF`,
    change: mockStats.revenueGrowth,
    changeType: 'increase',
    icon: CurrencyDollarIcon,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <div className="absolute bg-midnight-500 rounded-md p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-midnight-500 truncate">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-midnight-900">
              {stat.value}
            </p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.changeType === 'increase' ? (
                <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
              )}
              <span className="sr-only">
                {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
              </span>
              {stat.change}%
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}