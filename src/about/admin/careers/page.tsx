'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'active' | 'inactive' | 'draft';
  applicationsCount?: number;
  createdAt: string;
}

export default function CareersAdminPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockCareers: Career[] = [
        {
          id: '1',
          title: 'Senior Full Stack Developer',
          department: 'Engineering',
          location: 'Remote',
          type: 'Full-time',
          status: 'active',
          applicationsCount: 12,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'DevOps Engineer',
          department: 'Infrastructure',
          location: 'New York, NY',
          type: 'Full-time',
          status: 'active',
          applicationsCount: 8,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'Product Manager',
          department: 'Product',
          location: 'San Francisco, CA',
          type: 'Full-time',
          status: 'draft',
          applicationsCount: 0,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setCareers(mockCareers);
    } catch (err) {
      setError('Failed to fetch careers');
      console.error('Fetch careers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Career['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Positions</h1>
            <p className="text-gray-600 mt-2">Manage job postings and applications</p>
          </div>
          <Link
            href="/admin/careers/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Create New Position
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {careers.map((career) => (
                  <tr key={career.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {career.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {career.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(career.status)}`}>
                        {career.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.applicationsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/careers/${career.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/careers/${career.id}/delete`}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {careers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No career positions found</div>
              <Link
                href="/admin/careers/create"
                className="text-indigo-600 hover:text-indigo-900 mt-2 inline-block"
              >
                Create your first position
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
