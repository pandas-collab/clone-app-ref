'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  careerId?: string
  careerTitle?: string
  firstName?: string
  lastName?: string
  name?: string
  email: string
  phone?: string
  position?: string
  coverLetter?: string
  resumeUrl?: string
  resume?: string
  appliedAt?: string
  createdAt?: string
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted'
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (status === 'authenticated') {
      loadApplication()
    }
  }, [status, router, params.id])

  const loadApplication = async () => {
    try {
      setLoading(true)

      // Mock application data
      const mockApplications: Record<string, Application> = {
        "app_001": {
          id: "app_001",
          firstName: "John",
          lastName: "Doe",
          name: "John Doe",
          email: "john@example.com",
          phone: "(555) 123-4567",
          position: "Senior Full Stack Developer",
          careerTitle: "Senior Full Stack Developer",
          careerId: "1",
          coverLetter: "I am excited to apply for the Senior Full Stack Developer position. With over 6 years of experience in web development, I have worked extensively with React, Node.js, and various databases. I am passionate about creating scalable applications and mentoring junior developers. I believe my skills and experience would be a great fit for your team.",
          resumeUrl: "/uploads/john-doe-resume.pdf",
          resume: "john-doe-resume.pdf",
          appliedAt: "2024-01-15T10:30:00Z",
          createdAt: "2024-01-15T10:30:00Z",
          status: "pending"
        },
        "app_002": {
          id: "app_002",
          firstName: "Jane",
          lastName: "Smith",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "(555) 987-6543",
          position: "UX/UI Designer",
          careerTitle: "UX/UI Designer",
          careerId: "2",
          coverLetter: "As a UX/UI Designer with 4 years of experience, I am thrilled to apply for this position. I have a strong background in user research, wireframing, and creating design systems. My portfolio demonstrates my ability to create intuitive and accessible interfaces that delight users while meeting business objectives.",
          resumeUrl: "/uploads/jane-smith-resume.pdf",
          resume: "jane-smith-resume.pdf",
          appliedAt: "2024-01-14T14:20:00Z",
          createdAt: "2024-01-14T14:20:00Z",
          status: "reviewed"
        }
      }

      const app = mockApplications[params.id]
      if (app) {
        setApplication(app)
      } else {
        setError('Application not found')
      }
    } catch (error) {
      console.error('Error loading application:', error)
      setError('Failed to fetch application details')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: Application['status']) => {
    if (!application) return

    try {
      setUpdating(true)

      // Here you would typically make an API call
      // await fetch(`/api/applications/${application.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })

      setApplication(prev => prev ? { ...prev, status: newStatus } : prev)

      // Show success message
      alert('Application status updated successfully!')
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update application status')
      alert('Failed to update status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium"
    switch (status) {
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`
      case 'reviewed':
        return `${baseClass} bg-blue-100 text-blue-800`
      case 'interviewed':
        return `${baseClass} bg-purple-100 text-purple-800`
      case 'accepted':
        return `${baseClass} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClass} bg-red-100 text-red-800`
      default:
        return `${baseClass} bg-gray-100 text-gray-800`
    }
  }

  const getDisplayName = () => {
    if (application?.firstName && application?.lastName) {
      return `${application.firstName} ${application.lastName}`
    }
    return application?.name || 'Unknown'
  }

  const getPositionTitle = () => {
    return application?.position || application?.careerTitle || 'Unknown Position'
  }

  const getAppliedDate = () => {
    const dateStr = application?.appliedAt || application?.createdAt
    return dateStr ? new Date(dateStr) : new Date()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Application Not Found</h2>
          <p className="mt-2 text-gray-600">{error || 'The requested application could not be found.'}</p>
          <button
            onClick={() => router.push('/admin/applications')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/applications')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Applications
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getDisplayName()}
              </h1>
              <p className="text-gray-600">Applied for {getPositionTitle()}</p>
            </div>
            <span className={getStatusBadgeClass(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{application.email}</p>
                </div>
                {application.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{application.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {/* Resume */}
            {(application.resumeUrl || application.resume) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{application.resume || 'Resume File'}</span>
                    <a
                      href={application.resumeUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Applied Date</label>
                  <p className="text-gray-900">
                    {getAppliedDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Position</label>
                  <p className="text-gray-900">{getPositionTitle()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900 capitalize">{application.status}</p>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
              <div className="space-y-2">
                <select
                  value={application.status}
                  onChange={(e) => updateStatus(e.target.value as Application['status'])}
                  disabled={updating}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                {[
                  { value: 'pending', label: 'Pending Review', color: 'yellow' },
                  { value: 'reviewed', label: 'Reviewed', color: 'blue' },
                  { value: 'interviewed', label: 'Interviewed', color: 'purple' },
                  { value: 'accepted', label: 'Accepted', color: 'green' },
                  { value: 'rejected', label: 'Rejected', color: 'red' }
                ].map((statusOption) => (
                  <button
                    key={statusOption.value}
                    onClick={() => updateStatus(statusOption.value as Application['status'])}
                    disabled={updating || application.status === statusOption.value}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      application.status === statusOption.value
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {statusOption.label}
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
