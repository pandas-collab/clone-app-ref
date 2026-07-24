'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies: string[];
  createdAt: string;
}

export default function PortfolioManagementPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        const response = await fetch(`/api/portfolio/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setPortfolioItems(portfolioItems.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading portfolio items...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <Link
          href="/admin/portfolio/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Portfolio Item
        </Link>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No portfolio items found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Link
                    href={`/admin/portfolio/${item.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
