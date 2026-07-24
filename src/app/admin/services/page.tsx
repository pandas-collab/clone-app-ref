'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ServicesManagementPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Management</h1>
        <Link href="/admin/services/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create New
        </Link>
      </div>
      <div className="grid gap-4">
        {services.map((service: any) => (
          <div key={service.id} className="border p-4 rounded">
            <h3 className="font-bold">{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
