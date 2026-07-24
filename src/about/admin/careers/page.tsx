'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Career {
  id: string
  title: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  status: 'active' | 'inactive'
  createdAt: string
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      setLoading(true)
      // Mock data
      const mockCareers: Career[] = [
        {
          id: '1',
          title: 'Software Engineer',
          location: 'Remote',
          type: 'full-time',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Product Manager',
          location: 'New York',
          type: 'full-time',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ]
      setCareers(mockCareers)
    } catch (error) {
      console.error('Failed to fetch careers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Positions</h1>
            <p className="mt-2 text-gray-600">Manage job openings and career opportunities</p>
          </div>
          <Link
            href="/about/admin/careers/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create New Position
          </Link>
        </div>

        <div className="grid gap-6">
          {careers.map((career) => (
            <div key={career.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {career.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span> {career.location}</span>
                    <span> {career.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      career.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {career.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Created {new Date(career.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-3 ml-4">
                  <Link
                    href={`/about/admin/careers/${career.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View/Edit
                  </Link>
                  <Link
                    href={`/about/admin/careers/${career.id}/delete`}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {careers.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m8 0h.01M8 6h.01"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No career positions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new career position.
            </p>
            <div className="mt-6">
              <Link
                href="/about/admin/careers/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create New Position
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
