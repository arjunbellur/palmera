'use client';

import { useState } from 'react';
import { Badge } from '@palmera/ui';
import { Button } from '@palmera/ui';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const providers = [
  {
    id: '1',
    businessName: 'Dakar Adventures',
    contactName: 'John Doe',
    email: 'john@dakaradventures.com',
    phone: '+221 77 123 4567',
    city: 'Dakar',
    status: 'verified',
    kycStatus: 'approved',
    listingsCount: 12,
    joinedDate: '2024-01-15',
    lastActive: '2024-01-20',
  },
  {
    id: '2',
    businessName: 'Saly Beach Villas',
    contactName: 'Jane Smith',
    email: 'jane@salybeach.com',
    phone: '+221 77 234 5678',
    city: 'Saly',
    status: 'pending',
    kycStatus: 'pending',
    listingsCount: 5,
    joinedDate: '2024-01-18',
    lastActive: '2024-01-19',
  },
  {
    id: '3',
    businessName: 'Ocean Sports Center',
    contactName: 'Mike Johnson',
    email: 'mike@oceansports.sn',
    phone: '+221 77 345 6789',
    city: 'Dakar',
    status: 'verified',
    kycStatus: 'approved',
    listingsCount: 8,
    joinedDate: '2024-01-10',
    lastActive: '2024-01-20',
  },
  {
    id: '4',
    businessName: 'Desert Tours Pro',
    contactName: 'Sarah Wilson',
    email: 'sarah@deserttours.com',
    phone: '+221 77 456 7890',
    city: 'Dakar',
    status: 'rejected',
    kycStatus: 'rejected',
    listingsCount: 0,
    joinedDate: '2024-01-12',
    lastActive: '2024-01-12',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getKycStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

export function ProvidersTable() {
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProviders(providers.map(p => p.id));
    } else {
      setSelectedProviders([]);
    }
  };

  const handleSelectProvider = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProviders([...selectedProviders, id]);
    } else {
      setSelectedProviders(selectedProviders.filter(p => p !== id));
    }
  };

  return (
    <div className="data-table">
      <div className="table-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-midnight-900">
            All Providers
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              Export
            </Button>
            <Button>
              Add Provider
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-midnight-200">
          <thead className="bg-midnight-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-midnight-300 text-midnight-600 focus:ring-midnight-500"
                  checked={selectedProviders.length === providers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-midnight-500 uppercase tracking-wider">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-midnight-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-midnight-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-midnight-500 uppercase tracking-wider">
                KYC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-midnight-500 uppercase tracking-wider">
                Listings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-midnight-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-midnight-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-midnight-200">
            {providers.map((provider) => (
              <tr key={provider.id} className="hover:bg-midnight-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-midnight-300 text-midnight-600 focus:ring-midnight-500"
                    checked={selectedProviders.includes(provider.id)}
                    onChange={(e) => handleSelectProvider(provider.id, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-midnight-900">
                      {provider.businessName}
                    </div>
                    <div className="text-sm text-midnight-500">
                      {provider.city}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-midnight-900">
                      {provider.contactName}
                    </div>
                    <div className="text-sm text-midnight-500">
                      {provider.email}
                    </div>
                    <div className="text-sm text-midnight-500">
                      {provider.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(provider.status)}>
                    {provider.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getKycStatusColor(provider.kycStatus)}>
                    {provider.kycStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-midnight-900">
                  {provider.listingsCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-midnight-500">
                  {new Date(provider.joinedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-midnight-600 hover:text-midnight-900">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <CheckCircleIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                    <button className="text-midnight-600 hover:text-midnight-900">
                      <DocumentTextIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
