'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Career {
  id: string
  title: string
  location: string
  type: string
  _count: {
    applications: number
  }
}

export default function DeleteCareerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [career, setCareer] = useState<Career | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

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
      fetchCareer()
    }
  }, [session, status, router, params.id])

  const fetchCareer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/careers/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch career')
      }

      const data = await response.json()
      setCareer(data)
    } catch (error) {
      console.error('Fetch error:', error)
      setError('Failed to load career')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError('')

      const response = await fetch(`/api/admin/careers/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete career')
      }

      router.push('/admin/careers')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Career Not Found</h1>
            <Link href="/admin/careers" className="text-blue-600 hover:text-blue-800">
              Back to Careers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin/careers" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            <- Back to Careers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Delete Career Position</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">Career Position Details:</h4>
            <dl className="space-y-1">
              <div>
                <dt className="text-sm font-medium text-gray-500 inline">Title: </dt>
                <dd className="text-sm text-gray-900 inline">{career.title}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 inline">Location: </dt>
                <dd className="text-sm text-gray-900 inline">{career.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 inline">Type: </dt>
                <dd className="text-sm text-gray-900 inline">{career.type.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 inline">Applications: </dt>
                <dd className="text-sm text-gray-900 inline">{career._count.applications}</dd>
              </div>
            </dl>
          </div>

          {career._count.applications > 0 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Warning: This position has applications
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      This career position has {career._count.applications} application(s).
                      Deleting this position will also delete all associated applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/careers"
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Career Position'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
