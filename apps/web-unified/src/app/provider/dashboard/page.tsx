'use client';

import { Layout } from '@/components/shared/Layout';
import {
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Active Listings',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Total Bookings',
    value: '89',
    change: '+12%',
    changeType: 'positive',
    icon: CalendarIcon,
  },
  {
    name: 'Monthly Earnings',
    value: '$8,450',
    change: '+18%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Average Rating',
    value: '4.8',
    change: '+0.2',
    changeType: 'positive',
    icon: StarIcon,
  },
];

const recentBookings = [
  {
    id: 1,
    customer: 'Alice Johnson',
    listing: 'Luxury Villa Sunset',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    amount: '$1,200',
    status: 'confirmed',
  },
  {
    id: 2,
    customer: 'Bob Smith',
    listing: 'Private Beach House',
    checkIn: '2024-01-20',
    checkOut: '2024-01-25',
    amount: '$2,400',
    status: 'pending',
  },
  {
    id: 3,
    customer: 'Carol Davis',
    listing: 'Mountain Retreat',
    checkIn: '2024-01-22',
    checkOut: '2024-01-24',
    amount: '$800',
    status: 'confirmed',
  },
];

export default function ProviderDashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your listings and bookings
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className="absolute bg-primary-500 rounded-md p-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {stat.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Bookings
            </h3>
            <div className="mt-5">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.listing}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.checkIn} - {booking.checkOut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
