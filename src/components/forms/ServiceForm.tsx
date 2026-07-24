'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface ServiceFormProps {
  serviceId?: string;
}

export function ServiceForm({ serviceId }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    category: '',
    keyFeatures: [''],
    benefits: [''],
    metaTitle: '',
    metaDescription: '',
    featuredImage: '',
    status: 'draft' as 'draft' | 'published'
  });

 
  // Dynamic list handlers
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature, i) => i === index ? value : feature)
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting service:', formData);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, '']
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            required
          />
        </div>

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">Key Features</label>
          {formData.keyFeatures.map((feature, index) => (
            <Input
              key={index}
              value={feature}
              onChange={(e) => {
                const newFeatures = [...formData.keyFeatures];
                newFeatures[index] = e.target.value;
                setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
              }}
              className="mb-2"
            />
          ))}
          <Button type="button" onClick={addFeature}>Add Feature</Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Benefits</label>
          {formData.benefits.map((benefit, index) => (
            <Input
              key={index}
              value={benefit}
              onChange={(e) => {
                const newBenefits = [...formData.benefits];
                newBenefits[index] = e.target.value;
                setFormData(prev => ({ ...prev, benefits: newBenefits }));
              }}
              className="mb-2"
            />
          ))}
          <Button type="button" onClick={addBenefit}>Add Benefit</Button>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Save</Button>
          <Button type="submit" variant="outline">Save & Continue</Button>
        </div>
      </form>
    </Card>
  );
}
