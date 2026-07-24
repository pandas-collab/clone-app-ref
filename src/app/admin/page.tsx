'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Services', value: '0', href: '/admin/services' },
    { name: 'Portfolio Items', value: '0', href: '/admin/portfolio' },
    { name: 'Job Listings', value: '0', href: '/admin/careers' },
    { name: 'Applications', value: '0', href: '/admin/applications' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/services/create"
              className="block w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
            >
              Create New Service
            </Link>
            <Link
              href="/admin/portfolio/create"
              className="block w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
            >
              Add Portfolio Item
            </Link>
            <Link
              href="/admin/careers/create"
              className="block w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
            >
              Post New Job
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
