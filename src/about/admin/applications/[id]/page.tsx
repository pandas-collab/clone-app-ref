'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Application {
  id: string
  careerId: string
  name: string
  email: string
  phone: string
  resume: string
  coverLetter: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchApplication(params.id as string)
    }
  }, [params.id])

  const fetchApplication = async (id: string) => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockApplication: Application = {
        id,
        careerId: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'I am very interested in this position and believe my skills in React and Node.js make me a great fit...',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setApplication(mockApplication)
    } catch (error) {
      console.error('Failed to fetch application:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: Application['status']) => {
    if (!application) return

    try {
      setUpdating(true)
      // Mock update
      setApplication({
        ...application,
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="bg-gray-300 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
            <Link
              href="/about/admin/applications"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/about/admin/applications"
            className="text-indigo-600 hover:text-indigo-500 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Application from {application.name}
              </h2>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {application.email}</p>
                  <p><span className="font-medium">Phone:</span> {application.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Application Info</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Applied:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Resume</h3>
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 underline"
              >
                View Resume (PDF)
              </a>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Cover Letter</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Update Status</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => updateStatus('reviewed')}
                  disabled={updating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Mark as Reviewed
                </button>
                <button
                  onClick={() => updateStatus('accepted')}
                  disabled={updating}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={updating}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
