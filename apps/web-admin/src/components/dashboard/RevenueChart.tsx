'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with real API calls
const mockRevenueData = [
  { month: 'Jan', revenue: 1200000, bookings: 45 },
  { month: 'Feb', revenue: 1500000, bookings: 52 },
  { month: 'Mar', revenue: 1800000, bookings: 61 },
  { month: 'Apr', revenue: 2100000, bookings: 73 },
  { month: 'May', revenue: 2400000, bookings: 85 },
  { month: 'Jun', revenue: 2800000, bookings: 98 },
  { month: 'Jul', revenue: 3200000, bookings: 112 },
  { month: 'Aug', revenue: 2900000, bookings: 105 },
  { month: 'Sep', revenue: 2600000, bookings: 89 },
  { month: 'Oct', revenue: 3000000, bookings: 95 },
  { month: 'Nov', revenue: 3400000, bookings: 108 },
  { month: 'Dec', revenue: 3800000, bookings: 125 },
];

export function RevenueChart() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-midnight-900 mb-4">
          Revenue & Bookings Trend
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#6B7280' }}
              />
              <YAxis 
                yAxisId="revenue"
                orientation="left"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#6B7280' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <YAxis 
                yAxisId="bookings"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#6B7280' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `${(value as number).toLocaleString()} XOF` : value,
                  name === 'revenue' ? 'Revenue' : 'Bookings'
                ]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#1C5E3C"
                strokeWidth={3}
                dot={{ fill: '#1C5E3C', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1C5E3C', strokeWidth: 2 }}
              />
              <Line
                yAxisId="bookings"
                type="monotone"
                dataKey="bookings"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-midnight-950 rounded-full mr-2"></div>
              <span className="text-sm text-midnight-600">Revenue (XOF)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-midnight-600">Bookings</span>
            </div>
          </div>
          <div className="text-sm text-midnight-500">
            Last 12 months
          </div>
        </div>
      </div>
    </div>
  );
}