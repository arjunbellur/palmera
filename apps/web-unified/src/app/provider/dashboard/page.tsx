'use client';

import {
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Listings',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: BuildingOfficeIcon,
    color: 'blue',
  },
  {
    name: 'Active Bookings',
    value: '8',
    change: '+3',
    changeType: 'positive',
    icon: CalendarIcon,
    color: 'green',
  },
  {
    name: 'Monthly Earnings',
    value: '$12,450',
    change: '+18%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
    color: 'purple',
  },
  {
    name: 'Average Rating',
    value: '4.8',
    change: '+0.2',
    changeType: 'positive',
    icon: StarIcon,
    color: 'orange',
  },
];

const recentBookings = [
  {
    id: 1,
    property: 'Luxury Villa Sunset',
    guest: 'John Doe',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    amount: '$2,400',
    status: 'confirmed',
    nights: 3,
  },
  {
    id: 2,
    property: 'Ocean View Penthouse',
    guest: 'Sarah Wilson',
    checkIn: '2024-01-20',
    checkOut: '2024-01-25',
    amount: '$4,000',
    status: 'pending',
    nights: 5,
  },
  {
    id: 3,
    property: 'Mountain Retreat Cabin',
    guest: 'Mike Johnson',
    checkIn: '2024-01-12',
    checkOut: '2024-01-14',
    amount: '$1,200',
    status: 'completed',
    nights: 2,
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Prepare Villa Sunset for next guest',
    due: 'Today, 3:00 PM',
    priority: 'high',
    type: 'cleaning',
  },
  {
    id: 2,
    title: 'Update Ocean View Penthouse photos',
    due: 'Tomorrow, 10:00 AM',
    priority: 'medium',
    type: 'maintenance',
  },
  {
    id: 3,
    title: 'Review guest feedback',
    due: 'This week',
    priority: 'low',
    type: 'review',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
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

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Provider Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="space-y-8">
        {/* Page header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your properties and track your performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-4 w-4" />
                <span>New Listing</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
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

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <a href="/provider/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </a>
            </div>
            
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {booking.property}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600">
                        {booking.guest} • {booking.nights} nights
                      </p>
                      <p className="text-sm font-medium text-gray-900">{booking.amount}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          View details
                        </button>
                        <button className="text-xs text-gray-600 hover:text-gray-700">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <span className="text-sm text-gray-500">3 items</span>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">{task.due}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              View all tasks
            </button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex items-center space-x-2 text-green-600">
                <ArrowTrendingUpIcon className="h-5 w-5" />
              <span className="text-sm font-medium">+12.5% this month</span>
            </div>
          </div>
          
          {/* Placeholder for performance chart */}
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600">Performance metrics will be displayed here</p>
              <p className="text-sm text-gray-500 mt-1">Booking trends, revenue charts, and more</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/provider/listings"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">Manage Listings</p>
                <p className="text-sm text-gray-600">Edit your properties</p>
              </div>
            </a>
            
            <a
              href="/provider/bookings"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-green-700">Bookings</p>
                <p className="text-sm text-gray-600">View reservations</p>
              </div>
            </a>
            
            <a
              href="/provider/earnings"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-purple-700">Earnings</p>
                <p className="text-sm text-gray-600">Track your income</p>
              </div>
            </a>
            
            <a
              href="/provider/profile"
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <StarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-orange-700">Profile</p>
                <p className="text-sm text-gray-600">Update your info</p>
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