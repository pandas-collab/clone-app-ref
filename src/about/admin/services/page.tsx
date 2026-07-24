'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Service {
  id: string
  name: string
  category: string
  description: string
  price: string
  isActive: boolean
  createdAt: string
}

export default function ServicesManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }

    fetchServices()
  }, [session, status, router])

  const fetchServices = async () => {
    try {
      setLoading(true)

      // Mock services data - replace with actual API call
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Web Development',
          category: 'Development',
          description: 'Custom web application development',
          price: 'Starting at $5,000',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Mobile App Development',
          category: 'Development',
          description: 'iOS and Android mobile applications',
          price: 'Starting at $10,000',
          isActive: true,
          createdAt: '2024-01-02T00:00:00Z'
        }
      ]

      setServices(mockServices)
    } catch (err) {
      setError('Failed to fetch services')
      console.error('Fetch services error:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleServiceStatus = async (id: string) => {
    try {
      setServices(prev =>
        prev.map(service =>
          service.id === id ? { ...service, isActive: !service.isActive } : service
        )
      )
    } catch (err) {
      setError('Failed to update service status')
      console.error('Toggle service status error:', err)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="mt-2 text-gray-600">Manage your service offerings</p>
          </div>
          <button
            onClick={() => router.push('/admin/services/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Service
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                      <div className="text-sm font-medium text-gray-900">
                        {service.name}
                      </div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        service.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/services/${service.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleServiceStatus(service.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          {service.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/services/${service.id}/delete`)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found</p>
            <button
              onClick={() => router.push('/admin/services/create')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Your First Service
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
