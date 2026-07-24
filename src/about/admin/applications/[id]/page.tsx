'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  resume: string
  coverLetter?: string
  linkedIn?: string
  portfolio?: string
  status: string
  createdAt: string
  career: {
    title: string
    description: string
  }
}

export default function ApplicationDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/unauthorized')
      return
    }

    if (params.id) {
      fetchApplication()
    }
  }, [session, status, router, params.id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/applications/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch application')
      }

      const data = await response.json()
      setApplication(data)
    } catch (error) {
      console.error('Fetch error:', error)
      setError('Failed to load application')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/applications/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await fetchApplication()
    } catch (error) {
      console.error('Update error:', error)
      setError('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
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
            <Link href="/admin/applications" className="text-blue-600 hover:text-blue-800">
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
        <div className="mb-8">
          <Link href="/admin/applications" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            <- Back to Applications
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {application.firstName} {application.lastName}
              </h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
          </div>

          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{application.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{application.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Applied Date</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Position</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="text-sm text-gray-900">{application.career.title}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents & Links</h3>
              <div className="space-y-2">
                <div>
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                     View Resume
                  </a>
                </div>
                {application.linkedIn && (
                  <div>
                    <a
                      href={application.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                       LinkedIn Profile
                    </a>
                  </div>
                )}
                {application.portfolio && (
                  <div>
                    <a
                      href={application.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                       Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>

            {application.coverLetter && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
              <div className="flex space-x-3">
                {['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={updating || application.status === status}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      application.status === status
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                    }`}
                  >
                    {updating ? 'Updating...' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
