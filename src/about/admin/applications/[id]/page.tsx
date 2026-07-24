'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  careerId: string
  careerTitle: string
  name: string
  email: string
  phone: string
  resume: string
  coverLetter: string
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected'
  submittedAt: string
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }

    fetchApplication()
  }, [session, status, router, params.id])

  const fetchApplication = async () => {
    try {
      setLoading(true)

      // Mock application data - replace with actual API call
      const mockApplication: Application = {
        id: params.id,
        careerId: '1',
        careerTitle: 'Software Developer',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        resume: 'Link to resume document',
        coverLetter: 'I am excited to apply for this position because...',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z'
      }

      setApplication(mockApplication)
    } catch (err) {
      setError('Failed to fetch application')
      console.error('Fetch application error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status: Application['status']) => {
    if (!application) return

    try {
      // Mock status update - replace with actual API call
      setApplication(prev => prev ? { ...prev, status } : null)
    } catch (err) {
      setError('Failed to update application status')
      console.error('Update status error:', err)
    }
  }

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <button
            onClick={() => router.push('/admin/applications')}
            className="text-blue-600 hover:text-blue-800"
          >
            <- Back to Applications
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/applications')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            <- Back to Applications
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {application.name}
              </h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">Applied for: {application.careerTitle}</p>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Contact Information
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-900">
                    <strong>Email:</strong> {application.email}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Phone:</strong> {application.phone}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Application Info
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-900">
                    <strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Position:</strong> {application.careerTitle}
                  </p>
                </div>
              </div>
            </div>

            {application.resume && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Resume
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-900">{application.resume}</p>
                </div>
              </div>
            )}

            {application.coverLetter && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Cover Letter
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Update Status
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => updateStatus('reviewing')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={application.status === 'reviewing'}
                >
                  Mark as Reviewing
                </button>
                <button
                  onClick={() => updateStatus('accepted')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={application.status === 'accepted'}
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={application.status === 'rejected'}
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
