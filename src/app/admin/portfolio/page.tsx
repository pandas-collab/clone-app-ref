'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Sidebar from "@/components/layout/Sidebar";

interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  servicesUsed: string[];
  status: 'published' | 'draft';
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio items');
      }
      
      const data = await response.json();
      setPortfolioItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio items');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'published' | 'draft') => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setPortfolioItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      alert('Failed to update status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleBulkStatusUpdate = async (status: 'published' | 'draft') => {
    if (selectedItems.length === 0) {
      alert('Please select items to update');
      return;
    }

    try {
      const promises = selectedItems.map(id =>
        fetch(`/api/portfolio/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        })
      );

      await Promise.all(promises);
      
      setPortfolioItems(prevItems =>
        prevItems.map(item =>
          selectedItems.includes(item.id) ? { ...item, status } : item
        )
      );
      
      setSelectedItems([]);
    } catch (err) {
      alert('Failed to update items: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete portfolio item');
      }

      setPortfolioItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} portfolio item(s)?`)) {
      return;
    }

    try {
      const promises = selectedItems.map(id =>
        fetch(`/api/portfolio/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(promises);
      
      setPortfolioItems(prevItems =>
        prevItems.filter(item => !selectedItems.includes(item.id))
      );
      
      setSelectedItems([]);
    } catch (err) {
      alert('Failed to delete items: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !filterIndustry || item.industry === filterIndustry;
    const matchesService = !filterService || item.servicesUsed.includes(filterService);
    const matchesStatus = !filterStatus || item.status === filterStatus;
    
    return matchesSearch && matchesIndustry && matchesService && matchesStatus;
  });

  const industries = [...new Set(portfolioItems.map(item => item.industry))].filter(Boolean);
  const services = [...new Set(portfolioItems.flatMap(item => item.servicesUsed))].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                Admin
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Portfolio</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your portfolio items and case studies
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/admin/portfolio/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Portfolio Item
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or client..."
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                id="industry"
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                id="service"
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('published')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Publish Selected
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('draft')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Draft Selected
                </Button>
                <Button
                  size="sm"
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Industry</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-900">{item.title}</td>
                    <td className="p-3 text-gray-700">{item.clientName}</td>
                    <td className="p-3 text-gray-700">{item.industry}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Link href={`/admin/portfolio/${item.id}`}>
                          <Button size="sm">Edit</Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(
                            item.id,
                            item.status === 'published' ? 'draft' : 'published'
                          )}
                          className={item.status === 'published' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                        >
                          {item.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No portfolio items found. {portfolioItems.length === 0 ? (
                        <Link href="/admin/portfolio/create" className="text-blue-600 hover:text-blue-800">
                          Create your first portfolio item
                        </Link>
                      ) : (
                        'Try adjusting your filters.'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
