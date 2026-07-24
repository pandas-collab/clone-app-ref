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
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900">
                  {selectedItems.length} item(s) selected
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('published')}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('draft')}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                >
                  Draft
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Items List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                Select All ({filteredItems.length} items)
              </span>
            </div>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first portfolio item.</p>
              <div className="mt-6">
                <Link
                  href="/admin/portfolio/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Portfolio Item
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <li key={item.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {item.clientName} • {item.industry}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500 mr-2">Services:</span>
                              {item.servicesUsed.map((service, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                            <div className="flex space-x-1">
                              <Link
                                href={`/admin/portfolio/${item.id}/edit`}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                              >
                                Edit
                              </Link>
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusUpdate(item.id, e.target.value as 'published' | 'draft')}
                                className="text-xs border-gray-300 rounded"
                              >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                              </select>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
