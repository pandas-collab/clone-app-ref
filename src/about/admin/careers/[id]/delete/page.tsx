'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export default function CareerDeletePage() {
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchCareer();
    }
  }, [id]);

  const fetchCareer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/careers/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Career position not found');
        }
        throw new Error('Failed to fetch career');
      }
      const data = await response.json();
      setCareer(data.career);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load career');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!career) return;

    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(`/api/admin/careers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete career');
      }

      router.push('/about/admin/careers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete career');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading career...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !career) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">Error</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href="/about/admin/careers"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Career position not found</p>
              <Link
                href="/about/admin/careers"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">Delete Career Position</h1>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900">{career.title}</h3>
                <p className="text-gray-600">{career.department}  {career.location}  {career.type}</p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this career position? This action cannot be undone.
                </p>
                <p className="text-sm text-red-600">
                  All associated job applications will also be affected.
                </p>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Position'}
                </button>
                <Link
                  href="/about/admin/careers"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
