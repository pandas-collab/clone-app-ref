'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Career {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  responsibilities: string[]
  salary: string
  benefits: string[]
  isActive: boolean
}

export default function EditCareerPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [career, setCareer] = useState<Career | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        type: 'Full-time',
        description: 'We are looking for a talented software developer to join our team.',
        requirements: [
          '3+ years of experience in software development',
          'Proficiency in JavaScript/TypeScript',
          'Experience with React and Node.js'
        ],
        responsibilities: [
          'Develop and maintain web applications',
          'Collaborate with cross-functional teams',
          'Write clean, maintainable code'
        ],
        salary: '$80,000 - $120,000',
        benefits: [
          'Health insurance',
          'Flexible working hours',
          'Professional development budget'
        ],
        isActive: true
      }

      setCareer(mockCareer)
    } catch (err) {
      setError('Failed to fetch career')
      console.error('Fetch career error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!career) return

    try {
      setSaving(true)
      setError('')

      // Mock save operation - replace with actual API call
      console.log('Saving career:', career)

      router.push('/admin/careers')
    } catch (err) {
      setError('Failed to save career')
      console.error('Save career error:', err)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof Career, value: any) => {
    if (!career) return
    setCareer({ ...career, [field]: value })
  }

  const updateArrayField = (field: 'requirements' | 'responsibilities' | 'benefits', value: string) => {
    if (!career) return
    const items = value.split('\n').filter(item => item.trim())
    setCareer({ ...career, [field]: items })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading career...</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/careers')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            <- Back to Careers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Career</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={career.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={career.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={career.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  value={career.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={career.salary}
                  onChange={(e) => updateField('salary', e.target.value)}
                  placeholder="e.g. $80,000 - $120,000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={career.isActive}
                    onChange={(e) => updateField('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Active (visible to applicants)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={career.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                value={career.requirements.join('\n')}
                onChange={(e) => updateArrayField('requirements', e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities (one per line)
              </label>
              <textarea
                value={career.responsibilities.join('\n')}
                onChange={(e) => updateArrayField('responsibilities', e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (one per line)
              </label>
              <textarea
                value={career.benefits.join('\n')}
                onChange={(e) => updateArrayField('benefits', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => router.push('/admin/careers')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
