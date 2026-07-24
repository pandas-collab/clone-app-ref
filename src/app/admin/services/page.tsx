import Sidebar from "@/components/layout/Sidebar";
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ServicesPage() {
  const [services] = useState([
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices(services.map(s => s.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleSelectService = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, id]);
    } else {
      setSelectedServices(prev => prev.filter(sId => sId !== id));
    }
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedServices.length > 0) {
      console.log(`Performing ${bulkAction} on services:`, selectedServices);
      // Implement bulk actions here
      setSelectedServices([]);
      setBulkAction('');
    }
  };
    { id: 1, title: 'Web Development', category: 'Development', status: 'published' },
    { id: 2, title: 'Mobile Apps', category: 'Development', status: 'draft' }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Management</h1>
        <Link href="/admin/services/create">
          <Button>+ Create Service</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
 
        {/* Bulk Actions */}
        {selectedServices.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 border rounded-lg">
            <span className="text-sm text-gray-600">
              {selectedServices.length} item(s) selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="">Choose action...</option>
              <option value="publish">Publish</option>
              <option value="draft">Set to Draft</option>
              <option value="delete">Delete</option>
            </select>
            <Button onClick={handleBulkAction} disabled={!bulkAction}>
              Apply
            </Button>
          </div>
        )}
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th><input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} /></th><th>Title</th><th>Category</th><th>Status</th><th>Actions</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b">
                  <td className="p-3">{service.title}</td>
                  <td className="p-3">{service.category}</td>
                  <td className="p-3">{service.status}</td>
                  <td className="p-3">
                    <Link href={`/admin/services/${service.id}`}>
                      <Button size="sm">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
