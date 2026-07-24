'use client';

import React from 'react';
import { ServiceForm } from '@/components/forms/ServiceForm';

export default function EditServicePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Service</h1>
      <ServiceForm serviceId={params.id} />
    </div>
  );
}
