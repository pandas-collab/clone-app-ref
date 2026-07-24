import Sidebar from "@/components/layout/Sidebar";
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PortfolioPage() {
  const [portfolio] = useState([
  const [industryFilter, setIndustryFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');

  const filteredPortfolio = portfolio.filter(item => {
    const industryMatch = !industryFilter || item.industry === industryFilter;
    const serviceMatch = !serviceFilter || item.servicesUsed.includes(serviceFilter);
    return industryMatch && serviceMatch;
  });

  const industries = [...new Set(portfolio.map(item => item.industry))];
  const serviceTypes = [...new Set(portfolio.flatMap(item => item.servicesUsed))];
 
    { id: 1, title: 'E-commerce Platform', clientName: 'TechCorp', industry: 'Technology', status: 'published' },
    { id: 2, title: 'Mobile Banking App', clientName: 'FinanceBank', industry: 'Finance', status: 'draft' }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Portfolio Management</h1>
        <Link href="/admin/portfolio/create">
          <Button>+ Create Portfolio</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Services</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Client</th>
                <th className="text-left p-3">Industry</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.clientName}</td>
                  <td className="p-3">{item.industry}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    <Link href={`/admin/portfolio/${item.id}`}>
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
