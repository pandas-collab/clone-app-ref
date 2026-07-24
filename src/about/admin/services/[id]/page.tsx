'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  benefits: string[];
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
}

export default function ServiceEditPage() {
  const { status } = useSession()
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Cloud Platforms',
    'Data & Analytics',
    'Enterprise Applications',
    'Digital Engineering'
  ];

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (params.id) {
      fetchService(params.id as string);
    }
  }, [params.id]);

  const fetchService = async (id: string) => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockService: Service = {
        id,
        title: 'Cloud Migration Services',
        category: 'Cloud Platforms',
        description: 'Seamlessly migrate your applications to the cloud with our expert guidance and proven methodologies.',
        features: ['Assessment & Planning', 'Migration Strategy', '24/7 Support'],
        benefits: ['Cost Optimization', 'Scalability', 'Security'],
        status: 'active',
        featured: true
      };
      setService(mockService);
    } catch (err) {
      setError('Failed to fetch service details');
      console.error('Fetch service error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    try {
      setSaving(true);
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/admin/services');
    } catch (err) {
      setError('Failed to save service');
      console.error('Save service error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Service, value: any) => {
    if (!service) return;
    setService({ ...service, [field]: value });
  };

  const updateArrayField = (field: 'features' | 'benefits', index: number, value: string) => {
    if (!service) return;
    const newArray = [...service[field]];
    newArray[index] = value;
    setService({ ...service, [field]: newArray });
  };

  const addArrayItem = (field: 'features' | 'benefits') => {
    if (!service) return;
    setService({ ...service, [field]: [...service[field], ''] });
  };

  const removeArrayItem = (field: 'features' | 'benefits', index: number) => {
    if (!service) return;
    const newArray = service[field].filter((_, i) => i !== index);
    setService({ ...service, [field]: newArray });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !service) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600 mt-2">Update service details</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title
              </label>
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={service.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={service.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={service.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Featured Service</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={service.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            {service.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateArrayField('features', index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
                  placeholder="Enter feature"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              + Add Feature
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
            </label>
            {service.benefits.map((benefit, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateArrayField('benefits', index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
                  placeholder="Enter benefit"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('benefits', index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
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
            <Link
              href="/admin/services"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
