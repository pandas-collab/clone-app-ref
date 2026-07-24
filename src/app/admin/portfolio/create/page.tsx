'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioForm from '@/components/forms/PortfolioForm';

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/portfolio');
      } else {
        throw new Error('Failed to create portfolio item');
      }
    } catch (error) {
      console.error('Error creating portfolio item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Portfolio Item</h1>
      <PortfolioForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
