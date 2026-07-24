'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateServicePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: '',
    price: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.split(',').map(f => f.trim()).filter(f => f),
          price: formData.price ? parseFloat(formData.price) : null
        }),
      });

      if (response.ok) {
        router.push('/admin/services');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create service');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Create Service</h1>

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
          <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
            Features (comma-separated)
          </label>
          <input
            type="text"
            id="features"
            placeholder="Feature 1, Feature 2, Feature 3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.features}
            onChange={(e) => setFormData({...formData, features: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Service'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
