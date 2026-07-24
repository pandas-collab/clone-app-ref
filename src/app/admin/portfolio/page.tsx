'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PortfolioManagementPage() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Portfolio Management</h1>
        <Link href="/admin/portfolio/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create New
        </Link>
      </div>
      <div className="grid gap-4">
        {portfolioItems.map((item: any) => (
          <div key={item.id} className="border p-4 rounded">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
