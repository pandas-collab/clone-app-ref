'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Career {
  id: string
  title: string
  department: string
  location: string
  type: string
  status: 'active' | 'inactive' | 'draft'
  postedAt: string
  applicationsCount: number
}

export default function CareersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (status === 'authenticated') {
      loadCareers()
    }
  }, [status, router])

  const loadCareers = async () => {
    try {
      setLoading(true)

      // Mock careers data
      const mockCareers: Career[] = [
        {
          id: "1",
          title: "Senior Full Stack Developer",
          department: "Engineering",
          location: "Remote / San Francisco, CA",
          type: "Full-time",
          status: "active",
          postedAt: "2024-01-10T00:00:00Z",
          applicationsCount: 15
        },
        {
          id: "2",
          title: "UX/UI Designer",
          department: "Design",
          location: "New York, NY",
          type: "Full-time",
          status: "active",
          postedAt: "2024-01-08T00:00:00Z",
          applicationsCount: 8
        },
        {
          id: "3",
          title: "Product Manager",
          department: "Product",
          location: "Remote",
          type: "Full-time",
          status: "draft",
          postedAt: "2024-01-05T00:00:00Z",
          applicationsCount: 0
        }
      ]

      setCareers(mockCareers)
    } catch (error) {
      console.error('Error loading careers:', error)
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
          <p className="mt-2 text-gray-600">Loading careers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
            <p className="mt-2 text-gray-600">Manage job postings and career opportunities</p>
          </div>
          <Link
            href="/admin/careers/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Position
          </Link>
        </div>

        {/* Careers Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
              {careers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No career opportunities found
                  </td>
                </tr>
              ) : (
                careers.map((career) => (
                  <tr key={career.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{career.title}</div>
                        <div className="text-sm text-gray-500">{career.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {career.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(career.status)}>
                        {career.status.charAt(0).toUpperCase() + career.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {career.applicationsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/careers/${career.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/careers/${career.id}/edit`}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/careers/${career.id}/delete`}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
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
