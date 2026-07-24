'use client';
import React from 'react';

export default function AdminDashboard() {
  const stats = {
    totalLeads: 45,
    totalServices: 12,
    totalPortfolio: 8,
    totalJobs: 3
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Leads</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Services</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalServices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Portfolio Items</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalPortfolio}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Open Jobs</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalJobs}</p>
        </div>
      </div>
    </div>
  );
}
