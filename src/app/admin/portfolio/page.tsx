'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      // TODO: Fetch portfolio from API
      setPortfolio([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
        <Link
          href="/admin/portfolio/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Portfolio Item
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {portfolio.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No portfolio items found.</p>
              <Link
                href="/admin/portfolio/create"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Create your first portfolio item
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.map((item: any) => (
                <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/portfolio/${item.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
