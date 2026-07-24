'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const dashboardItems = [
    { title: 'Services', href: '/admin/services', description: 'Manage service offerings' },
    { title: 'Portfolio', href: '/admin/portfolio', description: 'Manage portfolio items' },
    { title: 'Careers', href: '/admin/careers', description: 'Manage job postings' },
    { title: 'Applications', href: '/admin/applications', description: 'Review job applications' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
