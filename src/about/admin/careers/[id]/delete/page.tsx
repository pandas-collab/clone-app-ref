'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Career {
  id: string
  title: string
  department: string
  location: string
  applicationsCount: number
}

export default function DeleteCareerPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [career, setCareer] = useState<Career | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }

    fetchCareer()
  }, [session, status, router, params.id])

  const fetchCareer = async () => {
    try {
      setLoading(true)

      // Mock career data - replace with actual API call
      const mockCareer: Career = {
        id: params.id,
        title: 'Software Developer',
        department: 'Engineering',
        location: 'Remote',
        applicationsCount: 5
      }

      setCareer(mockCareer)
    } catch (err) {
      setError('Failed to fetch career')
      console.error('Fetch career error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!career) return

    try {
      setDeleting(true)
      setError('')

      // Mock delete operation - replace with actual API call
      console.log('Deleting career:', career.id)

      router.push('/admin/careers')
    } catch (err) {
      setError('Failed to delete career')
      console.error('Delete career error:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Not Found</h2>
          <button
            onClick={() => router.push('/admin/careers')}
            className="text-blue-600 hover:text-blue-800"
          >
            <- Back to Careers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/careers')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            <- Back to Careers
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Delete Job Posting</h1>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{career.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Department:</strong> {career.department}</p>
              <p><strong>Location:</strong> {career.location}</p>
              <p><strong>Applications:</strong> {career.applicationsCount}</p>
            </div>
          </div>

          {career.applicationsCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="text-sm text-yellow-700 mt-1">
                    This job posting has {career.applicationsCount} application{career.applicationsCount !== 1 ? 's' : ''}.
                    Deleting it will also remove all associated applications.
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this job posting? This will permanently remove the job posting
            {career.applicationsCount > 0 ? ' and all its applications' : ''} from the system.
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push('/admin/careers')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Job Posting'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
