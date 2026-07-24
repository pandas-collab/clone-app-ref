'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PortfolioManagement() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPortfolio([]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
        <Link href="/admin/portfolio/create" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Add Portfolio Item
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">No portfolio items found.</p>
        </div>
      )}
    </div>
  );
}
