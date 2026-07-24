'use client';

import React, { useState } from 'react';

export default function AdminApplications() {
  const [applications] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      position: 'Frontend Developer',
      status: 'pending'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Applications</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {applications.map((app) => (
              <div key={app.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-600">{app.email}</p>
                    <p className="text-sm text-gray-500">{app.position}</p>
                  </div>
                  <div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
