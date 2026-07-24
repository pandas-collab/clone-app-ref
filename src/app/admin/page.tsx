'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminUsers, dashboardMetrics, recentActivities } from '@/lib/mockData';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.id} className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                {metric.change && (
                  <p className={`text-sm ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}% from {metric.period}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">{metric.icon}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/services/create">
          <Button className="w-full">
            Create New Service
          </Button>
        </Link>
        <Link href="/admin/portfolio/create">
          <Button className="w-full" variant="outline">
            Add Portfolio Item
          </Button>
        </Link>
        <Link href="/admin/careers/create">
          <Button className="w-full" variant="outline">
            Post New Job
          </Button>
        </Link>
        <Link href="/admin/applications">
          <Button className="w-full" variant="outline">
            View Applications
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {activity.user}  {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Services</span>
              <span className="text-sm font-medium">{dashboardMetrics.find(m => m.label.includes('Services'))?.value || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Portfolio Items</span>
              <span className="text-sm font-medium">{dashboardMetrics.find(m => m.label.includes('Portfolio'))?.value || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Jobs</span>
              <span className="text-sm font-medium">{dashboardMetrics.find(m => m.label.includes('Jobs'))?.value || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending Applications</span>
              <span className="text-sm font-medium">{dashboardMetrics.find(m => m.label.includes('Applications'))?.value || '0'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
