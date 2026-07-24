'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioForm } from '@/components/forms/PortfolioForm';

export default function CreatePortfolioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const initialData = {
    title: '',
    description: '',
    client: '',
    technologies: [],
    status: 'draft' as const,
    featured: false,
    projectUrl: '',
    repositoryUrl: '',
    completedAt: null,
    images: []
  };

  const handleSubmit = async (data: any, saveAndContinue = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create portfolio item');
      }

      const result = await response.json();

      if (saveAndContinue) {
        // Stay on the form but redirect to edit mode
        router.push(`/admin/portfolio/${result.id}`);
      } else {
        // Return to portfolio list
        router.push('/admin/portfolio');
      }
    } catch (err) {
      console.error('Error creating portfolio item:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/portfolio');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <button
              onClick={() => router.push('/admin')}
              className="hover:text-blue-600 transition-colors"
            >
              Admin
            </button>
          </li>
          <li className="before:content-['/'] before:mx-2">
            <button
              onClick={() => router.push('/admin/portfolio')}
              className="hover:text-blue-600 transition-colors"
            >
              Portfolio
            </button>
          </li>
          <li className="before:content-['/'] before:mx-2 text-gray-900">
            Create New
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Portfolio Item
        </h1>
        <p className="text-gray-600">
          Add a new case study to showcase your work and client success stories.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error creating portfolio item
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <PortfolioForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            mode="create"
          />
        </div>
      </div>
    </div>
  );
}
