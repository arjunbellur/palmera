'use client';

import { 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Providers',
    value: '89',
    change: '+5 this month',
    changeType: 'positive',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Verified',
    value: '67',
    change: '75%',
    changeType: 'positive',
    icon: CheckCircleIcon,
  },
  {
    name: 'Pending Review',
    value: '12',
    change: '3 new today',
    changeType: 'neutral',
    icon: ClockIcon,
  },
  {
    name: 'Rejected',
    value: '10',
    change: '2 this week',
    changeType: 'negative',
    icon: XCircleIcon,
  },
];

export function ProviderStats() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon className={`h-8 w-8 ${
                stat.changeType === 'positive' ? 'text-green-600' :
                stat.changeType === 'negative' ? 'text-red-600' :
                'text-midnight-600'
              }`} />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-midnight-500 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-midnight-900">
                    {stat.value}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-midnight-600'
                  }`}>
                    {stat.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
