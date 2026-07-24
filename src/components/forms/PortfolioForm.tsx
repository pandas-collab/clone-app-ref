'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface PortfolioFormData {
  title: string;
  slug: string;
  clientName: string;
  clientLogo: string;
  industry: string;
  servicesUsed: string[];
  challenge: string;
  solution: string;
  results: string;
  metrics: Array<{ label: string; value: string }>;
  testimonial: string;
  status: 'draft' | 'published';
}

interface PortfolioFormProps {
  portfolioId?: string;
  initialData?: Partial<PortfolioFormData>;
  onSubmit?: (data: PortfolioFormData) => Promise<void>;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Manufacturing',
  'Education',
  'Real Estate',
  'Non-profit',
  'Government',
  'Other'
];

const availableServices = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Digital Marketing',
  'SEO Optimization',
  'Content Marketing',
  'Social Media Marketing',
  'Brand Strategy',
  'Consulting'
];

export function PortfolioForm({ portfolioId, initialData, onSubmit }: PortfolioFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: '',
    slug: '',
    clientName: '',
    clientLogo: '',
    industry: '',
    servicesUsed: [],
    challenge: '',
    solution: '',
    results: '',
    metrics: [{ label: '', value: '' }],
    testimonial: '',
    status: 'draft',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !portfolioId) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, portfolioId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (formData.servicesUsed.length === 0) {
      newErrors.servicesUsed = 'At least one service must be selected';
    }

    if (!formData.challenge.trim()) {
      newErrors.challenge = 'Challenge description is required';
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution description is required';
    }

    if (!formData.results.trim()) {
      newErrors.results = 'Results description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PortfolioFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceToggle = (service: string) => {
    const updatedServices = formData.servicesUsed.includes(service)
      ? formData.servicesUsed.filter(s => s !== service)
      : [...formData.servicesUsed, service];
    handleInputChange('servicesUsed', updatedServices);
  };

  const handleMetricChange = (index: number, field: 'label' | 'value', value: string) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    handleInputChange('metrics', updatedMetrics);
  };

  const addMetric = () => {
    handleInputChange('metrics', [...formData.metrics, { label: '', value: '' }]);
  };

  const removeMetric = (index: number) => {
    if (formData.metrics.length > 1) {
      const updatedMetrics = formData.metrics.filter((_, i) => i !== index);
      handleInputChange('metrics', updatedMetrics);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, clientLogo: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, clientLogo: 'Image size must be less than 5MB' }));
      return;
    }

    setUploadingLogo(true);
    setErrors(prev => ({ ...prev, clientLogo: '' }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'portfolio-logo');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      handleInputChange('clientLogo', result.url);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, clientLogo: 'Failed to upload logo. Please try again.' }));
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent, saveAndContinue: boolean = false) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const url = portfolioId ? `/api/portfolio/${portfolioId}` : '/api/portfolio';
        const method = portfolioId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save portfolio item');
        }

        const result = await response.json();

        if (!saveAndContinue) {
          router.push('/admin/portfolio');
        } else {
          // Reset form for new entry if save and continue
          if (!portfolioId) {
            setFormData({
              title: '',
              slug: '',
              clientName: '',
              clientLogo: '',
              industry: '',
              servicesUsed: [],
              challenge: '',
              solution: '',
              results: '',
              metrics: [{ label: '', value: '' }],
              testimonial: '',
              status: 'draft',
            });
          }
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">{errors.submit}</div>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.title ? 'border-red-300' : ''
                }`}
                placeholder="Enter project title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.slug ? 'border-red-300' : ''
                }`}
                placeholder="project-slug"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
            </div>

            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                Client Name *
              </label>
              <input
                type="text"
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.clientName ? 'border-red-300' : ''
                }`}
                placeholder="Enter client name"
              />
              {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry *
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.industry ? 'border-red-300' : ''
                }`}
              >
                <option value="">Select industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
            </div>
          </div>

          {/* Client Logo Upload */}
          <div className="mt-6">
            <label htmlFor="clientLogo" className="block text-sm font-medium text-gray-700">
              Client Logo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {formData.clientLogo && (
                <div className="relative w-20 h-20">
                  <Image
                    src={formData.clientLogo}
                    alt="Client logo"
                    fill
                    className="object-contain rounded-md border"
                  />
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="clientLogo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('clientLogo')?.click()}
                  disabled={uploadingLogo}
                >
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </Button>
              </div>
            </div>
            {errors.clientLogo && <p className="mt-1 text-sm text-red-600">{errors.clientLogo}</p>}
          </div>
        </div>

        {/* Services Used */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Services Used *</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableServices.map((service) => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.servicesUsed.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
          {errors.servicesUsed && <p className="mt-1 text-sm text-red-600">{errors.servicesUsed}</p>}
        </div>

        {/* Project Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-700">
                Challenge *
              </label>
              <textarea
                id="challenge"
                rows={4}
                value={formData.challenge}
                onChange={(e) => handleInputChange('challenge', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.challenge ? 'border-red-300' : ''
                }`}
                placeholder="Describe the client's challenge..."
              />
              {errors.challenge && <p className="mt-1 text-sm text-red-600">{errors.challenge}</p>}
            </div>

            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                Solution *
              </label>
              <textarea
                id="solution"
                rows={4}
                value={formData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.solution ? 'border-red-300' : ''
                }`}
                placeholder="Describe the solution provided..."
              />
              {errors.solution && <p className="mt-1 text-sm text-red-600">{errors.solution}</p>}
            </div>

            <div>
              <label htmlFor="results" className="block text-sm font-medium text-gray-700">
                Results *
              </label>
              <textarea
                id="results"
                rows={4}
                value={formData.results}
                onChange={(e) => handleInputChange('results', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.results ? 'border-red-300' : ''
                }`}
                placeholder="Describe the results achieved..."
              />
              {errors.results && <p className="mt-1 text-sm text-red-600">{errors.results}</p>}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Key Metrics</h3>
            <Button type="button" variant="outline" onClick={addMetric}>
              Add Metric
            </Button>
          </div>
          <div className="space-y-4">
            {formData.metrics.map((metric, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Metric Label
                  </label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Increase in Sales"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 150%"
                  />
                </div>
                {formData.metrics.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeMetric(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Client Testimonial</h3>
          <div>
            <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700">
              Testimonial
            </label>
            <textarea
              id="testimonial"
              rows={4}
              value={formData.testimonial}
              onChange={(e) => handleInputChange('testimonial', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Client testimonial (optional)..."
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Publication Status</h3>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/portfolio')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : portfolioId ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}
