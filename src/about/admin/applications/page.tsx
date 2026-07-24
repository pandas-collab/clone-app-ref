'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Application {
  id: string
  jobId?: string
  jobTitle?: string
  firstName?: string
  lastName?: string
  name?: string
  email: string
  phone: string
  position?: string
  appliedAt?: string
  createdAt?: string
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted'
}

export default function ApplicationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      setError(null)

      // Mock applications data combining both structures
      const mockApplications: Application[] = [
        {
          id: "app_001",
          firstName: "John",
          lastName: "Doe",
          name: "John Doe",
          email: "john@example.com",
          phone: "(555) 123-4567",
          position: "Senior Full Stack Developer",
          jobTitle: "Senior Full Stack Developer",
          jobId: "1",
          appliedAt: "2024-01-15T10:30:00Z",
          createdAt: "2024-01-15T10:30:00Z",
          status: "pending"
        },
        {
          id: "app_002",
          firstName: "Jane",
          lastName: "Smith",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "(555) 987-6543",
          position: "UX/UI Designer",
          jobTitle: "UX/UI Designer",
          jobId: "2",
          appliedAt: "2024-01-14T14:20:00Z",
          createdAt: "2024-01-14T14:20:00Z",
          status: "reviewed"
        },
        {
          id: "app_003",
          firstName: "Mike",
          lastName: "Johnson",
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "(555) 456-7890",
          position: "Senior Full Stack Developer",
          jobTitle: "Senior Full Stack Developer",
          jobId: "1",
          appliedAt: "2024-01-13T09:15:00Z",
          createdAt: "2024-01-13T09:15:00Z",
          status: "interviewed"
        }
      ]

      setApplications(mockApplications)
    } catch (err) {
      setError('Failed to fetch applications')
      console.error('Error loading applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    await loadApplications()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'interviewed': return 'bg-purple-100 text-purple-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredApplications = applications.filter(app =>
    filter === 'all' || app.status === filter
  )

  const getDisplayName = (app: Application) => {
    if (app.firstName && app.lastName) {
      return `${app.firstName} ${app.lastName}`
    }
    return app.name || 'Unknown'
  }

  const getDisplayDate = (app: Application) => {
    const dateString = app.appliedAt || app.createdAt
    return dateString ? new Date(dateString).toLocaleDateString() : 'Unknown'
  }

  const getDisplayPosition = (app: Application) => {
    return app.position || app.jobTitle || 'Unknown Position'
  }

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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 font-medium">Error</div>
          <div className="text-red-600 text-sm">{error}</div>
          <button
            onClick={fetchApplications}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
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
              { key: 'interviewed', label: 'Interviewed', count: applications.filter(a => a.status === 'interviewed').length },
              { key: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
              { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length }
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
                          {getDisplayName(application)}
                        </div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getDisplayPosition(application)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getDisplayDate(application)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/applications/${application.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Details
                      </Link>
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
