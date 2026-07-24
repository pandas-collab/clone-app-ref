'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CareerForm {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'inactive' | 'draft';
}

export default function CreateCareerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [career, setCareer] = useState<CareerForm>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: [''],
    benefits: [''],
    status: 'draft'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/admin/careers');
    } catch (err) {
      setError('Failed to create career position');
      console.error('Create career error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CareerForm, value: any) => {
    setCareer({ ...career, [field]: value });
  };

  const updateArrayField = (field: 'requirements' | 'benefits', index: number, value: string) => {
    const newArray = [...career[field]];
    newArray[index] = value;
    setCareer({ ...career, [field]: newArray });
  };

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    setCareer({ ...career, [field]: [...career[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'benefits', index: number) => {
    if (career[field].length > 1) {
      const newArray = career[field].filter((_, i) => i !== index);
      setCareer({ ...career, [field]: newArray });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Career Position</h1>
          <p className="text-gray-600 mt-2">Add a new job posting</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={career.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <input
                type="text"
                value={career.department}
                onChange={(e) => updateField('department', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={career.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                value={career.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={career.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={career.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            {career.requirements.map((req, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
                  placeholder="Enter requirement"
                />
                {career.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              + Add Requirement
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
            </label>
            {career.benefits.map((benefit, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateArrayField('benefits', index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
                  placeholder="Enter benefit"
                />
                {career.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
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
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
