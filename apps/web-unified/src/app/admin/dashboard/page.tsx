'use client';

import { Layout } from '@/components/shared/Layout';
import {
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Users',
    value: '2,847',
    change: '+12%',
    changeType: 'positive',
    icon: UsersIcon,
  },
  {
    name: 'Total Bookings',
    value: '1,234',
    change: '+8%',
    changeType: 'positive',
    icon: CalendarIcon,
  },
  {
    name: 'Revenue',
    value: '$45,678',
    change: '+15%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Active Providers',
    value: '156',
    change: '+5%',
    changeType: 'positive',
    icon: BuildingOfficeIcon,
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'booking',
    user: 'John Doe',
    description: 'Booked Villa Sunset for 3 days',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'payment',
    user: 'Sarah Wilson',
    description: 'Payment of $2,400 completed',
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    type: 'provider',
    user: 'Mike Johnson',
    description: 'New provider registration approved',
    timestamp: '6 hours ago',
  },
];

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your Palmera platform
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

        {/* Recent activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-5 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 text-sm font-medium">
                            {activity.type.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {activity.timestamp}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
