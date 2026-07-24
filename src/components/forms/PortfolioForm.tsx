'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface PortfolioFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function PortfolioForm({
  initialData = {},
  onSubmit,
  isLoading = false
}: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    imageUrl: initialData.imageUrl || '',
    projectUrl: initialData.projectUrl || '',
    category: initialData.category || '',
    technologies: initialData.technologies || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
    };
    onSubmit(processedData);
    const handleSubmit = async (e: React.FormEvent) => {

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <Input
        label="Image URL"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        required
      />

      <Input
        label="Project URL"
        name="projectUrl"
        value={formData.projectUrl}
        onChange={handleChange}
      />

      <Input
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <Input
        label="Technologies (comma-separated)"
        name="technologies"
        value={formData.technologies}
        onChange={handleChange}
        placeholder="React, TypeScript, Tailwind CSS"
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Portfolio Item'}
      </Button>
    </form>
  );
}
}
