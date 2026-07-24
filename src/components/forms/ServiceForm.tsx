'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function ServiceForm({
  initialData = {},
  onSubmit,
  isLoading = false
}: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    shortDescription: initialData.shortDescription || '',
    price: initialData.price || '',
    features: initialData.features || '',
    category: initialData.category || '',
  });

    const [isSubmitting, setIsSubmitting] = useState(false);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      features: formData.features.split(',').map(feature => feature.trim()),
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Service Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <Input
        label="Short Description"
        name="shortDescription"
        value={formData.shortDescription}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <Input
        label="Price"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Starting at $1,000"
      />

      <Input
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <Input
        label="Features (comma-separated)"
        name="features"
        value={formData.features}
        onChange={handleChange}
        placeholder="Feature 1, Feature 2, Feature 3"
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Service'}
      </Button>
    </form>
  );
}
}
