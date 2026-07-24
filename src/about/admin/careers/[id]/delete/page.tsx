'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  applicationsCount: number;
}

export default function DeleteCareerPage() {
  const params = useParams();
  const router = useRouter();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCareer(params.id as string);
    }
  }, [params.id]);

  const fetchCareer = async (id: string) => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockCareer: Career = {
        id,
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'Remote',
        applicationsCount: 12
      };
      setCareer(mockCareer);
    } catch (err) {
      setError('Failed to fetch career details');
      console.error('Fetch career error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!career) return;

    try {
      setDeleting(true);
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/admin/careers');
    } catch (err) {
      setError('Failed to delete career position');
      console.error('Delete career error:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="bg-gray-300 h-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !career) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!career) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Delete Career Position</h1>
          <p className="text-gray-600 mt-2">This action cannot be undone</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Are you sure you want to delete this position?
            </h2>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{career.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {career.department}  {career.location}
              </p>
              {career.applicationsCount > 0 && (
                <p className="text-sm text-orange-600 mt-2">
                   This position has {career.applicationsCount} applications that will also be affected.
                </p>
              )}
            </div>
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Position'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
