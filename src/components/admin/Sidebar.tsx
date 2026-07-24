'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '' },
    { href: '/admin/services', label: 'Services', icon: '' },
    { href: '/admin/portfolio', label: 'Portfolio', icon: '' },
    { href: '/admin/careers', label: 'Careers', icon: '' },
    { href: '/admin/applications', label: 'Applications', icon: '' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
              pathname === item.href ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
