'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CareerFormData {
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  status: 'active' | 'inactive' | 'draft'
}

export default function CreateCareerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CareerFormData>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: 'Mid Level',
    salary: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    benefits: [''],
    status: 'draft'
  })

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const handleInputChange = (field: keyof CareerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateField = (field: keyof CareerFormData, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleArrayChange = (field: 'responsibilities' | 'requirements' | 'benefits', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const updateArrayField = (field: 'requirements' | 'benefits', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addArrayItem = (field: 'responsibilities' | 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'responsibilities' | 'requirements' | 'benefits', index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, [field]: newArray }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaving(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title || !formData.department || !formData.description) {
        throw new Error('Please fill in all required fields')
      }

      // Filter out empty array items
      const cleanedData = {
        ...formData,
        responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        benefits: formData.benefits.filter(item => item.trim() !== '')
      }

      // Here you would typically make an API call
      console.log('Creating career:', cleanedData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('Career opportunity created successfully!')
      router.push('/admin/careers')

    } catch (error) {
      console.error('Error creating career:', error)
      setError('Failed to create career opportunity. Please try again.')
      alert('Failed to create career opportunity. Please try again.')
    } finally {
      setLoading(false)
      setSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/careers"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <- Back to Careers
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Career Opportunity</h1>
          <p className="text-gray-600 mt-2">Add a new job posting</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="e.g., $80,000 - $120,000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                required
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                Responsibilities
              </label>
              {formData.responsibilities.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('responsibilities', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    disabled={formData.responsibilities.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('responsibilities')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add responsibility
              </button>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                Requirements
              </label>
              {formData.requirements.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter requirement"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                + Add Requirement
              </button>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                Benefits
              </label>
              {formData.benefits.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter benefit"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                + Add Benefit
              </button>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Position'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
