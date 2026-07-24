'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  coverLetter?: string;
  experience?: string;
  education?: string;
  skills?: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  resumeUrl?: string;
}

export default function ApplicationDetailPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/applications/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Application not found');
        }
        throw new Error('Failed to fetch application');
      }
      const data = await response.json();
      setApplication(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!application) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setApplication(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const deleteApplication = async () => {
    if (!application || !confirm('Are you sure you want to delete this application?')) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      router.push('/about/admin/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading application...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">Error</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href="/about/admin/applications"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Application not found</p>
              <Link
                href="/about/admin/applications"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {application.firstName} {application.lastName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">Application for {application.position}</p>
              </div>
              <Link
                href="/about/admin/applications"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Applications
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {application.email}</p>
                  <p><span className="font-medium">Phone:</span> {application.phone}</p>
                  <p><span className="font-medium">Applied:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Updated:</span> {new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Application Status</h3>
                <div className="space-y-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {['pending', 'reviewing', 'accepted', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(status)}
                        disabled={updating || application.status === status}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                          application.status === status
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {application.resumeUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Resume</h3>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
                >
                  View Resume
                </a>
              </div>
            )}

            {application.coverLetter && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {application.experience && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Experience</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.experience}</p>
                </div>
              </div>
            )}

            {application.education && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Education</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.education}</p>
                </div>
              </div>
            )}

            {application.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.skills}</p>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={deleteApplication}
                disabled={updating}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {updating ? 'Deleting...' : 'Delete Application'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
