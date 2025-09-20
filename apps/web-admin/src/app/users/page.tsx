'use client';

import React, { useState } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import { useQuery } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

// Mock data - replace with real API calls
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'CUSTOMER',
    membershipTier: 'STANDARD',
    isActive: true,
    createdAt: '2024-01-15',
    bookingsCount: 3,
  },
  {
    id: '2',
    firstName: 'Mariama',
    lastName: 'Diallo',
    email: 'mariama.diallo@example.com',
    role: 'PROVIDER',
    membershipTier: 'GOLD',
    isActive: true,
    createdAt: '2024-01-10',
    bookingsCount: 0,
  },
  {
    id: '3',
    firstName: 'Ahmed',
    lastName: 'Traore',
    email: 'ahmed.traore@example.com',
    role: 'CUSTOMER',
    membershipTier: 'GOLD',
    isActive: true,
    createdAt: '2024-01-08',
    bookingsCount: 7,
  },
  {
    id: '4',
    firstName: 'Fatou',
    lastName: 'Sarr',
    email: 'fatou.sarr@example.com',
    role: 'CUSTOMER',
    membershipTier: 'STANDARD',
    isActive: false,
    createdAt: '2024-01-05',
    bookingsCount: 1,
  },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800';
    case 'PROVIDER':
      return 'bg-blue-100 text-blue-800';
    case 'CUSTOMER':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getMembershipBadgeColor = (tier: string) => {
  switch (tier) {
    case 'GOLD':
      return 'bg-yellow-100 text-yellow-800';
    case 'STANDARD':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchTerm, selectedRole, selectedStatus],
    queryFn: async () => {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockUsers;
    },
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && user.isActive) ||
                         (selectedStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-display font-bold text-midnight-950">Users</h1>
          <p className="mt-2 text-sm text-midnight-600">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-midnight-950 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-midnight-800 focus:outline-none focus:ring-2 focus:ring-midnight-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-midnight-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full rounded-md border-midnight-300 py-2 pl-3 pr-10 text-base focus:border-midnight-500 focus:outline-none focus:ring-midnight-500 sm:text-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Provider</option>
              <option value="ADMIN">Admin</option>
            </select>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-midnight-900">
            Users ({filteredUsers?.length || 0})
          </h3>
        </div>
        <ul className="divide-y divide-midnight-200">
          {isLoading ? (
            <li className="px-4 py-4">
              <div className="animate-pulse">
                <div className="h-4 bg-midnight-200 rounded w-3/4"></div>
              </div>
            </li>
          ) : filteredUsers?.length === 0 ? (
            <li className="px-4 py-4 text-center text-midnight-500">
              No users found
            </li>
          ) : (
            filteredUsers?.map((user) => (
              <li key={user.id} className="px-4 py-4 hover:bg-midnight-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-midnight-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-midnight-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-midnight-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMembershipBadgeColor(user.membershipTier)}`}>
                          {user.membershipTier}
                        </span>
                      </div>
                      <p className="text-sm text-midnight-500">{user.email}</p>
                      <p className="text-xs text-midnight-400">
                        Joined {new Date(user.createdAt).toLocaleDateString()} • {user.bookingsCount} bookings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-midnight-400 hover:text-midnight-600">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-midnight-400 hover:text-midnight-600">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-400 hover:text-red-600">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
