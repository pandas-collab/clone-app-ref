'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  title: string
  description: string
  category: string
  status: 'active' | 'inactive' | 'draft'
  featured: boolean
  createdAt: string
}

export default function ServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (status === 'authenticated') {
      loadServices()
    }
  }, [status, router])

  const loadServices = async () => {
    try {
      setLoading(true)

      // Mock services data
      const mockServices: Service[] = [
        {
          id: "1",
          name: "Web Development",
          title: "Web Development",
          description: "Custom web applications and websites",
          category: "Development",
          status: "active",
          featured: true,
          createdAt: "2024-01-10T00:00:00Z"
        },
        {
          id: "2",
          name: "Mobile App Development",
          title: "Mobile App Development",
          description: "iOS and Android mobile applications",
          category: "Development",
          status: "active",
          featured: false,
          createdAt: "2024-01-08T00:00:00Z"
        },
        {
          id: "3",
          name: "UI/UX Design",
          title: "UI/UX Design",
          description: "User interface and experience design",
          category: "Design",
          status: "active",
          featured: false,
          createdAt: "2024-01-05T00:00:00Z"
        },
        {
          id: '4',
          name: 'Cloud Migration Services',
          title: 'Cloud Migration Services',
          category: 'Cloud Platforms',
          description: 'Seamlessly migrate your applications to the cloud...',
          status: 'active',
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Data Analytics Solutions',
          title: 'Data Analytics Solutions',
          category: 'Data & Analytics',
          description: 'Transform your data into actionable insights...',
          status: 'active',
          featured: false,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '6',
          name: 'Enterprise Application Development',
          title: 'Enterprise Application Development',
          category: 'Enterprise Applications',
          description: 'Custom enterprise solutions for your business...',
          status: 'draft',
          featured: false,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]

      setServices(mockServices)
    } catch (error) {
      console.error('Error loading services:', error)
      setError('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'active':
        return `${baseClass} bg-green-100 text-green-800`
      case 'inactive':
        return `${baseClass} bg-red-100 text-red-800`
      case 'draft':
        return `${baseClass} bg-gray-100 text-gray-800`
      default:
        return `${baseClass} bg-gray-100 text-gray-800`
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="mt-2 text-gray-600">Manage your service offerings</p>
          </div>
          <Link
            href="/admin/services/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
                        <div className="text-sm font-medium text-gray-900">{service.title || service.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(service.status)}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
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
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="text-green-600 hover:text-green-900"
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
  )
}
