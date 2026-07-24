'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  services: number;
  portfolio: number;
  careers: number;
  applications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    portfolio: 0,
    careers: 0,
    applications: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from various endpoints
      const [servicesRes, portfolioRes, careersRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/portfolio'),
        fetch('/api/careers'),
      ]);

      const services = servicesRes.ok ? await servicesRes.json() : [];
      const portfolio = portfolioRes.ok ? await portfolioRes.json() : [];
      const careers = careersRes.ok ? await careersRes.json() : [];

      setStats({
        services: services.length || 0,
        portfolio: portfolio.length || 0,
        careers: careers.length || 0,
        applications: 0, // Would need separate endpoint
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Services</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.services}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Portfolio Items</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.portfolio}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Job Openings</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.careers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Applications</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.applications}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/services" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Manage Services</h3>
          <p className="text-gray-600">Create, edit, and delete services</p>
        </Link>
        <Link href="/admin/portfolio" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Manage Portfolio</h3>
          <p className="text-gray-600">Showcase your best work</p>
        </Link>
        <Link href="/admin/careers" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Manage Jobs</h3>
          <p className="text-gray-600">Post and manage job openings</p>
        </Link>
        <Link href="/admin/applications" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">View Applications</h3>
          <p className="text-gray-600">Review job applications</p>
        </Link>
      </div>
    </div>
  );
}
