'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  appliedAt: string
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted'
}

export default function ApplicationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (status === 'authenticated') {
      loadApplications()
    }
  }, [status, router])

  const loadApplications = async () => {
    try {
      setLoading(true)

      // Mock applications data
      const mockApplications: Application[] = [
        {
          id: "app_001",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "(555) 123-4567",
          position: "Senior Full Stack Developer",
          appliedAt: "2024-01-15T10:30:00Z",
          status: "pending"
        },
        {
          id: "app_002",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phone: "(555) 987-6543",
          position: "UX/UI Designer",
          appliedAt: "2024-01-14T14:20:00Z",
          status: "reviewed"
        },
        {
          id: "app_003",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike@example.com",
          phone: "(555) 456-7890",
          position: "Senior Full Stack Developer",
          appliedAt: "2024-01-13T09:15:00Z",
          status: "interviewed"
        }
      ]

      setApplications(mockApplications)
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`
      case 'reviewed':
        return `${baseClass} bg-blue-100 text-blue-800`
      case 'interviewed':
        return `${baseClass} bg-purple-100 text-purple-800`
      case 'accepted':
        return `${baseClass} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClass} bg-red-100 text-red-800`
      default:
        return `${baseClass} bg-gray-100 text-gray-800`
    }
  }

  const filteredApplications = applications.filter(app =>
    filter === 'all' || app.status === filter
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="mt-2 text-gray-600">Manage and review job applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'all', label: 'All Applications', count: applications.length },
              { key: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
              { key: 'reviewed', label: 'Reviewed', count: applications.filter(a => a.status === 'reviewed').length },
              { key: 'interviewed', label: 'Interviewed', count: applications.filter(a => a.status === 'interviewed').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
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
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.firstName} {application.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/applications/${application.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
