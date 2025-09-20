'use client';

import {
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Users',
    value: '2,847',
    change: '+12%',
    changeType: 'positive',
    icon: UsersIcon,
    color: 'blue',
  },
  {
    name: 'Total Bookings',
    value: '1,234',
    change: '+8%',
    changeType: 'positive',
    icon: CalendarIcon,
    color: 'green',
  },
  {
    name: 'Revenue',
    value: '$45,678',
    change: '+15%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
    color: 'purple',
  },
  {
    name: 'Active Providers',
    value: '156',
    change: '+5%',
    changeType: 'positive',
    icon: BuildingOfficeIcon,
    color: 'orange',
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'booking',
    user: 'John Doe',
    description: 'Booked Villa Sunset for 3 days',
    timestamp: '2 hours ago',
    amount: '$2,400',
    status: 'completed',
  },
  {
    id: 2,
    type: 'payment',
    user: 'Sarah Wilson',
    description: 'Payment of $2,400 completed',
    timestamp: '4 hours ago',
    amount: '$2,400',
    status: 'completed',
  },
  {
    id: 3,
    type: 'provider',
    user: 'Mike Johnson',
    description: 'New provider registration approved',
    timestamp: '6 hours ago',
    amount: null,
    status: 'approved',
  },
  {
    id: 4,
    type: 'booking',
    user: 'Emily Davis',
    description: 'Booked Ocean View Penthouse',
    timestamp: '8 hours ago',
    amount: '$3,200',
    status: 'pending',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'booking':
      return CalendarIcon;
    case 'payment':
      return CurrencyDollarIcon;
    case 'provider':
      return BuildingOfficeIcon;
    default:
      return UsersIcon;
  }
};

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-500 text-blue-500',
    green: 'bg-green-500 text-green-500',
    purple: 'bg-purple-500 text-purple-500',
    orange: 'bg-orange-500 text-orange-500',
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="space-y-8">
        {/* Page header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Overview of your Palmera platform performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color).split(' ')[0]}`}>
                  <stat.icon className={`h-6 w-6 ${getColorClasses(stat.color).split(' ')[1]}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className={`flex items-center space-x-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <div className="flex items-center space-x-2 text-green-600">
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                <span className="text-sm font-medium">+15.2%</span>
              </div>
            </div>
            
            {/* Placeholder for chart */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CurrencyDollarIcon className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600">Revenue chart will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <a href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </a>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const TypeIcon = getTypeIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.user}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        {activity.amount && (
                          <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/users"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">Manage Users</p>
                <p className="text-sm text-gray-600">View and edit user accounts</p>
              </div>
            </a>
            
            <a
              href="/admin/providers"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-green-700">Providers</p>
                <p className="text-sm text-gray-600">Manage property providers</p>
              </div>
            </a>
            
            <a
              href="/admin/bookings"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-purple-700">Bookings</p>
                <p className="text-sm text-gray-600">View and manage reservations</p>
              </div>
            </a>
            
            <a
              href="/admin/analytics"
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-orange-700">Analytics</p>
                <p className="text-sm text-gray-600">View detailed reports</p>
              </div>
            </a>
          </div>
        </div>
          </div>
        </div>
      </main>
    </div>
  );
}