'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ServiceCreateData {
  title: string;
  description: string;
  category: string;
  price?: number;
}

export default function CreateService() {
  const [formData, setFormData] = useState<ServiceCreateData>({
    title: '',
    description: '',
    category: '',
    price: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/services');
      } else {
        setError('Failed to create service');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndContinue = async (data: ServiceCreateData) => {
    if (!data.title || !data.description || !data.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Reset form for next entry
        setFormData({
          title: '',
          description: '',
          category: '',
          price: undefined
        });
        setError('Service created successfully!');
      } else {
        setError('Failed to create service');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Service</h1>

      {error && (
        <div className="mb-4 p-4 border rounded bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Category *
          </label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Price
          </label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Service'}
          </button>

          <button
            type="button"
            onClick={() => handleSaveAndContinue(formData)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Save & Create Another
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
