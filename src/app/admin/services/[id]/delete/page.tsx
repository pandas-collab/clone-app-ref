'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Service {
  id: string
  title: string
  slug: string
  description: string
  status: 'DRAFT' | 'PUBLISHED'
}

export default function DeleteService({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && params.id) {
      fetchService()
    }
  }, [session, params.id])

  const fetchService = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/services/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch service')
      }

      const data = await response.json()
      setService(data)
    } catch (error) {
      console.error('Fetch service error:', error)
      setError('Failed to load service')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setError('')
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/services/${params.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete service')
      }

      router.push('/admin/services')
    } catch (error) {
      console.error('Delete service error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete service')
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || !service) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Delete Service</h1>
        <p className="text-gray-600 mt-2">This action cannot be undone</p>
      </div>

      <Card className="p-6">
        {error && <ErrorMessage message={error} />}

        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Warning: Permanent Deletion
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  You are about to permanently delete this service. This action cannot be undone
                  and will remove all associated data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Service Details</h3>
            <dl className="mt-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Title:</dt>
                <dd className="text-sm text-gray-900">{service.title}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Slug:</dt>
                <dd className="text-sm text-gray-900">{service.slug}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Status:</dt>
                <dd className="text-sm text-gray-900">{service.status}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Description:</dt>
                <dd className="text-sm text-gray-900">{service.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Service'
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
