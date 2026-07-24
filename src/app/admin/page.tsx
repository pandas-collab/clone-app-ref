'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  services: number;
  portfolio: number;
  careers: number;
  applications: number;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'service':
      return '';
    case 'portfolio':
      return '';
    case 'career':
      return '';
    case 'application':
      return '';
    default:
      return '';
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    portfolio: 0,
    careers: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch basic stats from APIs
        const [servicesRes, portfolioRes, careersRes] = await Promise.allSettled([
          fetch('/api/services'),
          fetch('/api/portfolio'),
          fetch('/api/careers')
        ]);

        const newStats: DashboardStats = {
          services: 0,
          portfolio: 0,
          careers: 0,
          applications: 0
        };

        if (servicesRes.status === 'fulfilled') {
          const servicesData = await servicesRes.value.json();
          newStats.services = servicesData.items?.length || 0;
        }

        if (portfolioRes.status === 'fulfilled') {
          const portfolioData = await portfolioRes.value.json();
          newStats.portfolio = portfolioData.items?.length || 0;
        }

        if (careersRes.status === 'fulfilled') {
          const careersData = await careersRes.value.json();
          newStats.careers = careersData.items?.length || 0;
        }

        setStats(newStats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardItems = [
    { name: 'Services', count: stats.services, href: '/admin/services', type: 'service' },
    { name: 'Portfolio', count: stats.portfolio, href: '/admin/portfolio', type: 'portfolio' },
    { name: 'Careers', count: stats.careers, href: '/admin/careers', type: 'career' },
    { name: 'Applications', count: stats.applications, href: '/admin/applications', type: 'application' }
  ];

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getIconForType(item.type)}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {item.count}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
