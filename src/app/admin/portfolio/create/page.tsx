'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePortfolioPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    technologies: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
        }),
      });

      if (response.ok) {
        router.push('/admin/portfolio');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create portfolio item');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Create Portfolio Item</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Project URL
          </label>
          <input
            type="url"
            id="projectUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.projectUrl}
            onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            id="technologies"
            placeholder="React, Node.js, MongoDB"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Portfolio Item'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/portfolio')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
