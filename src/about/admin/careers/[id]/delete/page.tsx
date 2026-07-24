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
  applicationsCount: number
}

export default function DeleteCareerPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [career, setCareer] = useState<Career | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (status === 'authenticated') {
      loadCareer()
    }
  }, [status, router, params.id])

  const loadCareer = async () => {
    try {
      setLoading(true)

      // Mock career data
      const mockCareer: Career = {
        id: params.id,
        title: "Senior Full Stack Developer",
        department: "Engineering",
        location: "Remote / San Francisco, CA",
        applicationsCount: 15
      }

      setCareer(mockCareer)
    } catch (err) {
      console.error('Error loading career:', err)
      setError('Failed to fetch career details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!career) return

    try {
      setDeleting(true)
      setError(null)

      // Here you would typically make an API call
      console.log('Deleting career:', career.id)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('Career opportunity deleted successfully!')
      router.push('/admin/careers')

    } catch (err) {
      console.error('Error deleting career:', err)
      setError('Failed to delete career position')
      alert('Failed to delete career opportunity. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Career Not Found</h2>
          <Link
            href="/admin/careers"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
          >
            Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/careers"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <- Back to Careers
        </Link>

        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Delete Career Opportunity</h1>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this career opportunity? This action cannot be undone.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{career.title}</h2>
              <p className="text-gray-600">{career.department}  {career.location}</p>
              {career.applicationsCount > 0 && (
                <p className="text-sm text-red-600 mt-2">
                   This position has {career.applicationsCount} application(s) that will also be affected.
                </p>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Warning</h3>
                  <div className="text-sm text-red-700 mt-1">
                    <ul className="list-disc list-inside">
                      <li>This career position will be permanently deleted</li>
                      <li>All associated applications will be removed</li>
                      <li>This action cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <Link
                href="/admin/careers"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
