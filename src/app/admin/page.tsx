'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Services</h2>
            <p className="text-gray-600">Manage your services</p>
            <a href="/admin/services" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Manage Services
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
            <p className="text-gray-600">Manage portfolio items</p>
            <a href="/admin/portfolio" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Manage Portfolio
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Applications</h2>
            <p className="text-gray-600">View job applications</p>
            <a href="/admin/applications" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Applications
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
