'use client';

import { PortfolioForm } from '@/components/forms/PortfolioForm';

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Portfolio Item</h1>
      <PortfolioForm portfolioId={params.id} />
    </div>
  );
}
