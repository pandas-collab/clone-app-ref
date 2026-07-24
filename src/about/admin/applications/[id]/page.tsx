'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Application {
  id: string;
  careerId: string;
  careerTitle: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchApplication(params.id as string);
    }
  }, [params.id]);

  const fetchApplication = async (id: string) => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockApplication: Application = {
        id,
        careerId: '1',
        careerTitle: 'Senior Full Stack Developer',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        resume: 'resume-john-doe.pdf',
        coverLetter: 'I am excited to apply for this position...',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setApplication(mockApplication);
    } catch (err) {
      setError('Failed to fetch application details');
      console.error('Fetch application error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: Application['status']) => {
    if (!application) return;

    try {
      setApplication(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      setError('Failed to update application status');
      console.error('Update status error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="bg-gray-300 h-96 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Application not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
          <p className="text-gray-600 mt-2">Review application for {application.careerTitle}</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {application.name}
              </h2>
              <div className="flex items-center space-x-4">
                <select
                  value={application.status}
                  onChange={(e) => updateStatus(e.target.value as Application['status'])}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{application.email}</dd>
                  </div>
                  {application.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{application.phone}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Applied Date</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Position Details</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Position</dt>
                    <dd className="text-sm text-gray-900">{application.careerTitle}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900 capitalize">{application.status}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {application.resume && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{application.resume}</span>
                    <button className="ml-auto text-sm text-indigo-600 hover:text-indigo-900">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {application.coverLetter && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
