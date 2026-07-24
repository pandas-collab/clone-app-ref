'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  createdAt: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockServices: Service[] = [
        {
          id: '1',
          title: 'Cloud Migration Services',
          category: 'Cloud Platforms',
          description: 'Seamlessly migrate your applications to the cloud...',
          status: 'active',
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Data Analytics Solutions',
          category: 'Data & Analytics',
          description: 'Transform your data into actionable insights...',
          status: 'active',
          featured: false,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'Enterprise Application Development',
          category: 'Enterprise Applications',
          description: 'Custom enterprise solutions for your business...',
          status: 'draft',
          featured: false,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setServices(mockServices);
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Fetch services error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Service['status']) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 mt-2">Manage service offerings</p>
          </div>
          <Link
            href="/admin/services/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Create New Service
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
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {service.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {service.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.featured ? (
                        <span className="text-indigo-600"> Featured</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/services/${service.id}/delete`}
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

          {services.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No services found</div>
              <Link
                href="/admin/services/create"
                className="text-indigo-600 hover:text-indigo-900 mt-2 inline-block"
              >
                Create your first service
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
