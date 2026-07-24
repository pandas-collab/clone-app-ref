'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Service {
  id: string
  title: string
  slug: string
  description: string
  content: string
  icon?: string
  featured: boolean
  status: 'DRAFT' | 'PUBLISHED'
}

export default function EditService({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return

    setError('')
    setIsSaving(true)

    try {
      const response = await fetch(`/api/services/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update service')
      }

      router.push('/admin/services')
    } catch (error) {
      console.error('Update service error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update service')
    } finally {
      setIsSaving(false)
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-600 mt-2">Update service information</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorMessage message={error} />}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              required
              value={service.title}
              onChange={(e) => setService(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <Input
              id="slug"
              type="text"
              required
              value={service.slug}
              onChange={(e) => setService(prev => prev ? { ...prev, slug: e.target.value } : null)}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              required
              value={service.description}
              onChange={(e) => setService(prev => prev ? { ...prev, description: e.target.value } : null)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content *
            </label>
            <textarea
              id="content"
              required
              value={service.content}
              onChange={(e) => setService(prev => prev ? { ...prev, content: e.target.value } : null)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={8}
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <Input
              id="icon"
              type="text"
              value={service.icon || ''}
              onChange={(e) => setService(prev => prev ? { ...prev, icon: e.target.value } : null)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                id="featured"
                type="checkbox"
                checked={service.featured}
                onChange={(e) => setService(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured service
              </label>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={service.status}
                onChange={(e) => setService(prev => prev ? {
                  ...prev,
                  status: e.target.value as 'DRAFT' | 'PUBLISHED'
                } : null)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
