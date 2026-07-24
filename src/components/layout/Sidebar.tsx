'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
  const navigation = [
export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '' },
    { name: 'Services', href: '/admin/services', icon: '' },
    { name: 'Portfolio', href: '/admin/portfolio', icon: '' },
    { name: 'Careers', href: '/admin/careers', icon: '' },
    { name: 'Applications', href: '/admin/applications', icon: '' },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      <nav className="mt-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-3 text-sm hover:bg-gray-700 ${
                isActive ? 'bg-gray-700 border-r-2 border-blue-400' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
}
}
