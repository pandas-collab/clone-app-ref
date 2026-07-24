'use client';

import { ServiceForm } from '@/components/forms/ServiceForm';

export default function CreateServicePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Service</h1>
      <ServiceForm />
    </div>
  );
}
