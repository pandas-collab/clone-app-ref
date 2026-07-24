'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface PortfolioFormProps {
  portfolioId?: string;
}

export function PortfolioForm({ portfolioId }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    clientName: '',
    clientLogo: '',
    industry: '',
    servicesUsed: '',
    challenge: '',
    solution: '',
    results: '',
    metrics: '',
    testimonial: '',
    status: 'draft' as 'draft' | 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting portfolio:', formData);
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

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Client Name"
            value={formData.clientName}
            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
            required
          />
          <Input
            label="Industry"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            required
          />
        </div>

        <Input
          label="Services Used"
          value={formData.servicesUsed}
          onChange={(e) => setFormData(prev => ({ ...prev, servicesUsed: e.target.value }))}
        />

        <Input
          label="Challenge"
          value={formData.challenge}
          onChange={(e) => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
        />

        <Input
          label="Solution"
          value={formData.solution}
          onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
        />

        <Input
          label="Results"
          value={formData.results}
          onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
        />

        <Input
          label="Testimonial"
          value={formData.testimonial}
          onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
        />

        <div className="flex gap-4">
          <Button type="submit">Save</Button>
          <Button type="submit" variant="outline">Save & Continue</Button>
        </div>
      </form>
    </Card>
  );
}
