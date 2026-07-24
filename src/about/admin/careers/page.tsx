'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Career {
  id: string
  title: string
  department: string
  location: string
  type: string
  salary: string
  isActive: boolean
  postedAt: string
  applicationsCount?: number
}

export default function CareersManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }

    fetchCareers()
  }, [session, status, router])

  const fetchCareers = async () => {
    try {
      setLoading(true)

      // Mock careers data - replace with actual API call
      const mockCareers: Career[] = [
        {
          id: '1',
          title: 'Software Developer',
          department: 'Engineering',
          location: 'Remote',
          type: 'Full-time',
          salary: '$80,000 - $120,000',
          isActive: true,
          postedAt: '2024-01-01T00:00:00Z',
          applicationsCount: 5
        },
        {
          id: '2',
          title: 'Product Manager',
          department: 'Product',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$100,000 - $150,000',
          isActive: true,
          postedAt: '2024-01-05T00:00:00Z',
          applicationsCount: 3
        }
      ]

      setCareers(mockCareers)
    } catch (err) {
      setError('Failed to fetch careers')
      console.error('Fetch careers error:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleCareerStatus = async (id: string) => {
    try {
      setCareers(prev =>
        prev.map(career =>
          career.id === id ? { ...career, isActive: !career.isActive } : career
        )
      )
    } catch (err) {
      setError('Failed to update career status')
      console.error('Toggle career status error:', err)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading careers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Careers Management</h1>
            <p className="mt-2 text-gray-600">Manage job postings and applications</p>
          </div>
          <button
            onClick={() => router.push('/admin/careers/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Job
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
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                      <div className="text-sm font-medium text-gray-900">
                        {career.title}
                      </div>
                      <div className="text-sm text-gray-500">{career.salary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.applicationsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        career.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {career.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/careers/${career.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleCareerStatus(career.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          {career.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/careers/${career.id}/delete`)}
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

        {careers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No job postings found</p>
            <button
              onClick={() => router.push('/admin/careers/create')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First Job Posting
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
