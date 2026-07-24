'use client';

import { PortfolioForm } from '@/components/forms/PortfolioForm';

export default function CreatePortfolioPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Portfolio Item</h1>
      <PortfolioForm />
    </div>
  );
}
