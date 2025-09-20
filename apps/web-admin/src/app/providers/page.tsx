'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock data
const mockProviders = [
  {
    id: '1',
    businessName: 'Dakar Luxury Villas',
    user: { firstName: 'Mariama', lastName: 'Diallo', email: 'mariama@dakarvillas.com' },
    isVerified: true,
    kycStatus: 'APPROVED',
    listingsCount: 5,
    bookingsCount: 23,
    totalEarnings: 1250000,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    businessName: 'Saly Beach Adventures',
    user: { firstName: 'Ahmed', lastName: 'Traore', email: 'ahmed@salybeach.com' },
    isVerified: false,
    kycStatus: 'PENDING',
    listingsCount: 3,
    bookingsCount: 8,
    totalEarnings: 450000,
    createdAt: '2024-01-15',
  },
];

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (status === 'APPROVED' && isVerified) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Verified
      </span>;
    } else if (status === 'PENDING') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <ClockIcon className="w-3 h-3 mr-1" />
        Pending
      </span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircleIcon className="w-3 h-3 mr-1" />
        Rejected
      </span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-display font-bold text-midnight-950">Providers</h1>
          <p className="mt-2 text-sm text-midnight-600">
            Manage provider accounts and verification status
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-midnight-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-midnight-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-midnight-500 focus:border-midnight-500 block w-full pl-10 sm:text-sm border-midnight-300 rounded-md"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-midnight-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full rounded-md border-midnight-300 py-2 pl-3 pr-10 text-base focus:border-midnight-500 focus:outline-none focus:ring-midnight-500 sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-midnight-900">
            Providers ({mockProviders.length})
          </h3>
        </div>
        <ul className="divide-y divide-midnight-200">
          {mockProviders.map((provider) => (
            <li key={provider.id} className="px-4 py-4 hover:bg-midnight-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-midnight-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-midnight-600">
                        {provider.user.firstName[0]}{provider.user.lastName[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-midnight-900">
                        {provider.businessName}
                      </p>
                      {getStatusBadge(provider.kycStatus, provider.isVerified)}
                    </div>
                    <p className="text-sm text-midnight-500">
                      {provider.user.firstName} {provider.user.lastName} • {provider.user.email}
                    </p>
                    <p className="text-xs text-midnight-400">
                      {provider.listingsCount} listings • {provider.bookingsCount} bookings • {provider.totalEarnings.toLocaleString()} XOF earned
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-midnight-400 hover:text-midnight-600">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {provider.kycStatus === 'PENDING' && (
                    <>
                      <button className="text-green-400 hover:text-green-600">
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-600">
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}